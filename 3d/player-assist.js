export function guidanceFor({currentFloor,targetFloor,near=false,openingCount=0,evidenceCount=0,operationsOpen=false,evidenceOpen=false,ops={steps:[],witnesses:[]},complete=false}={}){
 if(evidenceOpen)return {key:'read',text:'Inspect every unexamined exhibit. Back to All Evidence keeps you on this board. Compare the records, then Return to Game and use the active terminal.'};
 if(operationsOpen){if(complete)return {key:'question',text:'All containment actions are complete. Choose Proceed to Decision Briefing, then start the question when you are ready.'};if(ops.witnesses.length<2)return {key:'accounts',text:'Read both accounts and their source records before choosing which finding the evidence supports.'};if(ops.finding!==1)return {key:'comparison',text:'Compare the two accounts with the source records. Separate a stated assumption from what the record actually establishes.'};return {key:'operations',text:'Use the next enabled containment action in order. Preserve the records, trace the route and coordinate the scoped hold. Then proceed to the decision briefing.'};}
 if(currentFloor!==targetFloor)return {key:'floor',text:'Your active case is on floor '+targetFloor+'. Use Lift / Floors, or walk into the lift and select that floor on its wall panel.'};
 if(!near)return {key:'desk',text:'Follow the yellow marker to your active case table. Field Tools → Navigate to Case is a direct shortcut.'};
 if(openingCount<3)return {key:'arrival',text:'Open Arrival Leads. Inspect the badge, access log and witness account. Use Back to All Evidence between them, then continue to the case.'};
 if(evidenceCount<3)return {key:'evidence',text:evidenceCount+'/3 case records inspected. Open Evidence Board and inspect the remaining exhibits. Compare the request, approval and source log before making your call.'};
 if(!complete)return {key:'terminal',text:'All three case records are collected. Look at the active terminal and press E. Complete its case operations, then open the decision briefing.'};
 return {key:'question',text:'Your case preparation is complete. Interact with the active terminal. Start the question only when ready; timed decisions allow 50 seconds.'};
}
export function createStuckDetector({now=Date.now,delay=25000,cooldown=90000}={}){
 let key=null,since=now(),last=-Infinity,count=0;
 return {reset(){key=null;since=now();last=-Infinity;count=0;},update(signature,allowed=true){const t=now();if(signature!==key){key=signature;since=t;count=0;return false;}if(!allowed){since=t;return false;}if(t-since<delay||t-last<cooldown||count>=2)return false;last=t;since=t;count++;return true;}};
}
