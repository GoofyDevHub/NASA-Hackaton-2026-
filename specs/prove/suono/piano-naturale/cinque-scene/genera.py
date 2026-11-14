"""Render five NASA scenes with A+ and compare dense phrases against its original."""
from pathlib import Path
import hashlib
import json
import sys
import numpy as np
import soundfile as sf
from scipy import signal
from PIL import Image

D = Path(__file__).resolve().parent
sys.path.insert(0, str(D.parent))
from genera import KEYS, RATE, SECONDS, levels, phrase, render
from variante_a import enrich


def refine(score):
    """Keep every anchor. Trim only anticipations of the same upcoming piano key."""
    original = enrich(score)
    anchors = phrase(score)
    extras = []
    for note in original:
        if note in anchors:
            continue
        t, hz = note[:2]
        following = next((a for a in anchors if a[0]>t), None)
        if following is None:
            continue
        delay = following[0]-t
        if delay<=0.65 and abs(12*np.log2(following[1]/hz)) < 0.25:
            extras.append((delay,note))
    budget = max(0,len(original)-18)
    removed = {n for _,n in sorted(extras)[:budget]}
    result = [n for n in original if n not in removed]
    assert all(a in result for a in anchors)
    return result

def main():
    bank = {}
    for key in KEYS:
        src,rate = sf.read(D.parent/'campioni'/(key+'v3.flac'),frames=5*RATE)
        assert rate==RATE
        bank[key]=signal.sosfilt(signal.butter(2,28,'highpass',fs=RATE,output='sos'),src,axis=0)
    fuji = np.array(json.loads((D.parent/'fuji-simulatore.json').read_text()))
    assert refine(fuji)==enrich(fuji)
    report = {}
    mixes = {}
    for name,record in json.loads((D/'partiture.json').read_text()).items():
        raw=(D/'immagini'/f'{name}.jpg').read_bytes()
        assert hashlib.sha256(raw).hexdigest()==record['file_sha256']
        with Image.open(D/'immagini'/f'{name}.jpg') as image:
            image.verify()
        score=np.array(record['score'])
        original, fine=enrich(score),refine(score)
        report[name]=dict(original=len(original),notes=len(fine),distinct=len({n[1] for n in fine}),
                          min_hz=min(n[1] for n in fine),max_hz=max(n[1] for n in fine),
                          removed_s=[round(n[0],3) for n in original if n not in fine])
        mixes[name]=render(fine,bank)
        if name=='sarychev':
            mixes['sarychev-originale']=render(original,bank)
    meters={name:levels(mix) for name,mix in mixes.items()}
    target=min([-20.0]+[loud-peak-1.5 for loud,peak in meters.values()])
    for name,mix in mixes.items():
        dest=D/(name+'.wav')
        sf.write(dest,mix*10**((target-meters[name][0])/20),RATE,subtype='PCM_24')
        samples,rate=sf.read(dest)
        measured,peak=levels(samples)
        assert samples.shape==(RATE*SECONDS,2) and rate==RATE and peak < -1.25 and abs(measured-target)<0.15
        print(name,round(measured,2),round(peak,2),report.get(name,{}))
    (D/'misure.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')

if __name__=='__main__':
    main()
