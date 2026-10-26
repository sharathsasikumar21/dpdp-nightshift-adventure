# Ghost Shift: Midnight Breach


Play: https://sharathsasikumar21.github.io/dpdp-nightshift-adventure/3d/

A retro terminal privacy noir in a navigable 3D operations centre. Ten linked three-part stories explore notice, consent, withdrawal, children, vendors, breaches, rights, retention, overseas transfers and audit evidence. Select 2, 3 or 5 stories (6, 9 or 15 decisions). The original `app/` is retained as a separate legacy implementation.

## Play

WASD or arrows move; drag to look 360 degrees; Q/R turn; E inspects the active terminal. Touch movement and an accessible Navigate to case button are provided. Headphones enable ambient operations-room sound and distinct correct/incorrect cues. Low FX lowers resolution. A readable terminal fallback works if WebGL is unavailable.

Solo: decisions and reviews are untimed. Each story has a manual coffee break. Only completed stories enter the browser's history; unseen stories are preferred. After ten cases, replay remains available. Solo score history is browser-local.

Online: enter a temporary username, create or join a six-character Supabase room, then the host starts. At most three players are admitted. All players answer the same question, and each response locks once. The host resolves immediately after all answers arrive, or at the 60-second wall-clock deadline. Missing players receive a wrong-answer penalty. An eight-second result display follows each decision (all players ready advances sooner). There are **no multiplayer mission breaks**. Every result remains available in the final review.

## Interactive floor

Two maintenance drones patrol the room; tapping one makes it hover and reverse direction. Click or tap a nearby workstation to inspect it, the city hologram to send a radar pulse, or the coffee machine for a steam response. E interacts with the object at the centre of your view. The Scan room control also works with keyboard and touch. Moving data packets, terminal sweeps, a rotating hologram and street traffic animate the background. Correct and wrong decisions briefly change the active terminal’s glow and scan colour. Reduced-motion preferences stop ambient movement; Low FX cuts particle density and rotor animation. These effects do not change scores or multiplayer timers.

## Scores and username privacy

Correct: +100 points, with +25 from the third consecutive correct answer. Wrong/timeout: -40 points, floored at zero. Integrity starts at 70 and moves +8/-14, bounded to 0–100. Streak resets on a miss. Five named levels span Desk Rookie to Nightshift Legend. The live and final room leaderboard ranks points, integrity, then correct decisions.

Usernames, online scores and room snapshots are held only in browser memory and sent via Supabase Realtime Broadcast. This version does **not** insert them into a database, localStorage or sessionStorage. Closing the leaderboard clears the session; it also closes automatically after five minutes. The host closing ends the room for everyone; a guest closing ends their participation and clears the other connected sessions. Participants can see names during play. Supabase transports traffic and its platform-level operational metadata is outside the client’s control.

The public `nightshift_scores` table from the older version is not used or modified. `supabase/setup.sql` is retained as historical setup, not required by this rebuild. The public project URL and publishable key in `supabase-config.js` are intended for browser use; no service-role key is present.

Rooms are casual cooperative sessions, not an authenticated tournament: the host browser coordinates state, and public room broadcasts are not cheat-resistant or private. Keep the host tab open. Lost host heartbeat ends the session, and no incomplete story is marked completed. Wall-clock deadlines reject late submissions even after background throttling; a suspended host cannot render a result until it resumes or clients declare it disconnected.

## Legal scope

The fictional incidents assume the relevant provisions have commenced and apply. The UI explicitly qualifies phased commencement as at 7 October 2026. Check the official Act, Rules, their exemptions and applicable sector law rather than treating every case as a universal rule.

- [DPDP Act 2023](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf)
- [DPDP Rules 2025](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf)
- [Act commencement notification, G.S.R. 843(E)](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf)

Notable corrections include Rule 7’s initial notice without delay versus the later 72-hour Board detail submission; retention exceptions including Rule 8(3); transfer restrictions plus Rule 15; and section 15(e) for authentic rights-request information. This is education, not legal advice.

## Development

The `/3d/` site is static, with pinned local Three.js 0.180.0 and Supabase JS 2.57.4 dependencies and their licences. Fonts use Google Fonts with system fallbacks. No npm install or build step is required.

```sh
cd 3d
node serve.mjs
node --test tests/*.test.mjs
```

Open http://127.0.0.1:4173. The pure engine handles scoring, caps, deadlines and solo progression. `online.js` handles room admission and snapshots; `app.js` owns screens and multiplayer progression; `world.js` renders the environment. `stories.json` is the runtime case archive. `enrich.mjs` regenerates it from the retained original stories plus narrative/legal refinements.

Deployment uses the existing public GitHub Pages site from `main`. No community-feed publishing is part of this workflow.

## Cinematic films

The opening and end credits are original, locally hosted H.264/AAC MP4 films, each exactly 14 seconds at 960×540 / 24 fps. The rain, layered skyline, data traces, typography and synthesised score are generated by tools/render-cinematics.py (Pillow, NumPy, imageio-ffmpeg; Windows Bahnschrift and Consolas fonts). No external stock assets or player information appear in the films. Team credits: SHA/020 (male), Niks/141 (female), and Rip/911 (female), represented by three original animated brick-style toy figures.

The opening plays muted on initial load, before a player enters a room; Enable sound is optional. End credits play once at shift completion before returning to the incident review / leaderboard, with replay buttons on the home and results screens. Skip and Escape always return immediately. Reduced-motion users get a still poster and an explicit Play option. Playback errors dismiss the film; a 15-second watchdog prevents stalled media from blocking play. Online question clocks and the five-minute leaderboard expiry are unchanged.

## Wrong-answer warnings

Unsafe decisions and timeouts show a prominent consequence alert, the safer response, and actual before/after points, integrity and streak. Existing penalties remain −40 points (floor 0), −14 integrity (floor 0), and a reset streak. Repeated mistakes escalate the warning; three consecutive mistakes or integrity at/below 30 shows a critical alert. A reminder persists into the next question. Solo players acknowledge the warning before continuing; multiplayer keeps its 60-second question and 8-second review schedule. A short descending alert respects the sound toggle; warnings do not flash.

## Accuracy-based endings

Each player receives their own 14-second ending at shift completion: at least 80% correct earns the heroic dawn / shield film and rising score; below 80% gets the dark surveillance / trust-lost film and ominous score. The threshold uses the exact fraction, not rounded percentages or points; timeouts count as incorrect. Minimum correct counts are 5/6, 8/9 and 12/15. Team credits follow either ending, then the debrief remains available. Replay your ending replays the earned outcome only. Both films support Skip, sound controls, reduced-motion still posters, and playback failure fallback.

## Cyberpunk investigation update

Ten case-specific ten-second camera cutscenes introduce intercepted transmissions, three narrative beats and thirty collectable evidence exhibits. Evidence remains available during decisions without pausing their clock. Thirty scenario questions use plausible distractors and choice-specific explanations. Solo timed play progresses through 90, 75 and 60 second deadlines; untimed play remains available. Multiplayer briefings finish before the full 60-second clock starts.

Original procedural textures, reflections, cyan/magenta lighting and furnished workstations build the cyberpunk environment. The Web Audio score changes with briefings, urgency, integrity and outcomes, respects Sound off, and suspends while hidden. Low FX and reduced motion remain supported.

## First-person environment rebuild

The operations floor now uses human-scale wooden desks, rounded monitors and task chairs, fabric partitions, printed evidence documents, recessed ceiling fixtures, glass dividers, rain and a night skyline. Original procedural colour/bump textures, physical material roughness, environment reflections, dynamic shadows and contact shadows replace the oversized neon scene.

Walk with WASD/arrows, turn with Q/R or drag, interact with E, toggle crouch with C, hurry with Shift and toggle the flashlight with F. Mouse look requests pointer lock where the browser allows it; Escape releases it. Drag and touch controls remain available. UI panels release mouse capture automatically. Collision uses small movement steps and slides along furniture. Reduced motion disables head bob and movement FOV changes. There are no weapons or shooting mechanics.

### FPV interaction completion

Scan Room outlines the assigned monitor for eight seconds; a yaw-aware bearing and distance guide players through the office. Mobile players can crouch/stand and switch graphics quality. Evidence targeting resolves printed surfaces and clips to the parent document and ignores hidden ancestors after collection. Closing the evidence board restores focus to its opener.

### Simon 'Ghost' Riley elevator arrival

An original fourteen-second real-time elevator opening introduces Simon 'Ghost' Riley, the Data Protection Officer, on the way to the operations floor. The floor counter reaches 47, doors open before the camera moves through the entrance, and only identity and arrival captions appear during the ride. The objective dialog appears after the viewpoint exits the lift. Skip and Escape complete arrival and open that objective; acknowledging it returns to mode selection. Optional gesture-enabled original elevator hum and arrival chime have a separate mute control. Reduced-motion users see a stationary viewpoint. The introduction does not use any question time. Existing outcome films and team credits remain available.

### Visual polish

A unified slate, ivory and brass interface covers menus, decisions, evidence and results. The office has acoustic wall bays, warm light pools, frosted glass safety bands, corridor markers and floor-27 wayfinding. Repeated keyboard keys use instancing to reduce draw calls. Low FX hides optional light-pool and glass-band details. The entry objective waits for arrival completion, including when the lift is skipped.

The lift now receives a priority Control transmission for Simon 'Ghost' Riley, summoning the DPO to Incident Operations on floor 47. Its transcript appears during the ride. Enable sound / Receive call plays dispatch tones, a brief radio squelch and the call using an available browser speech voice. Muting, skipping or completing the lift stops the voice. Speech availability and voice quality depend on the browser/device; the transcript remains available without speech.

## Nighttime identity and tributes
The current local 3D version introduces Simon 'Ghost' Riley of TaskForce 141 at Meridian Dataworks, floor 47, Nariman Point, Mumbai, at 02:17 AM. The waterfront and mixed-height skyline are fictional Mumbai-inspired geometry, with apartments, balconies, stepped roofs, tanks, and glass offices. Airliners and a helicopter follow slow sky routes; the previous floating car effects are disabled. Reduced-motion preferences freeze aircraft animation.

Five original typographic wall posters acknowledge Watch Dogs 2, Red Dead Redemption 2, Detroit: Become Human, Cyberpunk 2077 and Call of Duty: Modern Warfare. Approach and click or press E; Game Tributes also provides accessible text. Three colleagues provide randomized investigation hints, also available through Ask a Colleague. Reading these cards does not pause decision deadlines.

Opening credits acknowledge Three.js, Supabase Realtime, Google Fonts and GitHub Pages. Technology Credits also names Pillow, NumPy and imageio-ffmpeg / FFmpeg used for locally rendered media. Cloudflare belongs to the separate app implementation and is not credited as powering /3d/. Third-party credits do not imply endorsement.

All scenarios explicitly assume every phase of the DPDP Act and 2025 Rules is in force in the fictional game setting. This is a simulation assumption, not a statement about today's commencement status. Existing fact-specific exceptions remain in the case answers.

The radio uses a locally hosted ElevenLabs Sarah recording (v4 Turbo, final generation: 46 credits) with a stern delivery. Ghost is summoned to the Incident Operations Room. Playback never calls ElevenLabs or consumes generation credits. Browser speech is retained as a load-failure fallback. Music uses an original locally rendered 32-second suspense loop with adaptive Web Audio accents. It pauses in hidden tabs, mutes during films, and follows the sound toggle. Generate the MP3 with tools/render-score.py (NumPy and imageio-ffmpeg). No external generation credits or runtime API calls are required.

### Desktop investigation update

Simon 'Ghost' Riley remains the protagonist tribute. The fictional employer is now Meridian Dataworks. Solo shifts begin with three arrival leads: an expired visitor badge, a conflicting door log, and Mira’s account. Inspect them in the office or through Arrival leads; no question time is consumed. Multiplayer keeps its existing shared briefing and 60-second decisions.

Collected case sources appear beside the relevant question. Unsafe calls raise a per-player security level (0–3); at level 2 the case locator and coffee service are restricted. A defensible call lowers it one level. Amber office lighting and colleague dialogue reflect this state. Essential evidence, manual navigation and questions remain available.

Colleagues have restrained idle movement and nearby eye contact; reduced-motion settings suppress idle animation. Original stereo footsteps, distant phone and rain textures accompany exploration. Evidence discovery briefly ducks the score. These sounds use Web Audio with the existing mute, hidden-tab and film controls; no generation credits are used.

### Separate music cues and technology footer
The 32-second Midnight Breach gameplay loop uses low toms, pulsing bass and bowed synth harmonics. The separate 14-second elevator/title cue builds from a title swell to the arrival. The intro defaults to Enter Shift · Sound On and waits for a user gesture so the title cue is not lost to autoplay restrictions. Sound starts enabled on every fresh load; mute remains available after starting. Intro music stays quiet beneath the radio, and stops on mute, skip or exit. Both tracks are original local synthesis, rendered by tools/render-score.py; no paid generation service is used.

The home-page footer shows Powered By: with locally hosted Simple Icons logos linking to Three.js, Supabase, Google Fonts, GitHub Pages and ElevenLabs. Logos sourced from https://github.com/simple-icons/simple-icons (CC0); brand marks belong to their respective owners. No Cloudflare credit is shown because the /3d/ deployment does not use it.

### Supplied gameplay soundtrack
The active gameplay score is now gameplay-renith.m4a, extracted losslessly from the supplied background renith.mp4 (approximately 28.7 seconds, stereo AAC). The complete decoded track loops; the old 32-second loop limit is removed. The separate elevator-title.mp3 and Control recording remain. Procedural musical notes and drone are fallback-only when the supplied track cannot load; urgent cues and environmental effects remain active. The original render-score.py does not overwrite the supplied file.

### Soundtrack starts at the opening
The supplied Renith track starts from its beginning on the first sound-enabled gesture during the title/lift scene. The same audio source continues through the home screen and gameplay without restarting. Arrival volume is reduced beneath the Control call. The previous separate elevator music is no longer played. Ending films still mute the background score.

### Louder elevator music, no Control voice
The supplied soundtrack now plays at 0.8 gain in the elevator and gameplay (previously 0.09 and 0.18); briefings and breaks use 0.4 gain. Playback begins at track time zero on the initial sound-enabled gesture in the elevator. The Control voice, radio tones and transcript have been removed from the active arrival scene; the elevator hum and door chime remain. ElevenLabs is removed from the active technology footer.
