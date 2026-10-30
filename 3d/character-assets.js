import * as T from './vendor/three.module.js';
import {FBXLoader} from './vendor/addons/loaders/FBXLoader.js';

// FBX source texture references are replaced with the packaged, capped PNG maps.
class SourceTexturePlaceholder extends T.Loader {
 load(){const texture=new T.DataTexture(new Uint8Array([255,255,255,255]),1,1);texture.needsUpdate=true;return texture;}
}
export function parseCharacterFBX(buffer){
 const manager=new T.LoadingManager();manager.addHandler(/.*/,new SourceTexturePlaceholder(manager));
 return new FBXLoader(manager).parse(buffer,'');
}
export function inPlaceClip(source,model,{retarget=false}={}){
 const names=new Set();model.traverse(o=>names.add(o.name));
 const tracks=source.tracks.filter(track=>{const parsed=T.PropertyBinding.parseTrackName(track.name);return names.has(parsed.nodeName)&&(!retarget||parsed.propertyName!=='position'||/^Bip0?1$/.test(parsed.nodeName));}).map(track=>{
  const copy=track.clone(),name=T.PropertyBinding.parseTrackName(copy.name).nodeName;
  if(copy.name.endsWith('.position')&&/^Bip0?1$/.test(name)){
   const root=model.getObjectByName(name),x=retarget?root.position.x:copy.values[0],z=retarget?root.position.z:copy.values[2],height=retarget?root.position.y-copy.values[1]:0;
   // FBXLoader converts the source to Y-up: retain height, lock horizontal travel.
   for(let i=0;i<copy.values.length;i+=3){copy.values[i]=x;copy.values[i+1]+=height;copy.values[i+2]=z;}
  }
  return copy;
 });
 return new T.AnimationClip(source.name,source.duration,tracks);
}

export function characterMaterials(original,{cloth,skin,hair}){
 const select=material=>{const name=material.name.toLowerCase();return name.includes('opacity')?hair:name.includes('head')?skin:cloth;};
 return Array.isArray(original)?original.map(select):select(original);
}

export function hairMaterial(map){
 // Hair cards need soft coverage and a small diffuse fill in the enclosed lift.
 // A matte texture response avoids the hard black/tan patches from standard PBR.
 return new T.MeshBasicMaterial({map,color:0x827970,alphaTest:.16,alphaToCoverage:true,side:T.DoubleSide});
}
