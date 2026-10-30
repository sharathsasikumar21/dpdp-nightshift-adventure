import test from 'node:test';
import assert from 'node:assert/strict';
import {createOfficePhysics} from '../physics.js';

function walk(p,vx,vz,seconds=2,hz=60){for(let i=0;i<seconds*hz;i++)p.advance(vx,vz,1/hz);return p.status().position;}
test('Rapier capsule stops at a desk instead of tunnelling through it',async()=>{
 const p=await createOfficePhysics([{x:0,z:0,w:2,d:1}],{position:{x:0,z:3}});
 try{const end=walk(p,0,-3);assert.ok(end.z>=.76&&end.z<.83,JSON.stringify(end));assert.ok(Math.abs(end.x)<.02);}finally{p.dispose();}
});
test('Rapier slides along furniture and contains the player at room boundaries',async()=>{
 const p=await createOfficePhysics([{x:0,z:0,w:4,d:1}],{position:{x:0,z:1}});
 try{const end=walk(p,1,-1,1);assert.ok(end.x>.9);assert.ok(end.z>=.76);p.teleport({x:0,z:3});const edge=walk(p,20,20,3);assert.ok(edge.x<14.5&&edge.z<11.35);}finally{p.dispose();}
});
test('floor changes remove hidden furniture collision and restore it on return',async()=>{
 const p=await createOfficePhysics([{x:0,z:0,w:4,d:1,floor:48},{x:8,z:0,w:1,d:1,caseIndex:2}],{position:{x:0,z:3}});
 try{
  const baseline=p.status().colliders;assert.ok(walk(p,0,-3).z<0);
  p.setFloor(48);p.teleport({x:0,z:3});assert.equal(p.status().colliders,baseline+1);assert.ok(walk(p,0,-3).z>.76);
  p.setFloor(49);assert.equal(p.status().colliders,baseline+1);p.teleport({x:0,z:3});assert.ok(walk(p,0,-3).z<0);
 }finally{p.dispose();}
});
test('teleport clears interpolation and cannot pull the player back to the old floor position',async()=>{
 const p=await createOfficePhysics([]);
 try{walk(p,1,0);p.teleport({x:-5,z:-8});assert.deepEqual(p.advance(0,0,1/144),{x:-5,z:-8});const end=walk(p,0,0);assert.ok(Math.abs(end.x+5)<.001&&Math.abs(end.z+8)<.001);}finally{p.dispose();}
});
test('fixed-step travel is consistent at 30, 60 and 144 rendered frames per second',async()=>{
 const results=[];
 for(const hz of [30,60,144]){const p=await createOfficePhysics([],{position:{x:0,z:0}});try{results.push(walk(p,1.2,-1.2,3,hz));}finally{p.dispose();}}
 for(const p of results){assert.ok(Math.abs(p.x-3.6)<.01);assert.ok(Math.abs(p.z+3.6)<.01);}
});
test('an inactive-tab time gap is discarded and invalid movement is rejected',async()=>{
 const p=await createOfficePhysics([],{position:{x:0,z:0}});
 try{p.advance(3.7,0,20);assert.ok(p.status().position.x<.4);assert.throws(()=>p.advance(NaN,0,.016));assert.throws(()=>p.advance(1,0,-1));}finally{p.dispose();}
});
test('moving colleague colliders leave the old location and block the new one',async()=>{const block={x:0,z:0,w:1,d:1,dynamic:true},p=await createOfficePhysics([block],{position:{x:0,z:3}});try{block.x=5;p.advance(0,0,1/60);assert.ok(walk(p,0,-3).z<0);p.teleport({x:5,z:3});assert.ok(walk(p,0,-3).z>.76);}finally{p.dispose();}});

test('the lift doorway is passable while cabin walls remain solid',async()=>{const p=await createOfficePhysics([],{position:{x:0,z:10}});try{const inside=walk(p,0,2,2);assert.ok(inside.z>13&&inside.z<14.9);const side=walk(p,3,0,1);assert.ok(side.x<1.4);const back=walk(p,0,3,2);assert.ok(back.z<14.9);const out=walk(p,0,-2,3);assert.ok(out.z<10);}finally{p.dispose();}});
