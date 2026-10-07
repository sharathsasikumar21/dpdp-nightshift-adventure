export function riskFor(log, id, integrity) {
  let consecutive=0;
  for(let i=log.length-1;i>=0;i--){const result=log[i].results.find(r=>r.id===id);if(!result||result.good)break;consecutive++;}
  const severity=integrity<=30||consecutive>=3?'critical':consecutive>=2?'escalated':'warning';
  return {consecutive,severity,title:severity==='critical'?'CRITICAL · PEOPLE ARE AT RISK':severity==='escalated'?'ESCALATION · REPEATED UNSAFE CALLS':'WARNING · UNSAFE DECISION',
    guidance:severity==='critical'?'Integrity is at risk. Read the evidence and the safer response before your next call.':severity==='escalated'?'Two or more unsafe calls in a row. Slow down and check the evidence and the required safeguards.':'This choice has a consequence. Review the harm and the safer response before continuing.'};
}

// Compare the exact fraction: a rounded 80% display must never grant the good ending.
export function endingFor(correct,total){
  return total>0&&correct*5>=total*4?'good-ending':'bad-ending';
}
