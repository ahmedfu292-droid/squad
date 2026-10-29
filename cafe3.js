/* The Squad — كافيه المجموعات 3D (النسخة المطوّرة)
   بيتحمّل بعد cafe2.js ويستبدل مشهد الكافيه والشخصيات ونوافذ الكاميرا.
   الجديد: كافيه كامل بمدينة بانورامية، طاولة وكراسي وفناجين، شخصيات كرتونية بعيون بترمش وأيدي بتلوّح،
   شاشة الكاميرا بتظهر فوق راس الشخصية وبتنوّر لما صاحبها يتكلم، وزرار لتغيير زاوية الكاميرا.
   متوافق مع calls.js و cafe.js و cafe2.js (ألوان الشخصية، ردود الفعل، التسجيل). */
(() => {
const mobile = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent);
const SKINS = [0xf1c9a5, 0xd9a47a, 0xb87b55, 0xffdcc0], HAIRS = [0x1a1320, 0x3b2314, 0x0d0d18, 0x6b3fa0];
const VW = 164, VH = 122; // مقاس نافذة الكاميرا (px)

document.head.insertAdjacentHTML('beforeend', `<style>
#cvv video{width:${VW}px!important;height:${VH}px!important;border-radius:18px!important;border:1.5px solid #7ff6ff!important;
 box-shadow:0 0 16px #3fe0ffcc,0 0 44px #8a5cff77,inset 0 0 20px #3fe0ff44!important;transition:border-color .2s,box-shadow .2s}
#cvv video.sp{border-color:#34f0a1!important;box-shadow:0 0 22px #34f0a1cc,0 0 54px #34f0a188,inset 0 0 20px #34f0a144!important}
</style>`);
$('.cbar').insertAdjacentHTML('beforeend', '<button id="cview" class="ic" title="تغيير زاوية الكاميرا">🎥</button>');

/* ---------- الكاميرا ---------- */
const VIEWS = [[0, .32, 10.5], [0, .62, 8], [0, 1.28, 9.5], [0, .14, 7.6]];
let vi = 0, taz = 0, tel = .32, trad = 10.5, caz = 0, cel = .32, crad = 10.5;
$('#cview').onclick = () => { vi = (vi + 1) % VIEWS.length; [taz, tel, trad] = VIEWS[vi]; toast(['زاوية واسعة', 'قريب من الطاولة', 'من فوق', 'مستوى العين'][vi]) };

/* ---------- خامات مرسومة ---------- */
const cvs = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return new THREE.CanvasTexture(c) };
const panorama = () => cvs(1024, 256, (g, w, h) => {
  const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#080c28'); sky.addColorStop(.6, '#2a1a6b'); sky.addColorStop(1, '#0e2a5a');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 140; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * .7})`; g.fillRect(Math.random() * w, Math.random() * h * .55, 1.6, 1.6) }
  g.fillStyle = '#f4f1ff'; g.beginPath(); g.arc(w * .2, h * .2, 15, 0, 7); g.fill();
  for (let x = 0; x < w;) {
    const bw = 18 + Math.random() * 36, bh = 40 + Math.random() * 120;
    g.fillStyle = '#09102e'; g.fillRect(x, h - bh, bw, bh);
    for (let y = h - bh + 6; y < h - 6; y += 9) for (let xx = x + 4; xx < x + bw - 5; xx += 8) if (Math.random() < .36) { g.fillStyle = Math.random() < .5 ? '#3fe0ff' : '#ffb86b'; g.fillRect(xx, y, 3, 4) }
    x += bw + 2;
  }
});
const woodTex = () => { const t = cvs(256, 256, (g, w, h) => { g.fillStyle = '#2a1c2e'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = `hsl(${280 + Math.random() * 20} 25% ${14 + Math.random() * 7}%)`; g.fillRect(0, i * 32 + 1, w, 30) } g.fillStyle = '#0007'; for (let i = 0; i < 8; i++) g.fillRect(0, i * 32, w, 2) }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6); return t };
const rugTex = () => cvs(256, 256, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); r.addColorStop(0, 'rgba(139,92,246,.6)'); r.addColorStop(.7, 'rgba(34,211,238,.18)'); r.addColorStop(1, 'rgba(34,211,238,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h) });

/* ---------- المشهد ---------- */
function init3d() {
  if (R3) return;
  const c = $('#c3d');
  R3 = new THREE.WebGLRenderer({ canvas: c, antialias: !mobile, powerPreference: 'high-performance' });
  R3.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  S3 = new THREE.Scene(); S3.background = new THREE.Color(0x060a1c); S3.fog = new THREE.Fog(0x0a0f2e, 20, 46);
  K3 = new THREE.PerspectiveCamera(55, 1, .1, 200);
  const std = (col, em, ei = .4) => new THREE.MeshStandardMaterial({ color: col, roughness: .6, ...(em ? { emissive: em, emissiveIntensity: ei } : {}) });
  const put = (m, x, y, z, p) => { m.position.set(x, y, z); (p || S3).add(m); return m };

  S3.add(new THREE.AmbientLight(0xffffff, .62));
  const warm = new THREE.PointLight(0xffd9a0, 1.15, 34); warm.position.set(0, 3.4, 0); S3.add(warm);
  const cool = new THREE.PointLight(0x8a5cff, .8, 26); cool.position.set(0, -.2, 0); S3.add(cool);

  /* مدينة بانورامية حوالين الكافيه */
  put(new THREE.Mesh(new THREE.CylinderGeometry(17, 17, 12, 48, 1, true), new THREE.MeshBasicMaterial({ map: panorama(), side: THREE.BackSide })), 0, 4, 0);
  /* الأرضية والسجادة */
  put(new THREE.Mesh(new THREE.CircleGeometry(17, 48), new THREE.MeshStandardMaterial({ map: woodTex(), roughness: .8 })), 0, -1.2, 0).rotation.x = -Math.PI / 2;
  put(new THREE.Mesh(new THREE.CircleGeometry(4.4, 48), new THREE.MeshBasicMaterial({ map: rugTex(), transparent: true, depthWrite: false })), 0, -1.185, 0).rotation.x = -Math.PI / 2;
  /* الطاولة */
  put(new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, .14, 48), std(0x1b2a6b, 0x1b2a6b, .5)), 0, -.5, 0);
  put(new THREE.Mesh(new THREE.CylinderGeometry(.24, .42, .72, 16), std(0x121c42)), 0, -.88, 0);
  put(new THREE.Mesh(new THREE.TorusGeometry(1.65, .025, 8, 96), new THREE.MeshBasicMaterial({ color: 0x3fe0ff })), 0, -.43, 0).rotation.x = Math.PI / 2;
  /* نبتة في نص الطاولة */
  put(new THREE.Mesh(new THREE.CylinderGeometry(.16, .12, .2, 14), std(0xb86b3a)), 0, -.33, 0);
  [[0, .02, 0, .2], [.1, -.02, .05, .13], [-.09, 0, -.06, .14]].forEach(([x, y, z, r]) => put(new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), std(0x2fbf71, 0x1a7a45, .3)), x, -.1 + y, z));
  /* ثريا */
  put(new THREE.Mesh(new THREE.TorusGeometry(2.3, .05, 8, 64), new THREE.MeshBasicMaterial({ color: 0xffd9a0 })), 0, 3.7, 0).rotation.x = Math.PI / 2;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; put(new THREE.Mesh(new THREE.SphereGeometry(.14, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe9bf })), 2.3 * Math.sin(a), 3.55, 2.3 * Math.cos(a)) }
  /* كاونتر وكراسي بار */
  put(new THREE.Mesh(new THREE.BoxGeometry(7, 1.2, 1.3), std(0x1b1340, 0x8a5cff, .25)), 0, -.6, -11);
  put(new THREE.Mesh(new THREE.BoxGeometry(1.2, .8, .8), std(0x9aa7d6)), -2, .4, -11).rotation.y = .3;
  [0x3fe0ff, 0xff4fd8, 0xffd36b, 0x34f0a1].forEach((col, i) => put(new THREE.Mesh(new THREE.CylinderGeometry(.12, .15, .6, 10), std(col, col, .8)), 0.4 + i * .7, .3, -11));
  for (let i = -2; i <= 2; i += 2) put(new THREE.Mesh(new THREE.CylinderGeometry(.34, .3, .5, 14), std(0x2a1b6b, 0x8a5cff, .3)), i * 1.3, -.95, -9.6);
  /* نباتات */
  [[8, -7], [-8, -7], [9, 4], [-9, 5]].forEach(([x, z]) => { put(new THREE.Mesh(new THREE.CylinderGeometry(.5, .38, .8, 14), std(0x3b2314)), x, -.8, z); for (let k = 0; k < 4; k++) put(new THREE.Mesh(new THREE.SphereGeometry(.55 - k * .08, 12, 10), std(0x2fbf71, 0x1a7a45, .25)), x + (k % 2 ? .2 : -.2), .1 + k * .3, z) });
  /* ذرات ضوء */
  const g = new THREE.BufferGeometry(), a = new Float32Array(600); for (let i = 0; i < 600; i++) a[i] = (Math.random() - .5) * 30; for (let i = 1; i < 600; i += 3) a[i] = Math.random() * 5;
  g.setAttribute('position', new THREE.BufferAttribute(a, 3));
  const motes = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffe9bf, size: .08, transparent: true, opacity: .6 })); S3.add(motes);

  /* تحكم باللمس والماوس: سحب = دوران وميل، قرص/عجلة = تقريب */
  const P = new Map(); let pd = 0;
  c.onpointerdown = e => { c.setPointerCapture(e.pointerId); P.set(e.pointerId, e); pd = 0 };
  c.onpointerup = c.onpointercancel = e => P.delete(e.pointerId);
  c.onpointermove = e => {
    const p = P.get(e.pointerId); if (!p) return;
    if (P.size == 1) { taz -= (e.clientX - p.clientX) * .006; tel = Math.min(1.35, Math.max(.12, tel + (e.clientY - p.clientY) * .004)) }
    else if (P.size == 2) { const o = [...P.values()].find(q => q.pointerId != e.pointerId), d = Math.hypot(e.clientX - o.clientX, e.clientY - o.clientY); if (pd) trad = Math.min(16, Math.max(5, trad - (d - pd) * .03)); pd = d }
    P.set(e.pointerId, e);
  };
  c.onwheel = e => { e.preventDefault(); trad = Math.min(16, Math.max(5, trad + e.deltaY * .01)) };
  caz = taz; cel = tel; crad = trad;

  (function loop() {
    if (!CALL) { R3.dispose(); R3 = null; return }
    requestAnimationFrame(loop);
    if (document.hidden) return;
    t3 += .016;
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width != w || c.height != h) { R3.setSize(w, h, false); K3.aspect = w / h; K3.updateProjectionMatrix() }
    caz += (taz - caz) * .12; cel += (tel - cel) * .12; crad += (trad - crad) * .12;
    const az = caz + Math.sin(t3 * .15) * .035;
    K3.position.set(crad * Math.cos(cel) * Math.sin(az), crad * Math.sin(cel), crad * Math.cos(cel) * Math.cos(az));
    K3.lookAt(0, .2, 0);
    motes.rotation.y += .0006;
    sync(); R3.render(S3, K3); holo(w, h);
  })();
}

/* ---------- الشخصية الكرتونية ---------- */
function mkAv(u, name) {
  const h = hue(u), g = new THREE.Group(), cloth = new THREE.Color().setHSL(h / 360, .7, .55);
  const std = (col, em) => new THREE.MeshStandardMaterial({ color: col, roughness: .5, ...(em ? { emissive: col, emissiveIntensity: .32 } : {}) });
  const skin = std(SKINS[h % 4]), hair = std(HAIRS[(h >> 2) % 4]), body = std(cloth, 1);
  const sph = (r, m, sx = 1, sy = 1, sz = 1) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 18), m); s.scale.set(sx, sy, sz); return s };
  const add = (m, x, y, z, p) => { m.position.set(x, y, z); (p || g).add(m); return m };
  /* الترتيب مهم: 0 جسم، 1 راس، 2 شعر (cafe2.js بيلوّنهم) */
  add(sph(.52, body, 1, 1.05, .86), 0, -.42, 0);
  add(sph(.5, skin), 0, .3, 0);
  const cap = add(new THREE.Mesh(new THREE.SphereGeometry(.53, 24, 16, 0, Math.PI * 2, 0, Math.PI * .45), hair), 0, .33, -.02); cap.rotation.x = -.22;
  const style = h % 4;
  if (style == 1) for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.ConeGeometry(.1, .3, 8), hair); sp.position.set((i - 2) * .17, .5 - Math.abs(i - 2) * .06, .1); sp.rotation.z = (2 - i) * .22; g.add(sp) }
  if (style == 2) add(sph(.17, hair), 0, .92, -.1);
  if (style == 3) add(sph(.5, hair, 1, 1.15, .75), 0, .05, -.28);
  /* وش */
  const eg = new THREE.Group(); eg.position.set(0, .36, 0); g.add(eg);
  [-1, 1].forEach(s => {
    add(sph(.1, std(0xffffff), 1, 1.25, .5), s * .18, 0, .46, eg);
    add(sph(.055, std(0x111111)), s * .18, 0, .52, eg);
    add(sph(.018, std(0xffffff)), s * .16, .03, .56, eg);
    const br = add(new THREE.Mesh(new THREE.BoxGeometry(.15, .025, .03), hair), s * .18, .5, .46); br.rotation.z = -s * .15;
    add(sph(.07, new THREE.MeshStandardMaterial({ color: 0xff7a9a, transparent: true, opacity: .5 }), 1, .7, .3), s * .3, .18, .39);
    add(sph(.09, skin, .6, 1, 1), s * .5, .3, 0);
  });
  add(sph(.05, skin), 0, .26, .5);
  const mouth = add(sph(.07, std(0x8a2b3b), 1.6, .45, .6), 0, .12, .47);
  /* إكسسوارات */
  if (h % 2) { const hp = add(new THREE.Mesh(new THREE.TorusGeometry(.52, .03, 8, 24, Math.PI), std(0x1c2240)), 0, .3, 0);
    [-1, 1].forEach(s => { const e = add(new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .1, 16), std(0x3fe0ff, 1)), s * .54, .3, 0); e.rotation.z = Math.PI / 2 }) }
  if (h % 5 == 0) { [-1, 1].forEach(s => add(new THREE.Mesh(new THREE.TorusGeometry(.12, .015, 8, 20), std(0x111111)), s * .18, .36, .53)); add(new THREE.Mesh(new THREE.BoxGeometry(.1, .015, .015), std(0x111111)), 0, .37, .54) }
  /* الايدين */
  const arm = s => { const a = new THREE.Group(); a.position.set(s * .5, -.2, .05);
    const up = new THREE.Mesh(new THREE.CylinderGeometry(.1, .09, .5, 12), body); up.position.y = -.25; a.add(up);
    const hd = sph(.1, skin); hd.position.y = -.52; a.add(hd); g.add(a); return a };
  const armL = arm(-1), armR = arm(1);
  /* فنجان قهوة قدامه على الطاولة */
  const cup = new THREE.Group(); cup.position.set(0, -.2, 1.35); g.add(cup);
  add(new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .015, 18), std(0xffffff)), 0, -.075, 0, cup);
  add(new THREE.Mesh(new THREE.CylinderGeometry(.11, .085, .14, 16), std(0xf3efff)), 0, 0, 0, cup);
  add(new THREE.Mesh(new THREE.CircleGeometry(.095, 16), new THREE.MeshBasicMaterial({ color: 0x4a2a14 })), 0, .071, 0, cup).rotation.x = -Math.PI / 2;
  /* توهج الكلام + الاسم */
  const glow = add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 20, 20), new THREE.MeshBasicMaterial({ color: 0x34f0a1, transparent: true, opacity: 0 })), 0, 0, 0);
  const lb = label(name + (u == me.uid ? ' (أنت)' : '')); lb.position.set(0, .98, 0); g.add(lb);
  Object.assign(g.userData, { u, mouth, glow, eg, armL, armR, ph: (h % 100) / 10, wv: 0 });
  return g;
}

function mkChair() {
  const c = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color: 0x2a1b6b, emissive: 0x8a5cff, emissiveIntensity: .35, roughness: .6 });
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(.55, .5, .12, 24), m); c.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.05, .9, .1), m); back.position.set(0, .52, -.52); c.add(back);
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(.07, .1, .6, 10), m); leg.position.y = -.36; c.add(leg);
  return c;
}

/* ---------- الجلوس والحركة ---------- */
function seat(ids) {
  const n = ids.length;
  ids.forEach((u, i) => {
    const o = AV.get(u); let a;
    if (n == 1) a = Math.PI;
    else if (n <= 4) { const W = [0, 0, .8, 1.2, 1.55][n] * Math.PI; a = Math.PI - W / 2 + W * i / (n - 1) }
    else a = Math.PI + 2 * Math.PI * i / n;
    const R = 2.75;
    o.position.set(R * Math.sin(a), -.15, R * Math.cos(a));
    o.rotation.y = a + Math.PI; o.userData.base = -.15; o.userData.ry = o.rotation.y;
    const ch = o.userData.chair; ch.position.set((R + .12) * Math.sin(a), -1.12, (R + .12) * Math.cos(a)); ch.rotation.y = o.rotation.y;
  });
}

function sync() {
  const ids = Object.keys(CALL.P).sort((a, b) => a == me.uid ? -1 : b == me.uid ? 1 : a < b ? -1 : 1).slice(0, MAXP), k = ids.join();
  if (k != sig3) {
    sig3 = k;
    AV.forEach((o, u) => { if (!ids.includes(u)) { S3.remove(o); o.userData.chair && S3.remove(o.userData.chair); AV.delete(u) } });
    ids.forEach(u => { if (!AV.has(u)) { const o = mkAv(u, CALL.P[u].nm || '؟'); S3.add(o); AV.set(u, o); o.userData.chair = mkChair(); S3.add(o.userData.chair) } });
    seat(ids);
  }
  AV.forEach((o, u) => {
    const d = o.userData, lv = level(u), sp = lv > .06;
    o.position.y = d.base + Math.sin(t3 * 1.6 + d.ph) * .035 + (sp ? Math.abs(Math.sin(t3 * 9)) * .05 : 0);
    o.rotation.y = d.ry + Math.sin(t3 * .9 + d.ph) * .07;
    d.mouth.scale.set(1.6 - Math.min(lv, .3), .45 + Math.min(lv * 4, 1.6), .6);
    d.glow.material.opacity = sp ? .2 : 0;
    d.eg.scale.y = ((t3 + d.ph) % 3.4 < .12) ? .1 : 1;
    d.armL.rotation.set(-1.15, 0, -.12);
    if (d.wv > t3) d.armR.rotation.set(0, 0, 2.5 + Math.sin(t3 * 10) * .3); else d.armR.rotation.set(-1.15, 0, .12);
  });
}

/* ردود الفعل (👋 👏 ❤️...) بتخلي الشخصية تلوّح */
const react0 = window.react;
if (react0) window.react = function (u, e) { react0(u, e); const o = AV.get(u); if (o) o.userData.wv = t3 + 1.8 };

/* ---------- نوافذ الكاميرا فوق الشخصيات ---------- */
function holo(w, h) {
  const V = new THREE.Vector3();
  document.querySelectorAll('#cvv video').forEach(v => {
    const u = v.id == 'lv' ? me.uid : v.id.slice(2), o = AV.get(u);
    if (!o) { v.style.visibility = 'hidden'; return }
    v.style.visibility = 'visible';
    V.set(o.position.x, o.position.y + 1.55, o.position.z).project(K3);
    const d = K3.position.distanceTo(o.position), s = Math.min(1.3, Math.max(.55, 9 / d)) * (v.classList.contains('sm') ? .5 : 1);
    v.style.transform = `translate(${(V.x * .5 + .5) * w - VW / 2}px,${(-V.y * .5 + .5) * h - VH}px) scale(${s})`;
    v.style.zIndex = 1000 - (d * 10 | 0);
    v.classList.toggle('sp', level(u) > .06);
  });
}

Object.assign(window, { init3d, mkAv, sync, holo });
})();
