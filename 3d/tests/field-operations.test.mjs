import test from 'node:test';import assert from 'node:assert/strict';
import {chainConsequence,operationPlan,operationRecord,advanceOperation,operationsComplete,finalFinding} from '../field-operations.js';import {makeCheckpoint,restoreCheckpoint} from '../checkpoint.js';
const previous=good=>({turn:3,route:[0,4],id:'run',log:[0,1,2].map(scene=>({turn:scene,story:0,scene,results:[{id:'p',good}]}))});
test('unsafe earlier decisions add a required reconciliation task without hiding evidence',()=>{
 const unsafe=previous(false),safe=previous(true);assert.equal(chainConsequence(unsafe,'p').unsafe,3);assert.ok(operationPlan(unsafe,'p').some(s=>s.id==='reconcile'));assert.ok(!operationPlan(safe,'p').some(s=>s.id==='reconcile'));
 unsafe.log.push({story:4,results:[{id:'p',good:false}]});assert.equal(chainConsequence(unsafe,'p').unsafe,3);
});
test('operations require ordered preservation, scoping and hold plus a verified witness comparison',()=>{
 const state={id:'run',turn:0,route:[0],log:[]},plan=operationPlan(state,'p'),record=operationRecord(state);
 assert.equal(advanceOperation(record,plan,'hold'),false);assert.equal(operationsComplete(record,plan),false);
 for(const step of plan)assert.equal(advanceOperation(record,plan,step.id),true);
 assert.equal(advanceOperation(record,plan,'hold'),false);record.witnesses=[0,1];record.finding=0;assert.equal(operationsComplete(record,plan),false);record.finding=1;assert.equal(operationsComplete(record,plan),true);
 state.turn=3;state.route.push(4);assert.deepEqual(operationRecord(state).steps,[]);
});
test('final finding distinguishes signed authorisation from unsupported witness attribution',()=>{
 assert.equal(finalFinding(0).good,false);assert.equal(finalFinding(1).good,false);assert.equal(finalFinding(2).good,true);assert.match(finalFinding(2).explanation,/authorisation/);
});
test('case operations survive checkpoint restoration alongside completed case decisions',()=>{
 const state={...previous(true),phase:'break',players:[{id:'p',points:300,integrity:94,streak:3,best:3,correct:3}],fieldOperations:{0:{steps:['preserve','scope','hold'],witnesses:[0,1],finding:1}}};
 const saved=makeCheckpoint(state),restored=restoreCheckpoint(saved,'new-player','new-run');assert.deepEqual(restored.state.fieldOperations,state.fieldOperations);assert.equal(restored.state.log[0].results[0].id,'new-player');
});
