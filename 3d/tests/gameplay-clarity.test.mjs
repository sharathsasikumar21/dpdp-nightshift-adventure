import test from 'node:test';
import assert from 'node:assert/strict';
import {afterAsset} from '../asset-priority.js';
import {caseProgress} from '../case-progress.js';
import {investigationSummary} from '../investigation-summary.js';
test('background asset work waits for the priority asset and still proceeds after its failure',async()=>{
 let finish,started=false;const first=new Promise(resolve=>finish=resolve);
 const next=afterAsset(first,()=>{started=true;return 'city';});await Promise.resolve();assert.equal(started,false);finish();assert.equal(await next,'city');
 assert.equal(await afterAsset(Promise.reject(Error('optional model unavailable')),()=>42),42);
});
test('case progress follows evidence, supported comparison, containment and actual decision count',()=>{
 const current=s=>s.find(s=>s.status==='current')?.id;
 assert.equal(current(caseProgress()),'records');
 assert.equal(current(caseProgress({records:3,accounts:2,finding:0})),'compare');
 assert.equal(current(caseProgress({records:3,accounts:2,finding:1})),'contain');
 assert.equal(current(caseProgress({records:3,accounts:2,finding:1,contained:true,decisions:2})),'decide');
 assert.equal(current(caseProgress({records:3,accounts:2,finding:1,contained:true,decisions:3})),undefined);
});
test('connected summary uses only played cases, examined sources and recorded consequences without claiming corrections are complete',()=>{
 const report={openingCount:3,cases:[{id:'breach',title:'An uncontrolled copy',floor:48,sources:['Sync log'],correct:0,decisions:1}],decisions:[{story:'An uncontrolled copy',topic:'Containment',effect:'Copies remain exposed.',good:false,next:'Preserve records and request a scoped hold.',correction:'requested'}],followUp:[{}]};
 const summary=investigationSummary(report);assert.equal(summary.cases.length,1);assert.deepEqual(summary.cases[0].sources,['Sync log']);assert.match(summary.cases[0].link,/Blue Lantern/);assert.match(summary.cases[0].effects[0].text,/Copies remain exposed/);assert.equal(summary.cases[0].followUp[0].requested,true);assert.match(summary.closing,/not proof/);assert.match(summary.opening,/not proof/);
});
