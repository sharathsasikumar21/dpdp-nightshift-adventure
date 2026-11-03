import {batchStaticOffice} from './office-performance.js';
import * as T from './vendor/three.module.js';
export const DESK_SETUPS=[
 {id:'toggle',label:'LOCATION INTAKE',kind:'device rig',accent:'#5c9c9b',detail:'A test handset and location-event capture rig.'},
 {id:'permission',label:'PREFERENCE CONTROL',kind:'consent kiosk',accent:'#b99a61',detail:'A preference terminal with separate intake and withdrawal trays.'},
 {id:'city-form',label:'CIVIC FORM REVIEW',kind:'document scanner',accent:'#6889a6',detail:'A grant-form scanner and labelled application folders.'},
 {id:'schoolyard',label:'LEARNING SAFEGUARDS',kind:'learning tablet',accent:'#9783ae',detail:'A learning tablet, accessibility keypad and guardian file.'},
 {id:'vendor',label:'SUPPLIER ASSURANCE',kind:'access cabinet',accent:'#a78368',detail:'An access-pass cabinet and a supplier contract binder.'},
 {id:'breach',label:'SYNC INCIDENT RESPONSE',kind:'sync equipment',accent:'#ad6d63',detail:'A network router, portable drive and live-sync status panel.'},
 {id:'rights-desk',label:'RIGHTS REQUEST QUEUE',kind:'request trays',accent:'#709b80',detail:'Separate request, verification and response trays.'},
 {id:'memory-drawer',label:'RETENTION & REFUNDS',kind:'archive drawers',accent:'#a59b79',detail:'Archive drawers, a retention ledger and refund-review folders.'},
 {id:'borderless-copy',label:'TRANSFER ASSURANCE',kind:'route console',accent:'#6495a7',detail:'A source-to-destination route console and migration folder.'},
 {id:'audit-trail',label:'AUDIT & ACCESS',kind:'audit rack',accent:'#8b96a4',detail:'An audit log rack with a hardware access token.'}
];
export function addCaseDesks(scene,office){
 const targets=[],lamps=[];
 for(const [i,setup] of DESK_SETUPS.entries()){const [x,z]=office.positions[i],first=office.meshes.length,root=new T.Group();root.name=setup.kind;root.userData.interaction={type:'case-prop',index:i};office.deskGroups[i].add(root);targets.push(root);
  const tint=new T.MeshStandardMaterial({color:setup.accent,roughness:.8}),dark=office.black,paper=office.paper,metal=office.metal,px=x-1.68,pz=z-.1;
  const b=(dx,y,dz,w,h,d,m=dark)=>office.box(px+dx,y,pz+dz,w,h,d,m);
  b(0,.37,0,.62,.74,.56,tint);b(0,.76,0,.66,.035,.6,metal);b(0,.49,.29,.44,.018,.02,metal);
  if(i===0){b(0,.91,0,.16,.29,.035,metal);b(0,.91,.02,.12,.23,.01,tint);for(const dx of [-.18,.18])b(dx,.8,.13,.04,.04,.16,dark);}
  if(i===1){b(0,1,0,.5,.4,.06,dark);for(const dx of [-.13,.13])b(dx,.99,.04,.15,.08,.015,tint);for(const dx of [-.2,.2])b(dx,.8,.18,.17,.03,.2,paper);}
  if(i===2){b(0,.85,0,.51,.15,.36,dark);b(0,.94,0,.44,.018,.3,tint);for(let n=0;n<3;n++)b(-.19+n*.16,1,.12,.1,.1,.2,paper);}
  if(i===3){b(0,.98,0,.45,.34,.035,dark);b(0,.98,.025,.4,.28,.01,tint);for(let n=0;n<4;n++)b(-.18+n*.12,.8,.2,.07,.03,.08,paper);}
  if(i===4){for(let n=0;n<3;n++){b(-.2+n*.2,.96,0,.15,.35,.25,dark);b(-.2+n*.2,1.02,.14,.1,.06,.01,paper);}b(0,.8,.22,.34,.04,.16,tint);}
  if(i===5){b(0,.84,0,.5,.13,.3,dark);for(const dx of [-.2,.2])b(dx,1.05,-.09,.015,.35,.015,metal);b(.12,.81,.22,.24,.06,.12,tint);}
  if(i===6){for(let n=0;n<3;n++){b(0,.81+n*.1,0,.5,.02,.33,metal);b(.08,.84+n*.1,.04,.28,.025,.2,paper);}b(-.26,.97,-.12,.025,.38,.025,tint);}
  if(i===7){for(let n=0;n<3;n++){b(0,.84+n*.13,0,.5,.1,.38,paper);b(0,.84+n*.13,.2,.18,.035,.01,tint);}b(0,.79,.22,.36,.035,.13,dark);}
  if(i===8){for(const dx of [-.2,.2]){b(dx,.98,0,.15,.32,.055,dark);b(dx,.98,.033,.11,.25,.01,tint);}b(0,.81,0,.25,.025,.04,metal);}
  if(i===9){for(let n=0;n<4;n++){b(0,.83+n*.08,0,.48,.055,.3,dark);b(-.14,.83+n*.08,.16,.06,.015,.01,tint);}b(.2,.79,.2,.1,.025,.12,metal);}
  office.textPlate(setup.label,x,1.66,z-.52,2.25,.22,'#1b272d','#d7d5bd');
  const lightMaterial=new T.MeshBasicMaterial({color:'#b8a66e'}),light=new T.Mesh(new T.SphereGeometry(.025,6,4),lightMaterial);light.position.set(px+.25,.87,pz+.17);root.add(light);lamps.push(lightMaterial);
  const meshes=office.meshes.slice(first);for(const mesh of meshes)root.attach(mesh);batchStaticOffice({meshes,allowInteractive:true});office.blocks.push({x:px,z:pz,w:.68,d:.62,caseIndex:i});
 }
 return {targets,setStatus(index,good){if(index===null){for(const lamp of lamps)lamp.color.set('#b8a66e');return;}lamps[index]?.color.set(good===true?'#8fc5aa':good===false?'#cf8b71':'#b8a66e');}};
}
