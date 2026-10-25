export const LIFT_CALL='Ghost. Urgent situation. Reach the Incident Operations Room immediately. Control out.';

// Reused ElevenLabs Sarah recording; device speech is only a load-failure fallback.
export function createLiftRadio({speech=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,Audio=globalThis.Audio}={}){
 let active=false,utterance=null,generation=0;const recording=Audio?new Audio(new URL('./media/dispatch.mp3',import.meta.url)):null;if(recording){recording.preload='auto';recording.volume=.85;}
 function stop(){generation++;if(recording){recording.pause();recording.currentTime=0;}if(active)speech?.cancel();active=false;utterance=null;}
 function play(context){
  stop();
  if(context){
   const now=context.currentTime;
   // A short, band-limited radio squelch and two dispatch tones.
   const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*.32),context.sampleRate);
   const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
   const noise=context.createBufferSource(),filter=context.createBiquadFilter(),volume=context.createGain();
   noise.buffer=buffer;filter.type='bandpass';filter.frequency.value=1800;filter.Q.value=.8;volume.gain.value=.055;
   noise.connect(filter);filter.connect(volume);volume.connect(context.destination);noise.start(now);
   for(const [i,f] of [880,1175].entries()){const tone=context.createOscillator(),gain=context.createGain(),t=now+i*.12;tone.frequency.value=f;gain.gain.setValueAtTime(.025,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.1);tone.connect(gain);gain.connect(context.destination);tone.start(t);tone.stop(t+.12);}
  }
  if(recording){const token=generation;recording.play().catch(()=>{if(token===generation)speak();});return true;}return speak();
 }
 function speak(){
  if(!speech||!Utterance)return false;
  utterance=new Utterance(LIFT_CALL);utterance.lang='en-IN';utterance.rate=1.12;utterance.pitch=.85;utterance.volume=.9;
  const voices=speech.getVoices();utterance.voice=voices.find(v=>v.lang==='en-IN')||voices.find(v=>/^en[-_]/i.test(v.lang))||null;
  active=true;utterance.onend=utterance.onerror=()=>{active=false;};speech.speak(utterance);return true;
 }
 return {play,stop};
}
