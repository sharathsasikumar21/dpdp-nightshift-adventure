import fs from 'node:fs';import test from 'node:test';import assert from 'node:assert/strict';
function glb(path){const b=fs.readFileSync(new URL('../media/'+path,import.meta.url));assert.equal(b.toString('ascii',0,4),'glTF');assert.ok(b.length<10*1024*1024,path);return JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));}
test('supplied companion, office character, skyline and street assets are complete browser files',()=>{
 for(const path of ['characters/labrador.glb','characters/mira.glb','city/office-night-skyline.glb','city/road.glb','city/street-props.glb','city/car.glb','city/bus.glb','city/su57.glb','city/a330.glb','city/a320.glb','city/planting.glb']){const d=glb(path);assert.ok(d.meshes.length);assert.ok(d.buffers.every(b=>!b.uri));assert.ok(d.images.every(i=>i.bufferView!==undefined));}
 const dog=glb('characters/labrador.glb');assert.ok(dog.skins.length);assert.ok(dog.animations.length);assert.equal(glb('characters/mira.glb').skins?.length||0,0);
});
