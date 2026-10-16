import * as T from './vendor/three.module.js';

// Original procedural surfaces keep the room offline-capable and avoid large texture downloads.
export function createSurfaceKit(renderer){
 let seed=81;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 function texture(kind){const c=document.createElement('canvas');c.width=c.height=512;const d=c.getContext('2d');d.fillStyle=kind==='floor'?'#35414b':'#48535a';d.fillRect(0,0,512,512);
 for(let i=0;i<18000;i++){const v=100+Math.floor(random()*80);d.fillStyle=`rgba(${v},${v},${v},.045)`;d.fillRect(random()*512,random()*512,kind==='metal'?40:2,1);}
 if(kind==='floor'){d.strokeStyle='#1b2329';d.lineWidth=3;d.strokeRect(1,1,510,510);d.strokeStyle='#56616a';d.lineWidth=1;d.strokeRect(5,5,502,502);for(const x of [14,498])for(const y of [14,498]){d.fillStyle='#151d23';d.beginPath();d.arc(x,y,2,0,7);d.fill();}}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}
 const floorMap=texture('floor');floorMap.repeat.set(15,12);const wallMap=texture('wall');wallMap.repeat.set(8,2);const metalMap=texture('metal');
 const floor=new T.MeshStandardMaterial({color:'#8392a2',map:floorMap,bumpMap:floorMap,bumpScale:.012,roughness:.32,metalness:.48});
 const wall=new T.MeshStandardMaterial({color:'#627282',map:wallMap,bumpMap:wallMap,bumpScale:.028,roughness:.84,metalness:.06});
 const steel=new T.MeshStandardMaterial({color:'#87949f',map:metalMap,roughness:.34,metalness:.82});
 // Softbox-like reflection environment, generated locally rather than fetching an HDRI.
 const env=document.createElement('canvas');env.width=512;env.height=256;const ec=env.getContext('2d');const g=ec.createLinearGradient(0,0,0,256);g.addColorStop(0,'#182434');g.addColorStop(.5,'#6e8499');g.addColorStop(1,'#090d13');ec.fillStyle=g;ec.fillRect(0,0,512,256);ec.fillStyle='#ddefff';ec.fillRect(60,64,120,15);ec.fillStyle='#28b9d1';ec.fillRect(300,104,65,28);ec.fillStyle='#aa3f8c';ec.fillRect(440,96,22,45);
 const et=new T.CanvasTexture(env);et.colorSpace=T.SRGBColorSpace;et.mapping=T.EquirectangularReflectionMapping;const pmrem=new T.PMREMGenerator(renderer);const rt=pmrem.fromEquirectangular(et);et.dispose();pmrem.dispose();return {floor,wall,steel,environment:rt.texture};
}

export function monitorTexture(index,title){const c=document.createElement('canvas');c.width=1024;c.height=512;const d=c.getContext('2d');d.fillStyle='#071622';d.fillRect(0,0,1024,512);d.fillStyle='#133245';d.fillRect(0,0,1024,63);d.font='24px monospace';d.fillStyle='#a3efff';d.fillText('NIGHTSHIFT / '+title,28,40);d.font='15px monospace';d.fillStyle='#7899ab';d.fillText('SECURE WORKSTATION 0'+(index+1)+'    /    LIVE INCIDENT FEED',28,94);
 for(let j=0;j<5;j++){const y=135+j*65;d.fillStyle='#153040';d.fillRect(28,y,245,46);d.fillStyle=j===index%5?'#e69ad4':'#7ed9dd';d.fillText(['EVENT LOG','ACCESS REVIEW','CONSENT TRACE','RISK TELEMETRY','CASE EVIDENCE'][j],43,y+28);d.fillStyle='#7ba6b6';d.fillRect(312,y+8,290-(j*43)%140,4);d.fillStyle='#365a6f';d.fillRect(312,y+23,220+(j*57)%180,3);}
 d.strokeStyle='#47d8cd';d.lineWidth=2;d.beginPath();for(let x=670;x<980;x+=4){const y=230+Math.sin(x*.04+index)*30+Math.sin(x*.11)*11;x===670?d.moveTo(x,y):d.lineTo(x,y);}d.stroke();d.fillStyle='#112e3e';d.fillRect(675,300,300,130);d.fillStyle='#ddadd5';d.font='38px monospace';d.fillText('0'+(index+1),700,355);d.font='15px monospace';d.fillStyle='#95cad6';d.fillText('AWAITING ANALYST',700,395);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}

export function dressRoom(scene,kit,positions){
 const dark=new T.MeshStandardMaterial({color:'#171e29',roughness:.58,metalness:.36}),rubber=new T.MeshStandardMaterial({color:'#141b21',roughness:.94}),glass=new T.MeshPhysicalMaterial({color:'#88bacb',roughness:.13,metalness:.05,transparent:true,opacity:.12,depthWrite:false,side:T.DoubleSide});
 const add=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;};
 const cube=(x,y,z,w,h,d,m)=>add(new T.BoxGeometry(w,h,d),m,x,y,z);
 const cylinder=(x,y,z,r,h,m)=>add(new T.CylinderGeometry(r,r,h,16),m,x,y,z);
 for(const x of [-12,-4,4,12]){const light=new T.PointLight(x<0?'#27d8ff':'#ff48b1',24,13,2);light.position.set(x,3.35,6);scene.add(light);}
 for(const x of [-10,-5,0,5,10]){cube(x,3.93,0,3.5,.08,20,dark);for(let z=-8;z<11;z+=4){cube(x,3.8,z,2.6,.08,.45,kit.steel);cube(x,3.745,z,2.4,.015,.31,new T.MeshBasicMaterial({color:'#bdd9e7'}));}}
 for(let x=-13;x<15;x+=4){const window=cube(x,2.35,11.85,3.8,3.1,.025,glass);window.castShadow=false;for(const dx of [-1.95,1.95])cube(x+dx,2.35,11.8,.055,3.5,.12,kit.steel);}
 // Architectural panels, vent louvers and cable trays replace unbroken flat walls.
 for(const side of [-1,1])for(let z=-9;z<11;z+=3){cube(side*14.82,2,z,.07,3.45,2.85,kit.wall);for(let j=0;j<8;j++)cube(side*14.7,1.1+j*.08,z,.08,.025,1.4,kit.steel);}
 positions.forEach(([x,z],i)=>{
   for(const dx of [-1.28,1.28]){cube(x+dx,.61,z,.065,1.18,.075,kit.steel);cube(x+dx,.1,z,.16,.09,1.2,dark);}
   cylinder(x,1.37,z,.045,.4,kit.steel);cube(x,1.2,z,.6,.03,.33,dark);
   cylinder(x+1,.14,z+1.6,.055,.44,kit.steel);
   for(let j=0;j<5;j++){const a=j*Math.PI*2/5;const leg=cube(x+1+Math.sin(a)*.16,.12,z+1.6+Math.cos(a)*.16,.05,.04,.38,kit.steel);leg.rotation.y=a;cylinder(x+1+Math.sin(a)*.34,.06,z+1.6+Math.cos(a)*.34,.055,.08,rubber);}
   for(const dx of [-.31,.31]){cube(x+1+dx,.71,z+1.62,.04,.27,.04,kit.steel);cube(x+1+dx,.84,z+1.62,.08,.05,.36,rubber);}
   const paper=cube(x+.65,1.25,z+.4,.31,.008,.22,new T.MeshStandardMaterial({color:'#bfc8bc',roughness:.95}));paper.rotation.y=.2;
   const mug=cylinder(x-.95,1.32,z+.4,.075,.16,new T.MeshStandardMaterial({color:i%2?'#d5c7b5':'#267b86',roughness:.3}));
   const handle=add(new T.TorusGeometry(.055,.014,8,14),mug.material,x-.85,1.34,z+.4);handle.rotation.y=Math.PI/2;
   cube(x,3.1,z,.018,.6,.018,kit.steel);
 });
 // Tactile coffee machine and storage cabinet details.
 cube(-13,1.61,-.66,.56,.48,.045,kit.steel);cube(-13,1.7,-.625,.25,.1,.01,new T.MeshBasicMaterial({color:'#44a4ad'}));for(const dx of [-.12,.12])cylinder(-13+dx,1.42,-.61,.035,.14,kit.steel);cube(-13,1.27,-.52,.6,.025,.42,kit.steel);
 // Plants soften the industrial interior; kept out of the walkways.
 const leaf=new T.MeshStandardMaterial({color:'#255c51',roughness:.77,side:T.DoubleSide});
 for(const x of [-13.7,13.7]){cylinder(x,.27,10,.3,.52,dark);for(let i=0;i<9;i++){const l=add(new T.SphereGeometry(1,8,6),leaf,x+Math.sin(i*2.4)*.2,.7+(i%3)*.24,10+Math.cos(i*2.4)*.2);l.scale.set(.11,.42,.055);l.rotation.z=Math.sin(i)*.65;}}
}

export function cityFacade(){const c=document.createElement('canvas');c.width=128;c.height=256;const d=c.getContext('2d');d.fillStyle='#101b2b';d.fillRect(0,0,128,256);for(let x=6;x<128;x+=12)for(let y=8;y<256;y+=15){d.fillStyle=(x*7+y*3)%11<5?'#587f91':'#1c2a3a';if((x+y)%7<2)d.fillStyle='#9a6a75';d.fillRect(x,y,4,7);}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
