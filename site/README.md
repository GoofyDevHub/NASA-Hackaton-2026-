# PTS — Pixel That Sounds: demo site

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

## Current state

- Only "Explore on Earth" is active on the entrance. "How it works" and "Content list" are shown as in the references and do nothing yet.
- The globe surface is NASA's Blue Marble, stored in `textures/` with its source and hash.
- Obit is removed for now.
- Not checked: screen reader, 200% zoom, reduced motion, browsers other than Chromium.
