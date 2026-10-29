import * as T from './vendor/three.module.js';

// Architectural details share the office's physical scale and collision registry.
// The decorative lighting uses cached textures rather than extra shadow passes.
export function finishOffice(scene,office){
 const {box,rounded,textPlate,blocks}=office;
 const brass=new T.MeshStandardMaterial({color:'#a58b61',metalness:.72,roughness:.36});
 const walnut=new T.MeshStandardMaterial({color:'#3b3028',roughness:.7});
 const charcoal=new T.MeshStandardMaterial({color:'#252d30',roughness:.88});
 const ivory=new T.MeshStandardMaterial({color:'#cbc9bb',roughness:.76});
 const glow=new T.MeshBasicMaterial({color:'#d9c395'});
 const details=new T.Group();scene.add(details);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
 const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,0,64,64,64);
 gradient.addColorStop(0,'rgba(255,229,182,.16)');gradient.addColorStop(.42,'rgba(255,229,182,.065)');gradient.addColorStop(1,'rgba(255,229,182,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
 const glowMap=new T.CanvasTexture(canvas);glowMap.colorSpace=T.SRGBColorSpace;
 const poolMat=new T.MeshBasicMaterial({map:glowMap,transparent:true,depthWrite:false,blending:T.AdditiveBlending});
 for(const x of [-10,0,10])for(const z of [-6,6]){const pool=new T.Mesh(new T.PlaneGeometry(7,5),poolMat);pool.rotation.x=-Math.PI/2;pool.position.set(x,.016,z);details.add(pool);}
 // Framed acoustic wall bays create depth without narrowing the walking lanes.
 for(const side of [-1,1]){
  for(const z of [-8,-4,0,4,8]){
   box(side*14.83,1.62,z,.1,2.5,2.8,charcoal);
   for(let j=0;j<9;j++)box(side*14.75,1.62,z-1.2+j*.3,.08,2.44,.055,walnut);
   box(side*14.67,2.93,z,.035,.025,2.8,glow);
  }
  box(side*14.8,.16,0,.1,.035,23.6,brass);
 }
 // Wall-mounted wayfinding: a readable destination at both ends of the room.
 const company=textPlate('47 / MERIDIAN DATAWORKS',0,3.06,11.68,3.4,.22,'#20282b','#ddd6bf');company.rotation.y=Math.PI;
 const department=textPlate('INCIDENT OPERATIONS',0,2.84,11.67,2,.12,'#20282b','#a4b8b5');department.rotation.y=Math.PI;
 for(const x of [-10,10])textPlate(x<0?'01—05  /  REVIEW':'06—10  /  RESPONSE',x,2.8,-11.7,2.8,.17,'#20282b','#c5c6b9');
 // Inset corridor markings, not floating navigation geometry.
 for(const z of [-3.4,2.4])for(const x of [-10,-5,0,5,10]){
  box(x,.006,z,.65,.009,.025,brass);
  box(x-.325,.006,z+.08,.025,.009,.18,brass);
 }
 // Two storage consoles and framed briefing boards fill otherwise blank corners.
 for(const x of [-9,9]){
  rounded(x,.42,9.9,1.8,.84,.52,charcoal,.025);
  box(x,.87,9.9,1.85,.035,.56,walnut);
  for(const dx of [-.45,.45]){box(x+dx,.43,10.17,.86,.75,.025,ivory);box(x+dx,.68,10.2,.28,.015,.025,brass);}
  blocks.push({x,z:9.9,w:1.85,d:.56});
 }
 // Subtle frosted glass safety bands; keep the clear opening unobstructed.
 const frost=new T.MeshStandardMaterial({color:'#b5c9c8',roughness:.85,transparent:true,opacity:.24,depthWrite:false,side:T.DoubleSide});
 for(const x of [-7.5,7.5])for(const y of [1.23,1.32]){const band=new T.Mesh(new T.PlaneGeometry(3.75,.035),frost);band.rotation.y=Math.PI/2;band.position.set(x+.012,y,8.9);details.add(band);}
 return {setQuality(low){details.visible=!low;},setFloor(floor,name){for(const [object,text] of [[company,floor+' / MERIDIAN DATAWORKS'],[department,name.toUpperCase()]]){const c=object.material.map.image,d=c.getContext('2d');d.fillStyle='#20282b';d.fillRect(0,0,c.width,c.height);d.fillStyle='#ddd6bf';d.font='500 44px Arial';d.textAlign='center';d.fillText(text,512,82);object.material.map.needsUpdate=true;}}};
}
