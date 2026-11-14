// Listening studies only: synthetic inputs, not the ORBIT product engine.
const fs = require('node:fs');
const path = require('node:path');
const sr = 44100, duration = 17, n = sr * duration;
const tau = 2 * Math.PI;
const A = [-0.6, -0.3, 0.1, 0.6, 0.8, 0.2, -0.2, -0.4];
const B = [-0.6, -0.3, 0.1, 0.8, 1.0, 0.65, 0.2, -0.4];
const scale = [0, 2, 4, 7, 9, 12, 14, 16];
const freq = midi => 440 * 2 ** ((midi - 69) / 12);
const ramp = (t, len, edge) => Math.max(0, Math.min(1, t / edge, (len - t) / edge));
function add(out, start, len, pan, synth) {
  const left = Math.cos((pan + 1) * Math.PI / 4);
  const right = Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < Math.ceil(len * sr); i++) {
    const k = Math.round(start * sr) + i;
    if (k < 0 || k >= n) continue;
    const v = synth(i / sr) * ramp(i / sr, len, 0.04);
    out[0][k] += v * left; out[1][k] += v * right;
  }
}
function canon(out, values, start) {
  // Eight positions, equal timing. Sign changes harmonic colour; |value| pitch.
  values.forEach((z, j) => {
    const f = freq(48 + scale[Math.min(7, Math.floor(Math.abs(z) * 7))]);
    const p = (j / 7 * 2 - 1) * 0.65;
    for (let cycle = 0; cycle < 2; cycle++) {
      const t0 = cycle * 4 + j * 0.5;
      add(out, start + t0, Math.min(1.2, 8 - t0), p, t => {
        const tone = Math.sin(tau*f*t) + (z >= 0 ? 0.30 : 0.07)*Math.sin(tau*2*f*t)
          + (z >= 0 ? 0.04 : 0.19)*Math.sin(tau*3*f*t);
        return 0.075 * Math.exp(-t * 3.2) * tone;
      });
      // A delayed, quieter octave answer gives the canon its signature.
      const echo = t0 + 0.25;
      if (echo < 8) add(out, start + echo, Math.min(0.7, 8 - echo), -p,
        t => 0.018 * Math.exp(-t * 5) * Math.sin(tau * 2*f*t));
    }
  });
}
function tide(out, values, start) {
  // Fixed harmonic bank. Input changes spectral balance, not the tuning system.
  const centers = [-1, -0.5, 0, 0.5, 1];
  const notes = [48, 55, 60, 62, 67];
  centers.forEach((center, j) => {
    const weight = values.reduce((s, z) => s + Math.max(0, 1 - Math.abs(z-center)/0.5), 0) / values.length;
    const f = freq(notes[j]);
    add(out, start, 8, (j-2)*0.16, t => {
      const breath = 0.76 + 0.24*Math.cos(tau*t/4);
      return 0.19 * weight * breath * ramp(t, 8, 0.65) *
        (Math.sin(tau*f*t) + 0.18*Math.sin(tau*2*f*t) + 0.07*Math.sin(tau*4*f*t));
    });
  });
}
function islands(out, values, start) {
  // Connected intervals are a 1D proxy for future connected map regions.
  const regions = [];
  for (let j=0; j<values.length; j++) {
    const z = values[j]; if (Math.abs(z) < 0.25) continue;
    const last = regions[regions.length-1];
    if (last && last.end === j-1 && last.sign === Math.sign(z)) {
      last.end = j; last.sum += z;
    } else regions.push({begin:j, end:j, sum:z, sign:Math.sign(z)});
  }
  regions.forEach(region => {
    const count = region.end-region.begin+1;
    const strength = Math.abs(region.sum/count);
    const f = freq(48 + scale[Math.min(7, Math.floor(strength*7))]);
    const pan = ((region.begin+region.end)/14*2-1)*0.65;
    const len = 1.0 + count*0.45;
    for (let cycle=0; cycle<2; cycle++) {
      const at = cycle*4 + (region.begin+region.end)/2*0.28;
      add(out, start+at, Math.min(len, 8-at), pan, t => {
        const fundamental = Math.sin(tau*f*t)*Math.exp(-t/(0.35+count*0.17));
        const upper = 0.24*Math.sin(tau*f*(region.sign>0?2:3)*t)*Math.exp(-t*4);
        return 0.075*Math.sqrt(count/3)*(fundamental+upper);
      });
    }
  });
}
function writeWav(filename, channels) {
  const dataBytes=n*4, b=Buffer.alloc(44+dataBytes);
  b.write('RIFF',0); b.writeUInt32LE(36+dataBytes,4); b.write('WAVEfmt ',8);
  b.writeUInt32LE(16,16); b.writeUInt16LE(1,20); b.writeUInt16LE(2,22);
  b.writeUInt32LE(sr,24); b.writeUInt32LE(sr*4,28); b.writeUInt16LE(4,32);
  b.writeUInt16LE(16,34); b.write('data',36); b.writeUInt32LE(dataBytes,40);
  let peak=0, energy=0, maximumStep=0;
  for(let k=0;k<n;k++) for(let c=0;c<2;c++) {
    const v=channels[c][k];
    if(!Number.isFinite(v) || Math.abs(v)>=1) throw Error('Invalid or clipped PCM');
    peak=Math.max(peak,Math.abs(v)); energy+=v*v;
    if(k) maximumStep=Math.max(maximumStep,Math.abs(v-channels[c][k-1]));
    b.writeInt16LE(Math.round(v*32767),44+(k*2+c)*2);
  }
  fs.writeFileSync(path.join(__dirname,filename),b);
  return {filename,durationSeconds:duration,sampleRate:sr,peak,peakDbFS:20*Math.log10(peak),rms:Math.sqrt(energy/(n*2)),maximumSampleStep:maximumStep,bytes:b.length};
}
const report=[];
for(const [name,render] of [['canone-orbitale',canon],['marea-spettrale',tide],['arcipelago-risonante',islands]]) {
  const out=[new Float64Array(n),new Float64Array(n)];
  render(out,A,0); render(out,B,8.5);
  report.push(writeWav(`${name}.wav`,out));
}
fs.writeFileSync(path.join(__dirname,'measurements.json'),JSON.stringify({
  purpose:'Synthetic listening studies; not NASA data or validated product algorithms',
  inputs:{A,B},segments:{A:[0,8],silence:[8,8.5],B:[8.5,16.5]},
  normalization:'No per-image normalization; algorithm gains differ; not perceptually loudness matched',
  results:report
},null,2));
console.log(JSON.stringify(report,null,2));
