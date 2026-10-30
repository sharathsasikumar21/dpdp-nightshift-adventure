import {CINEMATIC_ASSETS} from './cinematic-assets.js';

export function preloadCinematics(kinds,{signal}={}){
 const videos=kinds.map(kind=>{const video=document.createElement('video');video.preload='auto';video.muted=true;video.src=CINEMATIC_ASSETS[kind].video;video.load();return video;});
 let released=false;function release(){if(released)return;released=true;signal?.removeEventListener('abort',release);for(const video of videos){video.pause();video.removeAttribute('src');video.load();}}
 signal?.addEventListener('abort',release,{once:true});if(signal?.aborted)release();return release;
}

// Films own only their media. The ending sequence owns the opaque hand-off cover.
export function playCinematic(kind,{muted=true,onStart=()=>{},onFinish=()=>{},signal}={}){
  const films={
    opening:{title:'Ghost Shift opening film',heading:'INCOMING TRANSMISSION',skip:'INTRO',status:'Your shift starts at 02:17.',description:'Rainy city skyline. The city never stops. Neither does its data. Tonight, the next call is yours. Ghost Shift: Midnight Breach. Follow the data. Protect the people.'},
    credits:{title:'Ghost Shift team credits',heading:'END CREDITS',skip:'CREDITS',status:'SHA/020 · NIKS/141 · RIP/911 · Soundtrack By Renjith Mohan M R',description:'The team behind Ghost Shift: SHA/020, NIKS/141 and RIP/911. Soundtrack By Renjith Mohan M R. Thank you for playing.'},
    'good-ending':{title:'Heroic ending: city protected',heading:'HEROIC ENDING',skip:'ENDING',status:'80% or more correct · City protected',description:'A shield rises over the city at dawn. You held the line. The city wakes safer. Privacy Sentinel. Trust defended.'},
    'bad-ending':{title:'Scary ending: trust went dark',heading:'DARK ENDING',skip:'ENDING',status:'Below 80% correct · Review your calls',description:'A red surveillance eye looms over a dark city. The leak did not stop. Trust went dark. The night is not over. Review your calls. Come back ready.'}
  };
  const film=films[kind],asset=CINEMATIC_ASSETS[kind];
  if(!film||!asset||signal?.aborted)return Promise.resolve('aborted');
  return new Promise(resolve=>{
    const previous=document.activeElement,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dialog=document.createElement('dialog');dialog.className='cinema'+(kind==='credits'?' film-credits':'');dialog.setAttribute('aria-label',film.title);dialog.dataset.frame='loading';
    dialog.innerHTML=`<div class="cinema-stage"><img class="cinema-poster" src="${asset.poster}" alt="" ${reduced?'':'hidden'}><video playsinline preload="auto" aria-label="${film.description}"></video><div class="cinema-top"><span>N / ${film.heading}</span><button class="small cinema-skip">SKIP ${film.skip} →</button></div><div class="cinema-bottom"><button class="small cinema-play">PLAY FILM</button><span class="cinema-status" role="status">${reduced?'Play this film or skip to continue.':'Loading film…'}</span><button class="small cinema-sound">${muted?'ENABLE SOUND':'MUTE FILM'}</button></div><div class="cinema-progress" aria-hidden="true"><i></i></div></div>`;
    const video=dialog.querySelector('video'),poster=dialog.querySelector('.cinema-poster'),play=dialog.querySelector('.cinema-play'),status=dialog.querySelector('.cinema-status'),audio=dialog.querySelector('.cinema-sound');
    let done=false,watchdog,frameRequest=null;
    const cutoff=Math.min(15,asset.duration);
    function finish(reason='ended'){
      if(done)return;done=true;clearTimeout(watchdog);signal?.removeEventListener('abort',abort);
      // Hide and detach before resetting src. A source reset can display the
      // poster/first frame, even on a video that has just been paused.
      dialog.dataset.frame='closed';poster.hidden=true;
      if(frameRequest!==null)video.cancelVideoFrameCallback?.(frameRequest);
      video.onended=video.onerror=video.onwaiting=video.onplaying=video.ontimeupdate=video.onloadeddata=null;
      play.onclick=audio.onclick=null;video.pause();dialog.close();dialog.remove();
      video.removeAttribute('src');video.load();
      try{onFinish(reason);if(previous?.isConnected)previous.focus({preventScroll:true});}finally{resolve(reason);}
    }
    const abort=()=>finish('aborted');
    function showFrame(){if(done)return;dialog.dataset.frame='ready';poster.hidden=true;}
    function decodedFrame(){
      if(done||dialog.dataset.frame==='ready'||frameRequest!==null)return;
      if(video.requestVideoFrameCallback)frameRequest=video.requestVideoFrameCallback(()=>{frameRequest=null;showFrame();});
      else if(video.readyState>=2&&!video.paused&&!video.seeking)showFrame();
    }
    function arm(ms){clearTimeout(watchdog);watchdog=setTimeout(()=>finish('timeout'),ms);}
    async function start(){
      if(done)return;play.disabled=true;arm(45000);
      try{await video.play();if(done){video.pause();return;}play.hidden=true;play.disabled=false;status.textContent=film.status;decodedFrame();arm(Math.max(4000,(cutoff-video.currentTime+3)*1000));}
      catch{clearTimeout(watchdog);if(!done){play.disabled=false;play.hidden=false;poster.hidden=false;status.textContent='Press Play film, or skip to continue.';}}
    }
    signal?.addEventListener('abort',abort,{once:true});dialog.querySelector('.cinema-skip').onclick=()=>finish('skipped');
    dialog.addEventListener('cancel',event=>{event.preventDefault();finish('skipped');});
    play.onclick=start;audio.onclick=()=>{if(done)return;video.muted=!video.muted;audio.textContent=video.muted?'ENABLE SOUND':'MUTE FILM';};
    video.muted=muted;video.loop=false;video.src=asset.video;
    video.onended=()=>finish('ended');video.onerror=()=>finish('error');
    video.onwaiting=()=>{if(!done){arm(45000);status.textContent='Buffering film…';}};
    video.onplaying=()=>{if(!done){decodedFrame();arm(Math.max(4000,(cutoff-video.currentTime+3)*1000));status.textContent=film.status;}};
    video.onloadeddata=()=>{if(!video.paused)decodedFrame();};
    video.ontimeupdate=()=>{if(done)return;dialog.querySelector('.cinema-progress i').style.transform=`scaleX(${Math.min(1,video.currentTime/cutoff)})`;if(video.currentTime>=cutoff)finish('ended');};
    document.body.append(dialog);dialog.showModal();onStart();dialog.querySelector('.cinema-skip').focus();
    if(!reduced)start();
  });
}
