# Ghost Shift: Midnight Breach — browser edition

A single-player data-protection investigation set after midnight in Mumbai. Play Simon Ghost Riley, Meridian Dataworks' Data Protection Officer, trace the Blue Lantern export and make decisions about personal data across departments on floors 47–50.

Start Game opens the lift introduction. The post-arrival name reveal and objectives lead into optional beginner training. Shift Options provides timed or untimed play and 2, 3 or 5 cases. Each case contains three decisions; difficulty rises across the shift. Exact accuracy of at least 80% selects the heroic ending.

## Play and controls

Serve this directory over HTTP using Node.js: `node serve.mjs`. Open the local address printed by the server. Browser ES modules cannot be played through `file://`.

- WASD or arrows: move. Drag: look. Mouse Look in Field Tools optionally captures the cursor; Escape releases it.
- E or Interact: inspect a nearby object. Tab or Evidence Board: inspect/review documents and compare collected exhibits.
- Lift / Floors: choose a department. The HUD identifies the active case floor. The yellow overhead arrow identifies the active desk.
- Field Tools includes navigation shortcuts, arrival leads, colleagues, case thread, flashlight and other optional controls.
- Settings contains sound, graphics, accessibility and the field guide. High FX is the default; Low FX remains available for weaker hardware. No volume sliders.

Evidence records stay together on the active case desk and can be reread. The arrival desk holds all three opening leads, including the witness recording. Each case completion saves a local checkpoint; Resume Shift restores it with the evidence and score. Scores and history remain in this browser.

## Rendering and physics

Three.js renders the office and rigged civilian characters. Rapier 0.21.0 handles the capsule character's fixed-step 60 Hz movement and floor-filtered wall/furniture collisions, with interpolated rendering. NPC motion is paced to the recorded walk cycle, preserves the target skeleton proportions, pauses near the player and updates its collision footprint. Static geometry batching, cached occlusion bounds, adaptive 3D resolution, simple colliders and shared floor geometry limit cost on weaker hardware. A simpler collision fallback remains available if WebAssembly initialization fails.

All engine files, character files, textures and media are served locally. No Supabase client or multiplayer backend connection is opened in this release. See ASSET-NOTICES.md and the included license files.

## Validation

Run `node --test tests/*.test.mjs`. The suite covers scoring and endings, case progression, evidence content, balanced answers, checkpoint restoration, character material assignments and root motion, NPC routines, Rapier collisions, floor switching and frame-rate consistency. Browser smoke checks also cover menu/intro flow, tutorial practice, floor travel and evidence comparison. Automated checks are not a guarantee of bug-free play on every GPU.

## Hosting

The contents of this directory are static assets suitable for GitHub Pages or Cloudflare Pages. No build command or server-side application is required. Serve `.mjs` as JavaScript. The Rapier compatibility bundle embeds WebAssembly, so no separate WASM fetch or cross-origin isolation configuration is required.

The title screen uses an original SVG shield emblem and the tagline “Every decision leaves a trace.” The coastal road has lane-bound instanced cars, headlights and taillights. Aircraft remain separate from road traffic.

Dialogue subtitles show the speaker’s name and follow prerecorded speech. Toggle them in Accessibility. Crew members exchange short radio updates while exploring. Their names appear in conversations rather than above their heads.

The navigation diamond points to your active table, or the lift when the case is on another floor. The NEXT instruction changes as arrival clues and case records are collected. Every timed decision allows 50 seconds; the clock starts after the pre-question briefing is confirmed.

Simon Ghost Riley uses the supplied GLB character in the lift. Its browser copy is reduced to fewer than 50,000 triangles. The model has no skeleton or animation clips; the entrance uses a standing cinematic pose followed by first-person arrival.

Supplied scene assets: an animated Labrador companion can be greeted near the lift; Mira uses the supplied female model in a stationary office pose. The window overlooks the supplied night skyline with the imported road surface, pavement, railings, lamps and traffic lights around the moving coastal traffic. Short occasional banter lines are mixed into evidence, terminal, coffee and warning responses.

Chikku stays near the lift and uses the supplied model’s original animation. Walk close, look at him and press E to pet him: the first-person camera lowers and a suited hand strokes her head. The crew can greet him after petting. When another department holds the active case, Lift / Floors and its destination are highlighted yellow. Imported road vehicles are aligned to their lane direction.

The lift is enterable: walk into the cabin, aim at floor 47–50 on its wall panel and press E. Doors close for the ride and open at the destination. Lift / Floors provides an accessible cabin-entry shortcut. Field Tools → Stuck? Return to lift recovers your position on the current floor without changing evidence or score. Accessibility includes a persisted Playful Banter toggle. The shift report includes per-case evidence counts, follow-up actions and a downloadable text handover. Loading feedback reports actual preparation stages.

Department arrival cards explain the floor, next destination and the 50-second timing rule (or untimed mode). Field Tools → Case Journal keeps inspected records, unresolved case questions and the current next step together. Uninspected clue contents remain hidden. Evidence, lift and urgent warning sounds have distinct signatures alongside their visual guidance. The final DPO assessment highlights defensible reasoning and specific practice priorities. Simon’s prerecorded male voice is serious during investigation and gentler when greeting Chikku.

Case Operations at the active terminal adds an untimed source-comparison and containment sequence before each case’s first decision. Read the conflicting accounts and source records, inspect the three case exhibits, preserve a snapshot, scope BL-0116 and request Security’s hold. Unsafe decisions in earlier cases require an additional retry reconciliation in later cases. Tasks and checkpoint records stay in the browser. At shift end, an untimed deduction asks which explanation the recovered evidence supports; its feedback is recorded separately from the legal score and the 80% ending rule. The handover includes completed field actions and the final finding.

Colleagues remember the latest legal decision and acknowledge recovery after a mistake. Pet Chikku after the arrival clues to unlock her optional loose-slip investigation. The marked slip is beside the active case desk; compare it with the scheduler archive before recording a corroborated finding. Chikku keeps her original stationary animation. The lead persists through checkpoints and appears in the journal and handover. Short, prerecorded DPO thoughts play only during exploration after sufficient walking and a cooldown; joke clips respect Playful Banter, while factual hints remain available. Chikku is greeted as “good girl.”

After a wrong-call warning finishes, a randomized named NPC radio roast plays when Playful Banter is enabled. Acknowledging early can trigger it sooner, without replaying the roast for that decision. The warning and explanation come first; roasts do not alter penalties or queue across decisions. Disabling Playful Banter suppresses both walking jokes and NPC roasts while retaining useful hints and serious warnings.
