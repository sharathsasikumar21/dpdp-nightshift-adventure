import * as T from './vendor/three.module.js';
import {buildOffice} from './realistic-office.js?v=fpv1';
import {createEffects} from './world-effects.js?v=fpv1';
import {walkPosition,desiredVelocity} from './fpv-motion.js?v=fpv1';

export function createWorld(canvas,onInteract){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 const scene=new T.Scene();scene.background=new T.Color('#111b26');scene.fog=new T.FogExp2('#24303a',.009);
 const camera=new T.PerspectiveCamera(68,innerWidth/innerHeight,.055,160);camera.rotation.order='YXZ';scene.add(camera);
 scene.add(new T.HemisphereLight('#d8e4ef','#51483e',1.35));
 const moon=new T.DirectionalLight('#a4bdd6',1.6);moon.position.set(4,8,20);scene.add(moon);
 const office=buildOffice(scene,renderer),{positions,screens,blocks}=office;
 const fx=createEffects(scene,positions,screens,{realistic:true});
 const flashlight=new T.SpotLight('#fff0d5',0,18,.38,.72,1.3);flashlight.position.set(.16,-.14,-.12);flashlight.target.position.set(0,0,-8);camera.add(flashlight,flashlight.target);
 let torch=false;const toggleTorch=()=>{torch=!torch;flashlight.intensity=torch?12:0;const b=document.querySelector('#flashlight');if(b){b.textContent=torch?'LIGHT ON [F]':'FLASHLIGHT [F]';b.setAttribute('aria-pressed',String(torch));}};
 // Documents sit on the desk and have printed surfaces, binder clips and paper edges.
 const evidence=[];for(let i=0;i<3;i++){const tablet=office.rounded(0,.82,0,.23,.018,.31,office.paper,.006);const clip=office.box(0,0,0,.075,.012,.025,office.metal);scene.remove(clip);tablet.add(clip);clip.position.set(0,.025,-.13);const page=document.createElement('canvas');page.width=256;page.height=384;const d=page.getContext('2d');d.fillStyle='#e1ddcc';d.fillRect(0,0,256,384);d.fillStyle='#343f44';d.font='bold 19px monospace';d.fillText('EXHIBIT 0'+(i+1),20,55);d.fillStyle='#77817e';for(let row=0;row<15;row++)d.fillRect(20,80+row*16,130+(row*17)%85,2);d.fillStyle='#9f5544';d.strokeStyle='#9f5544';d.strokeRect(110,315,120,36);d.font='16px monospace';d.fillText('RESTRICTED',118,339);const texture=new T.CanvasTexture(page);texture.colorSpace=T.SRGBColorSpace;const face=new T.Mesh(new T.PlaneGeometry(.215,.29),new T.MeshStandardMaterial({map:texture,roughness:.9}));face.rotation.x=-Math.PI/2;face.position.y=.023;tablet.add(face);tablet.userData.evidence=i;evidence.push(tablet);}
 const weatherArray=new Float32Array(960);for(let i=0;i<weatherArray.length;i+=6){const x=(Math.random()-.5)*45,y=Math.random()*18,z=12.2+Math.random()*7;weatherArray.set([x,y,z,x-.018,y-.35,z],i);}const weatherGeo=new T.BufferGeometry();weatherGeo.setAttribute('position',new T.BufferAttribute(weatherArray,3));const rain=new T.LineSegments(weatherGeo,new T.LineBasicMaterial({color:'#aac7d8',transparent:true,opacity:.22}));scene.add(rain);
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let reduced=preference.matches;fx.setReduced(reduced);preference.addEventListener('change',e=>{reduced=e.matches;fx.setReduced(reduced);});
 let mode='home',active=0,enabled=false,near=false,yaw=0,pitch=-.08,drag=false,lastX=0,lastY=0,moved=0,walk=0,shot=0,shotIndex=0,locked=false,crouched=false;
 const keys={},player=new T.Vector3(0,1.66,9),velocity=new T.Vector2();
 const ray=new T.Raycaster(),targets=[...evidence,...fx.targets];
 const hint=document.querySelector('#focus-label'),reticle=document.querySelector('#reticle');
 function pick(x=0,y=0){ray.setFromCamera(new T.Vector2(x,y),camera);const hits=ray.intersectObjects(targets.filter(o=>o.visible),false);const hit=hits.find(h=>h.distance<3.25);if(!hit)return null;const solid=ray.intersectObjects(office.meshes.filter(o=>o.visible&&!o.material.transparent&&!targets.includes(o)),false)[0];if(solid&&solid.distance+.04<hit.distance)return null;return hit.object;}
 function interactObject(object){if(!enabled||mode!=='play')return false;if(!object)return false;if(Number.isInteger(object.userData.evidence)){onInteract({type:'evidence',index:object.userData.evidence});return true;}const {type,index}=object.userData.interaction;if(type==='terminal')onInteract(index===active?'case':'inactive');else{fx.activate(type,index);onInteract(type);}return true;}
 function inspect(){if(!enabled||mode!=='play')return;if(!interactObject(pick()))onInteract(near?'case':'far');}
 function release(){if(document.pointerLockElement===canvas)document.exitPointerLock();drag=false;Object.keys(keys).forEach(k=>keys[k]=false);velocity.set(0,0);}
 function setEnabled(value){enabled=value;if(!value)release();}
 function setTarget(i,teleport=false){active=i;fx.setTarget(i);const [x,z]=positions[i];evidence.forEach((o,j)=>{o.position.set(x+[-.84,.84,-.84][j],.805,z+[.4,.4,-.21][j]);o.rotation.y=(j-1)*.13;});if(teleport){player.set(x,1.66,z+2.8);yaw=0;pitch=-.13;velocity.set(0,0);}}
 const mouseLook=document.querySelector('#mouse-look');
 async function lock(){if(!enabled||mode!=='play')return;try{await canvas.requestPointerLock();}catch{if(hint)hint.textContent='Mouse capture unavailable · drag to look';}}
 mouseLook?.addEventListener('click',lock);
 document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===canvas;if(mouseLook)mouseLook.textContent=locked?'RELEASE MOUSE · ESC':'MOUSE LOOK';canvas.dataset.mouseLook=String(locked);if(!locked){Object.keys(keys).forEach(k=>keys[k]=false);velocity.set(0,0);}});
 document.addEventListener('pointerlockerror',()=>{if(hint)hint.textContent='Drag to look · Q / R to turn';});
 canvas.addEventListener('pointerdown',e=>{if(!enabled)return;canvas.focus();if(locked){inspect();return;}drag=true;moved=0;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
 const look=(dx,dy)=>{yaw-=dx*.0023;pitch=T.MathUtils.clamp(pitch-dy*.002,-1.35,1.25);};
 document.addEventListener('mousemove',e=>{if(locked&&enabled)look(e.movementX,e.movementY);});
 canvas.addEventListener('pointermove',e=>{if(!enabled||locked||!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;moved+=Math.abs(dx)+Math.abs(dy);look(dx,dy);lastX=e.clientX;lastY=e.clientY;});
 canvas.addEventListener('pointerup',e=>{if(!drag)return;drag=false;if(moved<6&&enabled){const b=canvas.getBoundingClientRect();interactObject(pick((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2));}});canvas.addEventListener('pointercancel',()=>drag=false);
 addEventListener('keydown',e=>{if(!enabled||mode!=='play'||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||document.querySelector('dialog[open]'))return;const k=e.key.toLowerCase();keys[k]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(!e.repeat){if(k==='e')inspect();if(k==='f')toggleTorch();if(k==='c')crouched=!crouched;}});
 addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',release);document.addEventListener('visibilitychange',()=>{if(document.hidden)release();});
 let last=performance.now(),lookAt=null,nextPick=0;
 function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;fx.update(dt);
  if(!reduced){for(let i=0;i<weatherArray.length;i+=6){weatherArray[i+1]-=dt*8;weatherArray[i+4]-=dt*8;if(weatherArray[i+1]<0){weatherArray[i+1]=18;weatherArray[i+4]=17.65;}}weatherGeo.attributes.position.needsUpdate=true;}
  if(mode==='cutscene'){shot+=dt;const [x,z]=positions[shotIndex],t=reduced?3:Math.min(10,shot);camera.position.set(x-1.7+t*.13,1.55,z+2.7);camera.lookAt(x,1.1,z);}
  else if(mode==='home'){camera.position.set(8.4,1.66,9.7);camera.lookAt(-3,1.1,-3);}
  else{const f=Number(!!(keys.w||keys.arrowup))-Number(!!(keys.s||keys.arrowdown)),s=Number(!!(keys.d||keys.arrowright))-Number(!!(keys.a||keys.arrowleft));if(enabled){if(keys.q)yaw+=dt*1.3;if(keys.r)yaw-=dt*1.3;const v=desiredVelocity(f,s,yaw,!!keys.shift,crouched),blend=1-Math.exp(-dt*12);velocity.lerp(new T.Vector2(v.x,v.z),blend);const p=walkPosition(player,velocity.x*dt,velocity.y*dt,blocks);const distance=Math.hypot(p.x-player.x,p.z-player.z);walk+=distance*5;player.x=p.x;player.z=p.z;}
   player.y=T.MathUtils.lerp(player.y,crouched?1.12:1.66,1-Math.exp(-dt*10));camera.position.copy(player);camera.position.y+=!reduced&&enabled&&(f||s)?Math.sin(walk)*.012:0;camera.rotation.set(pitch,yaw,0);const goal=keys.shift&&enabled&&!crouched&&!reduced?72:68;if(Math.abs(camera.fov-goal)>.01){camera.fov=T.MathUtils.lerp(camera.fov,goal,1-Math.exp(-dt*5));camera.updateProjectionMatrix();}}
  const [tx,tz]=positions[active];const distance=Math.hypot(player.x-tx,player.z-tz);near=distance<3.25;canvas.dataset.near=String(near);const bearing=document.querySelector('#bearing');if(bearing)bearing.textContent=near?'ACTIVE TERMINAL · E TO INSPECT':Math.round(distance)+' m · ACTIVE TERMINAL';
  if(enabled&&mode==='play'&&now>=nextPick){nextPick=now+100;const target=pick();if(target!==lookAt){lookAt=target;reticle?.classList.toggle('focused',!!target);if(hint)hint.textContent=target?Number.isInteger(target.userData.evidence)?'E · COLLECT EXHIBIT 0'+(target.userData.evidence+1):'E · '+({terminal:'INSPECT WORKSTATION',coffee:'MAKE COFFEE',map:'INSPECT INCIDENT TABLE',drone:'INSPECT MAINTENANCE DRONE'}[target.userData.interaction?.type]||'INSPECT'):'LOOK AT AN OBJECT · E TO INTERACT';}}
  renderer.render(scene,camera);
 }
 requestAnimationFrame(frame);addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});setTarget(0);
 return {setTarget,cinematic:i=>{release();shotIndex=i;shot=0;mode='cutscene';enabled=false;},setEvidence:collected=>{const found=new Set(collected);evidence.forEach((o,i)=>o.visible=!found.has(i));},setMode:m=>{mode=m;if(m!=='play')release();},setEnabled,move:(k,on)=>keys[k]=on,interact:inspect,scan:()=>{fx.scan();onInteract('map');},respond:good=>fx.respond(good),guide:()=>{crouched=false;setTarget(active,true);},toggleTorch,status:()=>({near,position:player.toArray(),yaw}),setQuality:low=>{fx.setQuality(low);renderer.shadowMap.enabled=!low;renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);rain.visible=!low;}};
}
