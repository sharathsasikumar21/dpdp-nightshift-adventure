import * as T from './vendor/three.module.js';
import {arrivalState} from './arrival.js?v=depth1';

export function buildElevator(scene,office){
 const {box,rounded,metal,black,textPlate,blocks}=office;const targets=[],buttons=[];
 const panel=new T.MeshStandardMaterial({color:'#4e5559',roughness:.33,metalness:.78});
 const warm=new T.MeshStandardMaterial({color:'#d1c8b6',roughness:.62});
 const glow=new T.MeshBasicMaterial({color:'#f4e7c8'});
 // The elevator joins the window-side entrance of the operations floor.
 box(0,-.05,13.4,3.2,.12,3.2,black);box(0,2.8,13.4,3.2,.12,3.2,panel);
 for(const x of [-1.6,1.6]){box(x,1.4,13.4,.1,2.8,3.2,panel);box(x*.98,1.1,13.8,.055,.055,1.8,metal);box(x*.96,2.62,13.4,.035,.025,2.8,glow);}
 box(0,1.4,15,3.2,2.8,.1,warm);for(const x of [-1.35,-.45,.45,1.35])box(x,1.4,14.92,.015,2.65,.025,metal);
 box(0,2.73,13.5,1.5,.025,.6,glow);const light=new T.PointLight('#ffe1b1',15,5,2);light.position.set(0,2.55,13.6);scene.add(light);
 for(const x of [-1.48,1.48])box(x,1.4,11.98,.22,2.8,.25,metal);box(0,2.68,11.98,3,.24,.25,metal);
 const left=rounded(-.7,1.24,12.03,1.39,2.48,.055,panel,.008),right=rounded(.7,1.24,12.03,1.39,2.48,.055,panel,.008);
 for(const door of [left,right]){door.userData.dynamic=true;const strip=new T.Mesh(new T.BoxGeometry(.012,2.38,.008),metal);strip.position.z=.034;door.add(strip);}
 const landing=textPlate('47  /  MERIDIAN DATAWORKS',0,2.47,12.08,1.8,.13,'#20292d','#e4d3ac');
 box(1.15,1.4,12.13,.23,.7,.04,black);for(let i=0;i<4;i++){const b=new T.Mesh(new T.CylinderGeometry(.035,.035,.012,20),i===3?glow:metal);b.rotation.x=Math.PI/2;b.position.set(1.15,1.63-i*.15,12.16);scene.add(b);}
 const display=textPlate('29 / INCIDENT RESPONSE',1.46,2.02,13.6,1.4,.22,'#112029','#e4d3ac');display.rotation.y=-Math.PI/2;
 // Diegetic floor panel: labels and buttons are real raycast targets.
 box(1.53,1.26,13.6,.06,1.13,.58,black);
 for(let i=0;i<4;i++){const floor=47+i,y=1.66-i*.22,material=new T.MeshStandardMaterial({color:'#68727a',emissive:'#e0c38a',emissiveIntensity:.12}),button=box(1.475,y,13.6,.055,.17,.2,material),label=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const d=c.getContext('2d');d.fillStyle='#17232f';d.fillRect(0,0,256,256);d.fillStyle='#ffe5a2';d.font='bold 116px Arial';d.textAlign='center';d.textBaseline='middle';d.fillText(String(floor),128,132);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(new T.PlaneGeometry(.17,.14),new T.MeshBasicMaterial({map:texture}));o.position.set(1.437,y,13.6);o.rotation.y=-Math.PI/2;scene.add(o);return o;})();for(const object of [button,label]){object.userData.interaction={type:'lift-floor',index:floor};targets.push(object);}buttons.push({floor,material});}
 const doorBlocks=[{x:left.position.x,z:12.03,w:1.39,d:.08,h:2.48,dynamic:true},{x:right.position.x,z:12.03,w:1.39,d:.08,h:2.48,dynamic:true}];blocks.push(...doorBlocks);
 let destination=47,lastDisplay='';
 function drawDisplay(number){const text=number+' / INCIDENT RESPONSE';if(text===lastDisplay)return;lastDisplay=text;const c=display.material.map.image,d=c.getContext('2d');d.fillStyle='#112029';d.fillRect(0,0,1024,128);d.fillStyle='#e4d3ac';d.font='bold 46px Arial';d.textAlign='center';d.fillText(text,512,82);display.material.map.needsUpdate=true;}
 function doors(amount){left.position.x=-.7-amount*1.28;right.position.x=.7+amount*1.28;doorBlocks[0].x=left.position.x;doorBlocks[1].x=right.position.x;}
 return {targets,setTarget(number){for(const b of buttons){b.material.color.set(b.floor===number?'#ffda63':'#68727a');b.material.emissiveIntensity=b.floor===number?.75:.12;}},setFloor(number){destination=number;const c=landing.material.map.image,d=c.getContext('2d');d.fillStyle='#20292d';d.fillRect(0,0,c.width,c.height);d.fillStyle='#e4d3ac';d.font='500 49px Arial';d.textAlign='center';d.fillText(number+' / MERIDIAN DATAWORKS',512,82);landing.material.map.needsUpdate=true;},applyRide(s){drawDisplay(s.display);doors(s.door);},update(seconds){const s=arrivalState(seconds);drawDisplay(s.done?destination:s.floor);doors(s.doors);return s;}};
}
