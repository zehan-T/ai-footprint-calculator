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
- [x] Source and verify CC0/public-domain ambient audio, then connect it to Enter and the shared pause state.
- [x] Design and implement the first 5–10 second audiovisual story and its discoverable trigger.
- [x] Developer reviews the first story's overall direction in Browser Preview and approves continuation.
- [x] Design and implement Story 2 around three distinct carousel-horse targets.
- [x] Developer reviews Story 2's target placement, pacing, motion, and sound balance in Browser Preview.
- [x] Design and implement Story 3 around the crow lamp.
- [ ] Developer reviews Story 3's ordered targets, visual restraint, pacing, and sound balance in Browser Preview.
- [ ] Next after approval: perform final integration, add visible credits, and verify all brief requirements.

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

Ambience correction — 2026-10-13: removed the carousel halo, bulb strip, and breathing keyframes completely. The carousel now remains visually fixed. A positioned ticket-booth window overlay instead creates one short blackout cluster in an 11.2-second cycle and remains connected to shared pause/reduced-motion control.

Ambience correction — 2026-10-13: Developer rejected the ticket-booth blackout and selected windblown paper tickets. The blackout overlay and keyframes were removed. Four small paper tickets now appear intermittently behind the booth window, rise and rotate on staggered paths, then settle out of view; booth and carousel lighting remain fixed.

Ambient-audio checkpoint — 2026-10-13: added a local 86 KB CC0 loop of crickets and low wind, sourced and documented from Freesound. Enter begins playback at 18% volume; the shared Play/Pause control pauses and resumes it without resetting. A load/playback failure leaves the visuals running and reports a quiet-night fallback through the existing live caption. The refreshed local preview returned HTTP 200 for both page and MP3, served the file as `audio/mpeg`, and exposed the expected loop and control wiring. This environment has no Node runtime or controllable browser automation, so Developer verification that audio begins only after Enter and follows two Pause/Resume cycles remains open in Browser Preview.

Audio revision — 2026-10-14: Developer approved the initial ambience volume but requested clearer Halloween character. Added a second local CC0 track, `Misterbates — Spooky Halloween`, at 9% volume and reduced the cricket-and-wind layer to 14% to preserve a restrained combined mix. The shared audio controller now starts, pauses, and resumes both tracks and tolerates either source failing independently. The running preview returned HTTP 200 and `audio/mpeg` for both local tracks, and static checks confirmed both are wired into shared start/pause/resume control. Developer listening review remains open.

Mix revision — 2026-10-14: Developer requested a louder overall mix. Raised ambience from 14% to 18% and music from 9% to 13%, preserving the established balance while retaining headroom for later story effects.

Physical-phone preview — 2026-10-14: added `scripts/serve-lan.ps1`, a local-network preview server that binds without administrator-only HTTP.sys registration and supports byte-range audio requests. The current Wi-Fi URL returned HTTP 200 for the page and HTTP 206 with the correct `Content-Range` for a music request. Direct Developer verification on the phone remains open and requires the phone and computer to share the same Wi-Fi network.

Story 1 checkpoint — 2026-10-14: implemented `The Moonlight Pass` as a replayable three-activation ticket-booth discovery followed by a 7.2-second beginning/middle/end sequence. It includes visible and accessible progress, timed progressive hints, two verified local CC0 effects, story-time interaction locking, ambient ducking, shared pause for CSS/audio/timers, and a reduced-motion presentation. The running preview returned HTTP 200 for HTML, CSS, JavaScript, and both new MP3 files with correct MIME types; static checks confirmed eight story tickets, three progress marks, three story keyframes, and the reduced-motion branch. Browser review of the actual interaction and pacing remains open.

Story 1 review — 2026-10-14: Developer responded “很好” and requested continuation without a revision, approving the current direction for the next checkpoint.

Story 2 checkpoint — 2026-10-14: implemented `The Midnight Ride` using three distinct carousel-horse targets, persistent per-horse feedback, visible and accessible progress, two timed hints, and an eight-second replayable sequence. The story adds orbiting practical lights, golden horseshoe paths, a final ride medallion, two local CC0 effects, cross-story interaction locking, shared pause behavior, and a reduced-motion presentation. The running preview returned HTTP 200 for HTML, CSS, JavaScript, and both new MP3 files with correct MIME types; static checks confirmed three targets, twelve ring lights, three horseshoe effects, the eight-second finish timer, cross-story guards, and the reduced-motion branch. Browser review remains open.

Story 2 review — 2026-10-14: Developer responded “很好，继续” and requested the next checkpoint without revision, approving the current target placement, pacing, motion, and sound balance.

Story 3 checkpoint — 2026-10-14: implemented `The Moonlit Beacon` as a forgiving ordered discovery across crow, lantern, and post targets followed by an eight-second replayable sequence. It adds persistent moonlit progress, non-resetting out-of-order guidance, lamp beam, crow flight, seven drifting feathers, final beacon seal, three verified local CC0 effects, cross-story locking, shared pause behavior, and a reduced-motion presentation. The running preview returned HTTP 200 for HTML, CSS, JavaScript, and all three new MP3 files with correct MIME types; static checks confirmed three ordered targets, three progress marks, seven feathers, the eight-second finish timer, and the reduced-motion branch. A Windows headless capture again enforced a wider minimum layout viewport, so direct Browser Preview review of the interaction and phone framing remains open.

Create your own checklist for the next few results, using the workflow in `brief.md` and the current `spec.md`. Name the main risk, what each checkpoint should produce, and how you will verify it. Review and approve the approach before implementation.

Test each result before continuing, including related behavior that already works. Update priorities as evidence emerges and preserve meaningful working checkpoints in git. Before delivery, verify the deployed app against the brief and specification.

## Evidence and revisions

Record non-identifying playtest observations, separating what Users did or said from your interpretation. Use the findings to choose revision priorities and record what changed and how you verified the improvement.

Keep implementation progress and verification here. Update `research.md` when evidence changes a decision and `spec.md` when intended behavior changes; link to those updates rather than duplicating them. Record consequential changes, not every small adjustment.

## Saving transcripts

When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md` or `transcripts/build-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
