import test from 'node:test';import assert from 'node:assert/strict';import {animateIntroCard,INTRO_LINES} from '../intro-card.js';
test('the typewriter catches up after a skipped frame and finishes every letter of the name and mission',()=>{
 let time=0,tick;const nodes=INTRO_LINES.map(()=>({textContent:''})),assignment={style:{}};const container={querySelector:selector=>selector==='.intro-assignment'?assignment:nodes[Number(selector.match(/\d+/)[0])]};
 const typing=animateIntroCard(container,{now:()=>time,schedule:fn=>{tick=fn;return 1;},cancel(){}});
 time=250;tick();assert.ok(INTRO_LINES[0].text.startsWith(nodes[0].textContent));assert.ok(nodes[0].textContent.length>0);
 time=5000;tick();assert.deepEqual(nodes.map(n=>n.textContent),INTRO_LINES.map(n=>n.text));assert.equal(nodes[0].textContent,'Simon Ghost Riley');typing.complete();typing.cancel();time=6000;tick();assert.equal(assignment.style.opacity,'1');
});
