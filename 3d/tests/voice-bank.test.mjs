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

test('caption names and lines follow the current voice and clear when playback stops',async()=>{
 const shown=[],audios=[];class Audio{constructor(){audios.push(this);}play(){return Promise.resolve();}pause(){}}
 const clip={id:'named',src:'line.mp3',text:'Preserve the log.',speaker:'Mira'};
 const bank=new VoiceBank({clips:{mira:[clip]},Audio,onCaption:line=>shown.push(line)});await bank.play('mira');assert.equal(shown.at(-1),clip);audios[0].onended();assert.equal(shown.at(-1),null);
});
test('crew exchange plays replies only after the first speaker finishes and cancels on interruption',async()=>{
 const audios=[];class Audio{constructor(src){this.src=src;audios.push(this);}play(){return Promise.resolve();}pause(){}}
 const bank=new VoiceBank({clips:{first:[{id:'1',src:'1.mp3'}],reply:[{id:'2',src:'2.mp3'}]},Audio});
 await bank.playExchange(['first','reply']);assert.equal(audios.length,1);audios[0].onended();await Promise.resolve();assert.equal(audios.length,2);bank.stop();
 await bank.playExchange(['first','reply']);const stale=audios[2].onended;bank.stop();stale();assert.equal(audios.length,3);
});

test('serious mode excludes banter but keeps warning narration and can stop only an active joke',async()=>{let banter=false;const audios=[];class Audio{constructor(src){this.src=src;audios.push(this);}play(){return Promise.resolve();}pause(){this.paused=true;}}const bank=new VoiceBank({clips:{warning:[{id:'warning-banter-1',src:'joke.mp3'},{id:'warning-1',src:'serious.mp3'}]},Audio,getBanter:()=>banter,random:()=>0});await bank.play('warning',{cooldown:0});assert.ok(audios[0].src.includes('serious'));bank.stopBanter();assert.equal(audios[0].paused,undefined);bank.stop();banter=true;await bank.play('warning',{cooldown:0});assert.ok(audios[1].src.includes('joke'));bank.stopBanter();assert.equal(audios[1].paused,true);});
