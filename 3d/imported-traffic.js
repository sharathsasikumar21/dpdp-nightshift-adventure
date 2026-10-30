import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
import {mergeGeometries} from './vendor/addons/utils/BufferGeometryUtils.js';
import {coastalRoadPoint,ROAD_Y} from './city-traffic.js';
export const CAR_SLOTS=[0,1,3,4,5,6,7,8,9,11,12,13,14,15],BUS_SLOTS=[2,10];
export function trafficPosition(slot,time){const direction=slot%2?1:-1,t=((slot/16+time*.018*direction)%1+1)%1,p=coastalRoadPoint(t,direction*1.35);return {...p,yaw:p.yaw+(direction<0?Math.PI:0)};}
export function flightPosition(index,time){const phases=[0,100,175],period=260,duration=[65,65,18][index],age=((time-phases[index])%period+period)%period;return {visible:age<duration,x:-240+age/duration*480,y:[92,105,72][index],z:[210,235,155][index]};}
function normalise(scene,length){
 scene.updateMatrixWorld(true);let box=new T.Box3().setFromObject(scene),size=box.getSize(new T.Vector3());if(size.x>size.z){scene.rotation.y+=Math.PI/2;scene.updateMatrixWorld(true);box.setFromObject(scene);size=box.getSize(new T.Vector3());}
 const centre=box.getCenter(new T.Vector3()),scale=length/size.z,offset=new T.Matrix4().makeTranslation(-centre.x*scale,-box.min.y*scale,-centre.z*scale),matrix=offset.multiply(new T.Matrix4().makeScale(scale,scale,scale));return matrix;
}
export function addImportedTraffic(root,fallback,legacyPlane){
 const loader=new GLTFLoader(),fleets=[],aircraft=[],dummy=new T.Object3D();let lastTime=0;
 async function fleet(file,slots,length){const asset=await loader.loadAsync(new URL('./media/city/'+file,import.meta.url).href),normal=normalise(asset.scene,length),groups=new Map();
  asset.scene.traverse(o=>{if(!o.isMesh)return;const material=o.material,geometry=o.geometry.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(normal,o.matrixWorld));for(const key of Object.keys(geometry.attributes))if(!['position','normal','uv'].includes(key))geometry.deleteAttribute(key);if(!geometry.attributes.uv)geometry.setAttribute('uv',new T.BufferAttribute(new Float32Array(geometry.attributes.position.count*2),2));const key=material.uuid;if(!groups.has(key))groups.set(key,{material,geometries:[]});groups.get(key).geometries.push(geometry.index?geometry.toNonIndexed():geometry);});
  const meshes=[];for(const {material,geometries} of groups.values()){const geometry=mergeGeometries(geometries),mesh=new T.InstancedMesh(geometry,material,slots.length);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;root.add(mesh);meshes.push(mesh);if(file==='car.glb'&&/body/i.test(material.name))slots.forEach((_,i)=>mesh.setColorAt(i,new T.Color(['#d4d2c8','#687780','#514b4b','#b8bec3'][i%4])));}
  fleets.push({slots,meshes});update(lastTime);return meshes;
 }
 const ground=Promise.all([fleet('car.glb',CAR_SLOTS,4.2),fleet('bus.glb',BUS_SLOTS,9)]).then(()=>fallback.meshes.forEach(m=>m.visible=false)).catch(error=>console.warn('Available traffic retained.',error));
 const sky=Promise.all(['a330.glb','a320.glb','su57.glb'].map(async(file,index)=>{const asset=await loader.loadAsync(new URL('./media/city/'+file,import.meta.url).href),model=asset.scene,normal=normalise(model,[34,30,13][index]);const holder=new T.Group();model.applyMatrix4(normal);model.rotation.y+=Math.PI/2;holder.add(model);root.add(holder);aircraft[index]=holder;model.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}});})).then(()=>{legacyPlane.visible=false;update(lastTime);}).catch(error=>console.warn('Available aircraft retained.',error));
 function update(time){lastTime=time;for(const {slots,meshes} of fleets){slots.forEach((slot,i)=>{const p=trafficPosition(slot,time);dummy.position.set(p.x,ROAD_Y+.01,p.z);dummy.rotation.set(0,p.yaw,0);dummy.updateMatrix();meshes.forEach(mesh=>mesh.setMatrixAt(i,dummy.matrix));});meshes.forEach(mesh=>mesh.instanceMatrix.needsUpdate=true);}
  aircraft.forEach((model,i)=>{const p=flightPosition(i,time);model.visible=p.visible;model.position.set(p.x,p.y,p.z);});
 }
 return {ready:Promise.all([ground,sky]),update};
}
