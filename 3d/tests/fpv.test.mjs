import test from 'node:test';
import assert from 'node:assert/strict';
import {walkPosition,desiredVelocity} from '../fpv-motion.js';
test('first-person movement cannot tunnel through a desk or leave the room',()=>{
 const blocks=[{x:0,z:0,w:2,d:1}];
 const p=walkPosition({x:0,z:3},0,-8,blocks);
 assert.ok(p.z>=.74&&p.z<.9);
 const edge=walkPosition({x:0,z:3},100,100,[]);
 assert.ok(edge.x<=14.4&&edge.z<=11.25);
});
test('movement slides along furniture and diagonal walking does not gain speed',()=>{
 const p=walkPosition({x:0,z:1},1,-1,[{x:0,z:0,w:4,d:1}]);
 assert.ok(p.x>.9&&p.z>=.74);
 for(const yaw of [0,1,Math.PI]){
  const straight=desiredVelocity(1,0,yaw),diagonal=desiredVelocity(1,1,yaw);
  assert.ok(Math.abs(Math.hypot(straight.x,straight.z)-Math.hypot(diagonal.x,diagonal.z))<1e-9);
 }
});
test('crouch takes precedence over hurry and zero input does not drift',()=>{
 assert.equal(Math.hypot(...Object.values(desiredVelocity(0,0,1))),0);
 assert.equal(Math.hypot(...Object.values(desiredVelocity(1,0,0,true,true))),1.15);
 assert.equal(Math.hypot(...Object.values(desiredVelocity(1,0,0,true))),3.7);
});
