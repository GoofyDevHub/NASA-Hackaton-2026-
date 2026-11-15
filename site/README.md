# P.T.S. — Pixel That Sounds: demo site

Live at <https://pixelthatsounds.github.io/>. It is published from the `gh-pages` branch, which holds only the site files: after a change is merged into `main`, `gh-pages` must be republished or the public site stays behind.

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
2. Turn it on in any of three ways: press the **V** key anywhere on the site; press `Enter` as soon as the page has loaded, because the page opens with the focus on **Voice control**; or click **Voice control** at the top right.
3. The browser asks to use the microphone: choose **Allow**. A blocked permission is reported on the page and spoken replies stay off.
4. The page answers “Voice control on” and lists what to say. The button turns orange and reads **Listening**.
5. Next to the button, **EN** and **IT** choose the language: the one you speak and the one the page speaks back, including the image descriptions. You can also switch by voice: “italiano” or “english”. The buttons and texts on screen stay in English.
6. Say a command. To turn it off press **V** again, say “stop listening” (“spegni la voce”) or press the button.

| Where | Say (English) | Say (Italian) |
|---|---|---|
| Entrance | explore · enter · start | esplora · entra · inizia |
| Anywhere | start tour · tour with descriptions · content list · read the list · track three · first · last · help · where am I · home · italiano · stop listening | avvia il tour · tour con descrizioni · elenco · leggi l'elenco · traccia tre · prima traccia · ultima · aiuto · dove sono · inizio · inglese · spegni la voce |
| Globe or list | Amazon · Congo · Antarctica, optionally with lightning, ocean or aerosols · Southern Ocean · wind · coughs · close (the list) | Amazzonia · Congo · Antartide, con fulmini, oceano o aerosol · chiudi |
| Player | listen · pause · resume · stop · again · next · previous · describe · what do I hear · source · repeat · stop repeating · louder · quieter · volume 40 · maximum · minimum · mute · close · explore | ascolta · pausa · riprendi · ferma · da capo · avanti · indietro · descrivi · cosa sento · fonte · ripeti · basta ripetere · alza · abbassa · massimo · minimo · muto · chiudi · esplora |

Every button on a page has a spoken command. A full run: “explore” → “Congo lightning” → “listen” → “pause” → “resume” → “next” → “stop” → “close”.

Recognition is forgiving on purpose:

- A word one or two letters away from a command counts as that command (“nexte”, “previews”, “ascolto”, “firma” for *ferma*), and known mis-hearings are listed in `voice.js` (“paws” for *pause*, “lesson” for *listen*).
- Every alternative the recogniser offers is tried, best first, until one is a command.
- A clear command is obeyed about half a second after it is heard, without waiting for the recogniser to finish.
- English and Italian command words both work in either language mode.
- Commands can follow one another without waiting: “listen”, then “pause”, then “resume” in one breath are each obeyed. A command said in two parts (“Congo” … “aerosols”, “volume” … “40”) is put back together, and in the player a phenomenon alone means the same place.
- A near-miss must start with the same letter as the command, so ordinary talk is rarely taken for one.
- While you speak during playback, the sound is lowered for a moment.

How the page answers:

- **Tones for short confirmations.** Pause and stop answer with a falling tone, volume and repeat with a rising one, an unknown phrase with a low one. The microphone stays open through a tone, so the next command is heard at once.
- **Speech for information**: where you are, a place name, help, the source, what you hear, the list. The microphone closes while the page speaks, so it never hears itself, and a soft tick tells you when it is listening again.
- **Nothing extra when a sound starts**: the sound is the answer. The reply is still shown at the top of the page.
- An unknown phrase is answered in words once; after that only with the low tone, so talk nearby does not keep the page speaking.
- While a description is being read aloud, only “stop”, “pause”, “next”, “previous” and “close” are obeyed, so the page's own words are not taken for commands.

The voice it speaks with:

- The page prefers a natural-sounding voice and the same family for both languages: a multilingual neural voice where the browser offers one (Edge), otherwise the neural or Google voice of each language (Chrome: *Google US English* and *Google italiano*), and only then the system voices. Those better voices need the network.
- To see or change it, open the browser console: `ptsVoice.voices()` lists what the browser has, `ptsVoice.voice()` shows the one in use for the current language, and `ptsVoice.useVoice('Google italiano')` keeps a choice for that language (`ptsVoice.useVoice()` forgets it).
- Long text is spoken sentence by sentence, because some browser voices fall silent in the middle of one long passage.

Behaviour to know about:

- Speakers can bleed into the microphone: thunder and coughs may be misheard as speech. Headphones avoid this.
- Without a microphone, `ptsVoice.run('next')` in the browser console runs a phrase as if it had been spoken.
- The **V** shortcut is a single key with no modifier and cannot be remapped or switched off yet. That falls short of WCAG 2.1.4 for people who dictate text; it is ignored while typing in a field.
- Spoken replies and descriptions follow EN / IT. Screen-reader announcements and on-screen text are English only.

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
| `voice.js` | Voice control: the command vocabulary in both languages, forgiving matching, and the spoken replies. |
| `scenes.it.js` | Italian text for what the page says aloud: place names, descriptions, sound keys, limits and sources. |
| `check.mjs`, `serve.mjs` | Media checksum check and the static server. |
| `textures/` | The Earth surface texture, with its sources and hashes in its README. |

Playlist order is the order of the six listening references: Amazon lightning, Congo lightning, Antarctic lightning (illustrative wind), Southern Ocean, Atlantic near the Amazon mouth, Congo aerosols.

## Current state and known gaps

- Obit, the conversational guide, is removed for now. Voice control covers commands only: it does not answer questions about an image.
- Previous, Next and the guided tour loop as a ring: after the sixth track comes the first, and the tour runs until the listener stops it. `specs/ticket/WEB03.md` still says the playlist ends and announces completion.
- Describing each image before its track during a tour is available by voice only ("tour with descriptions"); there is no button for it.
- The Earth keeps turning, the stars drift and the entrance wave moves even when the system asks for reduced motion. This was a design request and conflicts with `specs/product.md`; only the playback level line is flat in that case.
- The Earth texture is a Blue Marble image with thinned clouds, derived from a NASA image downloaded through Wikimedia Commons. See `textures/README.md`.
- Voice control: Tried by the product owner with a real microphone and headphones in Chrome on 15 November 2026; the faults found were fixed and checked with a simulated recogniser, not yet re-tried by voice.
- Not checked: a real screen reader, a braille display, 200% zoom, narrow and portrait windows beyond a first pass, and browsers other than Chromium.
