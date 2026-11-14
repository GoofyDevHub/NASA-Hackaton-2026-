# Reproduce the six reference masters

From the repository root, give the renderer a new output directory. It reads local NASA originals, checks each crop and audio sample, renders the six selections and checks every WAV against the approved SHA-256 before writing it. The website can serve the MP3s directly.

```sh
uv run --no-project --python 3.14 --with-requirements sonification/requirements.txt python sonification/render.py tmp/verified-masters
```

Put FFmpeg on PATH. The reference environment uses Python 3.14, the versions in requirements.txt and FFmpeg 9.0.2 with Rubber Band support. Matching hashes are the reproducibility test. Other DSP builds can round differently.

- **Lightning.** Read coloured pixels against the published legend. Each column combines 70% mean colour position and 30% 90th percentile. A stronger profile increases rain gain and the rate and sharpness of thunder. The 15 seconds scan a still map in space. The Antarctic crop lacks a usable overlay. Its hash seeds a soft wind effect explicitly labelled illustrative.
- **Ocean.** Isolate saturated ECCO2 streamline colours. Scan relative warmth across the exact ocean crop. Four spatial quarters adjust the Amazon soprano's phrase pitches within three semitones. The Southern Ocean's cold colours select the recorded low register and its three spatial thirds adjust phrase level. The male singer retains his natural pitch.
- **Aerosols.** Extract the area occupied by orange/red smoke colours in the Congo crop. Coverage sets the number and spacing of cough groups and shapes their level. The selected recording contains thirteen groups, nine distinct gestures and silence between them. It supplies no estimate of exposure or health risk.

[Per-track measurements](measurements.json) · [Original samples](samples/sources.json) · [NASA imagery and legends](../assets/images/README.md) · [Listen and credit the recordings](../assets/audio/README.md)

The reference compositions, analysis code and documentation were prepared with AI assistance. Further mappings require their own qualification and listening review.
