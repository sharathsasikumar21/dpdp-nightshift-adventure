import test from 'node:test';import assert from 'node:assert/strict';import {createNPCRoutine} from '../npc-routine.js';
test('NPC actions vary only after a hold and stop during conversation or reduced motion',()=>{
 const routine=createNPCRoutine(()=>.6);assert.equal(routine.update(.1),'idle');
 let action;for(let i=0;i<100;i++)action=routine.update(.1);assert.equal(action,'look-around');
 assert.equal(routine.update(.1,{engaged:true}),'idle');assert.equal(routine.update(.1,{reduced:true}),'idle');
});
