const FLOORS=[47,48,49,50];
export function createLiftRide({floor=47,onArrive=()=>{},onComplete=()=>{}}={}){
 let current=floor,target=floor,from=floor,phase='idle',elapsed=0,door=1,display=floor;
 const snapshot=()=>({floor:current,target,phase,door,display,busy:phase!=='idle'});
 return {snapshot,reset(value){current=target=from=display=value;phase='idle';elapsed=0;door=1;},cancel(){phase='idle';elapsed=0;door=1;target=current;display=current;},request(value,{inside=false}={}){if(!FLOORS.includes(value))return {accepted:false,reason:'invalid-floor'};if(phase!=='idle')return {accepted:false,reason:'busy'};if(!inside)return {accepted:false,reason:'outside'};if(value===current)return {accepted:false,reason:'same-floor'};from=current;target=value;elapsed=0;phase='closing';return {accepted:true};},update(dt){
  let remaining=Math.max(0,Math.min(1,dt));
  while(remaining>0&&phase!=='idle'){
   const duration=phase==='closing'?.85:phase==='moving'?1+Math.abs(target-from)*.6:.9,step=Math.min(remaining,Math.max(0,duration-elapsed));elapsed+=step;remaining-=step;const t=Math.min(1,elapsed/duration);
   if(phase==='closing')door=1-t;else if(phase==='moving')display=from+Math.sign(target-from)*Math.floor(Math.abs(target-from)*t);else door=t;
   if(t<1)break;elapsed=0;if(phase==='closing'){door=0;phase='moving';}else if(phase==='moving'){current=target;display=target;phase='opening';onArrive(current);}else{door=1;phase='idle';onComplete(current);}
  }
  return snapshot();
 }};
}
