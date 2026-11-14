# WEB03 · Run the complete playlist without looking

**Area** Player

**Depends on** [WEB01](WEB01.md), [CAT01](CAT01.md)

Add Start playlist as the first focusable home action, with previous, next and repeat for the six playable scenes. Record the chosen order.

## Acceptance

- [ ] Play all visits each approved track exactly once and announces completion. Repeat holds one track until disabled.
- [ ] Navigation preserves playing or paused state. Stop cancels pending transitions, including at track end. The listener's volume persists.

## Verify

Run a full cycle, toggle repeat across an ending, navigate while paused and stop just before a transition. Verify the three image-only scenes are skipped.
