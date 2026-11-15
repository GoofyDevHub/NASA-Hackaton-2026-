# P.T.S. — Pixel That Sounds

P.T.S. is a listening guide to three NASA Earth visualizations. Choose a region on a turning globe or from a content list, then hear what the colours in the image represent. Compare the Amazon and Congo lightning maps by listening for the difference in thunder density. A voice control lets a listener enter the site, start the sounds and move through them by speaking.

**Status, 15 November 2026.** Available: nine regional image references, six approved 15-second tracks with their sources, a reproducible audio renderer, and a working demo site (`site/`) with an entrance, a globe, a player, a guided tour and voice control in English and Italian. Not yet done: the conversational guide Obit (paused and removed from the build), the 29-second film, hosting at a public link, and every test with assistive technology or listeners. The specifications are a working agreement for the two-person team; accessible operation and listener comprehension still need testing.

## Run the demo

Needs [Node.js](https://nodejs.org) (any recent version). From the repository root:

```sh
node site/serve.mjs
```

Open <http://localhost:4173/> in Chrome or Edge. Press `Ctrl+C` in the terminal to stop it. Details, the voice commands and how to try the site with a screen reader are in [site/README.md](site/README.md).

| Region | Lightning | Ocean temperature colours | Aerosols |
|---|---|---|---|
| Antarctica | [Illustrative wind](assets/audio/antarctica-wind.mp3) | [Southern Ocean, low male voice](assets/audio/antarctica-ocean-deep-male.mp3) | Image only |
| Amazon | [Rain and three thunder groups](assets/audio/amazon-storm.mp3) | [Atlantic near the river mouth, soprano](assets/audio/amazon-ocean-soprano.mp3) | Image only |
| Congo | [Heavier rain and nine thunder groups](assets/audio/congo-storm.mp3) | Image only | [Thirteen groups of coughs](assets/audio/congo-air-pollution-cough-dense.mp3) |

The Antarctic lightning overlay cannot establish local activity. Wind is an artistic cue. The ocean voices follow relative temperature colours. Cough density responds to smoke-coloured area in a GEOS model image. These sources cover different periods. [See the nine images and source legends](assets/images/README.md) · [Listen and inspect the audio credits](assets/audio/README.md)

## Start here

- [Demo site](site/README.md) explains how to run it, use voice control and test it without sight.
- [Product and accessible interaction](specs/product.md) covers the player, globe, descriptions, tour, voice control and the paused Obit.
- [Visual references](specs/images/README.md) and the [timed storyboard](specs/storyboard.md) guide the interface and film.
- [Audio renderer](sonification/README.md) describes the image-to-sound rules and how to check all six masters.
- [Development tickets](specs/ticket/README.md) give two teammates an ordered backlog with dependencies, acceptance checks and the state of each ticket.
- [Judging and submission](specs/submission.md) identifies what the team can demonstrate and what still needs checking.

The audio, the analysis code, the site, the visual references and this documentation were prepared with AI assistance.
