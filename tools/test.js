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
MG.off=true; // test cũ không mở minigame; test minigame bật riêng
function fresh(diff='de'){newGame({name:'Lan',gender:'nu'});s.diff=diff;clearEvents();}
function clearEvents(){let g=0;while(win==='event'&&g++<50){finishType();const i=curEvent.choices.findIndex(c=>!(c.cost&&s.money<c.cost)&&!(c.need&&c.need(s)));pickChoice(i<0?0:i)}hideWin();queue=[]}
const poolIds=()=>DECK.filter(e=>deckOk(s,e,true)).map(e=>e.id);

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
// đi lại: 8%, chỉ trưa hoặc chiều, theo giới hạn bộ bài (1 sự kiện mỗi ngày, tối đa 2 lần, cách 5 ngày)
const isRain=()=>win==='event'&&curEvent.title==='Mưa to bất chợt';
fresh();s.slot=1;s.loc='home';
withRandom(0.05,()=>travel('street'));check('B1 đi lại buổi trưa có thể gặp mưa',isRain());
clearEvents();withRandom(0.05,()=>travel('park'));check('B1 mưa khi đi lại tối đa 1 lần mỗi ngày',!isRain());
clearEvents();s.slot=0;s.evUse={};s.evDay=0;withRandom(0.05,()=>travel('street'));check('B1 đi lại buổi sáng không mưa',!isRain());
clearEvents();s.slot=2;s.evUse={};s.evDay=0;withRandom(0.1,()=>travel('home'));check('B1 xác suất mưa khi đi lại là 8%',!isRain());
clearEvents();s.evUse={rain:{n:1,last:1}};s.evDay=0;s.day=4;withRandom(0.05,()=>travel('street'));check('B1 mưa cách nhau ít nhất 5 ngày',!isRain());
clearEvents();s.evUse={rain:{n:2,last:1}};s.day=20;withRandom(0.05,()=>travel('street'));check('B1 mưa tối đa 2 lần mỗi tháng',!isRain());

/* ---------- bộ bài sự kiện ---------- */
fresh('thuong');s.day=3;s.slot=3;s.loc='home';
let cnt=0;for(let i=0;i<40;i++){s.evDay=0;s.evLast=null;const e=deckDraw(s,()=>0.01);if(e&&e.id==='lau')cnt++}
check('Bài: Lớp rủ đi lẩu tối đa 3 lần',(s.evUse.lau||{}).n<=3&&cnt<=3,cnt);
fresh('thuong');s.day=3;s.slot=3;s.loc='home';s.evDay=3;check('Bài: mỗi ngày tối đa 1 sự kiện ngẫu nhiên',deckDraw(s,()=>0.5)===null);
fresh('thuong');s.day=4;s.slot=3;s.loc='home';s.evLast={day:3,loai:'ban'};
check('Bài: không ra cùng loại hai ngày liên tiếp',DECK.filter(e=>deckOk(s,e)).every(e=>e.loai!=='ban'));
fresh('thuong');s.day=15;check('Bài: ngày 14–19 bạn bè ×2',deckWeight(s,DECK_BY.lau)===6&&deckWeight(s,DECK_BY.phone)===1);
fresh('thuong');s.day=3;s.slot=2;s.loc='store';s.lastAct='shift';check('Bài: Khách để quên điện thoại chỉ ra khi đang làm ca',poolIds().includes('lostitem'));
s.lastAct='idle';check('Bài: không làm ca thì không có Khách để quên điện thoại',!poolIds().includes('lostitem'));
// sự kiện mới chạy được (chọn lựa chọn đầu, đủ tiền)
for(const e of DECK){fresh('thuong');s.money=2000000;s.day=12;s.slot=3;s.loc='home';let ok=true;
  try{queue=[];queue.push(e.mk(s));processQueue();clearEvents()}catch(err){ok=false}
  check('Bài: sự kiện '+e.id+' chạy được',ok)}
fresh('thuong');const nm0=bagCount('mi');bagAddFit('mi',3);
check('Bài: thùng đồ quê thêm đồ vào túi',bagCount('mi')===nm0+3&&bagStacks().length<=12);
fresh('thuong');s.day=5;s.slot=1;s.flags.noLibUntil=6;check('Bài: mượn sạc thì khóa thư viện',!!A.school.find(a=>a.id==='library').when(s));
// Ngân và sinh nhật mẹ
fresh('thuong');s.day=11;s.slot=2;s.money=500000;queue=[];withRandom(0.99,()=>slotEvents());
check('Ngân rủ đi cà phê chiều ngày 11',queue.some(e=>e.title==='Ngân nhắn tin'));
processQueue();pickChoice(0);check('Đi cà phê với Ngân: −30.000đ, đến quán, đếm lời mời',s.money===470000&&s.nganCount===1);
fresh('thuong');s.day=30;s.slot=1;s.money=500000;queue=[];withRandom(0.99,()=>slotEvents());
check('Ngày 30 mẹ lên Sài Gòn',queue.some(e=>e.title==='Mẹ lên Sài Gòn'));
processQueue();pickChoice(0);check('Ăn mừng ở TTTM: −300.000đ',s.money===200000&&s.flags.momParty===1);

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
for(const [day,no] of [[1,-9],[8,-9],[15,-9],[22,-10]]){const r=idleAt(day,'thuong');check(\`T hao hụt cuối buổi ngày \${day} (Thường, hệ số chương): no \${no}\`,r.d.no===no,JSON.stringify(r.d))}
let r2=idleAt(22,'de');check('T hao hụt ở Dễ không tăng theo chương: no −9, tinh thần −3, năng lượng −1',r2.d.no===-9&&r2.d.tt===-3&&r2.d.nl===-1,JSON.stringify(r2.d));
r2=idleAt(1,'thuong',()=>{s.no=30});check('T đói (no dưới 25): ghi "Đói: tinh thần −5, sức khỏe −2"',r2.log.includes('Đói: tinh thần −5, sức khỏe −2')&&r2.d.sk===-2,r2.log);
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
check('T xác suất ốm (Thường): 16% khi 70',Math.abs(sc('thuong',70)-0.16)<1e-9,sc('thuong',70));
check('T xác suất ốm (Thường): 30% khi 40, 45% khi dưới 40',Math.abs(sc('thuong',40)-0.3)<1e-9&&sc('thuong',20)===0.45);
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

/* ---------- chế độ ăn tự động (src/cards.js) ---------- */
const meal=(diet,loc,slot,bag,no=40)=>{fresh('thuong');s.diet=diet;s.loc=loc;s.slot=slot;s.no=no;s.bag=bag.map(id=>({id,exp:ITEMS[id].shelf?s.day+ITEMS[id].shelf-1:null}));return JSON.stringify(autoMeal(s))};
check('Ăn: Bình dân ở phòng trọ, túi trống: đặt đồ ăn',meal('binhdan','home',3,[])==='{"act":"ship"}');
check('Ăn: Bình dân ở phòng trọ, chỉ có mì: ăn mì',meal('binhdan','home',3,['mi'])==='{"item":"mi"}');
check('Ăn: Bình dân ở phòng trọ: ưu tiên đồ khác mì',meal('binhdan','home',3,['mi','banhmi'])==='{"item":"banhmi"}');
check('Ăn: Tự nấu ở phòng trọ có nguyên liệu: nấu',meal('tunau','home',3,['banhmi','nguyenlieu'])==='{"item":"nguyenlieu"}');
check('Ăn: Bình dân ở trường buổi trưa: cơm căng tin',meal('binhdan','school',1,['banhmi'])==='{"act":"canteen"}');
check('Ăn: Bình dân ở cửa hàng, chỉ có mì: cơm hộp',meal('binhdan','store',2,['mi'])==='{"act":"boxmeal"}');
check('Ăn: Bình dân ở chợ, túi trống: mua trái cây',meal('binhdan','market',0,[])==='{"buy":"buy_traicay","item":"traicay"}');
check('Ăn: Bình dân ở TTTM, túi trống: không tự ăn',meal('binhdan','mall',1,[])==='null');
check('Ăn: Thoải mái ở quán ăn: bún bò',meal('thoaimai','street',1,['banhmi'])==='{"act":"bunbo"}');
check('Ăn: Thoải mái ở TTTM: buffet',meal('thoaimai','mall',1,[])==='{"act":"buffet"}');
check('Ăn: no từ 45 thì không tự ăn',meal('binhdan','street',1,[],45)==='null');
check('Ăn: Tự chọn bữa thì không tự ăn',meal('tuchon','street',1,[])==='null');
meal('binhdan','street',1,[]);s.money=100000;autoEat();check('Ăn: autoEat gọi cơm tấm, trừ 40.000đ',s.money===60000&&s.ateThisSlot);
/* ---------- thẻ hành động (src/cards.js) ---------- */
const pc=(set)=>{fresh('thuong');s.flags.hired=1;s.q.q1_job='done';set();return pickCards(s)};
let C=pc(()=>{s.day=3;s.slot=0;s.loc='home'});
check('Thẻ: sáng ngày thường Đi học đứng đầu, tô nổi',C[0].id==='class'&&C[0].hl&&C[0].n==='Đi học');
check('Thẻ: 3 đến 5 thẻ, thẻ cuối là Tự chọn',C.length>=3&&C.length<=5&&C[C.length-1].custom);
C=pc(()=>{s.day=29;s.slot=0;s.loc='home';s.q.q4_exam='active'});check('Thẻ: sáng ngày 29 là Đi thi giữa kỳ',C[0].id==='exam'&&C[0].n==='Đi thi giữa kỳ');
C=pc(()=>{s.day=20;s.slot=0;s.loc='home';s.q.q3_khoa='active'});const kc=C.find(c=>c.id==='khoa');
check('Thẻ: ngày 20 có thẻ Cà phê với Khoa, buổi sáng hiện lý do khóa',kc&&!!kc.lock&&kc.quest,kc&&kc.lock);
C=pc(()=>{s.day=20;s.slot=2;s.loc='home';s.q.q3_khoa='active'});check('Thẻ: chiều ngày 20 Cà phê với Khoa mở',C.find(c=>c.id==='khoa'&&!c.lock));
C=pc(()=>{s.day=6;s.slot=1;s.loc='home';s.nl=10});check('Thẻ: năng lượng thấp gợi ý nghỉ ngơi trước',['nap','bench','campusnap'].includes(C[0].id),C.map(c=>c.id).join(','));
C=pc(()=>{s.day=6;s.slot=2;s.loc='home';s.mess=95});check('Thẻ: phòng bừa gợi ý Dọn phòng',C.some(c=>c.id==='clean'),C.map(c=>c.id).join(','));
C=pc(()=>{s.day=6;s.slot=3;s.loc='home'});check('Thẻ: buổi tối có Đi ngủ sớm',C.some(c=>c.id==='sleep'),C.map(c=>c.id).join(','));
check('Thẻ: không gợi ý việc bị khóa (trừ thẻ nhiệm vụ)',C.every(c=>c.custom||!c.lock||c.quest));
C=pc(()=>{s.day=6;s.slot=3;s.loc='home'});check('Thẻ: buổi tối không gợi ý trường, chợ',C.every(c=>c.custom||!['school','market'].includes(c.loc)));
C=pc(()=>{s.day=6;s.slot=2;s.loc='home';s.nl=22});const shc=C.find(c=>c.id==='shift');check('Thẻ: cảnh báo khi một chỉ số sẽ xuống dưới 25',!shc||shc.warn.includes('nl'));
// bấm thẻ Đi học từ phòng trọ
fresh('thuong');s.day=3;s.slot=0;s.loc='home';s.money=500000;s.no=80;queue=[];hideWin();cards=pickCards(s);
withRandom(0.99,()=>{runCard(0);clearEvents()});
check('Thẻ: bấm Đi học thì tới trường, lên lớp, sang buổi trưa, trừ 6.000đ',s.loc==='school'&&s.classToday===1&&s.slot===1&&s.money===494000,JSON.stringify({loc:s.loc,c:s.classToday,sl:s.slot,m:s.money}));
fresh('thuong');s.day=3;s.slot=1;s.loc='home';s.money=0;s.nl=60;queue=[];hideWin();cards=[makeCard(s,'school',A.school.find(a=>a.id==='library'))];
withRandom(0.99,()=>{runCard(0);clearEvents()});check('Thẻ: hết tiền thì đi bộ (năng lượng −8, tinh thần −2)',s.loc==='school'&&s.log.some(l=>l.text.startsWith('Hết tiền xăng, đi bộ')));
/* ---------- cảnh báo bật lên ---------- */
const warns=()=>queue.filter(e=>e.kind==='warn').map(e=>e.id);
fresh('thuong');s.day=4;s.slot=3;queue=[];withRandom(0.99,()=>slotEvents());check('Cảnh báo: tối ngày 4 tiền nhà, kèm số dư',warns().includes('rent')&&queue.find(e=>e.id==='rent').text.includes(fmt(s.money)));
queue=[];withRandom(0.99,()=>slotEvents());check('Cảnh báo: chỉ hiện một lần',!warns().includes('rent'));
fresh('thuong');s.day=28;s.slot=3;queue=[];withRandom(0.99,()=>slotEvents());check('Cảnh báo: tối ngày 28 bài kiểm tra (Sáng mai)',queue.some(e=>e.id==='exam28'&&e.text.includes('Sáng mai')));
fresh('thuong');s.day=29;s.slot=0;queue=[];withRandom(0.99,()=>slotEvents());check('Cảnh báo: sáng ngày 29 bài kiểm tra, nút Đi thi ngay',queue.some(e=>e.id==='exam29'&&e.choices[0].l==='Đi thi ngay'));
fresh('thuong');s.day=29;s.slot=1;s.q.q4_gift='active';queue=[];withRandom(0.99,()=>slotEvents());check('Cảnh báo: ngày 29 nhắc quà sinh nhật mẹ, nút Đi TTTM',queue.some(e=>e.id==='gift29'&&e.choices[0].l==='Đi TTTM'));
fresh('thuong');s.day=14;s.slot=0;s.q.q2_shift='active';queue=[];withRandom(0.99,()=>slotEvents());check('Cảnh báo: ngày cuối của nhiệm vụ còn đang làm',queue.some(e=>e.id==='due_q2_shift'&&e.text.includes('Quen việc ở cửa hàng')));
fresh('thuong');s.day=29;s.slot=0;s.loc='home';s.money=500000;s.q.q4_exam='active';queue=[];hideWin();withRandom(0.99,()=>{slotEvents();processQueue()});
check('Cảnh báo: hộp cảnh báo mở giữa màn hình',win==='event'&&curEvent.kind==='warn');
withRandom(0.99,()=>pickChoice(0));clearEvents();check('Cảnh báo: Đi thi ngay thì tới trường và làm bài',s.flags.examTaken===1&&s.loc==='school');
/* ---------- tự ăn đầu buổi, độ khó ---------- */
fresh('thuong');s.day=3;s.slot=1;s.loc='school';s.no=30;s.money=100000;s.mealChk=0;queue=[];hideWin();processQueue();
check('Tự ăn đầu buổi: cơm căng tin, ghi nhật ký',s.money===75000&&s.ateThisSlot&&s.log[0].text.includes('Ăn cơm căng tin: −25.000đ, no +33'),s.log[0].text);
newGame({name:'Lan',gender:'nu',diff:'de'});check('Độ khó: chọn Dễ khi tạo nhân vật',s.diff==='de');clearEvents();
newGame({name:'Lan',gender:'nu'});check('Độ khó: mặc định Thường',s.diff==='thuong');clearEvents();
/* ---------- đếm số lần bấm một ngày thường (đi học, ăn trưa, ca chiều, ca tối) ---------- */
fresh('thuong');s.flags.hired=1;s.flags.metHai=1;QUESTS.forEach(q=>{if(q.ch===1)s.q[q.id]='done'});s.day=2;s.slot=3;s.loc='home';s.money=900000;s.nl=90;s.no=80;s.tt=80;s.sk=90;queue=[];hideWin();
let clicks=0;const tap=f=>{clicks++;f()};
withRandom(0.99,()=>{doAction(locActs().find(a=>a.id==='sleep'));clicks=0;
  if(win==='event')tap(()=>pickChoice(0));                       // thẻ ngày mới
  const go=id=>{cards=pickCards(s);let i=cards.findIndex(c=>c.id===id);if(i<0){cards.push(makeCard(s,id==='shift'?'store':'school',(id==='shift'?A.store:A.school).find(a=>a.id===id)));i=cards.length-1}tap(()=>runCard(i));let g=0;while(win==='event'&&s.day===3&&g++<5)tap(()=>pickChoice(0))};
  go('class');go('campusnap');go('shift');go('shift')});
check('Bấm: một ngày thường không quá 6 lần bấm',clicks<=6&&s.day===4&&s.shifts===2,clicks+' lần, ngày '+s.day+', ca '+s.shifts);
console.log('  (số lần bấm một ngày thường: '+clicks+')');
/* ---------- giai đoạn 4: Ngân, sự kiện mới, sinh nhật mẹ ---------- */
check('Ngân: có chân dung và tên trong danh bạ',!!Portraits.CH.ngan&&PEOPLE.ngan.n.startsWith('Ngân'));
fresh('thuong');s.day=17;s.slot=2;queue=[];withRandom(0.99,()=>slotEvents());const ng=queue.find(e=>e.title==='Ngân nhắn tin');
check('Ngân: lời mời ngày 17 do Ngân nói, qua tin nhắn',ng&&ng.who==='ngan'&&evLook(ng).phone==='Tin nhắn');
fresh('thuong');s.nganCount=2;check('Ngân: đi đủ 2 lần thì có lời kết riêng',endingLines().some(([w,t])=>w==='ngan'&&t.includes('bài tập nhóm học kỳ sau')));
s.nganCount=1;check('Ngân: đi 1 lần thì chưa có lời kết',!endingLines().some(([w])=>w==='ngan'));
fresh('thuong');s.day=13;s.slot=3;s.loc='home';s.money=500000;DECK_BY.blackout.mk(s);check('Cúp điện: có thẻ Ra quán cà phê',pickCards(s).some(c=>c.n==='Ra quán cà phê'&&c.loc==='cafe'));
fresh('thuong');s.day=30;s.slot=1;s.money=900000;queue=[];withRandom(0.99,()=>{slotEvents();processQueue()});while(win==='event'&&curEvent.title!=='Mẹ lên Sài Gòn')pickChoice(curEvent.choices.length-1);
withRandom(0.99,()=>pickChoice(0));check('Sinh nhật mẹ: ăn mừng ở TTTM có lời thoại của mẹ',s.loc==='mall'&&s.flags.momParty===1&&win==='event'&&curEvent.title==='Sinh nhật mẹ'&&curEvent.who==='me');
clearEvents();check('Sinh nhật mẹ: lời kết có câu ăn mừng',endingLines().some(([w,t])=>w==='me'&&t.startsWith('Mẹ lên Sài Gòn đúng ngày sinh nhật')));
/* ---------- minigame (src/minigames.js) ---------- */
{let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};let okAll=true;
 for(let k=0;k<200;k++){for(const c of mgCustomers(rnd)){if(!(c.items.length>=1&&c.items.length<=3&&c.paid>c.total&&MG_PAY.includes(c.paid)&&c.total===c.items.reduce((a,[,p])=>a+p,0)))okAll=false}}
 check('Thối tiền: 3 khách, 1–3 món, tiền khách đưa lớn hơn tổng',okAll)}
check('Thối tiền: chấm đúng khi tổng tờ tiền bằng tiền thối',mgChangeOk({total:37000,paid:100000},[50000,10000,2000,1000])&&!mgChangeOk({total:37000,paid:100000},[50000,10000,2000]));
check('Thối tiền: đúng 3 thưởng 20.000đ, tinh thần +3, chị Mai khen',JSON.stringify(mgChangeResult(3))===JSON.stringify({gain:20000,tt:3,praise:true}));
check('Thối tiền: đúng 2 thưởng 10.000đ; đúng 0–1 tinh thần −2; trung bình 10.000đ',mgChangeResult(2).gain===10000&&mgChangeResult(1).tt===-2&&mgChangeResult(0).tt===-2&&MG_CHANGE_AVG.gain===10000);
check('Canh lửa: trúng 3 thì tinh thần +3, no +4; trúng 0 khét; trúng 1–2 không cộng',mgCookResult(3).tt===3&&mgCookResult(3).no===4&&mgCookResult(0).burnt&&!Object.keys(mgCookResult(2)).length);
check('Canh lửa: vùng xanh 25%, vạch trong vùng là trúng',MG_ZONE===0.25&&mgFireHit(0.5,0.4)&&!mgFireHit(0.7,0.4));
fresh('thuong');s.day=8;check('Tần suất: lần đầu mỗi tuần luôn chơi',mgWant(s,'change',()=>0.99)&&!mgWant(s,'change',()=>0.99)&&mgWant(s,'change',()=>0.1)&&mgWant(s,'cook',()=>0.99));
s.day=15;check('Tần suất: sang tuần mới lại chơi lần đầu',mgWant(s,'change',()=>0.99));
// làm ca có minigame: chơi đúng cả 3 khách
MG.off=false;fresh('thuong');s.flags.hired=1;s.day=3;s.slot=2;s.loc='store';s.money=100000;s.tt=50;queue=[];hideWin();
withRandom(0.99,()=>doAction(A.store.find(a=>a.id==='shift')));
check('Làm ca: mở Thối tiền trước khi hết ca',win==='event'&&curEvent.kind==='mg'&&curEvent.type==='change'&&s.slot===2);
for(let k=0;k<3;k++){const c=curEvent.st.cs[k];let r=c.paid-c.total;for(const v of [...Money.VALUES].reverse())while(r>=v){mgDo('note',v);r-=v}mgDo('give')}
const fin=mgCur&&mgCur.fin;withRandom(0.99,()=>mgCur.e.done(fin));mgCur=null;clearEvents();
check('Làm ca: thối đúng 3 khách thì +20.000đ, tinh thần +3, chị Mai khen, sang buổi tối',fin&&fin.n===3&&s.money===120000&&s.slot===3&&s.shifts===1&&s.log.some(l=>l.text.startsWith('Chị Mai khen')),JSON.stringify({m:s.money,sl:s.slot,n:fin&&fin.n}));
fresh('thuong');s.day=3;s.slot=3;s.loc='home';s.bag=[{id:'nguyenlieu',exp:5}];queue=[];hideWin();useItem('nguyenlieu');
check('Nấu cơm: mở Canh lửa',win==='event'&&curEvent.type==='cook');
const no0=s.no;mgDo('skip');check('Canh lửa: bỏ qua thì vẫn nấu, không cộng thêm',s.cooked===1&&!win&&s.no>no0);
MG.off=true;
/* ---------- khóa lưu v6: bản lưu cũ ---------- */
{const LS=globalThis.localStorage,mem={'ba-muoi-ngay-sg-v5':'{"started":true}'};
 globalThis.localStorage={getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=v},removeItem:k=>{delete mem[k]}};
 check('Lưu: khóa mới ba-muoi-ngay-sg-v6',KEY==='ba-muoi-ngay-sg-v6');
 renderTitle();check('Lưu: bản lưu cũ thì trang bìa báo bắt đầu tháng mới',$('titleBtns').innerHTML.includes('Bản lưu cũ không dùng được với phiên bản mới')&&!$('titleBtns').innerHTML.includes('Chơi tiếp'));
 newGame({name:'Lan',gender:'nu'});clearEvents();check('Lưu: bắt đầu tháng mới thì xóa bản lưu cũ',!mem['ba-muoi-ngay-sg-v5']&&!!mem[KEY]);
 globalThis.localStorage=LS}
/* ---------- giao diện điện thoại (CLAUDE-CODE-DIEN-THOAI.md) ---------- */
{const cases=[[390,844,'portrait'],[375,667,'portrait'],[360,780,'portrait'],[430,932,'portrait'],[600,601,'portrait'],[844,390,'landscape'],[667,375,'landscape'],[780,360,'landscape'],[932,430,'landscape'],
   [1280,720,'desktop'],[601,900,'desktop'],[1024,768,'desktop'],[900,501,'desktop'],[600,600,'desktop']];
 const bad=cases.filter(([w,h,n])=>Layout.pick(w,h)!==n);check('Bố cục: chọn đúng lớp cho '+cases.length+' kích thước',!bad.length,JSON.stringify(bad))}
{const b=Layout.box(390,219);check('Cảnh dọc: phủ kín bề ngang, không lộ mép',b.w>=390&&b.h>=219&&b.left<=0&&b.left+b.w>=390&&b.top<=0,JSON.stringify(b))}
{const W=844-330-47,H=390,b=Layout.box(W,H,.46),cx=b.left+320*.46*b.k;check('Cảnh ngang: phủ kín chiều cao, nhân vật giữa vùng cảnh',b.h>=H&&b.left<=0&&b.left+b.w>=W&&Math.abs(cx-W/2)<1,JSON.stringify(b))}
{const b=Layout.box(300,400,.98);check('Cảnh: nhân vật sát mép thì dừng ở mép cảnh, không lộ nền',b.left<=0&&b.left+b.w>=300-1e-6,JSON.stringify(b))}
{const gcs=globalThis.getComputedStyle,cv=fit=>({getBoundingClientRect:()=>({left:10,top:20,width:640,height:480}),fit});globalThis.getComputedStyle=el=>({objectFit:el.fit});
 const near=(a,x,y)=>Math.abs(a.x-x)<1e-6&&Math.abs(a.y-y)<1e-6;
 /* fill: kéo đúng khung 640×480 → x nhân 0,5, y nhân 0,375 */
 const f=Layout.toScene(cv('fill'),10+320,20+240);
 /* contain: 640×480 thu cảnh theo bề ngang (k=2), dư 60px trên và dưới */
 const c=Layout.toScene(cv('contain'),10+320,20+60+180),c0=Layout.toScene(cv('contain'),10,20+60);
 /* cover: phủ theo chiều cao (k=480/180), cắt hai bên */
 const k=480/180,v=Layout.toScene(cv('cover'),10+320,20+240);
 check('Chạm: đổi tọa độ màn hình về điểm ảnh cảnh 320×180 (fill, contain, cover)',near(f,160,90)&&near(c,160,90)&&near(c0,0,0)&&near(v,160,90)&&near(Layout.toScene(cv('cover'),10+320+k*10,20),170,0),JSON.stringify({f,c,c0,v}));
 globalThis.getComputedStyle=gcs}
fresh('thuong');s.loc='home';s.slot=1;s.ateThisSlot=false;s.bag=[{id:'mi',exp:null},{id:'nguyenlieu',exp:3},{id:'banhmi',exp:1}];
{const mc=mealCard(s);check('Thẻ ăn: tối đa 3 món, món sắp hỏng trước, chừa chỗ món gọi tại chỗ',mc.length===3&&mc[0].id==='banhmi'&&mc[1].id==='nguyenlieu'&&mc[2].id==='ship',JSON.stringify(mc.map(d=>d.id)))}
s.ateThisSlot=true;check('Thẻ ăn: ẩn khi buổi này đã ăn',!mealCard(s).length);
s.ateThisSlot=false;s.loc='school';s.slot=0;s.bag=[{id:'nguyenlieu',exp:3}];check('Thẻ ăn: không có món không dùng được ở nơi này',!mealCard(s).length);
s.loc='street';s.slot=1;s.money=45000;s.bag=[];{const mc=mealCard(s);check('Thẻ ăn: bỏ món không đủ tiền',mc.length===1&&mc[0].id==='comtam',JSON.stringify(mc))}
/* ---------- loại hộp hội thoại (src/dialog.js, bảng trong docs/PLAN-DIEN-THOAI.md) ---------- */
fresh('thuong');
{const want={homebox:'msg',scam:'msg',friendhome:'msg'},bad=[];
 for(const d of DECK){const e=d.mk(s);queue=[];if(!e||!e.choices)continue;const st=Dialog.style(e),exp=want[d.id]||(e.choices.length>1?'choice':'talk');if(st!==exp)bad.push(d.id+'→'+st)}
 check('Hộp: bộ bài sự kiện đúng loại hộp (tin nhắn là msg, còn lại theo số lựa chọn)',!bad.length,bad.join(' '))}
newGame({name:'Lan',gender:'nu'});
{const st=t=>Dialog.style(queue.find(e=>e.title===t));check('Hộp: tin nhắn của mẹ là msg, cô Tư giao chìa khóa là talk',st('Tin nhắn của mẹ')==='msg'&&st('Phòng ghép với Khoa')==='talk')}
clearEvents();
const evAt=(d,sl,t)=>{s.day=d;s.slot=sl;queue=[];withRandom(0.99,()=>slotEvents());return queue.find(e=>e.title===t)};
{const e=evAt(18,3,'Mẹ gọi điện');check('Hộp: mẹ gọi điện ngày 18 là call',e&&Dialog.style(e)==='call')}
{const e=evAt(11,2,'Ngân nhắn tin');check('Hộp: Ngân rủ đi cà phê là msg',e&&Dialog.style(e)==='msg')}
{const e=evAt(13,3,'Đêm nhạc chào tân sinh viên');check('Hộp: sự kiện từ 2 lựa chọn là choice',e&&Dialog.style(e)==='choice')}
{const e=evAt(4,3,'Tiền nhà sắp đến hạn');check('Hộp: cảnh báo tiền nhà là alert',e&&Dialog.style(e)==='alert')}
check('Hộp: máy tính giữ khung cũ cho talk, choice; hộp mới cho msg, call, alert và mọi hộp trên điện thoại',
  !Dialog.useNew('talk','desktop')&&!Dialog.useNew('choice','desktop')&&['msg','call','alert'].every(x=>Dialog.useNew(x,'desktop'))&&['talk','choice','msg','call','alert'].every(x=>Dialog.useNew(x,'portrait')&&Dialog.useNew(x,'landscape')));
s.money=0;{const h=Dialog.html(DECK_BY.lend.mk(s),'choice');check('Hộp: không đủ tiền thì nút mờ và có nhãn Không đủ tiền',/<button class="dd-b" type="button" data-ch="0" disabled>/.test(h)&&h.includes('Không đủ tiền'))}
{const h=Dialog.html(warnEv('x','Bài kiểm tra giữa kỳ','“Sáng nay là bài kiểm tra giữa kỳ.”',{l:'Đi thi ngay',x:'Trường · 6.000đ'}),'alert');check('Hộp: alert có nút chính kèm dòng phụ và nút phụ Để sau',h.includes('class="dd-pri"')&&h.includes('<small>Trường · 6.000đ</small>')&&/class="dd-sec"[^>]*><b>Để sau/.test(h))}
queue=[];
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
