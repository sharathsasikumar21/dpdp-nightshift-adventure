const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function playMysteryReveal(summary,{signal}={}){
 return new Promise(resolve=>{
  if(signal?.aborted){resolve();return;}const dialog=document.createElement('dialog');dialog.className='mystery-reveal '+(summary.heroic?'heroic':'dark');dialog.setAttribute('aria-label','Midnight export final reveal');
  dialog.innerHTML='<div class="reveal-letterbox"><span class="eyebrow">05:58 / BLUE LANTERN · FINAL FINDINGS</span><h2>'+esc(summary.title)+'</h2><p class="reveal-beat" aria-live="polite"></p><div class="reveal-timeline"><span>00:24 / DOOR EVENT</span><span>00:58 / SIGNED RELEASE</span><span>01:16 / EXPORT</span></div><p class="reveal-result">'+esc(summary.consequence)+'</p><button class="small">CONTINUE TO ENDING →</button></div>';
  let done=false,beat=-1;const started=performance.now();
  function close(){if(done)return;done=true;clearInterval(timer);signal?.removeEventListener('abort',close);dialog.close();dialog.remove();resolve();}
  function tick(){const age=(performance.now()-started)/1000,index=Math.min(2,Math.floor(age/4));if(index!==beat){dialog.querySelector('.reveal-beat').textContent=summary.beats[index];beat=index;}if(age>=12)close();}
  const timer=setInterval(tick,100);dialog.querySelector('button').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});signal?.addEventListener('abort',close,{once:true});document.body.append(dialog);dialog.showModal();dialog.querySelector('button').focus();tick();
 });
}
