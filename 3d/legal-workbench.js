export function legalRecord(state){return state.legalWorkbench??={findings:{},exceptions:{},notice:{nature:'',scope:'',actions:'',contact:'',board:false,people:false,details:false}};}
export function exceptionChecks(storyId){
 if(storyId==='schoolyard')return ['Establish the learner’s age from the account record.','Identify a prescribed class or purpose and every applicable condition.','Verify evidence for the claimed exception rather than relying on the learning-app label.'];
 if(storyId==='city-form')return ['Identify the exact section 7 ground and the legally authorised function.','Match the requested fields to the necessary purpose.','Verify the statutory conditions rather than relying on government status.'];
 if(storyId==='borderless-copy')return ['Establish who made the profile public, or the legal publication obligation.','Check the destination, government directions and stricter sector restrictions.','Do not treat visibility or a familiar provider as proof of eligibility.'];
 return ['Identify the exact provision said to create the exception.','Check each required fact and condition against the source records.','Record missing proof rather than treating an assertion as an established exemption.'];
}
export function noticeReady(notice){return ['nature','scope','actions','contact'].every(k=>typeof notice[k]==='string'&&notice[k].trim().length>=8)&&notice.board===true&&notice.people===true&&notice.details===true;}
export function saveLegalFinding(state,turn,{basis,note}){const allowed=['not-established','consent','legitimate-use','scope-exclusion'];if(!allowed.includes(basis))return false;legalRecord(state).findings[turn]={basis,note:String(note).slice(0,500)};return true;}
