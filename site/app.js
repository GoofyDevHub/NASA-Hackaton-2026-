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
    $('p-image').src = s.audioCrop || s.image;
    $('p-image').alt = `NASA image: ${s.imageLabel}.`;
    $('p-tag').textContent = `${src.sourceId} · ${s.audioCropLabel ? 'Southern Ocean band' : s.imageLabel}`;
    $('p-desc').textContent = fullDescription(s);
    globe.lookAt(REGIONS[s.region].lat * 0.6, REGIONS[s.region].lon);
  }
  const status = s.audio || state.status === 'describing' ? state.status : 'none';
  $('player').dataset.status = status;
  $('p-status').textContent = status === 'none' ? 'Image only · no sound' : STATUS[status] + (state.status === 'playing' && s.illustrative ? ' · illustrative sound' : '');
  const pos = PLAYLIST.indexOf(s.id);
  $('p-tour').hidden = !(state.playlist && pos >= 0);
  $('p-tour').textContent = `Guided tour · ${pos + 1} of ${PLAYLIST.length}`;
  $('p-listen').hidden = !s.audio && state.status !== 'describing';
  $('p-listen').innerHTML = state.status === 'playing' || state.status === 'describing' ? `${ICON.pause} Pause`
    : state.status === 'paused' ? `${ICON.play} Resume` : `${ICON.play} Listen to the image`;
  $('p-stop').hidden = state.status === 'idle';
  $('p-repeat').checked = state.repeat; $('p-repeat').disabled = !s.audio;
  const v = Math.round(state.volume * 100);
  $('p-volume').value = v; $('p-volume').style.setProperty('--v', v + '%'); $('p-volume').setAttribute('aria-valuetext', `${v} percent`);
}
player.subscribe(render);
setView('entrance');
render();
