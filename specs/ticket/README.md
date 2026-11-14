# Implementation backlog

All fourteen tickets are open. The approved images, recordings and renderer are inputs. Keep the product backlog here and attach evidence to the corresponding ticket when a check passes.

| Ticket | Work | Depends on |
|---|---|---|
| [CAT01](CAT01.md) | Bind the nine views to the six listening references | — |
| [WEB01](WEB01.md) | Open one silent scene and listen | CAT01 |
| [CAT02](CAT02.md) | Write scene descriptions and listening notes | CAT01 |
| [WEB02](WEB02.md) | Explore through the globe or the text list | WEB01, CAT02 |
| [WEB03](WEB03.md) | Run the complete playlist without looking | WEB01, CAT01 |
| [WEB04](WEB04.md) | Hear a description on demand | WEB03, CAT02 |
| [AI01](AI01.md) | Answer a question about the selected image | CAT02 |
| [AI02](AI02.md) | Control playback with Obit commands | AI01, WEB04 |
| [AI03](AI03.md) | Have a hands-free conversation after activation | AI02 |
| [QA01](QA01.md) | Walk through the site with assistive technology | WEB02, WEB04, AI03 |
| [QA02](QA02.md) | Check that the sound differences are understandable | WEB03, CAT02 |
| [VID01](VID01.md) | Capture the listening and voice interactions | WEB02, WEB04, AI03 |
| [VID02](VID02.md) | Edit the captioned 29-second film | VID01 |
| [REL01](REL01.md) | Rehearse and package the judging entry | QA01, QA02, VID02 |

## Two-person delivery plan

1. Start with CAT01. One teammate can then build the first playable scene while the other qualifies the listening descriptions. Check one quiet-to-playing journey before broadening the UI.
2. Build the globe and sight-free transport. Start Obit's grounded text answers alongside the player. Both routes must use the same scene IDs and player state before adding voice input.
3. Once the site can complete the judging journey, capture it for the film while the other teammate checks accessibility and comprehension. Record the actual test setup and decide how to address any blocking observations before recording the final cut.
4. Review the [submission checklist](../submission.md) together. A successful audio render or finished storyboard does not complete the application, user validation or film.

[Product](../product.md) · [Listening references](../../assets/audio/README.md) · [Storyboard](../storyboard.md)
