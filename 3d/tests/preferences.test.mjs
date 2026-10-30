import test from 'node:test';import assert from 'node:assert/strict';import {readPreferences,savePreferences} from '../preferences.js';
test('new dialogue subtitles default on and preserve legacy outlines',()=>{
 const legacy={getItem:key=>key.endsWith('v1')?JSON.stringify({subtitles:false,outline:true}):null};assert.deepEqual(readPreferences(legacy),{subtitles:true,outline:true,banter:true});assert.deepEqual(readPreferences({getItem(){throw Error('unavailable');}}),{subtitles:true,outline:false,banter:true});
});
test('a deliberate subtitle choice persists in the new preferences',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};savePreferences({subtitles:false,outline:true,banter:false},storage);assert.deepEqual(readPreferences(storage),{subtitles:false,outline:true,banter:false});
});
