import {createPetPatrol} from './pet-patrol.js';
import {createSuppliedCharacter} from './supplied-characters.js';
import {buildArrivalEvidence} from './active-desk-evidence.js';
import {createNPCPatrol} from './npc-patrol.js';
import {createNPCRoutine} from './npc-routine.js';
import {addDeskTributes} from './desk-tributes.js';
import {createHuman} from './humans.js';
import {colleagueFloor} from './building.js';
import * as T from './vendor/three.module.js';

export const TRIBUTES=[
 {title:'Watch Dogs 2',note:'A tribute to its surveillance themes, connected-city investigations and playful environmental interactions.'},
 {title:'Red Dead Redemption 2',note:'A tribute to its environmental storytelling, lived-in locations and memorable character encounters.'},
 {title:'Detroit: Become Human',note:'A tribute to its cinematic introductions, ethical choices and human consequences.'},
 {title:'Cyberpunk 2077',note:'A tribute to its rain-soaked city atmosphere, illuminated towers and technology-driven mysteries.'},
 {title:'Call of Duty: Modern Warfare',note:'A tribute to its tense radio dispatches, Simon “Ghost” Riley and Task Force 141.'}
];
export const COLLEAGUES=[
 {name:'Mira · Incident analyst',hints:['Compare the timestamps. A permission granted later cannot explain an earlier export.','Read the source document before choosing a response. The first account may be incomplete.','Check who received the records, not just who clicked the button.']},
 {name:'Arjun · Security engineer',hints:['Separate what the evidence proves from what somebody assumes.','A vendor’s assurance is a lead to verify, not proof by itself.','Contain the problem while preserving evidence. You may need both.']},
 {name:'Leena · Privacy counsel',hints:['Look for the stated purpose and the limits on using the data.','Check which people are affected before deciding what action fits.','Similar options can differ in timing, scope or accountability. Read those words carefully.']}
];

// Civilian colleagues, shoreline and table keepsakes.
export function addNightExtras(scene,office,onPetGreeting=()=>{}){
 const {box,textPlate,blocks}=office,targets=[],people=[];
 const sea=new T.Mesh(new T.PlaneGeometry(170,150),new T.MeshStandardMaterial({color:'#040e1b',metalness:.15,roughness:.7}));
 sea.rotation.x=-Math.PI/2;sea.position.set(0,-38,-85);scene.add(sea);
 const gold=new T.MeshBasicMaterial({color:'#e8b56f'}),cool=new T.MeshBasicMaterial({color:'#83b7d3'});
 // A stylized Queen's Necklace: a curved shoreline below the high-rise office.
 const shore=[];for(let i=0;i<64;i++){const a=-1.05+i/63*1.8,x=25+Math.sin(a)*64,z=-35-Math.cos(a)*55;shore.push(new T.Vector3(x,-36.8,z));const lamp=new T.Mesh(new T.SphereGeometry(.19,6,4),i%5?gold:cool);lamp.position.copy(shore.at(-1));lamp.position.y+=.7;scene.add(lamp);}
 const road=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(shore),64,.22,5,false),new T.MeshStandardMaterial({color:'#182333',roughness:.85}));scene.add(road);
 const reflections=new T.BufferGeometry(),points=[];
 for(let i=0;i<100;i++){const x=-48+(i*29%100),z=-22-(i*17%80);points.push(x,-37.96,z,x+.08,-37.96,z+1+(i%4));}
 reflections.setAttribute('position',new T.Float32BufferAttribute(points,3));scene.add(new T.LineSegments(reflections,new T.LineBasicMaterial({color:'#678d9c',transparent:true,opacity:.19})));

 // Characters occupy side bays, away from evidence and primary walking lanes.
 COLLEAGUES.forEach((person,i)=>{const x=[-12,12,12][i],z=[3,0,8][i],human=i===0?createSuppliedCharacter('mira.glb',{height:1.68}):createHuman({female:i!==1,civilian:true,tint:i===2?0xa8badb:0xffffff}),group=human.group;group.position.set(x,0,z);group.rotation.y=0;group.userData.interaction={type:'colleague',index:i};scene.add(group);people.push({group,human,index:i,routine:createNPCRoutine(),patrol:createNPCPatrol({x,z})});const obstacle={x,z,w:.75,d:.65,floor:colleagueFloor(i),dynamic:true};blocks.push(obstacle);people.at(-1).obstacle=obstacle;targets.push(group);});
 targets.nearbyColleague=(player,floor)=>{const nearby=people.filter(p=>colleagueFloor(p.index)===floor&&Math.hypot(p.group.position.x-player.x,p.group.position.z-player.z)<3).sort((a,b)=>a.group.position.distanceToSquared(player)-b.group.position.distanceToSquared(player));return nearby[0]?.index??null;};
 targets.push(...addDeskTributes(office));
 const pet=createSuppliedCharacter('labrador.glb',{height:.72,animate:true});pet.group.name='Chikku';pet.group.position.set(-3,0,8);pet.group.rotation.y=Math.PI;pet.group.userData.interaction={type:'pet'};scene.add(pet.group);targets.push(pet.group);const petBlock={x:-3,z:8,w:.65,d:1.1,h:.7,dynamic:true};blocks.push(petBlock);const petPatrol=createPetPatrol();let petting=false,petFloor=47;targets.petPosition=()=>pet.group.position.clone();targets.petHeadPosition=()=>pet.getHeadPosition();targets.setPetting=value=>{petting=value;petPatrol.pause(value?4:2);};
 const opening=buildArrivalEvidence(scene,office);targets.push(...opening.targets);targets.setCase=index=>opening.setCase(index);targets.setArrivalActive=value=>opening.setActive(value);let time=0;targets.ready=Promise.allSettled([...people.map(p=>p.human.ready),pet.ready]);targets.setFloor=floor=>{opening.setFloor(floor);petFloor=floor;petPatrol.setFloor(floor);pet.group.position.set(-3,0,8);petBlock.x=-3;petBlock.z=8;people.forEach(p=>{p.group.visible=colleagueFloor(p.index)===floor;});};targets.update=(dt,camera,reduced)=>{time+=dt;const paused=!!document.querySelector('dialog[open]')||!document.body.classList.contains('phase-explore')||reduced,companion=petPatrol.update(dt,{paused:paused||petting,player:camera.position});pet.group.position.set(companion.x,0,companion.z);pet.group.rotation.y=companion.yaw;petBlock.x=companion.x;petBlock.z=companion.z;pet.setMotion(companion.speed);pet.setActivity(petting?'pet':companion.greeting!==null?'greet':'idle');pet.update(paused?0:dt);if(companion.event!==null)onPetGreeting(companion.event);opening.update(dt,reduced);for(const person of people){if(!person.group.visible)continue;const engaged=!!document.querySelector('dialog[open]')||companion.greeting===person.index;const near=Math.hypot(camera.position.x-person.group.position.x,camera.position.z-person.group.position.z)<1.8,patrol=person.patrol.update(dt,{paused:engaged||reduced||person.index===0,near});person.group.position.set(patrol.x,0,patrol.z);const face=companion.greeting===person.index?Math.atan2(companion.x-patrol.x,companion.z-patrol.z):patrol.yaw;person.group.rotation.y+=Math.atan2(Math.sin(face-person.group.rotation.y),Math.cos(face-person.group.rotation.y))*(1-Math.exp(-dt*5));person.obstacle.x=patrol.x;person.obstacle.z=patrol.z;person.human.setActivity(companion.greeting===person.index?'review':patrol.speed>.05?'idle':person.routine.update(dt,{engaged,reduced}));person.human.update(reduced?0:dt,patrol.speed);}};
 return targets;
}
