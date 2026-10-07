// Self-contained films: never own game state, multiplayer clocks or player data.
export function playCinematic(kind, {muted=true, onStart=()=>{}, onFinish=()=>{}}={}) {
  if (!['opening','credits'].includes(kind)) return Promise.resolve();
  return new Promise(resolve => {
    const previous=document.activeElement;
    const dialog=document.createElement('dialog');
    dialog.className='cinema';
    dialog.setAttribute('aria-label',kind==='opening'?'Nightshift opening film':'Nightshift team credits');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    dialog.innerHTML=`<div class="cinema-stage"><video playsinline preload="auto" poster="media/${kind}-poster.jpg" aria-label="${kind==='opening'?'Rainy city skyline. The city never stops. Neither does its data. Tonight, the next call is yours. DPDP Nightshift. Follow the data. Protect the people.':'The city can breathe. For now. The team behind the Nightshift: Rips, Niks and SharkBytes. Thank you for playing.'}"></video><div class="cinema-top"><span>${kind==='opening'?'N / INCOMING TRANSMISSION':'N / END CREDITS'} · 14 SECONDS</span><button class="small cinema-skip">SKIP ${kind==='opening'?'INTRO':'CREDITS'} →</button></div><div class="cinema-bottom"><button class="small cinema-play">PLAY FILM</button><span class="cinema-status" role="status">${reduced?'Reduced motion is on. Play this film or skip to continue.':'Loading film…'}</span><button class="small cinema-sound">${muted?'ENABLE SOUND':'MUTE FILM'}</button></div><div class="cinema-progress" aria-hidden="true"><i></i></div></div>`;
    const video=dialog.querySelector('video'), play=dialog.querySelector('.cinema-play'), status=dialog.querySelector('.cinema-status'), audio=dialog.querySelector('.cinema-sound');
    let done=false, watchdog;
    function finish(){
      if(done)return;done=true;clearTimeout(watchdog);video.pause();video.removeAttribute('src');video.load();dialog.close();dialog.remove();
      onFinish();if(previous?.isConnected)previous.focus({preventScroll:true});resolve();
    }
    async function start(){
      if(done)return;
      clearTimeout(watchdog);watchdog=setTimeout(finish,15000);
      try { await video.play(); if(done)return;play.hidden=true;status.textContent=kind==='opening'?'Your shift starts at 01:17.':'Rips · Niks · SharkBytes'; }
      catch {if(!done){play.hidden=false;status.textContent='Press Play film, or skip to continue.';}}
    }
    dialog.querySelector('.cinema-skip').onclick=finish;
    dialog.addEventListener('cancel',e=>{e.preventDefault();finish();});
    play.onclick=start;
    audio.onclick=()=>{video.muted=!video.muted;audio.textContent=video.muted?'ENABLE SOUND':'MUTE FILM';};
    video.muted=muted;video.src=`media/${kind}.mp4`;
    video.onended=finish;
    video.onerror=finish;
    video.ontimeupdate=()=>{dialog.querySelector('.cinema-progress i').style.transform=`scaleX(${Math.min(1,video.currentTime/14)})`;if(video.currentTime>=14)finish();};
    document.body.append(dialog);dialog.showModal();onStart();
    dialog.querySelector('.cinema-skip').focus();
    if(!reduced)start();
  });
}
