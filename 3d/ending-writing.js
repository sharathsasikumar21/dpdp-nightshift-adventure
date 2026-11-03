export const ENDING_WRITING={
 'good-ending':{title:'HEROIC ENDING',body:'You held the line. The uncontrolled copies are contained, the evidence is preserved, and Mumbai wakes to a safer morning.'},
 'bad-ending':{title:'DARK ENDING',body:'You found the signature. The copies survived. Somewhere beyond this room, the incident is still unfolding. The night is not over.'}
};
export function endingWords(kind,seconds,reduced=false){const copy=ENDING_WRITING[kind];return copy?{title:copy.title,body:reduced?copy.body:copy.body.slice(0,Math.max(0,Math.floor((seconds-.6)*38)))}:null;}
