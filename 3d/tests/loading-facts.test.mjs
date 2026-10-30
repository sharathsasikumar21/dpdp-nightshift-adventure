import test from 'node:test';
import assert from 'node:assert/strict';
import {LOADING_FACTS,nextLoadingFact,rotateLoadingFacts} from '../loading-facts.js';

test('random loading trivia excludes the previous fact and reaches the whole collection',()=>{
 let previous='',seen=new Set();
 for(let i=0;i<LOADING_FACTS.length*2;i++){
  const next=nextLoadingFact(previous,()=>i/((LOADING_FACTS.length*2)-1));
  assert.ok(LOADING_FACTS.includes(next));assert.notEqual(next,previous);seen.add(next);previous=next;
 }
 assert.equal(seen.size,LOADING_FACTS.length);
});

test('loading trivia starts immediately, rotates and stops when the loader closes',()=>{
 const element={textContent:''};let callback,cleared=false;
 const stop=rotateLoadingFacts(element,{random:()=>0,schedule:fn=>{callback=fn;return 7;},cancel:id=>{assert.equal(id,7);cleared=true;}});
 const first=element.textContent;assert.ok(first);callback();assert.notEqual(element.textContent,first);
 stop();const last=element.textContent;callback();assert.equal(element.textContent,last);assert.ok(cleared);
});
