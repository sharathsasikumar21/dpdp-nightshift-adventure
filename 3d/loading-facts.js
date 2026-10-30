export const LOADING_FACTS=Object.freeze([
 'To confuse the enemy, first confuse yourself.',
 'If the enemy can predict your every move, then don’t move.',
 'Never let them know your next move. Especially yourself.',
 'Stay calm. Panic quietly.',
 'Think outside the box. The evidence is still inside it.',
 'Outsmart the problem. If that fails, out-confuse it.',
 'When in doubt, look busy. Then read the evidence.',
 'The element of surprise also works on the person making the plan.',
 'Chikku read the evidence. She does not even have a badge.',
 'Your confidence arrived before the facts. Classic.',
 'Four options. Somehow you will invent a fifth called “vibes”.',
 'The yellow arrow believes in you. Management remains undecided.',
 'That was not lag. You were considering the wrong answer in high definition.',
 'Coffee acquired. Competence sold separately.',
 'Please do not turn a data breach into a group project.',
 'Your gut feeling has requested administrator access. Denied.',
 'Clicking harder does not make the answer more correct.',
 'Chikku has never caused a data breach. The bar is on the floor.',
 'The audit log remembers. Unlike you, apparently.',
 'Speedrunning the questions is how you unlock the morning meeting.',
 'Three records on the desk. Yes, the other two count.',
 'If confidence earned points, you would have finished already.',
 'The breach did not take a coffee break. Bold of you to assume it would.',
 'Somewhere, a spreadsheet is waiting to explain your choices to your boss.'
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
