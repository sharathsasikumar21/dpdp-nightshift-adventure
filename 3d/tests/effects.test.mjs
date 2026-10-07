import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {createEffects} from '../world-effects.js';

test('ambient paths remain finite across many loops and stop for reduced motion',()=>{
  const scene=new T.Scene();
  const positions=[[-10,-7],[-5,-7],[0,-7],[5,-7],[10,-7],[-10,5],[-5,5],[0,5],[5,5],[10,5]];
  const screens=positions.map(()=>new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial()));
  const fx=createEffects(scene,positions,screens);
  for(let i=0;i<12000;i++)fx.update((i%5+1)*.009);
  scene.traverse(o=>assert.ok(o.position.toArray().every(Number.isFinite)));
  fx.setReduced(true);fx.update(.016);
  const before=[];scene.traverse(o=>before.push(o.position.toArray()));
  fx.update(.5);const after=[];scene.traverse(o=>after.push(o.position.toArray()));
  assert.deepEqual(after,before);
  fx.activate('drone',0);fx.activate('coffee');fx.scan();fx.respond(false);fx.setQuality(true);fx.update(.1);
  scene.traverse(o=>assert.ok(o.position.toArray().every(Number.isFinite)));
});
