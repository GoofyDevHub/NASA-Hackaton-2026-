'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');

const width = 1152, height = 216, rate = 32000, seconds = 12;
const notes = [50, 53, 55, 57, 60]; // D3, F3, G3, A3, C4
const names = ['blu scuro', 'blu', 'centro legenda', 'arancio', 'rosso scuro'];
const frames = rate * seconds;
function decode(file, filter, bytes) {
  const result = execFileSync('ffmpeg', ['-nostdin','-v','error','-xerror','-threads','1',
    '-i',file,'-vf',filter+',format=rgb24','-frames:v','1','-f','rawvideo','pipe:1'],
    {maxBuffer:bytes + 4096});
  if (result.length !== bytes) throw Error('Dimensione RGB inattesa');
  return result;
}
const paletteFile = path.join(__dirname,'legenda-svs-5176.exr');
// Sample along the bar's central row, clear of ticks, text and arrowheads.
const bar = decode(paletteFile,'crop=3072:2:512:1024',3072*2*3);
const swatches = Array.from({length:65}, (_,j) => {
  const k = 3 * Math.round(j*3071/64);
  const position = j/64;
  const family = [0.3125,0.4375,0.5625,0.6875].filter(boundary=>position>=boundary).length;
  return {r:bar[k],g:bar[k+1],b:bar[k+2], family};
});

function scan(rgb) {
  const counts = [];
  const cache = new Map();
  for (let x=0;x<width;x++) {
    const hist = [0,0,0,0,0];
    for (let y=0;y<height;y++) {
      const k=3*(y*width+x), r=rgb[k],g=rgb[k+1],b=rgb[k+2];
      const key=(r<<16)|(g<<8)|b;
      let family=cache.get(key);
      if (family === undefined) {
        family=-1;
        let best=Infinity;
        if (Math.max(r,g,b)-Math.min(r,g,b)>=8) {
          for (const s of swatches) {
            const dist=(s.r-r)**2+(s.g-g)**2+(s.b-b)**2;
            if (dist<best) {best=dist;family=s.family;}
          }
          if(best>55**2) family=-1;
        }
        cache.set(key,family);
      }
      if(family>=0) hist[family]++;
    }
    counts.push(hist);
  }
  let current=2;
  return counts.map((_,x)=>{
    const votes=[0,0,0,0,0];
    const left=Math.max(0,x-4),right=Math.min(width-1,x+4);
    for(let j=left;j<=right;j++) for(let f=0;f<5;f++) votes[f]+=counts[j][f];
    const valid=votes.reduce((a,b)=>a+b,0);
    const winner=votes.indexOf(Math.max(...votes));
    // Keep the previous class when the difference is smaller than 4% of valid votes.
    if(valid && votes[winner]-votes[current]>0.04*valid) current=winner;
    const coverage=valid/((right-left+1)*height);
    return {family:current, gain:Math.min(1,coverage/0.15), coverage};
  });
}

function controls(line) {
  // Round pitch transitions in log-frequency space with a symmetric Hann window.
  const radius=12;
  const weights=Array.from({length:radius*2+1},(_,k)=>0.5+0.5*Math.cos(Math.PI*(k-radius)/radius));
  const sum=weights.reduce((a,b)=>a+b,0);
  return line.map((_,i)=>{
    let pitch=0,gain=0;
    for(let k=0;k<weights.length;k++) {
      const j=Math.max(0,Math.min(width-1,i+k-radius));
      pitch+=weights[k]*notes[line[j].family];
      gain+=weights[k]*line[j].gain;
    }
    return {pitch:pitch/sum,gain:gain/sum};
  });
}

function render(points) {
  const frequencies=new Float64Array(frames), gains=new Float64Array(frames);
  let cycles=0;
  for(let n=0;n<frames;n++) {
    const x=n*(width-1)/(frames-1);
    const i=Math.floor(x),a=points[i],b=points[Math.min(width-1,i+1)], mix=x-i;
    let midi=a.pitch+(b.pitch-a.pitch)*mix, gain=a.gain+(b.gain-a.gain)*mix;
    // Return to the opening colour over the last 0.18 s for cyclic playback.
    const tail=(n-(frames-1-0.18*rate))/(0.18*rate);
    if(tail>0) {
      const t=tail*tail*(3-2*tail);
      midi+=(points[0].pitch-midi)*t;
      gain+=(points[0].gain-gain)*t;
    }
    frequencies[n]=440*2**((midi-69)/12);
    gains[n]=gain;
    cycles+=frequencies[n]/rate;
  }
  const tune=Math.round(cycles)/cycles;
  const pcm=Buffer.alloc(frames*2);
  let phase=0, peak=0, minWindowRms=1, energy=0;
  for(let n=0;n<frames;n++) {
    const s=0.26*gains[n]*(Math.sin(phase)+0.22*Math.sin(2*phase)+0.08*Math.sin(3*phase));
    peak=Math.max(peak,Math.abs(s)); energy+=s*s;
    if((n+1)%(rate/20)===0) {minWindowRms=Math.min(minWindowRms,Math.sqrt(energy/(rate/20)));energy=0;}
    pcm.writeInt16LE(Math.round(s*32767),2*n);
    phase+=2*Math.PI*frequencies[n]*tune/rate;
    phase%=2*Math.PI;
  }
  const wav=execFileSync('ffmpeg',['-v','error','-f','s16le','-ar',String(rate),'-ac','1','-i','pipe:0',
    '-map_metadata','-1','-fflags','+bitexact','-c:a','pcm_s16le','-f','wav','pipe:1'],
    {input:pcm,maxBuffer:pcm.length+4096});
  // Supply finite RIFF lengths (FFmpeg cannot seek backwards on stdout).
  const data=wav.indexOf('data',36);
  if(data<0 || wav.length-data-8!==pcm.length) throw Error('Contenitore WAV inatteso');
  wav.writeUInt32LE(wav.length-8,4); wav.writeUInt32LE(pcm.length,data+4);
  return {wav, peak, minWindowRms, tuningCents:1200*Math.log2(tune)};
}
const results=[];
for (const [name,date] of [['gennaio','20260115'],['ottobre','20261015']]) {
  const file=path.resolve(__dirname,'../../dati-nasa','sst_mur_anomaly_pacific_'+date+'.exr');
  const line=scan(decode(file,'crop=1152:216:1904:916',width*height*3));
  const {wav,...metrics}=render(controls(line));
  fs.writeFileSync(path.join(__dirname,name+'.wav'),wav);
  const tally=names.map((family,f)=>({family,columns:line.filter(p=>p.family===f).length}));
  results.push({name,tally, ...metrics, minimumCoverage:Math.min(...line.map(p=>p.coverage)),
    sha256:crypto.hash('sha256',wav)});
}
console.log(JSON.stringify(results,null,2));
