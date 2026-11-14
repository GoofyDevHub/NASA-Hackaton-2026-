# Accessible Earth listening guide

## The listening session

The home screen offers **Start playlist** as the first focusable action. The rotating Earth moves to the selected region. A parallel text list exposes the same regions and phenomena in a predictable focus order. Selecting a scene opens a silent detail panel with its image, region, phenomenon, short description, source period, credit and labelled playback controls. Closing the panel returns focus to its opener.

Offer play, pause/resume, stop, previous, next, volume, repeat current track and playlist. “Describe image” is always opt-in. Description pauses the sound and leaves it paused until the listener chooses to resume. A playlist option includes descriptions before each track when explicitly enabled. Navigation retains playing or paused state. Stop cancels pending speech and queued scene transitions. Repeat has an announced on/off state. At the last track, the ordinary playlist stops and announces completion.

Let the listener explore nine previews. Six have approved sounds, including the clearly announced illustrative wind. An image-only entry offers its description and source. The playlist skips image-only entries. Use the Southern Ocean band from the audio crop when playing the male voice. Label the Antarctic Peninsula thumbnail as a regional reference. Preserve the user's volume while changing scenes, including the stronger Congo thunder.

## Accessible visual design

Use graphite #21232E and off-white #F0F0F0 with orange #FE8500 for emphasis. A single thin orange orbit moves with the actual sound and settles at rest. Show a visible focus ring and a text playback state. Make the globe optional for navigation. Reduced motion freezes globe movement and the reactive animation. Check text, focus, control visibility and image scaling at enlarged zoom. Use semantic HTML controls with accessible names and expose state changes without announcing animation frames.

Keyboard and mouse use the same actions. Screen readers can read scene text, controls and status. A connected braille display or keyboard works through its existing assistive software and standard text/keyboard events. Direct hardware drivers and custom braille chords are outside the demo. Record the actual configurations tested. A dedicated P.T.S. device is unnecessary.

## Talk to Obit

“Parla con Obit” (“Talk to Obit” in English) starts a user-initiated conversation. Show listening, processing and idle states, offer a text transcript and typed input, and allow cancellation. Release the microphone when the interaction ends. If the microphone or service is unavailable, retain manual playback and display an accessible explanation.

Ground responses in the selected scene, legend, recorded source period, sound mapping and known limitations. Route a bounded set of commands through the same player actions: select scene, start playlist, play, pause, stop, previous, next, repeat, change volume or describe. Ask for clarification on an ambiguous location or action. Announce the result after it takes effect. Prevent assistant speech from triggering further commands or overlapping a scene description. Do not send raw audio to a service before the user understands the microphone choice.

## Scope and decisions

The demo covers three regions and three phenomena. The working media set is fixed in the [overview](../README.md). The team still needs to choose the voice service, supported demonstration browser and final playlist order. The [renderer](../sonification/README.md) defines the six current references. New scientific mappings and future historical duets need comparable inputs and separate validation. Comparing two regions sequentially uses the existing tracks. No historical change is claimed. The deliverables for judging are the accessible site with Obit and the captioned film.
