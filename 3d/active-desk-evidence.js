import * as T from './vendor/three.module.js';
import {floorForCase} from './building.js';

// Arrival clues reuse the active case workstation. This builds props only:
// no extra table, furniture collider or dedicated arrival-desk location.
export function buildArrivalEvidence(scene,office){
 const first=office.meshes.length,group=new T.Group();group.userData.dynamic=true;scene.add(group);
 const badge=office.box(-.84,.805,.4,.3,.025,.4,office.paper);
 const tablet=office.box(.84,.815,.4,.3,.035,.38,new T.MeshStandardMaterial({color:'#172d31',emissive:'#72c8ae',emissiveIntensity:.45}));
 const recording=office.box(-.84,.815,-.21,.24,.04,.3,office.metal);
 const targets=[badge,tablet,recording];targets.forEach((mesh,index)=>{mesh.userData.interaction={type:'opening',index};mesh.userData.dynamic=true;});
 office.meshes.slice(first).forEach(mesh=>group.attach(mesh));
 let active=false,floor=47,caseFloor=47,time=0;
 function visible(){group.visible=active&&floor===caseFloor;}
 return {targets,group,
  setCase(index){const [x,z]=office.positions[index];group.position.set(x,0,z);caseFloor=floorForCase(index);visible();},
  setFloor(value){floor=value;visible();},
  setActive(value){active=!!value;visible();},
  update(dt,reduced){time+=dt;tablet.material.emissiveIntensity=reduced?.45:.4+.08*Math.sin(time*2);}
 };
}
