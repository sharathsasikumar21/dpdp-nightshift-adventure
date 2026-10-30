import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {dossiers,closeChoices,difficultyFor,answerOptions,orderedChoices,wrongReason} from '../case-content.js';
import {createRun,startBriefing,finishBriefing,openTurn,submit,resolve} from '../engine.js';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
test('all ten stories have unique mystery beats and three complete evidence exhibits',()=>{
 assert.equal(Object.keys(dossiers).length,10);const hooks=new Set();for(const story of stories){const d=dossiers[story.id];assert.ok(d);assert.equal(d.beats.length,3);assert.equal(d.clues.length,3);hooks.add(d.hook);for(const clue of d.clues)assert.ok(clue[0]&&clue[1]);}assert.equal(hooks.size,10);
});
test('all 30 scenario questions retain a unique correct choice and explain close distractors at every level',()=>{
 for(const sc of stories.flatMap(s=>s.scenes)){assert.ok(sc.q.length>50);assert.equal(closeChoices[sc.id].length,3);for(const turn of [0,5,10]){const opts=answerOptions(sc,turn,15);assert.equal(new Set(opts).size,4);assert.equal(opts[0],sc.a);for(let i=1;i<=3;i++)assert.ok(wrongReason(sc,i,turn,15));const ordered=orderedChoices(sc,'same-room',turn,15);assert.deepEqual(ordered,orderedChoices(sc,'same-room',turn,15));assert.deepEqual(ordered.map(x=>x.i).sort(),[0,1,2,3]);assert.equal(ordered.find(x=>x.i===0).text,sc.a);}}
});
test('difficulty increases across the whole shift, including case boundaries',()=>{
 for(const total of [6,9,15]){const levels=Array.from({length:total},(_,i)=>difficultyFor(i,total));assert.deepEqual([...new Set(levels)],[0,1,2]);assert.deepEqual(levels,[...levels].sort());}
});

test('every answer has equal word length and early rounds retain the close distractors',()=>{
 for(const sc of stories.flatMap(s=>s.scenes)){
  for(const turn of [0,5,10]){
   const options=answerOptions(sc,turn,15);
   assert.deepEqual(options.map(t=>t.trim().split(/\s+/).length),[16,16,16,16],sc.id);
   assert.deepEqual(options,[sc.a,...sc.bad],sc.id);
   for(let i=1;i<4;i++)assert.equal(wrongReason(sc,i,turn,15),closeChoices[sc.id][i-1][1]);
  }
 }
});
test('shared story briefing never consumes the 30-second response clock',()=>{
 const s=createRun(stories,[0],[{id:'a'}],'room');assert.ok(startBriefing(s,1000));assert.equal(s.deadline,0);assert.equal(submit(s,'a',0,2000),false);assert.equal(finishBriefing(s,10999),false);assert.ok(finishBriefing(s,13000));assert.equal(s.deadline,43000);assert.equal(s.limitSeconds,30);assert.equal(finishBriefing(s,14000),false);assert.ok(submit(s,'a',0,42999));assert.ok(resolve(s,stories,42999));
});
test('solo thriller deadlines enforce the fixed 30 seconds and retain the timeout duration',()=>{
 for(const duration of [30000]){const s=createRun(stories,[0],[{id:'a'}],'solo');openTurn(s,1000,duration);assert.equal(resolve(s,stories,1000+duration-1),false);assert.equal(submit(s,'a',0,1000+duration),false);assert.ok(resolve(s,stories,1000+duration));assert.equal(s.log[0].results[0].limitSeconds,duration/1000);assert.equal(s.log[0].results[0].timeout,true);}
});
