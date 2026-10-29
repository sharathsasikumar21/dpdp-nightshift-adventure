import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {parseCharacterFBX,characterMaterials,inPlaceClip} from '../character-assets.js';
function load(name){const data=fs.readFileSync(new URL('../media/characters/'+name,import.meta.url));return parseCharacterFBX(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength));}
test('real male and female FBX material groups retain separate clothing, skin and hair',()=>{
 const saved=globalThis.window;globalThis.window={innerWidth:1280,innerHeight:720,URL};
 try{for(const file of ['dpo.fbx','woman.fbx']){const model=load(file),cloth={},skin={},hair={};let checked=0;model.traverse(o=>{if(o.isMesh){assert.ok(Array.isArray(o.material));const mapped=characterMaterials(o.material,{cloth,skin,hair});assert.deepEqual(mapped,[cloth,skin,hair]);assert.ok(o.geometry.groups.some(g=>g.materialIndex===0));assert.ok(o.geometry.groups.some(g=>g.materialIndex===1));checked++;}});assert.ok(checked);}}finally{globalThis.window=saved;}
});
test('male walking motion retargets without stretching the female skeleton',()=>{
 const saved=globalThis.window;globalThis.window={innerWidth:1280,innerHeight:720,URL};
 try{const model=load('woman.fbx'),lengths=new Map();model.traverse(b=>{if(b.isBone&&b.name!=='Bip01')lengths.set(b.name,b.position.length());});const clip=inPlaceClip(load('walk.fbx').animations[0],model,{retarget:true}),mixer=new T.AnimationMixer(model);mixer.clipAction(clip).play();mixer.update(.5);model.traverse(b=>{if(lengths.has(b.name))assert.ok(Math.abs(b.position.length()-lengths.get(b.name))<.0001,b.name);});}finally{globalThis.window=saved;}
});
test('walking and running clips retain vertical motion while removing horizontal root drift',()=>{
 const saved=globalThis.window;globalThis.window={innerWidth:1280,innerHeight:720,URL};
 try{const model=load('dpo.fbx');for(const name of ['walk.fbx','run.fbx']){const clip=inPlaceClip(load(name).animations[0],model),root=clip.tracks.find(t=>t.name==='Bip01.position');assert.ok(root);for(let i=0;i<root.values.length;i+=3){assert.equal(root.values[i],root.values[0]);assert.equal(root.values[i+2],root.values[2]);}assert.ok(new Set(Array.from(root.values).filter((_,i)=>i%3===1)).size>1);}}finally{globalThis.window=saved;}
});
