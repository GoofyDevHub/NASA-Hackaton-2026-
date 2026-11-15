# Implementation backlog

State on 15 November 2026. **Done** means the acceptance checks pass. **Built** means the code exists and was exercised by scripts or by its author, but the ticket's own check, by a person on the final interface, is still owed. No ticket has been closed by a listener or assistive-technology session. The approved images, recordings and renderer are inputs. Keep the product backlog here and attach evidence to the corresponding ticket when a check passes.

| Ticket | Work | Depends on | State |
|---|---|---|---|
| [CAT01](CAT01.md) | Bind the nine views to the six listening references | — | **Done.** `site/scenes.js`; `node site/check.mjs` passes. |
| [WEB01](WEB01.md) | Open one silent scene and listen | CAT01 | Built. Scripted checks passed in Chromium (silent open, one stream, pause, resume, stop, volume); repeat by hand on the final interface. |
| [CAT02](CAT02.md) | Write scene descriptions and listening notes | CAT01 | Drafted in `site/scenes.js`. Not yet reviewed beside each image and legend. |
| [WEB02](WEB02.md) | Explore through the globe or the text list | WEB01, CAT02 | Built: globe with three pins and a Content list of all nine views. Keyboard-only path, 200% zoom and reduced motion not checked; reduced motion departs from the ticket by request. |
| [WEB03](WEB03.md) | Run the complete playlist without looking | WEB01, CAT01 | Built, with a departure: the tour and Previous/Next loop as a ring instead of ending with an announcement. Repeat, stop before a transition and skipping image-only scenes were scripted. |
| [WEB04](WEB04.md) | Hear a description on demand | WEB03, CAT02 | Partly built: description pauses the sound and waits for resume. Narration before each tour track exists in `player.js` but has no control. |
| [AI01](AI01.md) | Answer a question about the selected image | CAT02 | Paused. Obit removed from the build. |
| [AI02](AI02.md) | Control playback with Obit commands | AI01, WEB04 | Partly covered by voice control (`site/voice.js`); typed requests and clarification questions about images are gone with Obit. |
| [AI03](AI03.md) | Have a hands-free conversation after activation | AI02 | Built as hands-free command control, not conversation. Never tried with a real microphone. |
| [QA01](QA01.md) | Walk through the site with assistive technology | WEB02, WEB04, AI03 | Not started. Steps for NVDA and its braille viewer are in `site/README.md`. |
| [QA02](QA02.md) | Check that the sound differences are understandable | WEB03, CAT02 | Not started. |
| [VID01](VID01.md) | Capture the listening and voice interactions | WEB02, WEB04, AI03 | Not started. An early attempt at generating the film was discarded. |
| [VID02](VID02.md) | Edit the captioned 29-second film | VID01 | Not started. |
| [REL01](REL01.md) | Rehearse and package the judging entry | QA01, QA02, VID02 | Not started. The site has no public link yet. |

## Two-person delivery plan

1. Start with CAT01. One teammate can then build the first playable scene while the other qualifies the listening descriptions. Check one quiet-to-playing journey before broadening the UI.
2. Build the globe and sight-free transport. Voice control now shares the player state with the buttons. Obit's grounded answers (AI01) are paused until the team decides whether to bring Obit back.
3. Once the site can complete the judging journey, capture it for the film while the other teammate checks accessibility and comprehension. Record the actual test setup and decide how to address any blocking observations before recording the final cut.
4. Review the [submission checklist](../submission.md) together. A successful audio render or finished storyboard does not complete the application, user validation or film.

[Product](../product.md) · [Listening references](../../assets/audio/README.md) · [Storyboard](../storyboard.md)
