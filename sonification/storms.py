"""Lightning display colours control recorded rain and thunder. Polar wind is illustrative."""
import math

import numpy as np
from PIL import Image
from scipy import signal
import soundfile as sf

from common import IMAGES, COUNT, RATE, expand, sample_path, sustain

MASTER_GAIN = .78


def load_thunder():
    path = sample_path("rain-and-thunder.ogg")
    recording, rate = sf.read(path)
    recording = recording[round(2.6 * rate):round(10.6 * rate)]
    divisor = math.gcd(rate, RATE)
    recording = signal.resample_poly(recording, RATE // divisor, rate // divisor)
    recording = signal.sosfilt(signal.butter(2, [55, 6500], "bandpass", fs=RATE, output="sos"), recording)
    recording = .20 * np.tanh(recording / .20)
    recording /= np.sqrt(np.mean(recording ** 2))
    recording[:240] *= np.linspace(0, 1, 240)
    recording[-24000:] *= np.linspace(1, 0, 24000)
    return recording


def activity_profile(crop):
    """Measure position on the published colour bar, not RGB brightness.

    The mean and 90th percentile preserve both broad activity and visible hot
    spots. Their weighted combination is a design proxy, not a physical rate.
    """
    legend = np.asarray(Image.open(IMAGES / 'legends/lightning.png').convert('RGB'), dtype=float)[33, 35:286] / 255
    pixels = np.asarray(crop, dtype=float) / 255
    squared = ((pixels[:, :, None, :] - legend[None, None, :, :]) ** 2).sum(axis=-1)
    distance = np.sqrt(squared.min(axis=-1))
    index = squared.argmin(axis=-1) / (len(legend) - 1)
    valid = (distance < .07) & ((pixels.max(axis=2) - pixels.min(axis=2)) > .3)
    if not valid.any():
        return None, dict(status='unqualified', matchedPixels=0,
                          reason='Missing overlay and low activity cannot be separated in this image.')
    profile = np.full(crop.width, np.nan)
    for x in range(crop.width):
        values = index[:, x][valid[:, x]]
        if len(values):
            profile[x] = .7 * values.mean() + .3 * np.quantile(values, .9)
    observed = np.isfinite(profile)
    columns = np.arange(crop.width)
    profile = np.interp(columns, columns[observed], profile[observed])
    score = float(.7 * index[valid].mean() + .3 * np.quantile(index[valid], .9))
    return expand(profile), dict(
        status='image-derived-audition', matchedPixels=int(valid.sum()),
        matchedPixelFraction=float(valid.mean()), interpolatedColumns=int((~observed).sum()),
        activityDisplayScore=score, minimumColumnScore=float(profile.min()),
        maximumColumnScore=float(profile.max()),
        soundProfile='high' if score >= .33 else 'medium' if score >= .14 else 'low',
        numericMeaning='Dimensionless display-colour proxy; not rainfall, storm severity or flash counts.',
    )


def unit_rms(samples):
    return samples / max(float(np.sqrt(np.mean(samples ** 2))), 1e-12)


def weather_material():
    source = sample_path('rain-and-thunder.ogg')
    recording, rate = sf.read(source)
    divisor = math.gcd(rate, RATE)
    recording = signal.resample_poly(recording, RATE // divisor, rate // divisor)
    # A high-passed tail supplies rain texture while suppressing its distant rumble.
    rain = recording[round(10.5 * RATE):round(18.5 * RATE)]
    rain = signal.sosfilt(signal.butter(3, [650, 8500], 'bandpass', fs=RATE, output='sos'), rain)
    rain = unit_rms(rain)
    # Reuse the existing equal-power sample looper, with a fixed read speed.
    rain_bed = sustain(rain, 1., 1.)
    light = unit_rms(signal.sosfilt(signal.butter(2, 2400, 'highpass', fs=RATE, output='sos'), rain_bed))
    heavy = unit_rms((rain_bed + .48 * np.roll(rain_bed, 15527) + .32 * np.roll(rain_bed, 37391)))
    thunder = load_thunder()[round(.4 * RATE):round(5.4 * RATE)].copy()
    thunder[-round(.7 * RATE):] *= np.linspace(1, 0, round(.7 * RATE))
    rumble = unit_rms(signal.sosfilt(signal.butter(3, 650, 'lowpass', fs=RATE, output='sos'), thunder))
    crack = unit_rms(signal.sosfilt(signal.butter(3, [650, 6500], 'bandpass', fs=RATE, output='sos'), thunder))
    return light, heavy, rumble, crack


def emphasis_curve(profile):
    """Same smooth transfer curve for every image; no region-name gain lookup."""
    position = np.clip((profile - .25) / .15, 0, 1)
    return position ** 2 * (3 - 2 * position)


def render(profile, materials):
    light, heavy, rumble, crack = materials
    activity = np.clip(profile / .60, 0, 1)
    emphasis = emphasis_curve(profile)
    boost_db = 1.5 + 6.5 * emphasis
    rain_gain = .012 + .12 * activity ** .85
    mono = rain_gain * ((1 - activity) * light + activity * heavy)
    event_rate = np.where(profile < .14, 0., .09 + .65 * np.clip((profile - .14) / .46, 0, 1))
    event_rate *= 1 + .45 * emphasis
    cumulative = np.cumsum(event_rate) / RATE
    onsets = np.flatnonzero(np.diff(np.floor(cumulative + .55), prepend=0) > 0)
    events = []
    for start in onsets:
        strength = float(activity[start])
        gain = .035 + .18 * strength ** 1.2
        hit = gain * (.84 * rumble + (.08 + .35 * strength) * crack)
        attack = round((.015 + .100 * (1 - strength)) * RATE)
        hit[:attack] *= np.linspace(0, 1, attack)
        size = min(len(hit), COUNT - start)
        mono[start:start + size] += hit[:size]
        events.append(dict(seconds=float(start / RATE), activity=float(profile[start]),
                           amplitudeBeforeEmphasis=gain, attackMs=attack / RATE * 1000))
    t = np.arange(COUNT) / RATE
    mono *= np.minimum(1, t / .35) * np.minimum(1, (15 - t) / .9)
    mono *= MASTER_GAIN * 10 ** (boost_db / 20)
    # Apply peak control at 4x rate to avoid the large intersample overshoots
    # and aliasing that direct, heavily driven base-rate saturation produced.
    oversampled = signal.resample_poly(mono, 4, 1)
    oversampled = .68 * np.tanh(oversampled / .68)
    mono = signal.resample_poly(oversampled, 1, 4)
    details = dict(events=events, emphasisGainDbRange=[float(boost_db.min()), float(boost_db.max())])
    return np.column_stack([mono, mono]), details


def render_wind(pixel_hash):
    """Soft coloured airflow with slow gusts; no rain samples or thunder.

    The crop fixes the pseudo-random seed. Gust strength is an artistic setting,
    not a wind measurement recovered from the lightning visualization.
    """
    rng = np.random.default_rng(int(pixel_hash, 16))
    t = np.arange(COUNT) / RATE
    source = rng.standard_normal(COUNT + RATE)
    body = signal.sosfilt(
        signal.butter(3, [100, 1800], 'bandpass', fs=RATE, output='sos'), source)[RATE:]
    body = unit_rms(body)
    breath = signal.sosfilt(
        signal.butter(2, [600, 2800], 'bandpass', fs=RATE, output='sos'),
        rng.standard_normal(COUNT + RATE))[RATE:]
    breath = unit_rms(breath)
    gust = .65 + .18 * np.sin(2 * np.pi * .12 * t + .4) + .09 * np.sin(2 * np.pi * .23 * t + 1.7)
    fade = np.minimum(1, t / 1.2) * np.minimum(1, (15 - t) / 1.5)
    mono = .070 * gust * fade * (body + .10 * breath)
    width = .07 * np.sin(2 * np.pi * .045 * t)
    stereo = np.column_stack([mono * (1 - width), mono * (1 + width)])
    return stereo, dict(events=[], windSeedSha256=pixel_hash,
                        synthesis='Seeded, band-limited coloured airflow with slow gust envelopes; no rain or thunder samples.',
                        audioSource='Procedural wind, generated locally; not a field recording or measured Antarctic wind.')
