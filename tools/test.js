#!/usr/bin/env node
/*
 * Test cố định cho các lỗi đã sửa ở v0.3.0. Chạy logic thật của game trong Node (tools/harness.js).
 * Dùng:  node tools/test.js   (npm test gọi tự động). Thoát với mã 1 nếu có test hỏng.
 */
const { setupFakeDom, gameSource } = require('./harness');
setupFakeDom();
const game = gameSource();

const tests = `
;const RESULTS=[];
function check(name,ok,detail){RESULTS.push({name,ok:!!ok,detail:detail||''})}
const realRandom=Math.random;
function withRandom(v,fn){Math.random=()=>v;try{return fn()}finally{Math.random=realRandom}}
function fresh(){newGame({name:'Lan',gender:'nu'});clearEvents();}
function clearEvents(){let g=0;while(win==='event'&&g++<50){finishType();const i=curEvent.choices.findIndex(c=>!(c.cost&&s.money<c.cost)&&!(c.need&&c.need(s)));pickChoice(i<0?0:i)}hideWin();queue=[]}
const poolIds=()=>EVENTS.filter(e=>!(e.once&&s.flags[e.id])&&e.when(s)).map(e=>e.id);

/* ---------- B1: mưa chỉ khi đi lại hoặc ở công viên; sự kiện mới trong nhà ---------- */
fresh();
for(const loc of ['home','street','market','cafe','school','store','mall']){for(const sl of [0,1,2,3]){s.loc=loc;s.slot=sl;
  if(poolIds().includes('rain'))check('B1 không mưa khi ngồi ở '+loc+' buổi '+sl,false)}}
check('B1 không có mưa ở nơi khác công viên',!RESULTS.some(r=>!r.ok&&r.name.startsWith('B1 không mưa')));
s.loc='park';s.slot=1;check('B1 công viên buổi trưa có thể mưa',poolIds().includes('rain'));
s.slot=3;check('B1 công viên buổi tối không mưa',!poolIds().includes('rain'));
s.loc='cafe';s.slot=1;check('B1 quán cà phê buổi trưa có sự kiện Quán hết chỗ',poolIds().includes('cafeFull'));
s.slot=0;check('B1 quán cà phê buổi sáng không có Quán hết chỗ',!poolIds().includes('cafeFull'));
s.loc='mall';s.slot=2;check('B1 TTTM buổi chiều có sự kiện Mời làm thẻ thành viên',poolIds().includes('mallCard'));
// đi lại: 15%, chỉ trưa hoặc chiều, tối đa 1 lần mỗi ngày
fresh();s.slot=1;s.loc='home';
withRandom(0.1,()=>travel('street'));check('B1 đi lại buổi trưa có thể gặp mưa',win==='event'&&curEvent.title==='Mưa to bất chợt');
clearEvents();withRandom(0.1,()=>travel('park'));check('B1 mưa khi đi lại tối đa 1 lần mỗi ngày',!(win==='event'&&curEvent.title==='Mưa to bất chợt'));
clearEvents();s.slot=0;s.flags={...s.flags,rain1:0};withRandom(0.1,()=>travel('street'));check('B1 đi lại buổi sáng không mưa',!(win==='event'&&curEvent.title==='Mưa to bất chợt'));
clearEvents();s.slot=2;s.flags.rain1=0;withRandom(0.2,()=>travel('home'));check('B1 xác suất mưa khi đi lại là 15%',!(win==='event'&&curEvent.title==='Mưa to bất chợt'));

/* ---------- B2: bụng đói khi đi ngủ xét theo độ no lúc chọn hành động cuối ngày (dưới 30) ---------- */
function bedtime(no,actId){
  fresh();s.day=2;s.slot=3;s.loc='home';s.mess=0;s.no=no;s.nl=40;s.tt=60;s.sk=80;
  const before={nl:s.nl,tt:s.tt,sk:s.sk},n0=s.log.length;
  withRandom(0.99,()=>doAction(A.home.concat(A.store).find(a=>a.id===actId)));
  const hungry=s.log.slice(0,s.log.length-n0).some(l=>l.text==='Đi ngủ với cái bụng đói, ngủ không ngon.');
  return {hungry,day:s.day,no:s.no,dnl:s.nl-before.nl};
}
let r=bedtime(31,'sleep');check('B2 độ no 31 lúc đi ngủ: không bị phạt',!r.hungry&&r.day===3,JSON.stringify(r));
r=bedtime(29,'sleep');check('B2 độ no 29 lúc đi ngủ: bị phạt',r.hungry&&r.day===3,JSON.stringify(r));
r=bedtime(30,'sleep');check('B2 độ no đúng 30: không bị phạt',!r.hungry,JSON.stringify(r));
r=bedtime(31,'sleep');check('B2 trừ độ no qua đêm vẫn giữ (31 − 9 buổi − 10 đêm)',r.no===12,'độ no sáng hôm sau '+r.no);
r=bedtime(35,'net');check('B2 hành động bất kỳ buổi tối (lướt mạng) xét theo độ no lúc chọn',!r.hungry,JSON.stringify(r));
fresh();s.flags.hired=1;s.day=2;s.slot=3;s.loc='store';s.no=32;s.nl=60;const n0=s.log.length;withRandom(0.99,()=>doAction(A.store.find(a=>a.id==='shift')));
check('B2 làm ca tối (độ no −4) vẫn xét theo độ no 32 lúc chọn',!s.log.slice(0,s.log.length-n0).some(l=>l.text.startsWith('Đi ngủ với cái bụng đói')));
fresh();s.slot=3;s.no=29;const sl=A.home.find(a=>a.id==='sleep');
check('B2 dòng Đi ngủ sớm ghi chú khi bụng đói',sl.note(s).includes('Bụng đói: ngủ sẽ mệt và buồn hơn'));
s.no=40;check('B2 không ghi chú khi no',!sl.note(s).includes('Bụng đói'));

const fails=RESULTS.filter(r=>!r.ok);
RESULTS.forEach(r=>console.log((r.ok?'  đạt   ':'  HỎNG  ')+r.name+(r.detail?' · '+r.detail:'')));
console.log(fails.length?'\\n'+fails.length+' test hỏng.':'\\nTất cả '+RESULTS.length+' test đạt.');
globalThis.__testFails=fails.length;
`;

try {
  eval(game + tests);
} catch (e) {
  console.error('Lỗi khi chạy test:\n', e.stack);
  process.exit(1);
}
if (globalThis.__testFails) process.exit(1);
