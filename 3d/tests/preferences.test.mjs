import test from 'node:test';import assert from 'node:assert/strict';import {readPreferences} from '../preferences.js';
test('old saved subtitle preferences cannot restore removed overlays and outlines are preserved',()=>{
 const saved={getItem:()=>JSON.stringify({subtitles:true,outline:true})};assert.deepEqual(readPreferences(saved),{subtitles:false,outline:true});assert.deepEqual(readPreferences({getItem(){throw Error('storage unavailable');}}),{subtitles:false,outline:false});
});
