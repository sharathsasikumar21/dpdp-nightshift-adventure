export const WITNESS_ACCOUNTS=[
 {name:'Mira · Incident analyst',account:'The dashboard says V-017 arrived at 01:12. I thought access had been disabled at midnight, so I suspected someone got in after expiry.',source:'Dashboard display: 01:12 is the time the queued event was ingested, not when the door opened.'},
 {name:'Arjun · Security engineer',account:'The controller says 00:24. The dashboard replayed the queued event at 01:12. Neither system identifies who approved the export.',source:'Original controller record: V-017, door event 00:24. Scheduler: BL-0116 executed at 01:16 under a shared service account.'}
];
export const WITNESS_FINDINGS=[
 'The dashboard establishes that the badge opened the door at 01:12.',
 'The source record establishes a 00:24 door event; the dashboard records later ingestion.',
 'The scheduler establishes that the badge holder approved the export at 01:16.'
];
export function chainConsequence(state,playerId){
 const current=Math.floor(state.turn/3),prior=state.log.filter(e=>state.route.indexOf(e.story)<current),unsafe=prior.filter(e=>!e.results.find(r=>r.id===playerId)?.good).length;
 return {unsafe,needsReconciliation:unsafe>0,title:unsafe?'Inherited exposure: copy reconciliation required':'Earlier controls held',body:unsafe?'Earlier unsafe calls left the morning copy inventory uncertain. Arjun has recovered retry records. Reconcile the retry queue before sealing this case’s containment record.':'Earlier defensible calls preserved the trail. The verified inventory is available; no retry reconciliation is required.'};
}
export function operationPlan(state,playerId){
 const consequence=chainConsequence(state,playerId);
 return [
 {id:'preserve',title:'Preserve source records',instruction:'Create a read-only evidence snapshot of the source logs, case records and scheduler configuration.',result:'Read-only snapshot sealed. Originals retained; capture time and job ID recorded.'},
 {id:'scope',title:'Trace the copy route',instruction:'Compare the scheduler job with the source IDs. Select the route to hold without deleting its audit trail.',result:'BL-0116 mapped to the case source. The scope of the requested hold is recorded.'},
 ...(consequence.needsReconciliation?[{id:'reconcile',title:'Reconcile inherited copies',instruction:'Match the recovered retry queue against the inventory before confirming the hold.',result:'Retry IDs reconciled. Unverified copies remain flagged for follow-up; they are not assumed deleted.'}]:[]),
 {id:'hold',title:'Request a scoped transfer hold',instruction:'Send Security the verified BL-0116 route and preserve the originals for investigation.',result:'Security acknowledges the scoped hold in this simulation. Source evidence and essential services remain available.'}
 ];
}
export function operationRecord(state){const key=state.route[Math.floor(state.turn/3)];state.fieldOperations??={};return state.fieldOperations[key]??={steps:[],witnesses:[],finding:null};}
export function advanceOperation(record,plan,step){const next=plan.find(p=>!record.steps.includes(p.id));if(!next||next.id!==step)return false;record.steps.push(step);return true;}
export function operationsComplete(record,plan){return plan.every(p=>record.steps.includes(p.id))&&record.witnesses.includes(0)&&record.witnesses.includes(1)&&record.finding===1;}
export const FINAL_FINDINGS=[
 {title:'Mira authorised a midnight entry',explanation:'The badge and dashboard establish access by the same person who approved BL-0116.'},
 {title:'An unidentified visitor authorised the export',explanation:'The 01:12 dashboard event proves the visitor triggered the 01:16 scheduler job.'},
 {title:'A signed release enabled the queued export',explanation:'Veda Menon’s 00:58 approval enabled BL-0116. The shared account executed it; the 00:24 door event was displayed later at 01:12.'}
];
export function finalFinding(choice){return {choice,good:choice===2,explanation:choice===2?'The signed ledger identifies the approval. The controller distinguishes door time from dashboard ingestion. This establishes authorisation, not that every underlying use of data was defensible.':'The records do not support that attribution. The signed ledger names Veda Menon at 00:58; the badge event occurred at 00:24 and was ingested at 01:12. A shared service account does not identify a human approver.'};}
