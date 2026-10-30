import {renderIntroCard,animateIntroCard} from './intro-card.js';
export const ARRIVAL_SECONDS=14;
export function arrivalState(seconds){
 const t=Math.max(0,Math.min(ARRIVAL_SECONDS,seconds));
 const smooth=x=>x*x*(3-2*x);
 return {floor:Math.min(47,29+Math.floor(Math.min(1,t/9)*18)),doors:smooth(Math.max(0,Math.min(1,(t-9.5)/2))),walk:smooth(Math.max(0,Math.min(1,(t-11.5)/2.5))),beat:t<4?0:t<9?1:2,done:t>=ARRIVAL_SECONDS};
}

// Original real-time introduction: the player is the appointed DPO, arriving for a night shift.
export function playArrival({world,onFinish=()=>{},onSoundChange=()=>{},autoplay=false,soundEnabled=true}={}){
 const el=document.createElement('dialog');el.className='arrival';el.setAttribute('aria-label','Elevator arrival — Ghost introduction');
 el.innerHTML=`<section class="opening-title" aria-label="Ghost Shift: Midnight Breach opening credits"><span class="eyebrow">SHA/020 · NIKS/141 · RIP/911 PRESENT</span><h2>GHOST SHIFT</h2><p>MIDNIGHT BREACH</p><small>POWERED BY THREE.JS · RAPIER · MICROSOFT ROCKETBOX<br>Google Fonts · Hosted on Cloudflare Pages</small></section><div class="arrival-top"><span>MERIDIAN DATAWORKS · NARIMAN POINT, MUMBAI · 02:17 AM</span><button class="small arrival-skip">SKIP · ENTER OFFICE →</button></div><div class="arrival-floor"><span>OPERATIONS</span><b>29</b><span class="arrival-direction">↑ ASCENDING</span></div><div class="arrival-caption"><span class="eyebrow">MERIDIAN DATAWORKS · TASKFORCE 141 / CODENAME</span><h1>TASKFORCE 141</h1><div class="arrival-track"><i></i></div><div class="arrival-bottom"><span class="arrival-count"></span><button class="primary arrival-audio">ENTER SHIFT · SOUND ON</button></div></div>`;
 const lines=['Priority call · Incident Operations','Identity verified. Destination: Incident Operations.','Floor 47. Doors opening.'];
 let introTimer=null,introTyping=null;let finished=false,briefing=false,lastBeat=-1,chimed=false,ctx=null,gain=null,oscillators=[],soundOn=false;
 function visibility(){if(ctx){if(document.hidden)ctx.suspend();else if(soundOn)ctx.resume();}}document.addEventListener('visibilitychange',visibility);
 function firstGesture(e){if(briefing||finished)return;if(e.target.closest?.('.arrival-skip,.arrival-audio'))return;if(started===null)enableSound();el.removeEventListener('pointerdown',firstGesture);el.removeEventListener('keydown',firstGesture);}
 el.addEventListener('pointerdown',firstGesture);el.addEventListener('keydown',firstGesture);
 let started=null;world?.startArrival();document.body.classList.add('arrival-active');document.body.append(el);el.showModal();
 function stopAudio(){if(ctx){gain.gain.cancelScheduledValues(ctx.currentTime);gain.gain.setTargetAtTime(0,ctx.currentTime,.05);const old=ctx;setTimeout(()=>old.close().catch(()=>{}),180);ctx=null;}oscillators=[];}
 function enableSound(){if(soundOn){soundOn=false;onSoundChange(false);stopAudio();el.querySelector('.arrival-audio').textContent='ENABLE MUSIC';return;}soundOn=true;onSoundChange(true);if(started===null)started=performance.now();ctx=new AudioContext();gain=ctx.createGain();gain.gain.value=.008;gain.connect(ctx.destination);for(const f of [48,72,96]){const o=ctx.createOscillator();o.type='sine';o.frequency.value=f;o.connect(gain);o.start();oscillators.push(o);}ctx.resume();el.querySelector('.arrival-audio').textContent='MUTE MUSIC';}
 function dismiss(){if(finished)return;finished=true;clearTimeout(introTimer);introTyping?.cancel();document.removeEventListener('visibilitychange',visibility);stopAudio();el.close();el.remove();document.body.classList.remove('arrival-active');onFinish();}
 function finish(){if(finished||briefing)return;briefing=true;clearInterval(timer);stopAudio();world?.endArrival();el.classList.add('arrival-objective');el.setAttribute('aria-label','Mission objective — inside Incident Operations');el.innerHTML=renderIntroCard();introTyping=animateIntroCard(el,{reduced:matchMedia('(prefers-reduced-motion: reduce)').matches});const begin=el.querySelector('.arrival-begin');begin.onclick=dismiss;el.tabIndex=-1;el.focus();introTimer=setTimeout(()=>{if(finished)return;introTyping.complete();el.querySelector('.arrival-intro').dataset.introReady='true';begin.disabled=false;begin.focus({preventScroll:true});},matchMedia('(prefers-reduced-motion: reduce)').matches?0:3700);}

 function tick(){const elapsed=started===null?0:(performance.now()-started)/1000,s=arrivalState(elapsed);world?.arrivalProgress(elapsed);el.querySelector(".opening-title").hidden=elapsed>=3.2;el.querySelector('.arrival-floor b').textContent=String(s.floor).padStart(2,'0');el.querySelector('.arrival-direction').textContent=elapsed>=9.5?'● ARRIVED':'↑ ASCENDING';el.querySelector('.arrival-track i').style.transform=`scaleX(${Math.min(1,elapsed/ARRIVAL_SECONDS)})`;el.querySelector('.arrival-count').textContent=`${Math.max(0,Math.ceil(ARRIVAL_SECONDS-elapsed))}s · YOUR SHIFT STARTS HERE`;
  if(elapsed>=9.5&&!chimed){chimed=true;if(ctx){gain.gain.setTargetAtTime(.003,ctx.currentTime,.5);for(const [i,f] of [659.25,523.25].entries()){const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+i*.28;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.055,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.9);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+1);}}}
  if(s.done)finish();
 }
 const timer=setInterval(tick,80);el.querySelector('.arrival-skip').onclick=finish;el.querySelector('.arrival-audio').onclick=enableSound;el.addEventListener('cancel',e=>{e.preventDefault();if(briefing)dismiss();else finish();});el.querySelector('.arrival-audio').focus();tick();if(autoplay){if(soundEnabled)enableSound();else started=performance.now();}return finish;
}
