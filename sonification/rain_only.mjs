// The Amazon lightning track: rain only, no thunder.  node sonification/rain_only.mjs
// Same image measurement and rain recording as storms.py; the thunder events are left out.
// Needs ffmpeg on the PATH. Writes assets/audio/amazon-rain.wav and .mp3, the approved master.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.join(HERE, '../assets/images'), OUT = path.join(HERE, '../assets/audio');
const RATE = 48000, COUNT = 15 * RATE;
const ff = (args, input) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { input, maxBuffer: 1 << 28 });
  if (r.status) throw new Error(r.stderr.toString());
  return r;
};
const pixels = (file, w, h, x, y) => ff(['-v', 'error', '-i', file, '-vf', `crop=${w}:${h}:${x}:${y}`,
  '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']).stdout;

// ---- image: position of each pixel on the published colour bar (storms.activity_profile)
const [X0, Y0, X1, Y1] = JSON.parse(readFileSync(path.join(IMAGES, 'sources.json'), 'utf8')).images['amazon-lightning.png'].pixelRectangle;
const W = X1 - X0, H = Y1 - Y0;
const crop = pixels(path.join(IMAGES, 'originals/lightning.png'), W, H, X0, Y0);
const legend = pixels(path.join(IMAGES, 'legends/lightning.png'), 251, 1, 35, 33), L = legend.length / 3;
const columns = [];
for (let x = 0; x < W; x++) {
  const vals = [];
  for (let y = 0; y < H; y++) {
    const p = [0, 1, 2].map(c => crop[(y * W + x) * 3 + c] / 255);
    let best = Infinity, at = 0;
    for (let i = 0; i < L; i++) {
      const d = (p[0] - legend[i * 3] / 255) ** 2 + (p[1] - legend[i * 3 + 1] / 255) ** 2 + (p[2] - legend[i * 3 + 2] / 255) ** 2;
      if (d < best) { best = d; at = i; }
    }
    if (Math.sqrt(best) < .07 && Math.max(...p) - Math.min(...p) > .3) vals.push(at / (L - 1));
  }
  if (!vals.length) { columns.push(NaN); continue; }
  vals.sort((a, b) => a - b);
  const q = .9 * (vals.length - 1), lo = Math.floor(q), hi = Math.min(vals.length - 1, lo + 1);
  columns.push(.7 * vals.reduce((a, b) => a + b) / vals.length + .3 * (vals[lo] + (vals[hi] - vals[lo]) * (q - lo)));
}
const seen = columns.map((v, i) => [i, v]).filter(e => !Number.isNaN(e[1]));
const lerp = (pts, x) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let k = 1; k < pts.length; k++) if (x <= pts[k][0]) { const [a, va] = pts[k - 1], [b, vb] = pts[k]; return va + (vb - va) * (x - a) / (b - a); }
  return pts[pts.length - 1][1];
};
const filled = columns.map((_, i) => lerp(seen, i));
const kernel = Array.from({ length: 17 }, (_, i) => Math.exp(-((i - 8) ** 2) / 8)), ksum = kernel.reduce((a, b) => a + b);
const reflect = i => (i < 0 ? -i - 1 : i >= W ? 2 * W - i - 1 : i);
const smooth = filled.map((_, i) => kernel.reduce((s, k, j) => s + k * filled[reflect(i + j - 8)], 0) / ksum);
console.log(`column score ${Math.min(...filled).toFixed(4)} to ${Math.max(...filled).toFixed(4)} over ${seen.length} of ${W} columns`);

// ---- rain: the high-passed tail of the field recording, looped (storms.weather_material without thunder)
const sample = path.join(HERE, 'samples/rain-and-thunder.ogg');
const want = JSON.parse(readFileSync(path.join(HERE, 'samples/sources.json'), 'utf8')).files['rain-and-thunder.ogg'].sha256;
if (createHash('sha256').update(readFileSync(sample)).digest('hex') !== want) throw new Error('Sample checksum mismatch');
const raw = ff(['-v', 'error', '-i', sample, '-ac', '1', '-ar', String(RATE),
  '-af', 'highpass=f=650:poles=2,highpass=f=650:poles=1,lowpass=f=8500:poles=2,lowpass=f=8500:poles=1', '-f', 'f32le', '-']).stdout;
const rec = new Float32Array(raw.buffer, raw.byteOffset, raw.length >> 2);
const unit = a => { let s = 0; for (const v of a) s += v * v; const k = 1 / Math.max(Math.sqrt(s / a.length), 1e-12); return a.map(v => v * k); };
const rain = unit(Float64Array.from(rec.subarray(Math.round(10.5 * RATE), Math.round(18.5 * RATE))));
const loop = rain.subarray(Math.floor(.65 * RATE), rain.length - Math.floor(.55 * RATE));
const fade = RATE / 2, period = loop.length - fade;
const bed = new Float64Array(COUNT);
for (let n = 0; n < COUNT; n++) {
  const at = (n + 1) % period, b = .5 - .5 * Math.cos(Math.PI * Math.min(1, at / fade));
  bed[n] = b * loop[at] + (1 - b) * (at + period < loop.length ? loop[at + period] : loop[loop.length - 1]);
}
const highpass = (x, hz) => {            // second-order Butterworth
  const w = 2 * Math.PI * hz / RATE, al = Math.sin(w) / Math.SQRT2, c = Math.cos(w), a0 = 1 + al;
  const b0 = (1 + c) / 2 / a0, b1 = -(1 + c) / a0, a1 = -2 * c / a0, a2 = (1 - al) / a0;
  const y = new Float64Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let n = 0; n < x.length; n++) { const v = b0 * x[n] + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x[n]; y2 = y1; y1 = v; y[n] = v; }
  return y;
};
const light = unit(highpass(bed, 2400));
const heavy = unit(bed.map((v, n) => v + .48 * bed[(n - 15527 + COUNT) % COUNT] + .32 * bed[(n - 37391 + COUNT) % COUNT]));

// ---- the image scan, left to right, sets how heavy the rain is
const mono = new Float32Array(COUNT), pts = smooth.map((v, i) => [i / (W - 1), v]);
let lowest = 1, highest = 0;
for (let n = 0; n < COUNT; n++) {
  const t = n / RATE, a = Math.min(1, Math.max(0, lerp(pts, n / (COUNT - 1)) / .6));
  lowest = Math.min(lowest, a); highest = Math.max(highest, a);
  mono[n] = (.012 + .12 * a ** .85) * ((1 - a) * light[n] + a * heavy[n]) * Math.min(1, t / .35) * Math.min(1, (15 - t) / .9);
}
console.log(`rain activity ${lowest.toFixed(3)} to ${highest.toFixed(3)}`);

// ---- master like the other tracks: -20 LUFS, true peak no higher than -3 dBTP.
// Rain is all small peaks, so a limiter holds them while the level is brought up.
const STEREO = 'pan=stereo|c0=c0|c1=c0', LIMIT = 'alimiter=limit=0.63:level=false:attack=2:release=40';
const pcm = Buffer.from(mono.buffer), input = ['-f', 'f32le', '-ar', String(RATE), '-ac', '1', '-i', '-'];
const meter = (args, data, pre = '') => {
  const log = ff([...args, '-af', pre + 'ebur128=peak=true', '-f', 'null', '-'], data).stderr.toString();
  const tail = log.slice(log.lastIndexOf('Summary:'));
  return [parseFloat(tail.match(/I:\s+(-?[\d.]+)/)[1]), parseFloat(tail.match(/Peak:\s+(-?[\d.]+)/)[1])];
};
let gain = 0;
for (let pass = 0; pass < 4; pass++) gain += -20 - meter(input, pcm, `${STEREO},volume=${gain.toFixed(3)}dB,${LIMIT},`)[0];
const wav = path.join(OUT, 'amazon-rain.wav'), mp3 = path.join(OUT, 'amazon-rain.mp3');
ff(['-v', 'error', '-y', ...input, '-af', `${STEREO},volume=${gain.toFixed(3)}dB,${LIMIT}`, '-c:a', 'pcm_s24le', '-bitexact', wav], pcm);
ff(['-v', 'error', '-y', '-i', wav, '-c:a', 'libmp3lame', '-b:a', '192k', '-bitexact', '-map_metadata', '-1', mp3]);
for (const f of [wav, mp3]) {
  const [i, p] = meter(['-i', f]);
  console.log(`${path.basename(f)}  ${i} LUFS  ${p} dBTP  sha256 ${createHash('sha256').update(readFileSync(f)).digest('hex')}`);
}
