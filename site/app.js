import { SCENES, REGIONS, PLAYLIST, byId, sourceOf, fullDescription } from './scenes.js';
import * as player from './player.js';
import { createGlobe } from './globe.js';

const $ = id => document.getElementById(id);
const { state } = player;
const narrow = matchMedia('(max-aspect-ratio: 1/1)');
let view = 'entrance', opener = null, hot = null, shown = null;

// ---- announcements
const live = $('live');
player.onAnnounce(msg => { live.textContent = ''; setTimeout(() => { live.textContent = msg; }, 60); });

// ---- one pin per region we hold images for. A pin opens the region's first sound.
const PIN = '<svg viewBox="0 0 28 37" aria-hidden="true"><path d="M14 36C9 27 2 21.5 2 13.5a12 12 0 0 1 24 0C26 21.5 19 27 14 36z" fill="#FE8500" stroke="#B85F00" stroke-width="1"/><circle cx="14" cy="13.5" r="4.6" fill="#1E2030"/></svg>';
const firstScene = regionId => PLAYLIST.map(byId).find(s => s.region === regionId);
const pinEls = {};
for (const [id, region] of Object.entries(REGIONS)) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'pin'; b.innerHTML = PIN;
  b.setAttribute('aria-label', `${region.label}: open ${firstScene(id).place}, ${sourceOf(firstScene(id)).subtitle}`);
  b.addEventListener('click', () => openScene(firstScene(id).id, b));
  // The globe holds still while a pin is pointed at or focused, so it is easy to press.
  for (const ev of ['pointerenter', 'focus']) b.addEventListener(ev, () => { hot = id; globe.setRotating(false); });
  for (const ev of ['pointerleave', 'blur']) b.addEventListener(ev, () => { if (hot === id) { hot = null; globe.setRotating(true); } });
  $('pins').append(b); pinEls[id] = b;
}

const callout = $('callout'), cline = $('callout-line');
function place(pos, g) {
  for (const [id, el] of Object.entries(pinEls)) {
    el.style.left = pos[id].x + 'px'; el.style.top = pos[id].y + 'px';
    el.style.visibility = pos[id].visible ? 'visible' : 'hidden';
  }
  const p = hot && view === 'globe' && pos[hot]?.visible ? pos[hot] : null;
  callout.hidden = cline.hidden = !p;
  if (!p) return;
  const s = firstScene(hot), u = g.R / 21.3;                 // callout sits up and to the left of the pin, as in the reference
  callout.querySelector('.c-title').textContent = REGIONS[hot].label;
  callout.querySelector('.c-sub').textContent = sourceOf(s).subtitle;
  const w = callout.offsetWidth, h = callout.offsetHeight;
  const x = Math.max(8, p.x - w - u * 2.4), y = Math.max(8, p.y - h - u * 3.2);
  callout.style.transform = `translate(${x}px, ${y}px)`;
  const ax = x + w, ay = y + h, tx = p.x - u * 0.2, ty = p.y - u * 1.6;
  cline.style.width = Math.hypot(tx - ax, ty - ay) + 'px';
  cline.style.transform = `translate(${ax}px, ${ay}px) rotate(${Math.atan2(ty - ay, tx - ax)}rad)`;
}

const globe = createGlobe($('globe'), {
  texture: 'textures/earth.jpg',
  pins: Object.entries(REGIONS).map(([id, r]) => ({ id, lat: r.lat, lon: r.lon })),
  onPositions: place
});

// ---- deep space: a fixed field of small stars, the same on every visit
const stars = $('stars');
function drawStars() {
  const w = innerWidth, h = innerHeight, d = Math.min(devicePixelRatio || 1, 2), x = stars.getContext('2d');
  stars.width = w * d; stars.height = h * d; x.setTransform(d, 0, 0, d, 0, 0);
  let seed = 20261114; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let i = 0, n = Math.round(w * h / 2600); i < n; i++) {
    const big = rnd() < 0.06, r = big ? 0.9 + rnd() * 0.7 : 0.35 + rnd() * 0.5, tint = rnd();
    x.fillStyle = tint < 0.12 ? '#FFE3C2' : tint < 0.24 ? '#CFE0FF' : '#FFFFFF';
    x.globalAlpha = big ? 0.75 + rnd() * 0.25 : 0.2 + rnd() * 0.55;
    x.beginPath(); x.arc(rnd() * w, rnd() * h, r, 0, 7); x.fill();
  }
}
drawStars(); addEventListener('resize', drawStars);

// ---- views: entrance -> globe -> player
const PLACEMENT = {
  entrance: () => narrow.matches ? { cx: 0.5, cy: 0.72, r: 0.2 } : { cx: 0.639, cy: 0.491, r: 0.391 },
  globe: () => narrow.matches ? { cx: 0.5, cy: 0.45, r: 0.24 } : { cx: 0.495, cy: 0.459, r: 0.379 }
};
function setView(v) {
  view = v; document.body.dataset.view = v;
  $('entrance').hidden = v !== 'entrance'; $('explorer').hidden = v !== 'globe'; $('player').hidden = v !== 'player';
  globe.setVisible(v !== 'player'); globe.setInteractive(v === 'globe');
  if (PLACEMENT[v]) globe.setPlacement(PLACEMENT[v]());
  for (const el of Object.values(pinEls)) el.tabIndex = v === 'globe' ? 0 : -1;
  if (v !== 'globe') { hot = null; callout.hidden = cline.hidden = true; }      // the pin label never outlives the globe view
}
narrow.addEventListener('change', () => PLACEMENT[view] && globe.setPlacement(PLACEMENT[view]()));

$('explore').addEventListener('click', () => { setView('globe'); $('tour').focus({ preventScroll: true }); player.announce('Globe. Choose an orange pin, start the tour or open the content list.'); });

function openScene(id, from) {
  opener = from; hot = null; globe.setRotating(true);
  player.select(id);
  $('p-title').focus();
}
function closePlayer() { player.stop(); player.closePanel(); }

$('tour').addEventListener('click', () => { opener = $('tour'); player.startPlaylist(); $('p-title').focus(); });

// ---- content list: all nine views, grouped by region
const contents = $('contents');
for (const [regionId, region] of Object.entries(REGIONS)) {
  const h = document.createElement('h3'); h.textContent = region.label;
  const ul = document.createElement('ul');
  for (const s of SCENES.filter(x => x.region === regionId)) {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<img alt=""><span class="n"></span><span class="k"></span><span class="t"></span>';
    b.children[0].src = s.image; b.children[1].textContent = s.place; b.children[2].textContent = sourceOf(s).subtitle;
    b.children[3].textContent = s.audio ? (s.illustrative ? 'Illustrative sound' : 'Sound') : 'Image only';
    if (!s.audio) b.children[3].classList.add('mute');
    b.addEventListener('click', () => { contents.close(); openScene(s.id, $('list')); });
    li.append(b); ul.append(li);
  }
  $('contents-body').append(h, ul);
}
$('list').addEventListener('click', () => contents.showModal());
$('contents-close').addEventListener('click', () => contents.close());
contents.addEventListener('click', e => { if (e.target === contents) contents.close(); });      // click on the backdrop

// ---- player controls
$('p-listen').addEventListener('click', () => {
  if (state.status === 'playing' && player.startedAgo() < 500) return;      // a quick second press on Listen must not pause
  state.status === 'playing' || state.status === 'describing' ? player.pause() : player.play();
});
$('p-stop').addEventListener('click', player.stop);
$('p-prev').addEventListener('click', () => player.step(-1));
$('p-next').addEventListener('click', () => player.step(1));
$('p-describe').addEventListener('click', player.describe);
$('p-repeat').addEventListener('change', e => player.setRepeat(e.target.checked));
$('p-volume').addEventListener('input', e => player.setVolume(e.target.value / 100));
$('p-close').addEventListener('click', closePlayer);
$('crumb-explore').addEventListener('click', closePlayer);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && view === 'player') closePlayer(); });

const ICON = {
  play: '<svg viewBox="0 0 14 16" width="0.85em" aria-hidden="true"><path d="M1.5 1.5 12.5 8 1.5 14.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  pause: '<svg viewBox="0 0 12 14" width="0.75em" aria-hidden="true"><path d="M2.5 1v12M9.5 1v12" stroke="currentColor" stroke-width="2.6"/></svg>'
};
const STATUS = { idle: 'Ready to listen', playing: 'Listening', paused: 'Paused', describing: 'Describing the image' };

function render() {
  const s = player.scene(), open = state.panelOpen && !!s;
  if (open && view !== 'player') setView('player');
  if (!open && view === 'player') {
    setView('globe');
    // Return focus to where the listener came from; a pin follows the region last shown (the globe has turned to it).
    const last = byId(shown);
    const back = opener && opener.classList.contains('pin') && last ? pinEls[last.region] : opener && document.contains(opener) ? opener : $('tour');
    opener = null; back.style.visibility = 'visible'; back.focus({ preventScroll: true });
  }
  if (!open) { shown = null; return; }

  if (s.id !== shown) {
    shown = s.id;
    const src = sourceOf(s);
    $('p-title').textContent = s.place;
    $('p-sub').textContent = src.subtitle;
    $('p-image').alt = `NASA image: ${s.imageLabel}.`;
    const band = !!s.audioCropLabel;                       // Southern Ocean: regional thumbnail plus the wide band that drives the voice
    const img = $('p-image');
    img.onload = () => { const r = img.naturalWidth / img.naturalHeight, hh = Math.min(band ? 19 : 26.5, 40 / r);
      img.style.height = `calc(var(--u) * ${hh})`; img.style.width = `calc(var(--u) * ${hh * r})`; };
    img.src = band ? s.image : (s.audioCrop || s.image);
    $('p-tag').textContent = s.imageLabel;
    $('p-strip-wrap').hidden = !band; if (band) $('p-strip').src = s.audioCrop;
    $('p-legend').src = src.legend; $('p-legend').alt = src.legendAlt;
    $('p-source').innerHTML = '';
    const link = document.createElement('a'); link.href = src.page; link.textContent = src.sourceId;
    $('p-source').append(link, `. ${src.period} ${src.credit}.`);
    $('p-cue').textContent = s.audio ? `${s.cue}.${s.illustrative ? ' An illustrative cue, not a measurement.' : ''}` : 'Image only. No sound has been approved for this view.';
    const n = PLAYLIST.length, i = PLAYLIST.indexOf(s.id);
    const near = d => byId(PLAYLIST[i < 0 ? (d > 0 ? 0 : n - 1) : (i + d + n) % n]);
    $('p-prev-name').textContent = `${near(-1).place} · ${sourceOf(near(-1)).label}`;
    $('p-next-name').textContent = `${near(1).place} · ${sourceOf(near(1)).label}`;
    $('p-index').innerHTML = i < 0 ? '—' : `<b>${String(i + 1).padStart(2, '0')}</b> / ${String(n).padStart(2, '0')}`;
    trace.fill(0);
    $('p-desc').textContent = fullDescription(s);
    globe.lookAt(REGIONS[s.region].lat * 0.6, REGIONS[s.region].lon);
  }
  const status = s.audio || state.status === 'describing' ? state.status : 'none';
  $('player').dataset.status = status;
  $('p-status').textContent = status === 'none' ? 'Image only · no sound' : STATUS[status] + (state.status === 'playing' && s.illustrative ? ' · illustrative sound' : '');
  const pos = PLAYLIST.indexOf(s.id);
  $('p-tour').hidden = !(state.playlist && pos >= 0);
  $('p-tour').textContent = 'Guided tour';
  $('p-listen').hidden = !s.audio && state.status !== 'describing';
  $('p-listen').innerHTML = state.status === 'playing' || state.status === 'describing' ? `${ICON.pause} Pause`
    : state.status === 'paused' ? `${ICON.play} Resume` : `${ICON.play} Listen to the image`;
  $('p-stop').hidden = state.status === 'idle';
  $('p-repeat').checked = state.repeat; $('p-repeat').disabled = !s.audio;
  const v = Math.round(state.volume * 100);
  $('p-volume').value = v; $('p-volume').style.setProperty('--v', v + '%'); $('p-volume').setAttribute('aria-valuetext', `${v} percent`);
}
// ---- the thin orange line: flat at rest, it records the level of the actual sound as the track advances
const trace = new Float32Array(260), tcv = $('p-trace'), tctx = tcv.getContext('2d');
const still = matchMedia('(prefers-reduced-motion: reduce)');
const clock = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
function drawTrace() {
  requestAnimationFrame(drawTrace);
  if (view !== 'player') return;
  const w = tcv.clientWidth, h = tcv.clientHeight, d = Math.min(devicePixelRatio || 1, 2);
  if (!w) return;
  if (tcv.width !== Math.round(w * d)) { tcv.width = Math.round(w * d); tcv.height = Math.round(h * d); }
  const dur = player.duration(), pos = Math.min(player.position(), dur), N = trace.length, head = Math.min(N - 1, Math.floor(pos / dur * N));
  if (state.status === 'playing') trace[head] = Math.max(trace[head], still.matches ? 0 : player.level());
  if (state.status === 'idle' && pos === 0) trace.fill(0);
  $('p-time').textContent = `${clock(pos)} / ${clock(dur)}`;
  tctx.setTransform(d, 0, 0, d, 0, 0); tctx.clearRect(0, 0, w, h);
  const mid = h / 2, x = i => (i / (N - 1)) * w, px = pos / dur * w;
  tctx.lineWidth = 1; tctx.strokeStyle = '#6B6E7C'; tctx.beginPath(); tctx.moveTo(px, mid); tctx.lineTo(w, mid); tctx.stroke();
  tctx.strokeStyle = '#FE8500'; tctx.lineWidth = 1.5; tctx.lineJoin = 'round'; tctx.beginPath(); tctx.moveTo(0, mid);
  for (let i = 0; i <= head && pos > 0; i++) tctx.lineTo(x(i), mid + (i % 2 ? -1 : 1) * trace[i] * (h * 0.46));
  tctx.lineTo(px, mid); tctx.stroke();
  if (pos > 0) { tctx.fillStyle = '#FE8500'; tctx.beginPath(); tctx.arc(Math.min(w - 3, Math.max(3, px)), mid, 3, 0, 7); tctx.fill(); }
}
requestAnimationFrame(drawTrace);

player.subscribe(render);
setView('entrance');
render();
