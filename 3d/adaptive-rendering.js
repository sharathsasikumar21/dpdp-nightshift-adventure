// Render resolution is independent of High/Low FX. Slow hardware retains the
// lighting features, while the HTML interface always stays at display resolution.
export function createRenderBudget(){
 let scale=1,sample=0,frames=0,cooldown=2;
 return {reset(value=1){scale=value;sample=0;frames=0;cooldown=2;},update(dt,active=true){if(!active||!Number.isFinite(dt)||dt<=0||dt>.25){sample=0;frames=0;return scale;}sample+=dt;frames++;cooldown-=dt;if(sample<1||cooldown>0)return scale;const average=sample/frames;if(average>1/34){scale=Math.max(.66,scale-(average>.06?.14:.08));cooldown=1.5;}else if(average<1/62){scale=Math.min(1,scale+.04);cooldown=5;}sample=0;frames=0;return scale;},get scale(){return scale;}};
}
