# DPDP Nightshift Adventure

A choice-driven privacy adventure about India's Digital Personal Data Protection Act. Ten linked story arcs, consequence-based decisions, an end-of-run legal debrief, and named scoring levels.

- Live 2D game: https://data-quest-nightshift.higgsfield.app
- 3D mission game source: [3d/](3d/)
- Playable 3D mission game: https://sharathsasikumar21.github.io/dpdp-nightshift-adventure/3d/ https://sharathsasikumar21.github.io/dpdp-nightshift-adventure/3d/
- Source app: `app/`
- 3D game: `3d/index.html` + `3d/scenarios.json`

The 3D edition is a standalone Three.js browser game. It saves completed case arcs and score locally in the player's browser. It is an educational simulation, not legal advice.
### Supabase online mode

The 3D game uses the public Supabase project settings in `3d/supabase-config.js`. The publishable key is intended for browser code; database access is governed by RLS. Online rooms use Supabase Realtime presence and broadcasts. A room code is an invite, not a private or encrypted channel—share no personal or sensitive information there.

To activate the global score board, review and run `supabase/setup.sql` in the Supabase SQL Editor. It enables RLS and allows anyone to read pseudonymous scores and submit bounded scores. The game generates an Analyst alias and stores points, correct-decision count, missions completed, and timestamp. Scores are client-submitted and can be spoofed; this is a learning-game leaderboard, not a trusted competition. Never put a Supabase secret/service-role key in the browser.
