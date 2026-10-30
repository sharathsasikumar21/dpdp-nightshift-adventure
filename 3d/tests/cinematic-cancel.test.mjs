import {test} from 'node:test';import assert from 'node:assert/strict';
import {playCinematic} from '../cinematics.js';
import {playEndingSequence} from '../ending-sequence.js';

function fixture(reduced=true){
 const oldDocument=globalThis.document,oldMotion=globalThis.matchMedia,events=[];let decoded,finished=0;
 const video={currentTime:0,readyState:2,paused:true,pause(){this.paused=true;events.push('pause');},play(){this.paused=false;return Promise.resolve();},removeAttribute(){events.push('reset');},load(){events.push('load');},requestVideoFrameCallback(fn){decoded=fn;return 4;},cancelVideoFrameCallback(id){assert.equal(id,4);events.push('cancel-frame');}};
 const nodes={video,'.cinema-play':{},'.cinema-poster':{hidden:false},'.cinema-status':{},'.cinema-sound':{},'.cinema-progress i':{style:{}},'.cinema-skip':{focus(){}}};
 const dialog={dataset:{},setAttribute(){},querySelector:s=>nodes[s],addEventListener(type,fn){this[type]=fn;},showModal(){events.push('show');},close(){events.push('close');},remove(){events.push('remove');}};
 globalThis.document={activeElement:{isConnected:true,focus(){events.push('focus');}},createElement:()=>dialog,body:{append(){events.push('append');}}};globalThis.matchMedia=()=>({matches:reduced});
 return {video,dialog,nodes,events,decoded:()=>decoded?.(),finish:()=>finished++,get finished(){return finished;},restore(){globalThis.document=oldDocument;globalThis.matchMedia=oldMotion;}};
}

test('leaving a run aborts its film, detaches before resetting media and settles once',async()=>{
 const f=fixture();try{const controller=new AbortController();const pending=playCinematic('credits',{signal:controller.signal,onFinish:f.finish});controller.abort();controller.abort();assert.equal(await pending,'aborted');assert.equal(f.finished,1);assert.ok(f.events.indexOf('remove')<f.events.indexOf('reset'));assert.equal(f.dialog.dataset.frame,'closed');assert.equal(f.video.onplaying,null);assert.equal(f.video.onended,null);}finally{f.restore();}
});

test('a new ending stays covered until its own decoded frame and ignores stale callbacks after skip',async()=>{
 const f=fixture(false);try{
  const pending=playCinematic('good-ending',{onFinish:f.finish});await Promise.resolve();
  assert.equal(f.dialog.dataset.frame,'loading');assert.equal(f.video.loop,false);
  const latePlaying=f.video.onplaying,lateEnd=f.video.onended;
  f.decoded();assert.equal(f.dialog.dataset.frame,'ready');assert.equal(f.nodes['.cinema-poster'].hidden,true);
  f.nodes['.cinema-skip'].onclick();assert.equal(await pending,'skipped');
  f.decoded();latePlaying();lateEnd();assert.equal(f.dialog.dataset.frame,'closed');assert.equal(f.finished,1);
  assert.ok(!f.dialog.innerHTML.includes('cinema-subtitle'));
 }finally{f.restore();}
});

test('reduced motion waits for Play and media errors release the film without replaying it',async()=>{
 const f=fixture();try{const pending=playCinematic('bad-ending',{onFinish:f.finish});assert.equal(f.video.paused,true);assert.equal(f.dialog.dataset.frame,'loading');f.video.onerror();assert.equal(await pending,'error');assert.equal(f.finished,1);assert.equal(f.video.onloadeddata,null);}finally{f.restore();}
});

test('late resolution of a play request cannot restart a closed film',async()=>{
 const f=fixture();try{
  let resolvePlay;f.video.play=()=>new Promise(resolve=>resolvePlay=resolve);
  const pending=playCinematic('credits',{onFinish:f.finish});const playing=f.nodes['.cinema-play'].onclick();f.nodes['.cinema-skip'].onclick();await pending;resolvePlay();await playing;assert.equal(f.video.paused,true);assert.equal(f.dialog.dataset.frame,'closed');assert.equal(f.finished,1);
 }finally{f.restore();}
});

test('the final reveal, ending and credits share a cover until the last stage finishes',async()=>{
 const events=[];await playEndingSequence({cover:()=>{events.push('cover');return()=>events.push('uncover');},reveal:async()=>events.push('reveal'),ending:async()=>events.push('ending'),credits:async()=>events.push('credits')});assert.deepEqual(events,['cover','reveal','ending','credits','uncover']);
});

test('aborting or leaving an ending prevents queued credits from starting',async()=>{
 for(const abort of [true,false]){const controller=new AbortController(),events=[];let current=true;await playEndingSequence({signal:controller.signal,isCurrent:()=>current,cover:()=>()=>events.push('uncover'),reveal:async()=>events.push('reveal'),ending:async()=>{events.push('ending');if(abort)controller.abort();else current=false;},credits:async()=>events.push('credits')});assert.deepEqual(events,['reveal','ending','uncover']);}
});

test('a failed ending stage always removes its transition cover',async()=>{
 let released=false;await assert.rejects(playEndingSequence({cover:()=>()=>released=true,reveal:async()=>{},ending:async()=>{throw Error('decode failed');},credits:async()=>assert.fail('credits must not start')}),/decode failed/);assert.equal(released,true);
});
