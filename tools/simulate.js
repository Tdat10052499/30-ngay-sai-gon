#!/usr/bin/env node
/*
 * Mô phỏng cân bằng game 30 Ngày Sài Gòn.
 * Chạy logic thật của game (mọi script trong index.html, đúng thứ tự) với một DOM giả, cho ba "bot" chơi trọn 30 ngày:
 *   - random  : chọn bừa mọi thứ
 *   - prudent : đi làm đủ ca, nấu ăn ở nhà, dọn phòng khi bừa, từ chối chi tiêu bốc đồng
 *   - empty   : như prudent nhưng chiều tối ngày 4 dồn hết tiền vào thuốc, mì, cà phê lon để ví trống khi trừ tiền nhà (kiểm tra lỗ hổng bỏ nợ)
 * Dùng:  node tools/simulate.js [--runs 150]
 * Thoát với mã 1 nếu có ván bị kẹt hoặc lỗi runtime (dùng trong CI).
 */
const fs = require('fs');
const path = require('path');

const argRuns = process.argv.indexOf('--runs');
const RUNS = argRuns > -1 ? Number(process.argv[argRuns + 1]) || 150 : 150;

/* ---------- DOM giả: mọi phần tử nhận thuộc tính bất kỳ, mọi hàm là no-op ---------- */
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
      if (k === 'classList') return { add() {}, remove() {}, contains() { return false; } };
      if (k === 'getContext') return () => fakeCtx();
      if (k === 'toDataURL') return () => 'data:,';
      if (k === 'querySelector') return () => null;
      if (k === 'querySelectorAll') return () => [];
      if (['addEventListener', 'appendChild', 'replaceChildren', 'remove', 'focus'].includes(k)) return () => {};
      if (k === 'clientWidth' || k === 'clientHeight') return 300;
      return undefined;
    },
    set(t, k, v) { t[k] = v; return true; },
  });
}
const els = {};
global.document = { getElementById: id => els[id] || (els[id] = fakeEl()), querySelector: () => fakeEl(), querySelectorAll: () => [], createElement: () => fakeEl(), addEventListener() {} };
global.window = { devicePixelRatio: 1 };
global.localStorage = { getItem: () => null, setItem() {} };
global.requestAnimationFrame = () => {};
global.setTimeout = () => 0;
global.clearTimeout = () => {};

const root = path.join(__dirname, '..');
const scripts = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const game = scripts.map(src => fs.readFileSync(path.join(root, src), 'utf8')).join('\n;\n');

/* ---------- Bot (chạy chung phạm vi với game qua eval) ---------- */
const bots = `
;function resolveEvents(prudent){let g=0;while(win==='event'&&g++<50){
  const ok=c=>!(c.cost&&s.money<c.cost)&&!(c.need&&c.need(s));
  let i=-1;
  if(prudent){i=curEvent.choices.findIndex(c=>ok(c)&&(!c.cost||(c.cost<=300000&&s.money>c.cost+600000)||c.l.includes('khám')||c.l.includes('mừng 300')));if(i<0)i=curEvent.choices.findIndex(c=>ok(c)&&!c.cost)}
  if(i<0)i=curEvent.choices.findIndex(ok);
  pickChoice(i<0?curEvent.choices.length-1:i)}
  if(win&&win!=='end')hideWin()}
let PRUDENT=false;
let CLEANS=0;
function act(id){const a=locActs().find(x=>x.id===id);if(a&&!reason(a)){if(id==='clean')CLEANS++;doAction(a);resolveEvents(PRUDENT);return true}return false}
function go(id){if(s.loc!==id&&!LOCS[id].open(s)){travel(id);resolveEvents(PRUDENT)}}
function use(id){if(!itemReason(id))useItem(id)}
function prudentSlot(){
  const wd=!isWE(s.day),sl=s.slot;
  if(s.flags.hired&&s.money<100000){go('store');act('advance')}
  if(sl===0){
    if(wd){go('home');use('nguyenlieu');if(!s.ateThisSlot)use('banhmi');go('school');act('exam')||act('class')||act('idle');return}
    go('market');if(bagCount('nguyenlieu')<3)act('buy_nguyenlieu');go('home');use('nguyenlieu');
    go('store');act('interview')||act('shift')||act('idle');return}
  if(sl===1){
    if(wd){go('school');act('canteen');if(s.study<8||(s.day>=15&&s.day<=21))act('library')||act('campusnap')||act('idle');else act('campusnap')||act('idle')}
    else{if(s.q.q4_gift==='active'&&s.money>500000){go('mall');act('gift')}go('street');act('comtam');act('trada')||act('idle')}
    return}
  if(sl===2){
    if(s.q.q3_khoa==='active'&&(s.day===20||s.day===21)){go('cafe');if(act('khoa'))return}
    go('store');if(act('interview'))return;
    if(s.nl>30&&act('shift'))return;go('park');act('walk')||act('idle');return}
  go('home');use('nguyenlieu');if(!s.ateThisSlot){go('store');act('boxmeal');go('home')}
  if(s.mess>=60&&act('clean'))return;
  if(isWE(s.day)&&s.nl>45){go('store');if(act('shift'))return;go('home')}
  act('sleep')||act('net');
}
function emptySlot(){
  if(s.day===4&&s.slot===2){go('market');for(let i=0;i<8&&s.money>=45000;i++)act('buy_thuoc')}
  if(s.day===4&&s.slot===3){go('store');while(s.money>=60000&&act('buy_mi'));while(s.money>=18000&&act('buy_caphe'));go('home')}
  prudentSlot();
}
function randomSlot(){
  for(const x of bagStacks()){if(!itemReason(x.id)&&Math.random()<0.5)useItem(x.id)}
  if(Math.random()<0.4){const ids=Object.keys(LOCS).filter(id=>id!==s.loc&&!LOCS[id].open(s));if(ids.length)go(ids[Math.floor(Math.random()*ids.length)])}
  const non=locActs().filter(a=>!reason(a)&&a.k!=='act'&&a.id!=='askparents');
  if(non.length&&Math.random()<0.5){doAction(non[Math.floor(Math.random()*non.length)]);resolveEvents(false)}
  const acts=locActs().filter(a=>a.k==='act'&&!reason(a));doAction(acts[Math.floor(Math.random()*acts.length)]);resolveEvents(false);
}
const med=a=>{const b=[...a].sort((x,y)=>x-y);return b[Math.floor(b.length/2)]};
let failures=0;
const summary=[];
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
for(const [name,fn,prudent] of [['Thận trọng',prudentSlot,true],['Ví trống ngày 5',emptySlot,true],['Ngẫu nhiên',randomSlot,false]]){
  PRUDENT=prudent;
  const sc=[],qd=[],pr=[],sh=[],as=[],mo=[],cl=[],tb=[],rate={},gr={S:0,A:0,B:0,C:0,D:0};let stuck=0,short=0;
  for(let r=0;r<${RUNS};r++){
    cmd('new');resolveEvents(prudent);let g=0;CLEANS=0;
    while(!s.over&&g++<3000){const d=s.day,sl=s.slot;fn();resolveEvents(prudent);if(!s.over&&s.day===d&&s.slot===sl){act('idle')||act('sleep');resolveEvents(prudent)}}
    if(!s.over){stuck++;continue}
    const R=computeScore();sc.push(R.score);gr[grade(R.score)]++;pr.push(studyScore());sh.push(s.shifts);as.push(R.asset);mo.push(s.money);cl.push(CLEANS);tb.push(s.sumTt/Math.max(1,s.samples));if(s.flags.rentShort)short++;
    const done=QUESTS.filter(q=>s.q[q.id]==='done');qd.push(done.length);done.forEach(q=>rate[q.id]=(rate[q.id]||0)+1);
    endHTML();tasksHTML();calHTML();bagHTML();mapHTML();renderTracker();
  }
  failures+=stuck;
  const pct=n=>Math.round(n/Math.max(1,sc.length)*100)+'%';
  summary.push({'Kiểu chơi':name,'Số ván':${RUNS},'Bị kẹt':stuck,'Điểm (trung vị)':med(sc),'Hạng S/A/B/C/D':['S','A','B','C','D'].map(k=>pct(gr[k])).join(' '),'Nhiệm vụ (TB)':avg(qd).toFixed(1)+'/'+QUESTS.length,'Điểm học tập (trung vị)':med(pr),'Ca part-time':med(sh),'Tiền mặt cuối':med(mo),'Tài sản cuối tháng':med(as),'Tinh thần TB':Math.round(avg(tb)),'Lần dọn phòng':med(cl),'Thiếu tiền nhà':pct(short)});
  console.log('\\nTỉ lệ hoàn thành từng nhiệm vụ · '+name);
  console.table(Object.fromEntries(QUESTS.map(q=>[q.id+' · '+q.t,Math.round((rate[q.id]||0)/${RUNS}*100)+'%'])));
}
console.log('\\nTổng hợp');
console.table(summary);
globalThis.__failures=failures;
`;

try {
  eval(game.replace(/\nboot\(\{\}\);\s*$/, '\n') + bots);
} catch (e) {
  console.error('Lỗi khi chạy mô phỏng:\n', e.stack);
  process.exit(1);
}
if (globalThis.__failures) { console.error(`Có ${globalThis.__failures} ván bị kẹt.`); process.exit(1); }
console.log('\nMô phỏng hoàn tất, không có ván nào bị kẹt.');
