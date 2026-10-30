# Ghost Shift: Midnight Breach

**[Play the game on Cloudflare](https://ghost-shift-midnight-breach.pages.dev/)**

*Every decision leaves a trace.*

A first-person, single-player data protection thriller set at Meridian Dataworks, Nariman Point, Mumbai, at 02:17 AM. You are Simon Ghost Riley, the Data Protection Officer. Follow the Blue Lantern export trail, preserve evidence and make defensible decisions before dawn.

## Current browser release

- A main menu leads into the cinematic lift arrival. The protagonist introduction and objectives appear after the lift opens, followed by an optional beginner tutorial.
- Explore four departments on floors 47–50. A yellow overhead arrow marks the arrival desk or active case desk.
- Ten linked cases contain thirty situation-based decisions. Choose a 2-, 3- or 5-case shift, with timed or untimed play. Timed questions progress from 90 to 75 to 60 seconds.
- Collect three records at each case desk, reread them, compare collected evidence and challenge colleague accounts. Back to All Evidence returns to the board.
- Wrong answers and timeouts show consequences, penalties and the missed safeguard. At least 80% correct earns the heroic ending; lower accuracy earns the darker ending.
- Case breaks save a local checkpoint. Completed-case history and scores stay in the current browser.
- Three.js renders the office, varied Mumbai-inspired skyline, ground traffic and aircraft. Rapier runs capsule movement and collisions. Civilian NPCs walk, pause and react nearby.
- First-person gameplay hides the protagonist model. The opening and case briefings retain cinematic cameras.
- High FX is the default. Adaptive render resolution, static geometry batching, Low FX and reduced-motion support help on slower hardware. Frame rate depends on the device.
- The supplied soundtrack begins with the Start gesture in the lift. Music starts enabled, with a mute option; browser autoplay restrictions still apply.

This release is single-player. It does not initialize Supabase or offer online rooms. The older `app/` and `supabase/` directories remain historical browser code and are not part of the Cloudflare release.

## Controls

| Action | Control |
| --- | --- |
| Move | WASD or arrow keys |
| Look | Drag the view, or enable Mouse Look in Field Tools |
| Turn by keyboard | Q / R |
| Interact | E or Interact button |
| Hurry | Shift |
| Flashlight | F |
| Evidence board | Tab or Evidence Board button |
| Release mouse / close a detail | Escape |
| Change department | Lift / Floors |

Field Tools includes Navigate to Case, Arrival Leads, crew conversations and the Case Thread. Evidence inspection does not pause an active decision clock. Untimed play is available in Shift Options.

## Run locally

Use a current Node.js version. The browser runtime and assets are packaged locally; no dependency installation or paid API key is required.

```sh
cd 3d
node serve.mjs
```

Open `http://127.0.0.1:4173/`. Serve the files over HTTP rather than opening `index.html` through `file://`.

From the repository root, run the automated checks:

```sh
node tools/version-browser-release.mjs
node --test 3d/tests/*.test.mjs
```

The current suite has 70 passing tests covering case progression, scoring, deadlines, evidence, checkpoints, Rapier collision, character assets, NPC routines, traffic, rendering budgets and browser module versioning. Historical room tests remain as regression coverage; multiplayer is not exposed by this release.

## Hosting and updates

Production: **https://ghost-shift-midnight-breach.pages.dev/**

Cloudflare Pages serves the contents of `3d/` at the site root. The repository root redirects visitors to the Cloudflare game. GitHub stores the browser source and assets; production deployments use Cloudflare Direct Upload.

Before publishing, run `node tools/version-browser-release.mjs`. It generates an import map with one revision across the complete module graph, so an updated entry point cannot reuse older camera or physics code. The `_headers` file requires the browser to revalidate HTML and scripts. Upload `_headers` as deployment configuration when using the Direct Upload API.

For an existing open tab, reload the page to enter the latest build. On Windows, Ctrl+F5 forces a fresh load. Checkpoints remain browser-local.

## Credits

Creators: **SHA/020 · NIKS/141 · RIP/911**

**Soundtrack By Renjith Mohan M R**

Runtime: Three.js and Rapier. Civilian character assets and motion: Microsoft Rocketbox (MIT). Typography: Google Fonts. Source hosting: GitHub. Production hosting: Cloudflare Pages. Included dependency licenses and asset provenance are retained with their files. Original end-credit figures, title artwork and procedural scene elements are included in this repository.

## Simulation setting

All phases of the DPDP Act, 2023 and DPDP Rules, 2025 are treated as fully in force in the fictional game setting. This is a simulation assumption, not a claim about their real-world commencement status. Apply the case facts and relevant exemptions. The game is educational and is not legal advice.
