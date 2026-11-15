# P.T.S. — Pixel That Sounds: demo site

A static, dependency-free site served by a small Node script. No install step, no build.

## Run it

You need [Node.js](https://nodejs.org). In a terminal (PowerShell on Windows), from the repository root:

```sh
node site/serve.mjs
```

It prints `P.T.S. demo: http://localhost:4173/`. Open that address in **Chrome or Edge** (voice control does not work in Firefox). Stop the server with `Ctrl+C`.

- Another program already uses port 4173? Pick a different port: `$env:PORT=4180; node site/serve.mjs` in PowerShell, or `PORT=4180 node site/serve.mjs` in a POSIX shell, then open `http://localhost:4180/`.
- Inside Claude Code's desktop app, the preview named `orbit-site` in `.claude/launch.json` runs the same command.
- `node site/check.mjs` verifies the nine images, six MP3s, six masters, both exact ocean crops and the three NASA originals against the approved SHA-256 manifests. It should end with `All media checks passed`.

## Turn on voice control

1. Open the site in Chrome or Edge. You must be online: both browsers send the speech to their maker's recognition service.
2. Press **Voice control** at the top right of any page. By keyboard it is the first control: press `Tab`, then `Enter`.
3. The browser asks to use the microphone: choose **Allow**. A blocked permission is reported on the page and spoken replies stay off.
4. The page answers “Voice control on” and lists what to say. The button turns orange and reads **Listening**.
5. Next to the button, **EN** and **IT** choose the language you *speak*. English is the default; press **IT** to speak Italian. Replies are always spoken in English and also shown at the top of the page.
6. Say a command. To turn it off say “stop listening” (“spegni la voce”) or press the button again.

| Where | Say (English) | Say (Italian) |
|---|---|---|
| Entrance | explore · enter · start | esplora · entra · inizia |
| Anywhere | start tour · content list · help · where am I · home · stop listening | avvia il tour · elenco · aiuto · dove sono · inizio · spegni la voce |
| Globe or list | Amazon · Congo · Antarctica, optionally with lightning, ocean or aerosols · Southern Ocean · wind · coughs | Amazzonia · Congo · Antartide, con fulmini, oceano o aerosol |
| Player | listen · pause · resume · stop · next · previous · describe · repeat on / off · louder · quieter · volume 40 · close | ascolta · pausa · riprendi · ferma · avanti · indietro · descrivi · ripeti · alza · abbassa · chiudi |

A full spoken run: “explore” → “Congo lightning” → “listen” → “pause” → “resume” → “next” → “stop” → “close”.

Behaviour to know about:

- While a sound plays, replies appear on screen but are not spoken, so they do not cover the sound.
- While a description is being read aloud, only “stop” and “pause” are obeyed, so the page cannot command itself.
- The microphone is closed while the page speaks and reopened afterwards, so the page never hears itself.
- Speakers can bleed into the microphone: thunder and coughs may be misheard as speech. Headphones avoid this.
- Without a microphone, `ptsVoice.run('next')` in the browser console runs a phrase as if it had been spoken.

## Without sight

**Screen readers.** There is no separate API to call: NVDA, JAWS, Narrator, VoiceOver and TalkBack read the page's own HTML. Every control is a native button, checkbox or slider with a text name; images have text alternatives; the full description of each view is in the page as text; playback changes are announced through one polite live region; focus moves to the view title when the player opens and returns to where the listener came from when it closes; the page title names the current view. The globe, the stars and the level line are hidden from assistive technology, and the three pins stay reachable from the keyboard even when they are behind the Earth.

**Braille.** A braille display or braille keyboard works through the screen reader, which turns the same text into braille and the keys into ordinary keyboard input. The site needs nothing extra, and nothing in it is conveyed by sound alone.

**To check with NVDA** (free, [nvaccess.org](https://www.nvaccess.org)): open the site in Chrome, start NVDA, press `Tab` through the entrance and the globe, open a view, and listen for its name, its track number and each control. *NVDA menu → Tools → Speech viewer* shows what is spoken; *Tools → Braille viewer* shows what a braille display would receive, without hardware.

## How it is built

The interface follows the visual references in `specs/images/sito` (entrance, globe with pins, player) and then departs from them in the ways listed in `specs/images/README.md`. Sizes use one unit that fits the 1672 × 941 reference frame to the window.

| File | Role |
|---|---|
| `scenes.js` | Scene manifest, listening notes, place names and region positions. |
| `player.js` | The single playback state behind every control, the tour and voice control. |
| `globe.js` | Full-window canvas: the Earth shaded on the GPU from a NASA texture, lit from the upper left, with the entrance's orange wave ring and the pin positions. |
| `app.js` | The three views (entrance, globe, player), the content list, the starfield and Milky Way, the small-Earth lens and the playback line. |
| `voice.js` | Voice control: spoken commands mapped to the same actions as the buttons. |
| `check.mjs`, `serve.mjs` | Media checksum check and the static server. |
| `textures/` | The Earth surface texture, with its sources and hashes in its README. |

Playlist order is the order of the six listening references: Amazon lightning, Congo lightning, Antarctic lightning (illustrative wind), Southern Ocean, Atlantic near the Amazon mouth, Congo aerosols.

## Current state and known gaps

- Obit, the conversational guide, is removed for now. Voice control covers commands only: it does not answer questions about an image.
- Previous, Next and the guided tour loop as a ring: after the sixth track comes the first, and the tour runs until the listener stops it. `specs/ticket/WEB03.md` still says the playlist ends and announces completion.
- Describing each image before its track during a tour exists in `player.js` (`setNarration`) but has no control in the interface or in the voice commands.
- The Earth keeps turning, the stars drift and the entrance wave moves even when the system asks for reduced motion. This was a design request and conflicts with `specs/product.md`; only the playback level line is flat in that case.
- The Earth texture is a Blue Marble image with thinned clouds, derived from a NASA image downloaded through Wikimedia Commons. See `textures/README.md`.
- Not checked: a real screen reader, a braille display, speech recognition with a real voice and microphone, 200% zoom, narrow and portrait windows beyond a first pass, and browsers other than Chromium.
