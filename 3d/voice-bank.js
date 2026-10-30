export const isBanter=clip=>!!clip&&(clip.banter===true||clip.id.includes("-banter-"));
export function chooseVoice(clips,previous,random=Math.random){
 const choices=clips.filter(clip=>clip.id!==previous),pool=choices.length?choices:clips;
 return pool[Math.min(pool.length-1,Math.max(0,Math.floor(random()*pool.length)))];
}

// Speech is prerecorded and loaded only when needed. No runtime model, API,
// queue of stale dialogue is involved. Captions follow actual speech playback.
export class VoiceBank{
 constructor({clips,Audio=globalThis.Audio,isAllowed=()=>true,onActive=()=>{},onCaption=()=>{},getBanter=()=>true,random=Math.random,now=Date.now}){
  Object.assign(this,{clips,Audio,isAllowed,onActive,onCaption,getBanter,random,now});this.audio=null;this.clip=null;this.generation=0;this.last=new Map();this.active=false;
 }
 setActive(value){if(this.active===value)return;this.active=value;this.onActive(value);}
 stop(){
  this.generation++;const audio=this.audio;this.audio=null;this.clip=null;
  if(audio){audio.onended=audio.onerror=audio.onplaying=null;audio.pause();audio.removeAttribute?.('src');audio.load?.();}
  this.onCaption(null);this.setActive(false);
 }
 playExchange(groups,{canContinue=()=>true}={}){
  if(this.audio||!canContinue()||!groups.length)return Promise.resolve(false);
  const next=i=>{if(i>=groups.length||!canContinue())return;return this.play(groups[i],{cooldown:0,onComplete:()=>next(i+1)});};
  return next(0);
 }
 stopBanter(){if(isBanter(this.clip))this.stop();}
 async play(group,{priority=false,cooldown=12000,onComplete=()=>{}}={}){
  const clips=this.clips[group]?.filter(c=>this.getBanter()||!isBanter(c)),last=this.last.get(group),now=this.now();
  if(!this.Audio||!clips?.length||!this.isAllowed()||(this.audio&&!priority)||(last&&now-last.at<cooldown))return false;
  const clip=chooseVoice(clips,last?.id,this.random);this.stop();const token=this.generation;
  const audio=new this.Audio(new URL(clip.src,import.meta.url).href);this.audio=audio;this.clip=clip;audio.preload='auto';audio.volume=.85;
  this.last.set(group,{id:clip.id,at:now});
  const current=()=>this.generation===token&&this.audio===audio;
  const started=()=>{if(current()){this.setActive(true);this.onCaption(clip);}};audio.onplaying=started;
  audio.onended=()=>{if(current()){this.stop();onComplete();}};audio.onerror=()=>{if(current())this.stop();};
  try{await audio.play();if(!current()){audio.pause();return false;}started();return true;}
  catch{if(current())this.stop();return false;}
 }
}
