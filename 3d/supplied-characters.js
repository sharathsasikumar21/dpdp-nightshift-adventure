import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
const key=name=>name.replace(/[^a-z0-9]/gi,'').toLowerCase();
export function createSuppliedCharacter(file,{height=1.7,animate=false}={}){
 const group=new T.Group(),bones=new Map();let mixer=null,model=null;
 const ready=new GLTFLoader().loadAsync(new URL('./media/characters/'+file,import.meta.url).href).then(asset=>{
  model=asset.scene;model.traverse(o=>{if(o.isBone)bones.set(key(o.name),o);});
  const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),centre=bounds.getCenter(new T.Vector3()),scale=height/size.y;
  model.scale.setScalar(scale);model.position.set(-centre.x*scale,-bounds.min.y*scale,-centre.z*scale);
  model.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.frustumCulled=false;}});group.add(model);
  if(animate&&asset.animations.length){mixer=new T.AnimationMixer(model);mixer.clipAction(asset.animations[0]).play();}return group;
 });ready.catch(()=>{group.userData.loadFailed=true;});
 return {group,ready,setActivity(){},setQuality(){},getHeadPosition(){return bones.get('head')?.getWorldPosition(new T.Vector3())||group.position.clone().add(new T.Vector3(0,height*.8,0));},update(dt){mixer?.update(Math.min(dt,.1));}};
}
