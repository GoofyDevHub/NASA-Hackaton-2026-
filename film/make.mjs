// The 29-second promo, rendered from the real site.  node film/make.mjs
// Chrome is driven over the DevTools protocol with the page clock replaced by a frame counter, so every one
// of the 1740 frames is drawn by the site's own code and is repeatable. The sound is assembled offline from
// the approved tracks at exact sample offsets; clicks, pops and tones are synthesised here.
// Needs Chrome, ffmpeg and (for the spoken line) Windows speech. FRAMES=100,500 writes test stills instead.
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { byId, fullDescription } from '../site/scenes.js';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.join(HERE, '..');
const FPS = 60, TOTAL = 29 * FPS, RATE = 48000, SPF = RATE / FPS, W = 1920, H = 1080, PORT = 4199, DEBUG = 9339;
const TMP = mkdtempSync(path.join(os.tmpdir(), 'pts-film-'));
const STILLS = process.env.FRAMES ? process.env.FRAMES.split(',').map(Number) : null;
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ------------------------------------------------------------------ the edit, in frames
const TITLES = [   // id, text, first frame, frames per character, last frame, style
  ['hook', 'WHAT DOES EARTH SOUND LIKE?', 6, 3, 150, 'big'],
  ['c1', '3 PLACES · 3 KINDS OF NASA IMAGE', 292, 1.5, 372, 'cap'],
  ['c2', '1 · PICK A NASA IMAGE', 388, 2, 476, 'cap'],
  ['c3', '2 · ONE BASE SOUND PER CATEGORY: LIGHTNING → RAIN', 486, 1.5, 656, 'cap'],
  ['c4', '3 · STRONGER PIXELS → HEAVIER RAIN + THUNDER', 666, 1.5, 818, 'cap'],
  ['c5', 'NEW CATEGORY: OCEAN TEMPERATURE → A VOICE. COLD = DEEP', 842, 1.5, 1016, 'cap'],
  ['c6', 'NO SIGHT NEEDED: KEYBOARD · SCREEN READER · BRAILLE', 1026, 1.5, 1136, 'cap'],
  ['c7', 'PRESS V → VOICE CONTROL', 1142, 1.5, 1182, 'cap'],
  ['c8', 'SAY “DESCRIBE”', 1188, 2, 1436, 'cap'],
  ['tag', 'HEAR THE PLANET. BEYOND VISUALS.', 1470, 2.5, TOTAL, 'big'],
  ['url', 'pixelthatsounds.github.io', 1570, 2, TOTAL, 'pill']
];
const ZOOMS = [    // from frame, to frame, scale from, scale to, element the zoom is centred on
  [186, 198, 1, 1.24, '#hero-title'], [236, 246, 1.24, 1, '#hero-title'],
  [560, 572, 1, 1.14, '.shot'], [640, 650, 1.14, 1, '.shot'],
  [740, 752, 1, 1.14, '.shot'], [806, 816, 1.14, 1, '.shot'],
  [900, 912, 1, 1.14, '.shot'], [1002, 1012, 1.14, 1, '.shot'],
  [1150, 1162, 1, 1.3, '#voice-toggle'], [1200, 1212, 1.3, 1, '#voice-toggle'],
  [1440, 1464, 1.4, 1, '#globe']
];
const CLIPS = [    // approved track, first frame, last frame, offset in seconds, gain
  ['amazon-rain', 480, 660, 1.0, 1], ['congo-storm', 660, 822, 7.5, 0.38],
  ['antarctica-ocean-deep-male', 834, 1020, 0.2, 1], ['antarctica-ocean-deep-male', 1020, 1188, 3.3, 0.45],
  ['amazon-ocean-soprano', 1440, TOTAL, 0.2, 0.8]
];
const POPS = [138, 270, 375, 480, 660, 822, 834, 1680], TABS = [1030, 1055, 1080, 1105], VKEY = 1140, HEARD = 1188, SPEECH = [1215, 1436];

// ------------------------------------------------------------------ sound
const mix = new Float32Array(TOTAL * SPF * 2);
const put = (frame, samples, gain = 1, stereo = false) => {
  const at = Math.round(frame * SPF), n = stereo ? samples.length / 2 : samples.length;
  for (let i = 0; i < n && at + i < TOTAL * SPF; i++) {
    mix[(at + i) * 2] += gain * (stereo ? samples[i * 2] : samples[i]);
    mix[(at + i) * 2 + 1] += gain * (stereo ? samples[i * 2 + 1] : samples[i]);
  }
};
let seed = 20261115; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const synth = (seconds, fn) => Float32Array.from({ length: Math.round(seconds * RATE) }, (_, i) => fn(i / RATE));
const keyClick = () => { const f1 = 2100 + rnd() * 900, f2 = 5200 + rnd() * 1500, g = .8 + rnd() * .4;
  return synth(.045, t => g * ((t < .003 ? (rnd() * 2 - 1) * .5 : 0) + .32 * Math.sin(6.283 * f1 * t) * Math.exp(-t * 160) + .14 * Math.sin(6.283 * f2 * t) * Math.exp(-t * 320))); };
const pop = () => synth(.11, t => .55 * Math.sin(6.283 * (260 * t + 620 * (1 - Math.exp(-t * 38)) / 38)) * Math.exp(-t * 34) + (t < .002 ? (rnd() * 2 - 1) * .3 : 0));
const beep = (hz, len, g) => synth(len, t => g * Math.sin(6.283 * hz * t) * Math.min(1, t / .004) * Math.exp(-t * 22));
const decode = file => { const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-ac', '2', '-ar', String(RATE), '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
  if (r.status) throw new Error(r.stderr.toString()); return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length >> 2).slice(); };
const tracks = {}, levels = {};
for (const name of new Set(CLIPS.map(c => c[0]))) {
  const pcm = tracks[name] = decode(path.join(ROOT, 'assets/audio', name + '.wav'));
  levels[name] = Array.from({ length: Math.floor(pcm.length / 2 / SPF) }, (_, f) => { let s = 0; for (let i = 0; i < SPF; i++) s += pcm[(f * SPF + i) * 2] ** 2; return +Math.sqrt(s / SPF).toFixed(4); });
}
const segment = (pcm, seconds, frames, fadeOut = .012) => { const n = frames * SPF, from = Math.round(seconds * RATE), out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) { const k = Math.min(1, i / (.008 * RATE), (n - i) / (fadeOut * RATE)); out[i * 2] = k * (pcm[(from + i) * 2] || 0); out[i * 2 + 1] = k * (pcm[(from + i) * 2 + 1] || 0); }
  return out; };
for (const [name, a, b, at, gain] of CLIPS) put(a, segment(tracks[name], at, b - a), gain, true);
for (const [, text, f0, per, , style] of TITLES) [...text].forEach((ch, i) => { if (ch !== ' ' && (per >= 2 || i % 2 === 0)) put(Math.round(f0 + i * per), keyClick(), style === 'cap' ? .5 : .8); });
for (const f of POPS) put(f, pop(), .9);
for (const f of [...TABS, VKEY]) put(f, keyClick(), 1.1);
put(VKEY + 6, beep(1250, .07, .22)); put(HEARD + 4, beep(880, .12, .2)); put(HEARD + 8, beep(1320, .14, .2));
{ // the spoken line: the opening of the real description, rendered with the Windows voice
  const text = fullDescription(byId('antarctica-ocean'), 'en-US'), wav = path.join(TMP, 'say.wav');
  const ps = "Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; try { $s.SelectVoice('Microsoft Zira Desktop') } catch {}; $s.Rate = 1; $s.SetOutputToWaveFile($env:PTS_WAV); $s.Speak($env:PTS_TEXT); $s.Dispose()";
  const r = spawnSync('powershell', ['-NoProfile', '-Command', ps], { env: { ...process.env, PTS_WAV: wav, PTS_TEXT: text } });
  if (existsSync(wav)) put(SPEECH[0], segment(decode(wav), 0.05, SPEECH[1] - SPEECH[0], .12), 1.5, true);
  else console.log('No Windows voice: the spoken line is left out.', r.stderr?.toString().slice(0, 200));
}
{ let peak = 0; for (const v of mix) peak = Math.max(peak, Math.abs(v)); const k = Math.min(1, .89 / peak);
  const end = 4 * SPF; for (let i = 0; i < mix.length / 2; i++) { const g = k * Math.min(1, (TOTAL * SPF - i) / end); mix[i * 2] *= g; mix[i * 2 + 1] *= g; }
  console.log('audio peak before trim', peak.toFixed(2)); }
const AUDIO = path.join(TMP, 'mix.f32'); writeFileSync(AUDIO, Buffer.from(mix.buffer));

if (process.env.AUDIO_ONLY) {   // keep the rendered picture, replace the sound
  const out = path.join(HERE, 'out', 'pts-promo-29s.mp4'), next = path.join(HERE, 'out', 'next.mp4');
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', out, '-f', 'f32le', '-ar', String(RATE), '-ac', '2', '-i', AUDIO, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-t', '29', '-movflags', '+faststart', next]);
  if (r.status) throw new Error(r.stderr.toString());
  rmSync(out); writeFileSync(out, readFileSync(next)); rmSync(next); rmSync(TMP, { recursive: true, force: true }); console.log('sound replaced'); process.exit(0);
}

// ------------------------------------------------------------------ page scripts
const CLOCK = `(() => {
  let now = 0, id = 1, rafs = []; const timers = new Map(), seen = new WeakMap(), T0 = 1794744000000;
  window.__real = { setTimeout: window.setTimeout.bind(window) };
  performance.now = () => now; Date.now = () => T0 + now;
  window.setTimeout = (fn, d = 0, ...a) => { const i = id++; timers.set(i, { at: now + Math.max(0, +d || 0), fn, a }); return i; };
  window.setInterval = (fn, d = 0, ...a) => { const i = id++, e = Math.max(1, +d || 0); timers.set(i, { at: now + e, fn, a, e }); return i; };
  window.clearTimeout = window.clearInterval = i => { timers.delete(i); };
  window.requestAnimationFrame = fn => { const i = id++; rafs.push([i, fn]); return i; };
  window.cancelAnimationFrame = i => { rafs = rafs.filter(r => r[0] !== i); };
  window.__step = dt => {
    now += dt;
    for (let guard = 0; guard < 2000; guard++) {
      let k = null, due = null; for (const [i, t] of timers) if (t.at <= now && (!due || t.at < due.at)) { due = t; k = i; }
      if (!due) break; if (due.e) due.at += due.e; else timers.delete(k);
      try { if (typeof due.fn === 'function') due.fn(...due.a); } catch (e) { console.error(e); }
    }
    const q = rafs; rafs = []; for (const [, fn] of q) { try { fn(now); } catch (e) { console.error(e); } }
    for (const a of document.getAnimations()) {
      if (!seen.has(a)) { seen.set(a, now); try { a.pause(); } catch {} }
      const t = now - seen.get(a), end = a.effect?.getComputedTiming().endTime;
      try { if (Number.isFinite(end) && t >= end) a.finish(); else a.currentTime = t; } catch {}
    }
  };
  // speech in and out are stand-ins: nothing is heard or said by the page while it is filmed
  const synth = { speaking: false, pending: false, getVoices: () => [], until: 0, speak(u) { this.speaking = true; this.until = Math.max(this.until, now) + ((u.text || '').length > 90 ? 6000 : 200); const mine = this.until; window.setTimeout(() => { if (this.until === mine) this.speaking = false; u.onend?.(); }, mine - now); }, cancel() { this.speaking = false; this.until = 0; }, addEventListener() {}, removeEventListener() {} };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  window.__ptsSR = class { start() { window.__rec = this; Promise.resolve().then(() => this.onstart?.()); } stop() { this.abort(); } abort() { if (window.__rec === this) window.__rec = null; Promise.resolve().then(() => this.onend?.()); } };
  window.__hear = text => { const r = window.__rec; if (r) r.onresult?.({ resultIndex: 0, results: [Object.assign([{ transcript: text, confidence: .95 }], { isFinal: true })] }); };
})();`;

const STAGE = `(async (TITLES, ZOOMS, LEVELS) => {
  const m = window.__pl = await import(new URL('player.js', document.baseURI).href), a = m._audio;
  let base = 0, start = null; const load = a.load.bind(a);
  Object.defineProperty(a, 'currentTime', { get: () => start === null ? base : Math.min(15, base + (performance.now() - start) / 1000), set: v => { base = +v || 0; if (start !== null) start = performance.now(); } });
  Object.defineProperty(a, 'paused', { get: () => start === null });
  a.play = () => { if (start === null) start = performance.now(); return Promise.resolve(); };
  a.pause = () => { if (start !== null) { base = a.currentTime; start = null; } };
  a.load = () => { start = null; base = 0; load(); };
  a.muted = true;
  AnalyserNode.prototype.getByteTimeDomainData = function (buf) {   // the level line follows the real track's measured level
    const env = LEVELS[(a.src.split('/').pop() || '').replace('.mp3', '')], rms = (env && start !== null && env[Math.floor(a.currentTime * 60)]) || 0;
    for (let i = 0; i < buf.length; i++) buf[i] = 128 + (i % 2 ? 1 : -1) * Math.min(127, rms * 128 * 1.4);
  };
  const css = document.createElement('style'); css.textContent = \`
    #fx { position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; font-family: var(--sans, "Segoe UI", sans-serif); color: #F0F0F0; overflow: hidden; }
    #fx * { position: absolute; box-sizing: border-box; }
    #fx .cover { inset: 0; background: #000; } #fx .scrim { inset: 0; background: linear-gradient(90deg, rgba(2,3,8,.95) 0%, rgba(2,3,8,.92) 46%, rgba(2,3,8,.4) 78%, rgba(2,3,8,.5) 100%); opacity: 0; }
    #fx .big { left: 0; right: 0; top: 40%; text-align: center; font-size: 78px; font-weight: 700; letter-spacing: .06em; text-shadow: 0 4px 40px #000; white-space: pre; }
    #fx .cap { left: 50%; bottom: 7px; transform: translateX(-50%); white-space: pre; font-size: 30px; font-weight: 700; letter-spacing: .05em; padding: 10px 28px; border-radius: 16px;
      background: rgba(4,5,10,.82); border: 1px solid rgba(254,133,0,.75); box-shadow: 0 10px 50px rgba(0,0,0,.6); }
    #fx .pill { left: 50%; top: 58%; transform: translateX(-50%); white-space: pre; font-size: 40px; font-weight: 700; padding: 16px 40px; border-radius: 999px; background: rgba(254,133,0,.94); color: #0A0B10; box-shadow: 0 0 60px rgba(254,133,0,.45); }
    #fx .caret { position: static; display: inline-block; width: .5em; height: .95em; margin-left: .08em; vertical-align: -.08em; background: #FE8500; }
    #fx .pill .caret { background: #0A0B10; }
    #fx .key { right: 70px; bottom: 120px; min-width: 110px; text-align: center; font-size: 44px; font-weight: 700; padding: 16px 26px; border-radius: 16px; background: #F0F0F0; color: #0A0B10; border-bottom: 8px solid #9a9aa2; opacity: 0; }
    #fx .ring { width: 0; height: 0; border-radius: 50%; border: 3px solid #FE8500; transform: translate(-50%,-50%); opacity: 0; }
    #fx .cursor { width: 34px; height: 34px; left: 0; top: 0; }\`;
  document.head.appendChild(css);
  const fx = document.createElement('div'); fx.id = 'fx'; document.documentElement.appendChild(fx);
  const el = (cls, html = '') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; fx.appendChild(d); return d; };
  const cover = el('cover'), scrim = el('scrim');
  const titles = TITLES.map(t => ({ t, node: el(t[5]) }));
  const brand = el('pill', 'P.T.S.'); brand.style.top = '56%';
  const key = el('key'), ring = el('ring');
  const cursor = el('cursor', '<svg viewBox="0 0 24 24" width="34" height="34"><path d="M4 2l15 11.2-6.6 1 3.7 7-2.8 1.4-3.6-7L4 20z" fill="#fff" stroke="#0A0B10" stroke-width="1.4" stroke-linejoin="round"/></svg>');
  const centre = sel => { if (Array.isArray(sel)) return sel; const r = (typeof sel === 'string' ? document.querySelector(sel) : sel).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x), bez = x => { x = Math.min(1, Math.max(0, x)); return 1 - Math.pow(1 - x, 3); };
  let cur = [1560, 930], move = null, pops = [], reveal = null, keyAt = -99, ringAt = -99, ringAt2 = [0, 0];
  window.__centre = centre;
  window.__cursor = (sel, f0, f1) => { move = { sel, f0, f1, from: cur.slice() }; };
  window.__pop = (sel, f) => { const p = centre(sel); ringAt = f; ringAt2 = p; if (typeof sel === 'string') pops.push({ node: document.querySelector(sel), f }); };
  window.__brand = () => brand;
  window.__reveal = f => { reveal = f; };
  window.__key = (label, f) => { key.textContent = label; keyAt = f; };
  window.__fx = f => {
    for (const { t: [, text, f0, per, f1, style], node } of titles) {
      const on = f >= f0 && f < f1; node.style.display = on ? '' : 'none'; if (!on) continue;
      const n = Math.min(text.length, Math.floor((f - f0) / per) + 1), typing = n < text.length;
      node.innerHTML = text.slice(0, n).replace(/</g, '&lt;') + (typing || Math.floor(f / 18) % 2 ? '<span class="caret"></span>' : '<span class="caret" style="opacity:0"></span>');
      if (style === 'cap') node.style.opacity = Math.min(1, (f - f0 + 1) / 4);
    }
    // the hook: black, then a round opening from the P.T.S. button
    brand.style.display = f >= 95 && f < 162 ? '' : 'none'; brand.style.opacity = ease((f - 95) / 10);
    const bs = f >= 138 && f < 147 ? 1 + .15 * Math.sin(Math.PI * (f - 138) / 9) : 1; brand.style.transform = 'translateX(-50%) scale(' + bs + ')';
    if (reveal === null) cover.style.background = '#000';
    else { const r = Math.pow(Math.max(0, f - reveal) / 16, 1.7) * 1500, c = centre(brand); cover.style.background = r > 1450 ? 'none' : 'radial-gradient(circle at ' + c[0] + 'px ' + c[1] + 'px, transparent ' + r + 'px, #000 ' + (r + 3) + 'px)'; if (f - reveal > 3) brand.style.opacity = Math.max(0, 1 - (f - reveal - 3) / 6); }
    scrim.style.opacity = ease((f - 1452) / 16);
    // punch zooms on the page itself
    let s = 1, origin = null; for (const [a0, a1, from, to, sel] of ZOOMS) { if (f >= a0) { s = from + (to - from) * bez((f - a0) / (a1 - a0)); origin = sel; } if (f >= a1 && to === 1) { s = 1; origin = null; } }
    if (s === 1) { document.body.style.transform = ''; }
    else { document.body.style.transform = ''; const c = centre(origin); document.body.style.transformOrigin = c[0] + 'px ' + c[1] + 'px'; document.body.style.transform = 'scale(' + s + ')'; }
    // elastic pop on the real control, and a ring where it was pressed
    pops = pops.filter(p => { const k = f - p.f; if (!p.node) return false; if (k >= 9) { p.node.style.scale = ''; return false; } p.node.style.scale = String(1 + .15 * Math.sin(Math.PI * k / 9)); return true; });
    const rk = f - ringAt; ring.style.opacity = rk >= 0 && rk < 16 ? 1 - rk / 16 : 0; ring.style.left = ringAt2[0] + 'px'; ring.style.top = ringAt2[1] + 'px'; ring.style.width = ring.style.height = (30 + rk * 9) + 'px';
    const kk = f - keyAt; key.style.opacity = kk >= 0 && kk < 22 ? Math.min(1, (22 - kk) / 6) : 0; key.style.transform = 'scale(' + (kk >= 0 && kk < 9 ? 1 + .15 * Math.sin(Math.PI * kk / 9) : 1) + ')';
    if (move) { const k = (f - move.f0) / (move.f1 - move.f0), to = centre(move.sel), e = k <= 0 ? 0 : k >= 1 ? 1 : (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
      cur = [move.from[0] + (to[0] - move.from[0]) * e, move.from[1] + (to[1] - move.from[1]) * e - Math.sin(Math.PI * e) * 46]; if (k >= 1) { cur = to.slice(); move = null; } }
    cursor.style.display = f >= 96 && f < 1700 ? '' : 'none'; cursor.style.transform = 'translate(' + (cur[0] - 5) + 'px,' + (cur[1] - 3) + 'px)';
  };
  window.__fx(0); return true;
})`;

// ------------------------------------------------------------------ Chrome
const server = spawn(process.execPath, [path.join(ROOT, 'site/serve.mjs')], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${path.join(TMP, 'profile')}`, `--window-size=${W},${H}`,
  '--hide-scrollbars', '--force-device-scale-factor=1', '--mute-audio', '--no-first-run', '--autoplay-policy=no-user-gesture-required', '--enable-unsafe-swiftshader', 'about:blank'], { stdio: 'ignore' });
let ws, seq = 0; const waiting = new Map();
const cdp = (method, params = {}) => new Promise((ok, fail) => { const id = ++seq; waiting.set(id, [ok, fail, method]); ws.send(JSON.stringify({ id, method, params })); });
const ev = async expression => { const r = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: false });
  if (r.exceptionDetails) throw new Error(expression.slice(0, 80) + ' → ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)); return r.result.value; };
const done = code => { try { chrome.kill(); } catch {} try { server.kill(); } catch {} setTimeout(() => { try { rmSync(TMP, { recursive: true, force: true }); } catch {} process.exit(code); }, 600); };
try {
  let target; for (let i = 0; i < 60 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${DEBUG}/json/list`)).json()).find(t => t.type === 'page'); } catch {} }
  ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail; });
  ws.onmessage = e => { const msg = JSON.parse(e.data); if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') console.log('page error:', msg.params.args.map(a => a.value || a.description).join(' ').slice(0, 300));
    const w = waiting.get(msg.id); if (!w) return; waiting.delete(msg.id); msg.error ? w[1](new Error(w[2] + ': ' + msg.error.message)) : w[0](msg.result); };
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: CLOCK });
  await cdp('Page.navigate', { url: `http://localhost:${PORT}/site/` });
  for (let i = 0; i < 80; i++) { await sleep(150); if (await ev('document.readyState === "complete" && !!window.ptsVoice').catch(() => false)) break; }
  await ev(`${STAGE}(${JSON.stringify(TITLES)}, ${JSON.stringify(ZOOMS)}, ${JSON.stringify(levels)})`);
  for (let i = 0; i < 90; i++) { await ev('__step(1000/60)'); await sleep(20); }       // let textures load and the Earth settle

  const mouse = async (type, [x, y]) => cdp('Input.dispatchMouseEvent', { type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: 1 });
  const click = async (sel, f) => { const p = await ev(`__centre(${JSON.stringify(sel)})`); await ev(`__pop(${JSON.stringify(sel)}, ${f})`);
    await mouse('mouseMoved', p); await mouse('mousePressed', p); await mouse('mouseReleased', p); await sleep(250); };
  const press = async (key, code, vk, label, f) => { const base = { key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk };
    await ev(`__key(${JSON.stringify(label)}, ${f})`); await cdp('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...base }); if (key.length === 1) await cdp('Input.dispatchKeyEvent', { type: 'char', text: key, ...base }); await cdp('Input.dispatchKeyEvent', { type: 'keyUp', ...base }); await sleep(120); };
  const AMAZON = '#pins [aria-label^="Amazon"]';
  const ACTIONS = {
    100: () => ev('__cursor(__brand(), 100, 134)'),
    138: f => ev(`__pop(__centre(__brand()), ${f})`),
    147: f => ev(`__reveal(${f})`),
    238: () => ev('__cursor("#explore", 238, 266)'),
    270: f => click('#explore', f),
    330: () => ev(`__cursor(${JSON.stringify(AMAZON)}, 330, 371)`),
    375: f => click(AMAZON, f),
    436: () => ev('__cursor("#p-listen", 436, 474)'),
    480: async f => { await click('#p-listen', f); await ev('__pl._audio.currentTime = 1.0'); },
    624: () => ev('__cursor("#p-next", 624, 655)'),
    660: async f => { await click('#p-next', f); await ev('__pl._audio.currentTime = 7.5'); },
    822: f => click('#p-next', f),
    834: async f => { await click('#p-next', f); await ev('__pl._audio.currentTime = 0.2'); },
    1030: f => press('Tab', 'Tab', 9, 'TAB', f), 1055: f => press('Tab', 'Tab', 9, 'TAB', f), 1080: f => press('Tab', 'Tab', 9, 'TAB', f), 1105: f => press('Tab', 'Tab', 9, 'TAB', f),
    1140: f => press('v', 'KeyV', 86, 'V', f),
    1188: async () => { const r = await ev('JSON.stringify({rec: !!window.__rec, st: document.querySelector("#voice-status").textContent})'); await ev('__hear("describe")'); if (STILLS) console.log('before hear', r); },
    1440: async () => { await ev('ptsVoice.run(["stop"])'); await ev('ptsVoice.run(["home"])'); await sleep(200); },
    1632: () => ev('__cursor([960, 660], 1632, 1674)'),
    1680: f => ev(`__pop([960, 660], ${f})`)
  };

  let enc = null;
  if (!STILLS) {
    mkdirSync(path.join(HERE, 'out'), { recursive: true });
    enc = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-f', 'f32le', '-ar', String(RATE), '-ac', '2', '-i', AUDIO,
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-c:a', 'aac', '-b:a', '256k', '-t', '29', '-movflags', '+faststart',
      path.join(HERE, 'out', 'pts-promo-29s.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  }
  const t0 = Date.now();
  for (let f = 0; f < TOTAL; f++) {
    if (ACTIONS[f]) await ACTIONS[f](f);
    await ev(`__step(1000/60); __fx(${f})`);
    if (STILLS ? STILLS.includes(f) : true) {
      const png = Buffer.from((await cdp('Page.captureScreenshot', { format: 'png' })).data, 'base64');
      if (STILLS) writeFileSync(path.join(process.env.STILL_DIR || TMP, `f${String(f).padStart(4, '0')}.png`), png);
      else if (!enc.stdin.write(png)) await new Promise(r => enc.stdin.once('drain', r));
    }
    if (STILLS && f > Math.max(...STILLS)) break;
    if (f % 120 === 0) console.log(`frame ${f} of ${TOTAL}, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  if (STILLS) console.log('state', await ev('JSON.stringify({view: document.body.dataset.view, scene: __pl.state.sceneId, status: __pl.state.status, voice: document.querySelector("#voice-status").textContent, rec: !!window.__rec})'));
  if (enc) { enc.stdin.end(); await new Promise(r => enc.on('close', r)); console.log('wrote film/out/pts-promo-29s.mp4'); }
  if (STILLS && process.env.STILL_DIR) { writeFileSync(path.join(process.env.STILL_DIR, 'mix.f32'), readFileSync(AUDIO)); }
  done(0);
} catch (e) { console.error(e); done(1); }
