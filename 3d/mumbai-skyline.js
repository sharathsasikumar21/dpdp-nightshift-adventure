import {addImportedTraffic} from './imported-traffic.js';
import {addSuppliedStreets} from './supplied-streets.js';
import {GLTFLoader} from './vendor/addons/loaders/GLTFLoader.js';
import {batchStaticOffice} from './office-performance.js';
import {addGroundTraffic,coastalRoadPoint,ROAD_Y} from './city-traffic.js';
import * as T from './vendor/three.module.js';

// A fictional Mumbai-inspired coast, not a geographic reconstruction.
export function buildMumbaiSkyline(scene){
 let seed=14147;const random=()=>((seed=seed*16807%2147483647)/2147483647);
 const root=new T.Group();root.scale.z=-1;scene.add(root);const district=new T.Group();district.name='Fallback skyline';root.add(district);let buildingPhase=true;
 const concrete=['#4d4940','#3b4247','#565049','#313e49','#484942'].map(color=>new T.MeshStandardMaterial({color,roughness:.85}));
 const box=(x,y,z,w,h,d,mat,parent=buildingPhase?district:root)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);parent.add(o);return o;};
 function facade(style,floors){
  const c=document.createElement('canvas');c.width=256;c.height=floors*16;const d=c.getContext('2d');d.fillStyle=['#252930','#263441','#3e3931'][style];d.fillRect(0,0,c.width,c.height);
  for(let row=0;row<floors;row++){d.fillStyle='#111a22';d.fillRect(0,row*16,128,2);for(let col=0;col<12;col++){const lit=random()>.68;d.fillStyle=lit?(random()>.28?'#b2a079':'#8598a5'):'#111d29';d.fillRect(8+col*20,row*16+3,style===1?14:9,9);if(style===2){d.fillStyle='#656057';d.fillRect(col*20+5,row*16+10,15,1);}}}
  const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;
  return new T.MeshStandardMaterial({map,emissiveMap:map,emissive:'#c5c2b6',emissiveIntensity:.65,roughness:style===1?.3:.85,metalness:style===1?.35:0});
 }
 for(const x of [-65,65])box(x,-38.6,80,65,1,110,concrete[1]);
 for(let i=0;i<42;i++){
  const side=i%2?-1:1,rank=Math.floor(i/2),x=side*(22+(rank%7)*12)+random()*4,z=80+Math.floor(rank/7)*30+random()*8;
  const style=i%3,floors=style===2?7+Math.floor(random()*8):16+Math.floor(random()*17),h=floors*2.3,w=style===1?6:8+random()*4,base=-38;
  const mat=facade(style,floors),trim=concrete[i%concrete.length];
  box(x,base+h/2,z,w,h,7+style*2,mat);
  box(x,base+2,z,w+3,4,12,trim); // Podium and varied roof silhouettes.
  box(x,base+h+.25,z,w+1,.5,8+style*2,trim);
  if(style===0){for(let floor=2;floor<floors;floor+=3)box(x,base+floor*2.3,z-4.4,w+.8,.16,1.5,trim);const tank=new T.Mesh(new T.CylinderGeometry(.7,.7,1.8,10),concrete[1]);tank.position.set(x+1,base+h+1.4,z);district.add(tank);}
  if(style===1){if(i%4===1){box(x+w*.5,base+h*.28,z+2,w*.55,h*.56,8,facade(1,Math.max(6,Math.floor(floors*.56))));box(x,base+h*.72,z,w*.86,.4,8,trim);}box(x,base+h+1.3,z,w*.65,2.2,5,trim);box(x,base+h+4,z,.12,4,.12,trim);}
  if(style===2){box(x,base+h+1,z,w*.8,1.5,6,trim);box(x,base+h+2.1,z,w*.5,.7,4,trim);}
 }
 // Signal House and the older waterfront give the mystery a recognisable setting.
 const garden=new T.MeshStandardMaterial({color:'#283d31',roughness:.96});
 for(let tier=0;tier<6;tier++){const width=14-tier*1.2,y=-38+tier*14;box(-18+(tier%2?1.5:0),y+7,112,width,13.7,10,facade(1,6));box(-18,y+14,112,width+1,.35,11,concrete[0]);for(const dx of [-width*.35,width*.35])box(-18+dx,y+14.4,107.2,1.2,.7,1.1,garden);}
 const beacon=new T.Mesh(new T.SphereGeometry(.25,8,6),new T.MeshBasicMaterial({color:'#e66b56'}));beacon.position.set(-18,47,112);district.add(beacon);
 for(let i=0;i<9;i++){const x=-56+i*14,height=8+(i%3)*2;box(x,-38+height/2,60,11,height,7,facade(2,5));box(x,-38+height+.25,60,11.8,.5,7.5,concrete[2]);for(const dx of [-4,4])box(x+dx,-38+height+1.1,60,.55,1.8,7.5,concrete[0]);}
 buildingPhase=false;
 const roadPoints=[];for(let i=0;i<=60;i++){const a=-1.2+i/60*2.4;roadPoints.push(new T.Vector3(Math.sin(a)*85,-37.1,22+Math.cos(a)*42));}
 // Continuous land meets the coastal road; buildings no longer stand on isolated slabs.
 const landShape=new T.Shape();roadPoints.forEach((p,i)=>i?landShape.lineTo(p.x,-p.z):landShape.moveTo(p.x,-p.z));landShape.lineTo(120,-200);landShape.lineTo(-120,-200);landShape.closePath();const landGeo=new T.ShapeGeometry(landShape);landGeo.rotateX(-Math.PI/2);const land=new T.Mesh(landGeo,new T.MeshStandardMaterial({color:'#1d2529',roughness:.98}));land.position.y=-37.1;root.add(land);
 const vertices=[],indices=[];for(let i=0;i<=60;i++){for(const lane of [-3.1,3.1]){const p=coastalRoadPoint(i/60,lane);vertices.push(p.x,ROAD_Y,p.z);}if(i<60){const n=i*2;indices.push(n,n+2,n+1,n+1,n+2,n+3);}}
 const roadGeo=new T.BufferGeometry();roadGeo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));roadGeo.setIndex(indices);roadGeo.computeVertexNormals();const fallbackRoad=new T.Mesh(roadGeo,new T.MeshStandardMaterial({color:'#141c24',roughness:.55,metalness:.12,side:T.DoubleSide}));root.add(fallbackRoad);const streets=addSuppliedStreets(root,fallbackRoad);
 const warmLight=new T.MeshBasicMaterial({color:'#e7c58c'}),streetMetal=concrete[1];for(let i=0;i<=60;i+=5){const p=coastalRoadPoint(i/60,-3.8);box(p.x,ROAD_Y+1.6,p.z,.09,3.2,.09,streetMetal);box(p.x,ROAD_Y+3.2,p.z,.65,.08,.3,warmLight);}
 const stripe=new T.MeshBasicMaterial({color:'#ab9c76'});for(let i=0;i<60;i+=2){const p=coastalRoadPoint(i/60),dash=box(p.x,ROAD_Y+.015,p.z,.09,.018,1.3,stripe);dash.rotation.y=p.yaw;}
 const traffic=addGroundTraffic(root,24);
 // Aircraft use recognizable silhouettes. Ground traffic belongs on the coastal road.
 const hull=new T.MeshStandardMaterial({color:'#b8bdc3',metalness:.35,roughness:.5}),dark=concrete[1];
 const red=new T.MeshBasicMaterial({color:'#e04c49'}),green=new T.MeshBasicMaterial({color:'#65b58c'});
 const plane=new T.Group();root.add(plane);
 const fuselage=new T.Mesh(new T.CylinderGeometry(.25,.36,4.5,10),hull);fuselage.rotation.x=Math.PI/2;plane.add(fuselage);
 box(0,0,.2,6,.09,.8,hull,plane);box(0,.12,1.7,2,.08,.45,hull,plane);box(0,.45,1.8,.08,.9,.7,hull,plane);box(-3,0,.2,.13,.13,.16,red,plane);box(3,0,.2,.13,.13,.16,green,plane);
 const helicopter=new T.Group();root.add(helicopter);
 const cabin=new T.Mesh(new T.SphereGeometry(1,12,8),dark);cabin.scale.set(.65,.5,1);helicopter.add(cabin);box(0,.1,1.55,.16,.15,2,dark,helicopter);box(0,.5,2.5,.08,.85,.4,dark,helicopter);
 for(const x of [-.5,.5]){box(x,-.65,0,.06,.06,1.8,dark,helicopter);box(x,-.45,0,.05,.4,.05,dark,helicopter);}
 const rotor=box(0,.65,0,3.8,.025,.12,dark,helicopter);box(-.6,0,0,.1,.1,.1,red,helicopter);box(.6,0,0,.1,.1,.1,green,helicopter);
 rotor.userData.dynamic=true;const staticMeshes=[];root.traverse(object=>{if(object.isMesh)staticMeshes.push(object);});batchStaticOffice({meshes:staticMeshes});
 const ready=new GLTFLoader().loadAsync(new URL('./media/city/office-night-skyline.glb',import.meta.url).href).then(asset=>{
  const model=asset.scene,bounds=new T.Box3().setFromObject(model),centre=bounds.getCenter(new T.Vector3()),scale=6;
  model.scale.setScalar(scale);model.position.set(-centre.x*scale,-38-bounds.min.y*scale,165-centre.z*scale);model.name='Supplied night city skyline';
  model.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}});root.add(model);district.visible=false;
 }).catch(error=>{console.warn('Supplied skyline unavailable; retaining the procedural city.',error);});
 const importedTraffic=addImportedTraffic(root,traffic,plane);
 let time=0;
 return {root,ready:Promise.all([ready,streets.ready,importedTraffic.ready]),update(dt,reduced){if(!reduced)time+=dt;beacon.material.color.setHex(reduced||Math.sin(time*1.8)>.4?0xe66b56:0x5e302c);traffic.update(dt,reduced);importedTraffic.update(time);plane.position.set(Math.sin(time*.009)*65,45,75+Math.cos(time*.009)*15);plane.rotation.y=-Math.PI/2;helicopter.position.set(-24+Math.sin(time*.025)*16,28,43+Math.cos(time*.025)*12);helicopter.rotation.y=time*.025;rotor.rotation.y=reduced?0:time*15;}};
}
