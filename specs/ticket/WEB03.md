# WEB03 · Run the complete playlist without looking

**Area** Player

**Depends on** [WEB01](WEB01.md), [CAT01](CAT01.md)

Add Start playlist as the first focusable home action, with previous, next and repeat for the six playable scenes. Record the chosen order.

## Acceptance

- [ ] Play all visits each approved track exactly once and announces completion. Repeat holds one track until disabled.
- [ ] Navigation preserves playing or paused state. Stop cancels pending transitions, including at track end. The listener's volume persists.

## Verify

Run a full cycle, toggle repeat across an ending, navigate while paused and stop just before a transition. Verify the three image-only scenes are skipped.

> **Current build, 15 November 2026.** The entrance offers Voice control and Explore on Earth; the globe offers Start tour and Content list. The tour and Previous/Next loop as a ring, so the tour does not end by itself. Decide whether to keep that or restore the ending and announcement in the acceptance above.
