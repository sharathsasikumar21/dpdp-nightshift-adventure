import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {crewReaction,companionRecord,noticeCompanionFind,collectCompanionFind,verifyCompanionFind,createWalkingCommentary} from '../companion-story.js';import {makeCheckpoint,restoreCheckpoint} from '../checkpoint.js';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
const call=(good,turn=0)=>({turn,story:0,scene:turn,results:[{id:'p',good}]});
test('crew remember only this player’s decisions and acknowledge recovery',()=>{
 assert.equal(crewReaction(stories,[],'p',0).mood,'first');assert.equal(crewReaction(stories,[call(true)],'p',1).mood,'trust');assert.equal(crewReaction(stories,[call(false)],'p',2).mood,'caution');
 const recovered=crewReaction(stories,[call(false),call(true,1)],'p',0);assert.equal(recovered.mood,'recovered');assert.match(recovered.line,new RegExp(stories[0].scenes[1].tag));assert.equal(crewReaction(stories,[call(false)],'other',0).mood,'first');
});
test('Chikku’s find cannot skip discovery, collection or source verification',()=>{
 const state={},record=companionRecord(state);assert.equal(verifyCompanionFind(record,1),false);assert.equal(collectCompanionFind(record),false);assert.equal(noticeCompanionFind(record),true);assert.equal(noticeCompanionFind(record),false);assert.equal(collectCompanionFind(record),true);assert.equal(verifyCompanionFind(record,0),false);assert.equal(record.stage,'found');assert.equal(verifyCompanionFind(record,1),true);assert.equal(record.stage,'verified');assert.equal(collectCompanionFind(record),false);
});
test('walking commentary requires real travel and a cooldown, discards teleports and pauses',()=>{
 let now=0;const gate=createWalkingCommentary({now:()=>now,interval:1000,distance:3}),update=(x,allowed=true)=>gate.update({runId:'s',position:[x,0,0],allowed});
 assert.equal(update(0),false);for(let x=1;x<=4;x++)assert.equal(update(x),false);now=1001;assert.equal(update(4),false);assert.equal(update(5),true);assert.equal(update(30),false);now=3000;assert.equal(update(30),false);assert.equal(update(30,false),false);assert.equal(update(31),false);assert.equal(update(32),false);assert.equal(update(33),false);assert.equal(update(34),true);
 gate.reset();assert.equal(update(50),false);
});
test('optional clue progress is restored with the case checkpoint',()=>{
 const state={id:'old',route:[0,1],turn:3,phase:'break',log:[call(true),call(false,1),call(true,2)],players:[{id:'p',points:185,integrity:72,streak:1,best:1,correct:2}],companionHunt:{stage:'verified'}};
 const restored=restoreCheckpoint(makeCheckpoint(state),'new','new-run');assert.equal(restored.state.companionHunt.stage,'verified');
});
