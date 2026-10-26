import * as T from './vendor/three.module.js';
import {monitorTexture,cityFacade} from './scene-detail.js?v=cyber1';

// All surfaces are original, generated at real-world scale. No remote asset dependency.
export function buildOffice(scene,renderer){
 let seed=927;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 function surface(kind,base,repeat){
  const c=document.createElement('canvas');c.width=c.height=512;const d=c.getContext('2d');d.fillStyle=base;d.fillRect(0,0,512,512);
  for(let i=0;i<34000;i++){const light=rnd()>.5;d.fillStyle=light?'rgba(255,255,255,.065)':'rgba(0,0,0,.09)';const x=rnd()*512,y=rnd()*512;d.fillRect(x,y,kind==='wood'?40+rnd()*110:kind==='fabric'?1:2,kind==='wood'?.6:kind==='fabric'?3:1);}
  if(kind==='wood'){for(let i=0;i<90;i++){d.strokeStyle='rgba(49,29,16,.09)';d.beginPath();const y=rnd()*512;for(let x=0;x<=512;x+=8)d.lineTo(x,y+Math.sin(x*.017+i)*2.5);d.stroke();}}
  if(kind==='stone'){d.strokeStyle='#858682';d.lineWidth=1;d.strokeRect(0,0,512,512);for(let i=0;i<120;i++){d.fillStyle='rgba(40,40,38,.12)';d.beginPath();d.ellipse(rnd()*512,rnd()*512,1+rnd()*2,1+rnd()*3,rnd()*3,0,7);d.fill();}}
  const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(...repeat);map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  const bump=map.clone();bump.colorSpace=T.NoColorSpace;
  return new T.MeshStandardMaterial({map,bumpMap:bump,bumpScale:kind==='fabric'?.002:.0015,roughness:kind==='wood'?.5:kind==='stone'?.48:.9,metalness:0});
 }
 const stone=surface('stone','#646a69',[20,16]),wood=surface('wood','#75604c',[2,1]),plaster=surface('plaster','#b7b5ab',[8,2]),fabric=surface('fabric','#353f43',[3,3]);
 const metal=new T.MeshStandardMaterial({color:'#777d7d',metalness:.85,roughness:.29});
 const black=new T.MeshStandardMaterial({color:'#1c2022',metalness:.18,roughness:.48});
 const white=new T.MeshStandardMaterial({color:'#c6c8c3',roughness:.72});
 const rubber=new T.MeshStandardMaterial({color:'#141718',roughness:.95});
 const paper=new T.MeshStandardMaterial({color:'#e0d8be',roughness:.98});
 const glass=new T.MeshPhysicalMaterial({color:'#b5c8dd',metalness:.05,roughness:.075,transparent:true,opacity:.07,depthWrite:false,side:T.DoubleSide});
 const meshes=[],blocks=[],lamps=[],screens=[];
 const add=(geo,mat,x,y,z)=>{const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);meshes.push(o);return o;};
 const box=(x,y,z,w,h,d,m=black)=>add(new T.BoxGeometry(w,h,d),m,x,y,z);
 function rounded(x,y,z,w,h,d,m,r=.035){r=Math.min(r,w/3,h/3,d/3);const s=new T.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=new T.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:r,bevelThickness:r,curveSegments:4});g.translate(0,0,-d/2+r);return add(g,m,x,y,z);}
 const cylinder=(x,y,z,r,h,m)=>add(new T.CylinderGeometry(r,r,h,16),m,x,y,z);
 function textPlate(text,x,y,z,w=.7,h=.15,bg='#272d2d',fg='#d7d8c9'){
  const c=document.createElement('canvas');c.width=1024;c.height=128;const d=c.getContext('2d');d.fillStyle=bg;d.fillRect(0,0,1024,128);d.fillStyle=fg;d.font='500 49px Arial';d.textAlign='center';d.fillText(text,512,82);const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;const o=add(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.7,emissiveMap:map,emissive:'#ffffff',emissiveIntensity:.1}),x,y,z);o.castShadow=false;return o;
 }
 // Soft contact shadows remain visible on lower-end devices without shadow maps.
 const ao=document.createElement('canvas');ao.width=ao.height=128;const ad=ao.getContext('2d'),ag=ad.createRadialGradient(64,64,5,64,64,64);ag.addColorStop(0,'rgba(0,0,0,.55)');ag.addColorStop(.5,'rgba(0,0,0,.3)');ag.addColorStop(1,'rgba(0,0,0,0)');ad.fillStyle=ag;ad.fillRect(0,0,128,128);const aoMap=new T.CanvasTexture(ao);
 function contact(x,z,w,d){const o=add(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:aoMap,transparent:true,depthWrite:false}),x,.012,z);o.rotation.x=-Math.PI/2;o.castShadow=false;}
 box(0,-.12,0,30,.22,24,stone);box(0,3.5,0,30,.16,24,white);
 for(let x=-13.5;x<15;x+=3){box(x,1.76,-11.96,2.94,3.4,.025,glass).castShadow=false;box(x-1.5,1.75,-11.91,.055,3.5,.095,metal);}box(0,.1,-11.88,30,.2,.16,black);box(0,3.39,-11.88,30,.12,.16,black);for(const side of [-1,1]){box(side*15,1.75,0,.2,3.5,24,plaster);box(side*14.87,.07,0,.04,.14,24,metal);}
 // Acoustic ceiling tiles, recessed light panels and vents at credible scale.
 for(let x=-14;x<=14;x+=2){box(x,3.405,0,.024,.015,24,metal);}for(let z=-11;z<=11;z+=2)box(0,3.405,z,30,.015,.024,metal);
 const diffuser=new T.MeshStandardMaterial({color:'#f5ebd7',emissive:'#fff1d6',emissiveIntensity:1.3,roughness:.8});
 for(const x of [-10,-5,0,5,10])for(const z of [-6,0,6]){box(x,3.36,z,1.24,.07,.64,metal);box(x,3.315,z,1.14,.012,.54,diffuser);}
 for(const x of [-10,0,10])for(const z of [-6,6]){const l=new T.PointLight('#ffe4c4',18,11,2);l.position.set(x,3.12,z);scene.add(l);lamps.push(l);}
 const key=new T.SpotLight('#ffe1b5',115,24,.95,.7,1.6);key.position.set(2,3.25,2);key.target.position.set(0,0,-3);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.00015;key.shadow.normalBias=.025;scene.add(key,key.target);
 for(const x of [-12,12]){box(x,3.37,0,.6,.04,1.4,white);for(let i=0;i<10;i++)box(x,3.34,-.55+i*.12,.48,.01,.035,black);}
 // Full-height glazing with slim mullions, blinds, rain streaks and night city.
 for(let x=-13.5;x<15;x+=3){if(Math.abs(x)<2)continue;box(x,1.8,11.85,2.94,3.3,.025,glass).castShadow=false;box(x-1.5,1.75,11.8,.06,3.5,.12,metal);box(x,3.3,11.65,2.96,.12,.14,white);for(let j=0;j<4;j++)box(x,3.17-j*.07,11.62,2.88,.018,.12,white);}
 for(const x of [-8.3,8.3])box(x,.25,11.82,13.4,.5,.2,plaster);for(const x of [-2.3,2.3])box(x,1.8,11.85,1.4,3.3,.025,glass).castShadow=false;
 const positions=[[-10,-6],[-5,-6],[0,-6],[5,-6],[10,-6],[-10,5],[-5,5],[0,5],[5,5],[10,5]];
 const sectors=['SIGNAL','CONSENT','CIVIC','JUNIOR','VENDOR','INCIDENT','RIGHTS','ARCHIVE','BORDER','AUDIT'];
 positions.forEach(([x,z],i)=>{
  rounded(x,.76,z,2.6,.06,1.1,wood,.018);for(const dx of [-1.12,1.12]){box(x+dx,.38,z,.055,.7,.07,metal);box(x+dx,.045,z,.18,.04,.85,metal);}box(x,.48,z-.32,2.25,.04,.06,metal);
  box(x,.88,z-.16,.045,.25,.06,metal);rounded(x,.8,z-.16,.42,.025,.26,black,.008);
  rounded(x,1.16,z-.2,1.12,.65,.045,black,.018);const tex=monitorTexture(i,sectors[i]);const screen=add(new T.PlaneGeometry(1.055,.59),new T.MeshStandardMaterial({map:tex,emissiveMap:tex,emissive:'#ffffff',emissiveIntensity:.65,roughness:.25}),x,1.16,z-.173);screens.push(screen);
  rounded(x-.08,.811,z+.28,.6,.022,.21,black,.008);const keyGeo=new T.BoxGeometry(.031,.008,.029),keyMatrix=new T.Matrix4();
  for(const [mat,columns] of [[rubber,13],[white,1]]){const keys=new T.InstancedMesh(keyGeo,mat,columns*4);let n=0;for(let row=0;row<4;row++)for(let col=0;col<columns;col++){keyMatrix.makeTranslation(x-.35+(columns===1?13:col)*.039,.827,z+.21+row*.041);keys.setMatrixAt(n++,keyMatrix);}keys.castShadow=true;keys.receiveShadow=true;scene.add(keys);}
  const mouse=add(new T.SphereGeometry(1,12,8),black,x+.49,.83,z+.28);mouse.scale.set(.035,.02,.055);box(x+.49,.796,z+.3,.26,.003,.3,rubber);
  // Fabric task chairs, curved backs, five-star bases and castor wheels.
  const cx=x+.9,cz=z+1.2;rounded(cx,.46,cz,.49,.09,.47,fabric,.035);const back=rounded(cx,.78,cz+.22,.47,.55,.06,fabric,.025);back.rotation.x=-.09;cylinder(cx,.24,cz,.025,.4,metal);
  for(const dx of [-.29,.29]){box(cx+dx,.59,cz,.025,.23,.025,black);rounded(cx+dx,.7,cz,.065,.035,.3,rubber,.012);}
  for(let j=0;j<5;j++){const a=j*Math.PI*2/5,leg=box(cx+Math.sin(a)*.16,.09,cz+Math.cos(a)*.16,.035,.035,.34,metal);leg.rotation.y=a;const wheel=cylinder(cx+Math.sin(a)*.32,.045,cz+Math.cos(a)*.32,.043,.045,rubber);wheel.rotation.z=Math.PI/2;}
  blocks.push({x,z,w:2.6,d:1.1},{x:cx,z:cz,w:.65,d:.65});contact(x,z,3.3,2.1);contact(cx,cz,1.1,1.1);
  const mug=cylinder(x-.93,.87,z+.18,.045,.15,white);const coffee=cylinder(x-.93,.947,z+.18,.037,.002,new T.MeshStandardMaterial({color:'#24160d',roughness:.2}));const handle=add(new T.TorusGeometry(.038,.009,8,16),white,x-.87,.88,z+.18);
  const notebook=rounded(x+.84,.803,z-.12,.25,.025,.35,i%2?paper:fabric,.008);notebook.rotation.y=.14;
  textPlate(String(i+1).padStart(2,'0')+' / '+sectors[i],x,.72,z+.558,.72,.095);
  // Desk partitions absorb sound and ground the workstations in an actual office.
  box(x,1.05,z-.53,2.6,.5,.04,fabric);
 });
 // Rear archive cabinets: rack doors, mesh vents, handles and small activity LEDs.
 for(const x of [-12,-9.6,9.6,12]){box(x,1.1,-10.7,1.1,2.2,.8,black);box(x,1.1,-10.28,.99,2.06,.025,metal);for(let y=.25;y<2;y+=.17){box(x,y,-10.25,.9,.11,.015,black);for(let j=0;j<4;j++)box(x-.32+j*.018,y,-10.235,.007,.07,.008,metal);box(x+.35,y,-10.23,.015,.015,.008,new T.MeshBasicMaterial({color:y>1?'#90c8a0':'#bba875'}));}box(x+.39,1.1,-10.19,.025,.22,.035,black);contact(x,-10.7,1.8,1.4);}
 // Rear signage is provided by the architectural detail pass.
 // Collaboration table with a flat incident display instead of floating holograms.
 rounded(0,.76,-.4,5,.09,2.1,wood,.025);for(const x of [-2,2])box(x,.37,-.4,.08,.7,1.55,metal);blocks.push({x:0,z:-.4,w:5,d:2.1});contact(0,-.4,6,3.2);
 const display=add(new T.PlaneGeometry(3.8,1.45),new T.MeshStandardMaterial({map:monitorTexture(3,'INCIDENT OVERVIEW'),emissive:'#ffffff',emissiveMap:monitorTexture(3,'INCIDENT OVERVIEW'),emissiveIntensity:.4,roughness:.2}),0,.811,-.4);display.rotation.x=-Math.PI/2;
 // Coffee area, cabinet doors and tiled backsplash.
 box(-13,.45,-1,1.6,.9,1.3,white);box(-13,.93,-1,1.7,.06,1.4,wood);for(const x of [-13.4,-12.6]){box(x,.47,-.34,.76,.82,.025,plaster);box(x,.75,-.3,.25,.02,.025,metal);}rounded(-13,1.23,-1,.48,.56,.44,black,.025);box(-13,1.3,-.77,.39,.25,.015,metal);textPlate('READY',-13,1.35,-.753,.18,.04);box(-13,1.02,-.7,.4,.025,.3,metal);cylinder(-13,1.1,-.65,.04,.13,white);blocks.push({x:-13,z:-1,w:1.7,d:1.4});contact(-13,-1,2.4,2);
 // Glass meeting-room divider, frames and a clear opening at the corridor.
 for(const x of [-7.5,7.5]){box(x,1.5,8.9,.018,3,3.8,glass).castShadow=false;for(const z of [7,10.8])box(x,1.5,z,.035,3,.035,metal);blocks.push({x,z:8.9,w:.04,d:3.8});}
 const leaf=new T.MeshStandardMaterial({color:'#314d32',roughness:.8,side:T.DoubleSide});for(const x of [-14,14]){cylinder(x,.25,10,.25,.5,white);for(let i=0;i<14;i++){const a=i*2.4;const stem=cylinder(x+Math.sin(a)*.08,.65,10+Math.cos(a)*.08,.005,.8,black);const l=add(new T.SphereGeometry(1,10,8),leaf,x+Math.sin(a)*.2,.65+i%4*.16,10+Math.cos(a)*.2);l.scale.set(.09,.31,.025);l.rotation.z=Math.sin(a)*.8;}contact(x,10,1,1);}
 // Reflection capture with neutral practical lights, not coloured neon strips.
 const env=document.createElement('canvas');env.width=512;env.height=256;const ed=env.getContext('2d');const grad=ed.createLinearGradient(0,0,0,256);grad.addColorStop(0,'#303b50');grad.addColorStop(.48,'#182334');grad.addColorStop(1,'#242a2d');ed.fillStyle=grad;ed.fillRect(0,0,512,256);ed.fillStyle='#fff2d9';for(let x=16;x<512;x+=95)ed.fillRect(x,34,42,14);ed.fillStyle='#6b8caa';ed.fillRect(210,110,120,42);const et=new T.CanvasTexture(env);et.colorSpace=T.SRGBColorSpace;et.mapping=T.EquirectangularReflectionMapping;const pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromEquirectangular(et).texture;scene.environmentIntensity=.32;pm.dispose();et.dispose();
 return {positions,screens,blocks,meshes,key,lamps,box,rounded,metal,black,paper,textPlate};
}
