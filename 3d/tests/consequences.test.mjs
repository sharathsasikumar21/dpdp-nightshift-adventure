import test from 'node:test';
import assert from 'node:assert/strict';
import {endingFor,riskFor} from '../consequences.js';
import {createRun,openTurn,submit,resolve,advance} from '../engine.js';
import fs from 'node:fs';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
test('ending threshold is inclusive at exactly 80%, never based on rounded percentage',()=>{
 for(const [correct,total,expected] of [[4,5,'good-ending'],[12,15,'good-ending'],[11,15,'bad-ending'],[4,6,'bad-ending'],[5,6,'good-ending'],[7,9,'bad-ending'],[8,9,'good-ending'],[799,1000,'bad-ending'],[0,0,'bad-ending']])assert.equal(endingFor(correct,total),expected);
});
test('warning history is player-specific, escalates and resets on a safe call',()=>{
 const row=(a,b)=>({results:[{id:'a',good:a},{id:'b',good:b}]});
 const log=[row(false,true),row(false,true),row(false,false)];
 assert.equal(riskFor(log,'a',60).severity,'critical');assert.equal(riskFor(log,'b',60).severity,'warning');
 assert.equal(riskFor(log.slice(0,2),'a',60).severity,'escalated');
 assert.equal(riskFor([...log,row(true,false)],'a',60).consecutive,0);
 assert.equal(riskFor([...log,row(true,false)],'a',30).severity,'critical');
});
test('penalty evidence records the actual score floor, integrity and broken streak',()=>{
 const s=createRun(stories,[0],[{id:'a',alias:'A'}],'risk');
 openTurn(s,0);submit(s,'a',1,1);resolve(s,stories,1);
 let r=s.log[0].results[0];assert.deepEqual(r.before,{points:0,integrity:70,streak:0});assert.deepEqual(r.after,{points:0,integrity:56,streak:0});
 advance(s,'a');openTurn(s,2);submit(s,'a',0,3);resolve(s,stories,3);advance(s,'a');
 openTurn(s,4);resolve(s,stories,60004);r=s.log.at(-1).results[0];
 assert.equal(r.timeout,true);assert.deepEqual(r.before,{points:100,integrity:64,streak:1});assert.deepEqual(r.after,{points:60,integrity:50,streak:0});
 assert.deepEqual(s.log[0].results[0].after,{points:0,integrity:56,streak:0});
});
