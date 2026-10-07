export const MAX_DECISIONS=15;
export const levels=['Desk Rookie','Consent Detective','Incident Commander','Privacy Sentinel','Nightshift Legend'];
export const levelFor=p=>levels[Math.min(4,Math.floor(Math.max(0,p)/350))];
export function selectStories(stories,histories,count=3,random=Math.random){
  // Least-played by this group first; randomise ties. A completed cycle remains replayable.
  return stories.map((s,i)=>({i,n:histories.reduce((n,h)=>n+(h.includes(s.id)?1:0),0),r:random()})).sort((a,b)=>a.n-b.n||a.r-b.r).slice(0,Math.min(5,count,stories.length)).map(x=>x.i);
}
export function createRun(stories,route,players,id){
  if(!route.length||route.length>5||new Set(route).size!==route.length||route.some(i=>!stories[i]))throw Error('Invalid route');
  if(!players.length||players.length>3||new Set(players.map(p=>p.id)).size!==players.length)throw Error('Invalid crew');
  return {id,rev:0,phase:'explore',route,turn:0,deadline:0,locks:{},ready:[],players:players.map(p=>({...p,points:0,integrity:70,streak:0,best:0,correct:0})),log:[]};
}
export const sceneFor=(s,stories)=>stories[s.route[Math.floor(s.turn/3)]].scenes[s.turn%3];
export function openTurn(s,now){if(s.phase!=='explore')return false;s.phase='decision';s.deadline=now+60000;s.locks={};s.rev++;return true;}
export function submit(s,id,choice,now){
  if(s.phase!=='decision'||now>=s.deadline||!s.players.some(p=>p.id===id)||Object.hasOwn(s.locks,id)||!Number.isInteger(choice)||choice<0||choice>3)return false;
  s.locks[id]=choice;s.rev++;return true;
}
export function resolve(s,stories,now){
  if(s.phase!=='decision'||(now<s.deadline&&s.players.some(p=>!Object.hasOwn(s.locks,p.id))))return false;
  const scene=sceneFor(s,stories),results=s.players.map(p=>{
    const choice=s.locks[p.id]??-1,good=choice===0,delta=good?100+(p.streak>=2?25:0):-40;
    p.points=Math.max(0,p.points+delta);p.integrity=Math.max(0,Math.min(100,p.integrity+(good?8:-14)));p.streak=good?p.streak+1:0;p.best=Math.max(p.best,p.streak);p.correct+=Number(good);
    return {id:p.id,alias:p.alias,choice,good,delta,timeout:choice===-1};
  });
  s.log.push({turn:s.turn,story:s.route[Math.floor(s.turn/3)],scene:s.turn%3,results});s.phase='review';s.ready=[];s.rev++;return true;
}
export function advance(s,id){
  if(!['review','break'].includes(s.phase)||!s.players.some(p=>p.id===id))return false;
  if(!s.ready.includes(id)){s.ready.push(id);s.rev++;}
  if(s.ready.length<s.players.length)return true;
  s.ready=[];
  if(s.phase==='break'){s.phase='explore';s.rev++;return true;}
  s.turn++;s.phase=s.turn>=Math.min(MAX_DECISIONS,s.route.length*3)?'end':s.turn%3===0?'break':'explore';s.rev++;return true;
}
