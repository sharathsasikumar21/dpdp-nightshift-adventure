export const DECISION_SECONDS=50;
export const decisionSeconds=()=>DECISION_SECONDS;
export function decisionNotice(turn,total,timed=true){
 return timed?'You have 50 seconds to make this decision. Every timed question uses the same limit. The countdown starts only when you choose Start question & timer.':'Untimed shift: investigate and decide at your own pace.';
}
