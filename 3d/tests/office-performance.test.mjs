import test from 'node:test';import assert from 'node:assert/strict';import * as T from '../vendor/three.module.js';import {batchStaticOffice,officeOccluders} from '../office-performance.js';
test('static batching keeps floor visibility and excludes interaction targets and moving doors',()=>{
 const scene=new T.Scene(),floor=new T.Group(),mat=new T.MeshStandardMaterial(),meshes=[];scene.add(floor);
 for(let i=0;i<5;i++){const mesh=new T.Mesh(new T.BoxGeometry(1,1,1),mat);mesh.position.x=i*2;floor.add(mesh);meshes.push(mesh);}
 meshes[3].userData.interaction={type:'terminal'};meshes[4].userData.dynamic=true;scene.updateMatrixWorld(true);
 const result=batchStaticOffice({meshes});assert.equal(result.originals,3);assert.equal(result.batches,1);assert.equal(result.savedDrawCalls,2);assert.equal(meshes[3].layers.mask,1);assert.equal(meshes[4].layers.mask,1);
 const combined=floor.children.find(o=>o.name==='Static office batch');assert.equal(combined.parent,floor);const bounds=new T.Box3().setFromObject(combined);assert.ok(bounds.max.x>4.4&&bounds.min.x<-.4);floor.visible=false;assert.equal(combined.parent.visible,false);
});
test('cached camera occlusion skips hidden departments and follows moving doors',()=>{
 const parent=new T.Group(),mesh=new T.Mesh(new T.BoxGeometry(2,2,.2),new T.MeshStandardMaterial());mesh.position.z=-3;mesh.userData.dynamic=true;parent.add(mesh);parent.updateMatrixWorld(true);const occlusion=officeOccluders([mesh]);const ray=new T.Ray(new T.Vector3(0,0,0),new T.Vector3(0,0,-1));assert.ok(occlusion.distance(ray,5)>2.8);parent.visible=false;assert.equal(occlusion.distance(ray,5),null);parent.visible=true;mesh.position.x=4;parent.updateMatrixWorld(true);assert.equal(occlusion.distance(ray,5),null);
});
