# Judging evidence and submission

Use the team's [judging guide](docs/references/nasa-judging-awards-guide.pdf) and check the official event instructions before submitting. The following are evidence targets for the two-person team.

| Criterion | Evidence to show |
|---|---|
| Impact | Record whether a listener can start the playlist, obtain a description and select another scene without looking. Separate team checks from feedback by blind or low-vision participants. |
| Creativity | Play the Amazon and Congo weather tracks back to back. Explain the image-to-sound transfer rule, the choice of recorded sound and the voice control that lets a listener use the site by speaking (and Obit, if it returns). |
| Validity | Link NASA source periods, exact crops, legends, sample licenses, master checksums and any listening-test observations. Identify the Antarctic wind as illustrative. |
| Relevance | Connect ECCO2 ocean colours and the GEOS aerosol visualization to the Earth Information Jukebox resources. Credit the additional LIS/OTD lightning climatology separately. |
| Presentation | Provide an accessible working entry point, a captioned English film of 29 seconds, transcript and clear credits. |

Confirm both members' registration, event, selected challenge, public link permissions, applicable reuse rules, submission fields and local deadline against the official instructions. List source imagery, recorded samples, external software and AI assistance. Confirm every claim on the public page against the demonstrated build. Record the submitted revision and receipt when submission actually happens.

## Where the build stands, 15 November 2026

| Evidence | State |
|---|---|
| Working entry point | Public at <https://pixelthatsounds.github.io/> (GitHub Pages, published from the `gh-pages` branch). Also runs locally with `node site/serve.mjs`. |
| Media integrity | `node site/check.mjs` passes for all nine images, six tracks, both exact ocean crops and three NASA originals. |
| Voice control | Built in English and Italian; command routing exercised by script. Tried by the product owner with a real microphone and headphones in Chrome on 15 November 2026; the faults found were fixed and checked with a simulated recogniser, not yet re-tried by voice. |
| Screen reader, braille, keyboard-only, zoom | Not tested. Steps for NVDA and its braille viewer are in `site/README.md`. |
| Listening comprehension (Amazon against Congo) | Not tested with anyone. |
| Film and transcript | Film produced: 29.0 s, at <https://pixelthatsounds.github.io/film/pts-promo-29s.mp4>, with a narrator and no captions. Transcript and captions not written yet. |
| Known conflicts with the specification | Reduced motion is not honoured by the Earth, stars and entrance wave; the tour loops instead of ending. |

AI assistance to list at submission: the audio compositions and analysis code, the site code, the interface copy and scene descriptions, the visual references and this documentation, all prepared with Claude. External software and data: Node.js (static server only), NASA Blue Marble through Wikimedia Commons, VocalSet, the two recordings credited in `assets/audio/README.md`, and NVDA for planned tests.

[Challenge](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/) · [Judging guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/) · [Submission guide](https://www.spaceappschallenge.org/resources/project-submission-guide/)
