export class Sound{
 constructor(){this.enabled=true;this.ctx=null;this.ambient=null;}
 start(){if(!this.ctx){this.ctx=new AudioContext();const g=this.ctx.createGain();g.gain.value=.016;g.connect(this.ctx.destination);this.ambient=g;for(const f of [55,82.4,110]){const o=this.ctx.createOscillator();o.type='sine';o.frequency.value=f;o.connect(g);o.start();}}this.ctx.resume();this.ambient.gain.value=this.enabled?.016:0;}
 toggle(){this.enabled=!this.enabled;if(this.ctx)this.ambient.gain.value=this.enabled?.016:0;return this.enabled;}
 cue(good=true){if(!this.enabled)return;this.start();[good?523:170,good?659:130,good?784:85].forEach((f,i)=>{const o=this.ctx.createOscillator(),g=this.ctx.createGain(),t=this.ctx.currentTime+i*.09;o.type=good?'triangle':'sawtooth';o.frequency.value=f;g.gain.setValueAtTime(.045,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(this.ctx.destination);o.start(t);o.stop(t+.22);});}
}
