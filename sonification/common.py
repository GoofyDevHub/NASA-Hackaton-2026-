"""Shared image features, sample integrity and PCM output for the selected tracks."""
from pathlib import Path
import colorsys
import hashlib
import io
import json
import subprocess

import numpy as np
from scipy import ndimage
import soundfile as sf

ROOT = Path(__file__).resolve().parent
IMAGES = ROOT.parent / "assets/images"
SAMPLES = ROOT / "samples"
RATE = 48000
COUNT = 15 * RATE


def sample_path(name):
    path = SAMPLES / name
    info = json.loads((SAMPLES / "sources.json").read_text(encoding="utf8"))
    if hashlib.sha256(path.read_bytes()).hexdigest() != info["files"][name]["sha256"]:
        raise ValueError(f"Sample checksum mismatch for {name}")
    return path


def spatial_profile(values, mask):
    """Average valid feature pixels in columns, then scan left to right.

    The scan is spatial, not a replay of physical time. Missing columns
    interpolate between observations while validity controls audible gain.
    """
    weights = mask.sum(axis=0).astype(float)
    sums = np.where(mask, values, 0).sum(axis=0)
    valid = weights > 0
    if not valid.any():
        raise ValueError("Selected region has no qualifying feature pixels.")
    columns = np.arange(mask.shape[1])
    mean = np.interp(columns, columns[valid], sums[valid] / weights[valid])
    return ndimage.gaussian_filter1d(mean, 2), mask.mean(axis=0)


def expand(profile):
    """Smooth spatial measurements onto the fixed audio clock."""
    return np.interp(
        np.linspace(0, 1, COUNT),
        np.linspace(0, 1, len(profile)),
        ndimage.gaussian_filter1d(profile.astype(float), 2),
    )


def pcm_bytes(audio):
    output = io.BytesIO()
    sf.write(output, audio, RATE, subtype="PCM_24", format="WAV")
    return output.getvalue()


def sustain(sample, source_hz, pitch):
    """Crossfade the recorded sustain region with a smooth variable-rate read."""
    recording = sample[int(0.65 * RATE):-int(0.55 * RATE)]
    crossfade = int(0.5 * RATE)
    period = len(recording) - crossfade
    assert period > crossfade
    at = np.remainder(np.cumsum(np.broadcast_to(pitch, COUNT) / source_hz), period)
    current = np.interp(at, np.arange(len(recording)), recording)
    previous = np.interp(at + period, np.arange(len(recording)), recording)
    blend = np.clip(at / crossfade, 0, 1)
    blend = 0.5 - 0.5 * np.cos(np.pi * blend)
    return blend * current + (1 - blend) * previous


def meter(audio):
    run = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-f", "f32le", "-ar", str(RATE),
         "-ac", "2", "-i", "pipe:0", "-af", "loudnorm=print_format=json", "-f", "null", "-"],
        input=audio.astype("<f4").tobytes(), capture_output=True, check=True,
    )
    log = run.stderr.decode()
    result = json.JSONDecoder().raw_decode(log[log.rfind("{"):])[0]
    return float(result["input_i"]), float(result["input_tp"])


def features(crop, theme):
    rgb = np.asarray(crop, dtype=float) / 255
    hsv = np.asarray([colorsys.rgb_to_hsv(*pixel) for pixel in rgb.reshape(-1, 3)])
    hue, sat, value = hsv.reshape(rgb.shape).transpose(2, 0, 1)
    if theme == "ocean":
        mask = (sat > .45) & (value > .12) & (hue < .78)
        warmth = 1 - np.clip(hue / (2 / 3), 0, 1)
        profile, coverage = spatial_profile(warmth, mask)
        return expand(profile), expand(coverage), dict(colouredPixelFraction=float(mask.mean()))
    mask = (sat > .32) & (value > .16)
    smoke = mask & ((hue < .095) | (hue > .96))
    return (expand(mask.mean(axis=0)), expand(smoke.mean(axis=0)),
            dict(colouredPixelFraction=float(mask.mean()), smokeColourFraction=float(smoke.mean())))
