'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {features,select,render} = require('../cinque-flauti/genera.cjs');
const {spawnSync} = require('node:child_process');

function cello(phase,hz) {
  let sum=0;
  for(let k=1;k<=12;k++) {
    const f=k*hz;
    const body=0.7+0.65*Math.exp(-((f-540)**2)/(2*150**2))
      +0.62*Math.exp(-((f-1450)**2)/(2*340**2));
    sum+=body*Math.sin(k*phase+0.14*(k-1))/(k**1.23);
  }
  return sum*0.62;
}
function glassVoice() {
  let upper=0, sheen=0;
  return (phase,hz,rate)=>{
    const sample=Math.sin(phase)+0.21*Math.sin(upper)+0.055*Math.sin(sheen);
    upper=(upper+2*Math.PI*2.71*hz/rate)%(2*Math.PI);
    sheen=(sheen+2*Math.PI*4.67*hz/rate)%(2*Math.PI);
    return sample*0.81;
  };
}
function integrated(wav) {
  const run=spawnSync('ffmpeg',['-hide_banner','-nostats','-i','pipe:0',
    '-af','loudnorm=print_format=json','-f','null','-'],{input:wav,encoding:null});
  if(run.status!==0)throw Error(String(run.stderr));
  return Number(JSON.parse(run.stderr.toString().match(/\{[^{}]*"input_i"[^{}]*\}/s)[0]).input_i);
}
const scores=features(path.resolve(__dirname,'../cinque-flauti/fuji-2013.jpg'));
const seq=select(scores);
const ref=fs.readFileSync(path.resolve(__dirname,'../cinque-flauti/fuji-2013.wav'));
if(!ref.equals(render(scores,seq)))throw Error('La partitura del Fuji è cambiata');
const target=integrated(ref);
for(const [name,voice] of [['violoncello',cello],['vetro',glassVoice()]]) {
  const wav=render(scores,seq,voice);
  const gain=10**((target-integrated(wav))/20);
  for(let i=44;i<wav.length;i+=2){
    const value=Math.round(wav.readInt16LE(i)*gain);
    if(Math.abs(value)>32767)throw Error('Clipping');
    wav.writeInt16LE(value,i);
  }
  const measured=integrated(wav);
  if(Math.abs(measured-target)>0.2)throw Error('Scarto di volume');
  fs.writeFileSync(path.join(__dirname,'fuji-'+name+'.wav'),wav);
  console.log(name,measured,'LUFS; riferimento',target);
}
