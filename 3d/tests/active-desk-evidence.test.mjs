import test from 'node:test';import assert from 'node:assert/strict';import * as T from '../vendor/three.module.js';
import {buildArrivalEvidence} from '../active-desk-evidence.js';import {floorForCase} from '../building.js';
test('arrival evidence adds only three props to the active case desk and no lift-exit table or collider',()=>{
 const scene=new T.Scene(),blocks=[],meshes=[],positions=Array.from({length:10},(_,i)=>[i*4,5]);const office={blocks,meshes,positions,paper:new T.MeshBasicMaterial(),metal:new T.MeshBasicMaterial(),box(x,y,z,w,h,d,material){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);scene.add(mesh);meshes.push(mesh);return mesh;}};
 const arrival=buildArrivalEvidence(scene,office);assert.equal(blocks.length,0);assert.equal(meshes.length,3);assert.deepEqual(arrival.targets.map(m=>m.userData.interaction.index),[0,1,2]);
 for(let i=0;i<10;i++){arrival.setCase(i);arrival.setFloor(floorForCase(i));arrival.setActive(true);assert.equal(arrival.group.visible,true);assert.equal(arrival.group.position.x,positions[i][0]);assert.equal(arrival.group.position.z,positions[i][1]);arrival.setFloor(floorForCase(i)===47?48:47);assert.equal(arrival.group.visible,false);}
 arrival.setCase(0);arrival.setFloor(47);arrival.setActive(false);assert.equal(arrival.group.visible,false);assert.ok(arrival.targets.every(m=>Math.abs(m.position.y-.81)<.02));
});
