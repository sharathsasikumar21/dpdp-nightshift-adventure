// Metres and seconds. Axis-separated collision lets the analyst slide along furniture.
export function walkPosition(position,dx,dz,blocks,radius=.24){
 const p={x:position.x,z:position.z};
 const blocked=(x,z)=>x < -14.4 || x > 14.4 || z < -11.25 || z > 11.25 || blocks.some(b=>Math.abs(x-b.x)<b.w/2+radius&&Math.abs(z-b.z)<b.d/2+radius);
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));
 for(let i=0;i<steps;i++){if(!blocked(p.x+dx/steps,p.z))p.x+=dx/steps;if(!blocked(p.x,p.z+dz/steps))p.z+=dz/steps;}
 return p;
}
export function desiredVelocity(forward,side,yaw,sprint=false,crouch=false){
 const length=Math.hypot(forward,side)||1,speed=crouch?1.15:sprint?3.7:2.25;
 return {x:(side*Math.cos(yaw)-forward*Math.sin(yaw))*speed/length,z:(-forward*Math.cos(yaw)-side*Math.sin(yaw))*speed/length};
}
