import * as T from './vendor/three.module.js';
import {parseCharacterFBX,inPlaceClip,characterMaterials} from './character-assets.js';
let shadowTexture;
function contactShadow(){if(!shadowTexture){const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const d=canvas.getContext('2d'),g=d.createRadialGradient(32,32,3,32,32,31);g.addColorStop(0,'rgba(0,0,0,.42)');g.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=g;d.fillRect(0,0,64,64);shadowTexture=new T.CanvasTexture(canvas);}const mesh=new T.Mesh(new T.PlaneGeometry(.85,.75),new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.position.y=.016;return mesh;}
const base=new URL('./media/characters/',import.meta.url),models=new Map(),textures=new Map();
let loaded=0;
function progress(){loaded++;document.dispatchEvent(new CustomEvent('asset-progress',{detail:{loaded}}));}
function source(name){if(!models.has(name))models.set(name,fetch(new URL(name,base)).then(r=>{if(!r.ok)throw Error('Character asset unavailable: '+name);return r.arrayBuffer();}).then(data=>{const model=parseCharacterFBX(data);progress();return model;}));return models.get(name);}
function texture(name,normal=false){if(!textures.has(name))textures.set(name,new T.TextureLoader().loadAsync(new URL(name,base).href).then(t=>{t.colorSpace=normal?T.NoColorSpace:T.SRGBColorSpace;t.anisotropy=2;progress();return t;}));return textures.get(name);}
function cloneRig(source){const copy=source.clone(true),lookup=new Map();function map(a,b){lookup.set(a,b);for(let i=0;i<a.children.length;i++)map(a.children[i],b.children[i]);}map(source,copy);copy.traverse(o=>{if(!o.isSkinnedMesh)return;const original=[...lookup].find(([,v])=>v===o)?.[0];o.skeleton=original.skeleton.clone();o.skeleton.bones=original.skeleton.bones.map(b=>lookup.get(b));o.bind(o.skeleton,original.bindMatrix);});return copy;}

export function createHuman({female=false,civilian=false,tint=0xffffff}={}){
 const group=new T.Group();group.add(contactShadow());group.name=female?'Civilian colleague':'DPO civilian suit';let mixer=null,actions={},current='',desired='idle',clock=0,model=null,headBone=null,activity='idle',lowQuality=true,headOffset=0;
 const ready=(async()=>{
  const prefix=female?'woman':'male';
  const [original,body,bodyNormal,head,headNormal,hair,idle]=await Promise.all([
   source(female?'woman.fbx':'dpo.fbx'),texture(female?'woman-body.png':'male-body.png'),texture(prefix+'-body-normal.png',true),texture(prefix+'-head.png'),texture(prefix+'-head-normal.png',true),texture(prefix+'-hair.png'),source(female?'woman-idle.fbx':'idle.fbx')
  ]);
  model=cloneRig(original);model.scale.setScalar(.01);group.add(model);
  const cloth=new T.MeshStandardMaterial({map:body,normalMap:bodyNormal,color:tint,roughness:.78,metalness:0,envMapIntensity:.8});
  // Use the unmarked business suit atlas. Its red tie becomes a restrained
  // charcoal tie in the DPO material; skin is preserved by the hue threshold.
  if(!female&&!civilian)cloth.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nif(vMapUv.x>=.34 && vMapUv.x<=.68 && vMapUv.y<.18 && diffuseColor.r>diffuseColor.g*1.8 && diffuseColor.r>diffuseColor.b*1.5) diffuseColor.rgb=vec3(.012,.014,.018);');};
  const skin=new T.MeshStandardMaterial({map:head,normalMap:headNormal,roughness:.78,metalness:0});
  const hairMat=new T.MeshStandardMaterial({map:hair,alphaTest:.45,side:T.DoubleSide,roughness:1,metalness:0});
  model.traverse(o=>{if(o.isMesh){o.material=characterMaterials(o.material,{cloth,skin,hair:hairMat});o.castShadow=!lowQuality;o.receiveShadow=true;o.frustumCulled=false;}if(o.isBone&&/Bip01_Head$/.test(o.name))headBone=o;});
  mixer=new T.AnimationMixer(model);actions.idle=mixer.clipAction(inPlaceClip(idle.animations[0],model));actions.idle.play();current='idle';
  const walk=await source('walk.fbx');actions.walk=mixer.clipAction(inPlaceClip(walk.animations[0],model,{retarget:female}));if(!female&&!civilian){const run=await source('run.fbx');actions.run=mixer.clipAction(inPlaceClip(run.animations[0],model));}
  return group;
 })();
 ready.catch(()=>{group.userData.loadFailed=true;});
 function play(name){desired=name;if(!mixer||!actions[name]||current===name)return;const previous=actions[current];const next=actions[name].reset().play();if(previous)next.crossFadeFrom(previous,.2,false);current=name;}
 return {group,ready,play,setActivity:value=>activity=value,update(dt,speed=0){clock+=dt;play(speed>2.8?'run':speed>.08?'walk':'idle');if(mixer){if(actions[current])actions[current].timeScale=current==='idle'?1:Math.max(.05,Math.min(1.3,speed/(current==='run'?3.07474:1.40237)));mixer.update(dt);if(headBone&&dt>0&&(female||civilian)){const angle=activity==='review'?-.11:activity==='look-around'?Math.sin(clock*.35)*.15:0;headOffset=T.MathUtils.lerp(headOffset,angle,1-Math.exp(-dt*3));headBone.quaternion.multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),headOffset));}}},poseAt(seconds,walking=false){if(!mixer)return;play(walking?'walk':'idle');mixer.setTime(seconds);},setQuality(low){lowQuality=low;group.traverse(o=>{if(o.isMesh)o.castShadow=!low;});}};
}
