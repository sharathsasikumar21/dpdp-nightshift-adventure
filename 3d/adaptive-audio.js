// Supplied gameplay soundtrack with adaptive effects and synth fallback. Audio is created only after a user gesture.
export class Sound{
 constructor(){this.enabled=true;this.ctx=null;this.ambient=null;this.situation={phase:'home',integrity:70,remaining:90,level:0};this.beat=0;this.next=0;}
 start(){if(!this.ctx){this.ctx=new AudioContext();this.ambient=this.ctx.createGain();this.ambient.gain.value=.016;this.ambient.connect(this.ctx.destination);this.music=this.ctx.createGain();this.music.gain.value=.075;this.music.connect(this.ctx.destination);this.scoreGain=this.ctx.createGain();this.scoreGain.gain.value=0;this.scoreGain.connect(this.ctx.destination);this.loadScore();this.filter=this.ctx.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=380;this.filter.connect(this.ambient);for(const f of [46.25,69.3,92.5]){const o=this.ctx.createOscillator();o.type='triangle';o.frequency.value=f;o.connect(this.filter);o.start();}this.next=this.ctx.currentTime;this.timer=setInterval(()=>this.schedule(),100);document.addEventListener('visibilitychange',()=>{if(document.hidden)this.ctx.suspend();else{this.next=this.ctx.currentTime;this.ctx.resume();}this.applyVolume();});}if(!document.hidden)this.ctx.resume();this.applyVolume();}
 async loadScore(){try{const response=await fetch(new URL('./media/gameplay-renith.m4a?v=renith1',import.meta.url));if(!response.ok)throw new Error('Score unavailable');const buffer=await this.ctx.decodeAudioData(await response.arrayBuffer());this.score=this.ctx.createBufferSource();this.score.buffer=buffer;this.score.loop=true;this.score.loopEnd=buffer.duration;this.score.connect(this.scoreGain);this.score.start();this.applyVolume();}catch{this.score=null;this.applyVolume();}}
 toggle(){this.enabled=!this.enabled;if(this.ctx)this.applyVolume();return this.enabled;}
 setSituation(s){this.situation=s;if(this.ctx)this.applyVolume();}
 applyVolume(){const silent=!this.enabled||this.situation.phase==='film'||document.hidden;this.ambient.gain.setTargetAtTime(silent||this.score?0:.012,this.ctx.currentTime,.3);this.scoreGain.gain.setTargetAtTime(silent||this.ctx.currentTime<(this.discoveryUntil||0)?0:(['arrival','briefing','break','end'].includes(this.situation.phase)?.09:.18),this.ctx.currentTime,.6);this.music.gain.setTargetAtTime(silent?0:(this.score? .045:.085),this.ctx.currentTime,.3);}
 tone(f,t,len,volume,type='triangle',out=this.music){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(g);g.connect(out);o.start(t);o.stop(t+len+.02);}
 schedule(){if(!this.ctx||this.ctx.state!=='running')return;const s=this.situation;if(this.next<this.ctx.currentTime-.2)this.next=this.ctx.currentTime;
 const urgent=s.phase==='decision'&&s.remaining<=15,critical=s.integrity<=30;const tense=!['break','end'].includes(s.phase);const bpm=urgent?118:critical?98:s.phase==='briefing'?86:tense?66+(s.level||0)*8:54;
 this.filter.frequency.setTargetAtTime(urgent?1100:critical?650:380,this.ctx.currentTime,.7);
 while(this.next<this.ctx.currentTime+.12){const t=this.next,n=this.beat++;
 if(this.enabled&&s.phase!=='film'){
   if(!this.score){const bass=critical?[55,58.27,55,73.42]:[55,55,82.4069,73.42];this.tone(bass[Math.floor(n/4)%4],t,.35,.34,'sine');
   if(tense){const notes=critical?[220,233.08,293.66,220]:[138.59,207.65,185,138.59,164.81,207.65,146.83,185];this.tone(notes[n%notes.length],t,.45,.1,'sine');if(n%2===0)this.tone(1800,t,.045,.025,'triangle');}
   if(tense&&n%8===0){this.tone(69.3,t,2.8,.12,'sine');this.tone(73.42,t,2.2,.045,'triangle');}
   }
   if(urgent){this.tone(60,t,.12,.45,'sine');this.tone(55,t+.12,.13,.25,'sine');}
   if(s.phase==='review'&&s.safe&&n%4===0)for(const f of [261.63,329.63,392])this.tone(f,t,1,.065,'sine');
 }
 this.next+=60/bpm/2;
 }}
 discovery(){if(!this.enabled)return;this.start();this.discoveryUntil=this.ctx.currentTime+1.8;this.applyVolume();this.spatial('clue',.15);}
 spatial(kind,pan=0){if(!this.enabled||document.hidden||this.situation.phase==='film')return;this.start();const p=this.ctx.createStereoPanner();p.pan.value=Math.max(-1,Math.min(1,pan));p.connect(this.music);const t=this.ctx.currentTime;if(kind==='phone'){this.tone(660,t,.2,.22,'sine',p);this.tone(880,t+.24,.18,.16,'sine',p);}else if(kind==='step'){this.tone(85,t,.075,.15,'triangle',p);}else if(kind==='clue'){this.tone(740,t,.7,.12,'sine',p);}else {const buffer=this.ctx.createBuffer(1,this.ctx.sampleRate*.3,this.ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/data.length*4);const noise=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),gain=this.ctx.createGain();noise.buffer=buffer;filter.type='lowpass';filter.frequency.value=kind==='rain'?1400:500;gain.gain.value=kind==='rain'?.12:.16;noise.connect(filter);filter.connect(gain);gain.connect(p);noise.start();}setTimeout(()=>p.disconnect(),1500);}
 warning(){if(!this.enabled)return;this.start();[440,330,220].forEach((f,i)=>this.tone(f,this.ctx.currentTime+i*.2,.32,.065,'triangle',this.ctx.destination));}
 cue(good=true){if(!this.enabled)return;this.start();[good?523:170,good?659:130,good?784:85].forEach((f,i)=>this.tone(f,this.ctx.currentTime+i*.09,.2,.045,'triangle',this.ctx.destination));}
}
