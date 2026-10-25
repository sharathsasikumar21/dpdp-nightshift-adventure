import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createIntroScore} from '../intro-score.js';
test('muting during an intro download prevents late playback',async()=>{
 let complete,started=0;
 const score=createIntroScore({fetchAudio:()=>new Promise(resolve=>complete=resolve)});
 const context={state:'running',decodeAudioData:async()=>({duration:14}),createBufferSource(){started++;}};
 const pending=score.play(context);score.stop();
 complete({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});
 assert.equal(await pending,false);assert.equal(started,0);
});
test('intro seeks to the current scene time and stop releases the source',async()=>{
 let offset=null,stopped=0;
 const score=createIntroScore({fetchAudio:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)})});
 const context={state:'running',currentTime:1,destination:{},decodeAudioData:async()=>({duration:14}),createGain:()=>({connect(){},disconnect(){},gain:{setValueAtTime(){},linearRampToValueAtTime(){},setTargetAtTime(){}}}),createBufferSource:()=>({connect(){},disconnect(){},start(_,value){offset=value;},stop(){stopped++;}})};
 assert.equal(await score.play(context,()=>3),true);assert.equal(offset,3);score.stop();assert.equal(stopped,1);
 assert.equal(await score.play(context,()=>15),false);
});
