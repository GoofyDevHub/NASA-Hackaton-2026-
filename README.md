# ORBIT — Earth in Tune

**Explore NASA Earth imagery through sound.**

ORBIT is an accessible Earth jukebox for the NASA Space Apps challenge **The Earth Information Jukebox**. A person selects an image, optionally hears a description, and listens to a short piano phrase generated from its visual features. A playlist supports exploration without watching the screen. Aligned image pairs let listeners explore change using shared musical rules.

The team is developing three connected products: a PC application, a USB controller design with an integrated simulator, and a 29-second presentation film.

> **Working draft — subject to team review.** This repository collects the current project direction, 19 draft development tickets, NASA imagery, reproducible audio experiments, visual mockups and editable controller concept models. Several decisions remain open. The specifications and tickets will evolve as both teammates review them, test feasibility and learn from users. The integrated application, controller simulator and final film remain to be developed and tested.

## Start here

| You want to… | Open |
|---|---|
| Understand the proposed product | [Product specification](specs/docs/prodotto.md) |
| Start implementation as a developer or AI agent | [Development instructions](specs/AGENTS.md) |
| Choose the next task | [19 development tickets](specs/ticket/README.md) |
| See the visual direction | [Visual reference index](specs/images/README.md) |
| Hear the preferred sound reference | [Sarychev A+ — 15 seconds, 22 piano notes](specs/prove/suono/piano-naturale/cinque-scene/sarychev-originale.wav) |
| Understand how the sound is made | [Sonification specification](specs/docs/sonificazione.md) |
| Inspect the controller | [Controller model and regeneration instructions](specs/controller/README.md) |
| Prepare the presentation | [29-second storyboard](specs/docs/storyboard.md) |
| Check sources, eligibility and judging alignment | [NASA submission checklist](specs/docs/nasa-submission.md) |

GitHub provides file links for the audio, HTML viewers and 3D models. Download or clone the repository to play the WAVs and open the HTML viewers locally.

## What the user can do

### 1. Listen on a PC

Choose a NASA image using the globe or an equivalent accessible list. Opening a scene is silent. Separate controls start its description and its sonification. Pause, resume, stop, previous, next, volume and single-image repeat remain in consistent positions.

From the home screen, **Start playlist** plays every qualified image once, with a **15-second phrase per image**. Descriptions are optional and initially disabled. A requested description pauses the music and waits for an explicit resume. The keyboard, mouse and controller use the same playback state.

The visual identity uses graphite `#21232E`, off-white `#F0F0F0` and orange `#FE8500`. A thin orange audio-reactive orbit accompanies the Earth. Reduced motion, visible focus, semantic controls and screen-reader support are acceptance requirements.

### 2. Explore with the controller

The two-handed controller concept has six tactile controls — Play/Pause, Stop, Previous, Next, Describe and Thermal — plus a volume knob, a vibration motor and a warm/cool plate.

For the hackathon, deliver editable project files, a bill of materials, diagrams, assembled and exploded views, and a software simulator connected to the PC player. The simulator represents vibration and each scene's declared warm/cool association. Physical construction, ergonomic validation and measured thermal performance require subsequent hardware testing.

### 3. Compare two images

Choose two compatible images of the same phenomenon. Both use the same crop, musical mapping, timing and gain. A visual wipe reveals the actual change between images. Keyboard-accessible A/B controls support the listening task independently of the wipe.

The selected catalog offers **eight candidate pairs** — six ocean pairs, one Florida pair and one Mount Fuji pair. Each pair requires alignment, masking and listening checks before it is enabled.

## How image-to-sound works

1. Prepare the image and its documented mask, then resize it to a **64 × 64** analysis grid.
2. Read the grid along a **Hilbert curve**, which keeps spatially nearby areas close along much of the listening path.
3. Extract colour, brightness, local complexity and horizontal position into a sequence of **180 groups**.
4. Select a stable musical phrase and add piano touches when meaningful pitch changes appear.
5. Play recorded acoustic-piano samples with image-dependent pitch, dynamics and gentle stereo placement.

The chosen **A+** method is deterministic within the same image-processing and rendering environment. Identical pixels, parameters, algorithm version and samples reproduce the same output. The Sarychev reference contains 22 touches; other images produce different note counts.

The mapping conveys properties of the visual representation. Scientific interpretation comes from the source data, legends and documented transformations. Warm/cool associations include declared contextual conventions, such as a glacier or desert landscape.

[Algorithm, source files, reference scores and reproduction steps](specs/docs/sonificazione.md).

## NASA imagery in the selected catalog

| Collection | Images | Intended use |
|---|---:|---|
| Pacific-centred sea-surface temperature anomaly maps | 4 | Shared-region seasonal comparisons |
| Florida nighttime lights around Hurricane Ian | 2 | Before/after comparison |
| Bahamas, Namib, Malaspina, Richat and Sarychev | 5 | Landscape exploration and listening references |
| Mount Fuji snow-cover views | 2 | Snow-cover comparison |
| Lena River delta | 1 | Exploration of a branching landscape |
| **Total** | **14** | **3 minutes 30 seconds of music in a complete playlist** |

Use the EIC-linked imagery to demonstrate the challenge's core requirement. The additional NASA Earth Observatory scenes extend the catalog. Qualification includes a source, attribution, observation information, mask, description, musical profile and thermal explanation.

[Selected images and source links](specs/catalogo/campione/README.md) · [Scene selection and file hashes](specs/catalogo/campione/selezione.json) · [Full-resolution SVS originals](specs/prove/dati-nasa/README.md).

## Decisions still to make

The current direction is accessible image exploration, A+ piano as the preferred sound reference, a controller concept and a short presentation film. Both teammates should review these details before treating the related tickets as implementation commitments.

| Topic | What still needs thought or validation |
|---|---|
| Images | Final playable set, crops, masks, descriptions, source interpretation and suitability of each candidate A/B pair |
| Sonification | Mapping in the player, musical density across images, loop transitions and whether listeners understand the intended differences |
| Accessibility | Listening menu, announcements, descriptions and independent playlist use with a real screen reader and representative users |
| Controller | Components, dimensions, wiring, power, firmware, tactile ergonomics and simulator versus physical behavior |
| Thermal feedback | Meaning and explanation of each warm/cool cue, user control and future measured physical profiles |
| Film | Pacing, text, voice, transitions, chosen comparison and mix within the proposed 29-second cut |
| Delivery | Two-person task ownership, available time, official instructions, English coverage and source/AI disclosures |

Update the relevant specification and ticket when a decision changes. Record whether each point is proposed, agreed, implemented or tested. Existing reproducibility checks cover the included reference experiments.

## Repository layout

```text
specs/
  AGENTS.md        Development entry point and current scope
  docs/            Product, interaction, architecture, hardware and film specifications
  ticket/          19 tasks with dependencies and acceptance checks
  catalogo/        NASA source inventory, selected images and file hashes
  images/          Website, controller, film and identity references
  controller/      Model generator, viewer, component inventory and GLB exports
  prove/           Audio generators, samples, scores, measurements and motion studies
```

The original folder and asset names are retained so that scripts, hashes and relative references continue to resolve. Historical engineering notes, experimental interfaces and text embedded in visual mockups include Italian. English entry points and tickets identify the current requirements. The submission checklist tracks English coverage for every material linked to the NASA entry.

## Work on develop

`develop` is the team's integration branch. Start a focused task branch from it, implement a ticket, run its acceptance checks, and open a pull request targeting `develop`.

```bash
git clone https://github.com/GoofyDevHub/NASA-Hackaton-2026-.git
cd NASA-Hackaton-2026-
git switch develop
git switch -c feature/sw01-accessible-scene-selection
```

Begin with **DA01 + SW01**, then complete **SW02 → SO01 → SO02** for one working Pacific comparison. Extend that path to the 14-image playlist, add the controller simulator, and verify A/B. Controller design and film preparation can progress alongside the player. Capture the final film from the tested build.

The repository includes about **304 MB** of source imagery, audio and visual references. Git downloads those assets as part of the clone. There is no application-wide install or launch command yet.

## Run the existing references

Open `specs/images/galleria.html` to inspect the visual references, `specs/controller/controller-3d.html` for the assembled/exploded model, and `specs/prove/video/confronto.html` for the short motion study.

To regenerate the controller with Node.js, use a working copy of its folder because the generator rewrites its exports:

```bash
cd specs/controller
node build-model.cjs
```

To reproduce the reference piano audio, install Python and FFmpeg, make FFmpeg available on the command path, and run these commands in a working copy of the repository:

```bash
python -m pip install -r specs/prove/suono/terra-sonify/requirements.txt
python specs/prove/suono/piano-naturale/variante_a.py
python specs/prove/suono/piano-naturale/cinque-scene/genera.py
```

The first command installs the audio dependencies. The generators overwrite their own reference outputs. Re-extracting image scores also requires Chrome and Python Playwright. See the [sonification instructions](specs/docs/sonificazione.md).

Previous isolated-copy checks reproduced the controller exports, reference scores and seven piano WAV files byte for byte. Integrated accessibility, loop continuity and image-comparison comprehension remain acceptance work.

## NASA judging and submission

| Criterion | ORBIT's approach | Evidence to deliver |
|---|---|---|
| **Impact** | Independent access to Earth imagery for blind and low-vision users | Observe navigation and comparison tasks with users; record outcomes and limitations |
| **Creativity** | Image-driven natural piano combined with a tactile controller concept | Explain the musical rules and show how image changes affect the experience |
| **Validity** | Reproducible processing, source traceability and explicit simulated hardware | Demonstrate the integrated player, matched A/B settings, offline use and fault handling |
| **Relevance** | NASA Earth imagery provides the input to the music | Show an EIC-linked example with its source, legend and audible interpretation |
| **Presentation** | Consistent visual identity, an accessible demo and a 29-second film | Deliver a clear English project page, a finished film, subtitles, references and a readable exploded view |

These are development targets. The [submission checklist](specs/docs/nasa-submission.md) records eligibility and evidence still to verify, including both teammates' registration, official declarations and English linked materials.

## Credits and provenance

NASA image pages and individual contributors are listed in the [catalog](specs/catalogo/campione/README.md). Piano recordings come from **Alexander Holm's Salamander Grand Piano V3**, used under **CC BY 3.0**. The included processing transposes, filters, attenuates and envelopes those recordings. [Instrument attribution and sample license](specs/prove/suono/piano-naturale/README.md) · [License text](specs/prove/suono/piano-naturale/campioni/LICENSE.txt).

AI tools assisted with project planning, code, documentation and artistic mockups. The artistic reference images and controller renders are concepts; their scientific image sources are credited separately. Before submission, document specific AI contributions and apply the event's required disclosures to the submitted assets.

Reuse permissions follow each asset's own source and license. The repository currently has no project-wide open-source license. NASA and Space Apps names identify source material and the selected challenge.

[Official challenge](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/) · [Judging and awards](https://www.spaceappschallenge.org/resources/judging-awards-guide/) · [Submission guide](https://www.spaceappschallenge.org/resources/project-submission-guide/).
