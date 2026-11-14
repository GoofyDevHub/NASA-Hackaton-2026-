# P.T.S. — Pixel That Sounds: demo site

A static, dependency-free page. From the repository root:

```sh
node site/serve.mjs
```

Open <http://localhost:4173/>. Run `node site/check.mjs` to verify the nine images, six MP3s, six masters and both exact ocean crops against the approved SHA-256 manifests.

The interface follows the visual references in `specs/images/sito`: entrance (`ingresso.png`), globe with pins (`globo.png`) and player (`lettore-pronto.png`, `lettore-in-ascolto.png`). Sizes are expressed in a unit that fits the 1672 × 941 reference frame to the window.

| File | Role |
|---|---|
| `scenes.js` | Scene manifest, listening notes, place names and pin positions. |
| `player.js` | The single playback state behind every control. |
| `globe.js` | Full-window canvas: turning Earth drawn from a NASA original, orange orbit, pin positions. |
| `app.js` | The three views and their controls. |
| `voice.js` | Voice control: spoken commands mapped to the same actions as the buttons. |


## Using the site without sight

**Voice control.** The first control on every page is *Voice control* (Tab, then Enter). It needs Chrome or Edge and the microphone permission; those browsers send the audio to their maker's speech service, which the button's description says before it is turned on. Choose EN or IT for the language you speak. Replies are spoken in English and shown at the top of the page; while a sound plays they are shown only.

| Where | Say (English) | Say (Italian) |
|---|---|---|
| Entrance | explore, enter, start | esplora, entra, inizia |
| Anywhere | start tour · content list · help · where am I · home · stop listening | avvia il tour · elenco · aiuto · dove sono · inizio · spegni la voce |
| Globe or list | Amazon, Congo, Antarctica, optionally with lightning, ocean or aerosols; Southern Ocean | Amazzonia, Congo, Antartide, con fulmini, oceano o aerosol |
| Player | listen · pause · resume · stop · next · previous · describe · repeat on / off · louder · quieter · volume 40 · close | ascolta · pausa · riprendi · ferma · avanti · indietro · descrivi · ripeti · alza · abbassa · chiudi |

While a description is being read aloud, only *stop* and *pause* are obeyed, so the page cannot command itself. Without a microphone, `ptsVoice.run('next')` in the browser console runs a phrase as if it had been spoken.

**Screen readers.** There is no separate API to call: NVDA, JAWS, Narrator, VoiceOver and TalkBack read the page's own HTML. Every control is a native button, checkbox or slider with a text name; images have text alternatives; the full description of each view is in the page as text; playback changes are announced through one polite live region; focus moves to the view title when the player opens and returns to where the listener came from when it closes; the page title names the current view. The globe, the stars and the level line are hidden from assistive technology, and the three pins stay reachable from the keyboard even when they are behind the Earth.

**Braille.** A braille display or braille keyboard works through the screen reader, which turns the same text into braille and the keys into ordinary keyboard input. The site needs nothing extra, and nothing in it is conveyed by sound alone.

**To check with NVDA (free, nvaccess.org):** open the site in Chrome, start NVDA, press Tab through the entrance and the globe, open a view, and listen for its name, its track number and each control. *NVDA menu → Tools → Speech viewer* shows what is spoken; *Tools → Braille viewer* shows what a braille display would receive, without hardware.

## Current state

- The entrance offers Voice control and "Explore on Earth". The globe offers three pins, "Start tour" and "Content list".
- The globe surface is NASA's Blue Marble, stored in `textures/` with its source and hash.
- Obit, the conversational guide, is removed for now. Voice control covers commands only.
- Not checked: a real screen reader, a braille display, speech recognition with a real voice and microphone, 200% zoom, browsers other than Chromium.
- The globe keeps turning and the entrance animates even when the system asks for reduced motion. This was a design request and conflicts with `specs/product.md`.
