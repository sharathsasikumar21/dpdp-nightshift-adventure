import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {saveWorkingFinding,workingFinding} from '../working-findings.js';
import {caseCrewReaction,closingConversation} from '../crew-debrief.js';
import {buildHandover,handoverText} from '../handover.js';
import {createShadowRefresh,renderFrameDue} from '../adaptive-rendering.js';
import {playEndingSequence} from '../ending-sequence.js';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
test('working findings require an inspected record and valid label, stay scoped and never award points',()=>{
 const s={players:[{id:'p',points:40}],log:[]};assert.equal(saveWorkingFinding(s,'toggle',0,'A claim','supported',new Set()),false);assert.equal(saveWorkingFinding(s,'toggle',0,'A claim','correct',new Set([0])),false);
 for(const status of ['supported','contradicted','not-established']){assert.equal(saveWorkingFinding(s,'toggle',0,'  A claim  ',status,new Set([0])),true);assert.equal(workingFinding(s,'toggle',0).status,status);}
 assert.equal(workingFinding(s,'vendor',0),null);assert.equal(s.players[0].points,40);assert.deepEqual(s.log,[]);assert.equal(workingFinding(s,'toggle',0).claim,'A claim');
});
test('crew refer only to current case sources and actual outcomes for this player',()=>{
 const s={turn:1,route:[0,1],log:[{turn:0,story:0,scene:0,results:[{id:'p',good:false}]}]};
 const line=caseCrewReaction(stories,s,'p',0,new Set([0])).line;assert.match(line,/Device log/);assert.ok(line.includes(stories[0].scenes[0].effect));assert.doesNotMatch(caseCrewReaction(stories,s,'p',0,new Set()).line,/Device log/);
 assert.doesNotMatch(caseCrewReaction(stories,s,'other',0,new Set([0])).line,/Last decision:/);
 s.turn=3;assert.doesNotMatch(caseCrewReaction(stories,s,'p',1,new Set([0])).line,/Device log/);assert.match(caseCrewReaction(stories,s,'p',1,new Set([0])).line,/Preference receipt/);
});
test('working findings appear only with examined sources in the handover',()=>{
 const s={id:'s',route:[0],log:[],workingFindings:{toggle:{0:{claim:'Source timing is uncertain',status:'not-established'},1:{claim:'Unexamined claim',status:'supported'}}}},evidence=new Map([['s:toggle',new Set([0])]]);
 const report=buildHandover(s,stories,'p',evidence);assert.equal(report.cases[0].findings.length,1);assert.match(handoverText(report),/Not established: Source timing/);assert.doesNotMatch(handoverText(report),/Unexamined claim/);
});
test('closing conversation acknowledges a recorded strength and unresolved harm without confirming a requested correction',()=>{
 const lines=closingConversation({decisions:[{good:true,topic:'Purpose',story:'Case A',effect:'The source stayed limited.'}],followUp:[{topic:'Copy route',story:'Case B',effect:'Copies remain exposed.',next:'Preserve the source.'}]});
 assert.match(lines[0].text,/Purpose/);assert.match(lines[1].text,/Copies remain exposed/);assert.match(lines[2].text,/not proof/);assert.equal(lines.length,5);
 const allGood=closingConversation({decisions:[{good:true,topic:'Purpose',story:'Case A',effect:'Protected.'}],followUp:[]});assert.match(allGood[1].text,/Every recorded call/);
});
test('static shadows are cached, invalidated for changes and refreshed during motion and once after doors settle',()=>{
 const s=createShadowRefresh();assert.equal(s.update(0),true);assert.equal(s.update(1000),false);s.invalidate();assert.equal(s.update(1001),true);assert.equal(s.update(1101,true),true);assert.equal(s.update(1150,true),false);assert.equal(s.update(1151,false),true);assert.equal(s.update(2000,false),false);
 assert.equal(renderFrameDue(20,0,true),false);assert.equal(renderFrameDue(34,0,true),true);assert.equal(renderFrameDue(20,0,false),true);
});
test('closing conversation stays between film and credits and aborting it releases the cover without playing credits',async()=>{
 const events=[],controller=new AbortController();await playEndingSequence({signal:controller.signal,cover:()=>{events.push('cover');return()=>events.push('uncover');},ending:async()=>events.push('film'),debrief:async()=>{events.push('conversation');controller.abort();},credits:async()=>events.push('credits')});assert.deepEqual(events,['cover','film','conversation','uncover']);
});
