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

/* ---------- B3: ngày 8–12 lên lớp qua đúng luồng giao diện (bản đồ → dòng "Lên lớp" → cảnh giảng đường) ---------- */
function attend(){clearEvents();travel('school');clearEvents();const a=locActs().find(x=>x.id==='class');return !!a&&!reason(a)&&doAction(a)}
function restOfDay(){const d=s.day;let g=0;while(s.day===d&&!s.over&&g++<12){clearEvents();if(s.day!==d)break;doAction(locActs().find(x=>x.id==='idle'));clearEvents()}}
function week2(plan){
  withRandom(0.99,()=>{fresh();while(s.day<8)restOfDay();s.money+=500000;s.absences=0});
  const rows=[];
  withRandom(0.99,()=>{for(let d=8;d<=12;d++){const how=plan[d]||'attend';let ok=false,scene=null;
    if(how==='attend'){ok=attend();scene=actScene&&actScene.name}
    if(how==='sick'){clearEvents();s.money+=300000;queue.unshift(ev('Bị ốm','Sáng dậy đầu nặng, người nóng hầm hập. Sức khỏe đang yếu.',[{l:'Đi khám phòng khám',cost:200000,eff:{sk:25,nl:5},x:'Hết buổi sáng · có giấy xin nghỉ học',run:()=>skipSlot('Nghỉ học có phép vì ốm')}]));processQueue();finishType();pickChoice(0)}
    if(how==='skip'){clearEvents();doAction(locActs().find(x=>x.id==='idle'))}
    rows.push({d,day:s.day,ok,scene,classToday:s.classToday,cls:s.classCh[2],absences:s.absences,q:s.q.q2_class});
    restOfDay()}});
  return {rows,q:s.q.q2_class,absences:s.absences,fail:s.log.find(l=>l.text.startsWith('Nhiệm vụ thất bại: Không bỏ buổi học nào')),lbl:questProg(QBY.q2_class).lbl};
}
let w=week2({});
w.rows.forEach(x=>check(\`B3 ngày \${x.d}: lên lớp được tính có mặt (cảnh \${x.scene})\`,x.day===x.d&&x.ok&&x.scene==='hall'&&x.classToday===1&&x.cls===x.d-7&&x.absences===0,JSON.stringify(x)));
check('B3 đủ 5 buổi ngày 8–12: nhiệm vụ Không bỏ buổi học nào hoàn thành',w.q==='done'&&w.absences===0&&!w.fail,JSON.stringify({q:w.q,absences:w.absences}));
w=week2({9:'skip'});
check('B3 vắng ngày 9: thất bại và thông báo ghi rõ ngày vắng',w.q==='fail'&&w.fail&&w.fail.text==='Nhiệm vụ thất bại: Không bỏ buổi học nào (vắng ngày 9)'&&w.absences===1,w.fail&&w.fail.text);
check('B3 tiến độ trong cửa sổ Nhiệm vụ hiện vắng ngày 9',w.lbl==='4/5 buổi · vắng ngày 9',w.lbl);
w=week2({10:'sick'});
check('B3 nghỉ có phép vì ốm ngày 10: không trừ điểm vắng nhưng thông báo ghi rõ ngày',w.q==='fail'&&w.absences===0&&w.fail&&w.fail.text.endsWith('(vắng ngày 10)'),JSON.stringify({q:w.q,absences:w.absences,fail:w.fail&&w.fail.text,rows:w.rows}));

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
