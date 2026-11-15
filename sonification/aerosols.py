"""Schedule recorded coughs from GEOS smoke display coverage."""
import subprocess

import numpy as np
from scipy import signal

from common import COUNT, RATE, features, sample_path


COUGHS = [
    ('cough-1.ogg', 1.39, 1.92),
    ('cough-2.ogg', 2.44, 3.58),
    ('cough-1.ogg', 3.66, 4.84),
    ('cough-1.ogg', 7.36, 8.08),
    ('cough-2.ogg', .40, .98),
    ('cough-1.ogg', 9.38, 9.98),
    ('cough-1.ogg', 13.60, 14.36),
    ('cough-2.ogg', 4.63, 5.41),
    ('cough-1.ogg', 15.78, 16.85),
]


def decode(name):
    path = sample_path(name)
    # Wikimedia OGGs contain a data stream as well as Vorbis. Explicitly map audio.
    run = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-map', '0:a:0', '-vn',
                          '-f', 'f32le', '-ar', str(RATE), '-ac', '1', 'pipe:1'],
                         capture_output=True, check=True)
    data = np.frombuffer(run.stdout, dtype='<f4').astype(float)
    return signal.sosfilt(signal.butter(2, 65, 'highpass', fs=RATE, output='sos'), data)


def image_controls(crop):
    coverage, smoke, details = features(crop, 'aerosols')
    # Same orange/red smoke mask as preceding image studies. This is display
    # area coverage, not a surface PM2.5 concentration or a medical severity score.
    smoke_evidence = np.clip(smoke / .65, 0, 1)
    score = float(smoke_evidence.mean())
    if details['smokeColourFraction'] <= 0:
        raise ValueError('No smoke-coloured evidence: do not assign this cough scene.')
    groups = int(np.clip(3 + np.rint(12 * score), 3, 14))
    cumulative = np.cumsum(.10 + smoke_evidence)
    quantiles = np.linspace(.02, .98, groups)
    requested = np.interp(quantiles * cumulative[-1], cumulative, np.arange(COUNT)) / RATE
    return smoke_evidence, requested, dict(**details, meanSmokeDisplayProxy=score,
                                          requestedCoughGroups=groups,
                                          requestedOnsetsSeconds=requested.tolist())


def render(crop, sources):
    smoke, requested, image = image_controls(crop)
    cough_track = np.zeros(COUNT)
    events = []
    choices = [COUGHS[i % len(COUGHS)] for i in range(len(requested))]
    sizes = [round(last * RATE) - round(first * RATE) for _, first, last in choices]
    intro, outro, minimum_gap = round(.18 * RATE), round(.30 * RATE), round(.12 * RATE)
    available_gaps = COUNT - intro - outro - sum(sizes)
    assert available_gaps >= minimum_gap * (len(choices) - 1)
    # Fit every native-length gesture. Residual space follows the image quantile
    # distances, so stronger smoke regions receive closer, irregular coughs.
    weights = np.diff(requested)
    weights /= weights.sum()
    extra = available_gaps - minimum_gap * len(weights)
    gaps = minimum_gap + np.floor(extra * weights).astype(int)
    gaps[-1] += available_gaps - int(gaps.sum())
    at = intro
    for index, choice in enumerate(choices):
        file, first, last = choice
        cough = sources[file][round(first * RATE):round(last * RATE)].copy()
        size = len(cough)
        onset = at / RATE
        strength = float(smoke[at])
        cough *= (.32 + .16 * strength) / max(float(np.abs(cough).max()), 1e-12)
        edge = round(.025 * RATE)
        cough[:edge] *= np.linspace(0, 1, edge)
        cough[-round(.08 * RATE):] *= np.linspace(1, 0, round(.08 * RATE))
        cough_track[at:at + size] += cough
        events.append(dict(source=file, sourceExcerptSeconds=[first, last], startSeconds=onset,
                           durationSeconds=size / RATE, smokeDisplayProxy=strength))
        at += size
        if index < len(gaps):
            at += int(gaps[index])
    mono = cough_track
    t = np.arange(COUNT) / RATE
    mono *= np.minimum(1, t / .15) * np.minimum(1, (15 - t) / .45)
    return np.column_stack([mono, mono]), dict(**image, coughEvents=events,
                                              betweenGroupPauseSeconds=(gaps / RATE).tolist(),
                                              distinctSourceGestures=len(set(choices)),
                                              breathingLayer=False, backgroundLayer=False)
