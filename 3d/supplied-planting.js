import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
import {coastalRoadPoint,ROAD_Y} from './city-traffic.js';
export function addSuppliedPlanting(scene,outdoor,blocks){
 const pots=[{x:-14,y:.42,z:-6},{x:14,y:.42,z:-6}];for(const p of pots)blocks.push({x:p.x,z:p.z,w:.65,d:.65});
 const ready=new GLTFLoader().loadAsync(new URL('./media/city/planting.glb',import.meta.url).href).then(asset=>{
  asset.scene.updateMatrixWorld(true);
  function instances(name,count,height,parent,points){const source=asset.scene.getObjectByName(name);if(!source?.isMesh)return;const geometry=source.geometry.clone().applyMatrix4(source.matrixWorld);geometry.computeBoundingBox();const box=geometry.boundingBox,size=box.getSize(new T.Vector3()),centre=box.getCenter(new T.Vector3()),scale=height/size.y;geometry.translate(-centre.x,-box.min.y,-centre.z);geometry.scale(scale,scale,scale);const material=source.material.clone();material.alphaTest=.35;material.alphaToCoverage=true;const mesh=new T.InstancedMesh(geometry,material,count),dummy=new T.Object3D();points.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.y=i*2.4;dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});parent.add(mesh);return mesh;}
  instances('OfficePlant',pots.length,.6,scene,pots);
  const potMaterial=new T.MeshStandardMaterial({color:'#555e5c',roughness:.8});for(const p of pots){const pot=new T.Mesh(new T.CylinderGeometry(.3,.24,.42,12),potMaterial);pot.position.set(p.x,.21,p.z);scene.add(pot);}
  const grass=Array.from({length:24},(_,i)=>{const p=coastalRoadPoint((i+.5)/24,-7);return {x:p.x,y:ROAD_Y+.03,z:p.z};});instances('GrassPatch',grass.length,.4,outdoor,grass);
 }).catch(error=>console.warn('Existing office planting retained.',error));return {ready};
}
