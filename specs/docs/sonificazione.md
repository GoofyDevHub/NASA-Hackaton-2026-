# A+ piano sonification — current reference

A+ turns visual features into a phrase played with acoustic-piano recordings. It is the preferred listening reference. Final mapping parameters, density across images, player integration and continuous looping still need team review and testing.

## Image to music

1. Prepare the image and documented mask, then read a 64 × 64 grid along a Hilbert curve.
2. Group readings into 180 events. Colour and brightness guide pitch, brightness affects the piano touch, and horizontal position gives gentle stereo placement.
3. The phrase function smooths brief fluctuations and selects main notes. Enrichment adds a touch where a different pitch becomes significant. Density depends on the image.
4. The renderer chooses a nearby sampled key, transposes it and applies gain, an envelope and stereo position. Reference WAVs last 15 seconds, stereo 48 kHz, PCM 24 bit.

Keep preparation, mask, mapping, tuning, duration and gain consistent for a comparison. Store versioned inputs and samples. Identical inputs and rendering environment reproduce the same result. Scientific interpretation requires the source legend and documented processing.

## Listening references

| File | Interpretation |
|---|---|
| [Fuji A+](../prove/suono/piano-naturale/a-piu-note.wav) | Preferred enriched phrase with 15 touches |
| [Sarychev original A+](../prove/suono/piano-naturale/cinque-scene/sarychev-originale.wav) | Preferred 22-touch example |
| [Sarychev reduced variant](../prove/suono/piano-naturale/cinque-scene/sarychev.wav) | Experimental reduction to 18 touches |
| [Measurements](../prove/suono/piano-naturale/cinque-scene/misure.json) | Original and reduced counts for each landscape |
| [Stored scores](../prove/suono/piano-naturale/cinque-scene/partiture.json) | Feature groups and input file hashes |

Some landscape WAVs demonstrate reduced density. Use the enrichment function in variante_a.py when implementing A+, and keep the exact Sarychev reference available. Note counts depend on the same image and preparation.

[Image-to-score extractor](../prove/suono/piano-naturale/cinque-scene/estrai.py) · [Analysis simulator](../prove/suono/confronto-simulatore/simulatore.html) · [Phrase selection and rendering](../prove/suono/piano-naturale/genera.py) · [Enrichment](../prove/suono/piano-naturale/variante_a.py).

## Reproduce the references

Python and FFmpeg are required. Make FFmpeg available on the command path. In a working copy, run from the repository root:

```bash
python -m pip install -r specs/prove/suono/terra-sonify/requirements.txt
python specs/prove/suono/piano-naturale/variante_a.py
python specs/prove/suono/piano-naturale/cinque-scene/genera.py
```

The scripts overwrite WAVs and measurements in their own directories. The landscape generator renders the recorded experimental variants, including the original Sarychev A+ file.

To extract the five image scores again, install Chrome and Python Playwright, then run:

```bash
python -m pip install playwright
python specs/prove/suono/piano-naturale/cinque-scene/estrai.py
```

The extractor checks two independent passes and blocks remote requests. Rendering stored scores works without a browser.

## Integration and remaining tests

The current player proposal generates A+ on request, with cache keys covering the canonical image, mask, profile, algorithm and samples. Use the Web Audio clock for playback.

Test ten repeat cycles for clicks, inserted gaps and growing voice/memory counts. Reference WAVs have an ending fade, so the seamless loop needs an explicit integration decision. The playlist plays one phrase per image and then advances. Description pauses music and requires explicit resume.

Earlier isolated-copy checks reproduced the reference scores and seven WAVs byte for byte in the tested environment. Understanding, mono comparison, full-catalog behavior and integrated looping still need testing.

Piano recordings are Alexander Holm's Salamander Grand Piano V3 under CC BY 3.0. Include attribution and the documented transposition, filtering, attenuation and envelopes. [Sample attribution](../prove/suono/piano-naturale/README.md) · [License](../prove/suono/piano-naturale/campioni/LICENSE.txt) · [Earlier methods](../prove/suono/metodi-esplorati.md).
