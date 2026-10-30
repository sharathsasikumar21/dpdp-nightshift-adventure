import test from 'node:test';import assert from 'node:assert/strict';import {nextInstruction,navigationMarker} from '../navigation-guidance.js';
test('guidance follows floor travel, arrival clues, case evidence and terminal interaction',()=>{
 assert.match(nextInstruction({currentFloor:47,targetFloor:50}),/Lift.*50/);
 assert.match(nextInstruction({openingCount:2,near:true}),/2\/3.*badge/);
 assert.match(nextInstruction({openingCount:3}),/Follow.*active case table/);
 assert.match(nextInstruction({openingCount:3,evidenceCount:2,near:true}),/2\/3/);
 assert.match(nextInstruction({openingCount:3,evidenceCount:3,near:true}),/terminal and press E/);
});
test('marker stays visible for targets ahead, behind, offscreen and on other floors',()=>{
 const base={x:0,y:0,z:0,degrees:0,sameFloor:true,distance:10,targetFloor:48};assert.equal(navigationMarker(base).left,50);
 assert.match(navigationMarker({...base,z:2,degrees:180}).label,/TURN AROUND/);
 assert.equal(navigationMarker({...base,x:3,degrees:-80}).left,92);
 assert.match(navigationMarker({...base,sameFloor:false}).label,/LIFT.*48/);
});
