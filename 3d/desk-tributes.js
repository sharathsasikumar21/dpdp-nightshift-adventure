import * as T from './vendor/three.module.js';

export const TRIBUTE_OBJECTS=['Encrypted handset','Frontier hat & lasso','Decision coin','Neural interface','Field radio'];

// Small, grounded desk ornaments. No poster textures or external asset requests.
export function addDeskTributes(office){
 const targets=[],metal=new T.MeshStandardMaterial({color:'#9e8661',metalness:.65,roughness:.36}),dark=new T.MeshStandardMaterial({color:'#20292d',roughness:.65}),leather=new T.MeshStandardMaterial({color:'#725039',roughness:.9});
 const glow=new T.MeshStandardMaterial({color:'#a1c6c5',emissive:'#497a80',emissiveIntensity:.3,roughness:.35});
 office.positions.forEach(([x,z],i)=>{
  const kind=i%5,group=new T.Group();group.name=TRIBUTE_OBJECTS[kind];group.userData.interaction={type:'tribute',index:kind};group.position.set(x+.91,.795,z-.28);office.deskGroups[i].add(group);
  const mesh=(geometry,material,px,py,pz)=>{const o=new T.Mesh(geometry,material);o.position.set(px,py,pz);o.castShadow=false;o.receiveShadow=true;group.add(o);return o;};
  mesh(new T.BoxGeometry(.35,.018,.3),dark,0,.009,0);
  if(kind===0){const phone=mesh(new T.BoxGeometry(.12,.018,.21),dark,0,.038,0);phone.rotation.y=.18;const display=mesh(new T.BoxGeometry(.095,.003,.16),glow,0,.049,0);display.rotation.y=.18;}
  if(kind===1){mesh(new T.CylinderGeometry(.13,.14,.018,24),leather,0,.033,0);const crown=mesh(new T.CylinderGeometry(.065,.085,.085,20),leather,0,.079,0);crown.scale.z=.8;const rope=mesh(new T.TorusGeometry(.095,.007,6,24),metal,.025,.025,.012);rope.rotation.x=Math.PI/2;}
  if(kind===2){const coin=mesh(new T.CylinderGeometry(.09,.09,.014,32),metal,0,.12,0);coin.rotation.x=Math.PI/2;mesh(new T.BoxGeometry(.08,.07,.04),dark,0,.055,0);const inset=mesh(new T.TorusGeometry(.062,.004,6,24),dark,0,.12,.009);}
  if(kind===3){mesh(new T.BoxGeometry(.12,.035,.14),metal,0,.045,0);for(let j=0;j<4;j++)mesh(new T.BoxGeometry(.012,.012,.065),glow,-.045+j*.03,.069,0);}
  if(kind===4){mesh(new T.BoxGeometry(.105,.16,.07),dark,0,.1,0);mesh(new T.CylinderGeometry(.006,.006,.15,8),dark,-.035,.245,0);mesh(new T.BoxGeometry(.07,.035,.004),glow,0,.13,.038);for(let j=0;j<3;j++)mesh(new T.BoxGeometry(.065,.005,.006),metal,0,.07+j*.015,.039);}
  targets.push(group);
 });
 return targets;
}
