import fs from 'node:fs';import test from 'node:test';import assert from 'node:assert/strict';
import {createRun,openTurn,submit,resolve,advance} from '../engine.js';import {makeCheckpoint,restoreCheckpoint,validateCheckpoint} from '../checkpoint.js';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
test('completed-case checkpoint restores scores, evidence and player identifiers without consuming a question clock',()=>{
 const s=createRun(stories,[0,1],[{id:'old-player',alias:'You'}],'old-run');
 assert.equal(makeCheckpoint(s),null);
 for(let i=0;i<3;i++){openTurn(s,100);submit(s,'old-player',i===1?1:0,101);resolve(s,stories,102);advance(s,'old-player');}
 const checkpoint=makeCheckpoint(s,{floor:48,opening:[0,1,2],evidence:[['old-run:0',new Set([0,1,2])]]});assert.ok(validateCheckpoint(checkpoint));
 const saved=restoreCheckpoint(checkpoint,'new-player','new-run');assert.equal(saved.state.phase,'break');assert.equal(saved.state.deadline,0);assert.equal(saved.state.players[0].correct,2);assert.equal(saved.state.players[0].id,'new-player');assert.ok(saved.state.log.every(e=>e.results[0].id==='new-player'));assert.equal(saved.evidence[0][0],'new-run:0');assert.equal(checkpoint.state.id,'old-run');
 const broken=structuredClone(checkpoint);broken.state.route=[0,0];assert.equal(restoreCheckpoint(broken,'a','b'),null);assert.equal(validateCheckpoint(null),false);
});
