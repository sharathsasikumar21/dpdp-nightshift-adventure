import * as T from './vendor/three.module.js';
export const ROAD_Y=-37.04;
export function coastalRoadPoint(t,lane=0){const a=-1.2+t*2.4,dx=85*Math.cos(a),dz=-42*Math.sin(a),length=Math.hypot(dx,dz);return {x:Math.sin(a)*85-dz/length*lane,z:22+Math.cos(a)*42+dx/length*lane,y:ROAD_Y,yaw:Math.atan2(dx,dz)};}
export function addGroundTraffic(root,count=24){
 const material=new T.MeshStandardMaterial({roughness:.38,metalness:.25}),glass=new T.MeshStandardMaterial({color:'#172c38',roughness:.25,metalness:.4});
 const bodies=new T.InstancedMesh(new T.BoxGeometry(1.65,.48,4),material,count),cabins=new T.InstancedMesh(new T.BoxGeometry(1.4,.55,2.1),glass,count),chassis=new T.InstancedMesh(new T.BoxGeometry(1.6,.14,3.8),new T.MeshStandardMaterial({color:'#101317',roughness:.95}),count);
 const heads=new T.InstancedMesh(new T.BoxGeometry(.17,.12,.07),new T.MeshBasicMaterial({color:'#ffe6bd'}),count*2),tails=new T.InstancedMesh(new T.BoxGeometry(.18,.1,.07),new T.MeshBasicMaterial({color:'#d75b49'}),count*2);
 const meshes=[bodies,cabins,chassis,heads,tails];meshes.forEach(mesh=>{mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;root.add(mesh);});
 const colors=['#b9b6ac','#262d34','#b6bbc0','#536475','#d0a640','#6a777d'];for(let i=0;i<count;i++)bodies.setColorAt(i,new T.Color(colors[i%colors.length]));
 const dummy=new T.Object3D(),offset=new T.Vector3();let time=0;
 function place(mesh,index,p,x,y,z,yaw){offset.set(x,y,z).applyAxisAngle(T.Object3D.DEFAULT_UP,yaw);dummy.position.set(p.x+offset.x,p.y+offset.y,p.z+offset.z);dummy.rotation.set(0,yaw,0);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);}
 function update(dt,reduced=false){if(!reduced)time+=Math.max(0,Math.min(dt,.1));for(let i=0;i<count;i++){const direction=i%2?1:-1,u=((i/count+time*(.024+(i%3)*.002)*direction)%1+1)%1,p=coastalRoadPoint(u,direction*1.35),yaw=p.yaw+(direction<0?Math.PI:0);place(bodies,i,p,0,.42,0,yaw);place(cabins,i,p,0,.91,-.15,yaw);place(chassis,i,p,0,.16,0,yaw);for(let side=0;side<2;side++){place(heads,i*2+side,p,side?.56:-.56,.49,2.02,yaw);place(tails,i*2+side,p,side?.56:-.56,.43,-2.02,yaw);}}meshes.forEach(mesh=>mesh.instanceMatrix.needsUpdate=true);}
 update(0);return {update,meshes,count};
}
