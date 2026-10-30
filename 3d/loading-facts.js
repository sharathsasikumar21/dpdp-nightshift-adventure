export const LOADING_FACTS=Object.freeze([
 'Your 02:17 AM shift begins with a badge that expired at 00:30.',
 'Four floors. Ten cases. One very suspicious export.',
 'Three exhibits sit at every case desk. Each tells only part of the story.',
 'The yellow arrow is the office’s most reliable night-shift employee.',
 'The lift goes up. The plot gets deeper.',
 'Reading a visitor badge is easy. Knowing who used it takes evidence.',
 'The skyline keeps moving while the office keeps secrets.',
 'Your flashlight makes suspicious paperwork feel even more suspicious.',
 'Every decision leaves a trace. Some leave a morning meeting.',
 'A coffee break restores morale. It does absolutely nothing to fix consent.',
 'Desk keepsakes have stories too. Get close and press E.',
 'The night crew has conflicting accounts. Your notebook has room for all of them.'
]);

export function nextLoadingFact(previous='',random=Math.random){
 const candidates=LOADING_FACTS.filter(fact=>fact!==previous);
 return candidates[Math.min(candidates.length-1,Math.max(0,Math.floor(random()*candidates.length)))];
}

export function rotateLoadingFacts(element,{random=Math.random,schedule=setTimeout,cancel=clearTimeout}={}){
 let stopped=false,timer,previous='';
 function show(){if(stopped)return;previous=nextLoadingFact(previous,random);element.textContent=previous;timer=schedule(show,4200+Math.floor(random()*2000));}
 show();
 return ()=>{stopped=true;cancel(timer);};
}
