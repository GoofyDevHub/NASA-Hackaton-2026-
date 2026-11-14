# ORBIT product — working draft

This specification records the team's current direction. Both teammates will review unresolved choices, test feasibility and refine the requirements. Preferred sound and visual references guide development. Individual implementation details and acceptance results still need confirmation.

## Purpose

Help blind and low-vision users explore NASA Earth imagery through optional descriptions and image-driven piano music. The PC interface should also be visually appealing for sighted users. Independent navigation and understanding an image change are the outcomes to test.

## PC application

Choose an image using a natural-looking Earth globe or equivalent accessible list. Use documented geography. Open a silent scene dialog with separate description and music controls.

Provide Play/Pause, Resume, Stop, Previous, Next, volume and single-image repeat. Description pauses music and waits for explicit Resume after speech ends. Show the text alongside any narration.

The first home action is Start playlist. It plays each qualified image once in stable catalog order, with a proposed 15-second phrase per image. The 14-image selection gives 3 min 30 s of music. Descriptions are optional and initially excluded. Announce title and position without a continuous stream of note information.

During an active playlist, previous/next continues from the new scene. During pause, navigation stays silent. Previous at the first scene signals the boundary; Next at the last concludes. Stop cancels pending advances and returns focus to Start playlist.

Support mouse, keyboard and screen reader, visible focus, zoom, sufficient contrast, reduced motion and an accessible alternative to the globe and comparison wipe. Validate menu clarity and announcements with actual users.

## Controller design and simulator

The preferred shape has rounded grips, six tactile controls, a volume knob, vibration motor and warm/cool plate. Buttons are Previous, Play/Pause, Next, Describe, Stop and Thermal. From home, controller Play invokes Start playlist directly.

The simulator follows the shared player state. Every image has a documented warm/cool category and an accessible explanation. The current proposal enables this simulated channel during playback, with Thermal toggling it and keeping the preference across scenes. Stop, pause, description, link loss and faults remove output.

Deliver editable mechanical sources, assembled/exploded views, a component inventory, BOM, diagrams and the connected simulator. Component selection, electrical details, dimensions and tactile ergonomics need further work. Physical construction and measured contact profiles require the checks in the hardware specification.

## Image comparison

The selected catalog has 14 images and eight candidate pairs — six Pacific, one Florida and one Fuji. Confirm each pair's registration, crop, masking, scale, musical method, phase and gain.

A visual wipe reveals the actual second image over the first. Keyboard-accessible A/B controls support the listening task. Test whether listeners recognize the intended difference and explain any limitation. Warm/cool contextual associations are declared conventions; physical values require calibrated source data.

## Presentation film

The working target is a single 29-second film. Final pacing, text, narration, comparison excerpts and sound mix remain subject to review.

| Time | Action | Audio and text direction |
|---|---|---|
| 0–3 s | Slowly rotating Earth and thin orbit | “What does a changing Earth sound like?” with brief typing |
| 3–7 s | Actual player, visible Play press | Synchronized click followed by the image's piano |
| 7–13 s | Match cut to a model button, then exploded view | Short accents, readable symbols, controller concept/simulation labels |
| 13–18 s | Slow aligned wipe from A to B | “Same place. Same sound rules.” |
| 18–26 s | Four seconds of A, four of B | Shared gain and phase, clear labels, sonification alone |
| 26–29 s | Earth, team name and source credit | Brief ending, readable credits and English captions |

The extended storyboard and 14-second motion study provide artistic references. Review the actual exported length, mono mix, laptop readability, descriptive transcript and English language requirements.

## Shared design and completion

The current palette is graphite #21232E, off-white #F0F0F0 and orange #FE8500. Preserve the thin, restrained audio-reactive orbit and consistent materials across website, controller and film.

A+ acoustic piano is the preferred method. The original Sarychev reference has 22 touches over 15 seconds. Review its behavior on every selected image and test a continuous repeat transition.

Prioritize PC listening, then controller integration, then comparison. The intended judging package includes all three products together. Record each decision as proposed, agreed, implemented or tested.

[Draft tickets](../ticket/README.md) · [Sound](sonificazione.md) · [Detailed requirements](requisiti.md) · [Submission checklist](nasa-submission.md).
