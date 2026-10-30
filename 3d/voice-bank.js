export function chooseVoice(clips,previous,random=Math.random){
 const choices=clips.filter(clip=>clip.id!==previous),pool=choices.length?choices:clips;
 return pool[Math.min(pool.length-1,Math.max(0,Math.floor(random()*pool.length)))];
}

// Speech is prerecorded and loaded only when needed. No runtime model, API,
// queue of stale dialogue, or subtitle overlay is involved.
export class VoiceBank{
 constructor({clips,Audio=globalThis.Audio,isAllowed=()=>true,onActive=()=>{},random=Math.random,now=Date.now}){
  Object.assign(this,{clips,Audio,isAllowed,onActive,random,now});this.audio=null;this.generation=0;this.last=new Map();this.active=false;
 }
 setActive(value){if(this.active===value)return;this.active=value;this.onActive(value);}
 stop(){
  this.generation++;const audio=this.audio;this.audio=null;
  if(audio){audio.onended=audio.onerror=audio.onplaying=null;audio.pause();audio.removeAttribute?.('src');audio.load?.();}
  this.setActive(false);
 }
 async play(group,{priority=false,cooldown=12000}={}){
  const clips=this.clips[group],last=this.last.get(group),now=this.now();
  if(!this.Audio||!clips?.length||!this.isAllowed()||(this.audio&&!priority)||(last&&now-last.at<cooldown))return false;
  const clip=chooseVoice(clips,last?.id,this.random);this.stop();const token=this.generation;
  const audio=new this.Audio(new URL(clip.src,import.meta.url).href);this.audio=audio;audio.preload='auto';audio.volume=.85;
  this.last.set(group,{id:clip.id,at:now});
  const current=()=>this.generation===token&&this.audio===audio;
  audio.onplaying=()=>{if(current())this.setActive(true);};
  audio.onended=audio.onerror=()=>{if(current())this.stop();};
  try{await audio.play();if(!current()){audio.pause();return false;}this.setActive(true);return true;}
  catch{if(current())this.stop();return false;}
 }
}
