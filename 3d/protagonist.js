import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
export function createProtagonist(){
 const group=new T.Group();group.name='Simon Ghost Riley';let model=null;
 const ready=new GLTFLoader().loadAsync(new URL('./media/characters/simon-riley.glb',import.meta.url).href).then(asset=>{
  model=asset.scene;const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),centre=bounds.getCenter(new T.Vector3());
  const scale=1.82/size.y;model.scale.setScalar(scale);model.position.set(-centre.x*scale,-bounds.min.y*scale,-centre.z*scale);
  model.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.frustumCulled=false;for(const m of Array.isArray(o.material)?o.material:[o.material]){m.roughness=Math.max(.75,m.roughness);m.envMapIntensity=.35;}}});
  group.add(model);return group;
 });
 ready.catch(()=>{group.userData.loadFailed=true;});
 return {group,ready,poseAt(){},update(){},setQuality(){}};
}
