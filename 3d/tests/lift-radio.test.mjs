import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiftRadio,LIFT_CALL} from '../lift-radio.js';

test('dispatch speaks the room emergency and cancels on mute or exit',()=>{
 const spoken=[];let cancelled=0;
 const voice={lang:'en-IN'};
 const speech={getVoices:()=>[voice],speak:u=>spoken.push(u),cancel:()=>cancelled++};
 const radio=createLiftRadio({speech,Utterance:class{constructor(text){this.text=text;}}});
 assert.equal(radio.play(),true);assert.equal(spoken[0].text,LIFT_CALL);
 assert.match(LIFT_CALL,/Ghost/);assert.match(LIFT_CALL,/Incident Operations Room/);
 assert.equal(spoken[0].voice,voice);
 radio.play();assert.equal(cancelled,1); // Re-enabling cannot stack transmissions.
 radio.stop();assert.equal(cancelled,2);
 radio.stop();assert.equal(cancelled,2);
});
test('speech-unavailable browsers retain the transcript fallback without throwing',()=>{
 const radio=createLiftRadio({speech:null,Utterance:null});
 assert.equal(radio.play(),false);radio.stop();
});
