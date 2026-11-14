#!/usr/bin/env python3
"""
TERRA-SONIFY: Deterministic Geospatial Audio DSP Synthesis Engine
Trasforma immagini satellitari terrestri in composizioni ambient polifoniche
tramite scansione frattale di Hilbert, analisi percettiva CIELAB/Sobel
e sintesi FM quantizzata in Just Intonation.
"""

from __future__ import annotations

import argparse
import hashlib
from dataclasses import dataclass
from pathlib import Path
from typing import Tuple

import numpy as np
import soundfile as sf
from PIL import Image
from scipy import ndimage, signal


# =============================================================================
# CONFIGURAZIONE ARCHITETTURALE E PARAMETRI DSP
# =============================================================================

@dataclass(frozen=True)
class SonificationConfig:
    duration_sec: float = 45.0
    sample_rate: int = 48000
    hilbert_order: int = 7          # Griglia 2^7 x 2^7 = 128x128 (16.384 nodi spaziali)
    base_freq_hz: float = 55.0      # Fondamentale A1 (55.0 Hz) per Just Intonation
    num_events: int = 240           # Numero di macro-eventi polifonici lungo la curva
    overlap_factor: float = 4.5     # Sovrapposizione temporale media (polifonia continua)
    reverb_mix: float = 0.38        # Bilanciamento Dry/Wet del riverbero Schroeder-Moorer
    master_ceiling_db: float = -1.0 # Tetto massimo del soft-limiter in dBFS


@dataclass(frozen=True)
class SpatialFeatures1D:
    """Contenitore immutabile per le serie spaziali 1D estratte lungo la curva di Hilbert."""
    l_norm: np.ndarray      # Luminanza percettiva L* normalizzata in [0, 1]
    a_star: np.ndarray      # Canale cromatico verde-rosso a* in [-1, 1]
    b_star: np.ndarray      # Canale cromatico blu-giallo b* in [-1, 1]
    complexity: np.ndarray  # Complessità morfologica locale (Sobel + varianza) in [0, 1]
    x_norm: np.ndarray      # Coordinata spaziale orizzontale X in [0, 1] (per panning)
    y_norm: np.ndarray      # Coordinata spaziale verticale Y in [0, 1] (per profondità)


# =============================================================================
# 1. DETERMINISMO ASSOLUTO E GESTIONE DELL'IMMAGINE
# =============================================================================

def load_rgb(image_path: Path) -> np.ndarray:
    """Decode original pixels to canonical 8-bit RGB (opaque sRGB imagery)."""
    with Image.open(image_path) as image:
        return np.array(image.convert("RGB"), dtype=np.uint8)


def create_deterministic_rng(raw_pixels: np.ndarray) -> Tuple[np.random.Generator, str]:
    """
    Calcola l'hash crittografico SHA-256 del buffer binario dei pixel e istanzia
    un generatore PCG64 (numpy.random.default_rng) rigorosamente deterministico.
    """
    pixel_bytes = np.ascontiguousarray(raw_pixels).tobytes()
    sha256_hex = hashlib.sha256(pixel_bytes).hexdigest()
    # Converte i 256 bit dell'hash in un intero a precisione arbitraria per il seed
    seed_int = int(sha256_hex, 16)
    return np.random.default_rng(seed_int), sha256_hex


# =============================================================================
# 2. ATTRAVERSAMENTO SPAZIALE NON LINEARE (CURVA DI HILBERT VETTORIZZATA)
# =============================================================================

def generate_hilbert_curve_indices(order: int) -> Tuple[np.ndarray, np.ndarray]:
    """
    Genera le coordinate (x, y) della Curva di Hilbert di ordine `p` (griglia 2^p x 2^p)
    in modo completamente vettorizzato su NumPy in complessità O(p * N^2).
    Restituisce i vettori 1D `x` e `y` di lunghezza N^2.
    """
    n = 1 << order
    num_points = n * n
    d = np.arange(num_points, dtype=np.int64)
    x = np.zeros(num_points, dtype=np.int64)
    y = np.zeros(num_points, dtype=np.int64)

    t = d.copy()
    s = 1
    while s < n:
        rx = 1 & (t // 2)
        ry = 1 & (t ^ rx)

        # Rotazione/Riflessione del quadrante corrente dove ry == 0
        rot_mask = (ry == 0)
        flip_mask = rot_mask & (rx == 1)
        x[flip_mask] = s - 1 - x[flip_mask]
        y[flip_mask] = s - 1 - y[flip_mask]

        # Scambio x <-> y nei quadranti con ry == 0
        x[rot_mask], y[rot_mask] = y[rot_mask].copy(), x[rot_mask].copy()

        x += s * rx
        y += s * ry
        t //= 4
        s *= 2

    return x, y


# =============================================================================
# 3. ESTRAZIONE FEATURE PERCETTIVE (CIELAB D65) E MORFOLOGICHE (SOBEL)
# =============================================================================

def srgb_to_cielab(rgb_uint8: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Conversione analitica esatta dallo spazio sRGB (D65) allo spazio percettivamente
    uniforme CIE 1976 (L*, a*, b*).
    """
    srgb = rgb_uint8.astype(np.float64) / 255.0

    # 1. Linearizzazione inversa della curva gamma sRGB (IEC 61966-2-1)
    linear_rgb = np.where(
        srgb <= 0.04045,
        srgb / 12.92,
        np.power((srgb + 0.055) / 1.055, 2.4)
    )

    # 2. Trasformazione lineare sRGB -> CIE XYZ (Illuminante standard D65, 2 gradi)
    m_rgb_to_xyz = np.array([
        [0.4124564, 0.3575761, 0.1804375],
        [0.2126729, 0.7151522, 0.0721750],
        [0.0193339, 0.1191920, 0.9503041]
    ], dtype=np.float64)

    xyz = np.einsum("ijk,lk->ijl", linear_rgb, m_rgb_to_xyz)

    # Normalizzazione rispetto al punto di bianco di riferimento D65
    xyz_ref = np.array([0.95047, 1.00000, 1.08883], dtype=np.float64)
    xyz_norm = xyz / xyz_ref

    # 3. Funzione di trasferimento non lineare CIE f(t) con soglia delta = 6/29
    delta = 6.0 / 29.0
    delta_cubed = delta ** 3
    f_xyz = np.where(
        xyz_norm > delta_cubed,
        np.cbrt(xyz_norm),
        (xyz_norm / (3.0 * (delta ** 2))) + (4.0 / 29.0)
    )

    L_star = 116.0 * f_xyz[:, :, 1] - 16.0
    a_star = 500.0 * (f_xyz[:, :, 0] - f_xyz[:, :, 1])
    b_star = 200.0 * (f_xyz[:, :, 1] - f_xyz[:, :, 2])

    return L_star, a_star, b_star


def compute_morphological_complexity(l_star: np.ndarray, a_star: np.ndarray, b_star: np.ndarray) -> np.ndarray:
    """
    Calcola la mappa di complessità morfologica 2D combinando:
    - La magnitudine del gradiente spaziale di Sobel su L* e crominanza.
    - La deviazione standard locale su finestra 5x5 (approssimazione dell'entropia locale).
    """
    # Gradiente di Sobel su luminanza
    gx_l = ndimage.sobel(l_star, axis=1, mode="reflect")
    gy_l = ndimage.sobel(l_star, axis=0, mode="reflect")
    grad_l = np.hypot(gx_l, gy_l)

    # Gradiente cromatico (cattura transizioni costiere/vegetazione a pari luminanza)
    grad_a = np.hypot(ndimage.sobel(a_star, axis=1), ndimage.sobel(a_star, axis=0))
    grad_b = np.hypot(ndimage.sobel(b_star, axis=1), ndimage.sobel(b_star, axis=0))
    grad_c = np.hypot(grad_a, grad_b)

    # Dispersione/Rugosità locale tramite filtro uniforme su finestra 5x5
    local_mean = ndimage.uniform_filter(l_star, size=5, mode="reflect")
    local_sq_mean = ndimage.uniform_filter(l_star ** 2, size=5, mode="reflect")
    local_std = np.sqrt(np.maximum(local_sq_mean - local_mean ** 2, 0.0))

    raw_complexity = 0.60 * grad_l + 0.15 * grad_c + 0.25 * local_std

    # Compressione logaritmica morbida per evitare che singoli outlier schiaccino la dinamica
    comp_log = np.log1p(raw_complexity)
    # Fixed reference for all images.
    return np.clip(comp_log / np.log1p(200.0), 0.0, 1.0)


def extract_hilbert_features(rgb_uint8: np.ndarray, order: int) -> SpatialFeatures1D:
    """
    Estrae le mappe 2D percettive e morfologiche e le srotola lungo la curva di Hilbert 1D.
    """
    l_star, a_star, b_star = srgb_to_cielab(rgb_uint8)
    complexity_2d = compute_morphological_complexity(l_star, a_star, b_star)

    hx, hy = generate_hilbert_curve_indices(order)
    grid_max = float((1 << order) - 1)

    # Campionamento spaziale 2D -> 1D lungo il cammino(hy = riga, hx = colonna)
    l_1d = np.clip(l_star[hy, hx] / 100.0, 0.0, 1.0)
    a_1d = np.clip(a_star[hy, hx] / 100.0, -1.0, 1.0)
    b_1d = np.clip(b_star[hy, hx] / 100.0, -1.0, 1.0)
    comp_1d = complexity_2d[hy, hx]

    x_norm = hx.astype(np.float64) / grid_max
    y_norm = hy.astype(np.float64) / grid_max

    return SpatialFeatures1D(
        l_norm=l_1d,
        a_star=a_1d,
        b_star=b_1d,
        complexity=comp_1d,
        x_norm=x_norm,
        y_norm=y_norm
    )


# =============================================================================
# 4. MOTORE DI SINTESI MUSICALE (JUST INTONATION + FM + FILTRI RISONANTI)
# =============================================================================

def build_just_intonation_scale(base_freq: float) -> np.ndarray:
    """
    Costruisce una scala Lidia estesa in Just Intonation (rapporti armonici puri)
    distribuita su 4 ottave (28 gradi totali):
    Gradi per ottava: 1/1, 9/8, 5/4, 45/32 (4a eccedente Lidia), 3/2, 5/3, 15/8.
    """
    lydian_ratios = np.array([
        1.0,        # Tonica (1/1)
        9.0 / 8.0,  # Seconda maggiore (9/8)
        5.0 / 4.0,  # Terza maggiore pura (5/4)
        45.0 / 32.0,# Quarta Lidia (45/32)
        3.0 / 2.0,  # Quinta giusta pura (3/2)
        5.0 / 3.0,  # Sesta maggiore pura (5/3)
        15.0 / 8.0  # Settima maggiore pura (15/8)
    ], dtype=np.float64)

    octaves = np.array([1.0, 2.0, 4.0, 8.0], dtype=np.float64)
    scale_freqs = np.outer(octaves, lydian_ratios).ravel() * base_freq
    return scale_freqs


def map_biome_to_pitch_and_timbre(
    l_val: float,
    a_val: float,
    b_val: float,
    comp_val: float,
    scale_freqs: np.ndarray
) -> Tuple[float, float, float, float]:
    """
    Mappa le coordinate colorimetriche (L*, a*, b*) e la complessità al registro musicale:
    - Blu profondo (b* < 0, L* bassa) -> Oceani -> Ottava 0-1 (Bassi e sub-armoniche)
    - Verde/Ocra (terre emerse, vegetazione, deserti) -> Ottava 1-2 (Registro medio)
    - Bianco/Alta Luminanza (L* > 0.72, bassa saturazione) -> Nuvole/Ghiacci -> Ottava 2-3 (Cristallino)

    Restituisce:
    (carrier_freq_hz, mod_ratio_1, mod_ratio_2, sub_harmonic_gain)
    """
    chroma_sat = np.hypot(a_val, b_val)
    chroma_angle = (np.arctan2(b_val, a_val) + np.pi) / (2.0 * np.pi)  # [0, 1]

    # Classificazione continua del bioma per la selezione dell'ottava
    if l_val > 0.72 and chroma_sat < 0.22:
        # Nuvole ad alta quota / Calotte glaciali -> Ottave alte (indici 14..27)
        register_offset = 14
        register_span = 13
        mod_ratio_1 = 2.0
        mod_ratio_2 = 4.0
        sub_gain = 0.05
    elif b_val < -0.04 and l_val < 0.55:
        # Oceani e bacini idrici profondi -> Ottave basse (indici 0..10)
        register_offset = 0
        register_span = 10
        mod_ratio_1 = 1.0
        mod_ratio_2 = 2.0
        sub_gain = 0.55
    else:
        # Terre emerse (foreste, deserti, catene montuose) -> Registro centrale (indici 7..20)
        register_offset = 7
        register_span = 13
        mod_ratio_1 = 1.0
        mod_ratio_2 = 3.0 if a_val > 0.0 else 2.0
        sub_gain = 0.20

    # Selezione deterministica del grado della scala tramite combinazione di angolo cromatico e L*
    degree_norm = 0.65 * chroma_angle + 0.35 * l_val
    scale_idx = int(np.clip(
        register_offset + np.round(degree_norm * register_span),
        0,
        len(scale_freqs) - 1
    ))

    carrier_freq = float(scale_freqs[scale_idx])
    return carrier_freq, mod_ratio_1, mod_ratio_2, sub_gain


def synthesize_polyphonic_hilbert_stream(
    features: SpatialFeatures1D,
    config: SonificationConfig,
    rng: np.random.Generator
) -> np.ndarray:
    """
    Sintetizza il flusso polifonico stereo integrando:
    1. Voci FM a rapporti armonici interi con inviluppo di crossfade ad alto overlap (OLA).
    2. Filtraggio passa-basso risonante (Butterworth 2° ordine + picco risonante) guidato da Sobel.
    3. Drone sub-armonico continuo modulato dalle macro-regioni della curva di Hilbert.
    """
    total_samples = int(round(config.duration_sec * config.sample_rate))
    stereo_out = np.zeros((total_samples, 2), dtype=np.float64)

    scale_freqs = build_just_intonation_scale(config.base_freq_hz)
    num_nodes = len(features.l_norm)

    # Suddivisione della sequenza 1D di Hilbert in `num_events` segmenti spaziali contigui
    node_edges = np.linspace(0, num_nodes, config.num_events + 1, dtype=np.int64)

    hop_samples = total_samples / float(config.num_events)
    grain_samples = int(round(hop_samples * config.overlap_factor))
    grain_samples = max(grain_samples, int(0.4 * config.sample_rate))

    # Inviluppo asimmetrico morbido (attacco 35%, sostegno morbido, rilascio 65% tipo Blackman-Harris)
    env_t = np.linspace(0.0, 1.0, grain_samples, endpoint=False)
    attack_split = 0.35
    envelope = np.where(
        env_t < attack_split,
        0.5 * (1.0 - np.cos(np.pi * env_t / attack_split)),
        0.5 * (1.0 + np.cos(np.pi * (env_t - attack_split) / (1.0 - attack_split)))
    ) ** 1.25

    t_vec = np.arange(grain_samples, dtype=np.float64) / float(config.sample_rate)

    for k in range(config.num_events):
        i_start, i_end = node_edges[k], node_edges[k + 1]
        if i_end <= i_start:
            continue

        # Statistiche locali del segmento di Hilbert corrente
        l_seg = float(np.mean(features.l_norm[i_start:i_end]))
        a_seg = float(np.mean(features.a_star[i_start:i_end]))
        b_seg = float(np.mean(features.b_star[i_start:i_end]))
        c_seg = float(np.mean(features.complexity[i_start:i_end]))
        x_seg = float(np.mean(features.x_norm[i_start:i_end]))
        y_seg = float(np.mean(features.y_norm[i_start:i_end]))

        f_c, ratio_1, ratio_2, sub_gain = map_biome_to_pitch_and_timbre(
            l_seg, a_seg, b_seg, c_seg, scale_freqs
        )

        # Fasi iniziali pseudo-casuali controllate dal seed dell'immagine (evita somme coerenti aspre)
        phi_c = rng.uniform(0.0, 2.0 * np.pi)
        phi_m1 = rng.uniform(0.0, 2.0 * np.pi)
        phi_m2 = rng.uniform(0.0, 2.0 * np.pi)
        phi_sub = rng.uniform(0.0, 2.0 * np.pi)

        f_carrier = f_c  # Exact pitch on the just-intonation scale.


        # Indice di modulazione FM guidato dal gradiente morfologico di Sobel
        # Zone piatte (oceani/deserti) -> beta ~ 0.12 (quasi sinusoidale)
        # Zone frastagliate (montagne/cicloni) -> beta ~ 2.40 (ricco spettro armonico)
        beta_1 = 0.10 + 2.15 * (c_seg ** 1.35)
        beta_2 = 0.05 + 1.10 * (c_seg ** 1.70)

        # Inviluppo dell'indice di modulazione (il timbro si apre al centro della nota)
        mod_env = np.sin(np.pi * env_t) ** 0.8

        mod_1 = beta_1 * mod_env * np.sin(2.0 * np.pi * (f_carrier * ratio_1) * t_vec + phi_m1)
        mod_2 = beta_2 * mod_env * np.sin(2.0 * np.pi * (f_carrier * ratio_2) * t_vec + phi_m2)

        # Sintesi FM a doppia modulante armonica + fondamentale sub-ottava
        carrier = np.sin(2.0 * np.pi * f_carrier * t_vec + mod_1 + mod_2 + phi_c)
        sub_osc = sub_gain * np.sin(2.0 * np.pi * (0.5 * f_carrier) * t_vec + phi_sub)
        voice_sig = (carrier + sub_osc) / (1.0 + sub_gain)

        # Filtro passa-basso risonante (2° ordine con Q variabile) guidato dalla complessità
        cutoff_hz = np.clip(
            f_carrier * (1.8 + 10.5 * (c_seg ** 1.1) + 2.5 * l_seg),
            120.0,
            0.42 * config.sample_rate
        )
        q_factor = 0.707 + 2.2 * (c_seg ** 1.5)  # Risonanza più pronunciata su creste montuose
        w0 = 2.0 * np.pi * cutoff_hz / config.sample_rate
        alpha = np.sin(w0) / (2.0 * q_factor)
        cos_w0 = np.cos(w0)

        b0 = (1.0 - cos_w0) * 0.5
        b1 = 1.0 - cos_w0
        b2 = (1.0 - cos_w0) * 0.5
        a0 = 1.0 + alpha
        a1 = -2.0 * cos_w0
        a2 = 1.0 - alpha

        sos_lp = np.array([[b0 / a0, b1 / a0, b2 / a0, 1.0, a1 / a0, a2 / a0]], dtype=np.float64)
        voice_filtered = signal.sosfilt(sos_lp, voice_sig)

        # Dinamica basata su L* (con compensazione di equal-loudness approssimata per le alte frequenze)
        freq_comp = (config.base_freq_hz / max(f_carrier, config.base_freq_hz)) ** 0.28
        amp = (0.18 + 0.82 * (l_seg ** 0.85)) * freq_comp
        # Attenuazione morbida basata sulla coordinata Y (effetto prospettico nord-sud)
        depth_atten = 0.75 + 0.25 * (1.0 - y_seg)

        grain_mono = voice_filtered * envelope * amp * depth_atten

        # Panning stereo a potenza costante (Constant-Power Panning) derivato da X di Hilbert
        # Manteniamo il panning nel range [0.12, 0.88] per preservare la coesione centrale
        pan_pos = 0.12 + 0.76 * x_seg
        pan_angle = pan_pos * (np.pi * 0.5)
        gain_l = np.cos(pan_angle)
        gain_r = np.sin(pan_angle)

        start_idx = int(round(k * hop_samples))
        end_idx = min(start_idx + grain_samples, total_samples)
        valid_len = end_idx - start_idx

        if valid_len > 0:
            stereo_out[start_idx:end_idx, 0] += grain_mono[:valid_len] * gain_l
            stereo_out[start_idx:end_idx, 1] += grain_mono[:valid_len] * gain_r

    # Aggiunta di un tappeto sub-armonico continuo (Fondamentale + Quinta) modulato da L* globale
    t_full = np.arange(total_samples, dtype=np.float64) / float(config.sample_rate)
    l_smooth = np.interp(
        np.linspace(0.0, 1.0, total_samples),
        np.linspace(0.0, 1.0, num_nodes),
        features.l_norm
    )
    # Filtro passa-basso sul controllo di luminanza per un respiro lentissimo
    sos_ctrl = signal.butter(2, 0.4 / (0.5 * config.sample_rate), btype="low", output="sos")
    l_breath = np.clip(signal.sosfiltfilt(sos_ctrl, l_smooth), 0.1, 1.0)

    drone_f0 = config.base_freq_hz
    drone_l = 0.08 * l_breath * (
        np.sin(2.0 * np.pi * drone_f0 * t_full) +
        0.5 * np.sin(2.0 * np.pi * (1.5 * drone_f0) * t_full + 0.7)
    )
    drone_r = 0.08 * l_breath * (
        np.sin(2.0 * np.pi * drone_f0 * t_full + 0.15) +
        0.5 * np.sin(2.0 * np.pi * (1.5 * drone_f0) * t_full + 1.1)
    )
    stereo_out[:, 0] += drone_l
    stereo_out[:, 1] += drone_r

    return stereo_out


# =============================================================================
# 5. SPATIAL DSP POST-PROCESSING: RIVERBERO SCHROEDER-MOORER E SOFT LIMITER
# =============================================================================

def apply_damped_comb_filter(x: np.ndarray, delay_samples: int, feedback: float, damping: float) -> np.ndarray:
    """
    Implementa un filtro Comb con low-pass one-pole nell'anello di retroazione (Moorer/Freeverb)
    tramite funzione di trasferimento razionale esatta H(z) eseguita in C da `scipy.signal.lfilter`:
        H(z) = (1 - d * z^-1) / (1 - d * z^-1 - g * (1 - d) * z^-M)
    """
    # Process one delay line at a time. Each block depends only on the previous one.
    out = np.empty_like(x)
    previous = np.zeros(delay_samples)
    state = np.zeros(1)
    for start in range(0, len(x), delay_samples):
        block = x[start:start + delay_samples]
        y = block + feedback * previous[:len(block)]
        out[start:start + len(block)] = y
        previous, state = signal.lfilter([1.0 - damping], [1.0, -damping], y, zi=state)
    return out


def apply_schroeder_allpass(x: np.ndarray, delay_samples: int, gain: float) -> np.ndarray:
    """
    Implementa un diffusore All-Pass di Schroeder in forma polinomiale IIR:
        H(z) = (-g + z^-M) / (1 - g * z^-M)
    """
    out = np.empty_like(x)
    previous = np.zeros(delay_samples)
    for start in range(0, len(x), delay_samples):
        block = x[start:start + delay_samples]
        y = previous[:len(block)] - gain * block
        out[start:start + len(block)] = y
        previous = block + gain * y
    return out


def apply_stereo_reverb(stereo_in: np.ndarray, sample_rate: int, wet_mix: float) -> np.ndarray:
    """
    Rete di riverberazione algoritmica stereo stile Freeverb/Moorer:
    - 8 filtri Comb paralleli per canale (con smorzamento HF e decorrelazione stereo).
    - 4 filtri All-Pass in serie per canale per densificare la coda diffusiva.
    """
    scale_sr = sample_rate / 44100.0

    # Tempi di ritardo mutualmente primi (in campioni @ 44.1kHz, scalati a `sample_rate`)
    comb_tunings_l = [int(round(m * scale_sr)) for m in (1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617)]
    stereo_spread = int(round(23 * scale_sr))
    comb_tunings_r = [m + stereo_spread for m in comb_tunings_l]

    allpass_tunings_l = [int(round(m * scale_sr)) for m in (556, 441, 341, 225)]
    allpass_tunings_r = [m + stereo_spread for m in allpass_tunings_l]

    feedback = 0.86
    damping = 0.32
    allpass_gain = 0.5

    # Leggero cross-feed in ingresso al riverbero per coesione spaziale
    in_l = 0.75 * stereo_in[:, 0] + 0.25 * stereo_in[:, 1]
    in_r = 0.75 * stereo_in[:, 1] + 0.25 * stereo_in[:, 0]

    # Banco parallelo di 8 filtri Comb smorzati
    wet_l = np.zeros_like(in_l)
    wet_r = np.zeros_like(in_r)
    for m_l, m_r in zip(comb_tunings_l, comb_tunings_r):
        wet_l += apply_damped_comb_filter(in_l, m_l, feedback, damping)
        wet_r += apply_damped_comb_filter(in_r, m_r, feedback, damping)

    wet_l /= len(comb_tunings_l)
    wet_r /= len(comb_tunings_r)

    # Cascata serie di 4 diffusori All-Pass
    for ap_l, ap_r in zip(allpass_tunings_l, allpass_tunings_r):
        wet_l = apply_schroeder_allpass(wet_l, ap_l, allpass_gain)
        wet_r = apply_schroeder_allpass(wet_r, ap_r, allpass_gain)

    # Filtro passa-alto a 65 Hz sulla sola componente Wet per evitare accumulo fangoso sui sub-bassi
    sos_hp_wet = signal.butter(2, 65.0 / (0.5 * sample_rate), btype="high", output="sos")
    wet_l = signal.sosfilt(sos_hp_wet, wet_l)
    wet_r = signal.sosfilt(sos_hp_wet, wet_r)

    wet_stereo = np.column_stack((wet_l, wet_r))
    return (1.0 - wet_mix) * stereo_in + wet_mix * wet_stereo


def master_and_limit(stereo_sig: np.ndarray, sample_rate: int, ceiling_db: float) -> np.ndarray:
    """
    Catena di mastering finale:
    1. Rimozione DC offset (Butterworth 4° ordine passa-alto @ 18 Hz a fase zero).
    2. Fade-in e Fade-out cosenoidali morbidi (1.8 s) per eliminare qualsiasi transiente ai bordi.
    3. Guadagno fisso e limitatore tanh calibrato a `ceiling_db`.
    """
    # 1. DC Blocker a fase zero
    sos_dc = signal.butter(4, 18.0 / (0.5 * sample_rate), btype="high", output="sos")
    cleaned = signal.sosfiltfilt(sos_dc, stereo_sig, axis=0)

    # 2. Inviluppo di fade-in / fade-out globale
    n_samples = cleaned.shape[0]
    fade_len = min(int(1.8 * sample_rate), n_samples // 4)
    fade_in = 0.5 * (1.0 - np.cos(np.pi * np.arange(fade_len) / float(fade_len)))
    fade_out = 0.5 * (1.0 + np.cos(np.pi * np.arange(fade_len) / float(fade_len)))

    cleaned[:fade_len, 0] *= fade_in
    cleaned[:fade_len, 1] *= fade_in
    cleaned[-fade_len:, 0] *= fade_out
    cleaned[-fade_len:, 1] *= fade_out

    # Common mastering for all images preserves luminance differences across scenes.
    ceiling_lin = 10.0 ** (ceiling_db / 20.0)
    limited = ceiling_lin * np.tanh(1.70 * cleaned)


    return limited


# =============================================================================
# PIPELINE PRINCIPALE E GENERATORE SINTETICO DI TEST
# =============================================================================




def sonify_satellite_image(
    image_path: Path,
    output_wav_path: Path,
    config: SonificationConfig = SonificationConfig()
) -> str:
    """
    Esegue l'intera pipeline deterministica da immagine satellitare a file WAV 24-bit.
    Restituisce l'hash SHA-256 utilizzato come seed crittografico.
    """
    if not 1 <= config.hilbert_order <= 10:
        raise ValueError("Ordine Hilbert ammesso: da 1 a 10.")
    if not 16000 <= config.sample_rate <= 192000:
        raise ValueError("Campionamento ammesso: 16000–192000 Hz.")
    if not np.isfinite(config.duration_sec) or config.duration_sec < 0.1:
        raise ValueError("La durata deve essere finita e almeno 0,1 s.")
    if image_path.resolve() == output_wav_path.resolve():
        raise ValueError("Ingresso e uscita devono essere file diversi.")
    grid_size = 1 << config.hilbert_order
    raw_pixels = load_rgb(image_path)
    rng, sha256_hex = create_deterministic_rng(raw_pixels)

    grid = Image.fromarray(raw_pixels).resize((grid_size, grid_size), Image.Resampling.LANCZOS)
    features = extract_hilbert_features(np.asarray(grid), config.hilbert_order)
    dry_stereo = synthesize_polyphonic_hilbert_stream(features, config, rng)
    wet_stereo = apply_stereo_reverb(dry_stereo, config.sample_rate, config.reverb_mix)
    master_stereo = master_and_limit(wet_stereo, config.sample_rate, config.master_ceiling_db)

    sf.write(
        file=str(output_wav_path),
        data=master_stereo,
        samplerate=config.sample_rate,
        format="WAV", subtype="PCM_24"
    )
    return sha256_hex


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Sonificazione deterministica di immagini satellitari tramite Curva di Hilbert e sintesi FM."
    )
    parser.add_argument("-i", "--input", type=Path, required=True,
                        help="Immagine satellitare RGB in ingresso.")
    parser.add_argument("-o", "--output", type=Path, default=Path("earth_sonification.wav"),
                        help="Percorso del file audio WAV 24-bit generato.")
    parser.add_argument("-d", "--duration", type=float, default=45.0,
                        help="Durata complessiva della composizione in secondi (default: 45.0).")
    parser.add_argument("-r", "--samplerate", type=int, default=48000,
                        help="Frequenza di campionamento in Hz (default: 48000).")
    parser.add_argument("-p", "--order", type=int, default=7,
                        help="Ordine p della curva di Hilbert (griglia 2^p x 2^p, default: 7 -> 128x128).")
    args = parser.parse_args()

    if not args.input.is_file():
        parser.error(f"Immagine non trovata: {args.input}")


    config = SonificationConfig(
        duration_sec=args.duration,
        sample_rate=args.samplerate,
        hilbert_order=args.order
    )

    print(f"[DSP] Avvio analisi spaziale (Hilbert 2^{config.hilbert_order}x2^{config.hilbert_order}) e sintesi FM...")
    sha256_seed = sonify_satellite_image(args.input, args.output, config)
    print(f"[OK]  SHA-256 Seed deterministico : {sha256_seed}")
    print(f"[OK]  File esportato con successo : {args.output} ({config.sample_rate} Hz, 24-bit PCM, {config.duration_sec}s)")


# Mapping in breve: lungo H(k) si mediano L*, a*, b* e i gradienti Sobel.
# Il colore sceglie il registro e il grado j. La fondamentale è 55 * 2**o * r[j],
# con r uguale ai sette rapporti lidi. L* controlla l'ampiezza, il gradiente
# controlla l'indice FM; per la posizione x si usano i guadagni cos(theta),
# sin(theta), theta = (0.12 + 0.76*x) * pi/2. I colori sono indizi visivi.
if __name__ == "__main__":
    main()