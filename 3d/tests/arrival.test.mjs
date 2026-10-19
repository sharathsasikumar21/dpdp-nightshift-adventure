import test from 'node:test';
import assert from 'node:assert/strict';
import {arrivalState,ARRIVAL_SECONDS} from '../arrival.js';
test('elevator arrival stays within fourteen seconds and introduces all three beats',()=>{
 assert.equal(ARRIVAL_SECONDS,14);assert.deepEqual([0,5,10].map(t=>arrivalState(t).beat),[0,1,2]);
 assert.equal(arrivalState(0).floor,9);assert.equal(arrivalState(9).floor,27);assert.equal(arrivalState(13.99).done,false);assert.equal(arrivalState(14).done,true);
});
test('doors open before the camera enters the office and all animation values are bounded',()=>{
 for(let t=-2;t<=20;t+=.1){const s=arrivalState(t);assert.ok(s.doors>=0&&s.doors<=1&&s.walk>=0&&s.walk<=1);if(s.walk>0)assert.equal(s.doors,1);}
 assert.equal(arrivalState(9).doors,0);assert.equal(arrivalState(14).walk,1);
});
