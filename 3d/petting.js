import * as T from './vendor/three.module.js';
export const PET_SECONDS=3.7;
const smooth=value=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
export function createPettingScene(scene,camera,extras,onFinish){
 const arms=new T.Group();arms.name='First-person suited petting hand';arms.visible=false;scene.add(arms);
 const skin=new T.MeshStandardMaterial({color:'#b67f60',roughness:.9}),cloth=new T.MeshStandardMaterial({color:'#171b20',roughness:.9}),white=new T.MeshStandardMaterial({color:'#dcd9ce',roughness:.9});
 const sleeve=new T.Mesh(new T.CylinderGeometry(.052,.075,1,16),cloth),cuff=new T.Mesh(new T.CylinderGeometry(.049,.052,.07,16),white),hand=new T.Group();arms.add(sleeve,cuff,hand);
 const palm=new T.Mesh(new T.SphereGeometry(1,20,12),skin);palm.scale.set(.065,.026,.085);hand.add(palm);
 for(let i=0;i<4;i++){const finger=new T.Mesh(new T.CapsuleGeometry(.012,[.065,.082,.077,.058][i],5,10),skin);finger.rotation.x=Math.PI/2;finger.position.set((i-1.5)*.028,-.005,.085);hand.add(finger);}
 const thumb=new T.Mesh(new T.CapsuleGeometry(.018,.048,5,10),skin);thumb.rotation.z=-.9;thumb.rotation.x=.7;thumb.position.set(.072,-.005,-.015);hand.add(thumb);
 let active=false,elapsed=0,from,fromQ,goal,goalQ;
 function cancel(){active=false;arms.visible=false;extras.setPetting(false);}
 function start(){if(active)return false;active=true;elapsed=0;extras.setPetting(true);from=camera.position.clone();fromQ=camera.quaternion.clone();const head=extras.petHeadPosition(),away=from.clone().sub(head);away.y=0;away.normalize();goal=head.clone().addScaledVector(away,.9);goal.y=head.y+.43;const dummy=new T.PerspectiveCamera();dummy.position.copy(goal);dummy.lookAt(head.clone().add(new T.Vector3(0,.06,0)));goalQ=dummy.quaternion.clone();return true;}
 function update(dt){if(!active)return;elapsed+=dt;const head=extras.petHeadPosition().add(new T.Vector3(0,.1,0)),approach=smooth(elapsed/.65)*(1-smooth((elapsed-3)/.7));camera.position.lerpVectors(from,goal,approach);camera.quaternion.slerpQuaternions(fromQ,goalQ,approach);camera.updateMatrixWorld(true);
  const right=new T.Vector3(1,0,0).applyQuaternion(camera.quaternion),forward=new T.Vector3(0,0,-1).applyQuaternion(camera.quaternion),origin=camera.position.clone().addScaledVector(right,.35).add(new T.Vector3(0,-.43,0)),reach=smooth((elapsed-.45)/.5)*(1-smooth((elapsed-2.85)/.4));
  const stroke=new T.Vector3(0,Math.abs(Math.sin((elapsed-.9)*Math.PI*1.5))*.018,Math.sin((elapsed-.9)*Math.PI*1.5)*.055),target=head.clone().add(stroke),rest=origin.clone().addScaledVector(forward,.15).add(new T.Vector3(0,-.2,0)),point=rest.lerp(target,reach);hand.position.copy(point);hand.rotation.y=Math.atan2(forward.x,forward.z);hand.rotation.x=.08;
  const wrist=point.clone().addScaledVector(forward,-.09),direction=wrist.clone().sub(origin),length=direction.length();direction.normalize();sleeve.position.copy(origin).addScaledVector(direction,length*.5);sleeve.scale.y=Math.max(.01,length-.07);sleeve.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction);cuff.position.copy(wrist).addScaledVector(direction,-.035);cuff.quaternion.copy(sleeve.quaternion);arms.visible=reach>.015;
  if(elapsed>=PET_SECONDS){cancel();camera.position.copy(from);camera.quaternion.copy(fromQ);onFinish();}
 }
 return {start,update,cancel,get active(){return active;}};
}
