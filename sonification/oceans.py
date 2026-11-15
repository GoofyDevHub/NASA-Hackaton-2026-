"""Use real sung vowels and retain the approved phrase-level temperature-colour mappings."""
import math
import subprocess

import numpy as np
from scipy import signal
import soundfile as sf

from common import COUNT, RATE, features, sample_path


def source_pitch(recording, bounds):
    """Estimate median fundamental from voiced autocorrelation frames.

    Select the earliest near-maximum peak, then use parabolic interpolation to
    avoid integer-lag pitch quantization. Trimmed sustains exclude note changes.
    """
    x = signal.resample_poly(recording, 1, 3)
    rate = RATE / 3
    minimum = round(rate / bounds[1])
    maximum = round(rate / bounds[0])
    pitches = []
    for start in range(0, len(x) - 2400, 1600):
        frame = x[start:start + 2400].copy()
        frame -= frame.mean()
        ac = signal.correlate(frame, frame, mode='full', method='fft')[len(frame) - 1:]
        ac /= max(ac[0], 1e-12)
        peaks, _ = signal.find_peaks(ac[minimum:maximum])
        peaks += minimum
        if not len(peaks):
            continue
        candidates = peaks[ac[peaks] >= .92 * ac[peaks].max()]
        lag = int(candidates[0])
        if ac[lag] < .70:
            continue
        left, center, right = ac[lag - 1:lag + 2]
        correction = .5 * (left - right) / (left - 2 * center + right)
        pitches.append(rate / (lag + correction))
    if len(pitches) < 3:
        raise ValueError('No stable voiced source-pitch estimate.')
    return float(np.median(pitches))


PHRASE_SECONDS = 3.35


STARTS = [.15, 3.85, 7.55, 11.25]
SOPRANO_TAKES = [('f1_long_messa_a.wav', 4.35, 8.6),
 ('f1_long_forte_a.wav', 4.15, 7.35),
 ('f1_long_straight_a.wav', 4.1, 7.0),
 ('f1_long_messa_a.wav', 4.35, 8.6)]


def recorded_phrase(take):
    name, start, end = take
    path = sample_path(name)
    data, rate = sf.read(path)
    if data.ndim > 1:
        data = data.mean(axis=1)
    data = data[round(start * rate):round(end * rate)]
    divisor = math.gcd(rate, RATE)
    data = signal.resample_poly(data, RATE // divisor, rate // divisor)
    data = signal.sosfilt(signal.butter(2, 35, 'highpass', fs=RATE, output='sos'), data)
    middle = data[round(.25 * len(data)):round(.75 * len(data))]
    root = source_pitch(middle, [350, 700])
    return data, root


def preserve_voice(data, semitones):
    tempo = len(data) / (RATE * PHRASE_SECONDS)
    assert .8 <= tempo <= 1.3, tempo
    ratio = 2 ** (semitones / 12)
    if abs(semitones) < .1:
        # Below ten cents retain the original pitch. Avoiding unnecessary formant
        # processing also removes an observed startup spike near unity shift.
        options = f'atempo={tempo:.12f}'
    else:
        options = (f'rubberband=tempo={tempo:.12f}:pitch={ratio:.12f}'
                   ':formant=preserved:transients=smooth:detector=soft'
                   ':phase=laminar:window=long:smoothing=on:pitchq=quality')
    run = subprocess.run(
        ['ffmpeg', '-v', 'error', '-threads', '1', '-filter_threads', '1',
         '-f', 'f32le', '-ar', str(RATE), '-ac', '1', '-i', 'pipe:0',
         '-af', options, '-f', 'f32le', '-ar', str(RATE), '-ac', '1', 'pipe:1'],
        input=data.astype('<f4').tobytes(), capture_output=True, check=True)
    result = np.frombuffer(run.stdout, dtype='<f4').astype(float)
    wanted = round(PHRASE_SECONDS * RATE)
    assert abs(len(result) - wanted) < .2 * RATE
    result = np.pad(result, (0, max(0, wanted - len(result))))[:wanted]
    # Edits happen around whole takes, not repeated waveform cycles.
    attack = round(.025 * RATE)
    release = round(.10 * RATE)
    result[:attack] *= np.linspace(0, 1, attack)
    result[-release:] *= np.linspace(1, 0, release)
    assert np.max(np.abs(result)) < max(2 * np.max(np.abs(data)), .001), (
        'Unexpected processed-phrase transient', semitones,
        float(np.max(np.abs(data))), float(np.max(np.abs(result))),
        float(np.argmax(np.abs(result)) / RATE))
    return result, tempo


def render_soprano(crop, materials):
    warmth, _, feature_info = features(crop, 'ocean')
    mono = np.zeros(COUNT)
    phrases = []
    for i, (start_time, material) in enumerate(zip(STARTS, materials)):
        data, source_hz = material
        # Each complete phrase reads its own quarter of the spatial image scan.
        lo, hi = i * COUNT // 4, (i + 1) * COUNT // 4
        mean_warmth = float(warmth[lo:hi].mean())
        intended = 110 * 2 ** (2.5 * mean_warmth)
        shift = float(np.clip(12 * np.log2(intended / source_hz), -3, 3))
        if abs(shift) < .1:
            shift = 0.
        phrase, tempo = preserve_voice(data, shift)
        start = round(start_time * RATE)
        mono[start:start + len(phrase)] += phrase
        phrases.append(dict(sourceFile=SOPRANO_TAKES[i][0], sourceExcerpt=SOPRANO_TAKES[i][1:],
                            startSeconds=start_time, durationSeconds=PHRASE_SECONDS,
                            temperatureColourMean=mean_warmth, sourceFundamentalHz=source_hz,
                            intendedPitchHz=intended, appliedShiftSemitones=shift,
                            approximateShiftedFundamentalHz=source_hz * 2 ** (shift / 12),
                            tempoFactor=tempo))
    # Dry voice avoids the earlier short-delay comb-filter colour.
    return np.column_stack([mono, mono]), dict(**feature_info, phrases=phrases)


def natural_phrase(data, semitones, duration):
    tempo = len(data) / (duration * RATE)
    assert .8 <= tempo <= 1.3
    if abs(semitones) < .1:
        options = f'atempo={tempo:.12f}'
    else:
        options = (f'rubberband=tempo={tempo:.12f}:pitch={2 ** (semitones / 12):.12f}'
                   ':formant=preserved:transients=smooth:detector=soft'
                   ':phase=laminar:window=long:smoothing=on:pitchq=quality')
    run = subprocess.run(['ffmpeg', '-v', 'error', '-threads', '1', '-filter_threads', '1',
                          '-f', 'f32le', '-ar', str(RATE), '-ac', '1', '-i', 'pipe:0',
                          '-af', options, '-f', 'f32le', '-ar', str(RATE), '-ac', '1', 'pipe:1'],
                         input=data.astype('<f4').tobytes(), capture_output=True, check=True)
    output = np.frombuffer(run.stdout, dtype='<f4').astype(float)
    wanted = round(duration * RATE)
    assert abs(len(output) - wanted) < .2 * RATE
    output = np.pad(output, (0, max(0, wanted - len(output))))[:wanted]
    size = round(.04 * RATE)
    output[:size] *= np.linspace(0, 1, size)
    size = round(.15 * RATE)
    output[-size:] *= np.linspace(1, 0, size)
    assert np.max(np.abs(output)) < max(2 * np.max(np.abs(data)), .001), 'Unexpected processing transient.'
    return output, tempo


MALE_TAKES = [
    dict(file='m3_long_messa_a.wav', excerpt=[.10, 5.35], start=.15, duration=6.20, level=1.),
    dict(file='m3_long_forte_a.wav', excerpt=[.15, 2.65], start=6.65, duration=2.85, level=.65),
    dict(file='m3_long_straight_a.wav', excerpt=[.10, 3.80], start=9.80, duration=4.20, level=1.15),
]


def load_take(take):
    path = sample_path(take['file'])
    data, rate = sf.read(path)
    start, end = take['excerpt']
    data = data[round(start * rate):round(end * rate)]
    divisor = math.gcd(rate, RATE)
    data = signal.resample_poly(data, RATE // divisor, rate // divisor)
    data = signal.sosfilt(signal.butter(2, 35, 'highpass', fs=RATE, output='sos'), data)
    root = source_pitch(data[round(.25 * len(data)):round(.75 * len(data))], [80, 190])
    return data, root


def soft_room(mono, crop_hash):
    """Quiet dense early room tail; noise is an IR, never an added sound bed."""
    rng = np.random.default_rng(int(crop_hash, 16))
    length = round(1.10 * RATE)
    t = np.arange(length) / RATE
    output = np.column_stack([mono.copy(), mono.copy()])
    for channel in range(2):
        impulse = signal.sosfilt(signal.butter(2, [180, 5500], 'bandpass', fs=RATE, output='sos'),
                                 rng.standard_normal(length))
        impulse *= np.exp(-6.907755 * t / 1.05)
        impulse[:round(.025 * RATE)] = 0
        impulse /= max(float(np.sqrt(np.sum(impulse ** 2))), 1e-12)
        wet = signal.fftconvolve(mono, impulse)[:COUNT]
        output[:, channel] += .065 * wet
    end = round(.45 * RATE)
    output[-end:] *= np.linspace(1, 0, end)[:, None]
    return output


def render_male(crop, image, materials):
    warmth, _, feature_info = features(crop, 'ocean')
    assert float(warmth.mean()) < .33, 'This low-register audition is qualified only for the selected cold-colour image.'
    mono = np.zeros(COUNT)
    phrases = []
    for index, (take, (data, source_hz)) in enumerate(zip(MALE_TAKES, materials)):
        mean = float(warmth[index * COUNT // 3:(index + 1) * COUNT // 3].mean())
        # Keep the actual human register. The cold colour class selects the low
        # recordings; local image variation gently shapes phrase dynamics.
        shift = 0.
        voice, tempo = natural_phrase(data, shift, take['duration'])
        colour_gain = .9 + .2 * mean
        voice *= take['level'] * colour_gain
        at = round(take['start'] * RATE)
        mono[at:at + len(voice)] += voice
        phrases.append(dict(**take, sourceFundamentalHz=source_hz, imageWarmthMean=mean,
                            colourGain=colour_gain, appliedShiftSemitones=shift,
                            approximateFundamentalHz=source_hz * 2 ** (shift / 12), tempoFactor=tempo))
    return soft_room(mono, image['cropRawRgbSha256']), dict(**feature_info, phrases=phrases)
