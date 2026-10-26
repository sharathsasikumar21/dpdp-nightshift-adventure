// Self-contained films: never own game state, multiplayer clocks or player data.
export function playCinematic(kind, {muted=true, onStart=()=>{}, onFinish=()=>{},signal}={}) {
  const films={
    opening:{title:'Ghost Shift opening film',heading:'INCOMING TRANSMISSION',skip:'INTRO',status:'Your shift starts at 02:17.',description:'Rainy city skyline. The city never stops. Neither does its data. Tonight, the next call is yours. Ghost Shift: Midnight Breach. Follow the data. Protect the people.'},
    credits:{title:'Ghost Shift team credits',heading:'END CREDITS',skip:'CREDITS',status:'SHA/020 · Niks/141 · Rip/911',description:'The team behind the Ghost Shift: SHA/020, Niks/141 and Rip/911. Thank you for playing.'},
    'good-ending':{title:'Heroic ending: city protected',heading:'HEROIC ENDING',skip:'ENDING',status:'80% or more correct · City protected',description:'A shield rises over the city at dawn. You held the line. The city wakes safer. Privacy Sentinel. Trust defended.'},
    'bad-ending':{title:'Scary ending: trust went dark',heading:'DARK ENDING',skip:'ENDING',status:'Below 80% correct · Review your calls',description:'A red surveillance eye looms over a dark city. The leak did not stop. Trust went dark. The night is not over. Review your calls. Come back ready.'}
  };
  const film=films[kind];if(!film||signal?.aborted)return Promise.resolve();
  return new Promise(resolve => {
    const previous=document.activeElement;
    const dialog=document.createElement('dialog');
    dialog.className='cinema';
    dialog.setAttribute('aria-label',film.title);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    dialog.innerHTML=`<div class="cinema-stage"><video playsinline preload="auto" poster="media/${kind}-poster.jpg?v=depth1" aria-label="${film.description}"></video><div class="cinema-top"><span>N / ${film.heading} · 14 SECONDS</span><button class="small cinema-skip">SKIP ${film.skip} →</button></div><div class="cinema-bottom"><button class="small cinema-play">PLAY FILM</button><span class="cinema-status" role="status">${reduced?'Reduced motion is on. Play this film or skip to continue.':'Loading film…'}</span><button class="small cinema-sound">${muted?'ENABLE SOUND':'MUTE FILM'}</button></div><div class="cinema-progress" aria-hidden="true"><i></i></div></div>`;
    const video=dialog.querySelector('video'), play=dialog.querySelector('.cinema-play'), status=dialog.querySelector('.cinema-status'), audio=dialog.querySelector('.cinema-sound');
    let done=false, watchdog;
    function finish(){
      if(done)return;done=true;clearTimeout(watchdog);signal?.removeEventListener('abort',finish);video.pause();video.removeAttribute('src');video.load();dialog.close();dialog.remove();
      onFinish();if(previous?.isConnected)previous.focus({preventScroll:true});resolve();
    }
    async function start(){
      if(done)return;
      clearTimeout(watchdog);watchdog=setTimeout(finish,15000);
      try { await video.play(); if(done)return;play.hidden=true;status.textContent=film.status; }
      catch {if(!done){play.hidden=false;status.textContent='Press Play film, or skip to continue.';}}
    }
    signal?.addEventListener('abort',finish,{once:true});dialog.querySelector('.cinema-skip').onclick=finish;
    dialog.addEventListener('cancel',e=>{e.preventDefault();finish();});
    play.onclick=start;
    audio.onclick=()=>{video.muted=!video.muted;audio.textContent=video.muted?'ENABLE SOUND':'MUTE FILM';};
    video.muted=muted;video.src=`media/${kind}.mp4?v=depth1`;
    video.onended=finish;
    video.onerror=finish;
    video.ontimeupdate=()=>{dialog.querySelector('.cinema-progress i').style.transform=`scaleX(${Math.min(1,video.currentTime/14)})`;if(video.currentTime>=14)finish();};
    document.body.append(dialog);dialog.showModal();onStart();
    dialog.querySelector('.cinema-skip').focus();
    if(!reduced)start();
  });
}
