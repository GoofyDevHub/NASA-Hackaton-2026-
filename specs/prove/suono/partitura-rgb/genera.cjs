'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const assert = require('node:assert/strict');

const columns = 48, rows = 8, channels = 3;
const rate = 24000, window = rate / 8, block = 2 * window;
const gain = 0.035;
const bins = [53,43,37,29,23,19,17,13]; // top to bottom
const tones = bins.flatMap(bin => [bin, 2*bin, 3*bin]);
assert.equal(new Set(tones).size, rows*channels);
const waves = tones.map(bin => Float64Array.from({length: window},
  (_,i) => Math.sin(2*Math.PI*bin*i/window)));
const easing = Float64Array.from({length: window},
  (_,i) => 0.5 - 0.5*Math.cos(Math.PI*i/(window-1)));

function grid(file) {
  const result = execFileSync('ffmpeg',['-nostdin','-v','error','-xerror','-threads','1','-i',file,
    '-vf','format=rgb24,scale=48:8:flags=area+accurate_rnd+bitexact,format=rgb24','-frames:v','1',
    '-f','rawvideo','pipe:1']);
  assert.equal(result.length, columns*rows*channels);
  return result;
}

function encode(rgb) {
  const length = columns*block, wav = Buffer.alloc(44+length*2);
  wav.write('RIFF'); wav.writeUInt32LE(wav.length-8,4); wav.write('WAVEfmt ',8);
  wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20); wav.writeUInt16LE(1,22);
  wav.writeUInt32LE(rate,24); wav.writeUInt32LE(rate*2,28); wav.writeUInt16LE(2,32);
  wav.writeUInt16LE(16,34); wav.write('data',36); wav.writeUInt32LE(length*2,40);
  for (let x=0;x<columns;x++) {
    const stable = new Float64Array(window), next = new Float64Array(window);
    for (let tone=0;tone<tones.length;tone++) {
      const row=Math.floor(tone/channels), c=tone%channels;
      const index=row*columns*channels;
      const a=rgb[index+x*channels+c]*gain/255;
      const b=rgb[index+((x+1)%columns)*channels+c]*gain/255;
      for(let i=0;i<window;i++) {
        stable[i]+=a*waves[tone][i];
        next[i]+=b*waves[tone][i];
      }
    }
    for(let i=0;i<window;i++) {
      const first=44+2*(x*block+i);
      wav.writeInt16LE(Math.round(stable[i]*32767),first);
      const blend=stable[i]+(next[i]-stable[i])*easing[i];
      wav.writeInt16LE(Math.round(blend*32767),first+2*window);
    }
  }
  return wav;
}

// The decoder reads audio samples and fixed format constants only.
function decode(wav) {
  assert.equal(wav.toString('ascii',0,4),'RIFF');
  assert.equal(wav.readUInt32LE(24),rate);
  assert.equal(wav.length,44+2*columns*block);
  const rgb=Buffer.alloc(columns*rows*channels);
  for(let x=0;x<columns;x++) {
    for(let tone=0;tone<tones.length;tone++) {
      let sum=0;
      for(let i=0;i<window;i++)
        sum+=wav.readInt16LE(44+2*(x*block+i))*waves[tone][i];
      const level=Math.round(2*sum/window*255/(gain*32767));
      assert.ok(level>=0 && level<=255);
      rgb[(Math.floor(tone/channels)*columns+x)*channels+tone%channels]=level;
    }
  }
  return rgb;
}

function verify(file,name) {
  const input=grid(file);
  const wav=encode(input);
  const dest=path.join(__dirname,name+'.wav');
  fs.writeFileSync(dest,wav);
  const restored=decode(fs.readFileSync(dest));
  assert.deepEqual(restored,input);
  assert.deepEqual(wav,encode(input));
  console.log(name,restored.length,'valori RGB ricostruiti');
}
if(require.main===module) {
  const scenes=[
    ['../linea-continua/gennaio-ritaglio.png','pacifico-gennaio'],
    ['../linea-continua/ottobre-ritaglio.png','pacifico-ottobre'],
    ['../../../catalogo/campione/black_marble_aug2160_print.jpg','florida']
  ];
  for(const [file,name] of scenes) verify(path.resolve(__dirname,file),name);
  const white=Buffer.alloc(columns*rows*channels,255);
  assert.deepEqual(decode(encode(white)),white);
  const single=Buffer.alloc(white.length);
  for(const channel of [0,1,2]) {
    single[27+channel]=1;
    assert.deepEqual(decode(encode(single)),single);
    single[27+channel]=0;
  }
  console.log('Verificati bianco pieno e un solo livello R, G o B su nero.');
}
