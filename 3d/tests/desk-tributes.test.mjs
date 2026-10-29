import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {addDeskTributes,TRIBUTE_OBJECTS} from '../desk-tributes.js';
import {interactionOwner,visibleInScene} from '../fpv-interaction.js';

test('every case desk has a small grounded interactable object, with no poster assets',()=>{
 const positions=Array.from({length:10},(_,i)=>[i*3,0]),deskGroups=positions.map(()=>new T.Group());
 const props=addDeskTributes({positions,deskGroups});assert.equal(props.length,10);
 props.forEach((group,i)=>{
  assert.equal(group.parent,deskGroups[i]);assert.equal(group.name,TRIBUTE_OBJECTS[i%5]);
  assert.deepEqual(interactionOwner(group.children[0]).userData.interaction,{type:'tribute',index:i%5});
  const bounds=new T.Box3().setFromObject(group),size=bounds.getSize(new T.Vector3());
  assert.ok(size.x<=.36&&size.z<=.31&&size.y<=.35);assert.ok(Math.abs(bounds.min.y-.795)<1e-5);
  group.traverse(o=>{if(o.isMesh)assert.equal(o.material.map,null);});
  deskGroups[i].visible=false;assert.equal(visibleInScene(group),false);
 });
});
