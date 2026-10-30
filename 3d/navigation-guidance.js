export function nextInstruction({openingCount=0,evidenceCount=0,currentFloor=47,targetFloor=47,near=false}={}){
 if(currentFloor!==targetFloor)return 'NEXT · Use Lift / Floors → '+targetFloor+'. Your active case table is in that department.';
 if(openingCount<3)return 'NEXT · '+(near?'Inspect':'Follow the yellow marker to')+' the arrival clues at the active table ('+openingCount+'/3). Read the badge, door log and witness account.';
 if(!near)return 'NEXT · Follow the yellow marker to your active case table. Navigate to case is a direct shortcut.';
 if(evidenceCount<3)return 'NEXT · Inspect the three case records on this table ('+evidenceCount+'/3). Use Evidence Board to read and compare them.';
 return 'NEXT · All three records collected. Look at the terminal and press E. Your question clock starts only after the briefing.';
}
export function navigationMarker({x,y,z,degrees,sameFloor,distance,targetFloor}){
 const inside=z>=-1&&z<=1&&Math.abs(x)<.85&&y>-.25&&y<.7;
 return {left:inside?(x+1)*50:degrees>25?8:degrees< -25?92:50,top:inside?(1-y)*50:22,label:!sameFloor?'LIFT → FLOOR '+targetFloor:inside?'ACTIVE CASE TABLE':Math.abs(degrees)>150?'TURN AROUND · ACTIVE TABLE':degrees>25?'← ACTIVE TABLE':degrees< -25?'ACTIVE TABLE →':'ACTIVE TABLE AHEAD',detail:!sameFloor?'Use Lift / Floors':distance.toFixed(0)+' m · '+(distance<3.25?'E TO INTERACT':'FOLLOW THE YELLOW ARROW')};
}
