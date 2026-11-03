import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {dossiers} from '../case-content.js';
import {evidenceInsight} from '../evidence-insights.js';
import {buildJournal} from '../mission-journal.js';
import {checkpointMessage} from '../checkpoint.js';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
test('all thirty exhibits have individual observations, limits and verification questions',()=>{
 const questions=[];for(const id of Object.keys(dossiers))for(let i=0;i<3;i++){const note=evidenceInsight(id,i);assert.ok(note?.establishes.length>30);assert.ok(note.limit.length>30);assert.ok(note.verify.endsWith('?'));questions.push(note.verify);assert.doesNotMatch(Object.values(note).join(' '),/correct answer|choose option/i);}
 assert.equal(new Set(questions).size,30);assert.equal(evidenceInsight('missing',0),null);
});
test('journal exposes verification questions only from inspected sources in this run',()=>{
 const state={id:'now',turn:0,route:[0,4],log:[]},evidence=new Map([['now:toggle',new Set([1])],['old:vendor',new Set([0,1,2])]]);
 const j=buildJournal(state,stories,dossiers,evidence,3,47);assert.equal(j.cases[0].unresolved.length,1);assert.equal(j.cases[0].unresolved[0].question,evidenceInsight('toggle',1).verify);assert.equal(j.cases[1].unresolved.length,0);assert.equal(j.cases[0].clues[0].body,null);
});
test('checkpoint indicator distinguishes a real resume boundary, an unsaved start and unavailable storage',()=>{
 assert.match(checkpointMessage(null),/NEXT CHECKPOINT/);assert.doesNotMatch(checkpointMessage(null),/SAVED/);assert.match(checkpointMessage({state:{turn:3}}),/Resume at case 2 start/);assert.match(checkpointMessage({state:{turn:0}},true),/UNAVAILABLE/);assert.doesNotMatch(checkpointMessage(null,true),/SAVED/);
});
