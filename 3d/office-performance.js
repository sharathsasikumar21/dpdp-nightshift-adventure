import * as T from './vendor/three.module.js';
import {interactionOwner,visibleInScene} from './fpv-interaction.js';

// Combine static geometry by its actual parent and material. Parent visibility
// still controls departments; interactive objects and moving doors stay separate.
export function batchStaticOffice(office){
 const groups=new Map();let originals=0,batches=0;
 for(const mesh of office.meshes){
  if(!mesh.parent||!mesh.isMesh||mesh.isInstancedMesh||Array.isArray(mesh.material)||mesh.material.transparent||mesh.userData.dynamic||interactionOwner(mesh))continue;
  if(!mesh.geometry.attributes.normal||!mesh.geometry.attributes.uv)continue;
  const key=mesh.parent.uuid+'/'+mesh.material.uuid;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);
 }
 for(const meshes of groups.values()){
  if(meshes.length<3)continue;const parent=meshes[0].parent,positions=[],normals=[],uvs=[];
  for(const mesh of meshes){mesh.updateMatrix();const geometry=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();geometry.applyMatrix4(mesh.matrix);positions.push(geometry.attributes.position.array);normals.push(geometry.attributes.normal.array);uvs.push(geometry.attributes.uv.array);geometry.dispose();mesh.layers.set(1);mesh.matrixAutoUpdate=false;originals++;}
  const join=arrays=>{const result=new Float32Array(arrays.reduce((n,a)=>n+a.length,0));let offset=0;for(const a of arrays){result.set(a,offset);offset+=a.length;}return result;};
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(join(positions),3));geometry.setAttribute('normal',new T.BufferAttribute(join(normals),3));geometry.setAttribute('uv',new T.BufferAttribute(join(uvs),2));geometry.computeBoundingSphere();
  const combined=new T.Mesh(geometry,meshes[0].material);combined.name='Static office batch';combined.castShadow=meshes.some(m=>m.castShadow);combined.receiveShadow=true;combined.matrixAutoUpdate=false;parent.add(combined);batches++;
 }
 return {originals,batches,savedDrawCalls:originals-batches};
}

export function officeOccluders(meshes){
 const records=[],size=new T.Vector3(),point=new T.Vector3();
 for(const mesh of meshes){if(!mesh.geometry||Array.isArray(mesh.material)||mesh.material.transparent||interactionOwner(mesh))continue;mesh.geometry.computeBoundingBox();mesh.geometry.boundingBox.getSize(size);if(Math.max(size.x,size.y,size.z)<.4||Math.max(size.x*size.y,size.y*size.z,size.x*size.z)<.08)continue;records.push({mesh,box:new T.Box3().setFromObject(mesh)});}
 return {count:records.length,distance(ray,limit=Infinity){let nearest=limit,found=false;for(const record of records){if(!visibleInScene(record.mesh))continue;if(record.mesh.userData.dynamic)record.box.setFromObject(record.mesh);if(!ray.intersectBox(record.box,point))continue;const distance=ray.origin.distanceTo(point);if(distance<nearest){nearest=distance;found=true;}}return found?nearest:null;}};
}
