import * as T from './vendor/three.module.js';
import {FLOORS,floorForCase} from './building.js';
export function addBuildingFloors(scene,office,extras){
 const variants=new Map(),{box,textPlate}=office;
 const metals=new T.MeshStandardMaterial({color:'#303b43',roughness:.7,metalness:.25});
 for(const floor of FLOORS){
  const start=office.meshes.length,group=new T.Group();scene.add(group);
  if(floor.number===48)for(let i=0;i<3;i++){box(10.4+i*1.1,1.1,-9.3,.85,2.2,.8,metals);for(let j=0;j<8;j++)box(10.4+i*1.1,.25+j*.23,-8.88,.64,.025,.02,new T.MeshBasicMaterial({color:j%2?'#79b8a2':'#d6ae74'}));office.blocks.push({x:10.4+i*1.1,z:-9.3,w:.9,d:.9,floor:48});}
  if(floor.number===49){textPlate('CIVIC & LEARNING / WITNESS SERVICES',0,2.7,-11.65,5,.18);for(let i=0;i<3;i++){box(-12+i*1.1,.42,-9.3,.78,.8,.65,metals);office.blocks.push({x:-12+i*1.1,z:-9.3,w:.85,d:.75,floor:49});}}
  if(floor.number===50)for(let i=0;i<3;i++){box(-12+i*1.1,1,-9.2,.9,2,.6,metals);for(let j=0;j<5;j++)box(-12+i*1.1,.2+j*.35,-8.87,.7,.24,.04,office.paper);office.blocks.push({x:-12+i*1.1,z:-9.2,w:1,d:.7,floor:50});}
  for(const mesh of office.meshes.slice(start))group.attach(mesh);variants.set(floor.number,group);
 }
 const lift=box(2,1.35,10.9,.3,.7,.1,new T.MeshStandardMaterial({color:'#293a42',emissive:'#e0bc76',emissiveIntensity:.2}));lift.userData.interaction={type:'lift'};
 textPlate('LIFT / 47–50',2,1.86,10.97,1.1,.13);extras.push(lift);
 return {setFloor(number){for(const [floor,group] of variants)group.visible=floor===number;for(let i=0;i<office.deskGroups.length;i++)office.deskGroups[i].visible=floorForCase(i)===number;extras.setFloor?.(number);}};
}
