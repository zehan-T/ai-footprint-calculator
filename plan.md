# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Track the next useful build checkpoints, verification, and consequential revisions.

## Working agreement

Developer: Keep the browser preview running, choose priorities, test results directly, and plan only the next few checkpoints.

Agent: Read the project documents and inspect the files. Keep each checkpoint small enough to run and judge. Do not expand scope or mark Developer verification complete.

Start or continue a fresh chat with:

`Read the project documents, inspect the current build, and help me complete the next unchecked checkpoint.`

## Checkpoints

### Current checkpoints — 2026-10-12

- [x] Initialize the Project 4 repository and verify a zero-dependency local preview.
- [x] Choose and document the background composition and 2D visual direction.
- [x] Build the layered static scene, start overlay, and reserved HUD/caption layout.
- [x] Replace the rejected cartoon treatment with a cinematic realistic background while preserving the approved composition.
- [ ] Developer reviews the composition in VS Code Browser Preview and on a narrow phone-sized viewport.
- [x] Add transparent foreground, atmosphere, particle, story-effect, target, and transition layers without activating scene interactions.
- [ ] Next after approval: establish the first ambient effect and shared Play/Pause state.
- [x] Establish three coordinated ambient-motion systems and a shared Play/Pause state.
- [ ] Next: source and verify CC0/public-domain ambient audio, then connect it to Enter and the shared pause state.

Main risk: the center attraction and side discovery anchors must remain visually distinct on short and narrow phones. Verification uses representative viewport screenshots plus direct Developer review; this checkpoint does not claim physical-phone verification.

Verification evidence: the local server returned HTTP 200 for the page, stylesheet, and script. A 500 × 844 browser capture confirmed the complete framed composition with no document scroll. The layout rules also include 320px-relative typography and a short-height adjustment; Windows headless browsers enforced a wider minimum layout viewport, so final narrow-phone verification remains assigned to the Developer in VS Code Browser Preview or on a physical phone.

Layer checkpoint evidence: the served HTML contains the particle and story-effect containers, exactly three reserved scene targets, and the transition curtain. A fresh 500 × 844 capture confirmed that the foreground and atmosphere layers frame rather than obscure the focal carousel, ticket booth, crow lamp, title, or Enter control.

Ambient-motion evidence: the page, CSS, and JavaScript each returned HTTP 200. Static checks confirmed eight animation timelines, the reduced-motion branch, the shared running/paused selector, and the `experiencepausechange` event. Two attempts to run a headless real-click verification were rejected by the local process safety policy, so Developer verification of Enter → Pause → Resume remains open in Browser Preview.

Revision: Developer requested stronger ambient effects. Fog density and travel, leaf and mote scale/contrast, carousel glow, and lamp flicker range were increased together while retaining the established timing and reduced-motion behavior.

Correction: follow-up review found that the nested rear fog lacked explicit absolute positioning and that the broad carousel halo changed too uniformly to read as a breathing light. The fog now uses positioned, uneven radial banks with larger/faster counter-motion; the carousel adds a canopy-aligned bulb strip and a shorter, higher-contrast brightness cycle.

Revision: the corrected carousel pulse was judged too prominent. Its halo opacity, bulb size, glow spread, brightness range, and scale change were reduced, while the cycle was slowed from 2.8 to 4.2 seconds. Fog and other ambient systems were left unchanged.

Revision — 2026-10-13: Developer requested a younger-audience version. A brighter family-fantasy background and gentler interface language replaced the darker default without deleting the prior asset. The next review should confirm that the result feels safe and inviting without becoming cartoonish.

Revision — 2026-10-13: the first younger version was judged too bright and its pumpkins too small. A second non-destructive background version reduces scene exposure and warm-light clipping while enlarging the two entrance pumpkin groups; composition and interface layout remain unchanged.

Ambience revision — 2026-10-13: expanded the falling-leaf system from five to nine varied leaves, changed the lamp from a short repetitive pulse to two brief flicker clusters in an 8.6-second cycle, and added eight independent fireflies around the enlarged pumpkin groups. Manual review should confirm that all three read clearly after Enter and freeze together on Pause.

Create your own checklist for the next few results, using the workflow in `brief.md` and the current `spec.md`. Name the main risk, what each checkpoint should produce, and how you will verify it. Review and approve the approach before implementation.

Test each result before continuing, including related behavior that already works. Update priorities as evidence emerges and preserve meaningful working checkpoints in git. Before delivery, verify the deployed app against the brief and specification.

## Evidence and revisions

Record non-identifying playtest observations, separating what Users did or said from your interpretation. Use the findings to choose revision priorities and record what changed and how you verified the improvement.

Keep implementation progress and verification here. Update `research.md` when evidence changes a decision and `spec.md` when intended behavior changes; link to those updates rather than duplicating them. Record consequential changes, not every small adjustment.

## Saving transcripts

When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md` or `transcripts/build-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
