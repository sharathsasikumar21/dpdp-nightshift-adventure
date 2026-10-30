import {floorForCase,floorInfo} from './building.js';
import {nextInstruction} from './navigation-guidance.js';
export function buildJournal(state,stories,dossiers,evidence,openingCount,currentFloor){
 const activeIndex=Math.min(Math.floor(state.turn/3),state.route.length-1),targetFloor=floorForCase(state.route[activeIndex]);
 const cases=state.route.map((index,order)=>{
  const story=stories[index],found=evidence.get(state.id+':'+story.id)||new Set(),completed=state.log.filter(e=>e.story===index).length;
  return {title:story.title,floor:floorForCase(index),active:order===activeIndex,completed,clues:(dossiers[story.id]?.clues||[]).map(([title,body],i)=>({title,body:found.has(i)?body:null})),question:order===activeIndex?story.scenes[state.turn%3]?.q:null};
 });
 return {cases,targetFloor,next:nextInstruction({openingCount,evidenceCount:cases[activeIndex].clues.filter(c=>c.body).length,currentFloor,targetFloor,near:false})};
}
export function floorBriefing(floor,targetFloor,timed=true){
 const info=floorInfo(floor);
 return {title:'Floor '+floor+' · '+info.name,body:info.description,next:floor===targetFloor?'Follow the yellow marker to your active table. Inspect its three records, then open the terminal.':'Your active case is on floor '+targetFloor+'. Use the lift panel or Lift / Floors.',clock:timed?'Each decision allows 50 seconds. The clock starts after you confirm the decision briefing.':'Untimed shift: investigate and decide at your own pace.'};
}
