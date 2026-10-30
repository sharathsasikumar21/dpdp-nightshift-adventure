import test from 'node:test';import assert from 'node:assert/strict';import {CAR_SLOTS,BUS_SLOTS,trafficPosition,flightPosition} from '../imported-traffic.js';
test('cars and buses occupy distinct lane slots and remain grounded',()=>{
 assert.equal(new Set([...CAR_SLOTS,...BUS_SLOTS]).size,16);for(const t of [0,10,100,10000])for(const slot of [...CAR_SLOTS,...BUS_SLOTS]){const p=trafficPosition(slot,t);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.z)&&Number.isFinite(p.yaw));assert.ok(p.y< -30);}
});
test('aircraft flyovers are staggered and finite',()=>{for(let t=0;t<520;t++){const p=[0,1,2].map(i=>flightPosition(i,t));assert.ok(p.filter(v=>v.visible).length<=1);for(const v of p)assert.ok(Number.isFinite(v.x)&&v.y>60);}assert.equal(flightPosition(0,0).visible,true);assert.equal(flightPosition(1,100).visible,true);assert.equal(flightPosition(2,175).visible,true);});
