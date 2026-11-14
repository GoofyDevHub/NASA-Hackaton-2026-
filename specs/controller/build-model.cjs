// ORBIT concept geometry. Millimetres here; GLB export converts to metres.
// Envelopes only: not manufacturing CAD, validated parts, or wiring.
const fs=require('node:fs'),path=require('node:path');
const parts=[];
const colors={shell:'#343745',orange:'#FE8500',white:'#F0F0F0',pcb:'#196660',metal:'#AAB5C0',black:'#14161D',gold:'#BB9B55'};
function mesh(){return {p:[],n:[]};}
function tri(g,a,b,c){const u=b.map((v,i)=>v-a[i]),v=c.map((x,i)=>x-a[i]);let nn=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const len=Math.hypot(...nn)||1;nn=nn.map(x=>x/len);g.p.push(...a,...b,...c);g.n.push(...nn,...nn,...nn);}
function box(w,h,d){const g=mesh(),p=[[-w/2,-h/2,-d/2],[w/2,-h/2,-d/2],[w/2,h/2,-d/2],[-w/2,h/2,-d/2],[-w/2,-h/2,d/2],[w/2,-h/2,d/2],[w/2,h/2,d/2],[-w/2,h/2,d/2]];for(const f of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]]){tri(g,p[f[0]],p[f[1]],p[f[2]]);tri(g,p[f[0]],p[f[2]],p[f[3]]);}return g;}
function extrude(poly,h){const g=mesh();for(let i=0;i<poly.length;i++){const j=(i+1)%poly.length,a=[poly[i][0],-h/2,poly[i][1]],b=[poly[j][0],-h/2,poly[j][1]],c=[poly[j][0],h/2,poly[j][1]],d=[poly[i][0],h/2,poly[i][1]];tri(g,a,d,c);tri(g,a,c,b);tri(g,[0,h/2,0],c,d);tri(g,[0,-h/2,0],a,b);}return g;}
function cylinder(r,h){return extrude(Array.from({length:40},(_,i)=>[r*Math.cos(i*Math.PI/20),r*Math.sin(i*Math.PI/20)]),h);}
function rounded(w,h,d,r=10){const poly=[];for(const [cx,cz,a] of [[w/2-r,d/2-r,0],[-w/2+r,d/2-r,90],[-w/2+r,-d/2+r,180],[w/2-r,-d/2+r,270]])for(let i=0;i<=8;i++){const t=(a+i*90/8)*Math.PI/180;poly.push([cx+r*Math.cos(t),cz+r*Math.sin(t)]);}return extrude(poly,h);}
function part(name,g,pos,color,explode=0,group='internals',note='Ingombro concettuale da verificare'){parts.push({name,g,pos,color,explode,group,note});}
const B=(name,w,h,d,pos,color,e=0,group='internals',note)=>part(name,box(w,h,d),pos,color,e,group,note);
const C=(name,r,h,pos,color,e=0,group='internals')=>part(name,cylinder(r,h),pos,color,e,group);
const R=(name,w,h,d,r,pos,color,e=0,group='internals')=>part(name,rounded(w,h,d,r),pos,color,e,group);
// Sviluppo della sagoma in millimetri. Le quote sono ipotesi per il mockup.
const anchors = [[-85,-34],[-57,-47],[0,-49],[57,-47],[85,-34],[92,-7],[87,26],[79,51],[65,57],[47,47],[32,30],[0,24],[-32,30],[-47,47],[-65,57],[-79,51],[-87,26],[-92,-7]];
const outline = [];
for (let i=0;i<anchors.length;i++) {
  const neighbours = [-1,0,1,2].map(k=>anchors[(i+k+anchors.length)%anchors.length]);
  for(let j=0;j<6;j++) {
    const t=j/6;
    outline.push([0,1].map(axis=>{
      const [a,b,c,d]=neighbours.map(p=>p[axis]);
      return .5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
    }));
  }
}
function band(name,levels,color,group,explode,top,base) {
  const g=mesh();
  const rings=levels.map(([y,scale])=>outline.map(([x,z])=>[x*scale,y,z*scale]));
  for(let k=1;k<rings.length;k++) for(let i=0;i<outline.length;i++){
    const j=(i+1)%outline.length,a=rings[k-1],b=rings[k];
    tri(g,a[i],b[i],b[j]);tri(g,a[i],b[j],a[j]);
  }
  if(base)for(let i=0;i<outline.length;i++)tri(g,[0,levels[0][0],0],rings[0][i],rings[0][(i+1)%outline.length]);
  if(top){
    const rim=rings.at(-1),height=levels.at(-1)[0];
    const hole=rim.map(([x,y,z])=>{const dx=x-49,dz=z+8,scale=19.8/Math.max(Math.abs(dx),Math.abs(dz));return [49+dx*scale,height,-8+dz*scale]});
    for(let i=0;i<rim.length;i++){const j=(i+1)%rim.length;tri(g,rim[i],hole[i],hole[j]);tri(g,rim[i],hole[j],rim[j]);}
  }
  part(name,g,[0,0,0],color,explode,group);
}
band('Guscio inferiore a due impugnature',[[2,.82],[3.5,.88],[7,.945],[12,.982],[19,1]],'#343743','base',0,false,true);
band('Giunzione gusci',[[19,.999],[20,.999]],'#171922','base',0,false,false);
band('Calotta superiore con sede della piastra',[[20,1],[25,.99],[29,.965],[32,.918]],'#434654','cover',100,true,false);
const buttons=[['09 Precedente',-73,-10,8,colors.white],['10 Ascolta pausa',-52,-13,10,colors.orange],['11 Successivo',-30,-10,8,colors.white],['12 Descrivi',14,12,8,colors.white],['13 Arresta',48,25,9,colors.orange],['14 Richiesta termica',76,5,7,colors.white]];
for(const [name,x,z,r,col] of buttons){
  if(name.startsWith('13')) R(name,19,4,18,4,[x,34,z],col,117,'controls');
  else C(name,r,4,[x,34,z],col,117,'controls');
  if(['09','10','11'].includes(name.slice(0,2))){
    const dir=name.startsWith('09')?-1:1;
    part(name+' freccia',extrude([[-2.5*dir,-3.6],[3.3*dir,0],[-2.5*dir,3.6]],1.1),[x,36.55,z],colors.black,117,'controls');
    B(name+' battuta',1.1,1.1,7,[x+dir*4.7,36.55,z],colors.black,117,'controls');
    if(name.startsWith('10')) B('Pausa secondo rilievo',1.1,1.1,7,[x+7,36.55,z],colors.black,117,'controls');
  }
  if(name.startsWith('12'))for(const dx of [-3,0,3]) B('Descrivi righe',1.2,1.1,8,[x+dx,36.55,z],colors.black,117,'controls');
  if(name.startsWith('13')) R('Simbolo Stop',7,1.1,7,1,[x,36.55,z],colors.black,117,'controls');
  if(name.startsWith('14')) C('Punto termico',1.8,1.1,[x,36.55,z],colors.black,117,'controls');
  B(name+' interruttore',10,7,10,[x,27,z],colors.black,65);
}
C('15 Encoder volume',10,8,[-46,36,12],colors.metal,117,'controls');
B('Encoder corpo',12,9,12,[-46,27,12],colors.black,65);
// Components deliberately represented by envelopes, not copied vendor CAD.
B('16 Supporto logica',76,1.6,49,[-75,13,-30],colors.pcb,28);
B('17 ESP32 S3 Zero candidato',18,1.6,24,[-89,16,-36],colors.pcb,28,'internals','18 x 24 mm placeholder; verificare revisione e quote della scheda posseduta');
B('Modulo ESP32 schermatura',14,3,14,[-89,18.3,-33],colors.metal,28);
B('USB C ingombro',9,3.5,7,[-89,18,-49],colors.metal,28);
for(let i=0;i<6;i++)for(const x of [-97,-81])B('Pad GPIO',1.8,.3,1.8,[x,17.1,-43+i*3],colors.gold,28);
B('18 Stadio ERM e regolatore',29,2,22,[-27,13,-31],colors.pcb,28);
B('MOSFET ingombro',6,3,5,[-31,16,-31],colors.black,28);
C('19 Motore ERM',6,3,[-100,10,40],colors.metal,28);
B('20 Interruzione indipendente',30,2,22,[-55,13,19],colors.pcb,28);
B('Rele cutoff riserva',14,10,10,[-55,19,19],colors.black,28);
B('21 Driver TEC riserva',60,4,38,[83,12,-44],colors.pcb,28,'internals','Volume riservato; componente e ingombro reale non selezionati');
B('Driver potenza riserva',28,7,20,[83,17.5,-44],colors.black,28);
// Dedicated thermal stack. Fin geometry and sensor envelopes are visible.
B('22 Dissipatore base',49,4,45,[85,12,8],colors.metal,34);
for(let i=0;i<9;i++)B('Aletta dissipatore',2,15,45,[65+i*5,21.5,8],colors.metal,34);
B('23 Cella TEC riserva',30,3.5,30,[85,31,8],colors.white,61);
B('24 Piastra di contatto',39,4,39,[85,36,8],colors.metal,88);
B('25 Sensore piastra',3,2,3,[104,35,8],colors.orange,88);
B('26 Sensore dissipatore',3,2,3,[109,14,8],colors.orange,34);
B('27 Sensore indipendente',3,2,3,[85,35,27],colors.orange,88);
C('28 Ventola ingombro',17,6,[85,6,8],colors.black,16);
B('29 Connettore alimentazione',10,10,12,[111,19,-65],colors.black,28);
B('30 Interfaccia comunicazione riserva',18,2,14,[7,13,-38],colors.pcb,28);
// Traslazioni per sottogruppo: le dimensioni dei moduli rimangono quelle preliminari.
for(const item of parts.slice(parts.findIndex(p=>p.name==='16 Supporto logica'))){
  const [x,y,z]=item.pos; if(item.name.startsWith("29 Connettore")){item.pos=[58,14,-37];continue;} if(item.name.startsWith("20 ")||item.name.startsWith("Rele cutoff")){item.pos=[-24,y-3,8];continue;}
  if(x>=60){
    item.pos=[x-36,y-4,z+(z < -30 ? 15 : -16)];
    if(item.name.startsWith('21 ')||item.name.startsWith('Driver potenza')){
      item.pos=[x-73,y-4,z+16];
    }
  }else{
    item.pos=[x+26,y-3,z*.72];
  }
}
// Export mesh data; no hidden dependency on any CAD application.
const gltf={asset:{version:'2.0',generator:'ORBIT concept model',extras:{status:'Concept only - not manufacturing CAD'}},scene:0,scenes:[{nodes:[]}],nodes:[],meshes:[],materials:[],buffers:[],bufferViews:[],accessors:[]};
const chunks=[];let offset=0;const matMap=new Map();
function accessor(array,type){const a=new Float32Array(array),buf=Buffer.from(a.buffer),idx=gltf.bufferViews.length;gltf.bufferViews.push({buffer:0,byteOffset:offset,byteLength:buf.length,target:34962});offset+=buf.length;chunks.push(buf);const acc={bufferView:idx,componentType:5126,count:array.length/3,type:'VEC3'};if(type==='position'){acc.min=[0,1,2].map(j=>Math.min(...array.filter((_,i)=>i%3===j)));acc.max=[0,1,2].map(j=>Math.max(...array.filter((_,i)=>i%3===j)));}gltf.accessors.push(acc);return gltf.accessors.length-1;}
function material(hex){if(matMap.has(hex))return matMap.get(hex);const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);const i=gltf.materials.length;gltf.materials.push({name:hex,pbrMetallicRoughness:{baseColorFactor:[...rgb,1],metallicFactor:hex===colors.metal?.6:0,roughnessFactor:.55},doubleSided:true});matMap.set(hex,i);return i;}
for(const p of parts){const pos=accessor(p.g.p.map(v=>v/1000),'position'),norm=accessor(p.g.n,'normal');gltf.meshes.push({name:p.name,primitives:[{attributes:{POSITION:pos,NORMAL:norm},material:material(p.color)}]});const index=gltf.nodes.length;gltf.nodes.push({name:p.name,mesh:index,translation:p.pos.map(v=>v/1000),extras:{group:p.group,explosionY:p.explode/1000,note:p.note}});gltf.scenes[0].nodes.push(index);}
gltf.buffers=[{byteLength:offset}];
function writeGLB(name,exploded){const json=JSON.parse(JSON.stringify(gltf));if(exploded)for(const node of json.nodes)node.translation[1]+=node.extras.explosionY;let jb=Buffer.from(JSON.stringify(json));jb=Buffer.concat([jb,Buffer.alloc((4-jb.length%4)%4,32)]);const bin=Buffer.concat(chunks),head=Buffer.alloc(12),jh=Buffer.alloc(8),bh=Buffer.alloc(8);head.writeUInt32LE(0x46546c67);head.writeUInt32LE(2,4);head.writeUInt32LE(28+jb.length+bin.length,8);jh.writeUInt32LE(jb.length);jh.writeUInt32LE(0x4e4f534a,4);bh.writeUInt32LE(bin.length);bh.writeUInt32LE(0x004e4942,4);fs.writeFileSync(path.join(__dirname,name),Buffer.concat([head,jh,jb,bh,bin]));}
writeGLB('orbit-controller.glb',false);writeGLB('orbit-controller-exploded.glb',true);
fs.writeFileSync(path.join(__dirname,'components.json'),JSON.stringify(parts.map(({g,...p})=>p),null,2));
const template=fs.readFileSync(path.join(__dirname,'viewer-template.html'),'utf8');
fs.writeFileSync(path.join(__dirname,'controller-3d.html'),template.replace('/*MODEL_DATA*/',JSON.stringify(parts)));
console.log(JSON.stringify({parts:parts.length,triangles:parts.reduce((s,p)=>s+p.g.p.length/9,0),files:['orbit-controller.glb','orbit-controller-exploded.glb','controller-3d.html','components.json']}));

