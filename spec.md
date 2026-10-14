# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep a concise, testable description of the experience currently being built.

## Working agreement

Developer: Begin with the running prototype, approve the intended behavior, test it directly, and update this file when the intended result changes.

Agent: Read `AGENTS.md`, `brief.md`, `research.md`, and this file, then inspect the project. Turn decisions into acceptance checks without inventing product choices or freezing details that still require testing.

Start a fresh chat with:

`Read the project documents, inspect the running prototype, and help me specify the next useful build checkpoint.`

## Current build contract

### Background and layout checkpoint — approved 2026-10-12

- Present one responsive, non-scrolling portrait scene: the entrance to Moonlight Midway at night.
- Use a 390 × 844 reference composition that remains usable from 320–430 CSS pixels wide, respects device safe-area insets, and expands into a framed phone presentation on larger screens.
- Keep the carousel centered and visually dominant. Keep the ticket booth and crow lamp distinct at the lower left and right. Preserve readable silhouettes for the moon, distant roller coaster, entrance gates, fog, and foreground terrain.
- Begin on an accessible start overlay with the experience title, short invitation, audio expectation, and a minimum 48px Enter control. Enter reveals the static scene HUD and hint position.
- Reserve a top HUD for the park mark, progressive hint copy, and Play/Pause control; reserve the bottom safe area for temporary captions. The Play/Pause control remains visibly disabled until its system is implemented.
- Use an original AI-generated cinematic background with restrained CSS grading and fog overlays. Avoid flat vector, toy-like, brightly saturated, or overtly cartoon styling. Ambient animation, audio, story sequences, and live scene-object interactions are excluded from this checkpoint.

Acceptance checks:

- No document scroll or unintended cropping at 320 × 568, 390 × 844, and 430 × 932 viewports.
- The focal carousel and both future interaction anchors remain identifiable at every target size.
- Start-screen copy maintains sufficient contrast and the Enter button works with touch, pointer, Enter, and Space through native button behavior.
- Reduced-motion preference is honored before later motion is introduced.

### Initial layer structure — approved 2026-10-12

- Separate the flattened environment background from atmospheric back effects, particle placeholders, story effects, foreground silhouettes, interaction targets, persistent interface, captions, and the scene-transition curtain.
- Reserve noninteractive hit regions over the ticket booth, carousel, and crow lamp. They remain outside keyboard navigation and ignore pointer input until their trigger behavior is specified.
- Keep the atmospheric elements static during this checkpoint; their DOM and stacking order are preparation for the ambience checkpoint, not an implied animation design.

### Ambient motion and shared pause — approved 2026-10-12

- Start ambient motion only after the User activates the Enter button.
- Run three coordinated ambient systems: layered horizontal fog/cloud drift, slowly falling leaves with floating warm motes, and restrained practical-light variation at the carousel and crow lamp.
- The persistent Play/Pause control freezes and resumes every ambient animation together and updates its icon, accessible label, and pressed state. It also emits one shared `experiencepausechange` event for later audio, story timers, and interaction systems.
- If `prefers-reduced-motion: reduce` is active, keep all ambient layers static from the beginning; the scene and controls remain usable.

### Younger-audience variant — approved 2026-10-13

- Broaden the presentation toward approximately ages 7–10 while retaining the approved location, composition, realistic medium, and discovery structure.
- Favor magical mystery over threat: brighter moonlit color, warm practical lights, maintained surfaces, gentle mist, autumn decorations, and reassuring invitation language.
- Avoid menacing figures, hostile expressions, severe decay, oppressive darkness, frightening language, gore, violence, and realistic suffering.

### Younger-audience ambience — approved 2026-10-13

- Show nine varied falling leaves crossing the upper and middle scene with staggered timing, size, and start positions.
- Make the crow lamp hold a steady glow most of the time, interrupted by two brief irregular-looking flicker clusters in each long cycle.
- Add a third distinct effect: eight warm fireflies gathering near the left and right pumpkin groups, moving slowly with independent brightness and paths.
- Keep all three systems inside the shared ambient class so Play/Pause and reduced-motion settings control them together.

Define only enough to build and verify the current direction:

- the intended User experience and chosen scene, ambience, and story behavior
- the system structure, shared rules, and states that keep audiovisual behavior and interaction coordinated
- the assets and layout needed for that structure, linking to sources and credits in `research.md`
- acceptance checks for the chosen behavior and every requirement in `brief.md`, including accessibility and failure behavior

Reference the brief's fixed requirements rather than copying them. Specify your decisions precisely enough that the Developer and Agent can judge the same result. Leave untested details open until they are needed, and distinguish provisional ideas from approved behavior.

## Scope and revisions

Record excluded ideas, the next behavior that must work, and consequential requirement changes with their evidence.

## Saving the transcript

When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
