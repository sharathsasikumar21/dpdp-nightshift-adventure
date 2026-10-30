import * as T from './vendor/three.module.js';
import {floorForCase} from './building.js';
export function createCompanionFind(scene,office){
 const group=new T.Group();group.name='Chikku’s misplaced queue slip';group.userData.interaction={type:'companion-find'};group.userData.dynamic=true;scene.add(group);
 const paper=new T.Mesh(new T.BoxGeometry(.32,.008,.23),office.paper);paper.position.y=.045;paper.rotation.y=.28;group.add(paper);
 const ring=new T.Mesh(new T.TorusGeometry(.24,.012,5,20),new T.MeshBasicMaterial({color:'#e8c66d'}));ring.rotation.x=Math.PI/2;ring.position.y=.025;group.add(ring);
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const d=canvas.getContext('2d');d.fillStyle='#15201f';d.fillRect(0,0,512,96);d.fillStyle='#f2d584';d.font='bold 36px sans-serif';d.textAlign='center';d.fillText('CHIKKU’S FIND',256,62);const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
 const label=new T.Sprite(new T.SpriteMaterial({map,depthWrite:false}));label.position.y=.44;label.scale.set(1.25,.24,1);group.add(label);
 let stage='idle',floor=47,caseFloor=47;
 function update(){group.visible=stage==='noticed'&&floor===caseFloor;}
 return {group,setStage(value){stage=value;update();},setFloor(value){floor=value;update();},setCase(index){const [x,z]=office.positions[index];group.position.set(x-1.2,0,z+1.05);caseFloor=floorForCase(index);update();}};
}
