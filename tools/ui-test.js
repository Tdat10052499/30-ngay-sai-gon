#!/usr/bin/env node
/*
 * Bộ kiểm tra giao diện (CLAUDE-CODE-DIEN-THOAI.md mục 6, docs/PLAN-DIEN-THOAI.md mục 6.2).
 * Chạy game thật trong Playwright (chromium, webkit, firefox) ở 9 kích thước, chụp ảnh vào test-results/ui/<máy>/<kích thước>/
 * và kiểm tự động: không cuộn ngang, nút trọn trong màn hình và ngoài vùng an toàn giả lập, nút từ 44×44, chữ từ 11px,
 * hộp hội thoại không tràn với lời 400 ký tự, không lỗi console. Thêm các kịch bản: xoay máy, số lần bấm một ngày thường,
 * tạo nhân vật trên máy nhỏ (có bàn phím ảo), hành vi hộp hội thoại, bấm bản đồ và kéo ngăn kéo.
 *
 * Dùng:  npm run test:ui
 *        node tools/ui-test.js --engines=chromium --sizes=390x844,844x390
 * Thoát với mã 1 nếu có chỗ chưa đạt.
 */
const fs = require('fs');
const path = require('path');
const { start } = require('./serve');

let pw;
try { pw = require('playwright'); } catch (e) {
  console.error('Chưa cài Playwright. Chạy: npm install && npx playwright install');
  process.exit(1);
}

const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const ENGINES = arg('engines', 'chromium,webkit,firefox').split(',');
const SIZES = arg('sizes', '390x844,375x667,360x780,430x932,844x390,667x375,780x360,932x430,1280x720').split(',').map(s => s.split('x').map(Number));
const OUT = path.join(__dirname, '..', 'test-results', 'ui');
const KINDS = ['talk', 'choice', 'msg', 'call', 'alert', 'think'];

/* vùng an toàn giả lập (tai thỏ, thanh vuốt) đặt bằng biến --st/--sb/--sl/--sr trên #stage */
const safeArea = (w, h) => layoutOf(w, h) === 'portrait' ? { st: 47, sb: 34, sl: 0, sr: 0 }
  : layoutOf(w, h) === 'landscape' ? { st: 0, sb: 21, sl: 47, sr: 47 } : { st: 0, sb: 0, sl: 0, sr: 0 };
function layoutOf(w, h) { return w < h && w <= 600 ? 'portrait' : w > h && h <= 500 ? 'landscape' : 'desktop'; }

/* ---------- các hàm chạy trong trang ---------- */

/* ván mới ở ngày 9, sáng thứ Ba, phòng trọ; đã nhận việc, nhiệm vụ chương 2 đang làm. Không minigame, không ngẫu nhiên */
function setupGame(sa) {
  MG.off = true; Math.random = () => 0.99;
  newGame({ name: 'Minh', gender: 'nam' });
  let g = 0; while (win === 'event' && g++ < 50) { finishType(); pickChoice(0); }
  hideWin(); queue = [];
  s.day = 9; s.slot = 0; s.loc = 'home'; s.flags.hired = 1; s.flags.metHai = 1;
  QUESTS.forEach(q => { s.q[q.id] = q.ch === 1 ? 'done' : q.ch === 2 ? 'active' : undefined; });
  render();
  if (sa) {
    const st = document.getElementById('stage');
    for (const k in sa) st.style.setProperty('--' + k, sa[k] + 'px');
    dispatchEvent(new Event('resize'));
  }
}
/* các màn cần chụp; mỗi hàm mở đúng một thứ trên nền setupGame */
const SCREENS = {
  play: () => { showScreen('game'); render(); },
  meal: () => { s.slot = 1; s.ateThisSlot = false; s.bag = [{ id: 'mi', exp: null }, { id: 'nguyenlieu', exp: 12 }, { id: 'banhmi', exp: 10 }]; render(); },
  window: () => openWin('bag'),
  talk: () => Dialog.sample('talk'), choice: () => Dialog.sample('choice'), msg: () => Dialog.sample('msg'),
  call: () => Dialog.sample('call'), alert: () => Dialog.sample('alert'), think: () => Dialog.sample('think'),
  minigame: () => { MG.off = false; Math.random = () => 0; s.slot = 2; s.loc = 'store'; s.mg = {}; render(); doAction(A.store.find(a => a.id === 'shift')); },
};
function closeAll() { hideWin(); closeMenu(); Dialog.hideThink(true); if (typeof mgCur !== 'undefined') mgCur = null; }

/* đo một màn: cuộn ngang, nút ngoài màn hình hoặc trong vùng an toàn, nút nhỏ, chữ nhỏ */
function measure(sa) {
  const vw = innerWidth, vh = innerHeight, safe = { l: sa.sl, t: sa.st, r: vw - sa.sr, b: vh - sa.sb };
  const o = { hscroll: document.documentElement.scrollWidth > vw + 1, out: [], small: [], font: [] };
  const vis = el => {
    const r = el.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return false;
    for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e); if (c.visibility === 'hidden' || +c.opacity === 0 || c.display === 'none') return false; }
    return true;
  };
  const name = b => (b.getAttribute('aria-label') || b.textContent || b.tagName).trim().replace(/\s+/g, ' ').slice(0, 22);
  /* nút trong vùng cuộn: chỉ xét chiều ngang, vì người chơi cuộn tới được */
  const scroller = el => {
    for (let a = el.parentElement; a && a.id !== 'stage'; a = a.parentElement) {
      const c = getComputedStyle(a); if (/(auto|scroll)/.test(c.overflowY) && a.scrollHeight > a.clientHeight + 1) return a;
    }
    return null;
  };
  document.querySelectorAll('#stage button, #stage select, #stage input:not([type=radio]):not([type=checkbox])').forEach(b => {
    if (!vis(b)) return;
    const r = b.getBoundingClientRect(), n = name(b);
    if (r.width < 43.5 || r.height < 43.5) o.small.push(`${n} ${Math.round(r.width)}×${Math.round(r.height)}`);
    const sc = scroller(b);
    if (sc) {
      const sr = sc.getBoundingClientRect(); if (r.bottom <= sr.top || r.top >= sr.bottom) return;
      if (r.left < safe.l - .5 || r.right > safe.r + .5) o.out.push(n);
    } else if (r.left < safe.l - .5 || r.right > safe.r + .5 || r.top < safe.t - .5 || r.bottom > safe.b + .5) o.out.push(n);
  });
  const wk = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT); let t;
  while ((t = wk.nextNode())) {
    if (!t.textContent.trim()) continue; const el = t.parentElement;
    if (el.closest('.vh,[aria-hidden="true"],canvas,svg') || !vis(el)) continue;
    const f = parseFloat(getComputedStyle(el).fontSize); if (f < 10.95) o.font.push(`«${t.textContent.trim().slice(0, 14)}» ${f.toFixed(1)}px`);
  }
  for (const k of ['out', 'small', 'font']) o[k] = [...new Set(o[k])];
  return o;
}
/* hộp hội thoại với lời dài: hộp nằm trong màn hình, nút lựa chọn trọn trong vùng an toàn */
function dialogFits(sa) {
  const vw = innerWidth, vh = innerHeight, bad = [];
  const box = document.querySelector('#win .dd') || document.querySelector('#win .e-dlg') || document.getElementById('think');
  if (!box) return ['không thấy hộp'];
  const r = box.getBoundingClientRect();
  if (r.left < -.5 || r.top < -.5 || r.right > vw + .5 || r.bottom > vh + .5) bad.push(`hộp ${Math.round(r.left)},${Math.round(r.top)}→${Math.round(r.right)},${Math.round(r.bottom)}`);
  document.querySelectorAll('#win [data-ch]').forEach(b => {
    const q = b.getBoundingClientRect(); if (!q.width) return;
    if (q.left < sa.sl - .5 || q.right > vw - sa.sr + .5 || q.top < sa.st - .5 || q.bottom > vh - sa.sb + .5) bad.push('lựa chọn «' + b.textContent.trim().slice(0, 14) + '» ngoài màn hình');
  });
  return bad;
}

/* ---------- tiện ích phía Node ---------- */

async function newPage(b, w, h, opts = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, ...opts });
  const p = await ctx.newPage(); p.errs = [];
  p.on('pageerror', e => p.errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') p.errs.push(m.text()); });
  await p.goto(BASE);
  p.done = () => ctx.close().catch(() => {});
  return p;
}
const finishTyping = p => p.evaluate(() => { if (typingNow()) finishType(); });
let BASE = '';

/* ---------- 1. chụp ảnh và kiểm tự động ở từng kích thước ---------- */
async function sizeChecks(b, eng, w, h) {
  const sa = safeArea(w, h), dir = path.join(OUT, eng, `${w}x${h}`);
  fs.mkdirSync(dir, { recursive: true });
  const p = await newPage(b, w, h), R = { hscroll: [], out: [], small: [], font: [], long: [], console: [] };
  for (const [k, fn] of Object.entries(SCREENS)) {
    await p.evaluate(setupGame, sa);
    await p.evaluate(`(${fn})()`);
    await p.waitForTimeout(250); await finishTyping(p); await p.waitForTimeout(300);
    const m = await p.evaluate(measure, sa);
    if (m.hscroll) R.hscroll.push(k);
    for (const x of ['out', 'small', 'font']) m[x].forEach(v => R[x].push(`${k}: ${v}`));
    await p.screenshot({ path: path.join(dir, k + '.png') });
    await p.evaluate(closeAll);
  }
  for (const k of KINDS) {
    await p.evaluate(setupGame, sa);
    await p.evaluate(k => Dialog.sample(k, true), k);
    await p.waitForTimeout(250); await finishTyping(p); await p.waitForTimeout(300);
    (await p.evaluate(dialogFits, sa)).forEach(v => R.long.push(`${k}: ${v}`));
    await p.screenshot({ path: path.join(dir, k + '-dai.png') });
    await p.evaluate(closeAll);
  }
  R.console = p.errs.splice(0);
  await p.done();
  return R;
}

/* ---------- 2. xoay máy giữa chừng: 390×844 → 844×390 → 390×844 ---------- */
const ROTATE = {
  choice: () => { queue.push(DECK_BY.lend.mk(s)); processQueue(); },
  typing: () => { queue.push(ev('Phòng ghép với Khoa', '“Chìa khóa nè. Con ở chung với thằng Khoa, tiền nhà phần con 1 triệu 2, đóng sáng mùng 5 nghen. Trong túi con có ít nguyên liệu cô cho, tối về nấu ăn cho đỡ tốn.”', [{ l: 'Dạ, con cảm ơn cô' }], 'tu')); processQueue(); },
  window: () => openWin('bag'),
  menu: () => { cardMode = false; renderCmd(); openCat('act'); },
  minigame: () => { MG.off = false; Math.random = () => 0; s.slot = 2; s.loc = 'store'; s.mg = {}; render(); doAction(A.store.find(a => a.id === 'shift')); },
};
function finger() {
  const say = document.getElementById('evSay');
  return { win, ev: curEvent && curEvent.title, say: say ? say.textContent.slice(0, 40) : null, typed: evType ? evType.shown : null,
    mg: mgCur ? { t: mgCur.e.type, k: mgCur.e.st && mgCur.e.st.k } : null, menu: menuCat, mode, day: s.day, slot: s.slot, money: s.money,
    lay: document.documentElement.className.replace('lay-', '') };
}
async function rotateChecks(b) {
  const out = [];
  for (const [name, fn] of Object.entries(ROTATE)) {
    const p = await newPage(b, 390, 844);
    await p.evaluate(setupGame); await p.evaluate(`(${fn})()`); await p.waitForTimeout(name === 'typing' ? 400 : 200);
    const a = await p.evaluate(finger);
    await p.setViewportSize({ width: 844, height: 390 }); await p.waitForTimeout(300);
    const b1 = await p.evaluate(finger);
    await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300);
    const c = await p.evaluate(finger);
    const keys = ['win', 'ev', 'mg', 'menu', 'mode', 'day', 'slot', 'money'];
    const same = (x, y) => keys.every(k => JSON.stringify(x[k]) === JSON.stringify(y[k]));
    const bad = [];
    if (a.lay !== 'portrait' || b1.lay !== 'landscape' || c.lay !== 'portrait') bad.push(`bố cục ${a.lay}→${b1.lay}→${c.lay}`);
    if (!same(a, b1) || !same(a, c)) bad.push('mất trạng thái');
    if (name === 'typing' && !(b1.typed >= a.typed && c.typed >= b1.typed)) bad.push(`chữ hiện lại từ đầu ${a.typed}→${b1.typed}→${c.typed}`);
    if (name === 'choice') {
      /* sang ngang: cùng lời thoại, bấm được lựa chọn đầu (Cho mượn −300.000đ) */
      await p.setViewportSize({ width: 844, height: 390 }); await p.waitForTimeout(300); await finishTyping(p); await p.waitForTimeout(300);
      const say = await p.evaluate(() => document.getElementById('evSay').textContent);
      if (!say.startsWith(a.say.replace(/\s*$/, '').slice(0, 10))) bad.push('lời thoại khác');
      const m0 = await p.evaluate(() => s.money);
      await p.click('#win [data-ch="0"]'); await p.waitForTimeout(200);
      if (!await p.evaluate(m0 => win !== 'event' && s.money === m0 - 300000, m0)) bad.push('không bấm được lựa chọn sau khi xoay');
    }
    bad.push(...p.errs.map(e => 'lỗi: ' + e));
    out.push({ name, ok: !bad.length, detail: bad.join('; ') });
    await p.done();
  }
  return out;
}

/* ---------- 3. số lần bấm một ngày thường ở bản dọc ---------- */
async function tapChecks(b) {
  const p = await newPage(b, 390, 844);
  await p.evaluate(setupGame);
  await p.evaluate(() => { s.diet = 'tuchon'; s.money = 815000; s.no = 52; s.nl = 64; s.tt = 58; s.sk = 72; genDaily(); render(); });
  let taps = 0; const log = [];
  /* bấm, rồi bấm qua các hộp sự kiện hiện ra (đợi chữ hiện hết như người chơi) */
  const tap = async sel => {
    await p.click(sel); taps++; await p.waitForTimeout(100);
    for (let g = 0; g < 5 && await p.evaluate(() => win === 'event'); g++) {
      log.push(await p.evaluate(() => curEvent.title));
      await p.waitForFunction(() => !typingNow(), null, { timeout: 20000 }); await p.waitForTimeout(250);
      await p.click('#win [data-ch]'); taps++; await p.waitForTimeout(100);
    }
  };
  const card = async id => {
    const i = await p.evaluate(id => cards.findIndex(c => c.id === id), id);
    if (i < 0) throw new Error('không có thẻ ' + id + ': ' + await p.evaluate(() => cards.map(c => c.id).join(', ')));
    log.push(id); await tap(`[data-card="${i}"]`);
  };
  const eat = async () => {
    if (!await p.evaluate(() => meals.length)) { log.push('(đã tự ăn)'); return; }
    log.push('ăn ' + await p.evaluate(() => meals[0].n)); await tap('[data-dish="0"]');
  };
  let err = '';
  try { await card('class'); await eat(); await card('nap'); await card('shift'); await eat(); await card('shift'); } catch (e) { err = e.message; }
  const end = await p.evaluate(() => [s.day, s.slot]);
  const ok = !err && taps <= 8 && end[0] === 10 && !p.errs.length;
  await p.done();
  return { ok, taps, detail: `${taps} lần · ${log.join(' › ')} → ngày ${end[0]} buổi ${end[1]}${err ? ' · LỖI ' + err : ''}${p.errs.length ? ' · ' + p.errs.join('|') : ''}` };
}

/* ---------- 4. tạo nhân vật trên máy nhỏ, có bàn phím ảo ---------- */
/* [rộng, cao, chiều cao còn lại khi bàn phím mở (0 = không giả lập)] */
const CREATE = [[320, 480, 0], [360, 640, 340], [375, 667, 380], [390, 844, 0], [568, 320, 0], [667, 375, 180], [844, 390, 0], [800, 450, 0], [1280, 720, 0]];
async function createChecks(b) {
  const out = [];
  for (const [w, h, kb] of CREATE) {
    const p = await newPage(b, w, h);
    await p.waitForTimeout(150); await p.evaluate(() => cmd('new')); await p.waitForTimeout(200);
    const lay0 = await p.evaluate(() => document.documentElement.className);
    await p.focus('#crName'); await p.keyboard.type('Minh');
    if (kb) { await p.setViewportSize({ width: w, height: kb }); await p.evaluate(() => { const i = document.getElementById('crName'); i.blur(); i.focus(); }); }
    await p.waitForTimeout(450);
    const lay1 = await p.evaluate(() => document.documentElement.className), vh = kb || h;
    /* người chơi tự lăn tới nút "Tạo nhân vật" rồi bấm theo tọa độ, không để Playwright tự cuộn hộ */
    const inView = () => p.evaluate(vh => {
      const r = document.getElementById('crCreate').getBoundingClientRect(), c = document.getElementById('createScreen').getBoundingClientRect();
      return r.top >= Math.max(0, c.top) - 1 && r.bottom <= Math.min(vh, c.bottom) + 1 ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
    }, vh);
    await p.evaluate(() => { document.getElementById('createScreen').scrollTop = 0; });
    let pos = await inView(), wheels = 0;
    while (!pos && wheels < 20) { await p.mouse.move(w / 2, vh - 20); await p.mouse.wheel(0, 120); await p.waitForTimeout(80); wheels++; pos = await inView(); }
    if (pos) { await p.waitForTimeout(400); pos = await inView(); }
    if (pos) { await p.mouse.click(pos.x, pos.y); await p.waitForTimeout(300); }
    const started = await p.evaluate(() => mode === 'intro');
    const bad = [];
    if (lay1 !== lay0) bad.push(`bố cục đổi khi gõ tên ${lay0}→${lay1}`);
    if (!pos) bad.push('không lăn tới được nút');
    if (!started) bad.push('không vào được ngày 1');
    bad.push(...p.errs.map(e => 'lỗi: ' + e));
    out.push({ name: `${w}×${h}${kb ? ' phím→' + kb : ''}`, ok: !bad.length, detail: bad.join('; ') || `lăn ${wheels} lần` });
    await p.done();
  }
  return out;
}

/* ---------- 4.5 hướng dẫn Ngày 0, bỏ qua an toàn và vào tháng chơi thật ---------- */
async function tutorialChecks(b, w, h) {
  const p = await newPage(b, w, h, { reducedMotion: 'reduce' });
  p.setDefaultTimeout(8000);
  let detail = '';
  try {
    await p.evaluate(() => cmd('new'));
    await p.fill('#crName', 'Lan');
    await p.click('#crCreate');
    await p.waitForFunction(() => mode === 'intro' && introKind === 'tutorial');
    await p.waitForFunction(() => !document.getElementById('inGo').disabled);
    await p.click('#inGo');
    await p.waitForFunction(() => tutorialActive && !document.getElementById('tutorial').hidden);
    const safe = safeArea(w, h);
    const cardSafe = await p.evaluate(sa => {
      const stage = document.getElementById('stage');
      for (const [key, value] of Object.entries({ st: sa.st, sb: sa.sb, sl: sa.sl, sr: sa.sr })) stage.style.setProperty('--' + key, value + 'px');
      const card = document.querySelector('.tutorial-card').getBoundingClientRect();
      const controls = [...document.querySelectorAll('#tutorial button')].map(b => b.getBoundingClientRect());
      return card.top >= sa.st - .5 && card.left >= sa.sl - .5 && card.right <= innerWidth - sa.sr + .5
        && controls.every(r => r.top >= sa.st - .5 && r.bottom <= innerHeight - sa.sb + .5
          && r.left >= sa.sl - .5 && r.right <= innerWidth - sa.sr + .5);
    }, safe);
    await p.click('#tutorialNext');
    await p.click('#tutorialNext');
    await p.locator('#cmdbar .cd:not(.custom)').first().click();
    await p.waitForFunction(() => tutorialStep === 3);
    await p.locator('#tracker').click();
    await p.waitForFunction(() => win === 'tasks' && tutorialStep === 4);
    await p.click('#tutorialNext');
    await p.locator('#toolbar [data-tool="map"]').click();
    await p.waitForFunction(() => win === 'map' && tutorialStep === 6);
    await p.locator('#win [data-msel]').first().click();
    const mapSelectionWorks = await p.evaluate(() => !!mapSel);
    const noSaveDuringTutorial = await p.evaluate(() => !localStorage.getItem(KEY));
    await p.click('#tutorialSkip');
    await p.waitForFunction(() => mode === 'intro' && introKind === 'day1' && !tutorialActive);
    await p.waitForFunction(() => !document.getElementById('inGo').disabled);
    await p.click('#inGo');
    await p.waitForFunction(() => mode === 'game' && s.started && s.day === 1 && !tutorialActive);
    const doneFlag = await p.evaluate(() => localStorage.getItem(TUTORIAL_KEY) === '1');
    await p.evaluate(() => cmd('home'));
    const savedBeforeReplay = await p.evaluate(() => localStorage.getItem(KEY));
    await p.evaluate(() => cmd('guide'));
    await p.waitForFunction(() => tutorialActive && tutorialReturn === 'title');
    await p.click('#tutorialSkip');
    await p.waitForFunction(() => mode === 'title' && !tutorialActive);
    const replayPreservesSave = await p.evaluate(saved => localStorage.getItem(KEY) === saved, savedBeforeReplay);
    await p.evaluate(() => cmd('guide'));
    await p.waitForFunction(() => tutorialActive && tutorialReturn === 'title');
    const nextStep = async () => {
      const before = await p.evaluate(() => tutorialStep);
      await p.click('#tutorialNext');
      await p.waitForFunction(i => !tutorialActive || tutorialStep === i + 1, before);
    };
    const tapStepTarget = async selector => {
      const before = await p.evaluate(() => tutorialStep);
      const target = p.locator(selector);
      await (selector === '#cmdbar .cd:not(.custom)' ? target.first() : target).click();
      await p.waitForFunction(i => !tutorialActive || tutorialStep === i + 1, before);
    };
    await nextStep(); await nextStep();
    await tapStepTarget('#cmdbar .cd:not(.custom)');
    await tapStepTarget('#tracker');
    await nextStep();
    await tapStepTarget('#toolbar [data-tool="map"]');
    await p.locator('#win [data-msel]').first().click();
    await nextStep();
    await tapStepTarget('#toolbar [data-tool="bag"]');
    await nextStep();
    await tapStepTarget('#toolbar [data-tool="cal"]');
    await nextStep();
    await tapStepTarget('#cmdbar .cd.custom');
    await tapStepTarget('#cmdbar [data-cat="eat"]');
    await nextStep();
    await tapStepTarget('#toolbar [data-tool="sys"]');
    await tapStepTarget('#popMenu [data-sys="rules"]');
    await nextStep(); await nextStep(); await nextStep(); await nextStep();
    await p.waitForFunction(() => mode === 'title' && !tutorialActive);
    const fullTourWorks = await p.evaluate(() => localStorage.getItem(TUTORIAL_KEY) === '1');
    detail = `ngày 0, vùng an toàn, nhiệm vụ/bản đồ tương tác, bản lưu không đổi, bỏ qua → ngày 1; xem lại và hoàn tất đủ bước → trang bìa${cardSafe && mapSelectionWorks && noSaveDuringTutorial && doneFlag && replayPreservesSave && fullTourWorks ? '' : ' · kiểm tra thất bại'}`;
    const ok = cardSafe && mapSelectionWorks && noSaveDuringTutorial && doneFlag && replayPreservesSave && fullTourWorks && !p.errs.length;
    await p.done();
    return { name: 'tour tương tác và bỏ qua', ok, detail: detail + (p.errs.length ? ' · ' + p.errs.join('|') : '') };
  } catch (e) {
    let state = '';
    try { state = JSON.stringify(await p.evaluate(() => ({ mode, tutorialStep, tutorialTitle: document.getElementById('tutorialTitle').textContent, win, menuCat }))); } catch {}
    await p.done();
    return { name: 'tour tương tác và bỏ qua', ok: false, detail: `${detail} · LỖI ${e.message}${state ? ` · trạng thái ${state}` : ''}` };
  }
}

/* ---------- 5. hành vi hộp hội thoại ---------- */
function fakeAudio() {
  window.__snd = [];
  window.GameAudio = { ctx: { state: 'running', resume() {} }, sfx: n => __snd.push(n), play() {}, stop() {}, setNight() {}, setVolume() {}, setMuted() {} };
}
async function dialogChecks(b, w, h) {
  const p = await newPage(b, w, h), R = [];
  await p.evaluate(setupGame); await p.evaluate(fakeAudio); await p.evaluate(() => { s.money = 1000000; render(); });
  const open = async k => { await p.evaluate(k => { hideWin(); __snd.length = 0; Dialog.sample(k); }, k); await p.waitForTimeout(60); };
  const add = (name, ok, detail = '') => R.push({ name, ok: !!ok, detail });
  /* tốc độ chữ 40–50 ký tự/giây; tiếng text tối đa một lần mỗi 3 chữ */
  await open('talk');
  const t0 = await p.evaluate(() => evType.shown); await p.waitForTimeout(1000); const t1 = await p.evaluate(() => evType.shown);
  const cps = t1 - t0; add('tốc độ chữ 40–50 ký tự/giây', cps >= 38 && cps <= 52, cps + '/giây');
  const txt = await p.evaluate(() => __snd.filter(x => x === 'text').length);
  add('tiếng text tối đa một lần mỗi 3 chữ', txt <= Math.ceil(cps / 3), `${txt} lần / ${cps} chữ`);
  /* lựa chọn ẩn khi đang hiện chữ; chạm vào lời thoại thì hiện hết */
  const hidden = await p.evaluate(() => { const c = document.querySelector('[data-chs]'); return c ? getComputedStyle(c).pointerEvents === 'none' : !!document.querySelector('.e-ch.wait'); });
  await p.click('#evSay', { force: true }); await p.waitForTimeout(250);
  const done = await p.evaluate(() => !typingNow() && document.getElementById('evSay').textContent.startsWith('“Chìa khóa'));
  add('lựa chọn ẩn khi đang hiện chữ, chạm thì hiện hết', hidden && done);
  await p.keyboard.press('Escape'); await p.waitForTimeout(80);
  add('Esc đóng talk', await p.evaluate(() => win === null));
  /* choice: focus vào lựa chọn đầu, Esc không đóng, phím 2 chọn */
  await open('choice'); await finishTyping(p); await p.waitForTimeout(250);
  const foc = await p.evaluate(() => document.activeElement && document.activeElement.dataset.ch);
  add('focus vào lựa chọn đầu', foc === '0', 'đang ở ' + foc);
  await p.keyboard.press('Escape'); await p.waitForTimeout(60);
  add('Esc không đóng choice', await p.evaluate(() => win === 'event'));
  await p.keyboard.press('2'); await p.waitForTimeout(80);
  add('phím 2 chọn', await p.evaluate(() => win === null));
  /* role, aria-labelledby và tiếng khi mở */
  for (const k of ['talk', 'msg', 'call', 'alert']) {
    await open(k); await p.waitForTimeout(100);
    const r = await p.evaluate(() => { const w = document.getElementById('win'); return { role: w.getAttribute('role'), lab: !!document.getElementById(w.getAttribute('aria-labelledby') || '-'), snd: __snd.filter(x => x !== 'text' && x !== 'click') }; });
    const wantRole = k === 'alert' ? 'alertdialog' : 'dialog', wantSnd = k === 'alert' ? 'warn' : k === 'talk' ? null : 'message';
    add(`${k}: role="${wantRole}" và aria-labelledby`, r.role === wantRole && r.lab, r.role);
    add(`${k}: tiếng khi mở ${wantSnd || '(không có message)'}`, wantSnd ? r.snd.includes(wantSnd) : !r.snd.includes('message'), r.snd.join(','));
  }
  await open('alert'); await p.keyboard.press('Escape'); await p.waitForTimeout(60);
  add('Esc không đóng alert', await p.evaluate(() => win === 'event'));
  /* think: hiện, không chặn thao tác, tự ẩn sau khoảng 3 giây */
  await p.evaluate(() => hideWin()); await open('think'); await p.waitForTimeout(100);
  const shown = await p.evaluate(() => !!document.getElementById('think') && win === null);
  await p.waitForTimeout(2500); const still = await p.evaluate(() => !!document.getElementById('think'));
  await p.waitForTimeout(1100); const gone = await p.evaluate(() => !document.getElementById('think'));
  add('think hiện không chặn, còn ở 2,6 giây, ẩn trước 3,8 giây', shown && still && gone, `${shown}/${still}/${gone}`);
  R.push(...p.errs.map(e => ({ name: 'lỗi console', ok: false, detail: e })));
  await p.done();
  /* giảm chuyển động: chữ hiện ngay, không hiệu ứng */
  const q = await newPage(b, w, h, { reducedMotion: 'reduce' });
  await q.evaluate(setupGame); await q.evaluate(() => Dialog.sample('msg')); await q.waitForTimeout(50);
  const rm = await q.evaluate(() => { const d = document.querySelector('#win .dd'); return { typing: typingNow(), anim: d ? getComputedStyle(d).animationName : 'none' }; });
  add('reducedMotion: chữ hiện ngay, không hiệu ứng', !rm.typing && rm.anim === 'none', JSON.stringify(rm));
  await q.done();
  return R;
}

/* ---------- 6. bản đồ: bấm giữa từng địa điểm; ngăn kéo bản dọc: kéo 40px vẫn mở, 140px thì đóng ---------- */
async function mapChecks(b, w, h) {
  const p = await newPage(b, w, h), R = [];
  await p.evaluate(setupGame);
  await p.evaluate(() => openWin('map')); await p.waitForTimeout(300);
  const pts = await p.evaluate(() => {
    const cv = document.getElementById('mapCv'), r = cv.getBoundingClientRect(), fit = getComputedStyle(cv).objectFit;
    const k = fit === 'contain' ? Math.min(r.width / 320, r.height / 180) : null;
    return Scenes.map.PLACES.map(pl => {
      const [bx, by, bw, bh] = pl.box, cx = bx + bw / 2, cy = by + bh / 2;
      return k ? { id: pl.id, x: r.left + (r.width - 320 * k) / 2 + cx * k, y: r.top + (r.height - 180 * k) / 2 + cy * k }
        : { id: pl.id, x: r.left + cx * r.width / 320, y: r.top + cy * r.height / 180 };
    });
  });
  const miss = [];
  for (const q of pts) { await p.mouse.click(q.x, q.y); await p.waitForTimeout(40); const sel = await p.evaluate(() => mapSel); if (sel !== q.id) miss.push(`${q.id}→${sel}`); }
  R.push({ name: `bản đồ: bấm đúng ${pts.length} địa điểm`, ok: !miss.length, detail: miss.join(', ') });
  if (w < h) {
    for (const [dy, want] of [[40, 'bag'], [140, null]]) {
      await p.evaluate(() => { hideWin(); openWin('bag'); }); await p.waitForTimeout(300);
      const r = await p.evaluate(() => { const b = document.getElementById('win').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + 8 }; });
      await p.mouse.move(r.x, r.y); await p.mouse.down();
      for (let i = 1; i <= 8; i++) await p.mouse.move(r.x, r.y + dy * i / 8);
      await p.mouse.up(); await p.waitForTimeout(200);
      const got = await p.evaluate(() => win);
      R.push({ name: `ngăn kéo: kéo ${dy}px thì ${want ? 'vẫn mở' : 'đóng'}`, ok: got === want, detail: 'win=' + got });
    }
  }
  R.push(...p.errs.map(e => ({ name: 'lỗi console', ok: false, detail: e })));
  await p.done();
  return R;
}

/* ---------- chạy và in bảng ---------- */
(async () => {
  const { server, port } = await start();
  BASE = `http://127.0.0.1:${port}/`;
  const sizeRes = {}, scen = [];
  for (const eng of ENGINES) {
    const b = await pw[eng].launch();
    for (const [w, h] of SIZES) {
      process.stdout.write(`${eng} ${w}×${h}… `);
      sizeRes[`${w}×${h}`] = sizeRes[`${w}×${h}`] || {};
      sizeRes[`${w}×${h}`][eng] = await sizeChecks(b, eng, w, h);
    }
    process.stdout.write(`\n${eng}: kịch bản… `);
    (await rotateChecks(b)).forEach(r => scen.push({ eng, group: 'Xoay máy 390×844 ↔ 844×390', ...r }));
    { const r = await tapChecks(b); scen.push({ eng, group: 'Số lần bấm (390×844, ≤ 8)', name: 'một ngày thường', ...r }); }
    (await createChecks(b)).forEach(r => scen.push({ eng, group: 'Tạo nhân vật trên máy nhỏ', ...r }));
    for (const [w, h] of [[390, 844], [844, 390], [1280, 720]]) {
      scen.push({ eng, group: 'Hướng dẫn Ngày 0', ...await tutorialChecks(b, w, h) });
    }
    for (const [w, h] of [[390, 844], [844, 390], [1280, 720]]) {
      (await dialogChecks(b, w, h)).forEach(r => scen.push({ eng, group: `Hộp hội thoại ${w}×${h}`, ...r }));
      (await mapChecks(b, w, h)).forEach(r => scen.push({ eng, group: `Bản đồ, ngăn kéo ${w}×${h}`, ...r }));
    }
    console.log('xong');
    await b.close().catch(() => {});
  }
  server.close();

  /* bảng theo kích thước: mỗi ô ghi ✓ hoặc ✗ cho từng máy (c = chromium, w = webkit, f = firefox) */
  const COLS = [['hscroll', 'Cuộn ngang'], ['out', 'Nút trong màn hình'], ['small', 'Nút ≥ 44'], ['font', 'Chữ ≥ 11'], ['long', 'Hộp 400 ký tự'], ['console', 'Console']];
  const fails = [];
  console.log(`\nKết quả theo kích thước (${ENGINES.map(e => e[0] + ' = ' + e).join(', ')}):\n`);
  const head = ['Kích thước'.padEnd(11), ...COLS.map(c => c[1].padEnd(19))].join('│ ');
  console.log(head); console.log('─'.repeat(head.length));
  for (const [size, byEng] of Object.entries(sizeRes)) {
    const cells = COLS.map(([k]) => ENGINES.map(e => {
      const v = byEng[e][k]; if (v.length) fails.push(`${size} ${e} · ${COLS.find(c => c[0] === k)[1]}: ${v.slice(0, 6).join(' | ')}${v.length > 6 ? ` (+${v.length - 6})` : ''}`);
      return e[0] + (v.length ? '✗' : '✓');
    }).join(' ').padEnd(19));
    console.log([size.padEnd(11), ...cells].join('│ '));
  }
  console.log('\nKịch bản:\n');
  const groups = [...new Set(scen.map(r => r.group))];
  for (const g of groups) {
    console.log(g);
    const names = [...new Set(scen.filter(r => r.group === g).map(r => r.name))];
    for (const n of names) {
      const rows = scen.filter(r => r.group === g && r.name === n);
      const mark = rows.map(r => r.eng[0] + (r.ok ? '✓' : '✗')).join(' ');
      const det = rows.filter(r => !r.ok || g.startsWith('Số lần')).map(r => `${r.eng}: ${r.detail}`).join(' · ');
      console.log(`  ${mark.padEnd(10)} ${n}${det ? '  — ' + det : ''}`);
      rows.filter(r => !r.ok).forEach(r => fails.push(`${g} · ${n} · ${r.eng}: ${r.detail}`));
    }
  }
  console.log(`\nẢnh chụp: ${path.relative(process.cwd(), OUT)}/<máy>/<kích thước>/`);
  if (fails.length) { console.log(`\n${fails.length} chỗ chưa đạt:`); fails.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
  console.log('\nTất cả đạt.');
})().catch(e => { console.error(e); process.exit(1); });
