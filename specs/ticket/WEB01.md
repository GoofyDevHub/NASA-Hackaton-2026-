# WEB01 · Open one silent scene and listen

**Area** Player

**Depends on** [CAT01](CAT01.md)

Implement the first end-to-end path with the Amazon lightning image, a native button and one shared player state.

## Acceptance

- [ ] A fresh visit and opening the detail panel are silent. Listen starts the selected MP3 only once.
- [ ] Pause freezes position, resume continues it and Stop rewinds. Volume works during playback and state has an accessible text label.

## Verify

Use mouse and keyboard on a fresh load. Press Listen twice quickly, then Pause, Resume and Stop. Check that only one audio stream plays.
