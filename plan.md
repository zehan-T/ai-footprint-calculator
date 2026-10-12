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
- [ ] Developer reviews the composition in VS Code Browser Preview and on a narrow phone-sized viewport.
- [ ] Next after approval: add transparent effect layers and identify the first ambient system to implement.

Main risk: the center attraction and side discovery anchors must remain visually distinct on short and narrow phones. Verification uses representative viewport screenshots plus direct Developer review; this checkpoint does not claim physical-phone verification.

Verification evidence: the local server returned HTTP 200 for the page, stylesheet, and script. A 500 × 844 browser capture confirmed the complete framed composition with no document scroll. The layout rules also include 320px-relative typography and a short-height adjustment; Windows headless browsers enforced a wider minimum layout viewport, so final narrow-phone verification remains assigned to the Developer in VS Code Browser Preview or on a physical phone.

Create your own checklist for the next few results, using the workflow in `brief.md` and the current `spec.md`. Name the main risk, what each checkpoint should produce, and how you will verify it. Review and approve the approach before implementation.

Test each result before continuing, including related behavior that already works. Update priorities as evidence emerges and preserve meaningful working checkpoints in git. Before delivery, verify the deployed app against the brief and specification.

## Evidence and revisions

Record non-identifying playtest observations, separating what Users did or said from your interpretation. Use the findings to choose revision priorities and record what changed and how you verified the improvement.

Keep implementation progress and verification here. Update `research.md` when evidence changes a decision and `spec.md` when intended behavior changes; link to those updates rather than duplicating them. Record consequential changes, not every small adjustment.

## Saving transcripts

When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md` or `transcripts/build-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
