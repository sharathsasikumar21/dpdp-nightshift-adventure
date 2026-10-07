import * as T from './vendor/three.module.js';

// Ambient movement and object responses are visual only: they never change answers or timers.
export function createEffects(scene, positions, screens) {
  const root = new T.Group();
  scene.add(root);
  const targets = [];
  let time = 0, reduced = false, low = false, active = 0;
  let scanAge = 3, responseAge = 5, responseGood = true, coffeeAge = 5;
  const glow = color => new T.MeshBasicMaterial({ color });
  const green = glow('#7affe0'), amber = glow('#ffb67d');
  const hull = new T.MeshStandardMaterial({ color: '#587080', metalness: .65, roughness: .4 });
  const dark = new T.MeshStandardMaterial({ color: '#152b38', metalness: .5, roughness: .6 });
  function mesh(geometry, material, parent = root) {
    const m = new T.Mesh(geometry, material); parent.add(m); return m;
  }
  function cube(w, h, d, material, parent = root) { return mesh(new T.BoxGeometry(w, h, d), material, parent); }
  function target(object, type, index) {
    object.userData.interaction = { type, index }; targets.push(object); return object;
  }

  // Status bars crawl across each workstation instead of flashing.
  const sweeps = positions.map(([x, z], i) => {
    screens[i].material = screens[i].material.clone();
    target(screens[i], 'terminal', i);
    const bar = cube(2.03, .035, .012, i < 5 ? green : amber);
    bar.position.set(x, 1.7, z + .145);
    return bar;
  });

  // Data packets travel from desks through floor conduits to the city model.
  const paths = positions.map(([x, z]) => {
    const lane = z < 0 ? -3.2 : 2.6;
    const path = new T.CurvePath();
    path.add(new T.LineCurve3(new T.Vector3(x, .045, z + 1), new T.Vector3(x, .045, lane)));
    if (x !== 0) path.add(new T.LineCurve3(new T.Vector3(x, .045, lane), new T.Vector3(0, .045, lane)));
    path.add(new T.LineCurve3(new T.Vector3(0, .045, lane), new T.Vector3(0, .045, -.4)));
    return path;
  });
  const packets = [];
  paths.forEach((path, i) => {
    root.add(new T.Line(new T.BufferGeometry().setFromPoints(path.getPoints(24)), new T.LineBasicMaterial({ color: '#285861', transparent: true, opacity: .6 })));
    for (let j = 0; j < 3; j++) {
      const p = mesh(new T.SphereGeometry(.07, 5, 4), i < 5 ? green : amber);
      packets.push({ p, path, offset: j / 3, lane: i });
    }
  });

  // Two maintenance drones patrol the walkways, visibly stopping when inspected.
  const drones = [0, 1].map(i => {
    const group = new T.Group(); root.add(group);
    const body = cube(.62, .18, .45, hull, group);
    const camera = cube(.19, .12, .14, dark, group); camera.position.set(0, -.06, .27);
    const eye = cube(.1, .05, .015, i ? amber : green, group); eye.position.set(0, -.06, .35);
    const rotors = [];
    for (const x of [-.46, .46]) for (const z of [-.34, .34]) {
      const arm = cube(.48, .04, .045, hull, group); arm.position.set(x / 2, 0, z / 2); arm.rotation.y = x * z > 0 ? -.65 : .65;
      const pod = mesh(new T.CylinderGeometry(.15, .15, .07, 8), dark, group); pod.position.set(x, .02, z);
      const rotor = cube(.4, .015, .055, hull, group); rotor.position.set(x, .07, z); rotors.push(rotor);
    }
    const lamp = new T.PointLight(i ? 0xffb67d : 0x7affe0, 2, 3); lamp.position.y = -.2; group.add(lamp);
    group.traverse(o => { if (o.isMesh) target(o, 'drone', i); });
    return { group, rotors, paused: 0, t: i * Math.PI, direction: i ? -1 : 1 };
  });

  // A radar sweep sits over the holographic model; it can be tapped to scan.
  const radar = new T.Group(); radar.position.set(0, 1.03, -.4); root.add(radar);
  const radarRing = mesh(new T.RingGeometry(1.45, 1.49, 48), new T.MeshBasicMaterial({ color: '#7affe0', side: T.DoubleSide, transparent: true, opacity: .5 }), radar);
  radarRing.rotation.x = -Math.PI / 2;
  const needle = cube(1.45, .012, .025, green, radar); needle.position.x = .725;
  const mapHit = cube(4.8, .12, 1.8, new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  mapHit.position.set(0, 1.3, -.4); target(mapHit, 'map');
  const coffeeHit = cube(.72, .72, .67, new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  coffeeHit.position.set(-13, 1.6, -1); target(coffeeHit, 'coffee');
  const steam = [];
  for (let i = 0; i < 10; i++) {
    const material = new T.MeshBasicMaterial({ color: '#c2dae2', transparent: true, opacity: .2, depthWrite: false });
    steam.push(mesh(new T.SphereGeometry(.035, 5, 4), material));
  }
  const pulse = mesh(new T.RingGeometry(.95, 1, 64), new T.MeshBasicMaterial({ color: '#91ffda', transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false }));
  pulse.rotation.x = -Math.PI / 2; pulse.position.set(0, .07, -.4);
  const traffic = Array.from({ length: 8 }, (_, i) => {
    const car = cube(.55, .12, .12, i % 2 ? amber : green); car.position.set(i * 7 - 28, .7 + i % 2, 18 + i % 2 * 2); return car;
  });

  function scan(good = true) { scanAge = 0; pulse.material.color.set(good ? '#91ffda' : '#ffb67d'); }
  function activate(type, index) {
    if (type === 'drone') { drones[index].paused = 3; drones[index].direction *= -1; scan(); }
    if (type === 'map') scan();
    if (type === 'coffee') coffeeAge = 0;
  }
  function update(dt) {
    time += reduced ? 0 : dt;
    scanAge += dt; responseAge += dt; coffeeAge += dt;
    sweeps.forEach((s, i) => {
      s.position.y = reduced ? 1.7 : 1.32 + ((time * .17 + i * .13) % 1) * .75;
      screens[i].material.emissiveIntensity = i === active ? 2.5 : 1.1;
      if (responseAge < 2.5 && i === active) screens[i].material.emissive.set(responseGood ? '#306c53' : '#814529');
      else screens[i].material.emissive.set('#234a50');
    });
    packets.forEach(({ p, path, offset, lane }, i) => { p.visible = !low || i % 3 === 0; p.position.copy(path.getPoint((time * .12 + offset + lane * .09) % 1)); });
    drones.forEach((d, i) => {
      d.paused = Math.max(0, d.paused - dt);
      if (!reduced && !d.paused) d.t += dt * .22 * d.direction;
      d.group.position.set(Math.sin(d.t) * 11, 2.55 + (reduced ? 0 : Math.sin(time * 1.7 + i) * .08), i ? 2.65 : -3.25);
      d.group.rotation.y = Math.cos(d.t) * d.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
      if (!reduced && !low) d.rotors.forEach(r => r.rotation.y += dt * 22);
    });
    radar.rotation.y = reduced ? 0 : -time * .55;
    steam.forEach((p, i) => {
      const a = (time * .45 + i / 10) % 1;
      p.position.set(-13 + Math.sin(a * 8 + i) * .07, 1.94 + a * (coffeeAge < 3 ? .8 : .45), -.9);
      p.scale.setScalar(.6 + a * 1.5); p.material.opacity = reduced ? 0 : (1 - a) * (coffeeAge < 3 ? .3 : .14);
      p.visible = !low || i % 2 === 0;
    });
    if (scanAge < 2) {
      pulse.scale.setScalar(reduced ? 3 : 1 + scanAge * 8);
      pulse.material.opacity = Math.max(0, (1 - scanAge / 2) * .65);
    } else pulse.material.opacity = 0;
    traffic.forEach((c, i) => c.position.x = ((time * (i % 2 ? -3 : 3) + i * 7 + 600) % 60) - 30);
  }
  update(0);
  return { targets, update, activate, scan, setTarget: i => active = i, setReduced: v => reduced = v, setQuality: v => low = v,
    respond: good => { responseAge = 0; responseGood = good; scan(good); } };
}
