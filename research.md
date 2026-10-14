# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep the evidence and creative decisions that currently guide the build.

## Working agreement

Developer: Run the starter first. Direct the inquiry, judge sources and options, make consequential decisions, and keep this file current.

Agent: Read `AGENTS.md`, `brief.md`, and this file, then inspect the project. Help compare possibilities, test assumptions quickly, and verify external sources without delaying the prototype for exhaustive research.

Start a fresh chat with:

`Read brief.md and research.md, inspect the running project, and help me develop the scene and three spooky stories.`

## Inquiry and decisions

### Approved scene direction — 2026-10-12

- Chosen concept: an abandoned theme-park entrance called Moonlight Midway, centered on a softly glowing haunted carousel.
- Visual direction: original 2D storybook/cut-paper graphics, using deep indigo, pumpkin orange, aged gold, and ghost green. This keeps the scene playful for ages 10+ while providing strong silhouettes and layer separation for later animation.
- Composition: moon and roller-coaster silhouette in the far background; carousel as the central focal point; ticket booth and crow-topped lamp as left/right discovery anchors; gates, grass, and fog frame the foreground.
- The three visual anchors reserve space for later story triggers without specifying their final interaction sequences yet.
- All current artwork is original inline SVG and CSS, so this checkpoint has no external visual-asset credits.
- Alternative considered: a midnight pumpkin train station. The midway was selected because it communicates the physical theme-park destination more immediately.

### Visual-style revision — 2026-10-12

- Developer feedback rejected the initial cut-paper/cartoon treatment and requested greater realism.
- The composition remains unchanged, but the approved treatment is now cinematic environmental realism: weathered wood, tarnished brass, wet ground, natural fog, moonlight, and practical tungsten bulbs.
- The background is an original AI-generated raster asset at `assets/backgrounds/moonlight-midway-realistic-v1.jpg`, encoded as a high-quality JPEG for mobile delivery. It contains no baked-in text, brand, people, violence, or gore; interface copy remains accessible HTML.

### Display typeface — 2026-10-12

- Developer feedback requested a more distinctive treatment for the `Hallo“weenie”` title.
- Pirata One was tested and rejected as too strongly gothic.
- The title now uses Rye, a decorative serif display face with an aged carnival-poster character, self-hosted from the [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/rye).
- Rye is distributed under the SIL Open Font License 1.1; the repository includes the license at `assets/fonts/rye/OFL.txt`. It is limited to the main title so body copy and controls remain highly readable.

### Younger-audience visual variant — 2026-10-13

- Developer requested a version that preserves the Moonlight Midway concept while feeling appropriate for children younger than the original 10+ target.
- The selected treatment remains cinematic and materially realistic, but changes the emotional cues: a brighter blue-violet sky, maintained attractions, warm autumn foliage, friendly pumpkin lanterns, golden firefly lights, thinner magical mist, and reduced decay and threatening shadow.
- The new original AI-edited asset is `assets/backgrounds/moonlight-midway-younger-v1.jpg`. The previous darker asset remains at `assets/backgrounds/moonlight-midway-realistic-v1.jpg` as a recoverable alternate.
- Interface language now emphasizes adventure, magical surprises, lights, and shared secrets rather than restless spirits or a park that “remembers.”
- Follow-up review found the first younger-audience version too bright. Version 2 lowers the overall exposure and orange highlight intensity while enlarging the existing left and right entrance pumpkins to approximately twice their previous size. The active asset is `assets/backgrounds/moonlight-midway-younger-v2.jpg`; version 1 remains available for comparison.

### Ambient audio — 2026-10-13

- Selected `night ambience` by Freesound user seth-m: a 3.604-second stereo recording of crickets and low wind that the author describes as seamlessly looping. Source: https://freesound.org/people/seth-m/sounds/275640/
- The source page identifies the recording as Creative Commons Zero (CC0) and explicitly permits copying, modification, distribution, and performance without permission. License details were verified on 2026-10-13. Attribution is not required by CC0, but the project retains the creator and source credit.
- The project stores Freesound's public high-quality MP3 preview locally as `assets/audio/night-ambience-seth-m-275640.mp3` (about 86 KB), avoiding a runtime network dependency. Its short duration keeps mobile loading light; the trade-off is that the ambience must remain quiet enough that repetition is not distracting.

### Halloween music layer — 2026-10-14

- Developer approved the ambience volume but requested a more recognizably Halloween musical layer. Selected `Spooky Halloween Soundtrack` by MusicByMisterbates, an original 56.489-second multi-instrument track. Source: https://freesound.org/people/MusicByMisterbates/sounds/677436/
- The source page marks the track Creative Commons Zero (CC0), permitting copying, modification, distribution, and performance. The author also asks users to identify the work as `Misterbates — Spooky Halloween`; the project will preserve that voluntary credit.
- The public high-quality MP3 preview is stored locally as `assets/audio/spooky-halloween-misterbates-677436.mp3` (about 1.25 MiB). After listening review, the music plays at 13% volume and the cricket-and-wind layer at 18%, making the combined mix fuller while retaining headroom for later story sounds.

### First story sound effects — 2026-10-14

- The ticket-booth story uses `Ticket machine printing a ticket` by Licorne_En_Fer for immediate tap feedback. The author describes it as a Zoom H6 recording and explicitly releases it under CC0. Source: https://freesound.org/people/Licorne_En_Fer/sounds/772976/
- Its magical reveal uses `GLEAM-GLOW-SFX-CHIME.wav` by newagesoup, a 5.381-second left-to-right chime-tree glimmer released under CC0. Source: https://freesound.org/people/newagesoup/sounds/351408/
- Public high-quality MP3 previews are stored locally as `assets/audio/ticket-print-licorne-en-fer-772976.mp3` and `assets/audio/gleam-chime-newagesoup-351408.mp3`. Both are credited despite CC0 not requiring attribution.

Record only what informs the next build decisions:

- creative alternatives for the scene, stories, and audiovisual direction, with reasons for your choices
- useful sources and references, what they support, and important limitations
- experiments that resolve uncertainty, the results, and consequential trade-offs

Investigate unfamiliar techniques or asset sources as needed. Verify usage terms and keep source links and required credits here. Distinguish evidence from assumptions; the Agent's recommendation alone is not evidence.

## Revisions

Update decisions when new evidence changes the direction, linking to playtest observations in `plan.md` rather than copying them. Keep chosen behavior and asset requirements in `spec.md`. The Developer confirms when the inquiry is sufficient to continue building; exhaustive research is not a prerequisite.

## Saving the transcript

When directed, save the complete conversation as `transcripts/research-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
