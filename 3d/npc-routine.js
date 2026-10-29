// Keep actions restrained and departments stationary so witnesses stay findable.
const ACTIONS=['review','listen','look-around','idle'];
export function createNPCRoutine(random=Math.random){
 let remaining=2+random()*8,current='idle';
 return {update(dt,{engaged=false,reduced=false}={}){
  if(engaged||reduced)return 'idle';remaining-=Math.max(0,Math.min(dt,.1));
  if(remaining<=0){current=ACTIONS[Math.floor(random()*ACTIONS.length)%ACTIONS.length];remaining=7+random()*12;}
  return current;
 }};
}
