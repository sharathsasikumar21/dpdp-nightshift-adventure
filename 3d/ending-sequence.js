// Keep an opaque cover between dialogs so an earlier scene or the report
// cannot appear for a frame while the next video is decoding.
export function coverEndingSequence(){
 const cover=document.createElement('div');cover.className='cinema-transition';cover.setAttribute('aria-hidden','true');document.body.append(cover);
 return ()=>cover.remove();
}

export async function playEndingSequence({signal,isCurrent=()=>true,reveal,ending,credits,cover=coverEndingSequence}){
 if(signal?.aborted||!isCurrent())return;
 const release=cover();
 try{
  for(const stage of [reveal,ending,credits].filter(Boolean)){
   if(signal?.aborted||!isCurrent())return;
   await stage();
  }
 }finally{release();}
}
