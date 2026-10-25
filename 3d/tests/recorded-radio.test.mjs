import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLiftRadio} from '../lift-radio.js';
test('recorded radio is reused and stopping prevents a late speech fallback',async()=>{
 let instance,rejectPlay,spoken=0;
 class Recording{constructor(){instance=this;this.currentTime=0;this.paused=true;}play(){this.paused=false;return new Promise((_,reject)=>rejectPlay=reject);}pause(){this.paused=true;}}
 const radio=createLiftRadio({Audio:Recording,speech:{speak(){spoken++;},cancel(){},getVoices(){return[];}},Utterance:class{}});
 assert.equal(radio.play(),true);assert.equal(instance.paused,false);radio.stop();rejectPlay(Error('late failure'));await Promise.resolve();assert.equal(instance.paused,true);assert.equal(spoken,0);
});
