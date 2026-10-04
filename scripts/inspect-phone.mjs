import { readFileSync } from 'node:fs';
import { Box3, Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const bytes = readFileSync(new URL('../public/assests/oryvelle-phone.glb', import.meta.url));
const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
gltf.scene.updateMatrixWorld(true);
console.log('WORLD', new Box3().setFromObject(gltf.scene).min.toArray(), new Box3().setFromObject(gltf.scene).max.toArray());
gltf.scene.traverse(o => {
 if (!(o instanceof Mesh)) return;
 const box=new Box3().setFromObject(o); const a=o.geometry.attributes;
 console.log(o.name,'parent',o.parent.name,'mat',o.material.name,'bounds',box.min.toArray().map(n=>+n.toFixed(4)),box.max.toArray().map(n=>+n.toFixed(4)));
 if(['Object_6','Object_44','Object_46'].includes(o.name)) {
  const samples=[];
  for(let i=0;i<a.position.count;i++) {
   const p=new Vector3().fromBufferAttribute(a.position,i).applyMatrix4(o.matrixWorld);
   if(i%Math.ceil(a.position.count/12)===0)samples.push({p:p.toArray().map(n=>+n.toFixed(4)),uv:[a.uv.getX(i),a.uv.getY(i)].map(n=>+n.toFixed(4))});
  }
  console.log('SAMPLES',JSON.stringify(samples));
 }
});
