import {polishOffice} from './office-polish.js?v=office2';
import {buildMumbaiSkyline} from './mumbai-skyline.js?v=office1';
import {addNightExtras} from './night-extras.js?v=office1';
import * as T from './vendor/three.module.js';
import {finishOffice} from './art-direction.js?v=office2';
import {buildElevator} from './elevator.js?v=depth1';
import {visibleInScene,interactionOwner,bearingTo} from './fpv-interaction.js?v=finish1';
import {buildOffice} from './realistic-office.js?v=office1';
import {createEffects} from './world-effects.js?v=depth1';
import {walkPosition,desiredVelocity} from './fpv-motion.js?v=fpv1';

export function createWorld(canvas,onInteract){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;
 const scene=new T.Scene();scene.background=new T.Color('#020711');scene.fog=new T.FogExp2('#081323',.003);
 const camera=new T.PerspectiveCamera(68,innerWidth/innerHeight,.055,300);camera.rotation.order='YXZ';scene.add(camera);
 scene.add(new T.HemisphereLight('#8eacd4','#20212a',.58));
 const moon=new T.DirectionalLight('#91b9ef',.72);moon.position.set(4,8,20);scene.add(moon);
 const office=buildOffice(scene,renderer),{positions,screens,blocks}=office;
 const art=finishOffice(scene,office),polish=polishOffice(scene,office);
 const alertLight=new T.PointLight('#e5a14c',0,24,1.4);alertLight.position.set(0,2.8,2);scene.add(alertLight);const extras=addNightExtras(scene,office);const skyline=buildMumbaiSkyline(scene);
 const elevator=buildElevator(scene,office);let arrivalTime=0,lowFX=false;
 const fx=createEffects(scene,positions,screens,{realistic:true});
 // Persistent navigation marker, rendered above geometry so furniture cannot hide it.
 const caseMarker=new T.Group();scene.add(caseMarker);
 const markerMaterial=new T.MeshBasicMaterial({color:'#ffe12b',depthTest:false,depthWrite:false,toneMapped:false});
 const arrowStem=new T.Mesh(new T.CylinderGeometry(.085,.085,.46,12),markerMaterial);arrowStem.position.y=.27;
 const arrowTip=new T.Mesh(new T.ConeGeometry(.27,.38,16),markerMaterial);arrowTip.rotation.z=Math.PI;arrowTip.position.y=-.12;
 for(const mesh of [arrowStem,arrowTip]){mesh.renderOrder=1000;caseMarker.add(mesh);}
 function markerLabel(title){const c=document.createElement('canvas');c.width=512;c.height=112;const d=c.getContext('2d');d.fillStyle='#101820';d.fillRect(0,0,512,112);d.strokeStyle='#ffe12b';d.lineWidth=8;d.strokeRect(4,4,504,104);d.fillStyle='#ffe12b';d.font='bold 42px sans-serif';d.textAlign='center';d.textBaseline='middle';d.fillText(title,256,56);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;}
 const caseLabel=markerLabel('ACTIVE CASE'),arrivalLabel=markerLabel('ARRIVAL CLUES');
 const markerCaption=new T.Sprite(new T.SpriteMaterial({map:caseLabel,depthTest:false,depthWrite:false,toneMapped:false}));markerCaption.scale.set(1.65,.36,1);markerCaption.position.y=.8;markerCaption.renderOrder=1001;caseMarker.add(markerCaption);caseMarker.visible=false;
 const scanOutline=new T.Box3Helper(new T.Box3(),0xe0bb78);scanOutline.material.transparent=true;scanOutline.material.opacity=.8;scanOutline.visible=false;scene.add(scanOutline);let scanUntil=0,securityPressure=0;
 function scan(){if(securityPressure>=2){onInteract('map');return;}scanUntil=performance.now()+8000;scanOutline.box.setFromObject(screens[active]).expandByScalar(.035);scanOutline.visible=true;fx.scan();onInteract('map');}
 const flashlight=new T.SpotLight('#fff0d5',0,18,.38,.72,1.3);flashlight.position.set(.16,-.14,-.12);flashlight.target.position.set(0,0,-8);camera.add(flashlight,flashlight.target);
 let torch=false;const toggleTorch=()=>{torch=!torch;flashlight.intensity=torch?12:0;const b=document.querySelector('#flashlight');if(b){b.textContent=torch?'LIGHT ON [F]':'FLASHLIGHT [F]';b.setAttribute('aria-pressed',String(torch));}};
 // Documents sit on the desk and have printed surfaces, binder clips and paper edges.
 const evidence=[];for(let i=0;i<3;i++){const tablet=office.rounded(0,.82,0,.23,.018,.31,office.paper,.006);const clip=office.box(0,0,0,.075,.012,.025,office.metal);scene.remove(clip);tablet.add(clip);clip.position.set(0,.025,-.13);const page=document.createElement('canvas');page.width=256;page.height=384;const d=page.getContext('2d');d.fillStyle='#e1ddcc';d.fillRect(0,0,256,384);d.fillStyle='#343f44';d.font='bold 19px monospace';d.fillText('EXHIBIT 0'+(i+1),20,55);d.fillStyle='#77817e';for(let row=0;row<15;row++)d.fillRect(20,80+row*16,130+(row*17)%85,2);d.fillStyle='#9f5544';d.strokeStyle='#9f5544';d.strokeRect(110,315,120,36);d.font='16px monospace';d.fillText('RESTRICTED',118,339);const texture=new T.CanvasTexture(page);texture.colorSpace=T.SRGBColorSpace;const face=new T.Mesh(new T.PlaneGeometry(.215,.29),new T.MeshStandardMaterial({map:texture,roughness:.9}));face.rotation.x=-Math.PI/2;face.position.y=.023;tablet.add(face);tablet.userData.evidence=i;evidence.push(tablet);}
 const weatherArray=new Float32Array(960);for(let i=0;i<weatherArray.length;i+=6){const x=(Math.random()-.5)*45,y=Math.random()*18,z=-12.2-Math.random()*7;weatherArray.set([x,y,z,x-.018,y-.35,z],i);}const weatherGeo=new T.BufferGeometry();weatherGeo.setAttribute('position',new T.BufferAttribute(weatherArray,3));const rain=new T.LineSegments(weatherGeo,new T.LineBasicMaterial({color:'#aac7d8',transparent:true,opacity:.22}));scene.add(rain);
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let reduced=preference.matches;fx.setReduced(reduced);preference.addEventListener('change',e=>{reduced=e.matches;fx.setReduced(reduced);});
 let arrivalInvestigation=false;let mode='home',active=0,enabled=false,near=false,yaw=0,pitch=-.08,drag=false,lastX=0,lastY=0,moved=0,walk=0,shot=0,shotIndex=0,locked=false,crouched=false;
 const keys={},player=new T.Vector3(0,1.66,9),velocity=new T.Vector2();
 const ray=new T.Raycaster(),targets=[...evidence,...fx.targets,...extras];
 const hint=document.querySelector('#focus-label'),reticle=document.querySelector('#reticle');
 function pick(x=0,y=0){ray.setFromCamera(new T.Vector2(x,y),camera);const hits=ray.intersectObjects(targets.filter(visibleInScene),true);const hit=hits.find(h=>h.distance<3.25);if(!hit)return null;const solid=ray.intersectObjects(office.meshes.filter(o=>visibleInScene(o)&&!o.material.transparent&&!interactionOwner(o)),false)[0];if(solid&&solid.distance+.04<hit.distance)return null;return interactionOwner(hit.object);}
 function interactObject(object){if(!enabled||mode!=='play')return false;if(!object)return false;if(Number.isInteger(object.userData.evidence)){onInteract({type:'evidence',index:object.userData.evidence});return true;}const {type,index}=object.userData.interaction;if(type==='colleague'||type==='tribute'||type==='opening'){onInteract({type,index});return true;}if(type==='terminal')onInteract(index===active?'case':'inactive');else if(type==='map'){scan();}else{fx.activate(type,index);onInteract(type);}return true;}
 function inspect(){if(!enabled||mode!=='play')return;if(!interactObject(pick()))onInteract(near?'case':'far');}
 function release(){if(document.pointerLockElement===canvas)document.exitPointerLock();drag=false;Object.keys(keys).forEach(k=>keys[k]=false);velocity.set(0,0);}
 function setEnabled(value){enabled=value;if(!value){release();scanUntil=0;scanOutline.visible=false;}}
 function toggleCrouch(){crouched=!crouched;const b=document.querySelector('#crouch');if(b){b.textContent=crouched?'STAND [C]':'CROUCH [C]';b.setAttribute('aria-pressed',String(crouched));}}
 function setTarget(i,teleport=false){active=i;fx.setTarget(i);const [x,z]=positions[i];evidence.forEach((o,j)=>{o.position.set(x+[-.84,.84,-.84][j],.805,z+[.4,.4,-.21][j]);o.rotation.y=(j-1)*.13;});if(teleport){if(crouched)toggleCrouch();player.set(x,1.66,z+2.8);yaw=0;pitch=-.13;velocity.set(0,0);}}
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
 addEventListener('keydown',e=>{if(!enabled||mode!=='play'||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||document.querySelector('dialog[open]'))return;const k=e.key.toLowerCase();keys[k]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(!e.repeat){if(k==='e')inspect();if(k==='f')toggleTorch();if(k==='c')toggleCrouch();}});
 addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',release);document.addEventListener('visibilitychange',()=>{if(document.hidden)release();});
 let last=performance.now(),lookAt=null,nextPick=0,stepDistance=0;
 function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;fx.update(dt);skyline.update(dt,reduced);extras.update(dt,camera,reduced);
  if(!reduced){for(let i=0;i<weatherArray.length;i+=6){weatherArray[i+1]-=dt*8;weatherArray[i+4]-=dt*8;if(weatherArray[i+1]<0){weatherArray[i+1]=18;weatherArray[i+4]=17.65;}}weatherGeo.attributes.position.needsUpdate=true;}
  if(mode==='arrival'){const s=elevator.update(reduced?(arrivalTime<9.5?0:14):arrivalTime);rain.visible=false;camera.position.set(0,1.66+(reduced?0:Math.sin(now*.027)*.002*(1-s.doors)),reduced?14.2:14.2-s.walk*3.6);camera.rotation.set(-.03,0,0);}else if(mode==='arrival-exit'){camera.position.set(0,1.66,10.6);camera.rotation.set(-.03,0,0);}else if(mode==='cutscene'){shot+=dt;const [x,z]=positions[shotIndex],t=reduced?3:Math.min(10,shot);camera.position.set(x-1.7+t*.13,1.55,z+2.7);camera.lookAt(x,1.1,z);}
  else if(mode==='home'){camera.position.set(8.4,1.66,9.7);camera.lookAt(-3,1.1,-3);}
  else{const f=Number(!!(keys.w||keys.arrowup))-Number(!!(keys.s||keys.arrowdown)),s=Number(!!(keys.d||keys.arrowright))-Number(!!(keys.a||keys.arrowleft));if(enabled){if(keys.q)yaw+=dt*1.3;if(keys.r)yaw-=dt*1.3;const v=desiredVelocity(f,s,yaw,!!keys.shift,crouched),blend=1-Math.exp(-dt*12);velocity.lerp(new T.Vector2(v.x,v.z),blend);const p=walkPosition(player,velocity.x*dt,velocity.y*dt,blocks);const distance=Math.hypot(p.x-player.x,p.z-player.z);stepDistance+=distance;if(stepDistance>.75){stepDistance=0;onInteract({type:'sound',kind:'step',pan:Math.sin(walk)*.2});}walk+=distance*5;player.x=p.x;player.z=p.z;}
   player.y=T.MathUtils.lerp(player.y,crouched?1.12:1.66,1-Math.exp(-dt*10));camera.position.copy(player);camera.position.y+=!reduced&&enabled&&(f||s)?Math.sin(walk)*.012:0;camera.rotation.set(pitch,yaw,0);const goal=keys.shift&&enabled&&!crouched&&!reduced?72:68;if(Math.abs(camera.fov-goal)>.01){camera.fov=T.MathUtils.lerp(camera.fov,goal,1-Math.exp(-dt*5));camera.updateProjectionMatrix();}}
  const nav=bearingTo(player,arrivalInvestigation?[-2,8.5]:positions[active],yaw);near=nav.distance<3.25;canvas.dataset.near=String(near);const bearing=document.querySelector('#bearing');if(bearing)bearing.textContent=nav.label+' · '+nav.distance.toFixed(1)+(arrivalInvestigation?' m TO ARRIVAL DESK':' m TO CASE')+(near?' · E TO INSPECT':'');scanOutline.visible=enabled&&mode==='play'&&now<scanUntil;
  if(enabled&&mode==='play'&&now>=nextPick){nextPick=now+100;const target=pick();if(target!==lookAt){lookAt=target;reticle?.classList.toggle('focused',!!target);if(hint)hint.textContent=target?Number.isInteger(target.userData.evidence)?'E · COLLECT EXHIBIT 0'+(target.userData.evidence+1):'E · '+({terminal:'INSPECT WORKSTATION',opening:'INSPECT ARRIVAL CLUE',colleague:'TALK TO COLLEAGUE',tribute:'VIEW GAME TRIBUTE',coffee:'MAKE COFFEE',map:'INSPECT INCIDENT TABLE',drone:'INSPECT MAINTENANCE DRONE'}[target.userData.interaction?.type]||'INSPECT'):'LOOK AT AN OBJECT · E TO INTERACT';}}
  caseMarker.visible=enabled&&mode==='play';if(caseMarker.visible){const target=arrivalInvestigation?[-2,8.5]:positions[active];caseMarker.position.set(target[0],2.05+(reduced?0:Math.sin(now*.003)*.065),target[1]);const distance=camera.position.distanceTo(caseMarker.position);caseMarker.scale.setScalar(T.MathUtils.clamp(distance/9,1,1.65));const map=arrivalInvestigation?arrivalLabel:caseLabel;if(markerCaption.material.map!==map){markerCaption.material.map=map;markerCaption.material.needsUpdate=true;}}
  renderer.render(scene,camera);
 }
 requestAnimationFrame(frame);addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});setTarget(0);
 return {setArrivalInvestigation:value=>arrivalInvestigation=value,setSecurity:pressure=>{securityPressure=pressure;alertLight.intensity=pressure*7;if(pressure>=2){scanUntil=0;scanOutline.visible=false;}},enterLobby:()=>{player.set(-2,1.66,10.7);yaw=0;pitch=-.1;mode='play';},cityView:()=>{player.set(0,1.66,-9.8);yaw=0;pitch=-.08;mode='play';velocity.set(0,0);},startArrival:()=>{release();enabled=false;arrivalTime=0;mode='arrival';},arrivalProgress:t=>arrivalTime=t,endArrival:()=>{elevator.update(14);mode='arrival-exit';rain.visible=!lowFX;},setTarget,cinematic:i=>{release();shotIndex=i;shot=0;mode='cutscene';enabled=false;},setEvidence:collected=>{const found=new Set(collected);evidence.forEach((o,i)=>o.visible=!found.has(i));},setMode:m=>{mode=m;if(m!=='play')release();},setEnabled,move:(k,on)=>keys[k]=on,interact:inspect,scan,respond:good=>fx.respond(good),guide:()=>setTarget(active,true),toggleTorch,toggleCrouch,status:()=>({near,position:player.toArray(),yaw}),setQuality:low=>{lowFX=low;art.setQuality(low);polish.setQuality(low);fx.setQuality(low);renderer.shadowMap.enabled=!low;renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);rain.visible=!low;}};
}
