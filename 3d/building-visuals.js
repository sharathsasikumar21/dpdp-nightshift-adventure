import * as T from './vendor/three.module.js';
import {FLOORS,floorForCase} from './building.js';
export function addBuildingFloors(scene,office,extras){
 const variants=new Map(),{box,textPlate}=office;
 const furnitureWood=new T.MeshStandardMaterial({color:'#65513a',roughness:.75});
 const metals=new T.MeshStandardMaterial({color:'#303b43',roughness:.7,metalness:.25});
 for(const floor of FLOORS){
  const start=office.meshes.length,group=new T.Group();scene.add(group);
  if(floor.number===48)for(let i=0;i<3;i++){box(10.4+i*1.1,1.1,-9.3,.85,2.2,.8,metals);for(let j=0;j<8;j++)box(10.4+i*1.1,.25+j*.23,-8.88,.64,.025,.02,new T.MeshBasicMaterial({color:j%2?'#79b8a2':'#d6ae74'}));office.blocks.push({x:10.4+i*1.1,z:-9.3,w:.9,d:.9,floor:48});}
  if(floor.number===49){textPlate('CIVIC & LEARNING / WITNESS SERVICES',0,2.7,-11.65,5,.18);for(let i=0;i<3;i++){box(-12+i*1.1,.42,-9.3,.78,.8,.65,metals);office.blocks.push({x:-12+i*1.1,z:-9.3,w:.85,d:.75,floor:49});}}
  if(floor.number===50)for(let i=0;i<3;i++){box(-12+i*1.1,1,-9.2,.9,2,.6,metals);for(let j=0;j<5;j++)box(-12+i*1.1,.2+j*.35,-8.87,.7,.24,.04,office.paper);office.blocks.push({x:-12+i*1.1,z:-9.2,w:1,d:.7,floor:50});}
  // Furnish side bays; leave workstations, the central aisle and pet routes clear.
  const fabric=new T.MeshStandardMaterial({color:floor.number===49?'#776b5e':'#364b50',roughness:.96}),trim=office.metal;
  if(floor.number===47||floor.number===49){
   box(-13.45,.34,-6.8,.95,.5,2.05,fabric);box(-13.93,.67,-6.8,.13,.66,2.05,fabric);
   for(const z of [-7.85,-5.75])box(-13.45,.54,z,.95,.16,.12,fabric);
   box(-13.35,.52,-8.6,.8,.07,.65,furnitureWood);for(const x of [-13.65,-13.05])box(x,.25,-8.6,.045,.5,.45,trim);
   box(-13.35,.58,-8.6,.4,.035,.3,office.paper);office.blocks.push({x:-13.45,z:-6.8,w:1.1,d:2.3,floor:floor.number},{x:-13.35,z:-8.6,w:.85,d:.7,floor:floor.number});
  }
  if(floor.number===48){box(13.55,.6,-7.8,.85,1.2,.75,metals);for(let i=0;i<3;i++)box(13.55,.22+i*.35,-7.4,.65,.22,.025,office.paper);office.blocks.push({x:13.55,z:-7.8,w:.9,d:.8,floor:48});}
  if(floor.number===50){for(const x of [-13.4,13.4]){box(x,.58,-4.7,.75,.07,1,trim);box(x,.14,-4.7,.75,.07,1,trim);for(const dx of [-.3,.3])box(x+dx,.34,-4.7,.04,.5,.9,trim);for(let j=0;j<4;j++)box(x,.63+j*.07,-4.7,.48,.055,.65,office.paper);office.blocks.push({x,z:-4.7,w:.8,d:1.1,floor:50});}}
  const note=textPlate(floor.number===48?'CONTAIN / PRESERVE / VERIFY':floor.number===50?'RECORDS / CHAIN OF CUSTODY':'NIGHT CREW / KEEP THE EVIDENCE INTACT',14.63,1.75,-3.8,2.4,.3,'#d6d3bf','#26333b');note.rotation.y=-Math.PI/2;
  for(const mesh of office.meshes.slice(start))group.attach(mesh);variants.set(floor.number,group);
 }
 const lift=box(2,1.35,10.9,.3,.7,.1,new T.MeshStandardMaterial({color:'#293a42',emissive:'#e0bc76',emissiveIntensity:.2}));lift.userData.interaction={type:'lift'};
 textPlate('LIFT / 47–50',2,1.86,10.97,1.1,.13);extras.push(lift);
 return {setFloor(number){for(const [floor,group] of variants)group.visible=floor===number;for(let i=0;i<office.deskGroups.length;i++)office.deskGroups[i].visible=floorForCase(i)===number;extras.setFloor?.(number);}};
}
