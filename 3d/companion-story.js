export function crewReaction(stories,log,playerId,index){
 const calls=log.map(e=>({entry:e,result:e.results.find(r=>r.id===playerId)})).filter(e=>e.result),last=calls.at(-1);
 if(!last)return {mood:'first',title:'Still building trust',line:['Let us compare the records before we settle on a story.','I can help trace the system; keep the originals intact.','Ask what the evidence establishes before attributing responsibility.'][index]};
 const topic=stories[last.entry.story].scenes[last.entry.scene].tag,previous=calls.at(-2),recovered=last.result.good&&previous&&!previous.result.good;
 const mood=!last.result.good?'caution':recovered?'recovered':'trust';
 const lines={trust:['Your last call protected the people in those records. I am more comfortable bringing you the next discrepancy.','You kept the response defensible. I will keep coordinating the technical checks with you.','That was careful reasoning. Keep distinguishing authority, purpose and safeguards.'],caution:['That last call left a safeguard unresolved. I need us to verify the original record before the next decision.','The last response left exposure to follow up. I will preserve the trail while we check the route again.','I disagree with that last call. Let us revisit the missed safeguard without jumping to blame.'],recovered:['That correction matters. You checked the evidence and made a safer call this time.','The latest call was stronger. We still have earlier exposure to reconcile, but we can work from the verified record.','Your latest reasoning improved. Keep documenting the correction as well as the original risk.']};
 return {mood,title:mood==='trust'?'Confidence earned':mood==='recovered'?'A better next call':'Concern after the last call',line:lines[mood][index]+' Last decision: '+topic+'.'};
}
export function companionRecord(state){return state.companionHunt??={stage:'idle'};}
export function noticeCompanionFind(record){if(record.stage!=='idle')return false;record.stage='noticed';return true;}
export function collectCompanionFind(record){if(record.stage!=='noticed')return false;record.stage='found';return true;}
export function verifyCompanionFind(record,choice){if(record.stage!=='found'||choice!==1)return false;record.stage='verified';return true;}
export const COMPANION_SLIP='BL-0116 · Retry R-3 · Queue created 00:57. Approval reference: consult release ledger. This loose slip is not a signed authorisation.';
export const COMPANION_SOURCE='Read-only scheduler archive: BL-0116 / R-3 / queued 00:57. The job and retry identifiers match the loose slip. The archive does not identify a human approver.';
export const COMPANION_FINDING='The slip is corroborated by the scheduler archive: this retry was queued before the dashboard’s 01:12 ingestion display. It does not identify who approved the export. Preserve the slip with the source record and verify the release ledger separately.';
export function createWalkingCommentary({now=Date.now,interval=45000,distance=7}={}){
 let run=null,lastPosition=null,travel=0,lastSpoken=0;
 return {reset(){run=null;lastPosition=null;travel=0;lastSpoken=0;},update({runId,position,allowed}){
  if(run!==runId){run=runId;lastPosition=position;travel=0;lastSpoken=now();return false;}
  if(!allowed){lastPosition=null;return false;}
  let moved=0;if(lastPosition){const step=Math.hypot(position[0]-lastPosition[0],position[2]-lastPosition[2]);if(step<2){travel+=step;moved=step;}}
  lastPosition=[...position];if(moved<.01||travel<distance||now()-lastSpoken<interval)return false;travel=0;lastSpoken=now();return true;
 }};
}
