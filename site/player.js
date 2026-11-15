// One playback state for mouse, keyboard, assistive technology and Obit.
import { PLAYLIST, byId, fullDescription, describe as describeText } from './scenes.js';

export const state = {
  sceneId: null,
  panelOpen: false,
  status: 'idle',          // idle | playing | paused | describing
  repeat: false,
  playlist: false,         // a playlist run is in progress
  narration: false,        // speak each description before its track during a playlist run
  volume: 0.8,
  duck: 1,                 // lowered while the listener is giving a voice command
  lang: 'en-US'            // language of everything the page says aloud
};

const listeners = new Set();
const announcers = new Set();
export const subscribe = fn => listeners.add(fn);
export const onAnnounce = fn => announcers.add(fn);
const emit = () => listeners.forEach(fn => fn(state));
export const announce = msg => announcers.forEach(fn => fn(msg));

const audio = new Audio();
audio.preload = 'auto';
let startedAt = 0;
let token = 0;             // bumps on every stop or scene change; stale callbacks compare and bail out
let utterance = null;
let analyser = null, ctx = null, buf = null;

try { const v = parseFloat(localStorage.getItem('orbit-volume')); if (v >= 0 && v <= 1) state.volume = v; } catch {}
const applyVolume = () => { audio.volume = Math.max(0, Math.min(1, state.volume * state.duck)); };
applyVolume();

export const scene = () => byId(state.sceneId);
export const playable = () => !!scene()?.audio;

function setStatus(s) { state.status = s; emit(); }

function cancelSpeech() {
  utterance = null; alive.clear();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

// ---- the voice the page speaks with
// Prefer a natural-sounding voice, and the same family for English and Italian so the two sound alike:
// a multilingual neural voice where the browser has one (Edge), otherwise the neural or Google voice of
// each language (Chrome), and only then the robotic system voices. A choice saved from the console wins.
const VOICE_RANK = [/multilingual.*natural|natural.*multilingual/i, /natural/i, /google/i, /online/i, /elsa|zira|aria|jenny|samantha|alice/i];
export function pickVoice(lang = state.lang) {
  if (!('speechSynthesis' in window)) return null;
  const all = speechSynthesis.getVoices(), base = lang.slice(0, 2).toLowerCase();
  try { const saved = localStorage.getItem('pts-tts-' + lang), v = saved && all.find(x => x.name === saved); if (v) return v; } catch {}
  const multi = all.find(v => VOICE_RANK[0].test(v.name));
  if (multi) return multi;
  const same = all.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(base));
  const exact = same.filter(v => v.lang.replace('_', '-') === lang);
  for (const re of VOICE_RANK.slice(1)) for (const pool of [exact, same]) { const v = pool.find(x => re.test(x.name)); if (v) return v; }
  return exact[0] || same[0] || null;
}
if ('speechSynthesis' in window) { speechSynthesis.getVoices(); speechSynthesis.addEventListener?.('voiceschanged', () => speechSynthesis.getVoices()); }

// Long text is spoken sentence by sentence: some browser voices fall silent on one long utterance.
function sentences(text) {
  const out = []; let cur = '';
  for (const part of text.match(/[^.!?;:]+[.!?;:]*\s*/g) || [text]) {
    if (cur && (cur + part).length > 190) { out.push(cur.trim()); cur = ''; }
    cur += part;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
const alive = new Set();               // utterances in flight; holding them keeps the browser from dropping their events

// Speaks text in the current language and calls onend exactly once when the speech is over or cancelled.
export function sayText(text, onend) {
  let finished = false, started = false, poll = 0;
  const end = () => { if (finished) return; finished = true; clearInterval(poll); onend?.(); };
  if (!('speechSynthesis' in window)) { announce(text); setTimeout(end, 0); return; }
  const voice = pickVoice(), parts = sentences(text);
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    u.lang = state.lang; if (voice) u.voice = voice;
    u.onstart = () => { started = true; };
    u.onend = u.onerror = () => { alive.delete(u); if (i === parts.length - 1) end(); };
    alive.add(u); speechSynthesis.speak(u);
  });
  // Do not rely on the end event alone: watch the synthesiser, so the microphone is never left closed.
  const t0 = performance.now();
  poll = setInterval(() => {
    const busy = speechSynthesis.speaking || speechSynthesis.pending;
    if (busy) started = true;
    if ((started && !busy) || (!started && performance.now() - t0 > 2500)) end();
  }, 120);
}

export function speak(text, done) { sayText(text, done); }

function ensureAnalyser() {
  if (ctx || !(window.AudioContext || window.webkitAudioContext)) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = ctx.createAnalyser(); analyser.fftSize = 1024;
    buf = new Uint8Array(analyser.fftSize);
    ctx.createMediaElementSource(audio).connect(analyser);
    analyser.connect(ctx.destination);
  } catch { ctx = analyser = null; }
}

// Current output level 0..1, for the orbit line.
export function level() {
  if (!analyser || state.status !== 'playing') return 0;
  analyser.getByteTimeDomainData(buf);
  let s = 0; for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; s += v * v; }
  const db = 10 * Math.log10(s / buf.length + 1e-9);
  return Math.max(0, Math.min(1, (db + 50) / 40));
}

function load(id) {
  const s = byId(id);
  state.sceneId = id;
  audio.pause();
  if (s?.audio) { audio.src = s.audio.mp3; audio.load(); } else { audio.removeAttribute('src'); audio.load(); }
}

// Open a scene silently (list, globe, Obit "open"). Anything playing stops.
export function select(id) {
  if (!byId(id)) return false;
  token++; cancelSpeech();
  state.playlist = false;
  if (id !== state.sceneId || state.status !== 'idle') load(id);
  state.panelOpen = true;
  setStatus('idle');
  return true;
}

export function closePanel() {
  if (state.status === 'describing') { token++; cancelSpeech(); state.status = audio.currentTime > 0 ? 'paused' : 'idle'; }
  state.panelOpen = false; emit();
}

function startAudio() {
  ensureAnalyser(); ctx?.resume?.();
  applyVolume();
  const mine = token;
  startedAt = performance.now();
  setStatus('playing');
  audio.play().catch(() => { if (mine === token) { setStatus('idle'); announce('The sound could not start.'); } });
}

export function play() {
  const s = scene();
  if (!s) return 'none';
  if (!s.audio) return 'image-only';
  if (state.status === 'playing') return 'already';
  if (state.status === 'describing') { token++; cancelSpeech(); }
  startAudio();
  announce(`Playing ${s.spoken}.` + (s.illustrative ? ' Illustrative sound.' : ''));
  return 'ok';
}

export function pause() {
  if (state.status === 'playing') { audio.pause(); setStatus('paused'); announce('Paused.'); return true; }
  if (state.status === 'describing') { token++; cancelSpeech(); setStatus(playable() ? 'paused' : 'idle'); announce('Description stopped.'); return true; }
  return false;
}

export function stop() {
  token++; cancelSpeech();
  audio.pause();
  try { audio.currentTime = 0; } catch {}
  state.playlist = false;
  setStatus('idle');
  announce('Stopped.');
}

// Speak the description. The sound pauses and stays paused until the listener resumes.
export function describe() {
  const s = scene();
  if (!s) return false;
  token++; cancelSpeech();
  const mine = token;
  const hadSound = state.status === 'playing' || state.status === 'paused';
  audio.pause();
  state.playlist = false;
  setStatus('describing');
  speak(fullDescription(s, state.lang), () => {
    if (mine !== token) return;
    setStatus(hadSound ? 'paused' : 'idle');
    announce(hadSound ? 'Description finished. The sound is paused. Choose Resume to continue.' : 'Description finished.');
  });
  return true;
}

function narrateThenPlay() {
  const s = scene(), mine = token;
  setStatus('describing');
  speak(describeText(s, state.lang), () => { if (mine === token) { startAudio(); announce(`Playing ${s.spoken}.` + (s.illustrative ? ' Illustrative sound.' : '')); } });
}

function goTo(id, keep) {              // keep: 'playing' | 'paused' | 'idle'
  token++; cancelSpeech();
  const tour = state.playlist;
  load(id);
  state.playlist = tour;
  state.panelOpen = true;
  const s = scene();
  if (keep === 'playing' && s.audio) {
    if (state.playlist && state.narration) narrateThenPlay();
    else { startAudio(); announce(`Playing ${s.spoken}.` + (s.illustrative ? ' Illustrative sound.' : '')); }
  } else if (keep === 'paused' && s.audio) { setStatus('paused'); announce(`${s.title}. Paused.`); }
  else { setStatus('idle'); announce(`${s.title}.`); }
}

export function step(dir) {
  const i = PLAYLIST.indexOf(state.sceneId);
  const n = PLAYLIST.length;
  const j = i < 0 ? (dir > 0 ? 0 : n - 1) : (i + dir + n) % n;        // ring: after the last comes the first
  const keep = state.status === 'playing' || (state.status === 'describing' && state.playlist) ? 'playing'
    : state.status === 'paused' ? 'paused' : 'idle';
  goTo(PLAYLIST[j], keep);
  return true;
}

export function startPlaylist() {
  token++; cancelSpeech();
  state.playlist = true;
  load(PLAYLIST[0]);
  state.panelOpen = true;
  if (state.narration) narrateThenPlay();
  else { startAudio(); announce(`Playlist started. Track 1 of ${PLAYLIST.length}: ${scene().spoken}.`); }
}

audio.addEventListener('ended', () => {
  if (state.status !== 'playing') return;
  if (state.repeat) { audio.currentTime = 0; audio.play().catch(() => {}); return; }
  if (state.playlist) {
    const i = PLAYLIST.indexOf(state.sceneId);
    goTo(PLAYLIST[(i + 1) % PLAYLIST.length], 'playing');             // the tour loops until the listener stops it
    return;
  }
  setStatus('idle'); announce('Track finished.');
});

export function setRepeat(on) { state.repeat = !!on; emit(); announce(`Repeat ${state.repeat ? 'on' : 'off'}.`); }
export function setNarration(on) { state.narration = !!on; emit(); }
export function setVolume(v) {
  state.volume = Math.max(0, Math.min(1, v)); applyVolume();
  try { localStorage.setItem('orbit-volume', String(state.volume)); } catch {}
  emit();
}
export function setLang(l) { state.lang = l === 'it-IT' ? 'it-IT' : 'en-US'; }
export function setDuck(k) { state.duck = k; applyVolume(); }
export const position = () => audio.currentTime || 0;
export const duration = () => (isFinite(audio.duration) && audio.duration) || 15;
export const startedAgo = () => performance.now() - startedAt;
export const _audio = audio;   // test hook only
