import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {dossiers} from '../case-content.js';import {caseWitnesses} from '../case-witnesses.js';import {operationPlan} from '../field-operations.js';import {DESK_SETUPS} from '../case-desks.js';
import {STAFF,staffConversation,staffCaseIds,staffWorkState} from '../staff-data.js';import {createStaffMotion} from '../staff-roster.js';import {FLOORS,floorForCase} from '../building.js';
const stories=JSON.parse(fs.readFileSync(new URL('../stories.json',import.meta.url)));
test('all mission incidents, thirty source bodies, prompts, witnesses and operation instructions are individually authored',()=>{
 const bodies=[],questions=[],incidents=[],findings=[],plans=[];
 stories.forEach((story,i)=>{assert.equal(DESK_SETUPS[i].id,story.id);const witness=caseWitnesses(story.id),plan=operationPlan({turn:0,route:[i],log:[]},'p',story.id);findings.push(witness.confirmed);plans.push(plan.map(p=>p.instruction).join('|'));for(const [title,body] of dossiers[story.id].clues){bodies.push(body);assert.ok(plan[0].instruction.includes(title));assert.ok(witness.accounts.some(a=>a.source.includes(body)));}for(const s of story.scenes){questions.push(s.q);incidents.push(s.plot);}});
 assert.equal(new Set(bodies).size,30);assert.equal(new Set(questions).size,30);assert.equal(new Set(incidents).size,30);assert.equal(new Set(findings).size,10);assert.equal(new Set(plans).size,10);assert.equal(new Set(DESK_SETUPS.map(s=>s.kind)).size,10);
});
test('all nine requested staff have the specified genders, different voices, models, roles and dialogue banks',()=>{
 assert.equal(STAFF.length,9);assert.deepEqual(STAFF.filter(p=>p.gender==='male').map(p=>p.name).sort(),['Nitish','Sharath','Shambhu','Vishnuvardhan'].sort());
 for(const key of ['voice','model','role','intro','good','bad','guide','activity'])assert.equal(new Set(STAFF.map(p=>p[key])).size,9);
 assert.ok(STAFF.find(p=>p.name==='Sharath').important);assert.equal(STAFF.find(p=>p.name==='Renjith').gender,'female');
 assert.equal(new Set(FLOORS.map(f=>f.shortName)).size,4);assert.ok(FLOORS.every(f=>STAFF.some(p=>p.floor===f.number)));
});
test('staff dialogue is case-scoped, never discloses uninspected source bodies and reflects only this player’s actual result',()=>{
 for(const p of STAFF){const index=stories.findIndex((_,i)=>floorForCase(i)===p.floor),s={turn:0,route:[index],log:[]},story=stories[index];const hidden=staffConversation(p,s,stories,'p',new Set());for(const [,body] of dossiers[story.id].clues)assert.ok(!hidden.topics.some(t=>t.text.includes(body)));
 const visible=staffConversation(p,s,stories,'p',new Set([p.source]));assert.ok(visible.topics.find(t=>t.id==='case').voice.endsWith(story.id));s.turn=1;s.log=[{story:index,scene:0,results:[{id:'p',good:false}]}];assert.ok(staffConversation(p,s,stories,'p',new Set()).topics.find(t=>t.id==='last').text.includes(story.scenes[0].effect));assert.ok(!staffConversation(p,s,stories,'other',new Set()).topics.find(t=>t.id==='last').text.includes(story.scenes[0].effect));assert.ok(staffCaseIds(p,stories).length>=2);}
});
test('staff movement stays in each short route, stops near the player and uses different schedules',()=>{
 const signatures=[];for(const p of STAFF){const motion=createStaffMotion(p),samples=[];let last;for(let i=0;i<1800;i++){last=motion.update(.1);assert.ok(last.z>=p.z-p.range-.001&&last.z<=p.z+p.range+.001);assert.ok(Number.isFinite(last.yaw));if(i%100===0)samples.push(last.z.toFixed(3));}const stopped=motion.update(.1,{near:true});assert.equal(stopped.z,last.z);assert.equal(stopped.speed,0);signatures.push(samples.join(','));}assert.equal(new Set(signatures).size,9);
});
test('optimised staff models are all distinct, retain office animations and contain valid buffer ranges',()=>{
 const data=[];for(const p of STAFF){const b=fs.readFileSync(new URL('../media/characters/staff/'+p.id+'.glb',import.meta.url));assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(8),b.length);const j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)));assert.ok(j.animations.some(a=>/walk/i.test(a.name)));assert.ok(j.animations.some(a=>/idle/i.test(a.name)));assert.ok(!j.animations.some(a=>/gun|sword|death|punch/i.test(a.name)));assert.ok(j.bufferViews.every(v=>(v.byteOffset||0)+v.byteLength<=j.buffers[0].byteLength));data.push(b.toString('base64'));}assert.equal(new Set(data).size,9);
});
test('staff change activity with the assigned case, inspected records and unresolved risk',()=>{
 const get=id=>STAFF.find(p=>p.id===id),base={caseIndex:0,caseId:'toggle',records:0,pressure:0};
 assert.equal(staffWorkState(get('nitish'),base).reviewOnly,false);assert.equal(staffWorkState(get('nitish'),{...base,records:1}).reviewOnly,true);
 assert.equal(staffWorkState(get('ribika'),base).reviewOnly,true);assert.equal(staffWorkState(get('ribika'),{...base,records:3}).reviewOnly,false);
 assert.equal(staffWorkState(get('sharath'),base).reviewOnly,true);assert.equal(staffWorkState(get('sharath'),{...base,pressure:2}).reviewOnly,false);
 assert.equal(staffWorkState(get('nikita'),{caseIndex:4,caseId:'vendor',hasHold:false}).reviewOnly,true);assert.equal(staffWorkState(get('nikita'),{caseIndex:4,caseId:'vendor',hasHold:true}).reviewOnly,false);
});
