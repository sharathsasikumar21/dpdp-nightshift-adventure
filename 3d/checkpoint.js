export const CHECKPOINT_KEY='ghostshift-solo-checkpoint-v1';
export function makeCheckpoint(state,{floor=47,opening=[],evidence=[]}={}){
 if(!state||state.players?.length!==1||state.phase!=='break'||state.turn<3||state.turn%3!==0||state.log.length!==state.turn)return null;
 return {version:1,savedAt:Date.now(),floor,opening:[...opening],evidence:[...evidence].map(([key,set])=>[key,[...set]]),state:JSON.parse(JSON.stringify(state))};
}
export function validateCheckpoint(value){
 const s=value?.state;
 return value?.version===1&&s?.phase==='break'&&Array.isArray(s.route)&&[2,3,5].includes(s.route.length)&&new Set(s.route).size===s.route.length&&s.route.every(i=>Number.isInteger(i)&&i>=0&&i<10)&&Number.isInteger(s.turn)&&s.turn>=3&&s.turn<s.route.length*3&&s.turn%3===0&&Array.isArray(s.log)&&s.log.length===s.turn&&s.log.every((e,i)=>e.turn===i&&e.story===s.route[Math.floor(i/3)]&&e.scene===i%3&&e.results?.length===1&&typeof e.results[0].good==='boolean')&&s.players?.length===1&&['points','integrity','streak','best','correct'].every(k=>Number.isFinite(s.players[0][k])&&s.players[0][k]>=0)&&s.players[0].integrity<=100&&s.players[0].correct<=s.turn&&[47,48,49,50].includes(value.floor)&&Array.isArray(value.opening)&&value.opening.every(i=>[0,1,2].includes(i))&&Array.isArray(value.evidence)&&value.evidence.every(e=>Array.isArray(e)&&typeof e[0]==='string'&&Array.isArray(e[1])&&e[1].every(i=>[0,1,2].includes(i)));
}
export function restoreCheckpoint(value,playerId,runId){
 if(!validateCheckpoint(value))return null;
 const copy=JSON.parse(JSON.stringify(value)),oldId=copy.state.id;
 copy.state.id=runId;copy.state.players[0].id=playerId;copy.state.players[0].alias='You';copy.state.ready=[];copy.state.locks={};copy.state.deadline=0;
 for(const e of copy.state.log){e.results[0].id=playerId;e.results[0].alias='You';}
 copy.evidence=copy.evidence.map(([key,values])=>[key.startsWith(oldId+':')?runId+key.slice(oldId.length):key,values]);
 return copy;
}
