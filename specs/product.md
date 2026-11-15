# Accessible Earth listening guide

> **Status, 15 November 2026.** The demo site in `site/` implements the listening session, the globe and voice control described here. Talk to Obit is paused and removed from the build; voice control, which handles commands only, stands in for it. Where the build departs from the earlier agreement the text says **Current build**.

## The listening session

The entrance shows a slowly turning Earth with three orange pins and one action, **Explore on Earth**. The globe page offers the three pins (Amazon, Congo, Antarctica), **Start tour** and **Content list**. A pin opens the first sound of its region. The Content list opens a dialog with all nine views grouped by region, each marked *Sound*, *Illustrative sound* or *Image only*. Selecting a scene opens a silent player: a small Earth marks the place and the NASA image opens from it in one fixed frame, followed by the legend, source period, credit and labelled playback controls. Closing the player returns focus to its opener; a pin returns to the pin of the region just shown.

Offer listen, pause/resume, stop, previous, next, volume, repeat the current track and a guided tour of the six sounds. “Listen to the description” is always opt-in. Description pauses the sound and leaves it paused until the listener chooses to resume. Navigation retains playing or paused state. Stop cancels pending speech and queued scene transitions. Repeat has an announced on/off state.

**Current build.** Previous, Next and the tour loop as a ring: after the last track comes the first, and the tour continues until the listener stops it. The earlier text said the ordinary playlist stops and announces completion. Describing each image before its track during the tour is available by voice (“tour with descriptions”) and has no button yet.

Let the listener explore nine previews. Six have approved sounds, including the clearly announced illustrative wind. An image-only entry offers its description and source. The tour skips image-only entries. The Southern Ocean view shows a detail of the wide Southern Ocean band that drives the male voice, labelled as such; the Antarctic Peninsula thumbnail is a regional reference. Preserve the user's volume while changing scenes, including the stronger Congo thunder.

## Accessible visual design

The earlier palette was graphite #21232E and off-white #F0F0F0 with orange #FE8500 for emphasis. **Current build:** deep-space black with drifting stars and a faint Milky Way, an Earth lit from the upper left, translucent black liquid-glass panels and buttons, off-white text and the same orange #FE8500 for emphasis. A visible focus ring and a text playback state are always shown. The globe is optional for navigation: the Content list and voice control reach every view without it. Text, focus, control visibility and image scaling still need checking at enlarged zoom. Controls are semantic HTML with accessible names; state changes are announced without announcing animation frames.

The thin orange line: on the entrance a ring of bars moves like a microphone level; in the player a line records the level of the actual sound as the track advances and rests flat otherwise.

**Current build, reduced motion.** The agreement says reduced motion freezes globe movement and the reactive animation. At the product owner's request the Earth keeps its slow turn, the stars drift and the entrance wave moves whatever the system setting; only the playback level line is flat. This conflicts with the accessibility goal and needs an explicit decision before submission.

Keyboard and mouse use the same actions. Screen readers can read scene text, controls and status. A connected braille display or keyboard works through its existing assistive software and standard text/keyboard events. Direct hardware drivers and custom braille chords are outside the demo. Record the actual configurations tested. A dedicated P.T.S. device is unnecessary.

## Voice control

A **Voice control** button turns on speech recognition after the listener chooses to. The page opens with the focus on it, and the **V** key toggles it from anywhere. It uses the browser's speech recognition (Chrome and Edge, online), so the audio goes to the browser maker's service; the button's description says so before it is used. The listener chooses English or Italian, by button or by voice, and the page then listens and speaks in that language, descriptions included. Matching is forgiving: near-misses of a command word, every alternative from the recogniser and both languages' command words are accepted. Every button on a page has a spoken command.

Commands drive the same actions as the visible controls, from passing the entrance to using the player: explore, start tour, content list, a place with an optional phenomenon, listen, pause, resume, stop, next, previous, describe, repeat on or off, louder, quieter, a volume number, close, help, where am I, home and stop listening. The full list in both languages is in [site/README.md](../site/README.md). Replies are spoken in the chosen language and shown at the top of the page; while a sound plays they are only shown. The microphone is closed while the page speaks. While a description is read aloud, only stop, pause, next, previous and close are obeyed. Short confirmations are tones, so the microphone stays open; spoken replies close it and a tick marks when it reopens. A denied permission, a missing microphone or an unreachable service switches voice control off, reports it on the page and leaves every control working by hand.

## Talk to Obit (paused)

Removed from the build on 14 November 2026. The intended design is kept here for a later decision.

“Parla con Obit” (“Talk to Obit” in English) starts a user-initiated conversation. Show listening, processing and idle states, offer a text transcript and typed input, and allow cancellation. Release the microphone when the interaction ends. If the microphone or service is unavailable, retain manual playback and display an accessible explanation.

Ground responses in the selected scene, legend, recorded source period, sound mapping and known limitations. Route a bounded set of commands through the same player actions. Ask for clarification on an ambiguous location or action. Announce the result after it takes effect. Prevent assistant speech from triggering further commands or overlapping a scene description. Do not send raw audio to a service before the user understands the microphone choice. Voice control already covers the command routing; what is missing is answering questions about an image.

## Scope and decisions

The demo covers three regions and three phenomena. The working media set is fixed in the [overview](../README.md). Decided for now: the site is public at <https://pixelthatsounds.github.io/> and also runs from a local Node script; it is demonstrated in Chrome or Edge; voice uses the browser's speech recognition; the tour order is the order of the six listening references. Still open: whether Obit returns, whether the tour should end instead of loop, the reduced-motion question above, and the final playlist-narration control. The [renderer](../sonification/README.md) defines the six current references. New scientific mappings and future historical duets need comparable inputs and separate validation. Comparing two regions sequentially uses the existing tracks. No historical change is claimed. The deliverables for judging are the accessible site and the 29-second film, which is narrated and still needs captions and a transcript.
