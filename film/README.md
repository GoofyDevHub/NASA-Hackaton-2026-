# The 29-second film

[Watch it online](https://pixelthatsounds.github.io/film/pts-promo-29s.mp4) · file: [pts-promo-29s.mp4](pts-promo-29s.mp4) (1920×1080, 60 fps, exactly 29.0 s)

Every frame is drawn by the real site. `make.mjs` starts the local server, drives Chrome over the DevTools protocol with the page clock replaced by a frame counter, and captures 1740 frames. The sound is assembled offline at exact sample offsets from the approved tracks.

## The cut

| Time | Picture | Sound |
|---|---|---|
| 0–3 s | Black. “WHAT DOES EARTH SOUND LIKE?” types on; a click on P.T.S. opens the Earth. | Typing, click. |
| 3–10 s | Entrance, **Explore on Earth**, the Amazon pin, the player. | Narrator: what P.T.S. does; each kind of image has a base sound. |
| 10–12 s | **Listen to the image** on the Amazon lightning map. | The Amazon rain alone. |
| 12–15 s | Pause, then Next to the Congo. | Narrator: brighter pixels, heavier rain and thunder. |
| 15–17 s | The Congo lightning map playing. | The Congo rain and thunder alone. |
| 17–19 s | Black card: “ALSO FOR BLIND AND LOW VISION PEOPLE”. | Typing, narrator. |
| 19–25 s | Voice control: the **V** key, then “Explore”, “Amazon, lightning”, “Listen”. The site obeys each one. | Narrator, a second voice speaking the commands, then the rain. |
| 25–29 s | The Earth, “HEAR THE PLANET. BEYOND VISUALS.”, the site address. | Typing, narrator, final click. |

The narrator never speaks while an image is being heard; the script checks this and reports any overlap.

## What is real and what is staged

- Real: the site, its controls, the NASA images, the tracks, the commands being obeyed.
- Staged for capture: speech recognition is a stand-in that delivers the three commands, and the page's own speech is silent. The narrator (Clarice) and the listener's voice (Will) are ElevenLabs voices kept in `voice/`. The typing and click sounds in `sfx/` were supplied by the team. Tones are synthesised. The level line follows the measured level of the real track.

## Render it again

Needs Chrome, ffmpeg and Node. From the repository root:

```sh
node film/make.mjs
```

It writes `film/out/pts-promo-29s.mp4` in about six minutes. `AUDIO_ONLY=1 node film/make.mjs` rebuilds only the sound in a few seconds, and `DRY=1` prints the narration schedule. New narration lines need `ELEVEN_KEY` set to an ElevenLabs key; existing lines are reused from `voice/`. Without a key the Windows voices are used. The published file is the same render re-encoded smaller.
