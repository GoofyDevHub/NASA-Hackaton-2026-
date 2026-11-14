'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const columns = 16, rows = 3, rate = 32000;
const beat = 0.6, frames = Math.round(columns * beat * rate);
const midi = [69, 64, 57]; // A4, E4, A3 from north to south.
const offsets = [0.10, 0.05, 0]; // Upward brush inside each column.
const root = path.resolve(__dirname, '../../dati-nasa');
const dates = [
  ['gennaio', '20260115'], ['aprile', '20260415'],
  ['luglio', '20260715'], ['ottobre', '20261015']
];
const ocean = { x: 1904, y: 916, width: 1152, height: 216 };
const florida = { x: 96, y: 240, width: 1728, height: 1512 };
const scenes = [
  ...dates.map(([name, date]) => ({name, family: 'ocean', file: 'sst_mur_anomaly_pacific_' + date + '.exr', crop: ocean})),
  ...[['prima', 'aug'], ['dopo', 'sep']].map(([name, month]) =>
    ({name, family: 'lights', file: 'black_marble_' + month + '2160.png', crop: florida}))
];

function extract(scene) {
  const {width, height, x, y} = scene.crop;
  const rgb = execFileSync('ffmpeg', ['-nostdin','-v','error','-xerror','-threads','1','-i',path.join(root,scene.file),
    '-vf',`crop=${width}:${height}:${x}:${y},format=rgb24`,'-frames:v','1','-f','rawvideo','pipe:1'],
    {maxBuffer: width * height * 3 + 65536});
  if (rgb.length !== width * height * 3) throw Error('Incomplete raster: ' + scene.file);
  const grid = Array.from({length:rows}, () => Array.from({length:columns}, () => ({warm:0, cool:0, light:0})));
  const cellWidth = width / columns, cellHeight = height / rows;
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const offset = 3 * (py * width + px);
      const [r,g,b] = [rgb[offset], rgb[offset+1], rgb[offset+2]];
      const cell = grid[Math.floor(py/cellHeight)][Math.floor(px/cellWidth)];
      if (scene.family === 'lights') {
        if (Math.max(r,g,b) - Math.min(r,g,b) >= 32) cell.light++;
      } else if (r - b > 12) cell.warm++;
      else if (b - r > 12) cell.cool++;
    }
  }
  for (const row of grid) for (const cell of row) {
    for (const kind of Object.keys(cell)) cell[kind] /= cellWidth * cellHeight;
  }
  return grid;
}

// Overlap-add on a circle retains the preceding measure's ringing tails in the loop.
function synthesize(grid) {
  const out = new Float64Array(frames);
  for (let row = 0; row < rows; row++) {
    const hz = 440 * 2 ** ((midi[row] - 69) / 12);
    for (let col = 0; col < columns; col++) {
      const start = Math.round((col * beat + offsets[row]) * rate);
      const cell = grid[row][col];
      for (const [kind, coverage] of Object.entries(cell)) {
        if (coverage === 0) continue;
        const amp = 0.15 * Math.sqrt(coverage);
        const length = kind === 'warm' ? 0.85 : 0.67;
        for (let n = 0; n < Math.round(length * rate); n++) {
          const t = n / rate;
          const phase = 2 * Math.PI * hz * t;
          let sample;
          if (kind === 'warm') {
            const bow = (1 - Math.exp(-t / 0.053)) * Math.exp(-t / 0.33);
            sample = bow * (Math.sin(phase) + 0.45*Math.sin(2*phase) + 0.17*Math.sin(3*phase));
          } else {
            const strike = (1 - Math.exp(-t / 0.006)) * Math.exp(-t / 0.19);
            const overtone = kind === 'cool' ? 2.71 : 2;
            sample = 1.12 * strike * (Math.sin(phase) + 0.70*Math.exp(-t/0.12)*Math.sin(overtone*phase));
          }
          const release = Math.min(1, (length-t)/0.06);
          out[(start+n) % frames] += amp * sample * release;
        }
      }
    }
  }
  return out;
}

function pack(samples) {
  const bytes = samples.length * 2;
  const wav = Buffer.alloc(44 + bytes);
  wav.write('RIFF'); wav.writeUInt32LE(36+bytes,4); wav.write('WAVEfmt ',8);
  wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20); wav.writeUInt16LE(1,22);
  wav.writeUInt32LE(rate,24); wav.writeUInt32LE(rate*2,28); wav.writeUInt16LE(2,32);
  wav.writeUInt16LE(16,34); wav.write('data',36); wav.writeUInt32LE(bytes,40);
  for (let k=0;k<samples.length;k++) {
    if (!Number.isFinite(samples[k]) || Math.abs(samples[k]) >= 1) throw Error('PCM out of range');
    wav.writeInt16LE(Math.round(samples[k]*32767),44+k*2);
  }
  return wav;
}

function pair(a,b) {
  const pause = Math.round(0.5*rate);
  const out = new Float64Array(frames*2 + pause);
  for (const [index,scene] of [a,b].entries()) {
    for (let n=0;n<frames;n++) {
      const edge = Math.min(1,n/(0.025*rate),(frames-1-n)/(0.025*rate));
      out[index*(frames+pause)+n] = scene[n]*edge;
    }
  }
  return out;
}

const signals = {};
const report = {version:1, node:process.version, ffmpeg:execFileSync('ffmpeg',['-version'],{encoding:'utf8'}).split(/\r?\n/)[0],
  sampleRate:rate, columns, rows, secondsPerColumn:beat, scenes:[]};
for (const scene of scenes) {
  const grid = extract(scene);
  const signal = synthesize(grid);
  signals[scene.name] = signal;
  const wav = pack(signal);
  fs.writeFileSync(path.join(__dirname,scene.name+'.wav'),wav);
  const peak = signal.reduce((m,x)=>Math.max(m,Math.abs(x)),0);
  report.scenes.push({...scene, sourceSha256:crypto.hash('sha256',fs.readFileSync(path.join(root,scene.file))),
    wavSha256:crypto.hash('sha256',wav), peakDbFS:+(20*Math.log10(peak)).toFixed(2),
    seamStep:+Math.abs(signal.at(-1)-signal[0]).toFixed(6),grid});
}
for (const [name,a,b] of [['pacifico-ab','gennaio','ottobre'],['florida-ab','prima','dopo']]) {
  fs.writeFileSync(path.join(__dirname,name+'.wav'),pack(pair(signals[a],signals[b])));
}
fs.writeFileSync(path.join(__dirname,'misure.json'),JSON.stringify(report,null,2)+'\n');

