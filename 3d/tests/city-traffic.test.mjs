import test from 'node:test';import assert from 'node:assert/strict';import * as T from '../vendor/three.module.js';import {addGroundTraffic,coastalRoadPoint,ROAD_Y} from '../city-traffic.js';
test('coastal cars follow two road lanes at ground height and reduced motion stops traffic',()=>{
 const root=new T.Group(),traffic=addGroundTraffic(root),matrix=new T.Matrix4(),position=new T.Vector3();
 assert.equal(traffic.meshes.length,5);assert.equal(traffic.count,24);
 for(let i=0;i<300;i++)traffic.update(1/60);
 for(let i=0;i<traffic.count;i++){traffic.meshes[0].getMatrixAt(i,matrix);position.setFromMatrixPosition(matrix);assert.ok(position.toArray().every(Number.isFinite));assert.ok(Math.abs(position.y-(ROAD_Y+.42))<.0001);assert.ok(Math.abs(position.x)<90&&position.z>30&&position.z<68);}
 const before=Array.from(traffic.meshes[0].instanceMatrix.array);traffic.update(10,true);assert.deepEqual(Array.from(traffic.meshes[0].instanceMatrix.array),before);
 const p=coastalRoadPoint(.5);assert.ok(Math.abs(p.x)<.0001);assert.equal(p.y,ROAD_Y);
});
