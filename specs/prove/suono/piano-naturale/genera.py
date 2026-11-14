"""Two 15-second arrangements from the actual engines' Hilbert scores."""
from pathlib import Path
import json
import subprocess
import sys

import numpy as np
import soundfile as sf
from PIL import Image
from scipy import signal

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "terra-sonify"))
import terra_sonify as terra

RATE, SECONDS = 48000, 15
KEYS = {"A2": 45, "C3": 48, "A3": 57, "C4": 60, "A4": 69, "C5": 72}


def terra_score():
    image = HERE.parent / "cinque-flauti/fuji-2021.jpg"
    rgb = terra.load_rgb(image)
    grid = Image.fromarray(rgb).resize((128, 128), Image.Resampling.LANCZOS)
    f = terra.extract_hilbert_features(np.asarray(grid), 7)
    scale = terra.build_just_intonation_scale(55)
    score = []
    for event in range(80):
        # Match the edges of the original 80-event renderer exactly.
        lo, hi = event*16384//80, (event+1)*16384//80
        l, a, b, c, x = [float(np.mean(v[lo:hi])) for v in
                         (f.l_norm, f.a_star, f.b_star, f.complexity, f.x_norm)]
        hz, *_ = terra.map_biome_to_pitch_and_timbre(l, a, b, c, scale)
        score.append([hz, l, c, x])
    return np.array(score)


def phrase(score):
    """Debounce the median pitch; avoid repeated attacks for stationary regions."""
    stride = SECONDS / len(score)
    events = []
    for i in range(len(score)):
        # ~0.4 s around the current point, independent of the engine's analysis rate.
        rad = max(1, round(0.2 / stride))
        local = score[max(0, i-rad):i+rad+1]
        hz = sorted(local[:, 0])[len(local)//2]
        when = i*stride
        if events:
            last, previous_hz, *_ = events[-1]
            elapsed = when-last
            if elapsed < 0.88 or (abs(12*np.log2(hz/previous_hz)) < 1.15 and elapsed < 2.30):
                continue
        if when > SECONDS-0.75:
            break
        events.append((when, hz, float(local[:, 1].mean()), float(local[:, 3].mean())))
    return events


def render(events, bank):
    mix = np.zeros((RATE*SECONDS, 2))
    for i, (when, hz, brightness, x) in enumerate(events):
        onset = round(when*RATE)
        end = events[i+1][0] if i+1 < len(events) else SECONDS
        hold = min(1.9, end-when)
        length = min(len(mix)-onset, round((hold+0.40)*RATE))
        key = min(KEYS, key=lambda k: abs(KEYS[k]-(69+12*np.log2(hz/440))))
        source = bank[key]
        root = 440*2**((KEYS[key]-69)/12)
        t = np.arange(length)/RATE
        at = np.arange(length)*hz/root
        chunk = np.column_stack([np.interp(at, np.arange(len(source)), channel)
                                 for channel in source.T])
        release = np.clip((t-hold)/0.4, 0, 1)
        env = (0.5+0.5*np.cos(np.pi*release)) * np.minimum(1, t/0.008)
        pan = (0.35+0.30*x)*np.pi/2
        mix[onset:onset+length] += chunk * env[:, None] * (0.36+0.64*brightness) * [np.cos(pan),np.sin(pan)]
    fade = np.linspace(1, 0, round(0.4*RATE))
    mix[-len(fade):] *= fade[:, None]
    return mix


def levels(audio):
    args = ['ffmpeg','-nostats','-hide_banner','-f','f32le','-ar',str(RATE),
            '-ac','2','-i','pipe:0','-af','loudnorm=print_format=json','-f','null','-']
    log = subprocess.run(args,input=audio.astype('<f4').tobytes(),
                         capture_output=True,check=True).stderr.decode()
    report, _ = json.JSONDecoder().raw_decode(log[log.rfind('{'):])
    return float(report['input_i']), float(report['input_tp'])


if __name__ == '__main__':
    bank = {}
    for key in KEYS:
        src, rate = sf.read(HERE / 'campioni' / (key+'v3.flac'), frames=RATE*5)
        assert rate == RATE
        bank[key] = signal.sosfilt(signal.butter(2, 28, 'highpass', fs=RATE, output='sos'),
                                   src, axis=0)
    scores = {'a-simulatore': np.array(json.loads((HERE/'fuji-simulatore.json').read_text())),
              'b-terra-sonify': terra_score()}
    mixes = {}
    for name, score in scores.items():
        events = phrase(score)
        mixes[name] = render(events,bank)
        print(name, len(events), 'attacchi')
    original, sr = sf.read(HERE.parent/'confronto-simulatore/b-terra-sonify.wav')
    assert sr == RATE
    mixes['riferimento-terra-sonify'] = original
    meters = {name: levels(mix) for name,mix in mixes.items()}
    # Static gain only. Leave a minimum of 1.5 dB of true-peak headroom.
    target = min([-20.0]+[loud-peak-1.5 for loud,peak in meters.values()])
    for name, mix in mixes.items():
        audio = mix * 10**((target-meters[name][0])/20)
        out = HERE/(name+'.wav')
        sf.write(out,audio,RATE,subtype='PCM_24')
        decoded, rate = sf.read(out)
        measured, peak = levels(decoded)
        assert abs(measured-target)<0.15 and peak < -1.2
        assert rate==RATE and decoded.shape==(SECONDS*RATE,2)
        print(name,measured,'LUFS',peak,'dBTP')
