import {dossiers} from './case-content.js';
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
export function operationPlan(state,playerId,storyId=null){
 const consequence=chainConsequence(state,playerId),context=storyId?CASE_OPERATION_CONTEXT[storyId]:null;if(storyId&&!context)throw Error('Missing operation context: '+storyId);const records=context?dossiers[storyId].clues.map(c=>c[0]).join(', '):'source logs, case records and scheduler configuration';
 const plan=[
 {id:'preserve',title:'Preserve source records',instruction:'Create a read-only evidence snapshot of the source logs, case records and scheduler configuration.',result:'Read-only snapshot sealed. Originals retained; capture time and job ID recorded.'},
 {id:'scope',title:'Trace the copy route',instruction:'Compare the scheduler job with the source IDs. Select the route to hold without deleting its audit trail.',result:'BL-0116 mapped to the case source. The scope of the requested hold is recorded.'},
 ...(consequence.needsReconciliation?[{id:'reconcile',title:'Reconcile inherited copies',instruction:'Match the recovered retry queue against the inventory before confirming the hold.',result:'Retry IDs reconciled. Unverified copies remain flagged for follow-up; they are not assumed deleted.'}]:[]),
 {id:'hold',title:'Request a scoped transfer hold',instruction:'Send Security the verified BL-0116 route and preserve the originals for investigation.',result:'Security acknowledges the scoped hold in this simulation. Source evidence and essential services remain available.'}
 ];
 if(context){plan[0]={...plan[0],title:'Preserve '+context.label,instruction:'Seal read-only copies of '+records+'. Retain their capture times and their link to BL-0116.',result:context.label+' snapshot sealed with its source IDs and capture times.'};plan[1]={...plan[1],title:'Trace '+context.route,instruction:'Compare '+context.trace+' with the BL-0116 relay configuration. Record which links are established and which still need verification.',result:context.route+' mapped to this case’s source bundle. Unverified links remain flagged.'};const hold=plan.at(-1);Object.assign(hold,{title:'Request a scoped '+context.route+' hold',instruction:'Coordinate with '+context.owner+' to hold the verified Blue Lantern copy route for '+context.label+'. Preserve the evidence and essential services.',result:context.owner+' acknowledges the scoped request for '+context.route+'. This does not resolve the case’s remaining legal decisions.'});const reconcile=plan.find(p=>p.id==='reconcile');if(reconcile){reconcile.instruction='Match the recovered retry IDs for '+context.route+' against its copy inventory before sealing this case.';reconcile.result='Retry IDs reconciled for '+context.route+'. Unverified copies remain open for follow-up.';}}return plan;
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

export const CASE_OPERATION_CONTEXT={
 toggle:{label:'location and rollout records',route:'the location feed',trace:'the device session and campaign source identifiers',owner:'the release team and Security'},
 permission:{label:'withdrawal and offers records',route:'the offers queue',trace:'the preference receipt and queued offers account IDs',owner:'campaign operations and Security'},
 'city-form':{label:'grant request records',route:'the grant staging feed',trace:'the form schema, launch brief and official request',owner:'the civic service owner and Security'},
 schoolyard:{label:'learning and guardian records',route:'the learning integration',trace:'the ad-module version, account record and support recording',owner:'the learning service owner and Security'},
 vendor:{label:'vendor access records',route:'the vendor copy chain',trace:'the research request and subcontractor access ticket',owner:'vendor assurance and Security'},
 breach:{label:'personal-drive incident records',route:'the exposed sync route',trace:'the active sync status, provider report and notice draft timeline',owner:'incident response and Security'},
 'rights-desk':{label:'rights-request records',route:'the rights queue link',trace:'the account-specific request, correction evidence and escalation queue',owner:'the rights owner and Security'},
 'memory-drawer':{label:'retention and refund records',route:'the archive staging sweep',trace:'the staging inventory, retention review and conflicting attendee profiles',owner:'records operations and Security'},
 'borderless-copy':{label:'migration and source records',route:'the migration copy',trace:'the migration destination ticket, publication history and service contact',owner:'transfer assurance and Security'},
 'audit-trail':{label:'consent and access records',route:'the audit export route',trace:'the notice reference, identity attachment and permission inventory',owner:'access governance and Security'}
};
