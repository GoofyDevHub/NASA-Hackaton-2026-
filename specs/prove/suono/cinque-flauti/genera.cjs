'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const assert = require('node:assert/strict');

const width=240, rows=5, rate=32000, seconds=12;
const step=rate*seconds/width;
const notes=[72,69,67,65,62]; // C5, A4, G4, F4, D4 from top to bottom
const margin=0.035, on=0.065, off=0.045, persistence=6;
function features(file) {
  const rgb=execFileSync('ffmpeg',['-nostdin','-v','error','-xerror','-i',file,
    '-vf','format=rgb24,scale=240:5:flags=area+accurate_rnd+bitexact,format=rgb24',
    '-frames:v','1','-f','rawvideo','pipe:1']);
  assert.equal(rgb.length,width*rows*3);
  return Array.from({length:width},(_,x)=>{
    const colours=Array.from({length:rows},(_,y)=>{
      const i=3*(y*width+x);return [rgb[i],rgb[i+1],rgb[i+2]];
    });
    const background=[0,1,2].map(ch=>colours.map(rgb=>rgb[ch]).sort((a,b)=>a-b)[2]);
    return colours.map(rgb=>Math.hypot(...rgb.map((v,ch)=>v-background[ch]))/(255*Math.sqrt(3)));
  });
}
function select(scores) {
  let active=-1, pending=-2, age=0;
  return scores.map(column=>{
    const high=Math.max(...column), winner=column.indexOf(high);
    let request=active;
    if(high<off) request=-1;
    else if(high>=on && (active===-1 || high>column[active]+margin)) request=winner;
    if(request!==pending){pending=request;age=0;}
    if(++age>=persistence) active=pending;
    return active;
  });
}
function flute(phase) {
  return Math.sin(phase)+0.14*Math.sin(2*phase)+0.055*Math.sin(3*phase);
}
function render(scores,sequence,voice=flute) {
  const frames=step*width, freq=new Float64Array(frames), amp=new Float64Array(frames);
  let pitch=62, gain=0;
  const glide=1-Math.exp(-1/(rate*0.055)), breath=1-Math.exp(-1/(rate*0.045));
  for(let n=0;n<frames;n++){
    const x=Math.floor(n/step), row=sequence[x];
    if(row>=0) pitch+=glide*(notes[row]-pitch);
    const target=row<0?0:0.11+0.13*Math.min(1,scores[x][row]/0.55);
    gain+=breath*(target-gain);
    freq[n]=440*2**((pitch-69)/12);
    // The last columns are kept. Fade at playback boundaries.
    const edge=Math.min(1,n/(rate*0.035),(frames-1-n)/(rate*0.065));
    amp[n]=gain*edge;
  }
  const wav=Buffer.alloc(44+2*frames);
  wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);
  wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
  wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);
  wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(frames*2,40);
  let phase=0;
  for(let n=0;n<frames;n++) {
    const tone=voice(phase,freq[n],rate);
    wav.writeInt16LE(Math.round(32767*amp[n]*tone),44+2*n);
    phase=(phase+2*Math.PI*freq[n]/rate)%(2*Math.PI);
  }
  return wav;
}
function spans(seq) {
  const segments=[];
  for(let x=0;x<seq.length;x++){
    if(x===0 || seq[x]!==seq[x-1]) segments.push({start:x*seconds/width,band:seq[x]});
  }
  return segments;
}
module.exports = {features, select, render};

if (require.main === module) {
  assert.ok(select(Array.from({length:width},()=>[0,0,0,0,0])).every(b=>b===-1));
  const moving=Array.from({length:width},(_,x)=>Array.from({length:rows},(_,r)=>r===(x<120?4:0)?0.4:0));
  assert.equal(select(moving)[119],4);assert.equal(select(moving)[125],0);
  const files = [
    ["gennaio","../linea-continua/gennaio-ritaglio.png"],
    ["ottobre","../linea-continua/ottobre-ritaglio.png"],
    ["fuji-2013","fuji-2013.jpg"],
    ["fuji-2021","fuji-2021.jpg"],
    ["florida-prima","florida-prima.png"],
    ["florida-dopo","florida-dopo.png"]
  ];
  for(const [name,file] of files){
    const scores=features(path.join(__dirname,file)), seq=select(scores);
    const wav=render(scores,seq);
    fs.writeFileSync(path.join(__dirname,name+'.wav'),wav);
    console.log(name,JSON.stringify(spans(seq)));
  }
}
