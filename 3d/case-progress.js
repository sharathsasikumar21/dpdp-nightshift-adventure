export function caseProgress({records=0,accounts=0,finding=null,contained=false,decisions=0}={}){
 const steps=[{id:'records',label:'Inspect records',detail:Math.min(3,records)+'/3',done:records>=3},
 {id:'compare',label:'Compare accounts',detail:finding===1?'Finding supported':Math.min(2,accounts)+'/2 read',done:accounts>=2&&finding===1},
 {id:'contain',label:'Contain the route',detail:contained?'Actions recorded':'Use case terminal',done:contained},
 {id:'decide',label:'Make decisions',detail:Math.min(3,decisions)+'/3',done:decisions>=3}];
 const active=steps.findIndex(s=>!s.done);
 return steps.map((s,i)=>({...s,status:s.done?'done':i===active?'current':'pending'}));
}
