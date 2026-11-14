// Full-window canvas: a slowly turning Earth sampled from a NASA original, with one thin orange orbit.
// It reports the screen position of each pin so the page can place real buttons over the globe.
const D2R = Math.PI / 180;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));

export function createGlobe(canvas, { texture, pins, onPositions }) {
  const ctx = canvas.getContext('2d');
  const raster = document.createElement('canvas'), rctx = raster.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const view = { lat: 9, lon: -28 };
  const place = { cx: 0.64, cy: 0.49, r: 0.39 }, goal = { ...place };     // fractions: cx of width, cy and r of height
  let tex = null, rotating = true, interactive = false, visible = true, dragging = null, zoom = 1;
  let W = 0, H = 0, dpr = 1, rasterKey = '', last = performance.now();

  // The sphere is shaded on the GPU so the turn stays smooth; the 2D rasteriser below is the fallback.
  const glc = document.createElement('canvas');
  const gl = glc.getContext('webgl', { antialias: false, premultipliedAlpha: true });
  let prog = null, glReady = false;
  if (gl) {
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 v; void main(){ v = p; gl_Position = vec4(p, 0., 1.); }'));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, `precision highp float;
      varying vec2 v; uniform sampler2D t; uniform vec2 rot; uniform float edge;
      void main(){
        float r2 = dot(v, v); if (r2 > 1.0) { gl_FragColor = vec4(0.); return; }
        float z = sqrt(1.0 - r2), sl = sin(rot.x), cl = cos(rot.x);
        float Y = v.y * cl + z * sl, Z = -v.y * sl + z * cl;
        float lat = asin(clamp(Y, -1., 1.)), lon = rot.y + atan(v.x, Z);
        vec3 c = texture2D(t, vec2(fract(lon / 6.28318530718 + 0.5), 0.5 - lat / 3.14159265359)).rgb;
        float light = clamp(0.62 + 0.5 * (z * 0.8 - v.x * 0.25 + v.y * 0.3), 0., 1.), rim = pow(1.0 - z, 3.0) * 0.75;
        c = min(c * 1.05 * light, 1.0) * (1.0 - rim) + vec3(0.353, 0.667, 1.0) * rim;
        float a = clamp((1.0 - sqrt(r2)) * edge + 0.5, 0., 1.);
        gl_FragColor = vec4(c * a, a);
      }`));
    gl.linkProgram(prog);
    if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    } else prog = null;
  }
  function drawSphereGL(g) {
    const S = Math.round(Math.min(g.R * 2 * dpr, 1500));
    if (glc.width !== S) glc.width = glc.height = S;
    gl.viewport(0, 0, S, S);
    gl.uniform2f(gl.getUniformLocation(prog, 'rot'), view.lat * D2R, (((view.lon % 360) + 540) % 360 - 180) * D2R);
    gl.uniform1f(gl.getUniformLocation(prog, 'edge'), S / 2);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(glc, g.cx - g.R, g.cy - g.R, g.R * 2, g.R * 2);
  }

  const im = new Image();
  im.onload = () => {
    if (prog) {
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
      const pot = n => (n & (n - 1)) === 0;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, pot(im.width) ? gl.REPEAT : gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      glReady = true; return;
    }
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
    tex = { w: im.width, h: im.height, d: x.getImageData(0, 0, im.width, im.height).data }; rasterKey = '';
  };
  im.src = texture;

  const geom = () => { const R = Math.min(place.r * H, 0.46 * W) * zoom; return { cx: place.cx * W, cy: place.cy * H, R }; };

  function rasterize(R) {
    const S = Math.round(Math.min(R * 2 * dpr, 760));                       // sphere bitmap, scaled up when drawn
    const key = `${view.lat.toFixed(2)}|${view.lon.toFixed(2)}|${S}`;
    if (key === rasterKey || !tex) return;
    rasterKey = key;
    raster.width = raster.height = S;
    const img = rctx.createImageData(S, S), o = img.data, { d: td, w: tw, h: th } = tex, r = S / 2;
    const sl = Math.sin(view.lat * D2R), cl = Math.cos(view.lat * D2R), l0 = view.lon * D2R;
    for (let py = 0; py < S; py++) {
      const y = (r - py - 0.5) / r;
      for (let px = 0; px < S; px++) {
        const x = (px + 0.5 - r) / r, r2 = x * x + y * y;
        if (r2 > 1) continue;
        const z = Math.sqrt(1 - r2), Y = y * cl + z * sl, Z = -y * sl + z * cl;
        const lat = Math.asin(clamp(Y, -1, 1)), lon = l0 + Math.atan2(x, Z);
        let u = (lon / (2 * Math.PI) + 0.5) % 1; if (u < 0) u += 1;
        const fx = u * tw - 0.5, fy = clamp((0.5 - lat / Math.PI) * th - 0.5, 0, th - 1);
        const x0 = Math.floor(fx), y0 = Math.floor(fy), ax = fx - x0, ay = fy - y0;
        const xa = ((x0 % tw) + tw) % tw, xb = (xa + 1) % tw, yb = Math.min(th - 1, y0 + 1);
        const i00 = (y0 * tw + xa) * 4, i10 = (y0 * tw + xb) * 4, i01 = (yb * tw + xa) * 4, i11 = (yb * tw + xb) * 4;
        const light = clamp(0.62 + 0.5 * (z * 0.8 - x * 0.25 + y * 0.3)), rim = Math.pow(1 - z, 3) * 0.75, oi = (py * S + px) * 4;
        for (let k = 0; k < 3; k++) {
          const v = (td[i00 + k] * (1 - ax) + td[i10 + k] * ax) * (1 - ay) + (td[i01 + k] * (1 - ax) + td[i11 + k] * ax) * ay;
          o[oi + k] = Math.min(255, v * 1.05 * light) * (1 - rim) + [90, 170, 255][k] * rim;
        }
        o[oi + 3] = 255 * clamp((1 - Math.sqrt(r2)) * r + 0.5);
      }
    }
    rctx.putImageData(img, 0, 0);
  }

  function project(lat, lon, g) {
    const la = lat * D2R, dl = (lon - view.lon) * D2R, sl = Math.sin(view.lat * D2R), c0 = Math.cos(view.lat * D2R);
    const X = Math.cos(la) * Math.sin(dl), Y = Math.sin(la), Z = Math.cos(la) * Math.cos(dl);
    return { x: g.cx + g.R * X, y: g.cy - g.R * (Y * c0 - Z * sl), z: Y * sl + Z * c0 };
  }

  // Dotted ellipse with a few short waveform clusters, as in the visual reference.
  function orbit(g, front) {
    const rx = g.R * 1.24, ry = g.R * 0.3, tilt = -13 * D2R, N = 260, ct = Math.cos(tilt), st = Math.sin(tilt);
    const clusters = [0.55, 1.35, 2.25, 4.1];
    ctx.strokeStyle = ctx.fillStyle = '#FE8500'; ctx.lineCap = 'round';
    for (let i = 0; i < N; i++) {
      const th = (i / N) * 2 * Math.PI, s = Math.sin(th);
      if ((s >= 0) !== front) continue;
      const ex = Math.cos(th) * rx, ey = s * ry, x = g.cx + ex * ct - ey * st, y = g.cy + ex * st + ey * ct;
      let a = 0; for (const c of clusters) a = Math.max(a, Math.exp(-(((th - c) / 0.1) ** 2)));
      const h = a * g.R * 0.05 * (0.35 + 0.65 * Math.abs(Math.sin(i * 2.3)));
      if (h > g.R * 0.006) { ctx.lineWidth = Math.max(1.4, g.R / 190); ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x, y + h); ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(x, y, Math.max(0.9, g.R / 330), 0, 7); ctx.fill(); }
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const w = innerWidth, h = innerHeight, d = Math.min(devicePixelRatio || 1, 1.5);
    if (w !== W || h !== H || d !== dpr) { W = w; H = h; dpr = d; canvas.width = W * dpr; canvas.height = H * dpr; rasterKey = ''; }
    const k = reduced.matches ? 1 : 1 - Math.exp(-dt * 3.2);
    for (const p in place) place[p] += (goal[p] - place[p]) * k;
    if (rotating && !dragging) view.lon -= dt * 4.5;   // the slow turn runs even with reduced motion, by request
    if (visible) {
      const g = geom();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      orbit(g, false);
      const halo = ctx.createRadialGradient(g.cx, g.cy, g.R * 0.97, g.cx, g.cy, g.R * 1.06);
      halo.addColorStop(0, 'rgba(90,170,255,.55)'); halo.addColorStop(1, 'rgba(90,170,255,0)');
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(g.cx, g.cy, g.R * 1.06, 0, 7); ctx.fill();
      ctx.imageSmoothingQuality = 'high';
      if (glReady) drawSphereGL(g);
      else { rasterize(g.R); if (raster.width) ctx.drawImage(raster, g.cx - g.R, g.cy - g.R, g.R * 2, g.R * 2); }
      orbit(g, true);
      const out = {};
      for (const p of pins) { const q = project(p.lat, p.lon, g); out[p.id] = { x: q.x, y: q.y, visible: q.z > 0.1 }; }
      onPositions(out, g);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  canvas.addEventListener('pointerdown', e => { if (!interactive) return; dragging = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const s = 60 / geom().R;
    view.lon -= (e.clientX - dragging.x) * s; view.lat = clamp(view.lat + (e.clientY - dragging.y) * s, -75, 75);
    dragging = { x: e.clientX, y: e.clientY };
  });
  const drop = () => { dragging = null; };
  canvas.addEventListener('pointerup', drop); canvas.addEventListener('pointercancel', drop);
  canvas.addEventListener('wheel', e => { if (!interactive) return; e.preventDefault(); zoom = clamp(zoom * (e.deltaY < 0 ? 1.08 : 0.93), 1, 1.9); }, { passive: false });

  return {
    setPlacement(p) { Object.assign(goal, p); },
    setInteractive(on) { interactive = on; canvas.style.cursor = on ? 'grab' : 'default'; if (!on) zoom = 1; },
    setVisible(on) { visible = on; if (!on) ctx.clearRect(0, 0, canvas.width, canvas.height); },
    setRotating(on) { rotating = on; },
    lookAt(lat, lon) { view.lat = clamp(lat, -75, 75); view.lon = lon; }
  };
}
