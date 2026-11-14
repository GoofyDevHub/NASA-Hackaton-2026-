import { SCENES, REGIONS, PLAYLIST, byId, sourceOf, fullDescription } from './scenes.js';
import * as player from './player.js';
import { createGlobe } from './globe.js';
import { createVoice } from './voice.js';

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
  b.addEventListener('focus', () => { if (b.classList.contains('behind')) globe.lookAt(region.lat * 0.6, region.lon); });
  for (const ev of ['pointerleave', 'blur']) b.addEventListener(ev, () => { if (hot === id) { hot = null; globe.setRotating(true); } });
  $('pins').append(b); pinEls[id] = b;
}

const callout = $('callout'), cline = $('callout-line');
function place(pos, g) {
  for (const [id, el] of Object.entries(pinEls)) {
    el.style.left = pos[id].x + 'px'; el.style.top = pos[id].y + 'px';
    el.classList.toggle('behind', !pos[id].visible);
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
  onPositions: place,
  onDrag: (dx, dy) => { pan.x += dx; pan.y += dy; }
});

// ---- deep space: two layers of small stars drift slowly the way the Earth turns, over a faint band of haze
const stars = $('stars'), sx = stars.getContext('2d'), layers = [];
const pan = { x: 0, y: 0 };                               // how far the listener has dragged the sky along with the globe
function buildStars() {
  const w = innerWidth, h = innerHeight, d = Math.min(devicePixelRatio || 1, 2);
  stars.width = w * d; stars.height = h * d;
  let seed = 20261114; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  layers.length = 0;
  for (const [density, speed, size, depth] of [[1700, 2.2, 0.75, 0.22], [5200, 5.5, 1.15, 0.42]]) {       // far and near
    const c = document.createElement('canvas'), x = c.getContext('2d');
    c.width = w * d; c.height = h * d; x.setTransform(d, 0, 0, d, 0, 0);
    for (let i = 0, n = Math.round(w * h / density); i < n; i++) {
      let px = rnd() * w, py = rnd() * h;
      if (rnd() < 0.4) py = h * (0.92 - 0.62 * px / w) + (rnd() + rnd() + rnd() - 1.5) * h * 0.16;   // denser along a diagonal band
      const bright = rnd() < 0.07, r = (bright ? 0.9 + rnd() * 0.6 : 0.3 + rnd() * 0.5) * size, tint = rnd();
      x.fillStyle = tint < 0.12 ? '#FFE3C2' : tint < 0.26 ? '#CFE0FF' : '#FFFFFF';
      x.globalAlpha = bright ? 0.7 + rnd() * 0.3 : 0.18 + rnd() * 0.5;
      x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
      if (bright && rnd() < 0.3) { x.globalAlpha *= 0.18; x.beginPath(); x.arc(px, py, r * 3.2, 0, 7); x.fill(); }   // soft bloom on a few
    }
    layers.push({ c, speed, depth });
  }
}
// The Milky Way: a soft diagonal band of glow, dust lanes and crowded faint stars, painted once per window size.
let milky = null, milkyAlpha = 0, lastSky = 0;
function buildMilkyWay() {
  const w = innerWidth, h = innerHeight, d = Math.min(devicePixelRatio || 1, 1.5), W = w * 1.3, H = h * 1.3;
  const c = document.createElement('canvas'), x = c.getContext('2d');
  c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
  let seed = 7741; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) / 0.58;                       // roughly normal, sigma 1
  const ax = 0, ay = H * 0.97, bx = W, by = H * 0.08, len = Math.hypot(bx - ax, by - ay);     // band axis, lower left to upper right
  const ux = (bx - ax) / len, uy = (by - ay) / len, nx = -uy, ny = ux, sigma = H * 0.085, ang = Math.atan2(uy, ux);
  const at = (t, off) => [ax + ux * len * t + nx * off, ay + uy * len * t + ny * off];
  const core = t => Math.exp(-(((t - 0.34) / 0.3) ** 2));                               // brighter bulge toward the lower left
  const blob = (px, py, r, stretch, colour) => { x.save(); x.translate(px, py); x.rotate(ang); x.scale(stretch, 1);
    const g = x.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, colour); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill(); x.restore(); };

  x.filter = 'blur(' + Math.round(H * 0.012) + 'px)'; x.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 260; i++) {                                                       // diffuse glow
    const t = rnd() * 1.1 - 0.05, k = core(t), [px, py] = at(t, gauss() * sigma * (0.55 + 0.5 * k));
    const warm = k * (0.5 + 0.5 * rnd()), al = (0.02 + 0.03 * k) * (0.5 + rnd());
    blob(px, py, H * (0.05 + 0.1 * rnd()) * (0.85 + 0.35 * k), 1.15 + rnd() * 0.8,
      `rgba(${Math.round(150 + 85 * warm)},${Math.round(165 + 40 * warm)},${Math.round(215 - 55 * warm)},${al.toFixed(3)})`);
  }
  x.globalCompositeOperation = 'source-over'; x.filter = 'blur(' + Math.round(H * 0.006) + 'px)';
  for (let i = 0; i < 130; i++) {                                                        // dark dust lanes along the middle
    const t = rnd() * 1.1 - 0.05, [px, py] = at(t, gauss() * sigma * 0.28 + Math.sin(t * 9) * sigma * 0.22);
    blob(px, py, H * (0.012 + 0.028 * rnd()), 1.6 + rnd() * 2.2, `rgba(3,4,9,${(0.22 + 0.4 * rnd() * (0.4 + core(t))).toFixed(3)})`);
  }
  x.filter = 'none';
  for (let i = 0, n = Math.round(W * H / 120); i < n; i++) {                            // crowded faint stars
    const t = rnd() * 1.1 - 0.05, [px, py] = at(t, gauss() * sigma * 0.95), tint = rnd();
    x.fillStyle = tint < 0.2 ? '#FFE8CF' : tint < 0.4 ? '#D3E1FF' : '#FFFFFF';
    x.globalAlpha = (0.14 + 0.5 * rnd() * rnd()) * (0.75 + 0.5 * core(t));
    x.beginPath(); x.arc(px, py, 0.25 + rnd() * 0.5, 0, 7); x.fill();
  }
  milky = c;
}

function drawStars(now) {
  requestAnimationFrame(drawStars);
  if (!layers.length) return;
  const w = stars.width, h = stars.height, k = w / innerWidth, wrap = (v, m) => ((v % m) + m) % m;
  sx.clearRect(0, 0, w, h);
  milkyAlpha += ((view === 'entrance' ? 0 : 1) - milkyAlpha) * (1 - Math.exp(-Math.min(0.5, (now - lastSky) / 1000) * 1.6)); lastSky = now;                   // the band fades in once the listener explores
  if (milky && milkyAlpha > 0.005) {
    const mw = w * 1.3, mh = h * 1.3, cl = (v, m) => Math.max(-m, Math.min(m, v));
    sx.globalAlpha = milkyAlpha;
    sx.drawImage(milky, -w * 0.15 + cl(pan.x * 0.1 * k, w * 0.15), -h * 0.15 + cl(pan.y * 0.1 * k, h * 0.15), mw, mh);
    sx.globalAlpha = 1;
  }
  for (const { c, speed, depth } of layers) {
    const ox = Math.round(wrap((now / 1000 * speed + pan.x * depth) * k, w)), oy = Math.round(wrap(pan.y * depth * k, h));
    for (const dx of [0, -w]) for (const dy of [0, -h]) sx.drawImage(c, ox + dx, oy + dy);
  }
}
buildStars(); buildMilkyWay(); addEventListener('resize', () => { buildStars(); buildMilkyWay(); }); requestAnimationFrame(drawStars);

// ---- views: entrance -> globe -> player
const PLACEMENT = {
  entrance: () => narrow.matches ? { cx: 0.5, cy: 0.72, r: 0.2 } : { cx: 0.639, cy: 0.491, r: 0.391 },
  player: () => narrow.matches ? { cx: 0.5, cy: 0.9, r: 0.3 } : { cx: 0.5, cy: 0.54, r: 0.64 },      // centred, large and dimmed, seen through the glass
  globe: () => narrow.matches ? { cx: 0.5, cy: 0.45, r: 0.24 } : { cx: 0.495, cy: 0.459, r: 0.379 }
};
function setView(v) {
  view = v; document.body.dataset.view = v;
  $('entrance').hidden = v !== 'entrance'; $('explorer').hidden = v !== 'globe'; $('player').hidden = v !== 'player';
  globe.setInteractive(v === 'globe'); globe.setOrbit(v === 'entrance');
  if (PLACEMENT[v]) globe.setPlacement(PLACEMENT[v]());
  for (const el of Object.values(pinEls)) el.tabIndex = v === 'globe' ? 0 : -1;
  if (v !== 'globe') { hot = null; callout.hidden = cline.hidden = true; }
  if (v !== 'player') document.title = (v === 'globe' ? 'Globe · ' : '') + 'P.T.S. — Pixel That Sounds';      // the pin label never outlives the globe view
}
narrow.addEventListener('change', () => PLACEMENT[view] && globe.setPlacement(PLACEMENT[view]()));

function enter() { if (view !== 'entrance') return; setView('globe'); $('tour').focus({ preventScroll: true }); player.announce('Globe. Three places: Amazon, Congo and Antarctica. Start the tour or open the content list.'); }
$('explore').addEventListener('click', enter);

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
    opener = null; back.classList.remove('behind'); back.focus({ preventScroll: true });
  }
  if (!open) { shown = null; return; }

  if (s.id !== shown) {
    shown = s.id;
    const src = sourceOf(s);
    $('p-title').textContent = s.place;
    $('p-sub').textContent = src.subtitle;
    $('p-image').alt = `NASA image: ${s.imageLabel}.`;
    $('p-image').src = s.audioCrop || s.image;              // every view fills the same frame; the ocean scenes show their exact crop
    $('p-tag').textContent = s.audioCropLabel ? 'Southern Ocean band · detail of the exact crop' : s.imageLabel;
    openLens(s);
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
    $('p-index-text').textContent = i < 0 ? 'Image only, outside the tour.' : `Track ${i + 1} of ${n}.`;
    document.title = `${s.place}, ${src.label} · P.T.S.`;
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
// ---- the lens: a small Earth turned to the place, a marker on it, and two rays opening onto the image frame
const LENS = { w: 38, h: 24.5, mini: 10.4, frameX: 11, frameH: 20.25 };       // in layout units, matching styles.css
let earthPx = null, lensScene = null;
{ const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0, 1024, 512); earthPx = x.getImageData(0, 0, 1024, 512).data;
    if (lensScene) drawMini(lensScene); }; im.src = 'textures/earth.jpg'; }
function miniView(s) { return { lat: Math.max(-58, Math.min(58, s.pin.lat * 0.75)), lon: s.pin.lon + 14 }; }
function miniSpot(s) {                                     // where the place falls on the small Earth, in layout units
  const v = miniView(s), R = Math.PI / 180, la = s.pin.lat * R, dl = (s.pin.lon - v.lon) * R, sl = Math.sin(v.lat * R), cl = Math.cos(v.lat * R);
  const X = Math.cos(la) * Math.sin(dl), Y = Math.sin(la), Z = Math.cos(la) * Math.cos(dl), r = LENS.mini / 2 * 0.96;
  return { x: LENS.mini / 2 + r * X, y: LENS.h - LENS.mini / 2 - r * (Y * cl - Z * sl) };
}
function drawMini(s) {
  const cv = $('p-mini'), S = Math.max(120, Math.round(cv.clientWidth * Math.min(devicePixelRatio || 1, 2))), x = cv.getContext('2d');
  cv.width = cv.height = S;
  if (!earthPx) return;
  const v = miniView(s), D = Math.PI / 180, sl = Math.sin(v.lat * D), cl = Math.cos(v.lat * D), l0 = v.lon * D, r = S / 2 * 0.96, c = S / 2;
  const img = x.createImageData(S, S), o = img.data;
  for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
    const ux = (px + 0.5 - c) / r, uy = (c - py - 0.5) / r, r2 = ux * ux + uy * uy;
    if (r2 > 1) continue;
    const z = Math.sqrt(1 - r2), Y = uy * cl + z * sl, Z = -uy * sl + z * cl;
    const lat = Math.asin(Math.max(-1, Math.min(1, Y))), lon = l0 + Math.atan2(ux, Z);
    let u = (lon / (2 * Math.PI) + 0.5) % 1; if (u < 0) u += 1;
    const ti = (Math.min(511, Math.floor((0.5 - lat / Math.PI) * 512)) * 1024 + Math.min(1023, Math.floor(u * 1024))) * 4;
    const d = ux * -0.62 + uy * 0.36 + z * 0.70, lit = Math.max(0, Math.min(1, (d + 0.2) / 0.7)), k = 0.1 + lit * (0.6 + 0.5 * Math.max(d, 0));
    const rim = Math.pow(1 - z, 3) * 0.7 * (0.15 + 0.85 * lit), oi = (py * S + px) * 4;
    for (let n = 0; n < 3; n++) o[oi + n] = Math.min(255, earthPx[ti + n] * k) * (1 - rim) + [90, 170, 255][n] * rim;
    o[oi + 3] = 255 * Math.max(0, Math.min(1, (1 - Math.sqrt(r2)) * r + 0.5));
  }
  x.putImageData(img, 0, 0);
}
function openLens(s) {
  lensScene = s; drawMini(s);
  const p = miniSpot(s), e = 0.55, f = n => n.toFixed(2);
  $('p-spot').setAttribute('x', f(p.x - e)); $('p-spot').setAttribute('y', f(p.y - e)); $('p-spot').setAttribute('width', f(e * 2)); $('p-spot').setAttribute('height', f(e * 2));
  $('p-ray').setAttribute('d', `M${f(p.x - e)} ${f(p.y - e)} L${LENS.frameX} 0 M${f(p.x + e)} ${f(p.y + e)} L${LENS.frameX} ${LENS.frameH}`);
  const shot = document.querySelector('.shot'), lens = document.querySelector('.lens');
  shot.style.transformOrigin = `calc(var(--u) * ${f(p.x - LENS.frameX)}) calc(var(--u) * ${f(p.y)})`;       // the image grows out of the place
  lens.classList.remove('zoom'); void lens.offsetWidth; lens.classList.add('zoom');
}
addEventListener('resize', () => lensScene && drawMini(lensScene));

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

// ---- voice control
const vStatus = $('voice-status');
const voice = createVoice({
  view: () => view,
  enter,
  home: () => { if (view === 'player') closePlayer(); contents.open && contents.close(); setView('entrance'); $('explore').focus({ preventScroll: true }); },
  startTour: () => { contents.open && contents.close(); if (view === 'entrance') setView('globe'); opener = $('tour'); player.startPlaylist(); $('p-title').focus(); },
  openList: () => { if (view === 'player') closePlayer(); if (view === 'entrance') setView('globe'); if (!contents.open) contents.showModal(); },
  closeList: () => contents.open && contents.close(),
  listOpen: () => contents.open,
  openScene: id => { contents.open && contents.close(); if (view === 'entrance') setView('globe'); openScene(id, $('list')); },
  closePlayer
}, {
  state: s => { const on = s === 'on', t = $('voice-toggle');
    t.setAttribute('aria-pressed', String(on)); t.disabled = s === 'unsupported';
    $('voice-label').textContent = s === 'unsupported' ? 'Voice needs Chrome or Edge' : on ? 'Listening' : 'Voice control';
    if (!on) vStatus.textContent = ''; },
  heard: (text, answer) => { vStatus.innerHTML = ''; const b = document.createElement('b'); b.textContent = `“${text}”`; vStatus.append(b, answer ? ` ${answer}` : ' (ignored)'); },
  interim: text => { vStatus.textContent = text + '…'; },
  message: text => { vStatus.textContent = text; },
  lang: l => { $('voice-en').setAttribute('aria-pressed', String(l === 'en-US')); $('voice-it').setAttribute('aria-pressed', String(l === 'it-IT')); }
});
$('voice-toggle').addEventListener('click', voice.toggle);
$('voice-en').addEventListener('click', () => voice.setLang('en-US'));
$('voice-it').addEventListener('click', () => voice.setLang('it-IT'));
window.ptsVoice = voice;                                   // lets a typed phrase be tried from the console: ptsVoice.run('next')

player.subscribe(render);
setView('entrance');
render();
