import * as T from './vendor/three.module.js';

// A fictional Mumbai-inspired coast, not a geographic reconstruction.
export function buildMumbaiSkyline(scene){
 let seed=14147;const random=()=>((seed=seed*16807%2147483647)/2147483647);
 const root=new T.Group();root.scale.z=-1;scene.add(root);
 const concrete=['#4d4940','#3b4247','#565049','#313e49','#484942'].map(color=>new T.MeshStandardMaterial({color,roughness:.85}));
 const box=(x,y,z,w,h,d,mat,parent=root)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);parent.add(o);return o;};
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
  if(style===0){for(let floor=2;floor<floors;floor+=3)box(x,base+floor*2.3,z-4.4,w+.8,.16,1.5,trim);const tank=new T.Mesh(new T.CylinderGeometry(.7,.7,1.8,10),concrete[1]);tank.position.set(x+1,base+h+1.4,z);root.add(tank);}
  if(style===1){box(x,base+h+1.3,z,w*.65,2.2,5,trim);box(x,base+h+4,z,.12,4,.12,trim);}
  if(style===2){box(x,base+h+1,z,w*.8,1.5,6,trim);box(x,base+h+2.1,z,w*.5,.7,4,trim);}
 }
 // Signal House and the older waterfront give the mystery a recognisable setting.
 const garden=new T.MeshStandardMaterial({color:'#283d31',roughness:.96});
 for(let tier=0;tier<6;tier++){const width=14-tier*1.2,y=-38+tier*14;box(-18+(tier%2?1.5:0),y+7,112,width,13.7,10,facade(1,6));box(-18,y+14,112,width+1,.35,11,concrete[0]);for(const dx of [-width*.35,width*.35])box(-18+dx,y+14.4,107.2,1.2,.7,1.1,garden);}
 const beacon=new T.Mesh(new T.SphereGeometry(.25,8,6),new T.MeshBasicMaterial({color:'#e66b56'}));beacon.position.set(-18,47,112);root.add(beacon);
 for(let i=0;i<9;i++){const x=-56+i*14,height=8+(i%3)*2;box(x,-38+height/2,60,11,height,7,facade(2,5));box(x,-38+height+.25,60,11.8,.5,7.5,concrete[2]);for(const dx of [-4,4])box(x+dx,-38+height+1.1,60,.55,1.8,7.5,concrete[0]);}
 const roadPoints=[];for(let i=0;i<=60;i++){const a=-1.2+i/60*2.4;roadPoints.push(new T.Vector3(Math.sin(a)*85,-37.1,22+Math.cos(a)*42));}
 const coastalRoad=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(roadPoints),60,.45,6,false),new T.MeshStandardMaterial({color:'#26313a',roughness:.42,metalness:.12}));root.add(coastalRoad);
 const traffic=[];for(let i=0;i<20;i++){const light=new T.Mesh(new T.SphereGeometry(.10,5,4),new T.MeshBasicMaterial({color:i%2?'#f2d7ac':'#c95e49'}));root.add(light);traffic.push(light);}
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
 let time=0;
 return {update(dt,reduced){if(!reduced)time+=dt;beacon.material.color.setHex(reduced||Math.sin(time*1.8)>.4?0xe66b56:0x5e302c);traffic.forEach((light,i)=>{const a=-1.2+((i/20+time*.006)%1)*2.4;light.position.set(Math.sin(a)*85,-36.8,22+Math.cos(a)*42);});plane.position.set(Math.sin(time*.009)*65,45,75+Math.cos(time*.009)*15);plane.rotation.y=-Math.PI/2;helicopter.position.set(-24+Math.sin(time*.025)*16,28,43+Math.cos(time*.025)*12);helicopter.rotation.y=time*.025;rotor.rotation.y=reduced?0:time*15;}};
}
