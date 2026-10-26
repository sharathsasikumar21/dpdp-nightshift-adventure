// Authored connecting fiction. Case questions and legal reasoning remain independent.
export const THREAD_TITLE='The Blue Lantern job';
export const CASE_LINKS={
 toggle:['The switch','The location stream feeds the same Blue Lantern destination as the midnight export. Trace the purpose change before treating permission as universal.'],
 permission:['The ignored withdrawal','The offers export reused Blue Lantern. A preference change never reached that job’s filter.'],
 'city-form':['The excess fields','The grant service supplied an overbroad staging schema to Blue Lantern. A shared pipeline does not create a shared lawful purpose.'],
 schoolyard:['The hidden audience','The learning app’s profiling feed shares Blue Lantern’s integration label. Children’s records cannot inherit the treatment of adult accounts.'],
 vendor:['The second recipient','The reminder vendor’s research request leads to Blue Lantern’s unreviewed copy route. The contract does not make the company’s responsibility disappear.'],
 breach:['The uncontrolled copy','The personal-drive sync used a Blue Lantern output folder. Stop the live copy route while preserving the incident trail.'],
 'rights-desk':['The missing owner','The unassigned rights queue points to the same operations group that owns Blue Lantern. Find a responsible person, not another generic policy link.'],
 'memory-drawer':['The forgotten staging area','Old attendee profiles were still eligible for Blue Lantern’s nightly staging sweep. Retaining them created another source for the export.'],
 'borderless-copy':['The uncertain destination','Blue Lantern’s migration ticket never records its destination checks. A location label cannot establish that a transfer is allowed or forbidden.'],
 'audit-trail':['The proof gap','Blue Lantern’s audit bundle has identifiers but lacks linked notices and narrow access roles. Reconstruct what the records actually prove.']
};
const MILESTONES=[
 {title:'One job, several sources',body:'The completed case contains job label BL-0116. Arjun matches it to the 01:16 scheduler record. These incidents share a copy route; this establishes a system link, not the identity of a person.'},
 {title:'The badge clock was misleading',body:'The controller’s original record puts V-017 at the door at 00:24. The dashboard ingested that queued event at 01:12 and displayed the ingest time. The badge found by the lift cannot establish who started the export.'},
 {title:'The route was configured in advance',body:'The relay manifest names BL-0116 as a queued service task. Its source filters were configured before the door event appeared in the dashboard. The task label links systems; the human approval is still missing.'},
 {title:'The missing approval bundle',body:'The recovery team finds a release-ledger reference attached to the scheduler ticket. Its approval bundle is still being verified. Preserve the task configuration and avoid attributing the job to whoever last used the shared account.'},
 {title:'A signed release, not a midnight intruder',body:'The recovered release ledger names operations lead Veda Menon. Her signed approval at 00:58 enabled a queued Blue Lantern export using the shared service account. The original door record also confirms the 01:12 display was a replay of a 00:24 event. Mira’s dashboard assumption was wrong, but the badge was not proof against her.'}
];
export function threadProgress(log,totalCases){
 const complete=[...new Map(log.filter(e=>e.scene===2).map(e=>[e.story,e])).values()];
 const total=Math.max(1,totalCases),count=Math.min(total,complete.length);
 const entries=complete.slice(0,total).map((entry,index)=>{const stage=total===1?4:Math.floor(index*4/(total-1));return {...MILESTONES[stage],caseIndex:index+1,story:entry.story};});
 return {count,total,entries,complete:count>=total,stage:count===0?0:count>=total?3:count>=Math.ceil(total/2)?2:1};
}
export function caseLink(storyId){const link=CASE_LINKS[storyId]||['A new source','Check which source feeds the shared copy route.'];return {title:link[0],body:link[1]};}
export function clueConversation(index,storyId,collected,progress,pressure=0){
 const roles=[
 {name:'Mira · Incident analyst',opening:'I trusted the dashboard’s “disabled” status. I did not check the door controller. Keep those separate in your notes.',challenge:'My account is a witness statement. Compare it with the source document; if they conflict, preserve both and check what each timestamp measures.'},
 {name:'Arjun · Security engineer',opening:'BL-0116 is the scheduler label. I can link records by job ID; a shared service account alone cannot identify a human operator.',challenge:'A useful security control can still leave the copy route open. Check the active transfer and the relevant source record before choosing a response.'},
 {name:'Leena · Privacy counsel',opening:'Find the authorisation and the safeguards separately. A manager’s signature does not settle whether the underlying processing is defensible.',challenge:'Read the scope and timing of this record. Do not turn evidence of one purpose into permission for every other purpose.'}
 ];
 const role=roles[index]||roles[0];
 return {name:role.name,topics:[
 {id:'account',label:'What can you establish?',available:true,reply:role.opening+(pressure?' Control is watching our next call; we need to keep the investigation accountable.':'')},
 {id:'challenge',label:'Challenge the current account',available:collected.size>0,requires:'Inspect a case exhibit first.',reply:role.challenge+' '+caseLink(storyId).body},
 {id:'authorisation',label:progress.complete?'Ask about the signed approval':'Who authorised the export?',available:progress.count>0,requires:'Complete one case to recover the first cross-system match.',reply:progress.complete?'The release ledger names Veda Menon. Attribute the approval to her, then examine the processing and containment failures. Do not blame Mira or a visitor on the basis of that badge.':progress.stage>=2?MILESTONES[1].body+' The authorisation record is still being recovered.':MILESTONES[0].body+' We have a job match, not a signed authorisation yet.'}
 ]};
}
export function revealFor(log,id,totalCases){
 const progress=threadProgress(log,totalCases),results=log.map(e=>e.results.find(r=>r.id===id)).filter(Boolean),correct=results.filter(r=>r.good).length;
 const heroic=results.length>0&&correct*5>=results.length*4;
 return {heroic,progress,title:heroic?'You broke the copy chain.':'You found the signature. The copies survived.',
 beats:[
 'The badge was a false lead. The door controller recorded 00:24; the dashboard showed when that event arrived at 01:12.',
 progress.complete?'Veda Menon’s signed 00:58 release enabled Blue Lantern. The shared service account executed it at 01:16. Mira’s assumption did not authorise the job.':'The recovered trail is incomplete. Preserve the remaining records before naming an authorising person.',
 heroic?'Your defensible calls contained the source failures and protected the people behind the records. As Mumbai wakes, the uncontrolled route is closed and the approval trail is preserved.':'Unsafe calls left people exposed. The authorisation is known, but copies remain outside control. Across the water, office lights come on as the incident reaches its next recipients.'
 ],consequence:correct+' of '+results.length+' decisions defensible. '+(heroic?'Containment held; signed records are ready for an independent review.':'Containment failed; the morning team inherits an active incident.'),
 findings:progress.entries.map(e=>e.title)};
}
export const CITY_OBSERVATION={title:'The city outside, the route inside',body:'The stepped tower is Signal House, a fictional operations landmark. Beyond the older apartment blocks, the coastal road bends around the bay. Blue Lantern’s job label appears in the office relay manifest; the skyline and tower beacon are context, not proof of a recipient or a transfer. Arjun can help verify the system records. At dawn these windows will look out over the people affected by tonight’s decisions.'};
