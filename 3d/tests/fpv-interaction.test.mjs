import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {visibleInScene,interactionOwner,bearingTo} from '../fpv-interaction.js';
test('collected documents and every child stop blocking or receiving interactions',()=>{
 const scene=new T.Scene(),document=new T.Group(),clip=new T.Object3D();document.userData.evidence=0;scene.add(document);document.add(clip);
 assert.equal(visibleInScene(clip),true);assert.equal(interactionOwner(clip),document);
 document.visible=false;assert.equal(visibleInScene(clip),false);
 assert.equal(interactionOwner(scene),null);
});
test('navigation bearing distinguishes front, rear, left and right after camera turns',()=>{
 const p={x:0,z:0};
 assert.equal(bearingTo(p,[0,-5],0).label,'↑ AHEAD');
 assert.equal(bearingTo(p,[0,5],0).label,'TURN AROUND');
 assert.equal(bearingTo(p,[-5,0],0).label,'← TURN LEFT');
 assert.equal(bearingTo(p,[5,0],0).label,'TURN RIGHT →');
 assert.equal(bearingTo(p,[-5,0],Math.PI/2).label,'↑ AHEAD');
 assert.ok(Math.abs(bearingTo(p,[0,-5],Math.PI*4).degrees)<1e-8);
 assert.equal(bearingTo(p,[3,4],0).distance,5);
});
