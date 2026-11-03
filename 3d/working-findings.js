export const FINDING_STATUSES=['not-established','supported','contradicted'];
export function workingFinding(state,caseId,index){return state.workingFindings?.[caseId]?.[index]||null;}
export function saveWorkingFinding(state,caseId,index,claim,status,collected){
 const text=String(claim).trim().slice(0,200);
 if(!caseId||!Number.isInteger(index)||index<0||index>2||!collected.has(index)||!text||!FINDING_STATUSES.includes(status))return false;
 state.workingFindings??={};state.workingFindings[caseId]??={};state.workingFindings[caseId][index]={claim:text,status};return true;
}
export function findingLabel(status){return {'not-established':'Not established',supported:'Supported',contradicted:'Contradicted'}[status]||'Not established';}
