# WEB04 · Hear a description on demand

**Area** Player

**Depends on** [WEB03](WEB03.md), [CAT02](CAT02.md)

Offer description in the scene panel and an opt-in description setting for playlist playback.

## Acceptance

- [ ] Describe pauses music, speaks the selected text and waits for explicit resume in individual playback.
- [ ] With playlist narration enabled, each description ends before its track begins. Stop or scene change cancels old narration and scheduled audio.

## Verify

Open a scene silently, request its description, navigate mid-sentence and repeat with playlist narration on and off.

> **Current build, 15 November 2026.** The button is labelled Listen to the description. Narration before each tour track exists in `site/player.js` (`setNarration`) but has no control in the interface or in the voice commands yet.
