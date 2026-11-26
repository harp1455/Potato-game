// PROTOTYPE - NOT FOR PRODUCTION
// Question: 파트너 크루와 함께 피크타임을 넘기는 영업 루프가 3일 동안 재미있는가?
// Date: 2026-11-26
// 그림: 색, 패널과 글자, 음식, 손님, 크루 임시 스탠딩, 배경. 전부 코드로 그린다.
'use strict';

const C = {
  ink: '#2a2146', ink2: '#5d5486', white: '#ffffff', paper: '#fff9ec',
  sun: '#ffd23f', sunD: '#f7a400', cherry: '#ff4f64', cherryD: '#d42c4a',
  mint: '#27cdb0', mintD: '#0e9f8a', sky: '#9be4ff', skyD: '#4fb8f0',
  pink: '#ff8db8', grape: '#8266ff', wood: '#f7a55a', woodD: '#cf7430',
  steel: '#e3eaf7', steelD: '#aebad6', gray: '#b8b3cc', green: '#3ccf74',
  bun: '#f2a640', bunL: '#ffd27a', patty: '#7a4226', cheese: '#ffd84a',
  pickle: '#7cc242', gold: '#ffb300', ketchup: '#e8323c', skin: '#f6c19c',
};

// ---- 기본 도형과 글자 ----------------------------------------------------------------------
function clear(c) { ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); }
let JUA = false; // 전용 폰트가 준비되면 굵기를 따로 주지 않는다 (한 가지 굵기의 폰트)
function setFont(size, bold) { ctx.font = `${JUA ? '' : bold ? '800 ' : '500 '}${size}px ${FONT}`; }
function text(s, x, y, size, c, align = 'center', bold = false) {
  setFont(size, bold); ctx.fillStyle = c; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y);
}
function textO(s, x, y, size, c = C.white, o = C.ink, lw = 6, align = 'center') { // 테두리 있는 굵은 글자
  setFont(size, true); ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.strokeStyle = o; ctx.lineWidth = lw * 0.85; ctx.strokeText(s, x, y); ctx.fillStyle = c; ctx.fillText(s, x, y);
}
function wrap(s, maxW, size, bold = false) { // 한글은 글자 단위로 줄바꿈
  setFont(size, bold);
  const out = []; let line = '';
  for (const ch of s) {
    if (ctx.measureText(line + ch).width > maxW && line) { out.push(line); line = ch === ' ' ? '' : ch; }
    else line += ch;
  }
  if (line) out.push(line);
  return out;
}
function para(s, x, y, maxW, size, c, lh, align = 'left', bold = false) {
  const lines = wrap(s, maxW, size, bold);
  lines.forEach((l, i) => text(l, x, y + i * lh, size, c, align, bold));
  return lines.length;
}
function rr(x, y, w, h, r, fill, stroke = C.ink, lw = 4) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
function ell(x, y, rx, ry, fill, stroke = C.ink, lw = 4) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
function poly(pts, fill, stroke = C.ink, lw = 4, close = true) {
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  if (close) ctx.closePath();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
function line(x1, y1, x2, y2, c = C.ink, lw = 4) { poly([x1, y1, x2, y2], null, c, lw, false); }
function won(n) { return '₩' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function at(x, y, s, fn, rot = 0) { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(s, s); fn(); ctx.restore(); }
function vgrad(y0, y1, c1, c2) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; }
function fillRect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
function easeBack(t) { t = clamp(t, 0, 1); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }

// 패널: 그림자, 세로 그라데이션, 윗면 광택, 굵은 테두리
function shade(c, f) { // f < 0 어둡게, f > 0 밝게
  if (typeof c !== 'string' || c[0] !== '#' || c.length !== 7) return c;
  const n = parseInt(c.slice(1), 16), t = f < 0 ? 0 : 255, k = Math.abs(f), m = v => Math.round(v + (t - v) * k);
  return `rgb(${m(n >> 16)},${m((n >> 8) & 255)},${m(n & 255)})`;
}
function luma(c) {
  if (typeof c !== 'string' || c[0] !== '#' || c.length !== 7) return 0.5;
  const n = parseInt(c.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}
// 패널: 번지는 그림자, 세로 그라데이션, 아랫단 입체감, 윗면 광택, 같은 색 계열의 가는 테두리
function panel(x, y, w, h, r, c1, c2 = c1, o = {}) {
  const sh = o.shadow === undefined ? 6 : o.shadow, light = luma(c2) > 0.86;
  const edge = o.stroke || (light ? '#b3a9e2' : shade(c2, -0.42));
  if (sh) {
    ctx.fillStyle = 'rgba(38,28,80,0.09)';
    ctx.beginPath(); ctx.roundRect(x - 2, y + sh, w + 4, h + 2, r + 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x - 1, y + sh * 0.6, w + 2, h + 1, r + 1); ctx.fill();
    ctx.fillStyle = 'rgba(38,28,80,0.14)'; ctx.beginPath(); ctx.roundRect(x, y + sh * 0.45, w, h, r); ctx.fill();
  }
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = vgrad(y, y + h, c1, c2); ctx.fill();
  ctx.save(); ctx.clip();
  if (o.lip !== false && h >= 44) { ctx.fillStyle = light ? 'rgba(120,105,200,0.13)' : 'rgba(0,0,0,0.15)'; ctx.fillRect(x, y + h - Math.min(8, h * 0.1), w, 10); }
  if (o.gloss !== false && !light) { ctx.fillStyle = 'rgba(255,255,255,0.24)'; ctx.beginPath(); ctx.roundRect(x + 5, y + 4, w - 10, Math.min(h * 0.42, 56), Math.max(2, r - 5)); ctx.fill(); }
  ctx.restore();
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.strokeStyle = edge; ctx.lineWidth = o.lw || 3; ctx.stroke();
}
function bar(x, y, w, h, frac, c, back = '#d9d3ea') { // 진행 막대
  rr(x, y, w, h, h / 2, back, C.ink, 3);
  const f = clamp(frac, 0, 1);
  if (f > 0.02) rr(x + 3, y + 3, Math.max(h - 6, (w - 6) * f), h - 6, (h - 6) / 2, c, null);
}

// ---- 아이콘 --------------------------------------------------------------------------------
function drawBunny(x, y, s, rot = 0) { // 번 모양 토끼 '버니'
  at(x, y, s, () => {
    ell(-14, -34, 9, 24, C.paper); ell(14, -34, 9, 24, C.paper);
    ell(-14, -32, 4, 14, C.pink, null); ell(14, -32, 4, 14, C.pink, null);
    ctx.beginPath(); ctx.moveTo(-40, 14); ctx.quadraticCurveTo(-40, -26, 0, -26); ctx.quadraticCurveTo(40, -26, 40, 14);
    ctx.closePath(); ctx.fillStyle = vgrad(-26, 14, C.bunL, C.bun); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.stroke();
    rr(-40, 14, 80, 14, 6, C.bunL);
    ell(-12, -2, 3.5, 4.5, C.ink, null); ell(12, -2, 3.5, 4.5, C.ink, null);
    ell(-21, 5, 5, 3, C.pink, null); ell(21, 5, 5, 3, C.pink, null);
    ctx.beginPath(); ctx.arc(0, 4, 5, 0.1, Math.PI - 0.1); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke();
    ell(-22, -14, 3, 1.5, C.paper, null); ell(4, -18, 3, 1.5, C.paper, null); ell(24, -10, 3, 1.5, C.paper, null);
  }, rot);
}
function bunTop(y, w) {
  ctx.beginPath(); ctx.moveTo(-w, y); ctx.quadraticCurveTo(-w, y - w * 0.8, 0, y - w * 0.8); ctx.quadraticCurveTo(w, y - w * 0.8, w, y);
  ctx.closePath(); ctx.fillStyle = vgrad(y - w * 0.8, y, C.bunL, C.bun); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.stroke();
  ell(-w * 0.4, y - w * 0.45, 4, 2, C.paper, null); ell(w * 0.1, y - w * 0.6, 4, 2, C.paper, null); ell(w * 0.5, y - w * 0.35, 4, 2, C.paper, null);
}
function bottle(c, label) { // 소스 통
  poly([-8, -40, 8, -40, 5, -28, -5, -28], c);
  rr(-20, -28, 40, 62, 12, c); rr(-14, -8, 28, 22, 6, C.white, C.ink, 3);
  ell(0, 3, 6, 6, label, null);
  ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.roundRect(-14, -22, 6, 20, 3); ctx.fill();
}
function drawItem(id, x, y, s) { // 음식과 재료, 기준 크기 약 80px
  at(x, y, s, () => {
    if (id === 'burger' || id === 'double' || id === 'burger_np') {
      const dbl = id === 'double'; let yy = 32;
      rr(-34, yy - 12, 68, 14, 6, C.bunL); yy -= 12;
      rr(-36, yy - 12, 72, 12, 5, C.patty); yy -= 12;
      if (dbl) { poly([-38, yy, 38, yy, 30, yy - 8, -30, yy - 8], C.cheese); yy -= 8; rr(-36, yy - 12, 72, 12, 5, C.patty); yy -= 12; }
      if (id !== 'burger_np') { for (let i = -1; i <= 1; i++) ell(i * 22, yy - 3, 11, 5, C.pickle, C.ink, 3); yy -= 6; }
      rr(-34, yy - 6, 68, 7, 3, dbl ? C.ketchup : C.gold, C.ink, 3); yy -= 6;
      bunTop(yy, 36);
      if (id === 'burger_np') { // 피클 빼기 표시
        ell(30, 22, 17, 17, C.white); ell(30, 22, 9, 5, C.pickle, C.ink, 2); line(19, 33, 41, 11, C.cherry, 5);
      }
    } else if (id === 'fries') {
      for (let i = -3; i <= 3; i++) rr(i * 8 - 4, -34 + Math.abs(i) * 5, 8, 44, 2, C.sun, C.ink, 3);
      poly([-30, -4, 30, -4, 22, 34, -22, 34], C.cherry);
      ell(0, 14, 9, 7, C.sun, C.ink, 3);
    } else if (id === 'drink') {
      line(8, -40, 14, -18, C.cherry, 5);
      poly([-22, -18, 22, -18, 16, 34, -16, 34], C.white);
      poly([-20, 0, 20, 0, 18, 14, -18, 14], C.mint, null);
      rr(-26, -24, 52, 10, 4, C.white);
    } else if (id === 'cone') {
      poly([-16, 0, 16, 0, 0, 38], '#eaa860');
      line(-8, 6, 6, 22, C.woodD, 2); line(8, 6, -6, 22, C.woodD, 2);
      ell(0, -6, 20, 10, C.white); ell(0, -18, 15, 9, C.white); ell(0, -29, 9, 7, C.white);
      poly([0, -42, 5, -34, -3, -33], C.white, C.ink, 3);
    } else if (id === 'bun') {
      rr(-34, 12, 68, 14, 6, C.bunL); bunTop(6, 34);
    } else if (id === 'patty') {
      ell(0, 6, 36, 14, C.patty); line(-18, 2, 14, 2, '#9c5a36', 3); line(-10, 10, 20, 10, '#9c5a36', 3);
    } else if (id === 'cheese') {
      poly([-30, 6, 0, -16, 30, 6, 0, 28], C.cheese); ell(-6, 4, 4, 3, C.sunD, null); ell(10, 10, 3, 2, C.sunD, null);
    } else if (id === 'pickle') {
      ell(-12, 2, 18, 14, C.pickle); ell(14, 8, 16, 12, C.pickle);
      ell(-12, 2, 9, 6, '#a8dd6f', null); ell(14, 8, 8, 5, '#a8dd6f', null);
    } else if (id === 'gold') { bottle(C.gold, C.sunD);
    } else if (id === 'ketchup') { bottle(C.ketchup, C.cherryD);
    } else if (id === 'trash') {
      poly([-22, -14, 22, -14, 16, 32, -16, 32], C.steelD); rr(-28, -24, 56, 10, 4, C.steelD); rr(-8, -32, 16, 8, 3, C.steelD);
      line(-8, -4, -6, 24, C.ink, 3); line(8, -4, 6, 24, C.ink, 3);
    } else if (id === 'bag') { // 배달 가방
      rr(-34, -30, 68, 64, 10, C.mint); rr(-34, -30, 68, 18, 8, C.mintD);
      rr(-12, -40, 24, 14, 6, null, C.ink, 4);
      ell(0, 10, 15, 12, C.bunL, C.ink, 3); ell(-5, 8, 2, 2.5, C.ink, null); ell(5, 8, 2, 2.5, C.ink, null);
    }
  });
}
function drawStar(x, y, r, fill = C.sun, rot = 0) {
  const p = [];
  for (let i = 0; i < 10; i++) { const a = rot - Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.48 : r; p.push(x + Math.cos(a) * q, y + Math.sin(a) * q); }
  poly(p, fill, C.ink, Math.max(2, r * 0.12));
}
function drawBolt(x, y, s, on) { // 체력 한 칸
  at(x, y, s, () => poly([4, -16, -10, 2, -1, 2, -5, 16, 10, -3, 1, -3], on ? C.sun : '#9d91e6', on ? '#a86a00' : '#6a5cc0', 2.5));
}
function drawCoin(x, y, r) { ell(x, y, r, r, C.sun, C.ink, Math.max(2, r * 0.2)); ell(x, y, r * 0.55, r * 0.55, null, C.sunD, Math.max(1.5, r * 0.16)); }
function drawHeart(x, y, s, c = C.pink) {
  at(x, y, s, () => {
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-22, -4, -12, -20, 0, -8); ctx.bezierCurveTo(12, -20, 22, -4, 0, 12); ctx.closePath();
    ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke();
  });
}

// ---- 손님 ----------------------------------------------------------------------------------
const CUSTOMER_NAMES = ['학생', '회사원', '할머니', '클러버', '관광객'];
function mouth(mood, y, c = C.ink) {
  ctx.beginPath();
  if (mood === 'happy') ctx.arc(0, y - 4, 9, 0.15, Math.PI - 0.15);
  else if (mood === 'angry') ctx.arc(0, y + 8, 9, Math.PI + 0.3, -0.3);
  else { ctx.moveTo(-7, y); ctx.lineTo(7, y); }
  ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
}
function face(mood, eyeY, mouthY) {
  if (mood === 'angry') { line(-16, eyeY - 12, -5, eyeY - 7, C.ink, 4); line(16, eyeY - 12, 5, eyeY - 7, C.ink, 4); }
  ell(-10, eyeY, 3.5, 4.5, C.ink, null); ell(10, eyeY, 3.5, 4.5, C.ink, null);
  if (mood === 'happy') { ell(-19, eyeY + 9, 6, 3.5, C.pink, null); ell(19, eyeY + 9, 6, 3.5, C.pink, null); }
  mouth(mood, mouthY);
}
function drawCustomer(kind, x, y, mood, s = 1) { // 발밑이 (x, y), 카운터가 아래를 가린다
  at(x, y, s, () => {
    if (kind === 0) { // 학생: 모자와 가방끈
      rr(-52, -96, 104, 110, 30, C.skyD);
      line(-30, -92, -22, 0, C.ink, 7); line(30, -92, 22, 0, C.ink, 7);
      ell(0, -128, 38, 38, C.skin);
      ctx.beginPath(); ctx.arc(0, -134, 39, Math.PI, 0); ctx.closePath(); ctx.fillStyle = C.cherry; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.stroke();
      rr(-4, -140, 62, 12, 6, C.cherry);
      face(mood, -122, -104);
    } else if (kind === 1) { // 회사원: 각진 어깨와 넥타이
      poly([-62, 14, -58, -84, -22, -98, 22, -98, 58, -84, 62, 14], '#6e78a6');
      poly([-16, -98, 0, -74, 16, -98], C.white); poly([-6, -86, 6, -86, 9, -40, 0, -28, -9, -40], C.sun);
      rr(-33, -168, 66, 76, 22, C.skin);
      poly([-35, -146, -30, -176, 34, -176, 36, -150, 10, -160, -20, -158], C.ink);
      face(mood, -130, -108);
    } else if (kind === 2) { // 할머니: 올림머리와 안경
      ell(0, -40, 64, 58, C.grape);
      ell(0, -112, 40, 36, C.skin);
      ell(0, -150, 22, 18, '#e9e6f5');
      ctx.beginPath(); ctx.arc(0, -118, 41, Math.PI * 1.08, Math.PI * 1.92); ctx.strokeStyle = '#e9e6f5'; ctx.lineWidth = 14; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -118, 47, Math.PI * 1.08, Math.PI * 1.92); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.stroke();
      ell(-12, -110, 11, 9, null, C.ink, 3); ell(12, -110, 11, 9, null, C.ink, 3);
      face(mood, -110, -90);
    } else if (kind === 3) { // 클러버: 뾰족한 머리와 선글라스
      poly([-56, 14, -50, -100, 50, -100, 56, 14], '#35305a'); poly([-14, -100, 0, -60, 14, -100], C.mint);
      rr(-30, -176, 60, 80, 24, '#e2a273');
      poly([-30, -160, -24, -206, -10, -180, 0, -214, 10, -180, 24, -206, 30, -160], C.pink);
      rr(-28, -146, 56, 16, 6, C.ink);
      mouth(mood, -112);
    } else { // 관광객: 챙 넓은 모자와 카메라
      rr(-50, -92, 100, 106, 26, C.mint);
      for (let i = -1; i <= 1; i++) ell(i * 26, -50 + Math.abs(i) * 14, 9, 9, C.sun, null);
      ell(0, -124, 36, 36, '#f3d2b3');
      ell(0, -150, 60, 12, C.sun); ctx.beginPath(); ctx.arc(0, -150, 32, Math.PI, 0); ctx.closePath(); ctx.fillStyle = C.sun; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.stroke();
      rr(-22, -66, 44, 30, 6, C.ink2); ell(0, -51, 9, 9, C.sky, C.ink, 3);
      line(-22, -60, -30, -92, C.ink, 3); line(22, -60, 30, -92, C.ink, 3);
      face(mood, -120, -102);
    }
    if (mood === 'angry') { line(44, -190, 52, -206, C.cherry, 5); line(56, -180, 70, -190, C.cherry, 5); }
  });
}

// ---- 크루 임시 스탠딩 (NAI 이미지가 들어오기 전까지) ------------------------------------------
const CREW_LOOK = {
  seongdo: { sw: 128, hw: 60, hair: '#1d1b26', eye: '#d92b3a', brow: 5, top: 'uniform', smiley: true,
    hairPts: [-64, -80, -66, -124, -44, -152, 0, -160, 46, -152, 66, -124, 64, -80, 48, -110, 8, -126, -28, -116] },
  minjun: { sw: 150, hw: 66, hair: '#1d1b26', eye: '#1d1b26', brow: 7, top: 'uniform', flat: true,
    hairPts: [-70, -84, -74, -128, -52, -168, -34, -148, -16, -182, 2, -150, 22, -184, 36, -150, 56, -170, 74, -126, 70, -84, 50, -112, 10, -122, -30, -116] },
  gwangsik: { sw: 136, hw: 62, hair: '#2a2833', eye: '#e3a917', brow: 6, top: 'uniform', flat: true, streak: true, aged: true,
    hairPts: [-66, -84, -68, -128, -42, -158, 10, -168, 54, -152, 70, -118, 66, -84, 56, -118, 22, -138, -30, -132, -54, -110] },
  gwancheol: { sw: 152, hw: 66, hair: '#211f2b', eye: '#4a3324', brow: 6, top: 'uniform', smiley: true, aged: true,
    hairPts: [-70, -88, -72, -128, -48, -156, 0, -164, 48, -156, 72, -128, 70, -88, 58, -120, 0, -132, -58, -120] },
  daeheon: { sw: 146, hw: 62, hair: '#d2362f', eye: '#4a3324', brow: 6, top: 'jacket', sharp: true, skin: '#eab084',
    hairPts: [-68, -84, -72, -130, -50, -166, -10, -180, 30, -172, 62, -150, 74, -112, 68, -84, 58, -110, 42, -96, 30, -124, -6, -136, -42, -120] },
  taebeom: { sw: 158, hw: 66, hair: '#6f4628', eye: '#4a3324', brow: 7, top: 'tank', sharp: true, beard: true, aged: true, skin: '#e3a475',
    hairPts: [-70, -90, -72, -130, -52, -152, 0, -158, 52, -152, 72, -130, 70, -90, 58, -122, 0, -130, -58, -122] },
};
function drawCrewBust(id, cx, cy, s, f = 'neutral') {
  const L = CREW_LOOK[id] || CREW_LOOK.seongdo, sk = L.skin || C.skin, sw = L.sw, hw = L.hw, skD = '#d9925f';
  at(cx, cy, s, () => {
    const sh = [-sw, 150, -sw + 14, 62, -44, 34, 44, 34, sw - 14, 62, sw, 150];
    if (L.top === 'uniform') {
      poly(sh, C.sun); poly([-44, 34, 0, 78, 44, 34, 30, 28, 0, 54, -30, 28], C.cherry);
      rr(46, 84, 54, 26, 6, C.white, C.ink, 3); ell(58, 97, 5, 5, C.bun, null);
    } else if (L.top === 'jacket') { // 검은 나시 위에 가죽 재킷
      poly(sh, sk); poly([-46, 150, -40, 50, 0, 80, 40, 50, 46, 150], '#26242e');
      poly([-sw, 150, -sw + 14, 62, -44, 34, -34, 150], '#3b3848'); poly([sw, 150, sw - 14, 62, 44, 34, 34, 150], '#3b3848');
      line(-40, 60, -36, 150, C.steelD, 3); line(40, 60, 36, 150, C.steelD, 3);
    } else { // 흰 나시
      poly(sh, sk); poly([-56, 150, -42, 50, -24, 42, 0, 72, 24, 42, 42, 50, 56, 150], C.white);
      line(-sw + 30, 96, -sw + 52, 118, skD, 3); // 흉터
    }
    rr(-26, -8, 52, 50, 10, skD); // 목
    rr(-hw, -134, hw * 2, 140, 46, sk);
    ell(-hw - 2, -62, 10, 18, sk); ell(hw + 2, -62, 10, 18, sk);
    if (L.beard) { // 까칠한 수염
      ctx.save(); ctx.beginPath(); ctx.roundRect(-hw, -134, hw * 2, 140, 46); ctx.clip();
      ctx.fillStyle = 'rgba(111,70,40,0.45)'; ctx.beginPath(); ctx.ellipse(0, 4, hw + 4, 46, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    poly(L.hairPts, L.hair);
    if (L.streak) { line(-30, -150, -8, -134, '#c9c6d6', 4); line(8, -160, 30, -140, '#c9c6d6', 4); }
    // 눈썹
    const by = f === 'surprised' ? -98 : -88, tilt = L.sharp || L.flat ? 2 : -3;
    line(-44, by - (L.sharp ? 4 : 0), -15, by + tilt, C.ink, L.brow); line(44, by - (L.sharp ? 4 : 0), 15, by + tilt, C.ink, L.brow);
    // 눈
    if (f === 'smile' && L.smiley) {
      ctx.beginPath(); ctx.arc(-29, -64, 11, Math.PI + 0.2, -0.2); ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.stroke();
      ctx.beginPath(); ctx.arc(29, -64, 11, Math.PI + 0.2, -0.2); ctx.stroke();
    } else {
      const ry = f === 'surprised' ? 11 : L.flat || L.sharp ? 6.5 : 9;
      ell(-29, -66, 11, ry, C.white, C.ink, 3); ell(29, -66, 11, ry, C.white, C.ink, 3);
      const dx = f === 'shy' ? 5 : 0;
      ell(-29 + dx, -66, 5, Math.min(ry - 1, 6), L.eye, null); ell(29 + dx, -66, 5, Math.min(ry - 1, 6), L.eye, null);
    }
    if (L.aged) { line(-46, -52, -40, -48, skD, 2); line(46, -52, 40, -48, skD, 2); }
    if (f === 'shy') { for (let i = 0; i < 3; i++) { line(-50 + i * 8, -40, -54 + i * 8, -30, C.cherry, 3); line(34 + i * 8, -40, 30 + i * 8, -30, C.cherry, 3); } }
    line(0, -56, -5, -36, skD, 4); // 코
    ctx.beginPath(); // 입
    if (f === 'smile') { if (L.sharp) { ctx.moveTo(-14, -18); ctx.quadraticCurveTo(4, -8, 18, -24); } else ctx.arc(0, -24, L.flat ? 9 : 18, 0.15, Math.PI - 0.15); }
    else if (f === 'surprised') ctx.ellipse(0, -14, 8, 9, 0, 0, Math.PI * 2);
    else if (f === 'shy') { ctx.moveTo(-10, -16); ctx.quadraticCurveTo(0, -9, 10, -16); }
    else if (L.flat) { ctx.moveTo(-12, -14); ctx.lineTo(12, -14); }
    else if (L.sharp) { ctx.moveTo(-12, -14); ctx.quadraticCurveTo(2, -10, 14, -18); }
    else ctx.arc(0, -20, 12, 0.3, Math.PI - 0.3);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
  });
}

// ---- 배경 ----------------------------------------------------------------------------------
const SKY = {
  morning: { top: '#bfeaff', bot: '#fff3c9', wall: '#fff8e6', wall2: '#fff1d0', city: '#9fd0e8', glow: 'rgba(255,255,255,0)' },
  day: { top: '#6fd0ff', bot: '#c9f1ff', wall: '#f4fffb', wall2: '#e3f9f2', city: '#7fbfe6', glow: 'rgba(255,255,255,0)' },
  sunset: { top: '#ff8f6b', bot: '#ffd08a', wall: '#fff3e8', wall2: '#ffe6d6', city: '#c65f6e', glow: 'rgba(255,120,80,0.10)' },
  night: { top: '#231b52', bot: '#5a3f9e', wall: '#eee9ff', wall2: '#e0d8fb', city: '#16113a', glow: 'rgba(90,60,200,0.16)' },
};
function checker(x0, y0, x1, y1, size, c1, c2) { // 잔잔한 물방울 무늬 바탕
  ctx.fillStyle = vgrad(y0, y1, c1, shade(c1, -0.04)); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); ctx.fillStyle = c2;
  const r = size * 0.13;
  for (let y = y0, row = 0; y < y1 + size; y += size * 0.5, row++) for (let x = x0 + (row % 2 ? size * 0.5 : 0); x < x1 + size; x += size) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  ctx.restore();
}
function stripes(x0, y0, x1, y1, w, c1, c2) { // 세로 줄무늬 벽지
  fillRect(x0, y0, x1 - x0, y1 - y0, c1); ctx.fillStyle = c2;
  for (let x = x0; x < x1; x += w * 2) ctx.fillRect(x, y0, w, y1 - y0);
}
function drawStore(skyKey, y0, y1, t, peak) { // 매장 벽, 창밖, 간판 아래
  const S = SKY[skyKey] || SKY.day;
  stripes(0, y0, W, y1, 30, S.wall, S.wall2);
  // 창
  const wy = y0 + 8, wh = 124;
  ctx.fillStyle = vgrad(wy, wy + wh, S.top, S.bot); ctx.beginPath(); ctx.roundRect(14, wy, W - 28, wh, 14); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(14, wy, W - 28, wh, 14); ctx.clip();
  ctx.fillStyle = S.city; // 이태원 골목 지붕선
  const b = [0, 60, 70, 60, 70, 38, 130, 38, 130, 70, 190, 70, 190, 26, 240, 26, 240, 56, 320, 56, 320, 44, 380, 44, 380, 74, 450, 74, 450, 30, 520, 30, 520, 62, 600, 62, 600, 42, 660, 42, 660, 66, 720, 66];
  ctx.beginPath(); ctx.moveTo(0, wy + wh); for (let i = 0; i < b.length; i += 2) ctx.lineTo(b[i], wy + b[i + 1] + 20); ctx.lineTo(W, wy + wh); ctx.closePath(); ctx.fill();
  if (skyKey === 'night') { ctx.fillStyle = C.sun; for (let i = 0; i < 22; i++) ctx.fillRect(30 + (i * 67) % 660, wy + 70 + (i * 29) % 44, 6, 8); for (let i = 0; i < 12; i++) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillRect(24 + (i * 113) % 670, wy + 8 + (i * 17) % 30, 3, 3); } }
  else if (skyKey === 'sunset') ell(560, wy + 70, 34, 34, '#fff1b0', null);
  else { ell(120 + ((t * 6) % 760) - 60, wy + 30, 46, 14, 'rgba(255,255,255,0.85)', null); ell(470 + ((t * 4) % 760) - 240, wy + 52, 60, 16, 'rgba(255,255,255,0.7)', null); }
  ctx.restore();
  ctx.beginPath(); ctx.roundRect(14, wy, W - 28, wh, 14); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.stroke();
  line(W / 2, wy, W / 2, wy + wh, C.ink, 4);
  if (S.glow) fillRect(0, y0, W, y1 - y0, S.glow);
  if (peak) fillRect(0, y0, W, y1 - y0, `rgba(255,79,100,${0.06 + 0.05 * Math.sin(t * 6)})`);
}
function drawLoc(loc, t) { // 이벤트 배경
  const L = {
    crewroom: ['#dff3ff', '#bfe3f7'], alley: ['#3a3160', '#2d2550'], hall: ['#3c2f6b', '#2c2253'], grill: ['#e6ecf7', '#cdd6ea'],
    freezer: ['#d9f4ff', '#b6e4f7'], eaves: ['#33405f', '#27314b'], counter: ['#fff3da', '#ffe2ad'], street: ['#2b2458', '#1e1942'],
  }[loc] || ['#eee', '#ddd'];
  checker(0, 0, W, H, 60, L[0], L[1]);
  if (loc === 'crewroom') for (let i = 0; i < 5; i++) { panel(30 + i * 134, 60, 120, 540, 10, '#8fb7d9', '#6f9cc4', { shadow: 4 }); rr(52 + i * 134, 100, 76, 14, 4, C.ink, null); ell(132 + i * 134, 330, 6, 6, C.sun); }
  if (loc === 'alley') {
    panel(470, 40, 200, 150, 12, C.steel, C.steelD); for (let i = 0; i < 5; i++) line(492, 66 + i * 26, 648, 66 + i * 26, C.ink2, 4);
    panel(40, 400, 140, 210, 12, C.mint, C.mintD); ell(600, 300, 60, 60, 'rgba(255,210,63,0.18)', null); ell(600, 300, 16, 16, C.sun);
  }
  if (loc === 'hall') { panel(40, 50, 640, 300, 14, '#221a4d', '#3c2f7a', { gloss: false }); ell(560, 130, 30, 30, '#fff1b0', null); for (let i = 0; i < 3; i++) { rr(60 + i * 220, 500, 160, 20, 6, C.wood); panel(90 + i * 220, 440, 100, 60, 10, C.cherry, C.cherryD, { shadow: 0 }); } }
  if (loc === 'grill') { poly([60, 30, 660, 30, 600, 140, 120, 140], C.steelD); panel(60, 470, 600, 140, 12, '#6b7391', '#4b5270'); for (let i = 0; i < 6; i++) line(100 + i * 100, 492, 100 + i * 100, 590, C.ink, 6); }
  if (loc === 'freezer') { for (let i = 0; i < 6; i++) panel(40 + (i % 3) * 220, 70 + Math.floor(i / 3) * 270, 190, 230, 10, '#e2b97d', '#c99a5b', { shadow: 4 }); for (let i = 0; i < 20; i++) ell(40 + (i * 97) % 640, 30 + (i * 53 + t * 20) % 600, 4, 4, C.white, null); }
  if (loc === 'eaves') { fillRect(0, 0, W, 70, '#1c2338'); for (let i = 0; i < 44; i++) { const x = (i * 61 + t * 40) % W, y = (i * 97 + t * 900) % 620 + 70; line(x, y, x - 6, y + 26, '#9fc8ef', 3); } }
  if (loc === 'counter') { panel(60, 440, 600, 170, 12, C.wood, C.woodD); panel(420, 330, 180, 130, 12, C.steel, C.steelD); rr(440, 350, 140, 60, 6, C.ink); text('₩', 510, 380, 34, C.mint, 'center', true); }
  if (loc === 'street') {
    for (let i = 0; i < 16; i++) fillRect(20 + (i * 139) % 680, 30 + (i * 71) % 360, 4, 4, 'rgba(255,255,255,0.8)');
    for (let i = 0; i < 5; i++) { fillRect(i * 150, 380 - (i % 3) * 60, 130, 260, '#15102f'); ctx.fillStyle = C.sun; for (let k = 0; k < 6; k++) ctx.fillRect(i * 150 + 18 + (k % 3) * 36, 400 - (i % 3) * 60 + Math.floor(k / 3) * 50, 14, 20); }
    panel(520, 250, 150, 60, 10, C.mint, C.mintD); text('BUS', 595, 281, 26, C.white, 'center', true); line(595, 310, 595, 600, C.steelD, 8);
  }
}
function sunburst(cx, cy, t, c1, c2) { // 타이틀 배경
  clear(c1); ctx.fillStyle = c2;
  for (let i = 0; i < 12; i++) {
    const a = t * 0.15 + i * Math.PI / 6;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 1700, cy + Math.sin(a) * 1700);
    ctx.lineTo(cx + Math.cos(a + Math.PI / 12) * 1700, cy + Math.sin(a + Math.PI / 12) * 1700); ctx.closePath(); ctx.fill();
  }
}
