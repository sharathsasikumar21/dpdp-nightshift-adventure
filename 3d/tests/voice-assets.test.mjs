import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import {VOICE_CLIPS} from '../voice-manifest.js';
test('every contextual and tutorial voice has a real matching audio file and current content hash',()=>{
 for(const group of ['evidence','terminal','coffee','keepsake','lift','warning','mira','arjun','leena'])assert.equal(VOICE_CLIPS[group].length,2,group);
 for(let i=1;i<=8;i++)assert.equal(VOICE_CLIPS['tutorial-'+i].length,1);
 const metadata=JSON.parse(fs.readFileSync(new URL('../media/voices/voice-lines.json',import.meta.url),'utf8'));
 for(const clips of Object.values(VOICE_CLIPS))for(const clip of clips){const url=new URL('../'+clip.src,import.meta.url),data=fs.readFileSync(url),hash=crypto.createHash('sha256').update(data).digest('hex');assert.equal(url.searchParams.get('v'),hash.slice(0,12),clip.id);assert.equal(metadata[clip.id].sha256,hash,clip.id);assert.ok(metadata[clip.id].duration>0&&metadata[clip.id].duration<16,clip.id);assert.ok(data.length>1000,clip.id);}
});
