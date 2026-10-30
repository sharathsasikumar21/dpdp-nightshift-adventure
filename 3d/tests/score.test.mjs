import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Sound} from '../adaptive-audio.js';
test('suspense score follows mute, film and hidden-tab state and ducks for briefing',()=>{
 const original=globalThis.document;globalThis.document={hidden:false};
 try{const sound=new Sound();sound.ctx={currentTime:0};
 const gain=()=>({gain:{value:0,setTargetAtTime(value){this.value=value;}}});
 sound.ambient=gain();sound.music=gain();sound.scoreGain=gain();sound.score={};
 sound.applyVolume();assert.equal(sound.scoreGain.gain.value,.8);
 sound.voiceActive=true;sound.applyVolume();assert.equal(sound.scoreGain.gain.value,.16);sound.voiceActive=false;sound.applyVolume();assert.equal(sound.scoreGain.gain.value,.8);
 const source=sound.score;sound.setSituation({phase:'arrival'});assert.equal(sound.scoreGain.gain.value,.8);sound.setSituation({phase:'home'});assert.equal(sound.score,source);assert.equal(sound.scoreGain.gain.value,.8);sound.setSituation({phase:'briefing'});assert.equal(sound.scoreGain.gain.value,.4);
 sound.toggle();assert.equal(sound.scoreGain.gain.value,0);
 sound.toggle();sound.setSituation({phase:'film'});assert.equal(sound.scoreGain.gain.value,0);
 sound.setSituation({phase:'decision'});globalThis.document.hidden=true;sound.applyVolume();assert.equal(sound.scoreGain.gain.value,0);
 globalThis.document.hidden=false;sound.applyVolume();assert.equal(sound.scoreGain.gain.value,.8);
 }finally{globalThis.document=original;}
});
