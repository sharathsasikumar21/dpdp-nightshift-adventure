import * as T from './vendor/three.module.js';

export const TRIBUTES=[
 {image:'./media/posters/watch-dogs-2.jpg',source:'https://store.steampowered.com/app/447040/',owner:'Ubisoft',title:'Watch Dogs 2',note:'A tribute to its surveillance themes, connected-city investigations and playful environmental interactions.'},
 {image:'./media/posters/red-dead-redemption-2.jpg',source:'https://store.steampowered.com/app/1174180/',owner:'Rockstar Games',title:'Red Dead Redemption 2',note:'A tribute to its environmental storytelling, lived-in locations and memorable character encounters.'},
 {image:'./media/posters/detroit-become-human.jpg',source:'https://store.steampowered.com/app/1222140/',owner:'Quantic Dream',title:'Detroit: Become Human',note:'A tribute to its cinematic introductions, ethical choices and human consequences.'},
 {image:'./media/posters/cyberpunk-2077.jpg',source:'https://store.steampowered.com/app/1091500/',owner:'CD PROJEKT RED',title:'Cyberpunk 2077',note:'A tribute to its rain-soaked city atmosphere, illuminated towers and technology-driven mysteries.'},
 {image:'./media/posters/modern-warfare.jpg',source:'https://store.steampowered.com/app/2000950/',owner:'Activision',title:'Call of Duty: Modern Warfare',note:'A tribute to its tense radio dispatches, Simon “Ghost” Riley and Task Force 141.'}
];
export const COLLEAGUES=[
 {name:'Mira · Incident analyst',hints:['Compare the timestamps. A permission granted later cannot explain an earlier export.','Read the source document before choosing a response. The first account may be incomplete.','Check who received the records, not just who clicked the button.']},
 {name:'Arjun · Security engineer',hints:['Separate what the evidence proves from what somebody assumes.','A vendor’s assurance is a lead to verify, not proof by itself.','Contain the problem while preserving evidence. You may need both.']},
 {name:'Leena · Privacy counsel',hints:['Look for the stated purpose and the limits on using the data.','Check which people are affected before deciding what action fits.','Similar options can differ in timing, scope or accountability. Read those words carefully.']}
];

// Official Steam store key art, locally hosted in framed tribute posters.
export function addNightExtras(scene,office){
 const {box,textPlate,blocks}=office,targets=[],people=[];
 const sea=new T.Mesh(new T.PlaneGeometry(170,150),new T.MeshStandardMaterial({color:'#040e1b',metalness:.15,roughness:.7}));
 sea.rotation.x=-Math.PI/2;sea.position.set(0,-38,-85);scene.add(sea);
 const gold=new T.MeshBasicMaterial({color:'#e8b56f'}),cool=new T.MeshBasicMaterial({color:'#83b7d3'});
 // A stylized Queen's Necklace: a curved shoreline below the high-rise office.
 const shore=[];for(let i=0;i<64;i++){const a=-1.05+i/63*1.8,x=25+Math.sin(a)*64,z=-35-Math.cos(a)*55;shore.push(new T.Vector3(x,-36.8,z));const lamp=new T.Mesh(new T.SphereGeometry(.19,6,4),i%5?gold:cool);lamp.position.copy(shore.at(-1));lamp.position.y+=.7;scene.add(lamp);}
 const road=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(shore),64,.22,5,false),new T.MeshStandardMaterial({color:'#182333',roughness:.85}));scene.add(road);
 const reflections=new T.BufferGeometry(),points=[];
 for(let i=0;i<100;i++){const x=-48+(i*29%100),z=-22-(i*17%80);points.push(x,-37.96,z,x+.08,-37.96,z+1+(i%4));}
 reflections.setAttribute('position',new T.Float32BufferAttribute(points,3));scene.add(new T.LineSegments(reflections,new T.LineBasicMaterial({color:'#678d9c',transparent:true,opacity:.19})));

 // Characters occupy side bays, away from evidence and primary walking lanes.
 const skin=new T.MeshStandardMaterial({color:'#ad795b',roughness:.8});
 COLLEAGUES.forEach((person,i)=>{const x=[-12,12,12][i],z=[3,0,8][i],group=new T.Group();group.position.set(x,0,z);group.userData.interaction={type:'colleague',index:i};scene.add(group);
  const suit=new T.MeshStandardMaterial({color:['#3a5665','#444b48','#59516c'][i],roughness:.85});
  const part=(geo,mat,x,y,z)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;group.add(m);return m;};
  part(new T.CylinderGeometry(.22,.17,.64,12),suit,0,1.04,0);
  const head=part(new T.SphereGeometry(.15,14,10),skin,0,1.53,0);const hair=new T.Mesh(new T.SphereGeometry(.154,16,10,0,Math.PI*2,0,1.45),new T.MeshStandardMaterial({color:i===1?'#29201b':'#241a17',roughness:.96}));head.add(hair);const eyes=new T.MeshStandardMaterial({color:'#182127',roughness:.7});for(const side of [-1,1]){const eye=part(new T.SphereGeometry(.012,8,6),eyes,side*.05,1.55,.14);head.attach(eye);const ear=part(new T.SphereGeometry(.035,8,6),skin,side*.15,1.52,0);head.attach(ear);}const nose=part(new T.SphereGeometry(.027,8,6),skin,0,1.515,.146);head.attach(nose);part(new T.CylinderGeometry(.06,.07,.12,10),skin,0,1.35,0);part(new T.BoxGeometry(.16,.06,.025),office.paper,0,1.28,.18);people.push({group,head,index:i});
  for(const sign of [-1,1]){part(new T.CylinderGeometry(.07,.085,.72,8),suit,sign*.11,.4,0);part(new T.CylinderGeometry(.055,.06,.58,8),suit,sign*.25,1.02,0);part(new T.SphereGeometry(.06,8,6),skin,sign*.25,.7,0);}
  part(new T.BoxGeometry(.075,.1,.015),cool,-.1,1.18,.21);
  textPlate(person.name,x,1.98,z+.23,1.75,.15,'#0b1822','#c4d7df');
  blocks.push({x,z,w:.75,d:.65});targets.push(group);
 });
 const textureLoader=new T.TextureLoader();
 TRIBUTES.forEach((tribute,i)=>{
  const firstMesh=office.meshes.length;
  const panel=box(0,1.85,0,1.32,2.02,.075,new T.MeshStandardMaterial({color:'#11171b',metalness:.5,roughness:.38}));
  const mat=new T.MeshStandardMaterial({color:'#ffffff',roughness:.8,emissive:'#ffffff',emissiveIntensity:.3});
  const face=new T.Mesh(new T.PlaneGeometry(1.18,1.77),mat);face.position.set(0,1.88,.043);scene.add(face);office.meshes.push(face);
  textureLoader.load(tribute.image,texture=>{texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;mat.map=texture;mat.emissiveMap=texture;mat.needsUpdate=true;},undefined,()=>{mat.color.set('#a58b61');});
  for(const side of [-1,1])box(side*.635,1.85,.043,.025,1.96,.025,office.metal);
  box(0,2.83,.043,1.29,.025,.025,office.metal);box(0,.87,.043,1.29,.025,.025,office.metal);
  textPlate(tribute.title,0,.75,.05,1.55,.11,'#111c25','#ddd2b8');textPlate('OFFICIAL ART / INSPECT [E]',0,.59,.05,1.55,.085,'#111c25','#a7bac0');
  box(0,2.98,.17,.68,.045,.14,office.black);box(0,2.95,.17,.58,.008,.1,new T.MeshBasicMaterial({color:'#ffe5ba'}));
  const wall=new T.Group();wall.position.set(i<3?-14.55:14.55,0,[-7,-2,3,-5,3][i]);wall.rotation.y=i<3?Math.PI/2:-Math.PI/2;scene.add(wall);
  for(const mesh of office.meshes.slice(firstMesh)){scene.remove(mesh);wall.add(mesh);mesh.userData.interaction={type:'tribute',index:i};targets.push(mesh);}
  const light=new T.PointLight('#ffe2b8',2,3,2);light.position.set(0,2.8,.65);wall.add(light);
 });
 const desk=box(-2, .52, 8.5,2.2,1,.7,office.black);blocks.push({x:-2,z:8.5,w:2.2,d:.7});
 const badge=box(-2.55,1.04,8.5,.3,.025,.42,office.paper);badge.userData.interaction={type:'opening',index:0};targets.push(badge);
 const terminal=box(-1.55,1.3,8.45,.56,.4,.04,new T.MeshStandardMaterial({color:'#172d31',emissive:'#72c8ae',emissiveIntensity:.5}));terminal.userData.interaction={type:'opening',index:1};targets.push(terminal);
 textPlate('VISITOR LOG / V-017',-2,1.8,8.55,2,.17,'#0b1822','#c4d7df');
 let time=0;targets.update=(dt,camera,reduced)=>{time+=dt;terminal.material.emissiveIntensity=reduced?.5:.35+.2*Math.sin(time*2);for(const {group,head,index} of people){const distance=group.position.distanceTo(camera.position);const angle=Math.atan2(camera.position.x-group.position.x,camera.position.z-group.position.z);head.rotation.y=distance<4?Math.max(-.65,Math.min(.65,angle-group.rotation.y)):0;head.position.y=1.53+(reduced?0:Math.sin(time*1.5+index)*.006);group.rotation.z=reduced?0:Math.sin(time*.65+index)*.008;}};
 return targets;
}
