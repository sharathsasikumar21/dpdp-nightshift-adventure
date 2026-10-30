import fs from 'node:fs';import test from 'node:test';import assert from 'node:assert/strict';
test('uploaded protagonist is packaged as a lightweight self-contained GLB',()=>{
 const bytes=fs.readFileSync(new URL('../media/characters/simon-riley.glb',import.meta.url));assert.equal(bytes.toString('ascii',0,4),'glTF');assert.equal(bytes.readUInt32LE(4),2);assert.ok(bytes.length<10*1024*1024);
 const data=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));const triangles=data.meshes.flatMap(m=>m.primitives).reduce((n,p)=>n+data.accessors[p.indices].count/3,0);assert.ok(triangles<50000);assert.ok(data.buffers.every(b=>!b.uri));assert.ok(data.images.every(i=>i.bufferView!==undefined));
});
