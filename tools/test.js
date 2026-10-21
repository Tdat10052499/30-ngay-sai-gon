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
/* test lỗi cũ chạy ở độ khó Dễ (số v0.2.0) để chỉ kiểm đúng phần đã sửa; luật mới có test riêng ở cuối */
function fresh(diff='de'){newGame({name:'Lan',gender:'nu'});s.diff=diff;clearEvents();}
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
  const hungry=s.log.slice(0,s.log.length-n0).some(l=>l.text.startsWith('Đi ngủ với cái bụng đói, ngủ không ngon.'));
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
function restOfDay(){const d=s.day;let g=0;while(s.day===d&&!s.over&&g++<12){clearEvents();if(s.day!==d)break;doAction(locActs().find(x=>x.id==='idle'));clearEvents()}
  s.no=s.nl=s.tt=s.sk=80}  // giữ chỉ số ổn định để kịch bản chỉ kiểm việc đếm buổi học
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

/* ---------- Bản thử 2 · luật theo độ khó (mục 4.1, 4.3, 4.4) ---------- */
function idleAt(day,diff,setup){fresh(diff);s.day=day;s.slot=1;s.loc='park';s.no=80;s.nl=80;s.tt=80;s.sk=80;if(setup)setup();
  const b={no:s.no,nl:s.nl,tt:s.tt,sk:s.sk},n0=s.log.length;withRandom(0.99,()=>doAction(locActs().find(x=>x.id==='idle')));
  return {d:{no:s.no-b.no,nl:s.nl-b.nl,tt:s.tt-b.tt,sk:s.sk-b.sk},log:s.log.slice(0,s.log.length-n0).map(l=>l.text).join(' | ')}}
// ngồi nghỉ: năng lượng +3, tinh thần −1, rồi hao hụt cuối buổi
for(const [day,no] of [[1,-11],[8,-12],[15,-13],[22,-13]]){const r=idleAt(day,'thuong');check(\`T hao hụt cuối buổi ngày \${day} (Thường, hệ số chương): no \${no}\`,r.d.no===no,JSON.stringify(r.d))}
let r2=idleAt(22,'de');check('T hao hụt ở Dễ không tăng theo chương: no −9, tinh thần −3, năng lượng −1',r2.d.no===-9&&r2.d.tt===-3&&r2.d.nl===-1,JSON.stringify(r2.d));
r2=idleAt(1,'thuong',()=>{s.no=30});check('T đói (no dưới 25): ghi "Đói: tinh thần −6, sức khỏe −3"',r2.log.includes('Đói: tinh thần −6, sức khỏe −3')&&r2.d.sk===-3,r2.log);
r2=idleAt(1,'de',()=>{s.no=30});check('T đói ở Dễ: tinh thần −4, sức khỏe −2',r2.log.includes('Đói: tinh thần −4, sức khỏe −2'),r2.log);
r2=idleAt(1,'thuong',()=>{s.no=5});check('T đói lả (no về 0): ghi "Đói lả: sức khỏe −8, năng lượng −5"',r2.log.includes('Đói lả: năng lượng −5, sức khỏe −8'),r2.log);
r2=idleAt(1,'thuong',()=>{s.nl=8});check('T kiệt sức: ghi "Kiệt sức: tinh thần −4, sức khỏe −3"',r2.log.includes('Kiệt sức: tinh thần −4, sức khỏe −3'),r2.log);
fresh('thuong');s.slot=2;s.tt=20;s.nl=80;check('T tinh thần thấp: lương ca −30.000đ (Thường)',shiftPay(s)===60000,shiftPay(s));
s.diff='de';check('T tinh thần thấp: lương ca −20.000đ (Dễ)',shiftPay(s)===70000,shiftPay(s));
fresh('thuong');s.day=2;s.slot=3;s.no=29;s.nl=40;let n1=s.log.length;withRandom(0.99,()=>doAction(A.home.find(a=>a.id==='sleep')));
check('T đi ngủ đói (Thường): năng lượng chỉ hồi 30, tinh thần −8, sức khỏe −4',s.log.slice(0,s.log.length-n1).some(l=>l.text.endsWith('Năng lượng chỉ hồi 30, tinh thần −8, sức khỏe −4.')));
// ốm theo sức khỏe
const sc=(diff,sk,f)=>{fresh(diff);s.day=5;s.sk=sk;Object.assign(s.flags,f||{});return +sickChance(s).toFixed(3)};
check('T xác suất ốm (Thường): 2% khi sức khỏe 100',sc('thuong',100)===0.02,sc('thuong',100));
check('T xác suất ốm (Thường): 23,5% khi 70',sc('thuong',70)===0.235,sc('thuong',70));
check('T xác suất ốm (Thường): 45% khi 40 và khi 20',sc('thuong',40)===0.45&&sc('thuong',20)===0.45);
check('T đội mưa hôm trước: thêm 25%',sc('thuong',100,{rainSickDay:4})===0.27,sc('thuong',100,{rainSickDay:4}));
check('T "Kệ, ráng chịu" hôm trước: ít nhất 50%',sc('thuong',100,{relapseDay:5})===0.5);
check('T xác suất ốm (Dễ): 0 khi sức khỏe 70, 45% khi dưới 40',sc('de',70)===0&&sc('de',30)===0.45);
// thiếu tiền hóa đơn
fresh('thuong');check('T thiếu 49.000đ: tinh thần −12',billPenalty(s,49000)===12);
check('T thiếu 220.000đ: tinh thần −16',billPenalty(s,220000)===16);
check('T thiếu 1.200.000đ: tối đa −30',billPenalty(s,1200000)===30);
s.diff='de';check('T thiếu tiền ở Dễ: luôn −12',billPenalty(s,1200000)===12);
fresh('thuong');s.day=4;s.money=100000;queue=[];withRandom(0.99,()=>{s.day=5;dayEvents()});
check('T thiếu tiền nhà ngày 5: nhiệm vụ Tiền nhà cho cô Tư thất bại ngay',s.q.q1_rent==='fail');
// nhiệm vụ thất bại
fresh('thuong');s.tt=60;failQuest(QBY.q1_job);check('T nhiệm vụ thất bại (Thường): tinh thần −5',s.tt===55,s.tt);
fresh('de');s.tt=60;failQuest(QBY.q1_job);check('T nhiệm vụ thất bại (Dễ): không trừ thêm',s.tt===60,s.tt);
// ngất xỉu: nghỉ cả sáng hôm sau, có giấy nên không tính vắng
fresh('thuong');s.day=8;s.slot=1;s.sk=0;s.money=2000000;queue=[];const ab0=s.absences;
withRandom(0.99,()=>{slotEvents();processQueue();clearEvents()});
check('T ngất xỉu (Thường): sáng hôm sau nghỉ, có giấy, không tính vắng',s.day===9&&s.slot===1&&s.absences===ab0&&s.absentDays.includes(9),JSON.stringify({day:s.day,slot:s.slot,abs:s.absences,absentDays:s.absentDays}));
// vắng học
fresh('thuong');s.classes=15;s.absences=2;const st1=studyScore();s.diff='de';const st2=studyScore();check('T vắng học: trừ 4 điểm mỗi buổi (Thường), 2 (Dễ)',st2-st1===4,st1+' / '+st2);
fresh('thuong');withRandom(0.99,()=>{for(const d of [8,9,10]){s.day=d;s.slot=0;s.loc='home';queue=[];hideWin();doAction(locActs().find(x=>x.id==='idle'))}});
check('T vắng 3 buổi trong tuần: thầy Hải nhắc nhở một lần',queue.concat(curEvent?[curEvent]:[]).filter(e=>e.title==='Thầy Hải nhắc nhở').length===1&&s.flags.truant2===1);
// ca trưa
fresh('thuong');s.flags.hired=1;s.day=3;s.slot=1;s.loc='store';s.nl=80;const sh=A.store.find(a=>a.id==='shift');
check('T ca trưa ngày thường: làm được, lương 90.000đ, năng lượng −30',!canShift(s)&&shiftPay(s)===90000&&shiftEff(s).nl===-30&&shiftEff(s).tt===-3&&shiftEff(s).no===-4);
s.day=6;check('T ca trưa cuối tuần: làm được',!canShift(s));
s.day=3;s.slot=0;check('T sáng ngày thường vẫn là giờ học',!!canShift(s));
// công thức điểm
fresh('thuong');s.classes=10;const R1=computeScore(),F=R1.F;
check('T công thức điểm có học tập: 1000 × T^0,30 × N^0,15 × M^0,20 × S^0,15 × H^0,20',R1.score===Math.round(1000*F.tien**0.3*F.no**0.15*F.tt**0.2*F.sk**0.15*F.hoc**0.2)&&F.hoc===Math.max(0.05,studyScore()/100),JSON.stringify(F));
s.classes=0;s.absences=30;check('T học tập tối thiểu 0,05',computeScore().F.hoc===0.05);

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
