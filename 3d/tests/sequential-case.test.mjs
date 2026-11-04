import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRun,openTurn,submit,resolve,continueCase,advance} from '../engine.js';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
test('one case preparation leads to three consecutive questions with fresh timers and a case break',()=>{
 const s=createRun(stories,[0,1],[{id:'p'}],'sequential');
 s.fieldOperations={0:{steps:['preserve','scope','hold'],witnesses:[0,1],finding:1}};
 openTurn(s,1000);
 for(let turn=0;turn<3;turn++){
  assert.equal(s.phase,'decision');assert.equal(s.turn,turn);assert.equal(s.limitSeconds,50);
  submit(s,'p',turn===1?1:0,s.deadline-1);resolve(s,stories,s.deadline-1);
  const now=100000*(turn+1);assert.ok(continueCase(s,'p',now));
  if(turn<2){assert.equal(s.phase,'decision');assert.equal(s.deadline,now+50000);assert.deepEqual(s.locks,{});}
 }
 assert.equal(s.phase,'break');assert.equal(s.turn,3);assert.equal(s.log.length,3);
 assert.equal(s.players[0].correct,2);assert.equal(s.fieldOperations[0].finding,1);
 advance(s,'p');assert.equal(s.phase,'explore');
 openTurn(s,400000);
 for(let turn=3;turn<6;turn++){submit(s,'p',0,s.deadline-1);resolve(s,stories,s.deadline-1);continueCase(s,'p',500000+turn*100000);}
 assert.equal(s.phase,'end');assert.equal(s.log.length,6);
});
test('continuation rejects repeat clicks, invalid players and shared rooms without skipping questions',()=>{
 const s=createRun(stories,[0],[{id:'p'}],'guard');assert.equal(continueCase(s,'p',0),false);
 openTurn(s,0);resolve(s,stories,50000);assert.equal(continueCase(s,'other',60000),false);assert.equal(s.turn,0);
 continueCase(s,'p',60000);assert.equal(continueCase(s,'p',60001),false);assert.equal(s.turn,1);
 const shared=createRun(stories,[0],[{id:'p'},{id:'q'}],'shared');openTurn(shared,0);resolve(shared,stories,50000);
 assert.equal(continueCase(shared,'p',60000),false);assert.equal(shared.phase,'review');
});
