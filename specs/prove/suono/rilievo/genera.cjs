'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {createHash} = require('node:crypto');

const width=1152, height=216, seconds=12, rate=32000, frames=seconds*rate;
const reference=path.resolve(__dirname,'../linea-continua');
const registers=[64,57,50]; // E4, A3, D3 from north to south
const tau=2*Math.PI;
function decode(file, filter, byteLength) {
  const raw=execFileSync('ffmpeg',['-v','error','-xerror','-i',path.join(reference,file),'-vf',filter,
    '-pix_fmt','rgb24','-frames:v','1','-f','rawvideo','pipe:1'],{maxBuffer:byteLength+4096});
  if (raw.length!==byteLength) throw Error('Dimensione inattesa per '+file);
  return raw;
}
const bar=decode('legenda-svs-5176.exr','crop=3072:2:512:1024,format=rgb24',3072*2*3);
const palette=Array.from({length:65},(_,j)=>{
  const k=3*Math.round(j*3071/64);
  return {r:bar[k],g:bar[k+1],b:bar[k+2],z:(j-32)/32};
});
const cache=new Map();
function colour(r,g,b) {
  const key=(r<<16)|(g<<8)|b;
  if(cache.has(key)) return cache.get(key);
  let best=Infinity, z=null;
  if(Math.max(r,g,b)-Math.min(r,g,b)>=8) {
    for(const entry of palette) {
      const d=(r-entry.r)**2+(g-entry.g)**2+(b-entry.b)**2;
      if(d<best){best=d;z=entry.z;}
    }
  }
  if(best>55**2) z=null;
  cache.set(key,z);
  return z;
}
function scan(rgb,flip) {
  return registers.map((_,row)=>Array.from({length:width},(_,x)=>{
    let cold=0,warm=0,near=0;
    for(let j=0;j<height/3;j++){
      const y=row*height/3+j;
      const k=3*((flip?height-1-y:y)*width+x);
      const z=colour(rgb[k],rgb[k+1],rgb[k+2]);
      if(z===null) continue;
      // Expand subtle colour differences with the same fixed curve for both dates.
      const weight=Math.sqrt(Math.abs(z));
      if(z<0) cold+=weight; else warm+=weight;
      near+=1-weight;
    }
    return [cold,warm,near].map(v=>v/(height/3));
  }));
}
function smooth(line) {
  const radius=9;
  const kernel=Array.from({length:2*radius+1},(_,j)=>0.5+0.5*Math.cos(Math.PI*(j-radius)/radius));
  const total=kernel.reduce((a,b)=>a+b,0);
  return line.map((_,x)=>{
    const result=[0,0,0];
    kernel.forEach((v,j)=>{
      const bands=line[Math.max(0,Math.min(width-1,x+j-radius))];
      for(let k=0;k<3;k++) result[k]+=v*bands[k]/total;
    });
    return result;
  });
}
function render(rows) {
  const dry=new Float64Array(frames), reflected=new Float64Array(frames);
  rows.forEach((row,reg)=>{
    const line=smooth(row);
    // Whole cycles per pass keep the waveform phase continuous across a loop.
    const hz=Math.round(seconds*440*2**((registers[reg]-69)/12))/seconds;
    for(let n=0;n<frames;n++){
      const x=(width-1)*n/(frames-1), i=Math.floor(x);
      const a=line[i], b=line[Math.min(i+1,width-1)], mix=x-i;
      const tail=Math.max(0,(n-(frames-1-0.18*rate))/(0.18*rate));
      const join=tail*tail*(3-2*tail);
      const weighted=(k)=> (a[k]+mix*(b[k]-a[k]))*(1-join)+line[0][k]*join;
      const cold=weighted(0),warm=weighted(1),near=weighted(2);
      const p=tau*hz*n/rate;
      const base=Math.sin(p);
      const flute=base+0.16*Math.sin(3*p);
      const reed=base+0.73*Math.sin(2*p)+0.27*Math.sin(4*p);
      const relief=0.205*(cold*flute+warm*reed);
      const middle=0.075*near*base;
      dry[n]+=relief+middle;
      reflected[n]+=0.10*relief+0.8*middle;
    }
  });
  const channels=[new Float64Array(frames),new Float64Array(frames)];
  for(let n=0;n<frames;n++){
    for(let ch=0;ch<2;ch++){
      const delays=ch===0?[19,43,79]:[23,53,83];
      let value=0.83*dry[n];
      for(let k=0;k<3;k++) value+=[0.30,0.18,0.10][k]*reflected[(n+frames-delays[k]*rate/1000)%frames];
      channels[ch][n]=value;
    }
  }
  return channels;
}
function save(name,channels) {
  const count=channels[0].length, bytes=count*4;
  const wav=Buffer.alloc(44+bytes);
  wav.write('RIFF');wav.writeUInt32LE(36+bytes,4);wav.write('WAVEfmt ',8);
  wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);
  wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*4,28);wav.writeUInt16LE(4,32);
  wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(bytes,40);
  let peak=0;
  for(let i=0;i<count;i++)for(let ch=0;ch<2;ch++){
    const v=channels[ch][i];
    if(!Number.isFinite(v)||Math.abs(v)>=1)throw Error('Campione fuori intervallo');
    peak=Math.max(peak,Math.abs(v));wav.writeInt16LE(Math.round(32767*v),44+4*i+ch*2);
  }
  fs.writeFileSync(path.join(__dirname,name+'.wav'),wav);
  console.log(name,peak.toFixed(3),createHash('sha256').update(wav).digest('hex'));
}
function excerptPair(a,b) {
  const begin=3*rate, len=6*rate, gap=rate/2;
  return [0,1].map(ch=>{
    const out=new Float64Array(2*len+gap);
    for(let i=0;i<len;i++){
      const edge=Math.min(1,i/(0.025*rate),(len-1-i)/(0.025*rate));
      out[i]=a[ch][begin+i]*edge;
      out[len+gap+i]=b[ch][begin+i]*edge;
    }
    return out;
  });
}
for(const month of ['gennaio','ottobre']){
  const rgb=decode(month+'-ritaglio.png','format=rgb24',width*height*3);
  const origin=scan(rgb,false), audio=render(origin);
  save(month,audio);
  if(month==='gennaio'){
    const flipped=scan(rgb,true);
    for(let row=0;row<3;row++)for(let x=0;x<width;x++)for(let k=0;k<3;k++)
      if(Math.abs(origin[row][x][k]-flipped[2-row][x][k])>1e-10)throw Error('Prova speculare fallita');
    save('prova-alto-basso',excerptPair(audio,render(flipped)));
    for(const row of origin){
      const span=row.slice(288,864);
      console.log('quote pesate freddo/caldo/centro', [0,1,2].map(k=>(span.reduce((s,v)=>s+v[k],0)/span.length).toFixed(3)).join(' '));
    }
  }
}
