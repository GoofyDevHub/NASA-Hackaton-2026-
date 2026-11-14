// Voice control: spoken commands drive the same actions as the buttons, from the entrance to the player.
// It uses the browser's speech recognition (Chrome, Edge) and only after the listener turns it on.
import { SCENES, REGIONS, PLAYLIST, byId, sourceOf } from './scenes.js';
import * as player from './player.js';

const REGION_WORDS = { amazon: /\bamazon\w*|\bamazzon\w*/, congo: /\bcongo\b|\bafrica\b/, antarctica: /\bantarc?tic\w*|\bantartid\w*|\bpolar\w*|\bpolo\b|\bpeninsula\b|\bpenisola\b/ };
const PHEN_WORDS = { lightning: /\blightning\b|\bstorms?\b|\bthunder\b|\bfulmin\w*|\btemporal\w*|\btuon\w*/, ocean: /\boceans?\b|\bsea\b|\batlantic\w*|\bocean\w*|\bmare\b|\batlantico\b/, aerosols: /\baerosols?\b|\bsmoke\b|\bpollution\b|\baerosol\w*|\bfumo\b|\binquinamento\b/ };
const DIRECT = [[/\bsouthern ocean\b|\boceano (meridionale|antartico|australe)\b/, 'antarctica-ocean'], [/\bwind\b|\bvento\b/, 'antarctica-lightning'], [/\bcough\w*|\btosse\b/, 'congo-aerosols'], [/\bsoprano\b/, 'amazon-ocean']];

const HELP = {
  entrance: 'Say explore to enter, or start tour to hear all six sounds.',
  globe: 'Say start tour, content list, or a place: Amazon, Congo or Antarctica. You can add lightning, ocean or aerosols.',
  player: 'Say listen, pause, resume, stop, next, previous, describe, repeat on, repeat off, louder, quieter, or close. Say where am I for the current view.'
};

export function createVoice(app, ui) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, enabled = false, speaking = false, lang = 'en-US', restartTimer = 0;
  try { if (localStorage.getItem('pts-voice-lang') === 'it-IT') lang = 'it-IT'; } catch {}

  const name = s => `${s.place}, ${sourceOf(s).label.toLowerCase()}`;
  const pct = () => Math.round(player.state.volume * 100);
  const quiet = () => player.state.status === 'playing';            // while a sound plays, replies stay on screen only

  function target(q) {
    for (const [re, id] of DIRECT) if (re.test(q)) return { scene: byId(id) };
    const region = Object.keys(REGION_WORDS).find(k => REGION_WORDS[k].test(q));
    const phen = Object.keys(PHEN_WORDS).find(k => PHEN_WORDS[k].test(q));
    if (region && phen) return { scene: SCENES.find(s => s.region === region && s.phenomenon === phen) };
    if (region) return { scene: PLAYLIST.map(byId).find(s => s.region === region) };
    if (phen) return { ask: `Which place for ${phen}: Amazon, Congo or Antarctica?` };
    return null;
  }

  function status() {
    const v = app.view();
    if (v === 'entrance') return 'Entrance. ' + HELP.entrance;
    if (v === 'globe') return (app.listOpen() ? 'Content list. ' : 'Globe. ') + HELP.globe;
    const s = player.scene(), i = PLAYLIST.indexOf(s.id);
    const st = { idle: s.audio ? 'ready' : 'image only, no sound', playing: 'playing', paused: 'paused', describing: 'describing' }[player.state.status];
    return `${name(s)}${i >= 0 ? `, track ${i + 1} of ${PLAYLIST.length}` : ''}, ${st}. Volume ${pct()} percent. Repeat ${player.state.repeat ? 'on' : 'off'}.`;
  }

  // Runs one spoken or typed phrase. Returns { text, say } or null when the phrase is ignored.
  function handle(raw) {
    const q = raw.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9% ]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!q) return null;
    const has = re => re.test(q), v = app.view(), reply = (text, say = !quiet()) => ({ text, say });

    if (has(/\b(stop listening|voice off|turn off (the )?voice|microphone off|basta ascoltare|(disattiva|spegni) (la )?voce|spegni (il )?microfono)\b/)) { setEnabled(false); return reply('Voice control off.', true); }
    if (player.state.status === 'describing') {                     // the page is speaking: only a stop gets through
      if (has(/\b(stop|pause|pausa|ferma|basta|silenzio)\b/)) { player.pause(); return reply('Description stopped.'); }
      return null;
    }
    if (has(/\b(help|commands?|what can i say|aiuto|comandi)\b/)) return reply(HELP[v], true);
    if (has(/\b(where am i|status|what is (this|playing)|dove sono|stato|cosa (sto ascoltando|e questo))\b/)) return reply(status(), true);

    if (has(/\b(start (the )?tour|guided tour|tour|play (all|everything)|playlist|percorso|(avvia|inizia|fai partire) (il )?(tour|giro))\b/)) {
      app.startTour(); return reply(`Tour: ${name(player.scene())}.`, false);
    }
    if (app.listOpen() && has(/\b(close|cancel|chiudi|annulla)\b/)) { app.closeList(); return reply('List closed.'); }
    if (has(/\b(content list|contents?|list|elenco|lista|contenuti)\b/)) {
      app.openList();
      return reply('Content list, nine views. Say a place and a phenomenon, for example Congo aerosols, or say close.', true);
    }

    const t = target(q);
    if (t?.ask) return reply(t.ask, true);
    if (t?.scene) {
      const s = t.scene, wantsSound = has(/\b(play|listen|hear|ascolta|ascoltare|suona|riproduci|senti)\b/);
      app.openScene(s.id);
      if (wantsSound && s.audio) { player.play(); return reply(`${name(s)}.`, false); }
      return reply(`${name(s)}. ${s.audio ? 'Say listen to hear it.' : 'Image only, no sound. Say describe for a description.'}`, true);
    }

    if (has(/\b(home|entrance|inizio|pagina iniziale)\b/)) { app.home(); return reply('Entrance. ' + HELP.entrance, true); }

    if (v === 'entrance') {
      if (has(/\b(explore|enter|start|begin|go|open|continue|esplora|entra|inizia|comincia|avanti|vai|apri)\b/)) { app.enter(); return reply('Globe. ' + HELP.globe, true); }
      return reply('Say explore to enter.', true);
    }
    if (v === 'globe') {
      if (has(/\b(play|listen|start|ascolta|suona|riproduci|avvia)\b/)) { app.startTour(); return reply(`Tour: ${name(player.scene())}.`, false); }
      return reply('Not understood. ' + HELP.globe, true);
    }

    // ---- player
    const s = player.scene();
    if (has(/\b(volume|louder|quieter|softer|mute|alza|abbassa|piu (forte|alto|piano|basso))\b/)) {
      const n = q.match(/\b(\d{1,3})\b/);
      if (has(/\bmute\b|\bmuto\b/)) player.setVolume(0);
      else if (n) player.setVolume(Math.min(100, +n[1]) / 100);
      else if (has(/\b(louder|up|higher|alza|aumenta|piu (forte|alto))\b/)) player.setVolume(player.state.volume + 0.2);
      else if (has(/\b(quieter|softer|down|lower|abbassa|diminuisci|piu (piano|basso))\b/)) player.setVolume(player.state.volume - 0.2);
      return reply(`Volume ${pct()} percent.`);
    }
    if (has(/\b(repeat|loop|ripeti|ripetizione)\b/)) {
      const off = has(/\b(off|stop|no|not|disattiva|spegni|togli|basta)\b/);
      if (!s.audio) return reply('This view has no sound to repeat.', true);
      player.setRepeat(!off); return reply(`Repeat ${off ? 'off' : 'on'}.`);
    }
    if (has(/\b(describe|description|descrivi|descrizione)\b/)) { player.describe(); return reply(`Describing ${name(s)}.`, false); }
    if (has(/\b(close|exit|go back|back to (the )?(globe|earth)|globe|chiudi|esci|torna (indietro|al globo)|globo)\b/)) { app.closePlayer(); return reply('Globe. ' + HELP.globe, true); }
    if (has(/\b(pause|pausa|hold on|aspetta)\b/)) return player.pause() ? reply('Paused.', true) : reply('Nothing is playing.', true);
    if (has(/\b(stop|ferma|fermati|basta|silenzio)\b/)) { player.stop(); return reply('Stopped.', true); }
    if (has(/\b(next|forward|skip|successiv\w*|prossim\w*|avanti)\b/)) { player.step(1); return reply(`Next: ${name(player.scene())}.`); }
    if (has(/\b(previous|back|before|precedente|indietro)\b/)) { player.step(-1); return reply(`Previous: ${name(player.scene())}.`); }
    if (has(/\b(resume|continue|play|listen|start|hear|go|riprendi|continua|ascolta|suona|riproduci|avvia|vai)\b/)) {
      const r = player.play();
      if (r === 'image-only') return reply('This view is image only. Say describe, or next.', true);
      return reply(r === 'already' ? 'Already playing.' : `Playing ${name(s)}.`, false);
    }
    return quiet() ? null : reply('Not understood. Say help.', true);
  }

  // ---- speech in and out
  function speak(text) {
    if (!('speechSynthesis' in window)) { player.announce(text); return; }
    speaking = true; try { rec?.abort(); } catch {}                 // close the microphone so the page never hears itself
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US';
    const done = () => { if (speaking) { speaking = false; listenSoon(); } };
    u.onend = done; u.onerror = done;
    speechSynthesis.speak(u);
    setTimeout(done, 1500 + text.length * 90);                      // safety net if the browser never reports the end
  }
  function run(text) {
    const r = handle(text);
    ui.heard(text, r ? r.text : '');
    if (r?.say) speak(r.text); else if (r) player.announce(r.text);
    return r;
  }
  function listenSoon() { clearTimeout(restartTimer); restartTimer = setTimeout(listen, 250); }
  function listen() {
    if (!enabled || speaking || rec) return;
    const r = new SR(); rec = r;
    r.lang = lang; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
    r.onresult = e => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text = e.results[i][0].transcript.trim();
        if (e.results[i].isFinal) { if (text) run(text); } else ui.interim(text);
      }
    };
    r.onerror = e => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') {
        setEnabled(false);
        const why = e.error === 'audio-capture' ? 'No microphone was found.' : 'The microphone is blocked for this page.';
        ui.message(`${why} Voice control is off. Every command is also a button.`); player.announce(`${why} Voice control is off.`);
      } else if (e.error === 'network') ui.message('The speech service cannot be reached. Trying again.');
    };
    r.onend = () => { if (rec === r) rec = null; if (enabled && !speaking) listenSoon(); };      // recognition times out on silence: keep it alive
    try { r.start(); ui.state('on'); } catch { rec = null; listenSoon(); }
  }
  function setEnabled(on) {
    if (on && !SR) { ui.message('Voice control needs Chrome or Edge. Every command is also a button.'); return; }
    enabled = on; clearTimeout(restartTimer);
    if (!on) { try { rec?.abort(); } catch {} rec = null; ui.state('off'); return; }
    ui.state('on');
    speak('Voice control on. ' + HELP[app.view()]);
  }
  function setLang(l) { lang = l; try { localStorage.setItem('pts-voice-lang', l); } catch {} if (enabled) { try { rec?.abort(); } catch {} } ui.lang(l); }

  ui.lang(lang); ui.state(SR ? 'off' : 'unsupported');
  return { toggle: () => setEnabled(!enabled), setLang, run, handle, isOn: () => enabled };
}
