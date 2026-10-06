# DPDP Nightshift Adventure

A choice-driven privacy adventure about India's Digital Personal Data Protection Act. Ten linked story arcs, consequence-based decisions, a final legal debrief, and named scoring levels.

- Live 2D game: https://data-quest-nightshift.higgsfield.app
- Playable 3D mission game: https://sharathsasikumar21.github.io/dpdp-nightshift-adventure/3d/
- 3D game source: [3d/](3d/)
- Source app: `app/`
- 3D game files: `3d/index.html` and `3d/scenarios.json`

## 3D mission game controls

Move with WASD or the on-screen direction pad. Drag the scene with a mouse or touch to look freely through 360 degrees; the character moves relative to the view. Press E or tap the interact control at a glowing case terminal.

A solo run continues to the next decision automatically after the brief decision review. In multiplayer, everyone shares the same linked missions and decisions rotate between room members. The active turn has a 60-second limit; if it expires, the missed turn is recorded as a wrong decision with consequences. Join with the room code before the host starts. Rooms are limited to three analysts.

The game stores completed case arcs and score locally in each player's browser. It is an educational simulation, not legal advice.

## Supabase online mode

The 3D game uses the public Supabase project settings in `3d/supabase-config.js`. The publishable key is intended for browser code; database access is governed by RLS. Online rooms use Supabase Realtime presence and broadcasts. A room code is an invite, not a private or encrypted channel—share no personal or sensitive information there.

To activate the global score board, review and run `supabase/setup.sql` in the Supabase SQL Editor. It enables RLS and allows anyone to read pseudonymous scores and submit bounded scores. The game generates an Analyst alias and stores points, correct-decision count, missions completed, and timestamp. Scores are client-submitted and can be spoofed; this is a learning-game leaderboard, not a trusted competition. Never put a Supabase secret/service-role key in the browser.
