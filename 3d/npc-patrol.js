export function createNPCPatrol({x,z,random=Math.random}){
 let position=z,target=z+.9,speed=0,yaw=0,pause=5+random()*12;
 return {update(dt,{paused=false,near=false}={}){
  dt=Math.max(0,Math.min(.1,dt));
  if(paused||near){speed=0;return {x,z:position,yaw,speed};}
  if(pause>0){pause-=dt;speed=0;return {x,z:position,yaw,speed};}
  const distance=target-position,targetYaw=distance<0?Math.PI:0,difference=Math.atan2(Math.sin(targetYaw-yaw),Math.cos(targetYaw-yaw));yaw+=difference*(1-Math.exp(-dt*7));
  const desired=Math.abs(difference)>.25?0:Math.min(.85,Math.abs(distance)*2.2);speed+=(desired-speed)*(1-Math.exp(-dt*4));position+=Math.sign(distance)*Math.min(Math.abs(distance),speed*dt);
  if(Math.abs(target-position)<.025){position=target;speed=0;target=target>z?z-.9:z+.9;pause=7+random()*12;}
  return {x,z:position,yaw,speed};
 }};
}
