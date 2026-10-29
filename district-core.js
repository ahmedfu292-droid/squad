/* district-core.js — v32: مدينة كبيرة (480×480) بمباني حقيقية (حيطان/أرضيات/سلالم/أسانسيرات) + فيزياء + شبكة. من غير Three ولا DOM عشان يتاختبر في Node. */
(function (root, f) { if (typeof module == 'object' && module.exports) module.exports = f(); else root.DC = f() })(this, function () {
  const BOUND = 500, CITY = 300, R = .45, G = 24, JV = 8.2, STEP = .4, SPD = 4.5, RUN = 7, PH = 1.8, CELL = 16, T = .4, DW = 1.7, DH = 3.4, SH = 14, SR = .55;
  let sd = 12345; const rnd = () => (sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296;
  const solids = [], dyn = [], grid = new Map(), EMPTY = [];
  function reg(s) { solids.push(s); const i0 = Math.floor((s.cx - s.hw - 1) / CELL), i1 = Math.floor((s.cx + s.hw + 1) / CELL), j0 = Math.floor((s.cz - s.hd - 1) / CELL), j1 = Math.floor((s.cz + s.hd + 1) / CELL);
    for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) { const k = i + ',' + j; let a = grid.get(k); if (!a) grid.set(k, a = []); a.push(s) } return s }
  const add = (cx, cz, hw, hd, bot, top) => reg({ cx, cz, hw, hd, bot: bot || 0, top });
  const hx = (h, s, l) => { s /= 100; l /= 100; const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))) }; return (f(0) << 16) | (f(8) << 8) | f(4) };
  function minus(rs, h) { const o = []; rs.forEach(r => { if (h.u1 <= r.u0 || h.u0 >= r.u1 || h.v1 <= r.v0 || h.v0 >= r.v1) { o.push(r); return }
    if (h.u0 > r.u0) o.push({ u0: r.u0, u1: h.u0, v0: r.v0, v1: r.v1 }); if (h.u1 < r.u1) o.push({ u0: h.u1, u1: r.u1, v0: r.v0, v1: r.v1 });
    const a = Math.max(r.u0, h.u0), c = Math.min(r.u1, h.u1); if (h.v0 > r.v0) o.push({ u0: a, u1: c, v0: r.v0, v1: h.v0 }); if (h.v1 < r.v1) o.push({ u0: a, u1: c, v0: h.v1, v1: r.v1 }) }); return o }

  /* ---------- المباني الرئيسية (على الشارع الرئيسي z=0، وشها ناحية الشارع) ---------- */
  const LM = [
    { id: 'cafe', bx: -150, side: -1, hw: 12, hd: 12, n: 1, fh: 5.2 }, { id: 'flats', bx: -90, side: -1, hw: 12, hd: 14, n: 4, fh: 4.2, lift: 1 },
    { id: 'hall', bx: -30, side: -1, hw: 16, hd: 14, n: 1, fh: 9 }, { id: 'bank', bx: 30, side: -1, hw: 14, hd: 14, n: 3, fh: 4.6, lift: 1 },
    { id: 'lab', bx: 90, side: -1, hw: 12, hd: 14, n: 3, fh: 4.4, lift: 1 }, { id: 'bank', bx: 210, side: -1, hw: 14, hd: 14, n: 3, fh: 4.6, lift: 1, label: '🏦 بنك The Squad — فرع المارينا' },
    { id: 'palace', bx: 0, side: 1, cz: 355, hw: 24, hd: 20, n: 3, fh: 6, lift: 1, dw: 3.4, label: '👑 قصر The Squad' }, { id: 'showroom', bx: -125, side: 1, cz: 325, hw: 24, hd: 18, n: 1, fh: 7, dw: 3.4, label: '🏎️ معرض السيارات الفاخرة — الفرع الأول' }, { id: 'showroom', bx: 125, side: 1, cz: 325, hw: 24, hd: 18, n: 1, fh: 7, dw: 3.4, label: '🏁 معرض السيارات الرياضية — الفرع الثاني' },
    { id: 'palace', bx: -205, side: 1, cz: 390, hw: 19, hd: 16, n: 2, fh: 5.2, lift: 1, label: '🏡 فيلا Emerald' }, { id: 'palace', bx: -135, side: 1, cz: 390, hw: 19, hd: 16, n: 2, fh: 5.2, label: '🏡 فيلا Azure' }, { id: 'palace', bx: -65, side: 1, cz: 390, hw: 19, hd: 16, n: 2, fh: 5.2, label: '🏡 فيلا Skyline' }, { id: 'palace', bx: 65, side: 1, cz: 390, hw: 19, hd: 16, n: 2, fh: 5.2, label: '🏰 قصر Gold Crest' }, { id: 'palace', bx: 135, side: 1, cz: 390, hw: 19, hd: 16, n: 2, fh: 5.2, label: '🏰 قصر Royal Gardens' }, { id: 'palace', bx: 205, side: 1, cz: 390, hw: 19, hd: 16, n: 2, fh: 5.2, label: '🏡 فيلا Palm Residence' },
    { id: 'shop', bx: -90, side: 1, hw: 18, hd: 14, n: 2, fh: 4.8, lift: 1 }, { id: 'arcade', bx: -30, side: 1, hw: 14, hd: 14, n: 2, fh: 4.6 },
    { id: 'gym', bx: 30, side: 1, hw: 14, hd: 14, n: 2, fh: 4.6 }, { id: 'kiosk', bx: 90, side: 1, hw: 7, hd: 6, n: 1, fh: 4 }];
  const FURN = {
    cafe(F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd, wd = 0x6a3a22;
      F(0, 0, -8.5, 14, 1.2, 1.1, wd, 's'); F(0, 0, -8.5, 14.2, 1.3, .08, 0x3fe0ff, 'e', 1.1); F(0, 0, -hd + .7, 17, .7, 2.4, 0x2a1a14, 's');
      for (let i = 0; i < 6; i++) F(0, -6 + i * 2.4, -hd + 1.08, 1.7, .08, .35, hx(i * 55, 70, 55), 'e', 1.3 + (i % 2) * .6);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const u = -6.5 + i * 6.5, v = -3 + j * 4.4; F(0, u, v, 1.5, 1.5, .8, 0x5a3a2a, 's'); F(0, u - 1.3, v, .6, .6, .5, 0x1fb5c5, 's'); F(0, u + 1.3, v, .6, .6, .5, 0x1fb5c5, 's') }
      F(0, 9.4, 3, 2.2, 6, .9, 0x3a5a8a, 's'); F(0, 10.5, 3, .5, 6, 1.6, 0x2a4a7a, 's'); F(0, -10.4, 9, .8, .8, 1.7, 0x1f7a3a, 's'); F(0, 10.4, 9.5, .8, .8, 1.7, 0x1f7a3a, 's');
      F(0, -hw + .4, -3, .3, 3.6, 3.6, 0x3fe0ff, 'e'); F(0, -hw + .5, -3, .2, 3.2, 3.2, 0x0a0f22, 'e'); SG(0, -hw + .62, -3, '🚪 غرفة الكافيه 3D', '#3fe0ff', 3.4, .8, 3.9, Math.PI / 2); SP(0, -hw + 2.2, -3, 2.6, 'cafe3d');
      SG(0, 0, -hd + .45, '☕ كافيه The Squad', '#3fe0ff', 8, 1.5, 3.9, 0); NP(0, 0, -9.9, 'الباريستا', 0x1fb5c5, Math.PI) },
    hall(F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd;
      F(0, 0, -hd + 3.4, 26, 6, 1.1, 0x3a2a1a, 's'); F(0, 0, -hd + .5, 24, .25, 7.2, 0xff7ad9, 'e', 2.2); F(0, 0, -hd + .7, 22.8, .2, 6.6, 0x1a2a8a, 'e', 2.5);
      [-1, 1].forEach(s => F(0, s * 13.2, -hd + 1.2, 3, .6, 8, 0x8a1c3a, '', 0));
      for (let r = 0; r < 5; r++) [-1, 1].forEach(s => { const v = -2 + r * 1.9; F(0, s * 8, v, 12, 1.1, .9, 0x8a1c3a, 's'); F(0, s * 8, v - .5, 12, .2, .9, 0x6a1430, '', .9) });
      F(0, -11, 9.5, 5, 1.2, 1.1, 0x2a2f4a, 's'); F(0, -11, 9.5, 5.1, 1.3, .08, 0xff7ad9, 'e', 1.1); NP(0, -11, 8.1, 'بائع الفشار', 0xff7ad9, Math.PI);
      SG(0, 0, -hd + .35, '🎬 قاعة The Squad — العروض قريبًا', '#ff7ad9', 12, 1.2, 8.2, 0); SG(0, 11, 11.5, '🍿 فشار', '#ffd75a', 3, .8, 3.2, 0) },
    flats(F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd;
      F(0, 0, -5, 8, 1.3, 1.1, 0x6a5a4a, 's'); F(0, 0, -5, 8.1, 1.4, .08, 0xffb02c, 'e', 1.1); NP(0, 0, -6.5, 'الاستقبال', 0xffb02c, Math.PI);
      for (let i = 0; i < 8; i++) F(0, -6 + i * 1.5, -hd + .6, 1.2, .35, 1.1, 0xb0b8c8, 's');
      F(0, 5, 3, 5, 1.4, .9, 0x4a5a9a, 's'); F(0, 5, 5, 2, 1, .45, 0x5a3a2a, 's'); F(0, -6, 0, .8, .8, 1.6, 0x1f7a3a, 's'); F(0, 8, 8, .8, .8, 1.6, 0x1f7a3a, 's');
      SG(0, 0, -hd + .4, '🏢 شقق The Squad', '#ffb02c', 7, 1.3, 3.2, 0);
      for (let k = 1; k < 4; k++) { const c = [0xc08a6a, 0x8aa0c0, 0xa08ac0][k - 1];
        F(k, -6.5, -8, 3, 4, .6, 0xe8e0f0, 's'); F(k, -6.5, -10, 3, .3, 1.3, 0x5a3a2a, 's'); F(k, -3.5, -9.5, 1.2, 3, 2.2, 0x5a3a2a, 's'); F(k, 0, -6, 6, 4, .03, c, '');
        F(k, 3, -9, 4, 1.4, .9, 0x4a5a9a, 's'); F(k, 3, -hd + .7, 3.4, .2, 1.8, 0x111111, 's', .8); F(k, 3, -hd + .85, 3.2, .05, 1.6, 0x3a8cff, 'e', .9);
        F(k, 3, 0, 3.4, 1.8, .8, 0x5a3a2a, 's'); F(k, -3, 1, 1, 1, .5, 0xc0c0d0, 's'); F(k, 6, 5, .8, .8, 1.5, 0x1f7a3a, 's');
        SG(k, 0, 6, '🏠 الدور ' + k, '#ffb02c', 3, .7, 3, Math.PI);
        /* Furnished premium apartment suite: rug, lounge seating, coffee table and warm accent lighting. */
        F(k, 0, -1.5, 6.2, .08, 4.2, k===3?0x8b7558:k===2?0x536b85:0x7d5d54, 's');
        F(k, -4.1, -1.5, 3.4, .95, 1.05, k===3?0x202a3d:0x38465c, 's');
        F(k, -4.1, -2.05, 3.1, .14, 1.08, 0xd8b779, 's');
        F(k, 0, -1.5, 1.7, .48, 1.05, 0x4c3829, 's');
        F(k, 0, -1.72, 1.45, .06, .82, 0xd8b779, 's');
        F(k, 5.1, -2.1, 2.1, .16, .65, 0x8a6847, 's');
        F(k, 5.1, -2.1, 1.45, .08, .4, 0xf2d99a, 'e', .7);
        F(k, -8.7, -3.2, .22, 2.7, .22, 0xd8b779, 'e', .45);
        F(k, 8.7, -3.2, .22, 2.7, .22, 0xd8b779, 'e', .45);
        F(k, -8, 3.5, .8, 1.4, .8, 0x1e5a48, 's');
        F(k, 8, 3.5, .8, 1.4, .8, 0x1e5a48, 's') } },
    bank(F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd;
      F(0, 0, -5, 20, 1.2, 1.1, 0x6a4a2a, 's'); F(0, 0, -5, 20.2, 1.3, .08, 0xffd75a, 'e', 1.1); F(0, 0, -5.3, 20, .12, 2.0, 0x9fe8ff, 'gs', 1.1);
      [-6, 0, 6].forEach((u, i) => NP(0, u, -6.6, 'موظف ' + (i + 1), 0x3a5a9a, Math.PI));
      F(0, 0, -hd + .7, 8, .7, 5.4, 0x8a8a98, 's'); F(0, 0, -hd + 1.1, 5, .1, 5, 0xffd75a, 'e', .2); F(0, 0, -hd + 1.2, 1.2, .15, 1.2, 0xffd75a, 'e', 2);
      for (let i = 0; i < 3; i++) { const v = -1.4 - i * 3.4; F(0, -hw + 1.1, v, 1, 1, 2, 0x2a3a5a, 's'); F(0, -hw + 1.62, v, .05, .7, .7, 0x3fe0ff, 'e', 1.3) }
      F(0, -8, 6, 5, 1, .5, 0x5a3a2a, 's'); F(0, -8, 9, 5, 1, .5, 0x5a3a2a, 's'); [[-6, 1], [6, 1]].forEach(p => F(0, p[0], p[1], 1, 1, b.fh, 0xf0e8d0, 's'));
      F(0, 6.5, 10, .8, .8, 1.6, 0x1f7a3a, 's'); SG(0, 0, -hd + .4, b.label || '🏦 بنك The Squad', '#ffd75a', 12, 1.4, 4, 0);
      SP(0, 0, -2.8, 3.4, 'bank'); SP(0, -hw + 3, -4.4, 3.4, 'bank');
      for (let i = 0; i < 6; i++) { const u = -9 + (i % 3) * 5.5, v = -9 + Math.floor(i / 3) * 4.5; F(1, u, v, 2.4, 1.1, .8, 0x6a4a2a, 's'); F(1, u, v - .25, .9, .06, .6, 0x3fe0ff, 'e', .85); F(1, u, v + 1.1, .6, .6, .5, 0x333344, 's') }
      F(1, -9.5, 4, 6, 2.2, .8, 0x4a3a2a, 's'); F(1, 3, -2, .15, 8, 2.4, 0x9fe8ff, 'gs'); NP(1, 6, 5, 'مدير الفرع', 0x3a5a9a, Math.PI); SG(1, 0, 8.5, '💼 المكاتب', '#ffd75a', 3, .7, 3, Math.PI);
      F(2, 0, -7, 5, 1.8, .85, 0x3a2a1a, 's'); F(2, 0, -7.3, 1.2, .06, .8, 0x3fe0ff, 'e', .88); F(2, -7, 2, 5, 1.4, .9, 0x4a2a2a, 's'); F(2, 7, 2, 5, 1.4, .9, 0x4a2a2a, 's');
      for (let i = 0; i < 8; i++) F(2, -8 + i * 2.3, -hd + .6, 2, .35, 2.4, 0xd9a441, 's'); SG(2, 0, 6, '🔐 الخزائن', '#ffd75a', 3, .7, 3.2, Math.PI);
      /* Private banking lounge and secure-vault visual details. */
      F(2, 0, -1, 8.5, .12, 4.8, 0x263247, 's');
      F(2, 0, -1, 8.1, .06, 4.4, 0xd9b66b, 'e', .16);
      F(2, -4.8, 2.6, 2.8, .85, 1.05, 0x263247, 's'); F(2, 4.8, 2.6, 2.8, .85, 1.05, 0x263247, 's');
      F(2, 0, 2.4, 2.4, .5, 1.2, 0x6a4a2a, 's'); F(2, 0, 2.15, 2.1, .06, .95, 0xd9b66b, 'e', .35);
      F(2, -10.5, -3.2, .14, 3.4, .14, 0xd9b66b, 'e', .5); F(2, 10.5, -3.2, .14, 3.4, .14, 0xd9b66b, 'e', .5) },
    lab(F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd;
      F(0, 0, 8.5, 7, 1.2, 1.1, 0xaab4cc, 's'); F(0, 0, 8.5, 7.1, 1.3, .08, 0x7ff6ff, 'e', 1.1); NP(0, 0, 7.1, 'الاستقبال', 0x7ff6ff, Math.PI);
      F(0, 0, -2, 2.2, 2.2, .6, 0x6a7a9a, 's'); F(0, 0, -2, 1.6, 1.6, 1.4, 0x7ff6ff, 'h', 1.3);
      [-1, 1].forEach(s => { F(0, s * 6.5, -8.5, 5, 1.4, .95, 0xaab4cc, 's'); for (let i = 0; i < 3; i++) F(0, s * 6.5 - 1.5 + i * 1.5, -8.5, .35, .35, .6, hx(i * 120 + (s > 0 ? 60 : 0), 90, 60), 'e', .95) });
      SG(0, 0, -hd + .4, '🧪 مختبرات The Squad', '#7ff6ff', 8, 1.3, 3.6, 0);
      for (let i = 0; i < 5; i++) { F(1, -8 + i * 4, -9, 1.6, 1, 2.4, 0x1a2a3a, 's'); F(1, -8 + i * 4, -8.45, 1.3, .05, 2.1, i % 2 ? 0x3fe0ff : 0x5cff9a, 'e', .15) }
      F(1, 0, 0, 5, 1.6, .85, 0xaab4cc, 's'); F(1, 0, -.3, 2, .06, .7, 0x7ff6ff, 'e', .88); NP(1, 6, 4, 'مهندس السيرفرات', 0x3a5a9a, Math.PI); SG(1, 0, 8.5, '🖥️ غرفة السيرفرات', '#7ff6ff', 4, .8, 3, Math.PI);
      for (let i = 0; i < 3; i++) { F(2, -8 + i * 8, -8, 3, 2.4, 1.3, 0xdde4f4, 's'); F(2, -8 + i * 8, -8, 2.6, 2, .1, hx(150 + i * 60, 90, 60), 'e', 1.3) }
      F(2, 6, 2, 4, 1.4, .9, 0x2a3a5a, 's'); NP(2, -4, 2, 'العالم', 0xdde4f4, Math.PI); SG(2, 0, 8.5, '🧬 المعمل الحيوي', '#5cff9a', 4, .8, 3, Math.PI) },
    shop(F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd, cl = [0xff5c5c, 0x5cb8ff, 0xffd75a, 0x5cff9a, 0xc08aff, 0xff9a5c];
      for (let r = 0; r < 4; r++) [-1, 1].forEach(s => { const v = -9 + r * 4.2; F(0, s * 6.5, v, 9, .9, 2.2, 0x2a2f4a, 's'); for (let k = 0; k < 4; k++) F(0, s * 6.5, v + .5, 8.6, .1, .35, cl[(r + k + (s > 0 ? 2 : 0)) % 6], '', .45 + k * .5) });
      [-6, 0, 6].forEach((u, i) => { F(0, u, 8.5, 3, 1, 1.1, 0x3a3f66, 's'); F(0, u, 8.5, 3.1, 1.1, .08, 0x4aff9a, 'e', 1.1); if (i != 1) NP(0, u, 7.2, 'كاشير', 0x4aff9a, Math.PI) });
      SG(0, 0, -hd + .4, '🛍️ سوق The Squad', '#4aff9a', 9, 1.4, 3.9, 0);
      for (let i = 0; i < 5; i++) { F(1, -12 + i * 6, -6, .25, 5, 1.6, 0xcccccc, 's'); F(1, -12 + i * 6, -6, .7, 4.6, .9, hx(i * 70, 70, 55), 's', .6) }
      for (let i = 0; i < 6; i++) F(1, -10 + (i % 3) * 5, 3 + Math.floor(i / 3) * 4, 1.6, 1.6, .8, 0x5a3a2a, 's');
      F(1, -hw + 5, -9, 6, 1.2, 1.1, 0x3a3f66, 's'); NP(1, -hw + 5, -10.4, 'مطعم', 0xff9a5c, Math.PI); SG(1, 0, 8.5, '👗 الملابس والمطاعم', '#4aff9a', 5, .8, 3.4, Math.PI) },
    arcade(F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd, sc = [0x3fe0ff, 0xff7ad9, 0xffd75a, 0x5cff9a];
      for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const u = -8.5 + i * 3.4, v = -11 + r * 3.6; F(0, u, v, 1.2, 1, 2.1, (i + r) % 2 ? 0x2a1a7a : 0x7a1a5a, 's'); F(0, u, v + .53, .9, .05, .7, sc[(i + r) % 4], 'e', 1.1) }
      [-1, 1].forEach(s => { F(0, s * 10, 7, 1.6, 1.6, 2.2, 0xd02a6a, 's'); F(0, s * 10, 7.82, 1.3, .05, 1.2, 0xffd75a, 'e', .8) });
      F(0, 0, 8, 5, 1, 1.1, 0x2a1a5a, 's'); NP(0, 0, 6.8, 'المشرف', 0x8a5cff, Math.PI); SG(0, 0, -hd + .4, '🕹️ أركيد The Squad', '#ff7ad9', 8, 1.4, 3.9, 0);
      [-1, 1].forEach(s => { F(1, s * 6, -6, 4.8, 2.6, .9, 0x1a8a4a, 's'); F(1, s * 6, -6, 4.2, 2, .05, 0x2aaa6a, '', .92) }); F(1, 0, 3, 3, 5, .9, 0x1a6a8a, 's'); F(1, 0, 3, 2.6, 4.6, .05, 0x3fe0ff, 'e', .92);
      F(1, -9, 6, 5, 1.4, .9, 0x7a1a5a, 's'); F(1, 9, 6, 5, 1.4, .9, 0x7a1a5a, 's'); SG(1, 0, 8.5, '🎱 بلياردو وهوكي', '#8a5cff', 4, .8, 3.2, Math.PI) },
    kiosk(F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd;
      F(0, 0, -.5, 10, 1, 1.1, 0x7a3a2a, 's'); F(0, 0, -.5, 10.1, 1.1, .08, 0xff7a5c, 'e', 1.1); F(0, -4.8, -hd + .7, 2.2, 1, 2.3, 0x2a2f4a, 's'); F(0, -4.8, -hd + 1.22, 2, .05, 2.1, 0x7ff6ff, 'e', .1);
      [-2, 2].forEach(u => F(0, u, 2.5, .6, .6, .7, 0x5a3a2a, 's')); NP(0, 0, -1.8, 'البائع', 0xff7a5c, Math.PI); SG(0, 1.5, -hd + .4, '🥤 عصير · قهوة · ساندوتشات', '#ff7a5c', 7, 1, 2.7, 0) },
    gym(F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd;
      for (let i = 0; i < 5; i++) { const u = -9 + i * 4.5; F(0, u, -9.5, 1.1, 2.4, .4, 0x222230, 's'); F(0, u, -10.9, 1, .25, 1.5, 0x333344, 's'); F(0, u, -10.75, .6, .05, .35, 0x5cff7a, 'e', 1.15) }
      for (let i = 0; i < 4; i++) F(0, -7 + i * 4.5, -4, .8, 1.6, 1.1, 0x2a2f4a, 's'); F(0, 0, -hd + .35, 26, .1, 3.2, 0xbfe0ff, 'e', .6);
      F(0, -6, 9, 7, 1.2, 1.1, 0x2a3a4a, 's'); F(0, -6, 9, 7.1, 1.3, .08, 0x5cff7a, 'e', 1.1); NP(0, -6, 7.7, 'الاستقبال', 0x5cff7a, Math.PI); SG(0, 0, -hd + .5, '💪 جيم The Squad', '#5cff7a', 7, 1.3, 4, 0);
      for (let i = 0; i < 3; i++) { F(1, -8 + i * 6, -8, 1.1, 2.4, .5, 0x333344, 's'); F(1, -8 + i * 6, -8, 3, .12, .12, 0xcccccc, '', 1.3) }
      F(1, 11, -8, .8, 6, 2.2, 0x2a2f4a, 's'); F(1, 0, 3, 8, 8, .6, 0x2a2f4a, 's'); F(1, 0, 3, 8.4, .1, .1, 0xff3a3a, 'e', 1.3); F(1, 0, 3, .1, 8.4, .1, 0xff3a3a, 'e', 1.3);
      NP(1, -6, 6, 'المدرب', 0x5cff7a, Math.PI); SG(1, 0, 8.5, '🏋️ قسم الأوزان', '#5cff7a', 4, .8, 3.2, Math.PI) }
  };
  function mkB(o) {
    const dir = o.side < 0 ? 1 : -1, hw = o.hw, hd = o.hd, cz = o.cz != null ? o.cz : (o.side < 0 ? -9 - hd : 9 + hd), dw = o.dw || DW, cx = o.bx, n = o.n, fh = o.fh;
    const b = { id: o.id, cx, cz, hw, hd, n, fh, dir, h: n * fh, items: [], signs: [], npcs: [], spots: [], slabs: {}, stairs: [], lift: null };
    b.W = (u, v) => dir > 0 ? [cx + u, cz + v] : [cx - u, cz - v]; const ry0 = dir > 0 ? 0 : Math.PI;
    const rect = (u, v, hu, hv, bot, top) => { const p = b.W(u, v); return add(p[0], p[1], hu, hv, bot, top) };
    rect(0, -hd + T / 2, hw, T / 2, 0, 99); rect(-hw + T / 2, 0, T / 2, hd, 0, 99); rect(hw - T / 2, 0, T / 2, hd, 0, 99);
    b.dw = dw; const fw = (hw - dw) / 2; rect(-(hw + dw) / 2, hd - T / 2, fw, T / 2, 0, 99); rect((hw + dw) / 2, hd - T / 2, fw, T / 2, 0, 99); rect(0, hd - T / 2, dw, T / 2, DH, 99);
    const holes = {}; const H = k => holes[k] || (holes[k] = []);
    if (o.lift) { const u1 = hw - T, u0 = u1 - 2.6, v0 = -hd + T, v1 = v0 + 2.6, L = b.lift = { u0, u1, v0, v1, ph: (hw * 977 + hd * 313) % 20000, y: 0, doors: [] };
      rect(u0 - .15, (v0 + v1 + .3) / 2, .15, (v1 + .3 - v0) / 2, 0, 99);
      for (let f = 0; f < n; f++) { rect((u0 - .3 + u1) / 2, v1 + .15, (u1 - u0 + .3) / 2, .15, f * fh + 2.7, (f + 1) * fh); const p = b.W((u0 - .3 + u1) / 2, v1 + .15), bl = { cx: p[0], cz: p[1], hw: (u1 - u0 + .3) / 2, hd: .15, bot: f * fh, top: f * fh + 2.7, fy: f * fh, blk: 1, rb: f * fh, rt: f * fh + 2.7 }; dyn.push(bl); L.doors.push(bl) }
      const pc = b.W((u0 + u1) / 2, (v0 + v1) / 2); L.cab = { cx: pc[0], cz: pc[1], hw: 1.25, hd: 1.25, bot: -.25, top: 0 }; dyn.push(L.cab); L.x = pc[0]; L.z = pc[1]; L.b = b;
      for (let k = 1; k < n; k++) H(k).push({ u0, u1, v0, v1 }) }
    if (n >= 2) for (let k = 0; k < n - 1; k++) { const side = k % 2, uc = side ? hw - T - 1.2 : -hw + T + 1.2, vS = hd - 3.5, sh = Math.max(SH, Math.ceil(fh / .36)), vE = vS - sh * SR;
      for (let j = 1; j <= sh; j++) rect(uc, vS - (j - .5) * SR, 1.1, SR / 2, k * fh, k * fh + j * fh / sh); H(k + 1).push({ u0: uc - 1.1, u1: uc + 1.1, v0: vE, v1: vS }); b.stairs.push({ k, uc, vS, vE, side, sh }) }
    for (let k = 1; k <= n; k++) { let rs = [{ u0: -hw, u1: hw, v0: -hd, v1: hd }]; (holes[k] || []).forEach(h => rs = minus(rs, h)); b.slabs[k] = rs;
      rs.forEach(r => rect((r.u0 + r.u1) / 2, (r.v0 + r.v1) / 2, (r.u1 - r.u0) / 2, (r.v1 - r.v0) / 2, k * fh - .3, k * fh)) }
    /* مناطق لازم تفضل فاضية: مدخل السلالم وقدّام الأسانسير (عشان الأثاث ما يسدّش الطريق) */
    const keep = (k, u, v, w, d) => { const q = .5; if (k < n - 1) for (const s of b.stairs) if (s.k == k && Math.abs(u - s.uc) < 1.1 + q + w / 2 && v + d / 2 > s.vE - 1.2 && v - d / 2 < s.vS + 1.8) return true;
      if (k > 0) for (const s of b.stairs) if (s.k == k - 1 && Math.abs(u - s.uc) < 1.1 + q + w / 2 && v + d / 2 > s.vE - 1.2 && v - d / 2 < s.vS + .8) return true;
      if (b.lift) { const L = b.lift; if (u + w / 2 > L.u0 - .6 && u - w / 2 < L.u1 + .2 && v + d / 2 > L.v1 && v - d / 2 < L.v1 + 3.2) return true }
      if (Math.abs(u) < dw + .7 && v + d / 2 > hd - 3.2) return true; return false };
    const F = (k, u, v, w, d, h, c, f, y) => { if (!(y > 2.5) && keep(k, u, v, w, d)) return; const p = b.W(u, v), y0 = k * fh + (y || 0); b.items.push({ k, x: p[0], z: p[1], w, d, h, y: y0, c, f: f || '' }); if ((f || '').indexOf('s') >= 0) add(p[0], p[1], w / 2, d / 2, y0, y0 + h) },
      NP = (k, u, v, name, c, ry) => { const p = b.W(u, v); b.npcs.push({ x: p[0], z: p[1], y: k * fh, name, c, ry: (ry || 0) + ry0 }) },
      SG = (k, u, v, text, col, w, h, y, ry) => { const p = b.W(u, v); b.signs.push({ x: p[0], z: p[1], y: k * fh + y, text, col, w, h, ry: (ry || 0) + ry0 }) },
      SP = (k, u, v, r, t) => { const p = b.W(u, v); b.spots.push({ x: p[0], z: p[1], y: k * fh, r, t }) };
    if (FURN[o.id]) FURN[o.id](F, NP, SG, SP, b); return b }

  /* ---------- السيارات (مجسّمات من صناديق) ---------- */
  /* ---------- السيارات: مقاطع جانبية حقيقية (L طول، W عرض، H سقف، hbR/hbF ارتفاع الشنطة/الكبوت، bl خط الشبابيك) ---------- */
  const CS = {
    limo: { n: 'ليموزين ستريتش', L: 7.6, W: 2.0, H: 1.5, gc: .17, r: .38, hbR: 1.08, hbF: 1.02, bl: 1.06, xrr: -3.15, xrt: -2.95, xft: .95, xfw: 1.4, wf: 2.6, wr: -2.4, c: 0x0b0b10, nc: 0xffd75a, p: 600000, vmax: 24, acc: 8 },
    rr: { n: 'رينج روفر', L: 4.95, W: 2.1, H: 1.87, gc: .22, r: .45, hbR: 1.5, hbF: 1.13, bl: 1.2, xrr: -2.38, xrt: -2.3, xft: .95, xfw: 1.4, wf: 1.5, wr: -1.5, c: 0xe6e8f0, nc: 0x3fe0ff, p: 220000, vmax: 30, acc: 10 },
    cad: { n: 'كاديلاك إسكاليد', L: 5.4, W: 2.2, H: 1.95, gc: .25, r: .48, hbR: 1.58, hbF: 1.28, bl: 1.32, xrr: -2.55, xrt: -2.5, xft: 1.05, xfw: 1.55, wf: 1.7, wr: -1.65, c: 0x14141c, nc: 0xff2fd6, p: 260000, vmax: 30, acc: 10 },
    bmw: { n: 'BMW X6', L: 4.95, W: 2.1, H: 1.7, gc: .2, r: .43, hbR: 1.28, hbF: 1.06, bl: 1.08, xrr: -2.4, xrt: -1.05, xft: .6, xfw: 1.15, wf: 1.5, wr: -1.5, c: 0x1a2a6a, nc: 0x3a8cff, p: 150000, vmax: 36, acc: 14 },
    rolls: { n: 'رولز رويس فانتوم (أعلى إصدار)', L: 5.76, W: 2.0, H: 1.65, gc: .22, r: .45, hbR: 1.22, hbF: 1.16, bl: 1.2, xrr: -2.65, xrt: -2.5, xft: .7, xfw: 1.15, wf: 1.95, wr: -1.75, c: 0xf4f0e6, nc: 0xd9a441, p: 2000000, vmax: 34, acc: 12, ex: 'rolls' },
    ferrari: { n: 'فيراري SF90', L: 4.71, W: 1.97, H: 1.17, gc: .1, r: .35, hbR: .97, hbF: .8, bl: .8, xrr: -1.0, xrt: -.45, xft: .35, xfw: .85, wf: 1.45, wr: -1.4, c: 0xd01818, nc: 0xff4a4a, p: 1200000, vmax: 48, acc: 22, ex: 'ferrari' },
    bugatti: { n: 'بوجاتي شيرون', L: 4.54, W: 2.04, H: 1.21, gc: .1, r: .38, hbR: .98, hbF: .9, bl: .92, xrr: -1.8, xrt: -.9, xft: .3, xfw: .85, wf: 1.4, wr: -1.35, c: 0x1a3a9a, nc: 0x7ff6ff, p: 3500000, vmax: 58, acc: 26, ex: 'bugatti' }  };
  /* كتالوج موسع لموديلات حقيقية بالاسم. الأبعاد/الشكل الحاليان مبنيان على فئة هيكل عامة؛
     يجب استبدال كل archetype بملف GLB مرخّص للحصول على تطابق بصري أصلي مع الموديل. */
  const CAR_CATALOG = [
    ['Mercedes-Benz S-Class','sedan',320000],['Mercedes-Benz E-Class','sedan',180000],['Mercedes-Benz C-Class','sedan',125000],['Mercedes-AMG GT','sport',520000],['Mercedes-AMG GT 63 S','sport',440000],
    ['BMW 7 Series','sedan',300000],['BMW 5 Series','sedan',175000],['BMW 3 Series','sedan',115000],['BMW M3 Competition','sport',210000],['BMW M4 Competition','sport',225000],['BMW M5 CS','sport',310000],['BMW X5 M','suv',260000],['BMW XM','suv',290000],
    ['Audi A8 L','sedan',260000],['Audi RS7 Sportback','sport',245000],['Audi R8 V10','super',480000],['Audi RS Q8','suv',220000],['Lamborghini Urus','suv',380000],['Lamborghini Revuelto','super',900000],['Lamborghini Huracan STO','super',650000],
    ['Ferrari 296 GTB','super',620000],['Ferrari 812 Competizione','super',850000],['Ferrari Roma','sport',360000],['Ferrari Purosangue','suv',700000],['McLaren 720S','super',600000],['McLaren Artura','super',390000],['McLaren P1','super',1100000],
    ['Porsche 911 Turbo S','sport',320000],['Porsche Taycan Turbo S','sedan',240000],['Porsche Cayenne Turbo GT','suv',260000],['Porsche 918 Spyder','super',1250000],['Aston Martin DBX707','suv',330000],['Aston Martin DBS','sport',420000],['Aston Martin Valkyrie','super',1800000],
    ['Bentley Bentayga','suv',350000],['Bentley Continental GT Speed','sport',390000],['Rolls-Royce Cullinan','suv',650000],['Rolls-Royce Spectre','sedan',480000],['Maserati MC20','super',330000],['Maserati Grecale Trofeo','suv',155000],['Lotus Emira','sport',125000],['Lotus Evija','super',2100000],
    ['Toyota Supra GR','sport',65000],['Nissan GT-R Nismo','sport',210000],['Nissan Z Nismo','sport',70000],['Chevrolet Corvette Z06','super',145000],['Chevrolet Camaro ZL1','sport',85000],['Ford Mustang Dark Horse','sport',72000],['Ford GT','super',900000],['Dodge Challenger SRT Hellcat','sport',88000],['Tesla Model S Plaid','sedan',110000],['Lucid Air Sapphire','sedan',250000]
  ];
  const ARCH = { sedan:'rr', sport:'bmw', super:'ferrari', suv:'cad' };
  CAR_CATALOG.forEach((row, i) => { const [name, type, price] = row, base = CS[ARCH[type]], key = 'catalog_' + (i + 1);
    /* Deterministic proportion variants keep the 52 catalog vehicles visually distinct while exact OEM meshes are unavailable. */
    const Ls=(type==='suv'?1.00:type==='sedan'?.98:type==='sport'?.91:.94)+((i%5)-2)*.018;
    const Ws=(type==='suv'?1.02:type==='sedan'?.96:1.00)+((i%3)-1)*.018;
    const Hs=(type==='suv'?1.20:type==='sedan'?1.04:type==='sport'?.94:.88)+((i%4)-1.5)*.025;
    const sc={L:base.L*Ls,W:base.W*Ws,H:base.H*Hs,gc:base.gc*Hs,r:base.r*Math.min(Ls,Ws),hbR:base.hbR*Hs,hbF:base.hbF*Hs,bl:base.bl*Hs,xrr:base.xrr*Ls,xrt:base.xrt*Ls,xft:base.xft*Ls,xfw:base.xfw*Ls,wf:base.wf*Ls,wr:base.wr*Ls};
    CS[key] = Object.assign({}, base, sc, { n:name, p:price, nc:[0xd9a441,0x3fe0ff,0x7d8da8,0x1e7a4b,0xb62030][i%5], c:[0x151821,0xe6e8f0,0x1b3e78,0x8a8c92,0x8c1826][i%5], vmax:type==='super'?50:type==='sport'?40:type==='suv'?31:34, acc:type==='super'?23:type==='sport'?17:type==='suv'?11:12, catalog:1, archetype:type });
  });

  /* سبلاين Catmull-Rom */
  function crs(P, n) { const o = []; for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]; for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; o.push([.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3), .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]) } } o.push(P[P.length - 1]); return o }
  const shapeCache = {};
  function carShape(key) { if (shapeCache[key]) return shapeCache[key]; const c = CS[key], L = c.L, h = L / 2, gc = c.gc, H = c.H;
    const T = [[-h, gc + .14], [-h, c.hbR - .3], [-h + .1, c.hbR - .04], [-h + .35, c.hbR], [c.xrr, c.hbR + .01], [c.xrt, H - .05], [c.xrt + .3, H], [c.xft - .3, H], [c.xft, H - .05], [c.xfw, c.hbF + .03], [(c.xfw + h) / 2, c.hbF], [h - .18, c.hbF - .07], [h - .02, c.hbF - .26], [h, gc + .24]];
    const top = crs(T, 6), pts = [[-h, gc]].concat(top, [[h, gc]]);
    const arch = (wx) => { const ra = c.r + .08, a0 = Math.asin((gc - c.r) / ra), o = []; for (let k = 0; k <= 12; k++) { const a = a0 + (Math.PI - 2 * a0) * k / 12; o.push([wx + ra * Math.cos(a), c.r + ra * Math.sin(a)]) } return o };
    const bot = arch(c.wf).concat(arch(c.wr)); const body = pts.concat(bot);
    const bl = c.bl, glass = [[c.xrr + .12, bl], [c.xrt + .03, H - .1], [c.xft - .03, H - .1], [c.xfw - .12, bl]];
    return shapeCache[key] = { body, glass, ws: [[c.xfw, c.hbF + .03], [c.xft, H - .04]], rw: [[c.xrr, c.hbR + .01], [c.xrt, H - .06]], ra: c.r + .08 } }
  /* العربيات الفعلية (بتتحرك وتتركب) */
  const CARS = [], SALE = [];
  function parkDyn(c) { const s = CS[c.key], sw = Math.abs(Math.sin(c.yaw)) > .7071, hw = (sw ? s.L : s.W) / 2 + .05, hd = (sw ? s.W : s.L) / 2 + .05; Object.assign(c.dyn, { cx: c.x, cz: c.z, hw, hd, bot: c.y + .1, top: c.y + s.H * .9 }) }
  function regCar(key, x, z, yaw, y, wr, sale) { const s = CS[key], c = { id: CARS.length, key, x, z, y: y || 0, yaw: yaw || 0, wr: wr || 0, sale: sale == null ? -1 : sale, v: 0, dyn: { blk: 1 } }; dyn.push(c.dyn); parkDyn(c); CARS.push(c); return c }
  function carPts(c, x, z, yaw) { const s = CS[c.key], fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw), L = s.L * .46, W = s.W * .4; return [[0, 0], [L, 0], [-L, 0], [L, W], [L, -W], [-L, W], [-L, -W]].map(([a, b]) => [x + fx * a + rx * b, z + fz * a + rz * b]) }
  function drive(c, inp, dt) { const s = CS[c.key], f = inp.f || 0, st = inp.s || 0, tg = f > 0 ? s.vmax * f : f < 0 ? s.vmax * .3 * f : 0;
    const dec = f == 0 ? 5 : (f * c.v < 0 ? 22 : 9); c.v += Math.max(-dec * dt, Math.min(s.acc * dt, tg - c.v));
    c.yaw += -st * 1.9 * Math.min(1, Math.abs(c.v) / 5) / (1 + Math.abs(c.v) / 45) * (c.v >= 0 ? 1 : -1) * dt;
    const n = Math.max(1, Math.ceil(Math.abs(c.v) * dt / .4)), sd = dt / n;
    for (let i = 0; i < n; i++) { const nx = c.x - Math.sin(c.yaw) * c.v * sd, nz = c.z - Math.cos(c.yaw) * c.v * sd;
      if (carPts(c, nx, nz, c.yaw).some(p => blocked(p[0], p[1], c.y))) { c.v *= -.25; break } c.x = Math.max(-BOUND, Math.min(BOUND, nx)); c.z = Math.max(-BOUND, Math.min(BOUND, nz)); c.y = groundAt(c.x, c.z, c.y) } return c }
  const carHold = (c, on) => { if (on) { c.dyn.top = -1000; c.dyn.bot = -1000 } else parkDyn(c) };
  FURN.showroom = function (F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd, order = ['ferrari', 'bugatti', 'rolls', 'bmw', 'rr'], pos = [[-18, -8], [-9, -8], [0, -8], [9, -8], [18, -8], [-12, 3], [12, 3]], keys = order.concat(['cad', 'limo']);
    for (let i = -hw + 2; i < hw - 1; i += 6) F(0, i, 0, .3, hd * 2 - 4, .03, 0x3fe0ff, 'e', .02);
    F(0, 0, -hd + .6, hw * 2 - 2, .5, 5.6, 0x0a0f22, 'e', .3); F(0, 0, -hd + .9, hw * 2 - 3, .1, 5, 0x3fe0ff, 'e', .6);
    keys.forEach((key, i) => { const [u, v] = pos[i], s = CS[key], idx = SALE.length; SALE.push({ key, n: s.n, p: s.p });
      F(0, u, v, s.W + 1.4, s.L + 1.8, .1, 0x3fe0ff, 'e', 0); F(0, u, v, s.W + .8, s.L + 1.2, .16, 0x181c30, '', .1); { const w = b.W(u, v); regCar(key, w[0], w[1], 0, .26, 0, idx) }
      SG(0, u, v + s.L / 2 + .7, s.n + ' · ' + s.p.toLocaleString('en-US') + ' 🪙', '#' + s.nc.toString(16).padStart(6, '0'), 5.4, .8, 2.7, Math.PI); SP(0, u, v, 4.6, 'car' + idx) });
    F(0, 0, 11, 9, 1.4, 1.1, 0x2a2f4a, 's'); F(0, 0, 11, 9.1, 1.5, .08, 0x3fe0ff, 'e', 1.1);
    [-14, 14].forEach((u, i) => NP(0, u, 10, 'مندوب مبيعات ' + (i + 1), 0x3fe0ff, Math.PI)); NP(0, 0, 9.6, 'مدير المعرض', 0xffd75a, Math.PI);
    SG(0, 0, -hd + .5, b.label || '🏎️ معرض سيارات The Squad', '#3fe0ff', 15, 1.6, 4.6, 0) };
  FURN.palace = function (F, NP, SG, SP, b) { const hw = b.hw, hd = b.hd, PK = 0xd9b66b, CY = 0x7ff6ff, DK = 0x101a2c, SO = 0x2b3447;
    /* الدور الأرضي: القاعة الكبرى */
    F(0, 0, 0, 16, 16, .03, 0xffffff, '', .02); F(0, 0, 0, 16.4, .2, .04, PK, 'e', .04); F(0, 0, 0, .2, 16.4, .04, CY, 'e', .04);
    F(0, 0, 10, 10, 1.2, 1.1, DK, 's'); F(0, 0, 10, 10.1, 1.3, .08, PK, 'e', 1.1); NP(0, -2, 8.4, 'مساعدة شخصية', PK, Math.PI); NP(0, 2, 8.4, 'مساعد تنفيذي', CY, Math.PI);
    [-14, -7, 7, 14].forEach((u, i) => F(0, u, -3, 1, 1, 5.6, 0x14141e, 'se', 0)); [-14, -7, 7, 14].forEach((u, i) => F(0, u, -3, 1.06, 1.06, .1, i % 2 ? CY : PK, 'e', 2.4));
    [[-12, 3], [12, 3]].forEach(([u, v]) => { F(0, u, v, 8, 2.4, .9, SO, 's'); F(0, u, v + 1.1, 8, .4, 1.7, SO, 's'); F(0, u, v - 4, 4, 2, .5, 0x9fe8ff, 'gs') });
    F(0, 0, 0, 3, 3, .25, 0xfff2d0, 'e', 4.8); F(0, 0, 0, .1, .1, 1.2, 0xfff2d0, 'e', 5.0);
    F(0, -16, -9, 3.4, 2.2, 1.1, 0x111118, 's'); F(0, -16, -9, 3, .1, .05, 0xffffff, '', 1.15);
    F(0, 0, -hd + .8, 18, .6, 3.4, 0x1a6a9a, 'e', .4); F(0, 0, -hd + 1.2, 17, .1, 3, 0x7ff6ff, 'e', .6);
    [-18, 18].forEach(u => NP(0, u, 15, 'حارس شخصي', 0x111111, Math.PI)); [-5, 5].forEach(u => NP(0, u, 17, 'حارس شخصي', 0x111111, Math.PI)); NP(0, 10, -6, 'كبير الخدم', 0x111111, Math.PI);
    SG(0, 0, -hd + .4, b.label || '👑 قصر The Squad', '#d9b66b', 13, 1.6, 4.8, 0); SG(0, 0, 11.4, '👑 الاستقبال', '#d9b66b', 4, .8, 2.7, Math.PI);
    /* الدور الأول: السينما والبار والألعاب */
    F(1, 0, -hd + .8, 18, .5, 4, 0x0a0a14, 's'); F(1, 0, -hd + 1.1, 17, .1, 3.6, 0x3a8cff, 'e', .3);
    [-4, 4].forEach(u => { F(1, u * 1.6, -9, 5, 2.4, .9, SO, 's'); F(1, u * 1.6, -10.3, 5, .4, 1.7, SO, 's') });
    F(1, -15, 2, 3, 10, 1.1, DK, 's'); F(1, -15, 2, 3.1, 10.1, .08, PK, 'e', 1.1); NP(1, -17.6, 2, 'ساقي البار', PK, Math.PI / 2); for (let i = 0; i < 4; i++) F(1, -12.6, -1 + i * 2.2, .6, .6, .8, 0x1a1a24, 's');
    F(1, 10, 4, 5, 2.6, .9, 0x1a8a4a, 's'); F(1, 10, 4, 4.4, 2, .05, 0x2aaa6a, '', .92); F(1, 12, 12, 3, 1.2, 1.2, 0xd02a6a, 's'); F(1, 12, 12, 2.6, .05, .9, 0xffd75a, 'e', 1.2);
    NP(1, 4, 8, 'مساعد', CY, Math.PI); NP(1, -6, 8, 'مساعدة', PK, Math.PI); NP(1, 0, 12, 'حارس شخصي', 0x111111, Math.PI);
    SG(1, 0, 11, '🎬 صالة السينما والبار', '#3fe0ff', 6, .9, 3.2, Math.PI);
    /* الدور الثاني: الجناح الرئيسي والمكتب */
    F(2, -10, -12, 5, 6, .8, 0xf2f2f8, 's'); F(2, -10, -15.2, 5.4, .4, 2.2, 0x1a1a2a, 's'); F(2, -10, -15, 5.4, .1, .2, PK, 'e', 2.4); F(2, -10, -9.6, 5.4, .2, .5, SO, 's');
    F(2, -18, -15, 3, 1.4, 2.6, 0x14141e, 's'); F(2, 0, -15, 1.4, 3, 2.6, 0x14141e, 's'); F(2, 10, -12, 5, 2, .9, DK, 's'); F(2, 10, -12.2, 3, .06, .7, CY, 'e', .95); F(2, 10, -9.8, .7, .7, .5, 0x333344, 's');
    F(2, 12, 8, 6, 6, .9, 0x5fd0ff, 'se'); F(2, -6, 8, 5, 2, .9, SO, 's'); F(2, -6, 9.2, 5, .4, 1.6, SO, 's');
    NP(2, 4, 5, 'مساعد تنفيذي', CY, Math.PI); NP(2, -2, 12, 'حارس شخصي', 0x111111, Math.PI); NP(2, 14, 0, 'شيف خاص', 0xffffff, Math.PI);
    SG(2, 0, 11, '🛏️ الجناح الملكي', '#d9b66b', 5, .9, 3.4, Math.PI); SP(0, 0, hd - 4, 4, 'palace') };
  const buildings = LM.map(mkB);

  /* ---------- الشوارع والبلوكات والمباني الفاضية ---------- */
  const XS = [-240, -180, -120, -60, 0, 60, 120, 180, 240], ZS = [-245, -185, -115, -45, 45, 115, 185, 245], RW = 5;
  const roads = [{ cx: 0, cz: 0, hw: CITY, hd: 9 }, { cx: 0, cz: 350, hw: 280, hd: 8 }, { cx: 0, cz: 420, hw: 280, hd: 7 }];
  XS.forEach(x => roads.push({ cx: x, cz: 0, hw: RW, hd: x ? CITY : BOUND })); ZS.forEach(z => roads.push({ cx: 0, cz: z, hw: CITY, hd: RW }));
  const xi = [], zi = []; { let a = -CITY; XS.forEach(x => { xi.push([a, x - RW]); a = x + RW }); xi.push([a, CITY]); a = -CITY; ZS.forEach(z => { zi.push([a, z - RW]); a = z + RW }); zi.push([a, CITY]) }
  /* بلوكات z: ٣ جنب كل ناحية + صف المعالم (±9 → ±40) */
  const zrows = [[-CITY, -250], [-240, -190], [-180, -120], [-110, -50], [-40, -9], [9, 40], [50, 110], [120, 180], [190, 240], [250, CITY]];
  const LMX = { '-175,-125': 'n', '-115,-65': 'ns', '-55,-5': 'ns', '5,55': 'ns', '65,115': 'ns' };
  const fillers = [], parks = [], blocks = [], fountain = { cx: 0, cz: 0, hw: 3, hd: 3, top: .6 };
  const OBBY_B = '125,175,50,110';
  xi.forEach(([x0, x1]) => zrows.forEach(([z0, z1]) => {
    const key = x0 + ',' + x1, lm = LMX[key] || '', north = z1 <= 0;
    if (z0 >= -40 && z1 <= 40 && ((north && lm.indexOf('n') >= 0) || (!north && lm.indexOf('s') >= 0))) return;
    const id = key + ',' + z0 + ',' + z1; blocks.push({ x0, x1, z0, z1 });
    const obby = id == OBBY_B, park = obby || (z1 - z0 > 50 && rnd() < .16) || (z0 >= -40 && z1 <= 40 && rnd() < .3);
    if (park) { parks.push({ x0: x0 + 2, x1: x1 - 2, z0: z0 + 2, z1: z1 - 2, obby }); return }
    const nx = (x1 - x0) > 40 ? 2 : 1, nz = (z1 - z0) > 45 ? 2 : 1, cw = (x1 - x0) / nx, cd = (z1 - z0) / nz;
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
      if (rnd() < .08) continue;
      const w = Math.min(cw - 5, 12 + rnd() * (cw - 18)), d = Math.min(cd - 5, 12 + rnd() * (cd - 18)), cx = x0 + (i + .5) * cw + (rnd() - .5) * (cw - 4 - w), cz = z0 + (j + .5) * cd + (rnd() - .5) * (cd - 4 - d);
      const near = Math.hypot(cx, cz) / CITY, h = Math.round((rnd() < .25 ? 8 + rnd() * 8 : 18 + rnd() * 50 * (1.2 - near * .7)));
      const o = { cx, cz, hw: w / 2, hd: d / 2, h, st: ['grid', 'tall', 'strip', 'glass', 'brick'][Math.floor(rnd() * 5)], hue: Math.floor(rnd() * 360), sat: 30 + Math.floor(rnd() * 25), lig: 20 + Math.floor(rnd() * 14) };
      fillers.push(o); add(cx, cz, o.hw, o.hd, 0, 99) } }));
  /* الأوبي في حديقة خاصة */
  const plats = []; for (let i = 0; i < 10; i++) plats.push({ x: 133 + 3.6 * i, z: 80, hw: 1.2, hd: 1.2, top: +(.45 * (i + 1)).toFixed(2) });
  plats.forEach(p => add(p.x, p.z, p.hw, p.hd, 0, p.top)); add(fountain.cx, fountain.cz, fountain.hw, fountain.hd, 0, fountain.top);
  /* أشجار وأعمدة إنارة */
  const trees = [], lamps = [], nearLM = x => buildings.some(b => Math.abs(x - b.cx) < 6);
  for (let x = -288; x <= 288; x += 12) { if (nearLM(x) || Math.abs(x) < 9) continue; [-6.6, 6.6].forEach((z, k) => { if (!XS.some(c => Math.abs(x - c) < 7)) trees.push({ x, z, s: .9 + rnd() * .4 }) }) }
  for (let x = -288; x <= 288; x += 24) if (!XS.some(c => Math.abs(x - c) < 7) && Math.abs(x) > 8) { lamps.push({ x: x + 6, z: -8.2 }); lamps.push({ x: x - 6, z: 8.2 }) }
  parks.forEach(p => { const nt = p.obby ? 8 : 14; for (let n = 0; n < nt * 6 && trees.length < 900; n++) { if (n >= nt * 6) break; const x = p.x0 + 3 + rnd() * (p.x1 - p.x0 - 6), z = p.z0 + 3 + rnd() * (p.z1 - p.z0 - 6);
    if (p.obby && Math.abs(z - 80) < 5 && x > 125) continue; if (trees.filter(t => Math.hypot(t.x - x, t.z - z) < 5).length) continue; trees.push({ x, z, s: .9 + rnd() * .5 }); if (trees.filter(t => t.x >= p.x0 && t.x <= p.x1 && t.z >= p.z0 && t.z <= p.z1).length >= nt) break } });
  trees.forEach(t => add(t.x, t.z, .35, .35, 0, 99));
  XS.forEach(x => ZS.forEach(z => { lamps.push({ x: x + 6.5, z: z + 6.5 }) }));
  /* عملات: الشوارع + أدوار المباني + فوق الأوبي */
  const coins = [{ x: plats[9].x, z: plats[9].z, y: plats[9].top + .9 }];
  for (let x = -220; x <= 220; x += 22) { if (x == 0) continue; coins.push({ x, z: 4, y: .9 }); if (x % 44 == 0) coins.push({ x, z: -4, y: .9 }) }
  XS.forEach(x => [-150, -80, 80, 150, 210, -210].forEach(z => coins.push({ x: x + 1.5, z, y: .9 })));
  parks.forEach(p => { if (!p.obby) coins.push({ x: (p.x0 + p.x1) / 2, z: (p.z0 + p.z1) / 2, y: .9 }) });
  buildings.forEach(b => { for (let k = 1; k < b.n; k++) { const y0 = k * b.fh; let done = 0;
    for (const v of [7, -2, 4, -4, 9, 1]) { for (const u of [0, -4, 4, -7, 7]) { if (done) break; const w = b.W(u, v);
      const bad = solids.some(s => s.top > y0 + STEP && s.bot < y0 + PH && Math.abs(w[0] - s.cx) < s.hw + .8 && Math.abs(w[1] - s.cz) < s.hd + .8) || !solids.some(s => s.top == y0 && Math.abs(w[0] - s.cx) <= s.hw && Math.abs(w[1] - s.cz) <= s.hd);
      if (!bad) { coins.push({ x: w[0], z: w[1], y: y0 + .9 }); done = 1 } } } } });

  /* ---------- وظايف (الناس العادية بتشتغل عشان تكسب) ---------- */
  const JOBS = { cafe: [0, -6, 'باريستا', 400], shop: [0, 5.8, 'كاشير', 600], gym: [-6, 6.2, 'مدرب', 500], bank: [-6, -3.6, 'موظف بنك', 1200], lab: [0, 5.5, 'فني معمل', 1500], arcade: [0, 5.6, 'مشرف أركيد', 450], hall: [-11, 6.6, 'بائع فشار', 450], showroom: [0, 7.5, 'مندوب مبيعات', 2500], kiosk: [0, 2, 'بائع', 350] };
  buildings.forEach(b => { const j = JOBS[b.id]; if (j) { const w = b.W(j[0], j[1]); b.spots.push({ x: w[0], z: w[1], y: 0, r: 3, t: 'job', n: j[2], pay: j[3] }) } });
  /* ---------- أرض القصر (بعيدة عن المدينة) + ساحة الحوادث ---------- */
  const EST = { items: [], npcs: [], signs: [] };
  const EF = (u, v, w, d, h, c, f, y) => { const y0 = y || 0; EST.items.push({ k: 0, x: u, z: v, w, d, h, y: y0, c, f: f || '' }); if ((f || '').indexOf('s') >= 0) add(u, v, w / 2, d / 2, y0, y0 + h) };
  const EN = (x, z, name, ry) => EST.npcs.push({ x, z, y: 0, name, c: 0, ry: ry || 0 }), ESG = (x, z, text, col, w, h, y, ry) => EST.signs.push({ x, z, y, text, col, w, h, ry: ry || 0 });
  const GZ = 270, PK2 = 0xd9b66b;
  EF(0, 332.5, 138, 125, .03, 0x15402e, '', 0); EF(0, 302, 14, 70, .05, 0x1a1d2c, '', 0); [-7.3, 7.3].forEach(x => EF(x, 302, .25, 70, .08, PK2, 'e', 0));
  EF(0, 345, 36, 22, .05, 0xdcdce8, '', 0);
  [[-38.4, 63.2], [38.4, 63.2]].forEach(([x, w]) => { EF(x, GZ, w, .8, 3.6, 0x1a1d30, 's'); EF(x, GZ, w, .95, .14, PK2, 'e', 3.6) });
  [-70, 70].forEach(x => { EF(x, 332.5, .8, 125, 3.6, 0x1a1d30, 's'); EF(x, 332.5, .95, 125, .14, PK2, 'e', 3.6) }); EF(0, 395, 140.8, .8, 3.6, 0x1a1d30, 's'); EF(0, 395, 140.8, .95, .14, PK2, 'e', 3.6);
  [-7, 7].forEach(x => EF(x, GZ, .7, .7, 6.4, 0x222233, 's')); EF(0, GZ, 14.7, .7, .6, 0x222233, 'e', 5.8); EF(0, GZ, 14, .2, .15, PK2, 'e', 6.4);
  ESG(0, GZ - .5, '👑 ممتلكات خاصة — المدير فقط', '#d9b66b', 8, 1.2, 4.6, 0); ESG(0, GZ + .5, '👑 قصر The Squad', '#d9b66b', 8, 1.2, 4.6, Math.PI);
  [[-4, GZ - 3], [4, GZ - 3]].forEach(([x, z]) => EN(x, z, 'حارس البوابة', Math.PI)); [[-4, GZ + 3], [4, GZ + 3]].forEach(([x, z]) => EN(x, z, 'حارس البوابة', 0));
  /* فونتانة + مهبط هليكوبتر + حمّام سباحة */
  EF(0, 324, 7, 7, .5, 0x6a7090, 's'); EF(0, 324, 6, 6, .55, 0x3fb8ff, 'e'); EF(0, 324, 1, 1, 2, 0x8a90b0, 's'); EF(0, 324, .6, .6, .5, 0x7ff6ff, 'e', 2);
  EF(-46, 300, 16, 16, .06, 0x2a2a38, '', 0); EF(-46, 300, 11, .6, .08, 0xffffff, 'e', .05); EF(-46, 300, .6, 11, .08, 0xffffff, 'e', .05); [[-53, 293], [-39, 293], [-53, 307], [-39, 307]].forEach(([x, z]) => EF(x, z, .6, .6, .1, 0xffd75a, 'e', .05)); ESG(-46, 292, '🚁 مهبط الهليكوبتر', '#ffd75a', 6, 1, 3, 0);
  EF(46, 350, 18, 11, .08, 0x2fd0ff, 'e', .01); EF(46, 350, 19, 12, .04, 0xdcdce8, '', 0); [-8, -4, 0, 4, 8].forEach(x => EF(46 + x, 357, 1.4, 4, .5, 0xf2f2f8, 's'));
  [[-60, 280], [60, 280], [-60, 380], [60, 380], [-30, 385], [30, 385], [-62, 340], [62, 330], [-45, 355], [-60, 320], [62, 300]].forEach(([x, z]) => { trees.push({ x, z, s: 1 + rnd() * .4 }); add(x, z, .35, .35, 0, 99) });
  for (let z = 276; z < 336; z += 10) { lamps.push({ x: -9.5, z }); lamps.push({ x: 9.5, z }) }
  /* الموكب: لفّة في ممر القصر (الوش ناحية الشمال) */
  [[-6, 284, 'rr'], [-6, 293, 'cad'], [-6, 304, 'limo'], [-6, 315, 'bmw'], [6, 284, 'bugatti'], [6, 294, 'rolls'], [6, 303, 'ferrari']].forEach(([x, z, k]) => { regCar(k, x, z, 0, 0, 0); ESG(x, z, CS[k].n, '#' + CS[k].nc.toString(16).padStart(6, '0'), 4.6, .6, 2.9, 0) });
  [[-9, 284], [9, 284], [-9, 304], [9, 303], [-3, 296], [3, 296]].forEach(([x, z], i) => EN(x, z, i < 4 ? 'حارس شخصي' : 'سائق', 0));
  [[-14, 332], [14, 332], [-26, 340], [26, 340]].forEach(([x, z]) => EN(x, z, 'حارس شخصي', Math.PI)); EN(-12, 338, 'مساعد', Math.PI); EN(12, 338, 'مساعدة', Math.PI);
  /* ساحة الحوادث: عربيات فاخرة متكسّرة */
  EF(120, 322, 56, 50, .04, 0x1a1a22, '', 0); [[120, 297, 56, .3], [120, 347, 56, .3], [92, 322, .3, 50], [148, 322, .3, 50]].forEach(a => EF(a[0], a[1], a[2], a[3], .1, 0xffb02c, 'e', .04));
  [[105, 310, 'ferrari', 1.2, 1], [122, 312, 'bugatti', 4.4, 1], [140, 310, 'rolls', 2.1, 1], [108, 332, 'rr', 5.2, 1], [124, 334, 'limo', 0, 2], [141, 333, 'cad', 3.3, 1]].forEach(([x, z, k, yw, w]) => regCar(k, x, z, yw, 0, w));
  ESG(120, 299, '🚧 ساحة حوادث السيارات الفاخرة', '#ffb02c', 9, 1.2, 3.6, 0); [[105, 312], [125, 323], [140, 345]].forEach(([x, z]) => EN(x, z, 'مفتّش حوادث', 0));
  /* بوابة القصر: بتتفتح للمدير بس */
  const gate = { cx: 0, cz: GZ, hw: 6.4, hd: .5, bot: 0, top: 99 }; dyn.push(gate);
  const gateOpen = o => { gate.top = o ? -1000 : 99; gate.bot = o ? -1000 : 0 };
  const MAP = { buildings, estate: EST, sale: SALE, cars: CARS, fillers, parks, roads, blocks, trees, coins: [], plats, solids, lamps, fountain, spawn: { x: 0, z: 13 }, portal: { x: 0, z: 26 }, XS, ZS };

  /* ---------- الفيزياء (متعددة الأدوار) ---------- */
  const hit = (s, x, z, r) => Math.abs(x - s.cx) < s.hw + r && Math.abs(z - s.cz) < s.hd + r;
  const cell = (x, z) => grid.get(Math.floor(x / CELL) + ',' + Math.floor(z / CELL)) || EMPTY;
  const inside = (x, z, r) => { const a = cell(x, z); for (let i = 0; i < a.length; i++) if (a[i].top >= 99 && hit(a[i], x, z, r)) return true; return false };
  function groundAt(x, z, y) { let g = 0; const a = cell(x, z);
    for (let i = 0; i < a.length; i++) { const s = a[i]; if (s.top < 99 && s.top <= y + STEP && s.top > g && hit(s, x, z, R * .8)) g = s.top }
    for (let i = 0; i < dyn.length; i++) { const s = dyn[i]; if (s.top < 99 && s.top <= y + STEP && s.top > g && hit(s, x, z, R * .8)) g = s.top } return g }
  function blocked(x, z, y) { const a = cell(x, z);
    for (let i = 0; i < a.length; i++) { const s = a[i]; if ((s.top >= 99 || s.top > y + STEP) && s.bot < y + PH && hit(s, x, z, R)) return s }
    for (let i = 0; i < dyn.length; i++) { const s = dyn[i]; if (s.top > y + STEP && s.bot < y + PH && hit(s, x, z, R)) return s } return null }
  const newP = (x, z) => ({ x, y: 0, z, yaw: 0, vy: 0, on: 1, moved: 0, run: 0 });
  function step(P, inp, dt) {
    const f = inp.f || 0, sx = inp.s || 0, sp = inp.run ? RUN : SPD, sy = Math.sin(P.yaw), cy = Math.cos(P.yaw);
    let dx = (-sy * f + cy * sx), dz = (-cy * f - sy * sx); const l = Math.hypot(dx, dz);
    if (l > 1) { dx /= l; dz /= l }
    dx *= sp * dt; dz *= sp * dt; const ox = P.x, oz = P.z, oy = P.y;
    if (dx) { let nx = P.x + dx; const s = blocked(nx, P.z, P.y); if (s) nx = dx > 0 ? s.cx - s.hw - R : s.cx + s.hw + R; if (!blocked(nx, P.z, P.y)) P.x = nx }
    if (dz) { let nz = P.z + dz; const s = blocked(P.x, nz, P.y); if (s) nz = dz > 0 ? s.cz - s.hd - R : s.cz + s.hd + R; if (!blocked(P.x, nz, P.y)) P.z = nz }
    P.x = Math.max(-BOUND, Math.min(BOUND, P.x)); P.z = Math.max(-BOUND, Math.min(BOUND, P.z));
    if (inp.jump && P.on) { P.vy = JV; P.on = 0 }
    const g = groundAt(P.x, P.z, P.y);
    if (P.on && g < P.y - .01) { if (P.y - g <= STEP + .05) P.y = g; else { P.on = 0; P.vy = 0 } }
    if (P.on) P.y = g;
    else { P.vy -= G * dt; const ny = P.y + P.vy * dt; if (P.vy <= 0 && ny <= g) { P.y = g; P.vy = 0; P.on = 1 } else P.y = ny }
    if (P.y < -50) { P.x = MAP.spawn.x; P.z = MAP.spawn.z; P.y = 0; P.vy = 0; P.on = 1 }
    P.moved = (P.x != ox || P.z != oz || P.y != oy) ? 1 : 0; return P;
  }
  const nearCoins = (P, coins, got) => { const o = []; coins.forEach((c, i) => { if (!(got && got.has(i)) && Math.hypot(c.x - P.x, c.z - P.z) < 1.1 && Math.abs(c.y - (P.y + .9)) < 1) o.push(i) }); return o };

  /* ---------- الأسانسيرات: بتتحرك بالوقت (كل الأجهزة شايفاها بنفس الحركة) ---------- */
  const LD = 5, LT = 2.2, lifts = buildings.filter(b => b.lift).map(b => b.lift);
  lifts.forEach(L => { const n = L.b.n, seq = []; for (let f = 0; f < n; f++) seq.push(f); for (let f = n - 2; f >= 1; f--) seq.push(f); L.seq = seq; L.tot = seq.length * (LD + LT) });
  function tick(ms) { lifts.forEach(L => { const b = L.b, fh = b.fh, tt = (ms / 1000 + L.ph) % L.tot, i = Math.floor(tt / (LD + LT)), lo = tt - i * (LD + LT), a = L.seq[i], c = L.seq[(i + 1) % L.seq.length];
    let y = a * fh; if (lo >= LD) { const fr = (lo - LD) / LT, e = fr < .5 ? 2 * fr * fr : 1 - 2 * (1 - fr) * (1 - fr); y = (a + (c - a) * e) * fh }
    L.y = y; L.cab.top = y; L.cab.bot = y - .25; L.at = Math.abs(y - a * fh) < .001 && lo < LD ? a : -1;
    L.doors.forEach(d => { const open = Math.abs(y - d.fy) < .06; d.top = open ? -1000 : d.rt; d.bot = open ? -1000 : d.rb; d.open = open }) }) }
  tick(0);
  const near = (x, z, r) => buildings.find(b => Math.abs(x - b.cx) < b.hw + r && Math.abs(z - b.cz) < b.hd + r);

  /* الشبكة: district/{room}/players/{uid} + district/{room}/msgs */
  const r2 = n => Math.round(n * 100) / 100;
  function Net(o) { this.o = o; this.last = null; this.lw = 0; this.lm = 0; this.un = [] }
  Net.prototype.start = function () {
    const o = this.o, base = 'district/' + o.room, self = this;
    const er = w => e => o.onError && o.onError(w, e);
    this.un.push(o.db.collection(base + '/players').onSnapshot(s => {
      const m = {}, now = Date.now();
      s.forEach(d => { if (d.id == o.uid) return; const v = d.data(); if (!v || typeof v.x != 'number' || typeof v.z != 'number' || !v.t || !v.t.toMillis || now - v.t.toMillis() > 60000) return; m[d.id] = v });
      o.onPlayers && o.onPlayers(m);
    }, er('players')));
    this.un.push(o.db.collection(base + '/msgs').orderBy('t', 'desc').limit(40).onSnapshot(s => {
      const a = []; s.forEach(d => a.push(Object.assign({ id: d.id }, d.data())));
      a.sort((p, q) => ((p.t && p.t.toMillis && p.t.toMillis()) || 0) - ((q.t && q.t.toMillis && q.t.toMillis()) || 0));
      o.onMsgs && o.onMsgs(a);
    }, er('msgs')));
  };
  Net.prototype.send = function (P, emote, force, vehicle) {
    const o = this.o, now = Date.now(), e = emote || '', L = this.last;
    const cur = { x: r2(P.x), y: r2(P.y), z: r2(P.z), r: r2(P.yaw), e };
    const chg = !L || L.x != cur.x || L.y != cur.y || L.z != cur.z || L.r != cur.r || L.e != cur.e;
    if (!force && now - this.lw < 550) return false;
    if (!force && !chg && now - this.lw < 15000) return false;
    this.lw = now; this.last = cur;
    const d = { n: String(o.name()).slice(0, 40), x: cur.x, y: cur.y, z: cur.z, r: cur.r, c: o.hue, k: String(o.look ? o.look() : '').slice(0, 30), e: e.slice(0, 12), t: o.FV.serverTimestamp() };
    if (vehicle && typeof vehicle.key === 'string' && CS[vehicle.key]) d.car = { key: vehicle.key, x: r2(vehicle.x), y: r2(vehicle.y), z: r2(vehicle.z), yaw: r2(vehicle.yaw), v: r2(vehicle.v || 0) };
    else if (vehicle === null) d.car = null;
    o.db.doc('district/' + o.room + '/players/' + o.uid).set(d).catch(x => o.onError && o.onError('send', x)); return true;
  };
  Net.prototype.say = function (tx) {
    const o = this.o, now = Date.now(); tx = String(tx || '').trim().slice(0, 200);
    if (!tx || now - this.lm < 700) return false; this.lm = now;
    o.db.collection('district/' + o.room + '/msgs').add({ u: o.uid, n: String(o.name()).slice(0, 40), tx, t: o.FV.serverTimestamp() }).catch(x => o.onError && o.onError('say', x)); return true;
  };
  Net.prototype.stop = function () { this.un.forEach(u => { try { u() } catch (e) {} }); this.un = []; this.o.db.doc('district/' + this.o.room + '/players/' + this.o.uid).delete().catch(() => {}) };
  function spawnCar(key, x, z, yaw) { if (!CS[key] || !Number.isFinite(x) || !Number.isFinite(z) || Math.abs(x)>BOUND || Math.abs(z)>BOUND) return null; return regCar(key, x, z, yaw||0, 0, 0, -1) }
  return { MAP, BOUND, inside, groundAt, blocked, newP, step, nearCoins, tick, near, gateOpen, CITY, carShape, CS, CAR_CATALOG, spawnCar, drive, carHold, parkDyn, Net, PH, STEP, DW, DH, T, SH, SR, LD, LT };
});
