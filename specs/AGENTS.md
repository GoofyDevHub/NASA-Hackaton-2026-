# Develop ORBIT

Build an accessible PC Earth-image jukebox, a USB controller design with an integrated simulator, and a 29-second film. The team has two members. Start with the English [repository overview](../README.md) and [19 tickets](ticket/README.md).

## Current direction for team review

The specifications and tickets are working drafts. Both teammates still need to review open decisions and task ownership. Update the relevant documents as feasibility checks and user testing provide evidence. The points below describe the current direction and preferred references.

- Prioritize PC listening, then PC with controller, then image comparison. Have all three products ready together for judging.
- Select through the globe or equivalent accessible list. Scene opening is silent. Provide optional description, play/pause, resume, stop, previous, next, volume and repeat.
- Start playlist is the first focusable home-screen action. Controller Play invokes it directly from home. Play all 14 qualified images once, 15 seconds per image. Descriptions are optional and initially excluded.
- Description pauses music and waits for explicit resume. Navigation during playback continues the playlist; navigation during pause stays silent. Stop cancels queued playback.
- Use deterministic A+ acoustic piano, 64 × 64 Hilbert analysis and 180 feature groups. The preferred Sarychev example has 22 touches. The experimental reduced file has 18.
- Qualify all eight candidate comparisons individually. Match crop, registration, mask policy, musical rules, phase and gain.
- Simulate six controller controls, volume, vibration and each image's documented warm/cool cue. Thermal toggles the simulated channel and preserves that preference across scenes. Pause, Stop, description and faults stop its output.
- Deliver editable controller sources, diagrams, BOM and assembled/exploded views. Physical contact profiles require the measurements and protections in the hardware specification.
- The 29-second film uses actual player capture, a readable controller exploded view, a slow aligned wipe and two clean four-second A/B listening windows.

## Implementation order

1. DA01 and SW01 establish one Pacific pair. Complete SW02, SO01 and SO02 until description, music, pause and Stop work on the target PC.
2. SW03 and SW04 extend the catalog to the complete playlist and thermal cues. AB01 qualifies comparison.
3. HW01 and HW02 can progress alongside the player. Complete HW03 and HW04 after transport is ready.
4. Complete VD01–VD04 using the preferred visual references and proposed film timeline.
5. Run QA01, QA02 and EV01 on a clean copy, offline, with screen covered and keyboard/screen reader, then simulated controller input. Record versions, observations and limitations.

## Sources and engineering

Use TypeScript, semantic HTML, CSS, Web Audio and an analysis Worker. Serve local assets through a loopback launcher. One coordinator owns playback and scene state. Version tokens reject stale audio, speech, analysis and actuator callbacks.

Use graphite #21232E, off-white #F0F0F0 and orange #FE8500. Match the thin audio-reactive orbit and controller finish in the [visual references](images/README.md).

Use the [catalog selection](catalogo/campione/selezione.json), [full-resolution sources](prove/dati-nasa/README.md) and [audio guide](docs/sonificazione.md). Retain source credits, licenses, hashes and transformation records.

Historical technical notes and experimental interfaces include Italian. Consult the original protocol/electrical details during implementation. English overview and tickets identify the current proposed behavior. Review English coverage of materials selected for public submission.

## Workflow and evidence

Work on a focused branch from develop and propose changes back to develop. Run ticket acceptance checks. Use working copies when generators overwrite outputs. Include raster, mask, profile, algorithm and sample revisions in cache keys.

Record implemented behavior, simulation, physical measurements and user tests according to their actual evidence. The [NASA checklist](docs/nasa-submission.md) tracks judging and submission readiness.
