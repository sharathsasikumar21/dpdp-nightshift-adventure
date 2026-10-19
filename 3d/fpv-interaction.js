export function visibleInScene(object){
 for(let o=object;o;o=o.parent)if(!o.visible)return false;
 return true;
}
export function interactionOwner(object){
 for(let o=object;o;o=o.parent)if(Number.isInteger(o.userData?.evidence)||o.userData?.interaction)return o;
 return null;
}
export function bearingTo(player,target,yaw){
 const angle=Math.atan2(-(target[0]-player.x),-(target[1]-player.z))-yaw;
 const degrees=Math.atan2(Math.sin(angle),Math.cos(angle))*180/Math.PI;
 return {degrees,distance:Math.hypot(target[0]-player.x,target[1]-player.z),label:Math.abs(degrees)>150?'TURN AROUND':degrees>25?'← TURN LEFT':degrees< -25?'TURN RIGHT →':'↑ AHEAD'};
}
