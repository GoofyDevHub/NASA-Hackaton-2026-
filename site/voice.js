// Voice control: spoken commands drive the same actions as the buttons, from the entrance to the player.
// It uses the browser's speech recognition (Chrome, Edge) and only after the listener turns it on.
// Matching is forgiving on purpose: words that sound or look close to a command count as that command,
// every alternative the recogniser offers is tried, and English and Italian words are accepted in both modes.
// Short confirmations are tones, not speech, so the microphone stays open and the next command is never missed.
import { SCENES, PLAYLIST, byId, sourceOf, limitsOf, IMAGE_ONLY_NOTE } from './scenes.js';
import { IT } from './scenes.it.js';
import * as player from './player.js';

// ---- vocabulary. A leading "=" means the word must match exactly (too short or too common to guess at).
const V = {
  off: ['stop listening', 'voice off', 'turn off voice', 'turn off the voice', 'microphone off', 'stop voice', 'basta ascoltare', 'smetti di ascoltare', 'spegni la voce', 'spegni voce', 'disattiva la voce', 'disattiva voce', 'spegni il microfono', 'voce spenta'],
  help: ['help', 'commands', 'what can i say', 'aiuto', 'comandi', 'cosa posso dire', 'aiutami'],
  status: ['where am i', 'status', 'what is this', 'what is playing', 'dove sono', 'dove mi trovo', 'stato', 'cosa sto ascoltando', 'che cos e'],
  langIt: ['italiano', 'italian', 'italiana', 'in italiano', 'parla italiano'],
  langEn: ['english', 'inglese', 'in inglese', 'parla inglese', 'speak english'],
  tour: ['=tour', 'start tour', 'start the tour', 'guided tour', 'play all', 'play everything', 'playlist', 'percorso', 'visita guidata', 'avvia il tour', 'avvia tour', 'inizia il tour', 'fai partire il tour', '=giro', 'tur'],
  narration: ['descriptions', 'description', 'descrizioni', 'descrizione', 'described', 'descritto'],
  without: ['without', 'senza', '=no'],
  readList: ['read the list', 'read list', 'read them', '=read', 'list them', 'which ones', 'what are they', 'leggi', 'leggimi', 'leggi l elenco', 'leggi elenco', 'quali sono', 'elencali'],
  list: ['content list', 'contents', '=list', 'the list', 'elenco', 'lista', 'contenuti', 'indice', 'elenco contenuti'],
  close: ['close', 'exit', 'cancel', 'chiudi', 'chiudere', '=esci', 'annulla', 'go back', 'back to globe', 'back to the globe', 'torna indietro', 'torna al globo', 'globe', 'globo', 'clothes', 'closed'],
  explore: ['explore', 'explorer', 'explored', 'esplora', 'esplorare', 'esplori'],
  home: ['=home', 'entrance', 'homepage', 'inizio', 'pagina iniziale', 'ingresso'],
  enter: ['explore', 'explorer', 'enter', 'start', 'begin', '=go', '=open', 'continue', 'esplora', 'esplorare', 'entra', 'entrare', 'inizia', 'comincia', 'avanti', '=vai', 'apri'],
  again: ['again', 'restart', 'replay', 'start over', 'once more', 'da capo', 'ricomincia', 'di nuovo', 'ancora', 'riascolta', 'un altra volta'],
  track: ['track', 'number', 'traccia', 'numero', 'brano'],
  first: ['=first', 'first track', 'prima traccia', 'primo brano', 'la prima'],
  last: ['=last', 'last track', 'ultima', 'ultimo', 'ultima traccia'],
  explain: ['what do i hear', 'what am i hearing', 'what does it mean', 'meaning', 'explain', 'cosa sento', 'cosa sto sentendo', 'cosa significa', 'significato', 'spiega', 'spiegami', 'che suono e'],
  play: ['listen', 'play', '=hear', 'resume', 'continue', 'start', '=go', 'ascolta', 'ascoltare', 'ascolto', 'suona', 'riproduci', 'riprendi', 'continua', 'avvia', '=vai', 'senti', 'fai partire', 'lesson', 'plane'],
  pause: ['pause', 'pausa', 'paused', 'hold on', '=wait', 'aspetta', 'paws', 'pose', 'posa', 'in pausa', 'metti in pausa'],
  stop: ['stop', 'stopped', 'ferma', 'fermati', 'fermo', 'basta', 'silenzio', 'halt', 'stoppa', 'firma'],
  next: ['next', 'forward', 'skip', 'successivo', 'successiva', 'prossimo', 'prossima', 'avanti', '=dopo', 'nexte', 'nest', 'necks'],
  prev: ['previous', '=back', 'backward', 'before', 'precedente', 'indietro', 'previews', 'in dietro'],
  describe: ['describe', 'description', 'descrivi', 'descrizione', 'descrivere', 'describes'],
  source: ['source', 'sources', 'credit', 'credits', 'fonte', 'fonti', 'origine', 'crediti', 'da dove viene'],
  repeat: ['repeat', 'repeating', 'repeats', 'repetition', '=loop', 'ripeti', 'ripetizione', 'ripetere', 'ripete'],
  negative: ['=off', '=no', '=not', 'stop', 'disattiva', 'spegni', 'togli', 'basta', '=non', 'senza'],
  volume: ['volume', 'louder', 'quieter', 'softer', 'mute', 'alza', 'abbassa', 'muto', 'piu forte', 'piu alto', 'piu piano', 'piu basso', 'turn up', 'turn down', 'turn it up', 'turn it down'],
  up: ['louder', '=up', 'higher', 'alza', 'aumenta', 'raise', 'increase', 'piu forte', 'piu alto'],
  down: ['quieter', 'softer', '=down', 'lower', 'abbassa', 'diminuisci', 'decrease', 'reduce', 'piu piano', 'piu basso'],
  max: ['=max', 'maximum', 'massimo', 'al massimo', 'full volume'],
  min: ['minimum', 'minimo', 'al minimo'],
  mute: ['mute', 'muto', 'silenzia'],
  amazon: ['amazon', 'amazons', 'amazonia', 'amazzonia', 'amazzoni', 'amazzone', 'amazzonica'],
  congo: ['congo', 'kongo', 'conga', 'africa'],
  antarctica: ['antarctica', 'antarctic', 'antartica', 'antartide', 'antartico', 'antartida', 'polar', '=polo', 'peninsula', 'penisola'],
  lightning: ['lightning', 'lightening', 'lighting', 'storm', 'storms', 'thunder', 'fulmini', 'fulmine', 'temporale', 'temporali', 'tuono', 'tuoni'],
  ocean: ['ocean', 'oceans', '=sea', 'atlantic', 'oceano', '=mare', 'atlantico'],
  aerosols: ['aerosols', 'aerosol', 'aerosoli', 'smoke', 'pollution', 'fumo', 'inquinamento'],
  southern: ['southern ocean', 'oceano meridionale', 'oceano antartico', 'oceano australe', 'southern'],
  wind: ['=wind', '=vento'],
  cough: ['cough', 'coughs', 'coughing', 'tosse'],
  soprano: ['soprano']
};
const NUMBERS = { 1: ['1', 'one', 'first', 'uno', 'una', 'prima', 'primo'], 2: ['2', 'two', 'second', 'due', 'seconda', 'secondo'], 3: ['3', 'three', 'third', 'tre', 'terza', 'terzo'],
  4: ['4', 'four', 'fourth', 'quattro', 'quarta', 'quarto'], 5: ['5', 'five', 'fifth', 'cinque', 'quinta', 'quinto'], 6: ['6', 'six', 'sixth', 'sei', 'sesta', 'sesto'] };

function lev(a, b) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
// Close enough to be the same word: one letter off for words of four letters or more, two for seven or more.
const similar = (t, k) => t === k || (Math.min(t.length, k.length) >= 4 && lev(t, k) <= (Math.min(t.length, k.length) >= 7 ? 2 : 1));

export const normalise = raw => raw.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9% ]+/g, ' ').replace(/\s+/g, ' ').trim();

function matcher(q) {
  const tokens = q.split(' ');
  return name => V[name].some(entry => {
    const exact = entry[0] === '=', w = exact ? entry.slice(1) : entry;
    if (!w.includes(' ')) return tokens.some(t => exact ? t === w : similar(t, w));
    if (q.includes(w)) return true;
    const n = w.split(' ').length;                                   // a phrase: compare it with every run of as many words
    for (let i = 0; i + n <= tokens.length; i++) { const run = tokens.slice(i, i + n).join(' '); if (run.length >= 6 && lev(run, w) <= (w.length >= 10 ? 2 : 1)) return true; }
    return false;
  });
}
const numberIn = q => { const t = q.split(' '); for (const [n, words] of Object.entries(NUMBERS)) if (t.some(x => words.includes(x))) return +n; return 0; };

// ---- what the page says, in the language the listener chose
const TEXT = {
  'en-US': {
    on: 'Voice control on.', off: 'Voice control off.', lang: 'English.',
    hint: { entrance: 'Say explore.', globe: 'Say a place, tour, or list.', player: 'Say listen, or help.' },
    help: { entrance: 'Say explore to enter, or start tour to hear all six sounds.',
      globe: 'Say start tour, tour with descriptions, content list, or a place: Amazon, Congo or Antarctica. You can add lightning, ocean or aerosols, or say track and a number from one to six.',
      player: 'Say listen, pause, resume, stop, again, next, previous, track and a number, describe, what do I hear, source, repeat, louder, quieter, where am I, or close.' },
    entrance: 'Entrance.', globe: 'Globe.', list: 'Content list. Say a place and a phenomenon, read the list, or close.', listClosed: 'List closed.',
    tour: n => `Tour: ${n}.`, tourTold: 'Tour with descriptions.', ready: n => `${n}. Say listen to hear it.`, imageOnly: n => `${n}. Image only, no sound. Say describe.`,
    which: p => `Which place for ${p}: Amazon, Congo or Antarctica?`, sayExplore: 'Say explore to enter.', unknown: 'Not understood.', sayHelp: 'Say help.',
    volume: p => `Volume ${p} percent.`, repeatOn: 'Repeat on.', repeatOff: 'Repeat off.', noRepeat: 'This view has no sound to repeat.',
    describing: n => `Describing ${n}.`, descStopped: 'Description stopped.', paused: 'Paused.', nothing: 'Nothing is playing.', stopped: 'Stopped.',
    next: n => `Next: ${n}.`, prev: n => `Previous: ${n}.`, noSound: 'This view is image only. Say describe, or next.', already: 'Already playing.', playing: n => `Playing ${n}.`,
    states: { ready: 'ready', none: 'image only, no sound', playing: 'playing', paused: 'paused', describing: 'describing' },
    status: (n, track, st, vol, rep) => `${n}${track ? `, track ${track[0]} of ${track[1]}` : ''}, ${st}. Volume ${vol} percent. Repeat ${rep ? 'on' : 'off'}.`,
    readList: (sound, silent) => `Six views with sound: ${sound}. Three image only: ${silent}.`,
    blocked: 'The microphone is blocked for this page. Voice control is off. Every command is also a button.', noMic: 'No microphone was found. Voice control is off.',
    network: 'The speech service cannot be reached. Trying again.', unsupported: 'Voice control needs Chrome or Edge. Every command is also a button.'
  },
  'it-IT': {
    on: 'Controllo vocale attivo.', off: 'Controllo vocale spento.', lang: 'Italiano.',
    hint: { entrance: 'Di\' esplora.', globe: 'Di\' un luogo, tour, oppure elenco.', player: 'Di\' ascolta, oppure aiuto.' },
    help: { entrance: 'Di\' esplora per entrare, oppure avvia il tour per ascoltare tutti e sei i suoni.',
      globe: 'Di\' avvia il tour, tour con descrizioni, elenco, oppure un luogo: Amazzonia, Congo o Antartide. Puoi aggiungere fulmini, oceano o aerosol, oppure dire traccia e un numero da uno a sei.',
      player: 'Di\' ascolta, pausa, riprendi, ferma, da capo, avanti, indietro, traccia e un numero, descrivi, cosa sento, fonte, ripeti, alza, abbassa, dove sono, oppure chiudi.' },
    entrance: 'Ingresso.', globe: 'Globo.', list: 'Elenco. Di\' un luogo e un fenomeno, leggi l\'elenco, oppure chiudi.', listClosed: 'Elenco chiuso.',
    tour: n => `Tour: ${n}.`, tourTold: 'Tour con descrizioni.', ready: n => `${n}. Di' ascolta per sentirlo.`, imageOnly: n => `${n}. Solo immagine, senza suono. Di' descrivi.`,
    which: p => `Quale luogo per ${p}: Amazzonia, Congo o Antartide?`, sayExplore: 'Di\' esplora per entrare.', unknown: 'Non ho capito.', sayHelp: 'Di\' aiuto.',
    volume: p => `Volume ${p} per cento.`, repeatOn: 'Ripetizione attiva.', repeatOff: 'Ripetizione spenta.', noRepeat: 'Questa vista non ha un suono da ripetere.',
    describing: n => `Descrivo ${n}.`, descStopped: 'Descrizione interrotta.', paused: 'In pausa.', nothing: 'Non c\'è niente in riproduzione.', stopped: 'Fermato.',
    next: n => `Avanti: ${n}.`, prev: n => `Indietro: ${n}.`, noSound: 'Questa vista è solo immagine. Di\' descrivi, oppure avanti.', already: 'È già in riproduzione.', playing: n => `In riproduzione: ${n}.`,
    states: { ready: 'pronto', none: 'solo immagine, senza suono', playing: 'in riproduzione', paused: 'in pausa', describing: 'descrizione in corso' },
    status: (n, track, st, vol, rep) => `${n}${track ? `, traccia ${track[0]} di ${track[1]}` : ''}, ${st}. Volume ${vol} per cento. Ripetizione ${rep ? 'attiva' : 'spenta'}.`,
    readList: (sound, silent) => `Sei viste con suono: ${sound}. Tre solo immagine: ${silent}.`,
    blocked: 'Il microfono è bloccato per questa pagina. Il controllo vocale è spento. Ogni comando è anche un pulsante.', noMic: 'Non trovo un microfono. Il controllo vocale è spento.',
    network: 'Il servizio vocale non è raggiungibile. Riprovo.', unsupported: 'Il controllo vocale richiede Chrome o Edge. Ogni comando è anche un pulsante.'
  }
};

// ---- short tones: rising for done, falling for paused or stopped, low for not understood, a tick when the microphone reopens
let actx = null;
function tone(kind) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume?.();
    const notes = { ok: [[880, 0], [1320, 0.07]], down: [[660, 0], [440, 0.08]], error: [[240, 0], [200, 0.13]], ready: [[1250, 0]] }[kind];
    const now = actx.currentTime, peak = kind === 'ready' ? 0.045 : 0.09, len = kind === 'ready' ? 0.06 : 0.13;
    for (const [freq, at] of notes) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, now + at); g.gain.linearRampToValueAtTime(peak, now + at + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, now + at + len);
      o.connect(g).connect(actx.destination); o.start(now + at); o.stop(now + at + len + 0.02);
    }
  } catch {}
}

export function createVoice(app, ui) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, enabled = false, speaking = false, lang = 'en-US', restartTimer = 0, duckTimer = 0, misses = 0, tickNext = false;
  try { if (localStorage.getItem('pts-voice-lang') === 'it-IT') lang = 'it-IT'; } catch {}

  const T = () => TEXT[lang], it = () => lang === 'it-IT';
  const name = s => it() ? `${IT.place[s.id]}, ${IT.phenomenon[s.phenomenon]}` : `${s.place}, ${sourceOf(s).label.toLowerCase()}`;
  const pct = () => Math.round(player.state.volume * 100);
  const quiet = () => player.state.status === 'playing';            // while a sound plays, replies stay on screen only
  // A reply is spoken (say), or shown with a tone (tone), or just shown when the sound itself is the answer.
  const said = text => ({ text, say: true });
  const shown = (text, t = 'ok') => ({ text, say: false, tone: t });
  const either = (text, t = 'ok') => quiet() ? shown(text, t) : said(text);

  function target(has) {
    if (has('southern')) return { scene: byId('antarctica-ocean') };
    if (has('wind')) return { scene: byId('antarctica-lightning') };
    if (has('cough')) return { scene: byId('congo-aerosols') };
    if (has('soprano')) return { scene: byId('amazon-ocean') };
    const region = ['amazon', 'congo', 'antarctica'].find(has), phen = ['lightning', 'ocean', 'aerosols'].find(has);
    if (region && phen) return { scene: SCENES.find(s => s.region === region && s.phenomenon === phen) };
    if (region) return { scene: PLAYLIST.map(byId).find(s => s.region === region) };
    if (phen) return { ask: T().which(it() ? IT.phenomenon[phen] : phen) };
    return null;
  }

  function status() {
    const v = app.view();
    if (v === 'entrance') return `${T().entrance} ${T().help.entrance}`;
    if (v === 'globe') return app.listOpen() ? T().list : `${T().globe} ${T().help.globe}`;
    const s = player.scene(), i = PLAYLIST.indexOf(s.id);
    const st = T().states[player.state.status === 'idle' ? (s.audio ? 'ready' : 'none') : player.state.status];
    return T().status(name(s), i >= 0 ? [i + 1, PLAYLIST.length] : null, st, pct(), player.state.repeat);
  }
  const playScene = s => { app.openScene(s.id); player.play(); return shown(T().playing(name(s)), null); };

  // Works out what a phrase asks for. Returns a function that performs it and gives the reply, or null if nothing matches.
  function plan(q) {
    if (!q) return null;
    const has = matcher(q), v = app.view();

    if (has('off')) return () => { setEnabled(false); return said(T().off); };
    if (player.state.status === 'describing')                       // the page is speaking: only a stop gets through
      return has('stop') || has('pause') ? () => { player.pause(); return shown(T().descStopped, 'down'); } : null;
    if (has('langIt') && !has('langEn')) return () => { setLang('it-IT'); return said(T().lang); };
    if (has('langEn')) return () => { setLang('en-US'); return said(T().lang); };
    if (has('help')) return () => said(T().help[v]);
    if (has('status')) return () => said(status());
    if (has('tour')) return () => {
      player.setNarration(has('narration') && !has('without'));      // "tour with descriptions" reads each image before its sound
      app.startTour();
      return shown(player.state.narration ? T().tourTold : T().tour(name(player.scene())), null);
    };
    if (has('readList')) return () => {
      const sound = PLAYLIST.map(byId).map(name).join('; '), silent = SCENES.filter(s => !s.audio).map(name).join('; ');
      return said(T().readList(sound, silent));
    };
    if (app.listOpen() && has('close')) return () => { app.closeList(); return either(T().listClosed, 'down'); };
    if (has('list')) return () => { app.openList(); return said(T().list); };

    if (v === 'player' && has('explain')) { const s = player.scene(); return () => said(!s.audio ? (it() ? IT.imageOnly : IMAGE_ONLY_NOTE)
      : it() ? `${IT.soundKey[s.id]} ${IT.limits[s.id] || IT.limits[s.phenomenon]}` : `${s.soundKey} ${limitsOf(s)}`); }

    const n = numberIn(q);                                           // "track three", "traccia 3", "numero due"
    if (has('track') && n) return () => playScene(byId(PLAYLIST[n - 1]));
    if (has('first')) return () => playScene(byId(PLAYLIST[0]));
    if (has('last')) return () => playScene(byId(PLAYLIST[PLAYLIST.length - 1]));

    const t = target(has);
    if (t?.ask) return () => said(t.ask);
    if (t?.scene) return () => {
      const s = t.scene;
      if (has('play') && s.audio) return playScene(s);
      app.openScene(s.id);
      return said(s.audio ? T().ready(name(s)) : T().imageOnly(name(s)));
    };
    if (has('home')) return () => { app.home(); return said(`${T().entrance} ${T().hint.entrance}`); };

    if (v === 'entrance') return has('enter') || has('explore') ? () => { app.enter(); return said(`${T().globe} ${T().hint.globe}`); } : null;
    if (v === 'globe') return has('play') ? () => { app.startTour(); return shown(T().tour(name(player.scene())), null); } : null;

    // ---- player: one command for every control on the page
    const s = player.scene();
    if (has('volume') || has('mute') || has('max') || has('min')) return () => {
      const num = q.match(/\b(\d{1,3})\b/);
      if (has('mute')) player.setVolume(0);
      else if (has('max')) player.setVolume(1);
      else if (has('min')) player.setVolume(0.1);
      else if (num) player.setVolume(Math.min(100, +num[1]) / 100);
      else if (has('up')) player.setVolume(player.state.volume + 0.2);
      else if (has('down')) player.setVolume(player.state.volume - 0.2);
      return shown(T().volume(pct()));
    };
    if (has('repeat')) return () => {
      if (!s.audio) return said(T().noRepeat);
      const off = has('negative'); player.setRepeat(!off); return either(off ? T().repeatOff : T().repeatOn, off ? 'down' : 'ok');
    };
    if (has('describe')) return () => { player.describe(); return shown(T().describing(name(s)), null); };
    if (has('source')) return () => said(it() ? IT.source[s.phenomenon] : `${sourceOf(s).sourceId}. ${sourceOf(s).period}`);
    if (has('close') || has('explore')) return () => { app.closePlayer(); return said(`${T().globe} ${T().hint.globe}`); };
    if (has('again')) return () => { if (!s.audio) return said(T().noSound); player.stop(); player.play(); return shown(T().playing(name(s)), null); };
    if (has('pause')) return () => player.pause() ? shown(T().paused, 'down') : said(T().nothing);
    if (has('stop')) return () => { player.stop(); return shown(T().stopped, 'down'); };
    if (has('next')) return () => { player.step(1); return either(T().next(name(player.scene())), null); };
    if (has('prev')) return () => { player.step(-1); return either(T().prev(name(player.scene())), null); };
    if (has('play')) return () => {
      const r = player.play();
      if (r === 'image-only') return said(T().noSound);
      return shown(r === 'already' ? T().already : T().playing(name(s)), r === 'already' ? 'ok' : null);
    };
    return null;
  }

  // ---- speech out. The microphone closes while the page speaks, so it never hears itself, and reopens with a tick.
  function speak(text) {
    speaking = true; try { rec?.abort(); } catch {}
    if (player.state.status === 'playing') player.setDuck(0.25);
    player.sayText(text, () => { speaking = false; player.setDuck(1); tickNext = true; listenSoon(); });
  }

  function answer(text, r) {
    ui.heard(text, r.text);
    if (r.say) speak(r.text);
    else { if (r.tone) tone(r.tone); player.announce(r.text); }
    return r;
  }

  // Tries each thing the recogniser thinks it heard, best first, and acts on the first that is a command.
  function run(alternatives) {
    const list = [].concat(alternatives).filter(Boolean);
    for (const text of list) {
      const act = plan(normalise(text));
      if (act) { misses = 0; return answer(text, act()); }
    }
    const text = list[0] || '';
    if (!text || quiet() || player.state.status === 'describing') { ui.heard(text, ''); return null; }
    // Not a command. Say so once, then only signal it with a tone, so chatter nearby does not keep the page talking.
    const v = app.view(), first = misses++ === 0 && text.split(/\s+/).length <= 5;
    const hint = `${T().unknown} ${v === 'entrance' ? T().hint.entrance : T().sayHelp}`;
    return answer(text, first ? said(hint) : shown(hint, 'error'));
  }

  // ---- speech in
  function listenSoon() { clearTimeout(restartTimer); restartTimer = setTimeout(listen, 150); }
  function listen() {
    if (!enabled || speaking || rec) return;
    const r = new SR(); rec = r;
    const handled = new Set(), timers = {};
    r.lang = lang; r.continuous = true; r.interimResults = true; r.maxAlternatives = 5;
    r.onstart = () => { if (tickNext) { tickNext = false; tone('ready'); } };
    r.onresult = e => {
      if (player.state.status === 'playing') {                       // lower the sound while the listener is speaking
        player.setDuck(0.35); clearTimeout(duckTimer); duckTimer = setTimeout(() => { if (!speaking) player.setDuck(1); }, 1400);
      }
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (handled.has(i)) continue;
        const res = e.results[i], alts = Array.from(res, a => a.transcript.trim()).filter(Boolean);
        if (!alts.length) continue;
        clearTimeout(timers[i]);
        if (res.isFinal) { handled.add(i); run(alts); continue; }
        ui.interim(alts[0]);
        // Do not wait for the recogniser to make up its mind: a clear command that stays unchanged for a moment is obeyed.
        timers[i] = setTimeout(() => { if (!handled.has(i) && rec === r && plan(normalise(alts[0]))) { handled.add(i); run(alts); } }, 550);
      }
    };
    r.onerror = e => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') {
        const why = e.error === 'audio-capture' ? T().noMic : T().blocked;
        setEnabled(false); ui.message(why); player.announce(why);
      } else if (e.error === 'network') ui.message(T().network);
    };
    r.onend = () => { Object.values(timers).forEach(clearTimeout); if (rec === r) rec = null; if (enabled && !speaking) listenSoon(); };   // recognition times out on silence: keep it alive
    try { r.start(); ui.state('on'); } catch { rec = null; listenSoon(); }
  }
  // Safety net: whatever happens to a session, the microphone comes back within a few seconds while voice control is on.
  setInterval(() => { if (enabled && !speaking && !rec) listen(); }, 3000);

  function setEnabled(on) {
    if (on && !SR) { ui.message(T().unsupported); return; }
    enabled = on; clearTimeout(restartTimer); misses = 0;
    if (!on) { try { rec?.abort(); } catch {} rec = null; player.setDuck(1); ui.state('off'); return; }
    ui.state('on');
    speak(`${T().on} ${T().hint[app.view()]}`);
  }
  function setLang(l) {
    lang = l; try { localStorage.setItem('pts-voice-lang', l); } catch {}
    ui.lang(l);
    if (enabled) { try { rec?.abort(); } catch {} }                  // restart recognition in the new language
  }

  ui.lang(lang); ui.state(SR ? 'off' : 'unsupported');
  return {
    toggle: () => setEnabled(!enabled),
    setLang: l => { setLang(l); if (enabled) speak(T().lang); },
    run, plan: text => plan(normalise(text)), isOn: () => enabled, lang: () => lang,
    // From the browser console: ptsVoice.voices() lists the voices; ptsVoice.useVoice('Google italiano') keeps one for the current language.
    voices: () => speechSynthesis.getVoices().map(v => `${v.name} (${v.lang})`),
    voice: () => player.pickVoice()?.name || null,
    useVoice: n => { try { n ? localStorage.setItem('pts-tts-' + lang, n) : localStorage.removeItem('pts-tts-' + lang); } catch {} return player.pickVoice()?.name || null; }
  };
}
