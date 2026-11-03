import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {guidanceFor,createStuckDetector} from '../player-assist.js';import {caseWitnesses} from '../case-witnesses.js';import {dossiers} from '../case-content.js';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
test('every case has its own three exhibits and case-specific witness finding',()=>{
 const bodies=new Set(),findings=new Set();for(const story of stories){const d=dossiers[story.id],w=caseWitnesses(story.id);assert.equal(d.clues.length,3);for(const [title,body] of d.clues){assert.ok(!bodies.has(body));bodies.add(body);assert.ok(w.accounts.some(a=>a.source.includes(title)));}assert.ok(!findings.has(w.confirmed));findings.add(w.confirmed);assert.equal(w.findings[1],w.confirmed);}assert.equal(bodies.size,30);assert.equal(findings.size,10);
});
test('assist uses actual floor, arrival, evidence and operations progress',()=>{
 const s={currentFloor:47,targetFloor:48,near:true,openingCount:3,evidenceCount:3};assert.equal(guidanceFor(s).key,'floor');assert.match(guidanceFor(s).text,/48/);
 s.currentFloor=48;s.near=false;assert.equal(guidanceFor(s).key,'desk');s.near=true;s.openingCount=1;assert.equal(guidanceFor(s).key,'arrival');s.openingCount=3;s.evidenceCount=1;assert.equal(guidanceFor(s).key,'evidence');
 s.evidenceOpen=true;assert.equal(guidanceFor(s).key,'read');s.evidenceOpen=false;s.operationsOpen=true;s.ops={witnesses:[0],steps:[]};assert.equal(guidanceFor(s).key,'accounts');s.ops.witnesses.push(1);assert.equal(guidanceFor(s).key,'comparison');s.ops.finding=1;assert.equal(guidanceFor(s).key,'operations');s.operationsOpen=false;assert.equal(guidanceFor(s).key,'evidence');s.evidenceCount=3;assert.equal(guidanceFor(s).key,'terminal');s.complete=true;assert.equal(guidanceFor(s).key,'question');
});
test('stuck hints wait for lack of progress, pause for reading and stop nagging',()=>{
 let t=0;const gate=createStuckDetector({now:()=>t,delay:50,cooldown:100});assert.equal(gate.update('a'),false);t=51;assert.equal(gate.update('a'),true);t=110;assert.equal(gate.update('a'),false);t=152;assert.equal(gate.update('a'),true);t=500;assert.equal(gate.update('a'),false);assert.equal(gate.update('b'),false);t=550;assert.equal(gate.update('b',false),false);t=580;assert.equal(gate.update('b'),false);t=601;assert.equal(gate.update('b'),true);gate.reset();assert.equal(gate.update('b'),false);
});
