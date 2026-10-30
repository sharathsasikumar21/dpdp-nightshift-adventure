import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
import {coastalRoadPoint,ROAD_Y} from './city-traffic.js';
import {batchStaticOffice} from './office-performance.js';
export function addSuppliedStreets(root,fallback){
 const street=new T.Group();street.name='Supplied streets and coastal road';root.add(street);const loader=new GLTFLoader();
 const ready=Promise.all([
  loader.loadAsync(new URL('./media/city/road.glb',import.meta.url).href).then(asset=>{
   asset.scene.updateMatrixWorld(true);let source;asset.scene.traverse(o=>{if(o.isMesh&&!source)source=o;});if(!source)throw Error('Road mesh missing');
   const original=source.geometry.clone().applyMatrix4(source.matrixWorld);original.computeBoundingBox();const bounds=original.boundingBox,size=bounds.getSize(new T.Vector3()),centre=bounds.getCenter(new T.Vector3());
   for(let segment=0;segment<12;segment++){
    const geometry=original.clone(),position=geometry.attributes.position;
    for(let i=0;i<position.count;i++){const t=(segment+(position.getZ(i)-bounds.min.z)/size.z)/12,lane=(position.getX(i)-centre.x)/size.x*6.2,p=coastalRoadPoint(t,lane),y=ROAD_Y-.045+(position.getY(i)-bounds.min.y)*6.2/size.x;position.setXYZ(i,p.x,y,p.z);}
    geometry.computeVertexNormals();geometry.computeBoundingSphere();const mesh=new T.Mesh(geometry,source.material);street.add(mesh);
   }original.dispose();fallback.visible=false;
  }),
  loader.loadAsync(new URL('./media/city/street-props.glb',import.meta.url).href).then(asset=>{
   const find=name=>{let result;asset.scene.traverse(o=>{if(o.name.replaceAll('_',' ').toLowerCase()===name.toLowerCase())result=o;});return result;};
   function place(source,t,lane,height=null){if(!source)return;const clone=source.clone(true),bounds=new T.Box3().setFromObject(clone),size=bounds.getSize(new T.Vector3()),centre=bounds.getCenter(new T.Vector3()),scale=height?height/size.y:1;
    const holder=new T.Group();clone.scale.multiplyScalar(scale);clone.position.sub(new T.Vector3(centre.x*scale,bounds.min.y*scale,centre.z*scale));holder.add(clone);const p=coastalRoadPoint(t,lane);holder.position.set(p.x,ROAD_Y+.015,p.z);holder.rotation.y=p.yaw;street.add(holder);
   }
   for(let i=0;i<=12;i++)place(find('StreetLampSingle'),i/12,-4.5,7);
   for(let i=0;i<60;i++){place(find('SideWalkA'),(i+.5)/60,-4.2);place(find('Railing2m'),(i+.5)/60,-5.3);}
   for(const t of [.12,.5,.87])place(find('Traffic Light'),t,4.1,6);
   const meshes=[];street.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;meshes.push(o);}});for(const mesh of meshes)if(mesh.parent!==street)street.attach(mesh);batchStaticOffice({meshes});
  })
 ]).catch(error=>console.warn('Keeping available street geometry.',error));
 return {ready};
}
