/*
 * Môi trường chạy game trong Node cho tools/simulate.js và tools/test.js.
 * Dựng một DOM giả (mọi phần tử nhận thuộc tính bất kỳ, mọi hàm là no-op) rồi trả về mã nguồn của mọi script
 * trong index.html theo đúng thứ tự, bỏ src/audio.js (âm thanh không chạy trong Node) và lệnh boot cuối game.js.
 * Nơi gọi tự eval mã này cùng mã của mình để dùng chung phạm vi với biến của game (s, win, queue...).
 */
const fs = require('fs');
const path = require('path');

/* Ngữ cảnh canvas giả: mọi lệnh vẽ là no-op, getImageData trả mảng điểm ảnh trống để mã viền (outlined) chạy được */
function fakeCtx() {
  return new Proxy({}, {
    get: (a, b) => (b === 'globalAlpha' ? 1 : b === 'getImageData' ? (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }) : () => {}),
    set: () => true,
  });
}
function fakeEl() {
  const store = { hidden: false, innerHTML: '', textContent: '', className: '', dataset: {}, style: {} };
  return new Proxy(store, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === 'classList') return { add() {}, remove() {}, contains() { return false; }, toggle() {} };
      if (k === 'getContext') return () => fakeCtx();
      if (k === 'toDataURL') return () => 'data:,';
      if (k === 'querySelector') return () => null;
      if (k === 'querySelectorAll') return () => [];
      if (['addEventListener', 'appendChild', 'replaceChildren', 'remove', 'focus', 'insertAdjacentHTML', 'setAttribute'].includes(k)) return () => {};
      if (k === 'clientWidth' || k === 'clientHeight') return 300;
      return undefined;
    },
    set(t, k, v) { t[k] = v; return true; },
  });
}

function setupFakeDom() {
  const els = {};
  global.document = { getElementById: id => els[id] || (els[id] = fakeEl()), querySelector: () => fakeEl(), querySelectorAll: () => [], createElement: () => fakeEl(), addEventListener() {} };
  global.window = { devicePixelRatio: 1 };
  global.localStorage = { getItem: () => null, setItem() {} };
  global.requestAnimationFrame = () => {};
  global.setTimeout = () => 0;
  global.clearTimeout = () => {};
  global.setInterval = () => 0;
  global.clearInterval = () => {};
}

function gameSource() {
  const root = path.join(__dirname, '..');
  const scripts = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"><\/script>/g)]
    .map(m => m[1]).filter(src => src !== 'src/audio.js');
  return scripts.map(src => fs.readFileSync(path.join(root, src), 'utf8')).join('\n;\n').replace(/\nboot\(\{\}\);\s*$/, '\n');
}

module.exports = { setupFakeDom, gameSource };
