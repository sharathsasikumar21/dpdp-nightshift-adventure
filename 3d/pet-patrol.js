const HOME={x:-3,z:8};
const visitFor=floor=>floor===47?{x:-10.7,z:3,npc:0}:floor===48?{x:10.7,z:0,npc:1}:floor===49?{x:10.5,z:8,npc:2}:null;
export function createPetPatrol(){
 let floor=47,x=HOME.x,z=HOME.z,yaw=Math.PI,index=0,pause=4,route=[],greet=null;
 function setFloor(value){floor=value;x=HOME.x;z=HOME.z;index=0;pause=4;greet=null;const visit=visitFor(floor),via=floor===49?[{x:13.5,z:2},{x:13.5,z:10},{x:10.5,z:10}]:visit?[{x:visit.x,z:2}]:[{x:12.8,z:2},{x:12.8,z:8}];route=[{x:-2,z:8},{x:-2,z:2},...via,...(visit?[visit]:[]),...via.slice().reverse(),{x:-2,z:2},HOME];}
 setFloor(47);
 return {setFloor,pause(seconds=4){pause=Math.max(pause,seconds);},update(dt,{paused=false,player=null}={}){
  dt=Math.min(.1,Math.max(0,dt));let speed=0,event=null;if(paused||player&&Math.hypot(player.x-x,player.z-z)<1.05)return {x,z,yaw,speed,greeting:greet,event};
  if(pause>0){pause-=dt;return {x,z,yaw,speed,greeting:greet,event};}greet=null;
  const target=route[index],dx=target.x-x,dz=target.z-z,distance=Math.hypot(dx,dz),desiredYaw=Math.atan2(dx,dz),angle=Math.atan2(Math.sin(desiredYaw-yaw),Math.cos(desiredYaw-yaw));yaw+=angle*(1-Math.exp(-dt*6));
  if(Math.abs(angle)<.22){speed=Math.min(.65,distance*2.5);const step=Math.min(distance,speed*dt);if(distance>.001){x+=dx/distance*step;z+=dz/distance*step;}}
  if(distance<.06){x=target.x;z=target.z;index=(index+1)%route.length;pause=target.npc!==undefined?6:index===0?7:1;greet=target.npc??null;event=greet;speed=0;}
  return {x,z,yaw,speed,greeting:greet,event};
 }};
}
