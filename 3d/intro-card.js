export const INTRO_LINES=[
 {text:'Simon Ghost Riley',delay:0,pace:.055},
 {text:'Data Protection Officer · Taskforce 141',delay:.95,pace:.018},
 {text:'Trace the midnight export.',delay:1.75,pace:.027},
 {text:'Find your active case desk. Inspect the arrival clues, then follow the evidence across floors 47–50.',delay:2.55,pace:.009}
];
const esc=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const line=index=>'<span class="typed-text" data-intro-line="'+index+'" aria-hidden="true"></span>';
export function renderIntroCard(){
 return '<section class="arrival-intro" aria-label="Your assignment"><div class="intro-rule" aria-hidden="true"></div><p class="intro-name" aria-label="'+esc(INTRO_LINES[0].text)+'">'+line(0)+'</p><p class="intro-role" aria-label="'+esc(INTRO_LINES[1].text)+'">'+line(1)+'</p><div class="intro-assignment"><span class="intro-kicker">OBJECTIVE / 01</span><h1 aria-label="'+esc(INTRO_LINES[2].text)+'">'+line(2)+'</h1><p class="intro-instruction" aria-label="'+esc(INTRO_LINES[3].text)+'">'+line(3)+'</p></div><button class="small arrival-begin" disabled>BEGIN INVESTIGATION →</button></section>';
}
// A single growing text node cannot leave holes between separately animated
// letters. Elapsed time also catches up correctly after a background-tab pause.
export function animateIntroCard(container,{now=()=>performance.now(),schedule=setInterval,cancel=clearInterval,reduced=false}={}){
 const started=now(),nodes=INTRO_LINES.map((_,index)=>container.querySelector('[data-intro-line="'+index+'"]')),assignment=container.querySelector('.intro-assignment');
 let timer,stopped=false;
 function complete(){nodes.forEach((node,index)=>node.textContent=INTRO_LINES[index].text);if(assignment)assignment.style.opacity='1';cancel(timer);}
 function tick(){if(stopped)return;const age=(now()-started)/1000;nodes.forEach((node,index)=>{const spec=INTRO_LINES[index];node.textContent=spec.text.slice(0,Math.max(0,Math.floor((age-spec.delay)/spec.pace)));});if(assignment)assignment.style.opacity=age>=1.6?'1':'0';}
 if(reduced)complete();else{tick();timer=schedule(tick,33);}
 return {complete,cancel(){stopped=true;cancel(timer);}};
}
