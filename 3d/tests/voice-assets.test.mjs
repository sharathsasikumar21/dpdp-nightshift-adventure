import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import {VOICE_CLIPS} from '../voice-manifest.js';
test('every contextual and tutorial voice has a real matching audio file and current content hash',()=>{
 for(const group of ['evidence','terminal','coffee','keepsake','lift','warning','mira','arjun','leena'])assert.ok(VOICE_CLIPS[group].length>=2,group);
 for(let i=1;i<=8;i++)assert.equal(VOICE_CLIPS['tutorial-'+i].length,1);
 const metadata=JSON.parse(fs.readFileSync(new URL('../media/voices/voice-lines.json',import.meta.url),'utf8'));
 for(const clips of Object.values(VOICE_CLIPS))for(const clip of clips){const url=new URL('../'+clip.src,import.meta.url),data=fs.readFileSync(url),hash=crypto.createHash('sha256').update(data).digest('hex');assert.equal(url.searchParams.get('v'),hash.slice(0,12),clip.id);assert.equal(metadata[clip.id].sha256,hash,clip.id);assert.equal(clip.text,metadata[clip.id].text);assert.ok(clip.speaker);assert.ok(metadata[clip.id].duration>0&&metadata[clip.id].duration<16,clip.id);assert.ok(data.length>1000,clip.id);}
});

test('DPO reactions and kind Chikku greetings use the recorded male voice',()=>{
 const metadata=JSON.parse(fs.readFileSync(new URL('../media/voices/voice-lines.json',import.meta.url),'utf8'));
 for(const group of ['evidence','terminal','coffee','keepsake','warning','pet-dpo']){
  assert.ok(VOICE_CLIPS[group]?.length>=2,group);
  for(const clip of VOICE_CLIPS[group]){assert.equal(metadata[clip.id].voice,'am_adam',clip.id);assert.equal(clip.speaker,'Simon Ghost Riley · DPO');}
 }
 assert.ok(VOICE_CLIPS['pet-dpo'].every(clip=>clip.text.includes('Chikku')&&clip.text.includes('Good girl')));
});

test('walking hints, optional banter and Chikku discovery have the intended recorded speakers',()=>{
 const metadata=JSON.parse(fs.readFileSync(new URL('../media/voices/voice-lines.json',import.meta.url),'utf8'));
 assert.equal(VOICE_CLIPS.walk.length,6);assert.equal(VOICE_CLIPS.walk.filter(c=>c.id.includes('-banter-')).length,3);
 for(const c of [...VOICE_CLIPS.walk,...VOICE_CLIPS['pet-found']])assert.equal(metadata[c.id].voice,'am_adam');
 assert.equal(VOICE_CLIPS['chikku-found-alert'][0].speaker,'Mira · Incident analyst');
 for(const group of ['pet-dpo','pet-mira','pet-arjun'])for(const c of VOICE_CLIPS[group])assert.ok(c.text.includes('Good girl'));
});

test('wrong-call NPC roasts have distinct character voices and respect banter filtering',()=>{
 const metadata=JSON.parse(fs.readFileSync(new URL('../media/voices/voice-lines.json',import.meta.url),'utf8'));
 for(const [role,voice] of [['mira','af_heart'],['arjun','am_michael'],['leena','bf_emma']]){const clips=VOICE_CLIPS['rage-'+role];assert.equal(clips.length,2);for(const c of clips){assert.ok(c.id.includes('-banter-'));assert.equal(metadata[c.id].voice,voice);}}
});
