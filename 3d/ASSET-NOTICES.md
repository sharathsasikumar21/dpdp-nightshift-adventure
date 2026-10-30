# Ghost Shift browser assets

- Three.js 0.180.0 and its FBX loader, curve helpers and bundled fflate dependency: retained upstream headers and `vendor/THREE-LICENSE.txt`.
- Rapier 0.21.0: Apache-2.0, `vendor/rapier/LICENSE` and `vendor/rapier/PROVENANCE.md`. The compatibility bundle embeds WebAssembly and runs locally.
- Civilian character meshes, base textures and recorded motions: [Microsoft Rocketbox](https://github.com/microsoft/Microsoft-Rocketbox), MIT, `media/characters/LICENSE.txt`. The DPO uses the unmarked business suit atlas. Browser copies are capped to the available texture resolution.
- Technology logos: [Simple Icons](https://github.com/simple-icons/simple-icons), CC0, including Cloudflare. Logo names identify the services used.
- Background soundtrack: Renjith Mohan M R, supplied by the game owner. Existing ending films, credit films and audio remain part of the project.
- Desk keepsakes, office geometry and generated surface details are code-authored. No game poster artwork is loaded by the browser release.

No paid asset-generation service is required to run this release.

## Supplied protagonist
`media/characters/simon-riley.glb` is a browser-optimised derivative of the project owner’s supplied `men1.glb`, used for Simon Ghost Riley in the lift introduction.

The supplied `labrador-dog.zip` and `stylized-lowpoly-female.zip` provide the optimised Labrador companion (`labrador.glb`) and Mira (`mira.glb`). The Labrador retains its supplied rig and animation; the unrigged female model uses a stationary office pose.

The project owner’s supplied night-city archive provides `media/city/office-night-skyline.glb`, a reduced-texture export of its Blender building backdrop. Ground traffic, coastal road and aircraft remain game-created.

The supplied `road-hd.zip` provides the road geometry and textures; `road-pack-not-including-the-road.zip` provides street lamps, pavement, railings and traffic signals. Browser exports are `media/city/road.glb` and `street-props.glb`.

Supplied Su-57, town bus, passenger car pack, Aer Lingus A330 and Bulgaria Air A320 models provide the optimised aircraft and moving road vehicles. Only one compact car variant is exported from the pack and recoloured for efficient instancing.

The supplied scanned plants and grass collection provides selected low-cost plant and grass meshes in `planting.glb`, used in office planters and promenade planting.
