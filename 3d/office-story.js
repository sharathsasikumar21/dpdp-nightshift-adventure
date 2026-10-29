export const OPENING_LEADS=[
 {title:'Abandoned visitor badge',body:'Badge V-017 lies beside the lift. Its printed expiry is 00:30. Possession of the badge does not establish who used it.',question:'Who used it after expiry?'},
 {title:'Blinking access terminal',body:'The access log records V-017 entering at 01:12. An export job began at 01:16 under a shared service account. The log does not identify the person behind either event.',question:'Can the door event be linked to the export?'},
 {title:'Mira’s account',body:'“I thought visitor access was disabled at midnight. I checked the dashboard, not the door controller.” Her account conflicts with the access log; it is a lead to investigate, not proof of deception.',question:'Which system actually enforced the restriction?'}
];
export function openingComplete(found){return OPENING_LEADS.every((_,i)=>found.has(i));}
export function operationalState(log,id){
 let pressure=0;
 for(const entry of log){const result=entry.results.find(r=>r.id===id);if(result)pressure=Math.max(0,Math.min(3,pressure+(result.good?-1:1)));}
 return {pressure,restricted:pressure>=2,label:pressure>=2?'AUXILIARY SYSTEMS RESTRICTED':pressure?'SECURITY WATCH':'SYSTEMS STABLE',message:pressure>=2?'Control has restricted the coffee service and auxiliary scan. Essential case evidence and workstation access remain available. The permanent yellow case marker remains visible. A defensible decision restores one security level.':pressure?'Control is reviewing access. Amber lighting marks the security watch; another unsafe call restricts auxiliary systems.':'Auxiliary systems are available. Colleagues can coordinate the investigation.'};
}
export function evidencePrompt(index){return ['Check the sequence of events and the scope of the stated purpose.','Compare the proposed action with the person’s request and the supporting record.','Check who remains accountable, what is missing, and what must happen next.'][index%3];}
