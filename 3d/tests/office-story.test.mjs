import {test} from 'node:test';
import assert from 'node:assert/strict';
import {openingComplete,operationalState} from '../office-story.js';
test('opening requires all three unique leads, not repeated inspections',()=>{
 assert.equal(openingComplete(new Set([0,1])),false);
 assert.equal(openingComplete(new Set([0,1,8])),false);
 assert.equal(openingComplete(new Set([2,0,1])),true);
});
test('security restrictions are player-specific and recover one level per defensible call',()=>{
 const log=[];const add=(id,good)=>log.push({results:[{id,good}]});
 add('other',false);assert.equal(operationalState(log,'you').pressure,0);
 add('you',false);assert.equal(operationalState(log,'you').restricted,false);
 add('you',false);assert.equal(operationalState(log,'you').restricted,true);
 add('you',false);add('you',false);assert.equal(operationalState(log,'you').pressure,3);
 add('you',true);assert.equal(operationalState(log,'you').restricted,true);
 add('you',true);assert.equal(operationalState(log,'you').restricted,false);
 add('you',true);add('you',true);assert.equal(operationalState(log,'you').pressure,0);
});
