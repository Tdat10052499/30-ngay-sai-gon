#!/usr/bin/env node
/*
 * Mô phỏng cân bằng game 30 Ngày Sài Gòn.
 * Chạy logic thật trong src/game.js với một DOM giả, cho hai "bot" chơi trọn 30 ngày:
 *   - random  : chọn bừa mọi thứ
 *   - prudent : đi làm đủ ca, nấu ăn ở nhà, từ chối chi tiêu bốc đồng
 * Dùng:  node tools/simulate.js [--runs 150]
 * Thoát với mã 1 nếu có ván bị kẹt hoặc lỗi runtime (dùng trong CI).
 */
const fs = require('fs');
const path = require('path');

const argRuns = process.argv.indexOf('--runs');
const RUNS = argRuns > -1 ? Number(process.argv[argRuns + 1]) || 150 : 150;

/* ---------- DOM giả: mọi phần tử nhận thuộc tính bất kỳ, mọi hàm là no-op ---------- */
function fakeEl() {
  const store = { hidden: false, innerHTML: '', textContent: '', className: '', dataset: {}, style: {} };
  return new Proxy(store, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === 'classList') return { add() {}, remove() {}, contains() { return false; } };
      if (k === 'getContext') return () => new Proxy({}, { get: (a, b) => (b === 'globalAlpha' ? 1 : () => {}), set: () => true });
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

const game = fs.readFileSync(path.join(__dirname, '..', 'src', 'game.js'), 'utf8');

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
function act(id){const a=locActs().find(x=>x.id===id);if(a&&!reason(a)){doAction(a);resolveEvents(PRUDENT);return true}return false}
function go(id){if(s.loc!==id&&!LOCS[id].open(s)){travel(id);resolveEvents(PRUDENT)}}
function use(id){if(!itemReason(id))useItem(id)}
function prudentSlot(){
  const wd=!isWE(s.day),sl=s.slot;
  if(wd&&s.money<120000){go('office');act('advance')}
  if(wd&&(sl===0||sl===2)){if(sl===0){go('home');use('nguyenlieu');if(!s.ateThisSlot)use('banhmi')}
    go('office');if(!s.ateThisSlot)use('mi');act('work')||act('idle');return}
  if(sl===1){if(wd){go('office');act('canteen');act('desknap')||act('idle')}else{
      if(s.day>=15&&s.day<=21&&s.money>1500000&&s.savings<1e6){go('bank');act('dep')}
      if(s.q.q4_mom==='active'&&s.money>800000){go('bank');act('sendmom')}
      go('market');if(bagCount('nguyenlieu')<3)act('buy_nguyenlieu');go('street');act('comtam');act('trada')||act('idle')}return}
  if(sl===2){if(s.q.q3_khoa==='active'&&(s.day===20||s.day===21)){go('cafe');if(act('khoa'))return}
    go('park');act('walk')||act('idle');return}
  if(sl===0){go('market');if(bagCount('nguyenlieu')<3)act('buy_nguyenlieu');go('home');use('nguyenlieu');go('park');act('run')||act('idle');return}
  go('home');use('nguyenlieu');if(!s.ateThisSlot){go('street');act('comtam');go('home')}
  act('net');
}
function randomSlot(){
  for(const x of bagStacks()){if(!itemReason(x.id)&&Math.random()<0.5)useItem(x.id)}
  if(Math.random()<0.4){const ids=Object.keys(LOCS).filter(id=>id!==s.loc&&!LOCS[id].open(s));if(ids.length)go(ids[Math.floor(Math.random()*ids.length)])}
  const non=locActs().filter(a=>!reason(a)&&a.k!=='act'&&a.id!=='loan'&&a.id!=='dep');
  if(non.length&&Math.random()<0.5){doAction(non[Math.floor(Math.random()*non.length)]);resolveEvents(false)}
  const acts=locActs().filter(a=>a.k==='act'&&!reason(a));doAction(acts[Math.floor(Math.random()*acts.length)]);resolveEvents(false);
}
const med=a=>{const b=[...a].sort((x,y)=>x-y);return b[Math.floor(b.length/2)]};
let failures=0;
const summary=[];
for(const [name,fn,prudent] of [['Thận trọng',prudentSlot,true],['Ngẫu nhiên',randomSlot,false]]){
  PRUDENT=prudent;
  const sc=[],qd=[],pr=[],rate={};let stuck=0;
  for(let r=0;r<${RUNS};r++){
    cmd('new');resolveEvents(prudent);let g=0;
    while(!s.over&&g++<3000){const d=s.day,sl=s.slot;fn();resolveEvents(prudent);if(!s.over&&s.day===d&&s.slot===sl){act('idle')||act('sleep');resolveEvents(prudent)}}
    if(!s.over){stuck++;continue}
    sc.push(computeScore().score);pr.push(probation());
    const done=QUESTS.filter(q=>s.q[q.id]==='done');qd.push(done.length);done.forEach(q=>rate[q.id]=(rate[q.id]||0)+1);
    endHTML();tasksHTML();calHTML();bagHTML();mapHTML();renderTracker();
  }
  failures+=stuck;
  summary.push({'Kiểu chơi':name,'Số ván':${RUNS},'Bị kẹt':stuck,'Điểm (trung vị)':med(sc),'Nhiệm vụ (trung vị)':med(qd)+'/'+QUESTS.length,'Điểm thử việc (trung vị)':med(pr)});
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
