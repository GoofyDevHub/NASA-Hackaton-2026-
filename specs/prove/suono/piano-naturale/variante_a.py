"""Variante della frase A che conserva le note di riferimento sul Fuji."""
import json
import numpy as np
import soundfile as sf
from scipy import signal
from genera import HERE, KEYS, RATE, SECONDS, levels, phrase, render

def enrich(score):
    anchors = phrase(score)
    result = []
    for i, note in enumerate(anchors):
        result.append(note)
        end = anchors[i+1][0] if i+1 < len(anchors) else SECONDS
        candidates = []
        for j in range(1, len(score)-1):
            t = j * SECONDS / len(score)
            if not note[0]+0.35 <= t <= min(end-0.35, SECONDS-0.75):
                continue
            local = score[j-1:j+2]
            freq = float(np.median(local[:,0]))
            distance = abs(12*np.log2(freq/note[1]))
            if distance >= 1.15:
                event = (t, freq, float(local[:,1].mean()), float(local[:,3].mean()))
                candidates.append((distance, -abs(t-(note[0]+end)/2), event))
        if candidates:
            result.append(max(candidates)[2])
    return result

if __name__ == '__main__':
    score = np.array(json.loads((HERE/'fuji-simulatore.json').read_text()))
    events = enrich(score)
    assert all(e in events for e in phrase(score))
    bank = {}
    for key in KEYS:
        audio, sr = sf.read(HERE/'campioni'/(key+'v3.flac'), frames=5*RATE)
        assert sr == RATE
        bank[key] = signal.sosfilt(signal.butter(2,28,'highpass',fs=RATE,output='sos'),audio,axis=0)
    mix = render(events,bank)
    ref, _ = sf.read(HERE/'a-simulatore.wav')
    target = levels(ref)[0]
    mix *= 10**((target-levels(mix)[0])/20)
    dest = HERE/'a-piu-note.wav'
    sf.write(dest,mix,RATE,subtype='PCM_24')
    decoded, sr = sf.read(dest)
    loud, peak = levels(decoded)
    assert abs(loud-target)<0.15 and peak < -1.2 and decoded.shape == (15*RATE, 2) and sr == RATE
    print(len(events), loud, peak)
