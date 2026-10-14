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
- Keep the carousel and ticket-booth lighting fixed with no added pulse, blackout, or brightness animation. Instead, four paper tickets occasionally lift behind the booth glass, rotate through distinct paths, and settle out of sight. Ticket motion remains part of the shared ambient state and may later act as a discovery clue.

### Ambient audio and shared pause — approved 2026-10-13

- Load one quiet, local CC0 loop of crickets and low wind, but do not play it before the User presses Enter.
- Enter starts the audio and ambient animation together. Play/Pause pauses and resumes both without resetting the audio position.
- Keep the loop at a restrained default volume so it supports the scene without masking later story sounds.
- If loading or autoplay fails, keep the visual experience usable and replace the scene hint with a polite live-region message that the midway is quiet tonight.

### Halloween music layer — approved 2026-10-14

- Layer a gentle CC0 Halloween score under the existing cricket-and-wind ambience so the scene reads more clearly as Halloween without becoming frightening for younger children.
- Balance the two local tracks at 13% music and 18% ambience. Both begin only after Enter, loop independently, and obey the same Play/Pause state without resetting.
- If either track fails, allow the other to continue. Show the quiet-night fallback only when both tracks are unavailable.

### Story 1: The Moonlight Pass — implemented for review 2026-10-14

- Make the old ticket booth the first discoverable story trigger. Three taps or keyboard activations reveal three ticket-progress marks; each activation produces a brief booth highlight, ticket-machine sound, distinct progress copy, and updated accessible label.
- On the third activation, lock every scene target and play a 7.2-second sequence with a clear arc: the booth wakes, eight golden tickets spiral into a glowing `Moonlight — Admit One` pass, and the pass rises and fades back into the night.
- Duck both ambient tracks during the story, play one CC0 magical chime at the reveal, restore the mix afterward, and reset the three-step trigger so the full story can replay without reloading.
- Progressively reveal two timed hints at 7 and 15 seconds if the User has not engaged the booth. Pause and resume the hint timers, story timers, CSS animation, story audio, ambience, and scene interaction together through the existing control.
- With reduced motion enabled, replace ticket movement with a stationary booth glow and centered pass while preserving timing, sound, progress, keyboard operation, and replay.

### Story 2: The Midnight Ride — implemented for review 2026-10-14

- Divide the carousel into three large, keyboard-accessible horse targets. Finding each distinct left, center, or right horse produces a wind-up sound, persistent golden horseshoe marker, accessible progress update, and unique hint copy; already-found horses cannot increment progress twice.
- After all three horses are found in any order, lock every scene target and play an eight-second sequence: the carousel wakes, twelve practical lights and three horseshoe sparks orbit its canopy with soft gallop audio, and a `Midnight Ride` medallion appears before the attraction returns to stillness.
- Duck ambient audio during the sequence, restore it afterward, and reset all three horse targets so the complete trigger and story are replayable without a reload. Story 1 progress must survive if it was partially discovered before Story 2 begins, and vice versa.
- Provide timed carousel hints at 10 and 19 seconds when untouched. Global Play/Pause must freeze and resume story animation, sound, timing, hints, and interaction as one state.
- With reduced motion enabled, show a stationary carousel glow and centered medallion rather than rotation or orbital movement while preserving the eight-second narrative timing.

### Story 3: The Moonlit Beacon — implemented for review 2026-10-14

- Use one large keyboard-accessible target over the crow perched above the right-side lamp. One activation immediately locks every scene target and begins the eight-second story; no multi-step progress or ordered lamp interaction is required.
- During the story, the lamp casts a restrained beam, the crow flies toward the moon with seven drifting feathers and wing audio, and a `Moonlit Beacon` seal appears before the lamp returns to its ambient state.
- Use a crow call at the opening and created wing-flap audio for the flight. Duck and restore ambience around the story, make the crow available for replay afterward, and preserve partial progress in the other two stories.
- Provide timed hints at 13 and 23 seconds if untouched. Global Play/Pause must freeze and resume story motion, audio, timing, hints, and interactions as one state.
- With reduced motion enabled, replace the flight, feathers, and moving beam with a stationary lamp glow and seal while retaining the narrative timing, sound, one-click trigger, and replay behavior.

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
