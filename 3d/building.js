export const FLOORS=[
 {number:47,name:'Incident Operations',description:'Arrival records, consent and the rights desk.'},
 {number:48,name:'Security Operations',description:'Vendor assurance, incident response and access control.'},
 {number:49,name:'Civic & Learning Services',description:'Public requests, safeguarding and witness accounts.'},
 {number:50,name:'Records & Transfer Control',description:'Accuracy disputes, retention and overseas copies.'}
];
const CASE_FLOORS=[47,47,49,49,48,48,47,50,50,48];
export const floorForCase=index=>CASE_FLOORS[index]??47;
export const floorInfo=number=>FLOORS.find(f=>f.number===number)||FLOORS[0];
export const colleagueFloor=index=>[47,48,49][index]??47;
export function availableBlocks(blocks,floor){return blocks.filter(b=>(b.floor==null||b.floor===floor)&&(b.caseIndex==null||floorForCase(b.caseIndex)===floor));}
