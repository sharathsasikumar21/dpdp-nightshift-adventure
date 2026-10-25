// The caller owns the audio context; a generation token prevents late loads
// from restarting music after mute, skip or completion.
export function createIntroScore({fetchAudio=globalThis.fetch}={}){
 let generation=0,source=null,gain=null;
 function stop(){generation++;if(source){try{source.stop();}catch{}source.disconnect();source=null;}gain?.disconnect();gain=null;}
 async function play(context,elapsed=()=>0){
  stop();const token=generation;
  try{
   const response=await fetchAudio(new URL('./media/elevator-title.mp3',import.meta.url));
   if(!response.ok)throw Error('Intro score unavailable');
   const buffer=await context.decodeAudioData(await response.arrayBuffer());
   if(token!==generation||context.state==='closed')return false;
   const offset=Math.max(0,elapsed());if(offset>=Math.min(14,buffer.duration))return false;
   gain=context.createGain();gain.connect(context.destination);
   const now=context.currentTime;gain.gain.setValueAtTime(0,now);
   gain.gain.linearRampToValueAtTime(.12,now+.25);
   // Quiet bed under the seven-second Control dispatch.
   gain.gain.setTargetAtTime(.25,now+7.5,.6);
   const fadeAt=now+Math.max(.3,13-offset);
   gain.gain.setTargetAtTime(0,fadeAt,.3);
   source=context.createBufferSource();source.buffer=buffer;source.connect(gain);source.start(0,offset);return true;
  }catch{return false;}
 }
 return {play,stop};
}
