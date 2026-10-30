import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
const key=name=>name.replace(/[^a-z0-9]/gi,'').toLowerCase();
export function createSuppliedCharacter(file,{height=1.7,animate=false}={}){
 const group=new T.Group(),bones=new Map();let mixer=null,model=null,activity='idle',speed=0,phase=0,time=0,walkBlend=0;
 const ready=new GLTFLoader().loadAsync(new URL('./media/characters/'+file,import.meta.url).href).then(asset=>{
  model=asset.scene;model.traverse(o=>{if(o.isBone)bones.set(key(o.name),o);});
  if(animate&&bones.has('head')&&bones.has('back')){const h=bones.get('head').getWorldPosition(new T.Vector3()),b=bones.get('back').getWorldPosition(new T.Vector3());model.rotation.y-=Math.atan2(h.x-b.x,h.z-b.z);model.updateMatrixWorld(true);}
  const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),centre=bounds.getCenter(new T.Vector3()),scale=height/size.y;
  model.scale.setScalar(scale);model.position.set(-centre.x*scale,-bounds.min.y*scale,-centre.z*scale);
  model.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.frustumCulled=false;}});group.add(model);
  if(animate&&asset.animations.length){mixer=new T.AnimationMixer(model);mixer.clipAction(asset.animations[0]).play();}return group;
 });ready.catch(()=>{group.userData.loadFailed=true;});
 function rotate(name,angle,worldAxis){const bone=bones.get(key(name));if(!bone)return;const axis=worldAxis.clone().applyQuaternion(bone.getWorldQuaternion(new T.Quaternion()).invert());bone.quaternion.multiply(new T.Quaternion().setFromAxisAngle(axis,angle));}
 return {group,ready,setActivity:value=>activity=value,setMotion:value=>speed=value,setQuality(){},getHeadPosition(){return bones.get('head')?.getWorldPosition(new T.Vector3())||group.position.clone().add(new T.Vector3(0,height*.8,0));},update(dt){
  dt=Math.min(dt,.1);time+=dt;if(!mixer)return;
  walkBlend+=((speed>.03?1:0)-walkBlend)*(1-Math.exp(-dt*8));if(walkBlend>.01){mixer.setTime(0);phase+=speed*dt*Math.PI*2/.5;const right=new T.Vector3(1,0,0).applyQuaternion(group.quaternion);
   for(const [prefix,sign] of [['Front',1],['Back',-1]])for(const [side,opposite] of [['L',1],['R',-1]]){const swing=Math.sin(phase)*sign*opposite*walkBlend;rotate(prefix+'Shoulder.'+side,swing*.32,right);rotate(prefix+'LowerLeg.'+side,Math.max(0,-swing)*.26,right);}
  }else mixer.update(dt);
  if(activity==='greet'||activity==='pet')rotate('Tail1',Math.sin(time*7)*.28,new T.Vector3(0,1,0));
 }};
}
