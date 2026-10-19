export const ARRIVAL_SECONDS=14;
export function arrivalState(seconds){
 const t=Math.max(0,Math.min(ARRIVAL_SECONDS,seconds));
 const smooth=x=>x*x*(3-2*x);
 return {floor:Math.min(27,9+Math.floor(Math.min(1,t/9)*18)),doors:smooth(Math.max(0,Math.min(1,(t-9.5)/2))),walk:smooth(Math.max(0,Math.min(1,(t-11.5)/2.5))),beat:t<4?0:t<9?1:2,done:t>=ARRIVAL_SECONDS};
}

// Original real-time introduction: the player is the appointed DPO, arriving for a night shift.
export function playArrival({world,onFinish=()=>{}}={}){
 const el=document.createElement('dialog');el.className='arrival';el.setAttribute('aria-label','Elevator arrival — DPO introduction');
 el.innerHTML=`<div class="arrival-top"><span>N / NIGHTSHIFT · 01:17 AM</span><button class="small arrival-skip">SKIP · ENTER OFFICE →</button></div><div class="arrival-floor"><span>OPERATIONS</span><b>09</b><span class="arrival-direction">↑ ASCENDING</span></div><div class="arrival-caption"><span class="eyebrow">SHARKBYTES / DATA PROTECTION OFFICER</span><h1>SHARKBYTES</h1><p class="arrival-line" role="status"></p><div class="arrival-track"><i></i></div><div class="arrival-bottom"><span class="arrival-count"></span><button class="small arrival-audio">ENABLE ELEVATOR SOUND</button></div></div>`;
 const lines=['You are SharkBytes, the Data Protection Officer. Tonight, the decisions reach your desk.','An export ran at 01:16. Nobody on the night crew admits authorising it.','Floor 27. Follow the evidence. Protect the people behind the records.'];
 let finished=false,lastBeat=-1,chimed=false,ctx=null,gain=null,oscillators=[],soundOn=false;
 const started=performance.now();world?.startArrival();document.body.classList.add('arrival-active');document.body.append(el);el.showModal();
 function stopAudio(){if(ctx){gain.gain.cancelScheduledValues(ctx.currentTime);gain.gain.setTargetAtTime(0,ctx.currentTime,.05);const old=ctx;setTimeout(()=>old.close().catch(()=>{}),180);ctx=null;}oscillators=[];}
 function enableSound(){if(soundOn){soundOn=false;stopAudio();el.querySelector('.arrival-audio').textContent='ENABLE ELEVATOR SOUND';return;}soundOn=true;ctx=new AudioContext();gain=ctx.createGain();gain.gain.value=.025;gain.connect(ctx.destination);for(const f of [48,72,96]){const o=ctx.createOscillator();o.type='sine';o.frequency.value=f;o.connect(gain);o.start();oscillators.push(o);}ctx.resume();el.querySelector('.arrival-audio').textContent='MUTE ELEVATOR SOUND';}
 function finish(){if(finished)return;finished=true;clearInterval(timer);stopAudio();el.close();el.remove();document.body.classList.remove('arrival-active');world?.endArrival();onFinish();}
 function tick(){const elapsed=(performance.now()-started)/1000,s=arrivalState(elapsed);world?.arrivalProgress(elapsed);el.querySelector('.arrival-floor b').textContent=String(s.floor).padStart(2,'0');el.querySelector('.arrival-direction').textContent=elapsed>=9.5?'● ARRIVED':'↑ ASCENDING';if(lastBeat!==s.beat){el.querySelector('.arrival-line').textContent=lines[s.beat];lastBeat=s.beat;}el.querySelector('.arrival-track i').style.transform=`scaleX(${Math.min(1,elapsed/ARRIVAL_SECONDS)})`;el.querySelector('.arrival-count').textContent=`${Math.max(0,Math.ceil(ARRIVAL_SECONDS-elapsed))}s · YOUR SHIFT STARTS HERE`;
  if(elapsed>=9.5&&!chimed){chimed=true;if(ctx){gain.gain.setTargetAtTime(.003,ctx.currentTime,.5);for(const [i,f] of [659.25,523.25].entries()){const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+i*.28;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.055,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.9);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+1);}}}
  if(s.done)finish();
 }
 const timer=setInterval(tick,80);el.querySelector('.arrival-skip').onclick=finish;el.querySelector('.arrival-audio').onclick=enableSound;el.addEventListener('cancel',e=>{e.preventDefault();finish();});el.querySelector('.arrival-skip').focus();tick();return finish;
}
