import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {buildJournal,floorBriefing} from '../mission-journal.js';import {dossiers} from '../case-content.js';import {assessDpo,buildHandover} from '../handover.js';import {AUDIO_CUES} from '../audio-cues.js';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
test('journal respects route, floor and inspected records without revealing uncollected clues',()=>{
 const state={id:'s',turn:3,route:[0,4],log:[{story:0}]},evidence=new Map([['s:vendor',new Set([1])],['old:vendor',new Set([0,1,2])]]);
 const j=buildJournal(state,stories,dossiers,evidence,3,47);
 assert.equal(j.targetFloor,48);assert.equal(j.cases[1].active,true);assert.equal(j.cases[1].clues[0].body,null);assert.equal(j.cases[1].clues[1].body,dossiers.vendor.clues[1][1]);assert.match(j.next,/48/);assert.equal(j.cases[1].question,stories[4].scenes[0].q);
});
test('arrival briefings identify the department, destination and actual timing mode',()=>{
 assert.match(floorBriefing(49,48).next,/48/);assert.match(floorBriefing(48,48).next,/three records/);assert.match(floorBriefing(50,50).clock,/50 seconds/);assert.doesNotMatch(floorBriefing(50,50,false).clock,/50 seconds/);
});
test('DPO assessment derives strengths, missed evidence and timeout coaching from the actual run',()=>{
 const state={id:'s',route:[0],log:[{turn:0,story:0,scene:0,results:[{id:'p',good:true}]},{turn:1,story:0,scene:1,results:[{id:'p',good:false,timeout:true}]}]};
 const assessment=assessDpo(buildHandover(state,stories,'p'));
 assert.equal(assessment.strengths[0].title,stories[0].scenes[0].tag);assert.equal(assessment.improvements[0].title,'Evidence discipline');assert.match(assessment.improvements[1].detail,/Practise/);
});
test('evidence, warning and lift sound signatures remain distinct',()=>{
 assert.equal(new Set(Object.values(AUDIO_CUES).map(c=>c.notes.join(','))).size,3);assert.ok(AUDIO_CUES.evidence.notes[2]>AUDIO_CUES.evidence.notes[0]);assert.equal(AUDIO_CUES.warning.notes[0],AUDIO_CUES.warning.notes[2]);
});
