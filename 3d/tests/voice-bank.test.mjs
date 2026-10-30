import test from 'node:test';import assert from 'node:assert/strict';import {VoiceBank,chooseVoice} from '../voice-bank.js';
const clips={evidence:[{id:'a',src:'a.mp3'},{id:'b',src:'b.mp3'}],tutorial:[{id:'t',src:'t.mp3'}]};
test('contextual voices avoid repeats and cooldowns prevent interaction spam',async()=>{
 let time=0;const audio=[];class Audio{constructor(src){this.src=src;audio.push(this);}play(){return Promise.resolve();}pause(){this.paused=true;}}
 const bank=new VoiceBank({clips,Audio,now:()=>time,random:()=>0});
 assert.equal(await bank.play('evidence'),true);assert.equal(await bank.play('evidence'),false);audio[0].onended();time=15000;assert.equal(await bank.play('evidence'),true);assert.ok(audio[1].src.endsWith('/b.mp3'));bank.stop();
 assert.equal(chooseVoice(clips.evidence,'a',()=>0).id,'b');
});
test('voices stop on mute or scene changes and late playback cannot revive them',async()=>{
 let resolve,allowed=true,active=false;const audios=[];class Audio{constructor(){audios.push(this);}play(){return new Promise(r=>resolve=r);}pause(){this.paused=true;}}
 const bank=new VoiceBank({clips,Audio,isAllowed:()=>allowed,onActive:value=>active=value});
 const pending=bank.play('evidence');bank.stop();resolve();assert.equal(await pending,false);assert.equal(active,false);assert.equal(audios[0].paused,true);allowed=false;assert.equal(await bank.play('tutorial'),false);assert.equal(audios.length,1);
});
test('tutorial narration replaces the current line while ordinary reactions do not overlap',async()=>{
 const audios=[];class Audio{constructor(){audios.push(this);}play(){return Promise.resolve();}pause(){this.paused=true;}}
 const bank=new VoiceBank({clips,Audio});await bank.play('evidence');assert.equal(await bank.play('tutorial'),false);assert.equal(await bank.play('tutorial',{priority:true,cooldown:0}),true);assert.equal(audios[0].paused,true);assert.equal(audios[0].onended,null);bank.stop();
});
