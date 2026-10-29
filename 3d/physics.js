import RAPIER from './vendor/rapier/rapier.mjs';
import {availableBlocks} from './building.js';

// Physics runs on the CPU at 60 Hz. The office uses simple fixed colliders,
// rather than expensive triangle meshes or a second copy of each floor.
const STEP=1/60,RADIUS=.26,HALF_HEIGHT=.63,CENTER=HALF_HEIGHT+RADIUS+.02;
let initialization;
export function initPhysics(){return initialization??=RAPIER.init();}

export async function createOfficePhysics(blocks,{floor=47,position={x:0,z:9}}={}){
 await initPhysics();
 const world=new RAPIER.World({x:0,y:-9.81,z:0});world.timestep=STEP;
 const fixed=(x,y,z,w,h,d)=>world.createCollider(RAPIER.ColliderDesc.cuboid(w/2,h/2,d/2).setTranslation(x,y,z).setFriction(.6));
 fixed(0,-.1,0,31,.2,25);
 fixed(-14.78,1.75,0,.2,3.5,24);fixed(14.78,1.75,0,.2,3.5,24);
 fixed(0,1.75,-11.63,30,3.5,.2);fixed(0,1.75,11.63,30,3.5,.2);
 const obstacles=blocks.map(b=>({block:b,collider:fixed(b.x,(b.h??1.8)/2,b.z,b.w,b.h??1.8,b.d)}));
 const moving=obstacles.filter(o=>o.block.dynamic);
 const body=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(position.x,CENTER,position.z));
 const capsule=world.createCollider(RAPIER.ColliderDesc.capsule(HALF_HEIGHT,RADIUS),body);
 const controller=world.createCharacterController(.02);controller.setSlideEnabled(true);
 controller.setMaxSlopeClimbAngle(Math.PI/5);controller.setMinSlopeSlideAngle(Math.PI/4);
 controller.enableSnapToGround(.12);
 let accumulator=0,current={...position},previous={...position},disposed=false;
 function setFloor(number){floor=number;const active=new Set(availableBlocks(blocks,floor));for(const {block,collider} of obstacles)collider.setEnabled(active.has(block));world.step();}
 function teleport(p){body.setTranslation({x:p.x,y:CENTER,z:p.z},true);body.setNextKinematicTranslation({x:p.x,y:CENTER,z:p.z});current={x:p.x,z:p.z};previous={...current};accumulator=0;world.step();}
 setFloor(floor);teleport(position);
 return {
  setFloor,teleport,
  advance(vx,vz,dt){
   if(disposed)throw Error('Physics has been disposed');
   if(![vx,vz,dt].every(Number.isFinite)||dt<0)throw Error('Invalid physics movement');
   // Discard time spent in an inactive tab instead of racing through the room.
   let moved=false;for(const {block,collider} of moving){const p=collider.translation();if(Math.abs(p.x-block.x)+Math.abs(p.z-block.z)>.0001){collider.setTranslation({x:block.x,y:(block.h??1.8)/2,z:block.z});moved=true;}}if(moved)world.step();
   accumulator+=Math.min(dt,.1);
   while(accumulator+1e-9>=STEP){
    // Every department has the same flat slab. Avoid injecting a permanent
    // downward displacement: it shortens the controller's horizontal travel.
    previous={...current};controller.computeColliderMovement(capsule,{x:vx*STEP,y:0,z:vz*STEP});
    const delta=controller.computedMovement(),p=body.translation();
    body.setNextKinematicTranslation({x:p.x+delta.x,y:p.y+delta.y,z:p.z+delta.z});world.step();
    const next=body.translation();current={x:next.x,z:next.z};accumulator=Math.max(0,accumulator-STEP);
   }
   const alpha=accumulator/STEP;
   return {x:previous.x+(current.x-previous.x)*alpha,z:previous.z+(current.z-previous.z)*alpha};
  },
  status:()=>({engine:'Rapier 0.21.0',floor,position:{...current},colliders:obstacles.filter(o=>o.collider.isEnabled()).length+6}),
  dispose(){if(!disposed){disposed=true;world.free();}}
 };
}
