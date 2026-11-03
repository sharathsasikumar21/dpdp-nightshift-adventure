import {STAFF} from './staff-data.js';
import {workingFinding,findingLabel} from './working-findings.js';
import {dossiers} from './case-content.js';
import {evidenceInsight} from './evidence-insights.js';
import {crewReaction} from './companion-story.js';
export function caseCrewReaction(stories,state,playerId,index,collected){
 const storyIndex=state.route[Math.min(Math.floor(state.turn/3),state.route.length-1)],story=stories[storyIndex];
 const reaction=crewReaction(stories,state.log,playerId,index),sourceIndex=[...collected].at(-1),source=dossiers[story.id]?.clues[sourceIndex],insight=evidenceInsight(story.id,sourceIndex);
 const call=state.log.filter(e=>e.story===storyIndex&&e.results.some(r=>r.id===playerId)).at(-1),result=call?.results.find(r=>r.id===playerId),scene=call?story.scenes[call.scene]:null;
 const evidence=source?[
 'In '+story.title+', '+source[0]+' is our concrete source: '+insight.establishes+' '+insight.verify,
 source[0]+' gives us something to trace in '+story.title+'. '+insight.limit+' I will keep the original record intact while we verify its reach.',
 'For '+story.title+', keep the scope of '+source[0]+' precise. '+insight.limit+' A source observation and a legal conclusion are separate findings.'
 ][index]:'We have not inspected a case record for '+story.title+' yet. Bring the originals to this conversation before we settle on an explanation.';
 const decision=scene?' Last decision: '+scene.tag+'. '+(result.good?'That call held a safeguard: '+scene.good:'That call left a safeguard unresolved: '+scene.effect):' We have not recorded a decision on this case yet.';
 const finding=source?workingFinding(state,story.id,sourceIndex):null;return {...reaction,line:evidence+decision+(finding?' Your working finding is marked '+findingLabel(finding.status)+': '+finding.claim+' We still need to verify it against the sources.':'')};
}
export function closingConversation(report){
 const strong=report.decisions.filter(d=>d.good).at(-1),risk=report.followUp[0];
 return [
 {speaker:'Mira · Incident analyst',text:strong?'The call I would highlight is '+strong.topic+' in '+strong.story+'. '+strong.effect:'I cannot point to a defensible call tonight. We still have the original records to learn from; let us make the handover honest.'},
 {speaker:'Arjun · Security engineer',text:risk?'My first handover priority is '+risk.topic+' in '+risk.story+'. '+risk.effect:'Every recorded call held its safeguard. I will hand over the preserved source trail and verify the recorded controls with the morning team.'},
 {speaker:'Leena · Privacy counsel',text:risk?'The safer follow-up is: '+risk.next+' A requested correction is not proof that it has been completed.':'Keep the distinction clear: a defensible in-game decision does not replace verification of the actual systems, recipients and outstanding facts.'},
 {speaker:'Sharath · Incident commander',text:(risk?STAFF.find(p=>p.id==='sharath').bad:STAFF.find(p=>p.id==='sharath').good)+' The morning handover records '+report.decisions.length+' decisions and '+report.followUp.length+' unresolved safeguards.'},
 {speaker:'Simon Ghost Riley · DPO',text:risk?'Put the unresolved safeguard and its source in the handover. We know what needs checking next.':'Record the evidence, the decisions and what still needs verification. The next team gets the full picture.'}
 ];
}
