# DPDP Nightshift — Operations rebuild

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

The opening and end credits are original, locally hosted H.264/AAC MP4 films, each exactly 14 seconds at 960×540 / 24 fps. The rain, layered skyline, data traces, typography and synthesised score are generated by tools/render-cinematics.py (Pillow, NumPy, imageio-ffmpeg; Windows Bahnschrift and Consolas fonts). No external stock assets or player information appear in the films. Team credit: Rips, Niks and SharkBytes.

The opening plays muted on initial load, before a player enters a room; Enable sound is optional. End credits play once at shift completion before returning to the incident review / leaderboard, with replay buttons on the home and results screens. Skip and Escape always return immediately. Reduced-motion users get a still poster and an explicit Play option. Playback errors dismiss the film; a 15-second watchdog prevents stalled media from blocking play. Online question clocks and the five-minute leaderboard expiry are unchanged.

## Wrong-answer warnings

Unsafe decisions and timeouts show a prominent consequence alert, the safer response, and actual before/after points, integrity and streak. Existing penalties remain −40 points (floor 0), −14 integrity (floor 0), and a reset streak. Repeated mistakes escalate the warning; three consecutive mistakes or integrity at/below 30 shows a critical alert. A reminder persists into the next question. Solo players acknowledge the warning before continuing; multiplayer keeps its 60-second question and 8-second review schedule. A short descending alert respects the sound toggle; warnings do not flash.

## Accuracy-based endings

Each player receives their own 14-second ending at shift completion: at least 80% correct earns the heroic dawn / shield film and rising score; below 80% gets the dark surveillance / trust-lost film and ominous score. The threshold uses the exact fraction, not rounded percentages or points; timeouts count as incorrect. Minimum correct counts are 5/6, 8/9 and 12/15. Team credits follow either ending, then the debrief remains available. Replay your ending replays the earned outcome only. Both films support Skip, sound controls, reduced-motion still posters, and playback failure fallback.
