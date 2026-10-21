/* 30 Ngày Sài Gòn · v0.3.0
 * Toàn bộ logic game: trạng thái, cốt truyện, nhiệm vụ, sự kiện, giao diện và cảnh pixel. */
/* ============ Helpers ============ */
const $=id=>document.getElementById(id);
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const fmt=n=>Math.round(n).toLocaleString('vi-VN')+'đ';
const fk=n=>{const a=Math.abs(n);return a>=1e6?(a/1e6).toLocaleString('vi-VN',{maximumFractionDigits:2})+'tr':Math.round(a/1000)+'k'};
const SLOTS=['Sáng','Trưa','Chiều','Tối'];
const DOW=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ Nhật'];
const DOWS=['T2','T3','T4','T5','T6','T7','CN'];
const dowOf=d=>(d-1)%7, isWE=d=>dowOf(d)>=5;
const chOf=d=>d<=7?1:d<=14?2:d<=21?3:4;
const STATS=[{k:'no',n:'Độ no'},{k:'nl',n:'Năng lượng'},{k:'tt',n:'Tinh thần'},{k:'sk',n:'Sức khỏe'}];
const SCOL={no:'#f5a742',nl:'#5cc8ff',tt:'#ff86b3',sk:'#72de90'};
const BILLS={5:['Tiền nhà',1200000],10:['Điện, nước, internet',200000],20:['Giáo trình và quỹ lớp',300000]};
const START_MONEY=3000000;
const HUNGRY_BED=30; // độ no dưới mức này lúc đi ngủ thì ngủ không ngon
const CLASS_DAYS=22;
const KEY='ba-muoi-ngay-sg-v5';
const RELAX=['net','trada','oc','walk','bench','chill','movie','shop','window','stroll','club','khoa','clean'];

let s, queue=[], curEvent=null, win=null, bagSel=null, calSel=1, toastTimer=0, menuCat=null;

/* ============ Pixel icons (12×12 grids → SVG) ============ */
const F3="..hssssssh..",F4="..ssssssss..",F5="..sesssses..",F6="..ssssssss..",F7="..sssmmsss..",F8="...ssssss...",F9="..cccccccc..",F10=".cccccccccc.";
const FACE={s:'#f0c49c',e:'#1a1a22',m:'#8a3b2b'};
const ICON={
  coin:[["...aaaaaa...","..abbbbbba..",".abbccccbba.",".abcbbbbbba.","abcbbbbbbbba","abcbbbbbbbba","abcbbbbbbbba","abbbbbbbbcba",".abbbbbbcba.",".abbccccbba.","..abbbbbba..","...aaaaaa..."],{a:'#a8741a',b:'#ffc94d',c:'#fff2b0'}],
  bag:[["....aaaa....","...a....a...","..aaaaaaaa..",".abbbbbbbba.",".abbbbbbbba.",".abccccccba.",".abcbbbbcba.",".abccccccba.",".abbbbbbbba.",".abbbbbbbba.","..aaaaaaaa..","............"],{a:'#4a2f1f',b:'#c48a4f',c:'#ffc94d'}],
  cal:[["...a....a...",".bbabbbbabb.",".bbbbbbbbbb.",".bbbbbbbbbb.",".cccccccccc.",".cdcdcdcdcc.",".cccccccccc.",".cdcdcdcecc.",".cccccccccc.",".cdcdcdcdcc.",".cccccccccc.","............"],{a:'#6b6b78',b:'#e2525c',c:'#f4ecda',d:'#8a90a8',e:'#e2525c'}],
  pin:[["....aaaa....","...abbbba...","..abbccbba..","..abccccba..","..abbccbba..","...abbbba...","...abbbba...","....abba....",".....aa.....","..dddddddd..","...dddddd...","............"],{a:'#7a2a33',b:'#ff6474',c:'#ffffff',d:'#5e6696'}],
  book:[["............",".aaaaaaaaaa.",".abbbbbbbba.",".abccccccba.",".abbbbbbbba.",".abccccccba.",".abbbbbbbba.",".abcccccbba.",".abbbbbbbba.",".aaaaaaaaaa.","..dddddddd..","............"],{a:'#24406e',b:'#5c8ad8',c:'#d8e4ff',d:'#e9e2d0'}],
  help:[["............","...aaaaaa...","..aabbbbaa..","..ab....ba..","......aba...",".....aba....","....aba.....","....aa......","............","....aa......","....aa......","............"],{a:'#ffc94d',b:'#ffe39a'}],
  scroll:[["............",".aaaaaaaaa..","abbbbbbbbba.",".abccccccba.",".abbbbbbbba.",".abccccccba.",".abbbbbbbba.",".abcccccbba.",".abbbbbbbba.","abbbbbbbbba.",".aaaaaaaaa..","............"],{a:'#8a5a2a',b:'#f3e2c0',c:'#9a7a5a'}],
  star:[[".....a......",".....a......","....aba.....","aaaabbbaaaa.",".aabbbbbaa..","...abbba....","..abbabba...","..ab...ba...",".aa.....aa..","............","............","............"],{a:'#d99a1e',b:'#ffc94d'}],
  basket:[["............","....a..a....","...a....a...","..a......a..","bbbbbbbbbbbb",".bccccccccb.",".bcdcdcdccb.",".bccccccccb.",".bcdcdcdccb.","..bccccccb..","...bbbbbb...","............"],{a:'#8a5a2a',b:'#6b3f22',c:'#c48a4f',d:'#9c6b3f'}],
  no:[["............","...a..a.....","....a..a....","...a..a.....","............","bbbbbbbbbbbb",".cccccccccc.",".cccccccccc.","..cccccccc..","...cccccc...","....dddd....","............"],{a:'#c9c9d9',b:'#fff3d6',c:'#f5a742',d:'#b8762a'}],
  nl:[["......aaa...",".....aaa....","....aaa.....","...aaa......","..aaaaaaa...","......aaa...",".....aaa....","....aaa.....","...aa.......","..a.........","............","............"],{a:'#5cc8ff'}],
  tt:[["............","..aaa.aaa...",".abbbabbba..",".abcbbbbba..",".abbbbbbba..","..abbbbba...","...abbba....","....aba.....",".....a......","............","............","............"],{a:'#b8456f',b:'#ff86b3',c:'#ffd0e2'}],
  sk:[["............","....aaaa....","....abba....",".aaaabbaaaa.",".abbbbbbbba.",".abbbbbbbba.",".aaaabbaaaa.","....abba....","....aaaa....","............","............","............"],{a:'#2f8a4a',b:'#72de90'}],
  banhmi:[["............","............","...aaaaaa...","..abcbcbcba.",".abbbbbbbbba",".abbbbbbbbba",".adededededa","..aaaaaaaaa.","............","............","............","............"],{a:'#8a4f1c',b:'#e2a54a',c:'#f6d28a',d:'#5aa04a',e:'#d0603e'}],
  xoi:[["............","............","...cccccc...","..cddcddcc..",".cddddddddc.",".cdeedddeec.","aaaaaaaaaaaa","abbbbbbbbbba",".abbbbbbbba.","..aaaaaaaa..","............","............"],{a:'#2f6a2f',b:'#5aa04a',c:'#e8d79c',d:'#fff6d8',e:'#e0a040'}],
  mi:[["............",".aaaaaaaaaa.",".abbbbbbbba.",".abccccccba.",".abcddddcba.",".abcddddcba.",".abccccccba.",".abbbbbbbba.",".aeeeeeeeea.",".aeeeeeeeea.",".aaaaaaaaaa.","............"],{a:'#7a2a1a',b:'#f0c040',c:'#ffe08a',d:'#e05a2a',e:'#d03a2a'}],
  nguyenlieu:[["............","...bb..cc...","..bbbbcccc..","..dbbdcccd..",".aaaaaaaaaa.",".affffffffa.",".afgfgfgfga.",".affffffffa.",".afgfgfgfga.","..aaaaaaaa..","............","............"],{a:'#6b3f22',b:'#4caf50',c:'#e53935',d:'#ff9800',f:'#c48a4f',g:'#9c6b3f'}],
  traicay:[["............","......a.....",".....ab.....","...cccccc...","..cccccccc..","..cdcccccc..","..ddcccccc..","..cccccccc..","..cccccccc..","...cccccc...","....cccc....","............"],{a:'#6b4a2f',b:'#4caf50',c:'#e8453c',d:'#ff9a8a'}],
  banhngot:[["............","......a.....",".....bb.....","...cccccc...","..cddddddc..","..ceeeeeec..","..cddddddc..","..ceeeeeec..","..cddddddc..","..cccccccc..","............","............"],{a:'#e53935',b:'#ffffff',c:'#7a4b2e',d:'#f6d28a',e:'#ff86b3'}],
  caphe:[["............","...aaaaaa...","..abbbbbba..","..acccccca..","..acddddca..","..acddddca..","..acccccca..","..aeeeeeea..","..aeeeeeea..","..acccccca..","...aaaaaa...","............"],{a:'#2e2019',b:'#c9c9c9',c:'#6b3a22',d:'#f3e2c0',e:'#c0392b'}],
  sua:[["............","....aaaa....","...abbbba...","..abbbbbba..","..acccccca..","..acddddca..","..acdccdca..","..acccccca..","..acccccca..","..aaaaaaaa..","............","............"],{a:'#2b5d8a',b:'#5cc8ff',c:'#ffffff',d:'#5cc8ff'}],
  thuoc:[["............",".aaaaaaaaaa.",".abbbbbbbba.",".abccbbccba.",".abccbbccba.",".abbbbbbbba.",".abccbbccba.",".abccbbccba.",".abbbbbbbba.",".aaaaaaaaaa.","............","............"],{a:'#8a90a8',b:'#e6e9f2',c:'#e23d4f'}],
  /* portraits */
  p_minh:[["............","...hhhhhh...","..hhhhhhhh..",F3,F4,F5,F6,F7,F8,F9,F10,F10],{...FACE,h:'#2a1c14',c:'#eef2f7'}],
  p_me:[["....hhhh....","...hhhhhh...","..hhhhhhhh..",F3,F4,F5,F6,F7,F8,F9,F10,F10],{...FACE,s:'#e8b98f',h:'#4a4246',c:'#8a4f9e'}],
  p_tu:[["............",".hhhhhhhhhh.",".hhhhhhhhhh.",".hhsssssshh.",".hssssssssh.",F5,F6,F7,F8,F9,F10,F10],{...FACE,s:'#e8b98f',h:'#3a2a3a',c:'#d9534f'}],
  p_mai:[["....hhhh....","...hhhhhh...","..hhhhhhhh..",F3,F4,F5,F6,F7,F8,F9,F10,F10],{...FACE,h:'#3a2418',c:'#2e9c5a'}],
  p_hai:[["............","..hhhhhhhh..","..hhhhhhhh..",F3,F4,"..gegssgeg..",F6,F7,F8,F9,F10,F10],{...FACE,s:'#e8b98f',h:'#8a8a94',g:'#2b2f3a',c:'#7a5a3a'}],
  p_linh:[["............","...hhhhhh...","..hhhhhhhh..",".hhsssssshh.",".hssssssssh.",".hsessssesh.",".hssssssssh.",".hsssmmsssh.",".hhsssssshh.",".hcccccccch.",F10,F10],{...FACE,h:'#4a2a1a',c:'#3a78c2'}],
  p_khoa:[["............","..kkkkkkk...","..kkkkkkkkkk",F3,F4,F5,F6,F7,F8,F9,F10,F10],{...FACE,h:'#2a1c14',k:'#e2525c',c:'#4caf50'}],
};
/* Biểu tượng và chân dung mới vẽ bằng canvas (src/gfx/); các lưới ICON ở trên chỉ còn dùng cho biểu tượng chưa có bản mới */
const ICO_NEW={scroll:'quest',star:'act'};
const pxImg=src=>`<img class="px" src="${src}" alt="" aria-hidden="true">`;
const _ico={};
function ico(key){
  if(key.startsWith('p_')){const id=key==='p_minh'?'self':key.slice(2);return pxImg(Portraits.url(id,'normal',{gender:s&&s.gender}))}
  if(_ico[key])return _ico[key];
  const nk=ICO_NEW[key]||key;if(Icons.has(nk))return _ico[key]=pxImg(Icons.url(nk));
  const [rows,pal]=ICON[key];let r='';
  rows.forEach((row,y)=>{for(let x=0;x<row.length;x++){const c=row[x];if(c!=='.'&&pal[c])r+=`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[c]}"/>`}});
  return _ico[key]=`<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}

/* ============ Story ============ */
const PEOPLE={
  me:{n:'Mẹ',p:'p_me'},tu:{n:'Cô Tư · chủ nhà trọ',p:'p_tu'},mai:{n:'Chị Mai · quản lý cửa hàng',p:'p_mai'},
  hai:{n:'Thầy Hải · cố vấn học tập',p:'p_hai'},linh:{n:'Chị Linh · trưởng CLB',p:'p_linh'},khoa:{n:'Khoa · bạn cùng phòng',p:'p_khoa'},self:{n:'Minh',p:'p_minh'},
};
const CHAPTERS={
  1:{t:'Tân sinh viên',from:1,to:7,txt:'Minh, 18 tuổi, rời Tuy Hòa vào Sài Gòn học năm nhất ngành Thiết kế. Bố mẹ gửi 3 triệu cho tháng đầu, đã gồm tiền nhà. Tuần này Minh phải làm quen trường lớp, ở ghép với Khoa và tìm một việc làm thêm để tự lo phần còn lại.'},
  2:{t:'Vừa học vừa làm',from:8,to:14,txt:'Lịch kín dần: sáng lên lớp, chiều tối đứng quầy ở cửa hàng tiện lợi. Tối thứ Bảy là đêm nhạc chào tân sinh viên của CLB. Lương part-time phải đợi tới ngày 15, còn ví thì mỏng dần.'},
  3:{t:'Lương part-time đầu tiên',from:15,to:21,txt:'Ngày 15, chị Mai trả lương part-time đầu tiên. Tự kiếm được tiền thật dễ chịu, và cũng dễ tiêu. Thầy Hải nhắc cả lớp ôn bài cho kiểm tra giữa kỳ, còn Khoa thì rủ đi cà phê cuối tuần.'},
  4:{t:'Về đích',from:22,to:30,txt:'Tuần cuối tháng. Sáng thứ Hai ngày 29 là bài kiểm tra giữa kỳ đầu tiên. Ngày 30 là sinh nhật mẹ, và Minh muốn tự tay mua quà bằng tiền mình làm ra.'},
};
const QUESTS=[
  {id:'q1_class',ch:1,who:'hai',t:'Buổi học đầu tiên',d:'Lên lớp buổi sáng ngày 1 ở Trường đại học.',hint:'Bản đồ → Trường → Hoạt động → Lên lớp',goal:'school',prog:s=>[Math.min(s.classes,1),1],due:1,rw:{tt:5},study:1},
  {id:'q1_job',ch:1,who:'mai',t:'Tìm việc làm thêm',d:'Đến Cửa hàng tiện lợi phỏng vấn xin việc trước hết ngày 3.',hint:'Bản đồ → Cửa hàng → Hoạt động → Phỏng vấn xin việc',goal:'store',prog:s=>[s.flags.hired?1:0,1],due:3,rw:{tt:6}},
  {id:'q1_cook',ch:1,who:'tu',t:'Bữa cơm tự nấu đầu tiên',d:'Nấu một bữa ở Phòng trọ bằng nguyên liệu trong túi.',hint:'Về Phòng trọ → Túi đồ → Nguyên liệu → Nấu cơm',goal:'home',prog:s=>[Math.min(s.cooked,1),1],due:4,rw:{tt:6,sk:3}},
  {id:'q1_rent',ch:1,who:'tu',t:'Tiền nhà cho cô Tư',d:'Giữ đủ 1.200.000đ trong ví đến sáng ngày 5.',hint:'Tiền nhà tự trừ sáng ngày 5. Đừng tiêu quá tay trước đó.',prog:s=>[s.flags.rentPaid?1:0,1],due:5,rw:{tt:4},item:['traicay',2],rwTxt:'Cô Tư tặng 2 phần trái cây'},
  {id:'q2_class',ch:2,who:'hai',t:'Không bỏ buổi học nào',d:'Lên lớp đủ 5 buổi sáng từ ngày 8 đến ngày 12.',hint:'Sáng thứ Hai đến thứ Sáu → Trường → Lên lớp',goal:'school',prog:s=>[Math.min(s.classCh[2],5),5],unit:'buổi',due:12,rw:{tt:6},study:1},
  {id:'q2_shift',ch:2,who:'mai',t:'Quen việc ở cửa hàng',d:'Làm đủ 4 ca part-time từ ngày 8 đến ngày 14.',hint:'Ca chiều hoặc ca tối → Cửa hàng → Làm ca part-time',goal:'store',prog:s=>[Math.min(s.shiftCh[2],4),4],unit:'ca',due:14,rw:{tt:5},bonus:100000,rwTxt:'Chị Mai thưởng 100k vào lương'},
  {id:'q2_club',ch:2,who:'linh',t:'Đêm nhạc chào tân sinh viên',d:'Dự đêm nhạc của CLB tối thứ Bảy, ngày 13.',hint:'Chuẩn bị 100k tiền vé; tối ngày 13 sẽ có lời mời',prog:s=>[s.flags.clubGo?1:0,1],due:13,rw:{tt:6}},
  {id:'q2_mood',ch:2,who:'self',t:'Đừng để mình kiệt quệ',d:'Giữ tinh thần từ 30 trở lên suốt ngày 8 đến ngày 14.',hint:'Xen kẽ việc thư giãn giữa giờ học và giờ làm',endCheck:1,fail:s=>!!s.flags.mood2Fail,pass:s=>!s.flags.mood2Fail,prog:s=>[s.day>14?1:0,1],label:s=>s.flags.mood2Fail?'Đã tụt dưới 30':`Giữ vững thêm ${Math.max(0,15-s.day)} ngày`,due:14,rw:{tt:5,sk:3}},
  {id:'q3_study',ch:3,who:'hai',t:'Ôn bài ở thư viện',d:'Học ở thư viện trường ít nhất 3 buổi từ ngày 15 đến ngày 21.',hint:'Buổi trưa hoặc chiều ngày thường → Trường → Học ở thư viện',goal:'school',prog:s=>[Math.min(s.studyCh[3],3),3],unit:'buổi',due:21,rw:{tt:5},study:1},
  {id:'q3_indep',ch:3,who:'self',t:'Tự lập tài chính',d:'Không xin thêm tiền bố mẹ trong cả tháng.',hint:'Kẹt tiền thì xin ứng lương ở cửa hàng',endCheck:1,fail:s=>s.askCount>0,pass:s=>s.askCount===0,prog:s=>[s.day>21?1:0,1],label:s=>s.askCount?'Đã xin thêm tiền':'Giữ đến hết ngày 21',due:21,rw:{tt:6}},
  {id:'q3_khoa',ch:3,who:'khoa',t:'Cà phê với Khoa',d:'Đi cà phê với Khoa vào buổi chiều ngày 20 hoặc 21.',hint:'Chiều thứ Bảy hoặc Chủ Nhật → Cà phê → Cà phê với Khoa',goal:'cafe',prog:s=>[s.flags.metKhoa?1:0,1],due:21,rw:{tt:8}},
  {id:'q4_exam',ch:4,who:'hai',t:'Kiểm tra giữa kỳ',d:'Có mặt làm bài kiểm tra sáng ngày 29 và đạt từ 55 điểm học tập.',hint:'Sáng thứ Hai ngày 29 → Trường → Làm bài kiểm tra giữa kỳ',goal:'school',fail:s=>!!s.flags.examTaken&&s.flags.examScore<55,prog:s=>[s.flags.examTaken&&s.flags.examScore>=55?1:0,1],label:s=>s.flags.examTaken?`Đạt ${s.flags.examScore} điểm`:`Điểm học tập hiện tại ${studyScore()}/55`,due:29,rw:{tt:8}},
  {id:'q4_gift',ch:4,who:'me',t:'Quà sinh nhật mẹ',d:'Mua quà sinh nhật cho mẹ ở Trung tâm thương mại trước hết ngày 30.',hint:'Từ trưa → TTTM → Mua → Quà sinh nhật mẹ',goal:'mall',prog:s=>[s.flags.gift?1:0,1],due:30,rw:{tt:15}},
  {id:'q4_health',ch:4,who:'self',t:'Về đích khỏe mạnh',d:'Kết thúc ngày 30 với sức khỏe từ 50 trở lên.',hint:'Ăn đủ, ngủ đủ, bớt ca tối',endCheck:1,pass:s=>s.sk>=50,prog:s=>[s.sk>=50?1:0,1],label:s=>`Sức khỏe hiện tại ${s.sk}/50`,due:30,rw:{},rwTxt:'Điểm cuối tháng tốt hơn'},
];
const QBY=Object.fromEntries(QUESTS.map(q=>[q.id,q]));
const DAILY={
  class1:{t:'Lên lớp buổi sáng',prog:s=>[s.classToday?1:0,1]},
  eat2:{t:'Ăn ít nhất 2 bữa',prog:s=>[Math.min(s.mealsToday,2),2]},
  cook:{t:'Nấu một bữa ở nhà',prog:s=>[s.cookedToday?1:0,1]},
  relax:{t:'Làm một việc thư giãn',prog:s=>[s.relaxToday?1:0,1]},
  shift1:{t:'Làm ít nhất 1 ca part-time',prog:s=>[Math.min(s.shiftToday,1),1]},
  frugal:{t:'Tiêu dưới 100k hôm nay',eod:1,prog:s=>[s.spentToday<100000?1:0,1],label:s=>`đã tiêu ${fk(s.spentToday)}`},
};

/* ============ Items (bag) ============ */
const ITEMS={
  banhmi:{n:'Bánh mì thịt',type:'food',d:'Pate, chả lụa, đồ chua. Ăn nhanh, no vừa.',eff:{no:22,tt:1},shelf:1},
  xoi:{n:'Xôi gà',type:'food',d:'Gói lá chuối, còn ấm. Chắc bụng hơn bánh mì.',eff:{no:28,tt:2},shelf:1},
  mi:{n:'Mì gói',type:'food',d:'Rẻ, để lâu không hỏng. Từ gói thứ hai trong ngày sẽ hại sức khỏe gấp đôi.',eff:s=>({no:24,tt:-2,sk:s.noodleToday>=1?-8:-4}),shelf:null,where:['home','store'],whereTxt:'Cần nước sôi: dùng ở phòng trọ hoặc cửa hàng tiện lợi',after:s=>{s.noodleToday++;s.noodleTotal++}},
  nguyenlieu:{n:'Nguyên liệu nấu ăn',type:'food',d:'Rau, thịt, trứng đủ cho một bữa cơm nhà. Rẻ và tốt cho sức khỏe.',eff:{no:36,sk:3,tt:3,nl:-3},shelf:3,where:['home'],whereTxt:'Chỉ nấu được ở phòng trọ',verb:'Nấu cơm',after:s=>{s.cooked++;s.cookedToday=1}},
  traicay:{n:'Trái cây',type:'food',d:'Xoài, ổi cắt sẵn. Ít no nhưng bổ.',eff:{no:12,sk:5,tt:2},shelf:2},
  banhngot:{n:'Bánh ngọt',type:'food',d:'Bông lan kem dâu. Ngọt ngào nhưng mau đói.',eff:{no:15,tt:6},shelf:1},
  caphe:{n:'Cà phê lon',type:'drink',d:'Tỉnh táo tức thì. Đồ uống không tính là bữa ăn.',eff:{nl:12,tt:2},shelf:null},
  sua:{n:'Hộp sữa tươi',type:'drink',d:'Lót dạ nhẹ, thêm chút sức. Không tính là bữa ăn.',eff:{no:8,nl:4,sk:3},shelf:3},
  thuoc:{n:'Thuốc cảm',type:'med',d:'Đỡ mệt khi ốm. Dùng lúc nào cũng được.',eff:{sk:12,nl:-2},shelf:null},
};
const TYPE_LABEL={food:'Đồ ăn',drink:'Đồ uống',med:'Thuốc'};
const bagCount=id=>s.bag.filter(x=>x.id===id).length;
function bagAdd(id,q=1){const sh=ITEMS[id].shelf;for(let i=0;i<q;i++)s.bag.push({id,exp:sh?s.day+sh-1:null})}
function bagTake(id){let bi=-1,be=Infinity;s.bag.forEach((x,i)=>{if(x.id!==id)return;const e=x.exp===null?Infinity:x.exp;if(bi<0||e<be){bi=i;be=e}});if(bi>=0)s.bag.splice(bi,1)}
function bagStacks(){const m={};s.bag.forEach(x=>{(m[x.id]=m[x.id]||[]).push(x.exp)});
  return Object.keys(ITEMS).filter(id=>m[id]).map(id=>{const ex=m[id].filter(e=>e!==null);return{id,q:m[id].length,exp:ex.length?Math.min(...ex):null}})}
function itemReason(id){
  const it=ITEMS[id];
  if(!bagCount(id))return 'Đã dùng hết';
  if(it.type==='food'&&s.ateThisSlot)return 'Bạn đã ăn trong buổi này. Đợi sang buổi sau.';
  if(it.where&&!it.where.includes(s.loc))return it.whereTxt;
  return null;
}
function expText(exp){if(exp===null)return 'Không có hạn';const n=exp-s.day;return n<=0?'Hỏng sau tối nay':n===1?'Còn đến hết ngày mai':`Còn ${n+1} ngày`}

/* ============ State ============ */
function newState(){return{started:false,over:false,day:1,slot:0,loc:'home',money:START_MONEY,no:70,nl:80,tt:65,sk:80,
  name:'Minh',gender:'nam',mess:0,askCount:0,accrued:0,paid1:false,shiftHalf:0,absences:0,classes:0,shifts:0,study:0,noodleToday:0,noodleTotal:0,cooked:0,
  classToday:0,shiftToday:0,mealsToday:0,spentToday:0,relaxToday:0,cookedToday:0,
  classCh:{1:0,2:0,3:0,4:0},shiftCh:{1:0,2:0,3:0,4:0},studyCh:{1:0,2:0,3:0,4:0},
  ateThisSlot:false,bikeBroken:0,lent:0,flags:{},log:[],hist:[],sumNo:0,sumTt:0,samples:0,
  q:{},pin:null,daily:[],
  bag:[{id:'mi',exp:null},{id:'mi',exp:null},{id:'mi',exp:null},{id:'nguyenlieu',exp:3},{id:'caphe',exp:null}]}}
/* Mọi chữ người chơi đọc đi qua nm() để thay tên mặc định bằng tên người chơi */
const nm=t=>s&&s.name&&s.name!=='Minh'?String(t).replace(/Minh/g,s.name):t;
/* Độ bừa bộn phòng: 0 gọn gàng (0–33), 1 hơi bừa (34–66), 2 bừa bộn (67–100) */
const MESS_LV=['Gọn gàng','Hơi bừa','Bừa bộn'];
const lvOf=m=>m>=67?2:m>=34?1:0,messLv=()=>lvOf(s.mess);
const addMess=n=>{s.mess=clamp(s.mess+n)};
function addLog(text,tone=''){text=nm(text);s.log.unshift({d:s.day,sl:s.slot,text,tone});if(s.log.length>50)s.log.length=50;showToast(text,tone)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function loadSaved(){try{const r=localStorage.getItem(KEY);return r?JSON.parse(r):null}catch(e){return null}}

/* ============ Âm thanh (src/audio.js, DESIGN_SPEC mục 6) ============
 * Mọi lệnh gọi đi qua au(): chưa có GameAudio (trình mô phỏng chạy trong Node) hoặc chưa init thì không làm gì.
 * init() chỉ gọi ở lần bấm "Bắt đầu câu chuyện" hoặc "Chơi tiếp" đầu tiên. Cài đặt âm lượng lưu riêng, không nằm trong bản lưu game. */
const AUDIO_KEY='ba-muoi-ngay-sg-audio';
const GA=()=>typeof window!=='undefined'&&window.GameAudio&&window.GameAudio.ctx?window.GameAudio:null;
function au(m,...a){const A=GA();if(A&&typeof A[m]==='function')try{A[m](...a)}catch(e){}}
const sfx=n=>au('sfx',n);
let audioPref={music:.6,sfx:.8,muted:false};
try{const r=localStorage.getItem(AUDIO_KEY);if(r)audioPref={...audioPref,...JSON.parse(r)}}catch(e){}
function audioSave(){try{localStorage.setItem(AUDIO_KEY,JSON.stringify(audioPref))}catch(e){}}
function audioStart(){
  const A=typeof window!=='undefined'?window.GameAudio:null;if(!A||A.ctx)return;
  try{A.init();A.setVolume('music',audioPref.music);A.setVolume('sfx',audioPref.sfx);A.setMuted(audioPref.muted)}catch(e){}
}
const LOC_MUSIC={home:'home',school:'school',store:'store',street:'street',market:'street',cafe:'cafe',park:'park',mall:'mall'};
/* nhạc theo màn hình và địa điểm; mở cửa sổ không đổi bài */
function syncMusic(){
  if(mode==='title'||mode==='create')au('play','title');
  else if(mode==='game'&&s){au('play',s.over?'summary':LOC_MUSIC[s.loc]);au('setNight',!s.over&&s.slot===3)}
}
/* một tiếng cho mỗi hành động theo tổng hiệu ứng chỉ số */
const statSfx=out=>{const t=Object.values(out).reduce((a,b)=>a+b,0);if(t>0)sfx('statUp');else if(t<0)sfx('statDown')};
/* cảnh báo chỉ kêu khi mới xuất hiện, không lặp lại khi vẽ lại giao diện */
let prevWarn=new Set();
function warnSfx(){
  const w=new Set();if(noteAct==='school'||noteAct==='clean')w.add(noteAct);STATS.forEach(S=>{if(s[S.k]<25)w.add(S.k)});
  if([...w].some(k=>!prevWarn.has(k)))sfx('warn');prevWarn=w;
}
document.addEventListener('click',e=>{if(e.target&&e.target.closest&&e.target.closest('button'))sfx('click')},true);
function audioPanelHTML(){
  const pct=v=>Math.round(v*100)+'%';
  return `<div class="aud well">
    <label for="volM">Nhạc nền</label><input type="range" id="volM" min="0" max="1" step="0.05" value="${audioPref.music}"><span class="num" id="volMv">${pct(audioPref.music)}</span>
    <label for="volS">Hiệu ứng</label><input type="range" id="volS" min="0" max="1" step="0.05" value="${audioPref.sfx}"><span class="num" id="volSv">${pct(audioPref.sfx)}</span>
    <button class="btns" type="button" id="audMute" aria-pressed="${audioPref.muted}">Tắt tiếng</button></div>`;
}

/* ============ Locations & actions ============ */
const LOCS={
  home:{name:'Phòng trọ',short:'Phòng trọ',sub:'Hẻm 42 · ở ghép với Khoa',cost:0,open:()=>null},
  street:{name:'Quán ăn đầu hẻm',short:'Quán ăn',sub:'Bánh mì, cơm tấm, phở',cost:0,open:()=>null},
  market:{name:'Chợ phường',short:'Chợ',sub:'Nguyên liệu, mì gói, trái cây, thuốc',cost:0,open:s=>s.slot<=2?null:'Chợ đã dọn hàng'},
  park:{name:'Công viên bờ kênh',short:'Công viên',sub:'Chạy bộ, đi dạo, hóng gió',cost:0,open:()=>null},
  cafe:{name:'Cà phê Gác Nhỏ',short:'Cà phê',sub:'Cà phê, ngồi chill, gặp bạn bè',cost:5000,open:()=>null},
  school:{name:'Trường đại học',short:'Trường',sub:'Giảng đường, thư viện, căng tin',cost:6000,open:s=>isWE(s.day)?'Cuối tuần trường nghỉ':s.slot===3?'Trường đóng cửa buổi tối':null},
  store:{name:'Cửa hàng tiện lợi',short:'Cửa hàng',sub:'Nơi Minh làm thêm · mở 24 giờ',cost:0,open:()=>null},
  mall:{name:'Trung tâm thương mại',short:'TTTM',sub:'Buffet, rạp phim, cửa hàng quần áo',cost:12000,open:s=>s.slot>=1?null:'TTTM mở cửa từ 10h'},
};
const shiftPay=s=>{const base=s.slot===3?110000:90000;return s.nl<15?Math.round(base/2):s.tt<25?base-20000:base};
const canShift=s=>(!isWE(s.day)&&s.slot===0)?'Buổi sáng ngày thường Minh đi học':s.slot===1?'Cửa hàng xếp ca sáng cuối tuần, ca chiều và ca tối':null;
const IDLE={id:'idle',k:'act',n:'Ngồi nghỉ một lúc',d:'Không làm gì, để thời gian trôi sang buổi sau.',eff:{nl:3,tt:-1},free:true};
const buy=(item,cost,qty,n)=>({id:'buy_'+item,k:'buy',n,d:ITEMS[item].d,cost,qty,eff:{},note:()=>`+${qty} vào túi`,run:s=>bagAdd(item,qty)});
const A={
  home:[
    {id:'ship',k:'meal',n:'Đặt đồ ăn qua app',d:'Tiện, nhưng gánh thêm phí giao hàng.',cost:68000,eff:{no:40,tt:5}},
    {id:'nap',k:'act',n:'Ngủ một giấc',d:'Hồi năng lượng.',eff:{nl:22,tt:3},when:s=>s.slot===3?'Buổi tối thì đi ngủ luôn':null},
    {id:'net',k:'act',n:'Lướt mạng, xem phim',d:'Giải trí miễn phí.',eff:{tt:7,nl:-2,sk:-1}},
    {id:'clean',k:'act',n:'Dọn phòng, giặt đồ',d:'Phòng gọn thì đầu óc nhẹ.',eff:()=>({tt:[5,8,12][messLv()],nl:-6}),note:()=>`Phòng: ${MESS_LV[messLv()]} → ${MESS_LV[lvOf(Math.max(0,s.mess-50))]}`,run:()=>addMess(-50)},
    {id:'free',k:'act',n:'Nhận vẽ thuê',d:'Vẽ minh họa cho khách quen trên mạng. Trả tiền ngay.',gain:80000,eff:{nl:-18,tt:-4},when:s=>s.slot>=2?null:'Khách chỉ gửi việc từ chiều'},
    {id:'sleep',k:'act',n:'Đi ngủ sớm',d:'Kết thúc ngày, hồi thêm năng lượng khi ngủ.',eff:{},note:s=>'Năng lượng +15 khi ngủ'+(s.slot===3&&s.no<HUNGRY_BED?' · Bụng đói: ngủ sẽ mệt và buồn hơn':''),when:s=>s.slot===3?null:'Chỉ ngủ sớm vào buổi tối'},
    {id:'askparents',k:'quick',n:'Gọi xin thêm tiền bố mẹ',d:'Bố mẹ gửi thêm 500.000đ, nhưng Minh thấy áy náy.',eff:{tt:-8},when:s=>s.askCount<2?null:'Đã xin 2 lần rồi',note:()=>'+500k · ảnh hưởng nhiệm vụ Tự lập',run:s=>{s.money+=500000;s.askCount++}},
  ],
  street:[
    {id:'comtam',k:'meal',n:'Cơm tấm sườn',d:'No lâu, giá vừa phải.',cost:40000,eff:{no:35,tt:4}},
    {id:'pho',k:'meal',n:'Phở bò',d:'Nóng hổi, dễ chịu.',cost:55000,eff:{no:38,tt:6,sk:1}},
    {id:'bunbo',k:'meal',n:'Bún bò đặc biệt',d:'Đủ topping. Sang nhẹ.',cost:75000,eff:{no:45,tt:9}},
    buy('banhmi',20000,1,'Bánh mì mang đi'),
    buy('xoi',25000,1,'Xôi gà mang đi'),
    {id:'trada',k:'act',n:'Ngồi trà đá, tám chuyện',d:'Rẻ mà vui.',cost:10000,eff:{tt:6,nl:3}},
    {id:'oc',k:'act',n:'Đi ăn ốc với bạn',d:'Vui, no, nhưng tốn.',cost:150000,eff:{no:20,tt:16,nl:-5},when:s=>s.slot===3?null:'Quán ốc chỉ mở buổi tối'},
  ],
  market:[
    buy('nguyenlieu',95000,3,'Nguyên liệu 3 bữa'),
    buy('mi',30000,5,'Lốc 5 gói mì'),
    buy('traicay',25000,1,'Trái cây cắt sẵn'),
    buy('sua',12000,1,'Hộp sữa tươi'),
    buy('thuoc',45000,1,'Thuốc cảm'),
    {id:'stroll',k:'act',n:'Dạo chợ, ngắm hàng',d:'Không mua gì cũng vui.',eff:{tt:3,nl:-4}},
  ],
  park:[
    {id:'bap',k:'meal',n:'Bắp xào bên đường',d:'Ăn vặt rẻ.',cost:15000,eff:{no:12,tt:2}},
    {id:'run',k:'act',n:'Chạy bộ 3 km',d:'Mệt nhưng khỏe người.',eff:{sk:7,tt:5,nl:-16,no:-8},when:s=>s.slot===1?'Trưa nắng gắt, chạy dễ say nắng':null},
    {id:'walk',k:'act',n:'Đi dạo bờ kênh',d:'Thư giãn nhẹ nhàng.',eff:{tt:7,nl:-5}},
    {id:'bench',k:'act',n:'Ngồi ghế đá nghỉ',d:'Hồi sức một chút.',eff:{nl:8,tt:2}},
  ],
  cafe:[
    {id:'cfsd',k:'drink',n:'Cà phê sữa đá tại quán',d:'Tỉnh táo tức thì. Đồ uống không tính là bữa ăn.',cost:25000,eff:{nl:14,tt:3,no:3}},
    buy('caphe',18000,1,'Cà phê lon mang đi'),
    buy('banhngot',30000,1,'Bánh ngọt mang đi'),
    {id:'khoa',k:'act',n:'Cà phê với Khoa',d:'Ngồi tán chuyện với bạn cùng phòng, kể nhau nghe tháng đầu ở Sài Gòn.',cost:30000,eff:{tt:14,nl:4},story:1,show:s=>s.q.q3_khoa==='active',when:s=>(s.day===20||s.day===21)&&s.slot===2?null:'Khoa hẹn buổi chiều ngày 20 hoặc 21',run:s=>{s.flags.metKhoa=1}},
    {id:'chill',k:'act',n:'Ngồi chill, đọc sách',d:'Một góc yên tĩnh.',cost:45000,eff:{tt:13,nl:6}},
  ],
  school:[
    {id:'canteen',k:'meal',n:'Cơm căng tin',d:'Suất cơm sinh viên, rẻ nhất khu vực.',cost:25000,eff:{no:33,tt:1},when:s=>s.slot===1?null:'Căng tin chỉ mở buổi trưa'},
    {id:'exam',k:'act',n:'Làm bài kiểm tra giữa kỳ',d:'Bài kiểm tra đầu tiên của năm nhất. Kết quả dựa trên điểm học tập.',eff:{nl:-12,tt:-3,no:-4},story:1,show:s=>s.day===29&&!s.flags.examTaken,when:s=>s.slot===0?null:'Bài kiểm tra diễn ra buổi sáng',
      pre:s=>{s.classes++;s.classToday=1;s.classCh[chOf(s.day)]++;s.flags.examTaken=1;s.flags.examScore=studyScore()},
      run:s=>{const p=s.flags.examScore;queue.push(ev('Kết quả kiểm tra giữa kỳ',p>=75?`“Bài của em được ${p} điểm, thuộc nhóm cao nhất lớp. Giữ phong độ nhé!”`:p>=55?`“Em được ${p} điểm, đạt yêu cầu. Chịu khó tự học thêm thì sẽ khá hơn.”`:`“Em chỉ được ${p} điểm, chưa đạt. Phần này em phải học lại.”`,[{l:p>=55?'Dạ, em cảm ơn thầy':'Dạ, em sẽ cố hơn'}],'hai'))}},
    {id:'class',k:'act',n:'Lên lớp',d:'Học trên giảng đường. Mỗi buổi tăng điểm học tập; vắng buổi sáng ngày thường bị tính vắng học.',eff:{nl:-10,tt:-2,no:-4},show:s=>s.day!==29,when:s=>s.slot===0?null:'Lớp học buổi sáng',note:()=>'Điểm học tập tăng',pre:s=>{s.classes++;s.classToday=1;s.classCh[chOf(s.day)]++}},
    {id:'library',k:'act',n:'Học ở thư viện',d:'Tự học, làm bài tập nhóm. Tăng điểm học tập.',eff:{nl:-8,tt:-2},when:s=>(s.slot===1||s.slot===2)?null:'Thư viện mở buổi trưa và chiều',note:()=>'Điểm học tập tăng',pre:s=>{s.study++;s.studyCh[chOf(s.day)]++}},
    {id:'club',k:'act',n:'Sinh hoạt CLB',d:'Gặp các anh chị khóa trên, vui và có thêm bạn.',eff:{tt:9,nl:-6},when:s=>s.slot===2?null:'CLB sinh hoạt buổi chiều'},
    {id:'campusnap',k:'act',n:'Chợp mắt ở ghế đá',d:'Nghỉ trưa dưới tán cây sân trường.',eff:{nl:12},when:s=>s.slot===1?null:'Chỉ nghỉ được giờ trưa'},
  ],
  store:[
    {id:'boxmeal',k:'meal',n:'Cơm hộp hâm nóng',d:'Ăn nhanh ngay tại quầy.',cost:30000,eff:{no:30,tt:1}},
    buy('mi',30000,5,'Lốc 5 gói mì'),
    buy('caphe',18000,1,'Cà phê lon'),
    buy('sua',12000,1,'Hộp sữa tươi'),
    {id:'interview',k:'act',n:'Phỏng vấn xin việc',d:'Gặp chị Mai, quản lý cửa hàng, để xin làm part-time.',eff:{nl:-4,tt:3},story:1,show:s=>!s.flags.hired,when:s=>(!isWE(s.day)&&s.slot===0)?'Buổi sáng ngày thường Minh đi học':null,
      run:s=>{s.flags.hired=1;queue.push(ev('Nhận việc part-time','“Em làm được ca chiều và ca tối các ngày, cuối tuần thêm ca sáng. Mỗi ca 4 tiếng, 90 nghìn, ca tối 110 nghìn. Lương trả ngày 15 và cuối tháng. Mai em bắt đầu được rồi.”',[{l:'Dạ, em cảm ơn chị'}],'mai'))}},
    {id:'shift',k:'act',n:'Làm ca part-time',d:'Đứng quầy thu ngân, xếp hàng lên kệ. Ca 4 tiếng; ca tối được trả cao hơn nhưng mệt hơn.',eff:s=>s.slot===3?{nl:-28,tt:-4,sk:-2,no:-4}:{nl:-20,tt:-3,no:-4},show:s=>!!s.flags.hired,when:canShift,note:s=>`+${fk(shiftPay(s))} lương`,
      pre:s=>{s.accrued+=shiftPay(s);s.shifts++;s.shiftToday++;s.shiftCh[chOf(s.day)]++}},
    {id:'advance',k:'quick',n:'Xin ứng lương',d:'Ứng trước 300.000đ từ lương đang chờ. Không mất lãi, mỗi kỳ lương ứng được 1 lần.',eff:{},show:s=>!!s.flags.hired,when:s=>s.accrued<300000?'Cần có đủ 300k lương đang chờ':s.flags['adv'+(s.paid1?2:1)]?'Kỳ lương này đã ứng rồi':null,note:()=>'+300k · trừ vào lương chờ',run:s=>{s.money+=300000;s.accrued-=300000;s.flags['adv'+(s.paid1?2:1)]=1}},
  ],
  mall:[
    {id:'buffet',k:'meal',n:'Buffet lẩu',d:'Ăn cho đã.',cost:199000,eff:{no:50,tt:15,sk:-1}},
    {id:'gift',k:'buy',n:'Quà sinh nhật mẹ',d:'Chiếc khăn lụa mẹ thích, gói kèm tấm thiệp tự viết.',cost:300000,eff:{tt:6},story:1,show:s=>s.q.q4_gift==='active',run:s=>{s.flags.gift=1}},
    {id:'movie',k:'act',n:'Xem phim',d:'Suất chiếu mới nhất.',cost:110000,eff:{tt:18,nl:-4}},
    {id:'shop',k:'act',n:'Mua quần áo mới',d:'Vui tức thì.',cost:350000,eff:{tt:22}},
    {id:'window',k:'act',n:'Đi dạo ngắm đồ',d:'Miễn phí. Nhưng dễ bị dụ mua.',eff:{tt:4,nl:-8},run:()=>{if(Math.random()<0.35)queue.push(evImpulse())}},
  ],
};
const CATS=[
  {id:'eat',n:'Ăn uống',ic:'eat',ks:['meal','drink'],verb:'Ăn'},
  {id:'buy',n:'Mua',ic:'basket',ks:['buy'],verb:'Mua'},
  {id:'act',n:'Hoạt động',ic:'act',ks:['act'],verb:'Làm'},
  {id:'bank',n:'Tiền bạc',ic:'money',ks:['quick'],verb:'Thực hiện'},
];
const locActs=()=>[...A[s.loc].filter(a=>!a.show||a.show(s)),IDLE];

function effOf(o){return typeof o.eff==='function'?o.eff(s):(o.eff||{})}
function reason(a){
  if(!a.free){const lr=LOCS[s.loc].open(s);if(lr)return lr}
  if(a.when){const r=a.when(s);if(r)return r}
  if(a.k==='meal'&&s.ateThisSlot)return 'Đã ăn trong buổi này';
  if(a.cost&&s.money<a.cost)return 'Không đủ tiền';
  return null;
}
function applyEff(e){
  const out={};
  for(const {k} of STATS){let v=e[k]||0;if(!v)continue;
    if(v>0&&k==='no'&&s.no>80)v*=0.5;
    if(v>0&&k==='tt'&&s.tt>85)v*=0.6;
    const b=s[k];s[k]=clamp(Math.round(s[k]+v));out[k]=s[k]-b}
  return out;
}
function chipsHTML(o,withMoney=true){
  const e=o.rw||effOf(o),out=[];
  if(withMoney&&o.cost)out.push(['−'+fk(o.cost),'money down']);
  if(withMoney&&o.gain)out.push(['+'+fk(o.gain),'money up']);
  for(const S of STATS){const v=e[S.k];if(v)out.push([`${S.n} ${v>0?'+':'−'}${Math.abs(v)}`,v>0?'up':'down',S.k])}
  const n=typeof o.note==='function'?o.note(s):o.note;if(n)out.push([n,'note']);
  if(o.x)out.push([o.x,'note']);
  if(o.rwTxt)out.push([o.rwTxt,'note']);
  return out.map(([t,c,k])=>`<span class="chip ${c}"${k?` data-k="${k}"`:''}>${t}</span>`).join('');
}

/* ============ Core loop ============ */
function doAction(a){
  if(s.over||win||reason(a))return false;
  const m0=s.money;
  if(a.k==='act'&&s.slot===3)s.noBed=s.no; // độ no lúc chọn hành động cuối ngày, trước mọi lần trừ
  startActScene(a);
  if(a.pre)a.pre(s);
  if(a.cost){s.money-=a.cost;s.spentToday+=a.cost}
  if(a.gain)s.money+=a.gain;
  const out=applyEff(effOf(a));
  if(a.run)a.run(s);
  txAdd(a.n,s.money-m0);
  if(RELAX.includes(a.id))s.relaxToday=1;
  popFx(out,s.money-m0);
  addLog(a.n+(a.cost?` (−${fk(a.cost)})`:'')+(a.gain?` (+${fk(a.gain)})`:''));
  statSfx(out);if(a.k==='meal'||a.k==='drink')sfx('eat');if(a.id==='nap'||a.id==='sleep')sfx('sleep');if(a.id==='shift')sfx('register');
  if(a.k==='meal'){s.ateThisSlot=true;s.mealsToday++;if(s.loc==='home')addMess(6)}
  if(a.k==='act'){closeMenu();endSlot(a)}
  else if(a.k==='meal'||a.k==='drink')closeMenu();
  afterChange();return true;
}
function useItem(id){
  const r=itemReason(id);if(r||s.over)return;
  const it=ITEMS[id];
  const out=applyEff(effOf(it));
  bagTake(id);if(it.after)it.after(s);
  statSfx(out);if(it.type!=='med')sfx('eat');
  if(it.type==='food'){s.ateThisSlot=true;s.mealsToday++;if(s.loc==='home')addMess(id==='nguyenlieu'?10:6)}
  popFx(out,0);
  addLog(it.verb?`${it.verb} ăn`:`Dùng ${it.n.toLowerCase()}`);
  if(!bagCount(id))bagSel=null;
  refresh();
}
function endSlot(a){
  if(!isWE(s.day)&&s.slot===0&&a.id!=='class'&&a.id!=='exam'&&!a.excused){
    s.absences++;addLog(s.absences===1?'Vắng buổi học sáng. Điểm học tập bị trừ.':'Lại vắng một buổi học.','bad');
  }
  if(s.slot===3&&s.noBed==null)s.noBed=s.no;
  s.no-=9;s.tt-=2;
  if(s.loc==='home'){s.tt-=[0,1,2][messLv()];addMess(2)}
  if(!['nap','bench','campusnap'].includes(a.id))s.nl-=4;
  if(s.no<25){s.tt-=4;s.sk-=2}
  if(s.no<=0)s.sk-=4;
  if(s.nl<15){s.tt-=3;s.sk-=2}
  for(const {k} of STATS)s[k]=clamp(Math.round(s[k]));
  s.samples++;s.sumNo+=s.no;s.sumTt+=s.tt;
  s.ateThisSlot=false;
  if(s.slot<3){s.slot++;slotEvents()}
  else endDay(a.id==='sleep');
}
function endDay(early){
  /* bụng đói khi đi ngủ: xét độ no lúc chọn hành động cuối ngày (dưới 30), rồi mới trừ độ no qua đêm */
  const noBed=s.noBed!=null?s.noBed:s.no;s.noBed=null;
  const ml=messLv(),messy=ml===2?10:0;
  if(noBed>=HUNGRY_BED){s.nl+=50-messy;s.sk+=2}
  else{s.nl+=35-messy;s.tt-=6;s.sk-=2;addLog('Đi ngủ với cái bụng đói, ngủ không ngon.','bad')}
  if(early){s.nl+=15;s.tt+=2}
  if(ml===0)s.tt+=2;
  s.no-=10;
  addMess(10);
  for(const {k} of STATS)s[k]=clamp(Math.round(s[k]));
  checkQuests();
  s.daily.forEach(d=>{if(!d.st&&DAILY[d.id].eod){const [c,m]=DAILY[d.id].prog(s);if(c>=m)dailyDone(d)}});
  s.daily.forEach(d=>{if(!d.st)d.st='fail'});
  resolveDue(s.day);
  s.hist.push({d:s.day,no:s.no,nl:s.nl,tt:s.tt,sk:s.sk,money:s.money});
  const spoiled=s.bag.filter(x=>x.exp!==null&&x.exp<=s.day);
  if(spoiled.length){s.bag=s.bag.filter(x=>!(x.exp!==null&&x.exp<=s.day));
    const c={};spoiled.forEach(x=>c[x.id]=(c[x.id]||0)+1);
    addLog('Đồ hỏng phải bỏ: '+Object.entries(c).map(([id,n])=>`${ITEMS[id].n.toLowerCase()} ×${n}`).join(', '),'bad')}
  s.noodleToday=0;s.classToday=0;s.shiftToday=0;s.mealsToday=0;s.spentToday=0;s.relaxToday=0;s.cookedToday=0;
  if(s.bikeBroken>0)s.bikeBroken--;
  s.loc='home';s.ateThisSlot=false;
  if(s.day>=30){finish();return}
  s.day++;s.slot=0;
  dayEvents();
}
function skipSlot(label){addLog(label);endSlot({id:'skip',excused:true})}
function payBill(amt,name){
  if(s.money>=amt){s.money-=amt;txAdd(name[0].toUpperCase()+name.slice(1),-amt);return true}
  const short=amt-s.money;txAdd(name[0].toUpperCase()+name.slice(1),-s.money);s.money=0;s.tt=clamp(s.tt-12);
  addLog(`Thiếu ${fk(short)} cho ${name}. Đã trừ hết tiền trong ví.`,'bad');return false;
}
function travelCost(id){const c=LOCS[id].cost;return c&&s.bikeBroken>0?c*3:c}
function travel(id){
  if(id===s.loc)return;
  let c=travelCost(id);if(LOCS[id].open(s))return;
  const walk=c>0&&s.money<c;
  if(walk){c=0;const o=applyEff({nl:-8,tt:-2});popFx(o,0)}
  s.money-=c;s.spentToday+=c;s.loc=id;txAdd(`Đi tới ${LOCS[id].short}`,-c);
  hideWin();closeMenu();
  addLog(walk?`Hết tiền xăng, đi bộ tới ${LOCS[id].name}`:`Đi tới ${LOCS[id].name}`+(c?` (−${fk(c)} ${s.bikeBroken?'xe ôm':'xăng'})`:''),walk?'bad':'');
  const st=$('stage');st.classList.add('fade');setTimeout(()=>st.classList.remove('fade'),230);
  if(c)popFx({},-c);
  if(id==='home'||id==='store')sfx('door');
  if((s.slot===1||s.slot===2)&&!s.flags['rain'+s.day]&&Math.random()<0.15)queue.push(rainEv(s));
  if(id==='school'&&!s.flags.metHai){s.flags.metHai=1;queue.push(ev('Chào mừng tân sinh viên','“Chào em Minh! Lớp mình học buổi sáng từ thứ Hai đến thứ Sáu. Thầy chấm điểm học tập dựa trên chuyên cần, giờ tự học ở thư viện và bài kiểm tra giữa kỳ sáng ngày 29. Có gì khó cứ tìm thầy.”',[{l:'Dạ, em cảm ơn thầy'}],'hai'))}
  afterChange();
}

/* ============ Quests ============ */
function activateChapter(n){
  QUESTS.filter(q=>q.ch===n).forEach(q=>{if(!s.q[q.id])s.q[q.id]='active'});
  s.pin=null;
  queue.push({kind:'chapter',n,title:`Chương ${n}`,choices:[{l:'Bắt đầu chương'}]});
}
function questProg(q){const [c,m]=q.prog(s);const lbl=q.label?q.label(s):q.money?`${fk(c)} / ${fk(m)}`:`${q.unit?`${c}/${m} ${q.unit}`:c>=m?'Xong':'Chưa xong'}`;return {c,m,lbl,pct:Math.round(Math.min(1,c/m)*100)}}
function completeQuest(q){
  s.q[q.id]='done';
  const out=applyEff(q.rw||{});
  if(q.bonus)s.accrued+=q.bonus;
  if(q.item)bagAdd(q.item[0],q.item[1]);
  popFx(out,0);
  addLog(`Hoàn thành nhiệm vụ: ${q.t}`,'quest');sfx('questDone');showToast(`Hoàn thành nhiệm vụ · ${q.t}`,'quest');
}
function failQuest(q){s.q[q.id]='fail';sfx('questFail');addLog(`Nhiệm vụ thất bại: ${q.t}`,'bad')}
function checkQuests(){
  if(s.day>=8&&s.day<=14&&s.tt<30)s.flags.mood2Fail=1;
  QUESTS.forEach(q=>{if(s.q[q.id]!=='active')return;
    if(q.fail&&q.fail(s)){failQuest(q);return}
    if(!q.endCheck){const {c,m}=questProg(q);if(c>=m)completeQuest(q)}});
}
function resolveDue(day){
  QUESTS.forEach(q=>{if(s.q[q.id]!=='active'||q.due>day)return;
    if(q.endCheck){q.pass(s)?completeQuest(q):failQuest(q)}else failQuest(q)});
}
function genDaily(){
  const d=s.day,ids=isWE(d)?[s.flags.hired?'shift1':'relax','frugal']:['class1',(d%2===0&&chOf(d)>=2)?'cook':'eat2'];
  s.daily=ids.map(id=>({id,st:null}));
}
function dailyDone(d){d.st='done';const out=applyEff({tt:3});popFx(out,0);addLog(`Xong việc hôm nay: ${DAILY[d.id].t}`,'good')}
function checkDaily(){s.daily.forEach(d=>{if(d.st||DAILY[d.id].eod)return;const [c,m]=DAILY[d.id].prog(s);if(c>=m)dailyDone(d)})}
function trackedQuest(){
  if(s.pin&&s.q[s.pin]==='active')return QBY[s.pin];
  return QUESTS.filter(q=>s.q[q.id]==='active').sort((a,b)=>a.due-b.due)[0]||null;
}
function studyScore(){
  const q=QUESTS.filter(x=>x.study&&s.q[x.id]==='done').length;
  return clamp(Math.round(s.classes/CLASS_DAYS*61)+Math.min(s.study,8)*3+q*5-s.absences*2);
}
const dueText=q=>q.due===s.day?'hạn hết hôm nay':`hạn ngày ${q.due} · còn ${q.due-s.day+1} ngày`;

/* ============ Events ============ */
const ev=(title,text,choices,who)=>({title,text,choices,who});
const evImpulse=()=>ev('Giày đang sale 40%','Đôi giày bạn để ý từ lâu đang giảm giá, chỉ còn 420.000đ.',[
  {l:'Mua luôn',cost:420000,eff:{tt:14}},{l:'Thôi, không cần',eff:{tt:-3}}]);
function rainEv(s){s.flags['rain'+s.day]=1;return ev('Mưa to bất chợt','Trời đổ mưa như trút, đường bắt đầu ngập.',[
  {l:'Trú mưa, gọi ly trà',cost:20000,eff:{tt:2}},{l:'Đội mưa đi tiếp',eff:{sk:-6,tt:-4}}])}
const EVENTS=[
  {id:'lau',w:3,when:s=>s.slot===3&&!isWE(s.day),mk:()=>ev('Lớp rủ đi ăn lẩu','“Tối nay cả lớp đi lẩu nướng, mày đi không?” Khoa hỏi.',[
    {l:'Đi luôn',cost:150000,eff:{tt:14,no:20,nl:-8}},{l:'Ở nhà',eff:{tt:-4}}],'khoa')},
  {id:'bike',w:2,when:s=>s.slot===0&&s.bikeBroken===0&&(s.flags.bikeN||0)<2,mk:s=>{s.flags.bikeN=(s.flags.bikeN||0)+1;return ev('Xe chết máy','Chiếc xe máy cũ bố cho đề không nổ. Thợ đầu hẻm báo giá sửa 250.000đ.',[
    {l:'Sửa ngay',cost:250000,eff:{tt:-2}},{l:'Đi xe ôm công nghệ vài hôm',eff:{tt:-4},x:'Phí đi lại ×3 trong 4 ngày',run:s=>{s.bikeBroken=4}}])}},
  {id:'found',w:.6,once:1,when:()=>true,mk:()=>ev('Nhặt được tiền','Tờ 50.000đ rơi trên vỉa hè, xung quanh không có ai.',[
    {l:'Bỏ túi',gain:50000,eff:{tt:3}},{l:'Gửi bảo vệ gần đó',eff:{tt:8}}])},
  {id:'praise',w:5,once:1,when:s=>s.loc==='store'&&s.shifts>=8&&s.slot>=2,mk:()=>ev('Chị Mai khen','“Mấy ca của Minh quầy lúc nào cũng gọn gàng. Chị thưởng nóng nè.”',[
    {l:'Em cảm ơn chị',gain:100000,eff:{tt:10}}],'mai')},
  /* mưa: ở công viên buổi trưa hoặc chiều (khi đi lại thì xét trong travel), tối đa 1 lần mỗi ngày */
  {id:'rain',w:2,when:s=>s.loc==='park'&&(s.slot===1||s.slot===2)&&!s.flags['rain'+s.day],mk:s=>rainEv(s)},
  /* hai nơi trong nhà thay cho mưa; mỗi sự kiện chỉ một lần trong tháng */
  {id:'cafeFull',w:2,once:1,when:s=>s.loc==='cafe'&&s.slot>=1,mk:()=>ev('Quán hết chỗ','“Quán kín bàn rồi, em ngồi chung với bạn này được không?” Người ngồi cùng là một anh năm ba cùng ngành Thiết kế.',[
    {l:'Ngồi chung, bắt chuyện',eff:{tt:6},x:'Có thêm một người quen'},{l:'Mua mang về',eff:{tt:-1}}])},
  {id:'mallCard',w:2,once:1,when:s=>s.loc==='mall'&&s.slot>=1,mk:()=>ev('Mời làm thẻ thành viên','Nhân viên mời đăng ký thẻ thành viên 99.000đ, hứa tích điểm đổi quà.',[
    {l:'Đăng ký thẻ 99k',cost:99000,eff:{tt:2},x:'Điểm tích lũy chưa dùng được trong tháng này'},{l:'Cảm ơn, để sau',eff:{tt:1}}])},
  {id:'lend',w:1.5,once:1,when:s=>s.day>=6&&s.day<=19,mk:()=>ev('Khoa hỏi mượn tiền','“Cho tao mượn 300k, cuối tháng trả nha. Tháng này nhà tao gửi tiền trễ.”',[
    {l:'Cho mượn',cost:300000,eff:{tt:3},x:'Hẹn trả ngày 28',run:s=>{s.lent=300000}},{l:'Từ chối',eff:{tt:-6}}],'khoa')},
  {id:'phone',w:1,once:1,when:()=>true,mk:()=>ev('Rơi điện thoại','Điện thoại tuột tay, màn hình nứt một đường dài.',[
    {l:'Thay màn hình',cost:400000},{l:'Dùng tạm',eff:{tt:-10}}])},
  {id:'bday',w:2,once:1,when:s=>isWE(s.day)&&s.slot===3&&s.day!==13,mk:()=>ev('Sinh nhật bạn cùng lớp','Lớp tổ chức sinh nhật cho một bạn ở quán nướng, Khoa cũng đi.',[
    {l:'Góp quà, đi dự',cost:150000,eff:{tt:12,no:15}},{l:'Nhắn tin chúc mừng',eff:{tt:-4}}],'khoa')},
];
function slotEvents(){
  if(s.over)return;
  if(s.sk<=0){queue.push(ev('Ngất xỉu','Cơ thể kiệt quệ, Minh được đưa vào viện. Viện phí 1.200.000đ, nghỉ hết hôm nay.',[
    {l:'Chấp nhận',run:s=>{payBill(1200000,'viện phí');s.sk=45;s.nl=60;s.no=Math.max(s.no,50);s.tt=clamp(s.tt-15);if(!isWE(s.day)&&s.slot===0)s.absences++;s.slot=3;endDay(false)}}]));return}
  if(s.day===13&&s.slot===3&&!s.flags.club){s.flags.club=1;queue.push(ev('Đêm nhạc chào tân sinh viên','“Tối nay CLB mình diễn ở sân trường, em tới chơi nha! Vé ủng hộ 100 nghìn.”',[
    {l:'Đi xem, mua vé 100k',cost:100000,eff:{tt:16,nl:-10},x:'Hết buổi tối',run:s=>{s.flags.clubGo=1;skipSlot('Đi đêm nhạc chào tân sinh viên')}},
    {l:'Ở nhà nghỉ ngơi',eff:{tt:-8}}],'linh'));return}
  if(s.day===11&&s.slot===3&&!s.flags.sale){s.flags.sale=1;queue.push(ev('Flash sale 0 giờ','App mua sắm báo: tai nghe không dây giảm 50%, còn 450.000đ. Chỉ còn 3 phút.',[
    {l:'Chốt đơn',cost:450000,eff:{tt:15}},{l:'Đóng app',eff:{tt:-3}}]));return}
  if(s.day===18&&s.slot===3&&!s.flags.momCall){s.flags.momCall=1;queue.push(ev('Mẹ gọi điện','“Con ăn uống có đủ không? Tiền còn đủ xài không con?”',[
    {l:'Con đủ mà, mẹ đừng lo',eff:{tt:5}},{l:'Con xin thêm 500k',gain:500000,eff:{tt:-4},x:'Ảnh hưởng nhiệm vụ Tự lập',run:s=>{s.askCount++}}],'me'));return}
  if(s.slot===0&&s.sk<40&&Math.random()<0.45){queue.push(ev('Bị ốm','Sáng dậy đầu nặng, người nóng hầm hập. Sức khỏe đang yếu.',[
    {l:'Uống thuốc cảm trong túi',need:s=>bagCount('thuoc')?null:'Túi không có thuốc',eff:{sk:12,tt:-1},run:s=>bagTake('thuoc')},
    {l:'Đi khám phòng khám',cost:200000,eff:{sk:25,nl:5},x:'Hết buổi sáng · có giấy xin nghỉ học',run:()=>skipSlot('Nghỉ học có phép vì ốm')},
    {l:'Kệ, ráng chịu',eff:{sk:-5,tt:-6,nl:-10}}]));return}
  if(s.noodleToday>=2&&!s.flags['st'+s.day]&&Math.random()<0.55){s.flags['st'+s.day]=1;queue.push(ev('Đau bụng','Ăn mì gói liên tục, bụng bắt đầu biểu tình.',[
    {l:'Mua men tiêu hóa',cost:30000,eff:{sk:-3}},{l:'Ráng chịu',eff:{sk:-8,tt:-5,nl:-8}}]));return}
  if(Math.random()>0.22)return;
  const pool=EVENTS.filter(e=>!(e.once&&s.flags[e.id])&&e.when(s));
  if(!pool.length)return;
  let r=Math.random()*pool.reduce((a,e)=>a+e.w,0),pick=pool[0];
  for(const e of pool){r-=e.w;if(r<=0){pick=e;break}}
  if(pick.once)s.flags[pick.id]=1;
  queue.push(pick.mk(s));
}
function dayEvents(){
  queue.push({kind:'day',title:`Ngày ${s.day}`,choices:[{l:'Bắt đầu buổi sáng'}]});
  if(CHAPTERS[chOf(s.day)].from===s.day)activateChapter(chOf(s.day));
  const b=BILLS[s.day];
  if(b){const m0=s.money,ok=payBill(b[1],b[0]);if(!ok)s.flags['bill'+s.day]=b[1]-m0;
    if(s.day===5){if(ok)s.flags.rentPaid=1;else s.flags.rentShort=1}
    addLog(`${b[0]}: −${fk(b[1])}`,ok?'':'bad');
    queue.push(s.day===5?ev('Cô Tư thu tiền nhà',ok?'“Đủ rồi nghen con. Học hành cho giỏi, có gì cứ kêu cô.” Cô Tư đếm tiền, cười hiền.':'“Thiếu vậy con? Thôi tháng này cô cho qua, tháng sau nhớ để dành đủ trước mùng 5 nghen.”',[{l:ok?'Dạ, con cảm ơn cô':'Dạ, con xin lỗi cô'}],'tu')
      :ev(`${b[0]} đến hạn`,ok?`Đã tự động trừ ${fmt(b[1])} từ ví.`:`Ví không đủ ${fmt(b[1])}. Đã trừ hết tiền trong ví.`,[{l:'Đã hiểu'}]))}
  if(s.day===15){const x=s.accrued;s.shiftHalf=s.shifts;s.money+=x;s.accrued=0;s.paid1=true;s.flags.pay1=x;txAdd('Lương part-time kỳ 1',x);
    addLog(x?`Nhận lương part-time kỳ 1: +${fk(x)}`:'Chưa có lương part-time vì chưa làm ca nào.',x?'good':'bad');
    queue.push(ev('Lương part-time đầu tiên',x?`“Lương nửa đầu tháng của em nè, ${fmt(x)} cho ${s.shifts} ca. Các ca sau chị tính vào cuối tháng nha.”`:'“Em chưa làm ca nào nên kỳ này chưa có lương. Muốn làm thì ghé cửa hàng nha.”',[{l:x?'Em cảm ơn chị':'Dạ'}],'mai'))}
  if(s.day===28&&s.lent>0){const back=Math.random()<0.65;const amt=s.lent;s.lent=0;
    if(back){s.money+=amt;txAdd('Khoa trả tiền',amt);s.tt=clamp(s.tt+5);addLog(`Khoa trả lại ${fk(amt)}.`,'good');queue.push(ev('Khoa trả tiền','“Trả mày nè, cảm ơn nha. Có gì tao bao trà sữa.”',[{l:'Tốt quá'}],'khoa'))}
    else{s.tt=clamp(s.tt-6);addLog('Khoa hẹn trả sau. Mất 300k.','bad');queue.push(ev('Khoa hẹn lần sau','“Tháng này tao kẹt thiệt, cho tao khất thêm nha.” Khoản 300.000đ coi như chưa về.',[{l:'Đành vậy'}],'khoa'))}}
  genDaily();
  slotEvents();
}

/* ============ Score & ending ============ */
const storeBonus=()=>s.shifts>=18?200000:0;
function computeScore(){
  const bonus=storeBonus(),asset=s.money+s.accrued+bonus,n=Math.max(1,s.samples);
  const F={tien:clamp(asset/2500000,0.05,1.25),no:Math.max(0.05,s.sumNo/n/100),tt:Math.max(0.05,s.sumTt/n/100),sk:Math.max(0.05,s.sk/100)};
  return {asset,bonus,F,score:Math.round(1000*F.tien**0.35*F.no**0.2*F.tt**0.25*F.sk**0.2)};
}
function archetype({F}){
  if(F.sk<0.4&&s.shifts>=24)return ['Cỗ máy làm thêm','Lương part-time về đều, nhưng sức khỏe và việc học đã trả giá.'];
  if(F.tien>=0.9&&(F.no<0.45||F.tt<0.45))return ['Kẻ khổ hạnh','Ví dày lên, còn bụng và tinh thần thì mỏng đi.'];
  if(F.tt>=0.7&&F.tien<0.5)return ['Sống cho hiện tại','Một tháng vui vẻ, nhưng tài khoản gần như trống trơn.'];
  if(Math.min(F.tien,F.no,F.tt,F.sk)>=0.55)return ['Người cân bằng','Học đủ, làm đủ, ăn đủ, vui đủ và vẫn còn dư tiền.'];
  return ['Người sống sót','Qua tháng được, nhưng có vài chỗ hụt hơi.'];
}
const grade=sc=>sc>=800?'S':sc>=700?'A':sc>=580?'B':sc>=450?'C':'D';
function endingLines(){
  const L=[],p=s.flags.examScore;
  L.push(['hai',!s.flags.examTaken?'Minh vắng bài kiểm tra giữa kỳ và phải thi lại vào tháng sau.':p>=75?`Kiểm tra giữa kỳ đạt ${p} điểm. Thầy Hải khen Minh trước lớp.`:p>=55?`Kiểm tra giữa kỳ đạt ${p} điểm, đủ để theo kịp chương trình.`:`Kiểm tra giữa kỳ chỉ đạt ${p} điểm. Thầy Hải nhắc Minh phải học lại phần này.`]);
  L.push(['mai',!s.flags.hired?'Minh không đi làm thêm, cả tháng sống nhờ tiền bố mẹ gửi.':s.shifts>=18?`Làm ${s.shifts} ca trong tháng. Chị Mai giữ Minh lại và thưởng thêm 200.000đ.`:s.shifts>=8?`Làm ${s.shifts} ca trong tháng. Chị Mai tiếp tục xếp ca cho tháng sau.`:`Chỉ làm ${s.shifts} ca. Chị Mai hỏi Minh có muốn làm tiếp không.`]);
  L.push(['me',(s.flags.gift?'Mẹ nhận được món quà Minh mua bằng tiền tự làm, cầm khoe khắp xóm.':'Sinh nhật mẹ, Minh chỉ kịp gọi điện chúc mừng.')+(s.askCount?' Bố mẹ vẫn phải gửi thêm tiền giữa tháng.':'')]);
  if(s.flags.metKhoa)L.push(['khoa','Ở chung một tháng, Khoa đã thành bạn thân của Minh.']);
  if(s.flags.clubGo)L.push(['linh','Chị Linh rủ Minh vào ban truyền thông của CLB.']);
  L.push(['tu',s.flags.rentShort?'Tháng này thiếu tiền nhà. Cô Tư nhắc khéo: tháng sau nhớ để dành đủ trước mùng 5.':'Cô Tư khen Minh là sinh viên ngoan nhất xóm trọ.']);
  return L;
}
function finish(){s.over=true;queue=[];closeMenu();save();render();openWin('end');if($('win').querySelector('.ach.on'))sfx('questDone')}

/* ============ HUD rendering ============ */
/* HUD theo design/04: biểu tượng dùng nền CSS (--i) để co giãn theo lưới --p */
const icURL=k=>{const n=ICO_NEW[k]||k;return Icons.has(n)?Icons.url(n):'data:image/svg+xml,'+encodeURIComponent(ico(k).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '))};
const icTag=k=>`<i class="ic" style="--i:url(${icURL(k)})"></i>`;
const SLOT_IC=['dawn','noon','dusk','night'];
function render(){syncMusic();renderTop();renderTracker();renderCmd();if(win&&win!=='event'&&win!=='end')renderWin()}
function renderTop(){
  $('dayNum').textContent=s.day;
  $('dow').textContent=DOW[dowOf(s.day)];
  $('chap').textContent=`Chương ${chOf(s.day)}`;
  $('slots').innerHTML=SLOT_IC.map((ic,i)=>`<span class="s${i===s.slot?' on':i<s.slot?' past':''}" title="Buổi ${SLOTS[i].toLowerCase()}"${i===s.slot?' aria-current="true"':''}>${icTag(ic)}</span>`).join('')+`<span class="nm">${SLOTS[s.slot]}</span>`;
  $('mstats').innerHTML=STATS.map(S=>{const v=s[S.k];return `<div class="st${v<25?' low':''}" title="${S.n}: ${v}/100" role="img" aria-label="${S.n} ${v}" style="--c:${SCOL[S.k]}"><span class="num v" style="color:${v<25?'':SCOL[S.k]}">${v}</span><span class="sbar well"><i style="--v:${v/100}"></i></span>${icTag(S.k)}</div>`}).join('');
  $('money').textContent=fmt(s.money);
  $('ledger').textContent=`Lương chờ ${fk(s.accrued)}`;
  const L=LOCS[s.loc],cl=L.open(s);
  $('placeName').textContent=L.name;$('placeSub').textContent=nm(L.sub);
  $('placeShut').innerHTML=cl?'<span class="shut">Đang đóng cửa</span>':'';
  const rs=$('roomState');rs.hidden=s.loc!=='home';rs.dataset.l=messLv();$('roomName').textContent=MESS_LV[messLv()];
}
function dailyRow(d){const D=DAILY[d.id],[c,m]=D.prog(s);const lbl=D.label?D.label(s):`${c}/${m}`;
  return `<span class="tr-day${d.st==='done'?' done':''}"><span class="ck${d.st==='done'?' on':d.st==='fail'?' fail':''}"></span><span class="tx">${D.t}</span><span class="pc">${lbl}</span></span>`}
function renderTracker(){
  const q=trackedQuest(),ch=chOf(s.day),dn=s.daily.filter(d=>d.st==='done').length;
  const daily=`<span>Việc hôm nay ${dn}/${s.daily.length}</span>`;
  const h=q?`<div class="h">${icTag('quest')}<div><b>${q.t}</b><p>${q.d}</p></div></div><div class="f"><span class="qtag">${q.due===s.day?'Hạn: hôm nay':`Hạn: ngày ${q.due}`}</span>${daily}</div>`
    :`<div class="h">${icTag('quest')}<div><b>Đã xong nhiệm vụ chương này</b><p>${ch<4?`Chương ${ch+1} mở vào ngày ${CHAPTERS[ch+1].from}.`:'Sống trọn những ngày cuối tháng.'}</p></div></div><div class="f"><span></span>${daily}</div>`;
  $('tracker').innerHTML=nm(h);
}
function catActs(c){return locActs().filter(a=>c.ks.includes(a.k))}
const visCats=()=>CATS.filter(c=>catActs(c).length);
let noteAct=null;
function renderCmd(){
  const cats=visCats(),n=s.bag.length,expiring=s.bag.some(x=>x.exp!==null&&x.exp<=s.day);
  const bill=Object.keys(BILLS).map(Number).find(d=>d>=s.day&&d-s.day<=2),act=QUESTS.filter(q=>s.q[q.id]==='active').length;
  const tool=(id,ic,lb,tip,bd='')=>`<button class="hb" type="button" data-tool="${id}" data-tip="${tip}">${icTag(ic)}<span class="lb">${lb}</span>${bd}</button>`;
  $('cmdbar').innerHTML='<span class="hb-grp hb-acts">'+cats.map((c,i)=>{const list=catActs(c),story=list.some(a=>a.story&&!reason(a));
    return `<button class="hb act" type="button" data-cat="${c.id}" aria-expanded="${menuCat===c.id}" data-tip="${c.n} (${i+1})"><span class="key">${i+1}</span>${icTag(c.ic)}<span class="lb">${c.n}</span>${story?'<span class="sd" title="Có việc cho nhiệm vụ"></span>':''}</button>`}).join('')+'</span><span class="hb-grp hb-tools">'+
    '<span class="sep" aria-hidden="true"></span>'+
    tool('bag','bag','Túi đồ','Túi đồ (B)',n?`<span class="bd${expiring?' warn':''}">${n}</span>`:'')+
    tool('cal','cal','Lịch',bill?`Lịch tháng (L): ngày ${bill} ${BILLS[bill][0].toLowerCase()}`:'Lịch tháng (L)',bill?'<span class="bd dot"></span>':'')+
    tool('tasks','quest','Nhiệm vụ','Nhiệm vụ (J)',act?`<span class="bd">${act}</span>`:'')+
    tool('map','map','Bản đồ','Bản đồ (M)')+
    `<span class="sep" aria-hidden="true"></span><button class="hb menu" type="button" data-tool="sys" aria-expanded="${menuCat==='sys'}" aria-label="Menu" data-tip="Nhật ký, Luật chơi">${icTag('menu')}<span class="lb">Menu</span></button></span>`;
  /* cảnh báo giữa trên, kèm nút làm ngay */
  const closed=LOCS[s.loc].open(s);let t='',btn='',cls='';noteAct=null;
  if(closed){t=`${closed}. Mở Bản đồ để đi nơi khác.`;btn='Bản đồ';noteAct='map';cls='bad'}
  else if(!isWE(s.day)&&s.slot===0&&s.loc!=='school'){const c=travelCost('school');t='Đang giờ học. Không lên lớp sẽ bị tính vắng học.';btn=`Đến trường${c?` (${fk(c)})`:''}`;noteAct='school'}
  else if(s.loc==='home'&&messLv()===2){t='Phòng bừa bộn quá. Ở phòng mỗi buổi tinh thần −2, ngủ hồi ít năng lượng hơn.';btn='Dọn phòng';noteAct='clean'}
  warnSfx();
  const note=$('cmdNote');note.hidden=!t||!!menuCat;note.className='pn note '+cls;$('noteT').textContent=nm(t);$('noteBtn').textContent=btn;
  renderMenu();
}
const effSpans=e=>STATS.filter(S=>e[S.k]).map(S=>{const v=e[S.k];return `<span class="${v<0?'neg':''}" style="--c:${SCOL[S.k]}">${S.n} ${v>0?'+':'−'}${Math.abs(v)}</span>`}).join('');
function menuRow(x){
  const r=reason(x),e=effOf(x),ml=messLv();
  const pr=x.cost?`<span class="num pr">${fk(x.cost)}</span>`:x.gain?`<span class="num pr gain">+${fk(x.gain)}</span>`:'<span class="num pr free">0đ</span>';
  const note=typeof x.note==='function'?x.note(s):x.note;
  const extra=(note?`<span class="k">${note}</span>`:'')+(x.k==='act'&&x.id!=='clean'&&s.loc==='home'&&ml?`<span class="neg" style="--c:var(--c-tt)">Phòng bừa: Tinh thần −${ml}</span>`:'')+(x.k==='quick'||x.k==='buy'?'<span class="k">Không tốn thời gian</span>':'');
  return `<button class="row well" type="button" data-pa="${x.id}" ${r?'disabled':''}><b>${x.n}${x.story?'<span class="qt">Nhiệm vụ</span>':''}</b>${pr}<span class="d">${x.d}</span><span class="efx">${effSpans(e)}${extra}</span>${r?`<span class="why">${r}</span>`:''}</button>`;
}
const SYS_ROWS=[['log','Nhật ký','Những việc đã làm và đã xảy ra (phím N).'],['rules','Luật chơi','Cách chơi, công thức điểm, phím tắt.'],['audio','Âm thanh','Âm lượng nhạc nền, hiệu ứng, tắt tiếng.'],['home','Màn hình chính','Tiến trình đã tự lưu, chơi tiếp lúc nào cũng được.']];
function renderMenu(){
  const pm=$('popMenu');
  if(!menuCat){pm.hidden=true;pm.innerHTML='';return}
  const close='<span class="x">Esc để đóng</span><button class="xbtn" type="button" data-pmclose aria-label="Đóng">×</button>';
  if(menuCat==='audio'){pm.innerHTML=`<h3 id="popT">${icTag('menu')}Âm thanh${close}</h3>${audioPanelHTML()}`;pm.hidden=false;return}
  if(menuCat==='sys'){
    pm.innerHTML=`<h3 id="popT">${icTag('menu')}Menu${close}</h3><div class="rows">${SYS_ROWS.map(([id,n,d])=>`<button class="row well" type="button" data-sys="${id}"><b>${n}</b><span></span><span class="d">${d}</span></button>`).join('')}</div>`;
    pm.hidden=false;return}
  const c=CATS.find(x=>x.id===menuCat),list=catActs(c);
  if(!list.length){menuCat=null;pm.hidden=true;return}
  const tag=c.id==='eat'?(s.ateThisSlot?'Đã ăn buổi này':'Chưa ăn buổi '+SLOTS[s.slot].toLowerCase()):c.id==='act'?(s.slot===3?'Xong là đi ngủ':'Sang buổi sau'):'Không tốn thời gian';
  pm.innerHTML=nm(`<h3 id="popT">${icTag(c.ic)}${c.n}<span class="x">· ${tag}</span>${close}</h3><div class="rows">${list.map(menuRow).join('')}</div>`);
  pm.hidden=false;
}
function openCat(id,focusId){
  if(win)return;
  if(id==='bank'&&s.loc==='home'){closeMenu();openWin('phone');return}
  if(menuCat===id){closeMenu();renderCmd();return}
  menuCat=id;renderCmd();
  const f=(focusId&&$('popMenu').querySelector(`[data-pa="${focusId}"]:not(:disabled)`))||$('popMenu').querySelector('.row:not(:disabled)');
  if(f)f.focus({preventScroll:true});
}
function closeMenu(){menuCat=null}
$('cmdbar').addEventListener('click',e=>{
  const b=e.target.closest('[data-cat]');if(b){openCat(b.dataset.cat);return}
  const t=e.target.closest('[data-tool]');if(!t)return;
  if(t.dataset.tool==='sys')openCat('sys');else{closeMenu();toggleWin(t.dataset.tool)}
});
$('popMenu').addEventListener('click',e=>{
  if(e.target.closest('[data-pmclose]')){closeMenu();renderCmd();return}
  if(e.target.closest('#audMute')){audioPref.muted=!audioPref.muted;au('setMuted',audioPref.muted);audioSave();renderMenu();$('audMute').focus();return}
  const sy=e.target.closest('[data-sys]');if(sy&&sy.dataset.sys==='audio'){menuCat='audio';renderCmd();const f=$('volM');if(f)f.focus({preventScroll:true});return}
  if(sy){closeMenu();renderCmd();if(sy.dataset.sys==='home')cmd('home');else toggleWin(sy.dataset.sys);return}
  const row=e.target.closest('[data-pa]');if(!row||row.disabled)return;
  const a=locActs().find(x=>x.id===row.dataset.pa);if(a)doAction(a);
});
$('popMenu').addEventListener('input',e=>{const id=e.target.id;if(id!=='volM'&&id!=='volS')return;const k=id==='volM'?'music':'sfx',v=+e.target.value;
  audioPref[k]=v;au('setVolume',k,v);audioSave();$(id+'v').textContent=Math.round(v*100)+'%'});
$('noteBtn').addEventListener('click',()=>{if(noteAct==='map')toggleWin('map');else if(noteAct==='school')travel('school');else if(noteAct==='clean')openCat('act','clean')});
$('tracker').addEventListener('click',()=>toggleWin('tasks'));
$('stage').addEventListener('pointerdown',e=>{if(menuCat&&!e.target.closest('#popMenu')&&!e.target.closest('#cmdbar')&&!e.target.closest('#layer')){closeMenu();renderCmd()}});

function popFx(out,dm){
  const items=[];
  if(dm)items.push([`${dm>0?'+':'−'}${fk(dm)}`,dm>0?'up':'money']);
  for(const S of STATS){const v=out[S.k];if(v)items.push([`${S.n} ${v>0?'+':'−'}${Math.abs(v)}`,v>0?'up':'down'])}
  items.forEach(([t,c],i)=>setTimeout(()=>{const d=document.createElement('div');d.className='pop '+c;d.textContent=t;
    d.style.left=(50+((i%2)?10:-10)+(Math.random()*4-2))+'%';d.style.marginTop=(i*1.7)+'em';$('fx').appendChild(d);setTimeout(()=>d.remove(),1700)},i*130));
}
function showToast(text,tone){
  if(!s||!s.started)return;
  const t=$('toast');t.textContent=nm(text);t.className='pn toast '+(tone||'');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.add('out'),2800);
}
function refresh(){checkQuests();checkDaily();save();render()}
function afterChange(){refresh();processQueue()}

/* ============ Windows ============ */
const head=(icon,title,extra='',closable=true)=>`<header class="win-h">${icon?ico(icon):''}<h2>${title}</h2>${extra}${closable?'<button class="btn sm" type="button" data-close>Đóng</button>':''}</header>`;
function openWin(name){
  if(name==='phone'&&win!=='phone')phoneApp='home';
  win=name;bagSel=null;if(name==='cal')calSel=s.day;
  closeMenu();renderCmd();
  const kind=name==='event'&&curEvent?curEvent.kind||'dlg':null;
  $('layer').className='layer'+(kind==='dlg'?' dlgl':kind==='day'?' full':kind==='chapter'||name==='end'||name==='phone'||name==='log'||name==='rules'||TAB_WINS.includes(name)?' full dim':name==='map'?' full':'');
  if(name==='map')mapPick();
  $('layer').hidden=false;renderWin();
  if(kind==='day')sfx('dayStart');else if(kind==='dlg'){if(curEvent.who==='me')sfx('message')}else sfx('open');
  const f=$('win').querySelector(TAB_WINS.includes(name)?'[role=tab][aria-selected=true]':'.btnp:not(:disabled),.app,.btn.primary:not(:disabled),[data-close]');if(f)f.focus({preventScroll:true});
}
function hideWin(){win=null;$('layer').hidden=true;$('win').innerHTML=''}
function closeWin(){hideWin();sfx('close');processQueue()}
function toggleWin(name){
  if(!s.started||win==='event'||win==='end')return;
  if(win===name){closeWin();return}
  if(name==='map'&&s.over)return;
  openWin(name);
}
function renderWin(){
  const kind=win==='event'&&curEvent?curEvent.kind||'dlg':null,isDlg=kind==='dlg';
  const w=$('win');w.className=TAB_WINS.includes(win)||win==='log'||win==='rules'?'pn tw':isDlg?'evhost':kind==='chapter'?'pn chapc':kind==='day'?'pn dayc':win==='end'?'pn endp':win==='phone'?'phw':'win w-'+win;
  w.setAttribute('aria-labelledby',kind==='chapter'?'chT':win==='end'?'endT':'');
  const html=win==='bag'?bagHTML():win==='cal'?calHTML():win==='tasks'?tasksHTML():win==='map'?mapHTML()
    :win==='log'?docHead('book','Nhật ký')+`<div class="t-det well t-doc"><ol class="loglist">${s.log.map(l=>`<li><span class="lt">N${l.d} · ${SLOTS[l.sl]}</span><span class="${l.tone}">${l.text}</span></li>`).join('')||'<li><span></span><span class="muted">Chưa có gì.</span></li>'}</ol></div>`
    :win==='rules'?docHead('help','Luật chơi')+`<div class="t-det well t-doc">${rulesHTML()}</div>`
    :win==='event'?(kind==='chapter'?chapterHTML(curEvent):kind==='day'?dayCardHTML():eventHTML())
    :win==='end'?endHTML():win==='phone'?phoneHTML():'';
  w.innerHTML=nm(html);
  if(win==='map')drawMap();
  else if(isDlg)startType();
  else if(kind==='chapter')Scenes.vignette($('vig'),curEvent.n);
  else if(win==='end')requestAnimationFrame(drawChart);
}

/* Event, dialogue & chapter */
/* Biểu cảm và kiểu khung cho từng sự kiện (design/10). Mẹ ở xa nên nói qua điện thoại. */
const EV_LOOK={'Tin nhắn của mẹ':{phone:'Tin nhắn'},'Mẹ gọi điện':{ex:'worry',phone:'Đang gọi',call:1},'Chào mừng tân sinh viên':{ex:'happy'},
  'Khoa hỏi mượn tiền':{ex:'awkward'},'Khoa hẹn lần sau':{ex:'awkward'},'Đêm nhạc chào tân sinh viên':{ex:'excited'},'Chị Mai khen':{ex:'happy'},
  'Khoa trả tiền':{ex:'grin'},'Lương part-time đầu tiên':{ex:'happy'},'Lớp rủ đi ăn lẩu':{ex:'grin'},'Sinh nhật bạn cùng lớp':{ex:'happy'}};
function evLook(e){
  const L={ex:'normal',...(EV_LOOK[e.title]||{})};
  if(e.title==='Cô Tư thu tiền nhà'&&s.flags.rentShort)L.ex='stern';
  if(e.title==='Kết quả kiểm tra giữa kỳ'){const p=s.flags.examScore;L.ex=p>=75?'happy':p>=55?'normal':'stern'}
  return L;
}
function evChips(c){let h='';if(c.cost)h+=`<span class="money">−${fmt(c.cost)}</span>`;if(c.gain)h+=`<span class="gain">+${fmt(c.gain)}</span>`;
  h+=effSpans(c.eff||{});if(c.x)h+=`<span class="x">${c.x}</span>`;return h}
let evType=null;
function eventHTML(){
  const e=curEvent,one=e.choices.length===1,typing=!reduceMotion()&&typeof setInterval==='function';
  let face='',tag='';
  if(e.who){const L=evLook(e),C=Portraits.CH[e.who],P=PEOPLE[e.who],[pn,role]=P.n.split(' · ');
    face=`<div class="e-face${L.phone?' phone':''}">${pxImg(Portraits.url(e.who,L.ex,{gender:s.gender}))}${L.phone?`<span class="e-badge${L.call?' call':''}">${L.phone}</span>`:''}</div>`;
    tag=`<div class="e-tag"><b>${pn}</b><span>${role||C.role}</span></div>`}
  const chs=e.choices.map((c,i)=>{const nr=c.need?c.need(s):null,no=(c.cost&&s.money<c.cost)?'Không đủ tiền':nr;
    return `<button class="e-ch${typing?' wait':''}" type="button" data-ch="${i}" ${no?'disabled':''}>${one?'':`<span class="k">${i+1}</span>`}<b>${c.l}</b>${(c.cost||c.gain||c.eff||c.x||no)?`<span class="e-chips">${evChips(c)}${no?`<span class="no">${no}</span>`:''}</span>`:''}</button>`}).join('');
  return `<div class="evw">${face}${tag}<div class="pn e-dlg${one?' one':''}${e.who?'':' noface'}" role="group" aria-labelledby="evT" aria-describedby="evSay">
    <div class="e-txt"><div class="e-top"><h2 id="evT">${e.title}</h2><span class="stamp">Ngày ${s.day} · Buổi ${SLOTS[s.slot].toLowerCase()}</span></div>
    <p class="e-say" id="evSay" aria-live="polite" data-typing="${typing?1:0}">${e.text}</p><div class="e-hint">${one?'Nhấn Enter để tiếp tục':`Chọn bằng chuột hoặc phím 1–${e.choices.length}`}</div></div>
    <div class="e-chs">${chs}</div></div></div>`;
}
/* lời thoại hiện dần khoảng 40 chữ mỗi giây; bấm vào khung hoặc nhấn Space để hiện hết */
function startType(){
  const el=$('evSay');if(!el)return;clearInterval(evType&&evType.timer);
  const full=el.textContent;evType={full,shown:0,done:false,timer:0};
  if(el.dataset.typing!=='1'){finishType();return}
  el.textContent='';
  evType.timer=setInterval(()=>{if(!evType||!$('evSay')){clearInterval(evType&&evType.timer);return}
    evType.shown+=2;if(evType.shown%4===0)sfx('text');if(evType.shown>=full.length){finishType();return}
    $('evSay').textContent=full.slice(0,evType.shown);$('evSay').insertAdjacentHTML('beforeend','<span class="cur"></span>')},50);
}
function finishType(){
  if(!evType)return;clearInterval(evType.timer);evType.done=true;const el=$('evSay');if(!el)return;
  el.textContent=evType.full;if(curEvent&&curEvent.choices.length===1)el.insertAdjacentHTML('beforeend',' <span class="cur"></span>');
  $('win').querySelectorAll('.e-ch').forEach(b=>b.classList.remove('wait'));
  const f=$('win').querySelector('.e-ch:not(:disabled)');if(f)f.focus({preventScroll:true});
}
const typingNow=()=>win==='event'&&evType&&!evType.done;
function processQueue(){
  if(!s.started||s.over||win||!queue.length)return;
  curEvent=queue.shift();openWin('event');
}
function pickChoice(i){
  const e=curEvent,c=e&&e.choices[i];if(!c)return;
  if((c.cost&&s.money<c.cost)||(c.need&&c.need(s)))return;
  hideWin();curEvent=null;
  const m0=s.money;
  if(c.cost){s.money-=c.cost;s.spentToday+=c.cost;txAdd(e.title,-c.cost)}
  if(c.gain){s.money+=c.gain;txAdd(e.title,c.gain)}
  const out=applyEff(c.eff||{});
  if(c.run)c.run(s);
  statSfx(out);
  popFx(out,s.money-m0);
  if(e.choices.length>1)addLog(`${e.title}: ${c.l}`);
  afterChange();
}

/* Túi đồ, Lịch, Nhiệm vụ (design/11): một khung chung có tab, nội dung trái, chi tiết phải */
const TAB_WINS=['bag','cal','tasks'];
let questSel=null;
const VERB={food:'Ăn',drink:'Uống',med:'Dùng'};
/* Nhật ký và Luật chơi: cùng khung, chỉ có tiêu đề và nút đóng */
const docHead=(ic,title)=>`<div class="t-wh"><h2 class="t-ttl">${icTag(ic)}${title}</h2><span class="sp"></span><button class="t-x" type="button" data-close>Esc ✕</button></div>`;
function tabHead(extra=''){
  const t=(id,ic,l,k)=>`<button class="t-wt" type="button" role="tab" data-tab="${id}" aria-selected="${win===id}">${icTag(ic)}${l}<kbd>${k}</kbd></button>`;
  return `<div class="t-wh" role="tablist">${t('bag','bag','Túi đồ','B')}${t('cal','cal','Lịch','L')}${t('tasks','quest','Nhiệm vụ','J')}<span class="sp"></span>${extra}<button class="t-x" type="button" data-close>Esc ✕</button></div>`;
}
function bagHTML(){
  const st=bagStacks(),cells=[];
  for(let i=0;i<12;i++){const x=st[i];
    if(!x){cells.push('<div class="t-slot empty" aria-hidden="true"></div>');continue}
    const soon=x.exp!==null&&x.exp<=s.day;
    cells.push(`<button class="t-slot" type="button" data-slot="${x.id}" aria-pressed="${bagSel===x.id}" aria-label="${ITEMS[x.id].n}, ${x.q} cái">${icTag(x.id)}<span class="qty">${x.q}</span>${soon?'<span class="ex">Sắp hỏng</span>':''}</button>`)}
  const head=tabHead(`<span class="t-tg ${s.ateThisSlot?'warn':'good'}">${s.ateThisSlot?'Đã ăn buổi này':'Chưa ăn buổi này'}</span>`);
  const main=`<div class="t-main"><div class="t-grid well">${cells.join('')}</div><div class="t-leg"><span>${s.bag.length} món · ${st.length}/12 ô</span><span>Đồ ăn dùng chung lượt ăn của buổi. Đồ uống và thuốc dùng lúc nào cũng được.</span></div><div class="t-leg"><span></span><span>Đồ hết hạn bị bỏ vào cuối ngày. Mua thêm ở chợ, quán ăn, quán cà phê hoặc cửa hàng tiện lợi.</span></div></div>`;
  if(!st.length)return head+`<div class="t-wb">${main}<div class="t-det well"><h3>Túi đang trống</h3><p>Mua đồ mang về ở chợ, quán ăn, quán cà phê hoặc cửa hàng tiện lợi.</p></div></div>`;
  if(!bagSel||!bagCount(bagSel))bagSel=st[0].id;
  const id=bagSel,it=ITEMS[id],x=st.find(z=>z.id===id),r=itemReason(id);
  const extra=id==='mi'?'<span class="k">Gói thứ 2 trong ngày: Sức khỏe −8</span>':'';
  return head+`<div class="t-wb">${main}<div class="t-det well" aria-live="polite">
    <div class="t-dh"><div class="t-slot t-big">${icTag(id)}<span class="qty">${x.q}</span></div><div><h3>${it.n}</h3><span class="t-ty">${TYPE_LABEL[it.type]}</span></div></div>
    <p>${it.d}</p><div class="efx">${effSpans(effOf(it))}${extra}</div>
    <dl><dt>Số lượng</dt><dd>${x.q}</dd><dt>Hạn dùng</dt><dd class="${x.exp!==null&&x.exp<=s.day?'bad':''}">${expText(x.exp)}</dd><dt>Dùng ở</dt><dd>${it.where?it.where.map(w=>LOCS[w].name).join(', '):'Mọi nơi'}</dd><dt>Đang ở</dt><dd>${LOCS[s.loc].name}</dd></dl>
    ${r?`<span class="t-why">${r}</span>`:''}<button class="t-act" type="button" data-use="${id}" ${r?'disabled':''}>${it.verb||VERB[it.type]}</button></div></div>`;
}
function calNotes(d){const a=[];
  if(BILLS[d])a.push({t:`${BILLS[d][0]} · ${fmt(BILLS[d][1])}`,sh:{5:'Tiền nhà',10:'Điện nước',20:'Giáo trình'}[d],c:'#c8403a'});
  if(d===13)a.push({t:'Đêm nhạc chào tân sinh viên, buổi tối',sh:'Đêm nhạc',c:'#7a56c2'});
  if(d===15)a.push({t:'Lương part-time kỳ 1',sh:'Lương',c:'#2f8a4a'});
  if(d===20||d===21)a.push({t:'Hẹn cà phê với Khoa, buổi chiều',sh:'Gặp Khoa',c:'#7a56c2'});
  if(d===28&&s.lent)a.push({t:'Khoa hẹn trả 300.000đ',sh:'Khoa trả',c:'#7a56c2'});
  if(d===29)a.push({t:'Kiểm tra giữa kỳ, buổi sáng',sh:'Thi giữa kỳ',c:'#2b5d8a'});
  if(d===30)a.push({t:'Sinh nhật mẹ · Tổng kết cuối tháng',sh:'Sinh nhật mẹ',c:'#b8892a'});
  return a}
function calHTML(){
  let g=DOWS.map((d,i)=>`<div class="dw${i>=5?' we':''}">${d}</div>`).join('');
  for(let d=1;d<=30;d++){const n=calNotes(d),c=['t-d'];if(isWE(d))c.push('we');if(d<s.day)c.push('past');if(d===s.day)c.push('today');
    g+=`<button type="button" class="${c.join(' ')}" data-day="${d}" aria-pressed="${calSel===d}" aria-label="Ngày ${d}${n.length?': '+n.map(x=>x.t).join(', '):''}">${CHAPTERS[chOf(d)].from===d?`<span class="c">C${chOf(d)}</span>`:''}<span class="n">${d}</span>${n[0]?`<span class="nt" style="--c:${n[0].c}">${n[0].sh}</span>`:''}</button>`}
  const d=calSel,notes=calNotes(d),hh=s.hist.find(x=>x.d===d),C=CHAPTERS[chOf(d)];
  let det=`<h3>Ngày ${d}, ${DOW[dowOf(d)]}</h3><p>Chương ${chOf(d)}: ${C.t}</p>`;
  if(d===s.day)det+=`<p><b>Hôm nay</b>, đang là buổi ${SLOTS[s.slot].toLowerCase()}.</p>`;
  else if(d<s.day&&hh)det+=`<p>Cuối ngày: ví còn <b>${fmt(hh.money)}</b></p><p>No ${hh.no} · Năng lượng ${hh.nl} · Tinh thần ${hh.tt} · Sức khỏe ${hh.sk}</p>`;
  else if(d>s.day)det+=`<p>Còn <b>${d-s.day} ngày</b> nữa.</p>`;
  const dueQ=QUESTS.filter(q=>q.due===d&&s.q[q.id]==='active');
  dueQ.forEach(q=>{det+=`<p><span class="t-dot" style="--c:#d99a1e"></span><b>Hạn nhiệm vụ: ${q.t}</b></p>`});
  det+=notes.length||dueQ.length?notes.map(n=>`<p><span class="t-dot" style="--c:${n.c}"></span><b>${n.t}</b></p>`).join(''):'<p>Không có việc gì đặc biệt.</p>';
  return tabHead(`<span class="t-tg good">Ngày ${s.day}/30</span>`)+`<div class="t-wb"><div class="t-paper"><div class="hd2"><span>THÁNG ĐẦU TIÊN Ở SÀI GÒN</span><span>30 NGÀY</span></div><div class="t-cal">${g}</div></div><div class="t-det well" aria-live="polite">${det}</div></div>`;
}
function tasksHTML(){
  const ch=chOf(s.day),active=QUESTS.filter(q=>s.q[q.id]==='active').sort((a,b)=>a.due-b.due);
  if(!questSel||!s.q[questSel])questSel=(trackedQuest()||active[0]||QUESTS.filter(q=>s.q[q.id]).pop()||QUESTS[0]).id;
  const sel=QBY[questSel];
  let list='';
  for(let c=4;c>=1;c--){
    if(c>ch){list+=`<div class="t-qh">Chương ${c}: ${CHAPTERS[c].t}</div><div class="t-lock">Mở vào ngày ${CHAPTERS[c].from}</div>`;continue}
    list+=`<div class="t-qh">Chương ${c}: ${CHAPTERS[c].t}${c===ch?' <span>· đang diễn ra</span>':''}</div>`;
    QUESTS.filter(q=>q.ch===c).forEach(q=>{const k=s.q[q.id]||'active',left=q.due-s.day;
      const due=k==='active'?(left<=0?'hết hạn hôm nay':left===1?'còn đến mai':`hạn ngày ${q.due}`):k==='done'?'Đã xong':'Thất bại';
      list+=`<button class="t-q ${k==='done'?'done':k==='fail'?'fail':''}" type="button" data-q="${q.id}" aria-pressed="${q.id===questSel}"><span class="s s${k[0]}">${k==='active'?'!':k==='done'?'✓':'✕'}</span><b>${q.t}</b><span class="due${k==='active'&&left<=1?' hot':''}">${due}</span></button>`})}
  const k=s.q[sel.id]||'active',P=PEOPLE[sel.who],p=questProg(sel),pinned=trackedQuest()===sel;
  const rw=effSpans(sel.rw||{})+(sel.rwTxt?`<span class="k">${sel.rwTxt}</span>`:'');
  const det=`<div class="t-giver">${pxImg(Portraits.url(sel.who==='self'?'self':sel.who,sel.who==='khoa'?'grin':'normal',{gender:s.gender}))}<div><h3>${sel.t}</h3><small>Giao bởi ${sel.who==='self'?'chính bạn':P.n} · chương ${sel.ch}</small></div></div>
    <p>${sel.d}</p><div class="t-howto"><b>Cách làm:</b> ${sel.hint}</div>
    <div><p><b>${k==='done'?'Đã hoàn thành':k==='fail'?'Đã thất bại':p.lbl}</b></p><div class="t-bar" style="--c:${k==='fail'?'var(--bad)':k==='done'?'var(--good)':'var(--lantern)'}"><i style="width:${k==='fail'?100:k==='done'?100:p.pct}%"></i></div></div>
    <dl><dt>Hạn</dt><dd>${k==='active'?(sel.due-s.day<=0?'Hết hôm nay':`Ngày ${sel.due}, còn ${sel.due-s.day+1} ngày`):'Ngày '+sel.due}</dd></dl>
    <p><b>Phần thưởng</b></p><div class="efx">${rw||'<span class="k">Không</span>'}</div>
    ${k==='active'?`<button class="t-act" type="button" data-pin="${sel.id}" ${pinned?'disabled':''}>${pinned?'Đang theo dõi trên màn hình':'Ghim lên màn hình'}</button>`:''}`;
  const sc=studyScore();
  const dly=s.daily.map(d=>{const D=DAILY[d.id],[c,m]=D.prog(s),ok=d.st==='done';return `<div class="t-dl"><span class="t-box${ok?' on':d.st==='fail'?' fail':''}"></span><span>${D.t}<small>${ok?'Xong · tinh thần +3':D.label?D.label(s):`${c} / ${m}`}</small></span></div>`}).join('');
  return tabHead(`<span class="t-tg good">${active.length} đang làm</span>`)+`<div class="t-wb"><div class="t-main"><div class="t-today well">${dly}<div class="t-study">Điểm học tập <b>${sc}</b><div class="t-bar"><i style="width:${sc}%"></i><u style="left:55%"></u><u style="left:75%;background:var(--good)"></u></div></div></div><div class="t-ql well">${list}</div></div><div class="t-det well" aria-live="polite">${det}</div></div>`;
}

/* Map (design/09): bản đồ phủ kín màn hình, bấm vào địa điểm trên bản đồ hoặc trong danh sách để xem rồi đi */
const MAP_HOURS={home:'Cả ngày',street:'Cả ngày (ốc chỉ buổi tối)',market:'Sáng đến chiều',park:'Cả ngày',cafe:'Cả ngày',school:'Thứ Hai đến thứ Sáu, sáng đến chiều',store:'24 giờ',mall:'Trưa đến tối'};
let mapSel=null;
const locActsAt=id=>A[id].filter(a=>!a.show||a.show(s));
const mapQuests=()=>QUESTS.filter(q=>s.q[q.id]==='active'&&q.goal).reduce((m,q)=>(m[q.goal]=m[q.goal]||q,m),{});
function mapPick(){const tq=trackedQuest();mapSel=tq&&tq.goal&&tq.goal!==s.loc?tq.goal:s.loc}
function mapDo(id){return locActsAt(id).filter(a=>a.id!=='idle'&&!a.story).map(a=>a.n).slice(0,7).join(', ')+'.'}
function mapHTML(){
  if(!mapSel)mapPick();
  const qs=mapQuests(),P=Scenes.map.PLACES;
  const list=P.map(p=>{const shut=LOCS[p.id].open(s),c=travelCost(p.id);
    return `<button class="m-pl" type="button" data-msel="${p.id}" aria-pressed="${p.id===mapSel}"><span class="n">${LOCS[p.id].name}${qs[p.id]?'<span class="q" aria-label="có nhiệm vụ">!</span>':''}${p.id===s.loc?'<span class="here">· đang ở</span>':''}</span><span class="m-st ${shut?'shut':'open'}">${shut?'Đóng':'Mở'}</span><span class="m-cost">${c/1000}K</span></button>`}).join('');
  const id=mapSel,L=LOCS[id],shut=L.open(s),c=travelCost(id),q=qs[id];
  const btn=id===s.loc?'<button class="m-go" type="button" disabled>Bạn đang ở đây</button>'
    :shut?'<button class="m-go" type="button" disabled>Đang đóng cửa</button>'
    :c&&s.money<c?`<button class="m-go walk" type="button" data-go="${id}">Đi bộ (năng lượng −8, tinh thần −2)</button>`
    :`<button class="m-go" type="button" data-go="${id}">${c?`Đi đến (${fmt(c)})`:'Đi đến (miễn phí)'}</button>`;
  return `<canvas id="mapCv" class="mapcv" width="320" height="180" role="img" aria-label="Bản đồ khu phố nhìn từ trên xuống: phòng trọ, quán ăn, chợ, công viên, cửa hàng tiện lợi ở gần; quán cà phê, trường đại học, trung tâm thương mại xa dần."></canvas>
    <aside class="pn m-side" aria-label="Danh sách địa điểm">
      <div class="m-hd"><b>Bản đồ</b><span>Ngày ${s.day}, ${DOW[dowOf(s.day)]}, buổi ${SLOTS[s.slot].toLowerCase()}</span><button class="xbtn" type="button" data-close aria-label="Đóng bản đồ">×</button></div>
      <div class="m-list well">${list}</div>
      <div class="m-det well" aria-live="polite"><h3>${L.name}</h3>
        <p><b>Mở cửa:</b> ${MAP_HOURS[id]}${shut?` · <span class="why">${shut}</span>`:''}</p>
        <p><b>Làm được:</b> ${mapDo(id)}</p>
        <p><b>Đi lại:</b> ${c?fmt(c)+(s.bikeBroken?' (xe hỏng, gấp ba)':''):'Miễn phí, đi bộ được'}${c&&s.money<c?' · không đủ tiền':''}</p>
        ${q?`<p class="qb">Nhiệm vụ: ${q.t}</p>`:''}${btn}</div>
    </aside>
    <div class="pn m-legend" aria-hidden="true"><span><i style="background:#ffc94d"></i>Có nhiệm vụ</span><span><i style="background:#e85a3a"></i>Tốn tiền đi lại</span><span><i style="background:repeating-linear-gradient(45deg,#4a4e66 0 2px,transparent 2px 5px)"></i>Đang đóng cửa</span></div>`;
}
function drawMap(t=0){
  const cv=$('mapCv');if(!cv)return;
  Scenes.map.frame(cv.getContext('2d'),t,{animate:!reduceMotion(),slot:s.slot,at:s.loc,sel:mapSel,weekend:isWE(s.day),quests:Object.keys(mapQuests()),broken:s.bikeBroken>0,gender:s.gender});
}
$('layer').addEventListener('pointerdown',e=>{
  if(e.target.id!=='mapCv')return;const r=e.target.getBoundingClientRect(),k=Math.min(r.width/320,r.height/180),x=(e.clientX-r.left)/k,y=(e.clientY-r.top-(r.height-180*k)/2)/k;
  const hit=Scenes.map.PLACES.find(p=>{const [bx,by,bw,bh]=p.box;return x>=bx-3&&x<=bx+bw+3&&y>=by-12&&y<=by+bh+3});if(hit){mapSel=hit.id;renderWin()}
});

/* Rules */
function rulesHTML(){return `<ul class="rules">
  <li>Câu chuyện chia 4 chương theo 4 tuần. Mỗi chương có nhiệm vụ chính (xem ở <b>Nhiệm vụ</b> hoặc khung theo dõi góc phải) và 2 việc nhỏ mỗi ngày.</li>
  <li>Mỗi ngày có 4 buổi. Mỗi buổi được ăn tối đa 1 lần, rồi chọn 1 <b>Hoạt động</b> để sang buổi sau. Mua đồ và các việc tiền bạc không tốn thời gian.</li>
  <li>Thanh lệnh dưới cùng: bấm một nhóm (hoặc phím 1–4) để mở danh sách, rồi bấm một dòng để làm ngay. Dòng bị khóa ghi rõ lý do.</li>
  <li>Sáng thứ Hai đến thứ Sáu Minh phải lên lớp; vắng học bị trừ điểm học tập. Sáng thứ Hai ngày 29 là kiểm tra giữa kỳ.</li>
  <li>Sau khi phỏng vấn ở <b>Cửa hàng tiện lợi</b>, Minh làm part-time ca chiều, ca tối và ca sáng cuối tuần. Lương trả ngày 15 và cuối tháng; kẹt tiền có thể xin ứng lương hoặc gọi xin thêm bố mẹ bằng điện thoại ở phòng trọ.</li>
  <li>Hóa đơn tự trừ vào buổi sáng ngày 5, 10 và 20. Ví không đủ thì bị trừ hết tiền trong ví và tinh thần −12.</li>
  <li><b>Túi đồ</b> chứa đồ mua mang về. Bánh mì, xôi, bánh ngọt hỏng sau 1 ngày; nguyên liệu và sữa giữ được 3 ngày.</li>
  <li>Phòng trọ bừa dần sau mỗi đêm, mỗi bữa ăn và mỗi lần nấu trong phòng. Phòng bừa làm tinh thần giảm khi ở nhà; dọn phòng giúp tinh thần tốt lên.</li>
  <li>Độ no, năng lượng, tinh thần tự giảm theo thời gian. Chỉ số nào xuống dưới 25 sẽ kéo các chỉ số khác giảm theo.</li>
</ul>
<div class="formula">Điểm = 1000 × Tài sản<sup>0,35</sup> × Độ no TB<sup>0,2</sup> × Tinh thần TB<sup>0,25</sup> × Sức khỏe cuối<sup>0,2</sup></div>
<p class="note-line">Mỗi yếu tố quy về thang 0 đến 1 (tài sản 2,5 triệu tính là 1). Kết cục câu chuyện phụ thuộc vào điểm học tập, số ca làm thêm và các nhiệm vụ bạn hoàn thành.</p>
<p class="note-line">Phím tắt: 1–4 nhóm hành động · B túi đồ · L lịch · J nhiệm vụ · M bản đồ · N nhật ký · Space hiện hết lời thoại · Esc đóng.</p>`}

/* Thẻ chương (design/12 thẻ 2): tranh nhỏ khung gỗ, nội dung chương, nhiệm vụ của chương */
function chapterHTML(e){
  const C=CHAPTERS[e.n];
  return `<canvas class="vig" id="vig" width="64" height="48" aria-hidden="true"></canvas><div>
    <div class="eb">Chương ${e.n} / 4</div><h2 id="chT">${C.t}</h2><div class="dd">Ngày ${C.from} – ${C.to}</div><p>${C.txt}</p>
    <div class="qmini">${QUESTS.filter(q=>q.ch===e.n).map(q=>`<span>${q.t}</span>`).join('')}</div>
    <button class="btnp" type="button" data-ch="0">${e.n===1?'Bắt đầu tháng mới':'Vào chương '+e.n}</button></div>`;
}
/* Thẻ sang ngày (design/12 thẻ 2): hiện mỗi sáng từ ngày 2, tóm tắt hôm qua và việc hôm nay */
function dayCardHTML(){
  const d=s.day,h=s.hist.find(x=>x.d===d-1),marks=[5,10,13,15,20,29,30];
  const yd=[`<li><i style="--c:#a4a9c8"></i>Ví còn ${fmt(h?h.money:s.money)} cuối ngày ${d-1}</li>`]
    .concat(s.log.filter(l=>l.d===d-1&&l.tone==='bad').slice(0,3).map(l=>`<li class="bad"><i style="--c:#ff6474"></i>${l.text}</li>`));
  const td=[];
  if(BILLS[d]){const [n,amt]=BILLS[d],short=s.flags['bill'+d];
    if(short){td.push([`Trừ ${n.toLowerCase()} ${fmt(amt)}: ví thiếu ${fmt(short)}`,'#ff8a96']);td.push(['Ví về 0đ · tinh thần −12 · không ghi nợ','#ff8a96'])}
    else td.push([`Trừ ${n.toLowerCase()}: −${fmt(amt)}`,'#ff8a96'])}
  if(d===15)td.push([s.flags.pay1?`Nhận lương part-time kỳ 1: +${fmt(s.flags.pay1)}`:'Chưa có lương part-time vì chưa làm ca nào','#72de90']);
  if(CHAPTERS[chOf(d)].from===d)td.push([`Bắt đầu chương ${chOf(d)}: ${CHAPTERS[chOf(d)].t}`,'#5cc8ff']);
  calNotes(d).filter(n=>!BILLS[d]||!n.t.startsWith(BILLS[d][0])).filter(n=>d!==15||n.sh!=='Lương').forEach(n=>td.push([n.t,'#7a56c2']));
  s.daily.forEach(x=>td.push([`Việc hôm nay: ${DAILY[x.id].t}`,'#ffc94d']));
  return `<div class="top"><span class="dw">${DOW[dowOf(d)]}</span><span class="num">Ngày ${d}</span><span class="ch">Chương ${chOf(d)}: ${CHAPTERS[chOf(d)].t}</span></div>
    <div class="strip" aria-hidden="true">${Array.from({length:30},(_,i)=>`<i class="${i+1<d?'past':i+1===d?'now':marks.includes(i+1)?'mark':''}"></i>`).join('')}</div>
    <h5>Hôm qua</h5><ul>${yd.join('')}</ul>
    <h5>Hôm nay</h5><ul>${td.map(([t,c])=>`<li><i style="--c:${c}"></i>${t}</li>`).join('')}</ul>
    <button class="btnp" type="button" data-ch="0">Bắt đầu buổi sáng</button>`;
}

/* Tổng kết cuối tháng (design/12 thẻ 1) */
let endChart='stat';
function endHTML(){
  const r=computeScore(),[an,ad]=archetype(r),g=grade(r.score),qd=QUESTS.filter(q=>s.q[q.id]==='done').length;
  const RC={S:'#ffc94d',A:'#72de90',B:'#5cc8ff',C:'#c9a0e8',D:'#ff8a96'};
  const fac=[['Tài sản',r.F.tien,'#ffc94d','0,35',fmt(r.asset)],['Độ no trung bình',r.F.no,SCOL.no,'0,2',Math.round(r.F.no*100)],['Tinh thần trung bình',r.F.tt,SCOL.tt,'0,25',Math.round(r.F.tt*100)],['Sức khỏe cuối tháng',r.F.sk,SCOL.sk,'0,2',Math.round(r.F.sk*100)]];
  const ach=[['Chuyên cần',s.absences===0,'📘'],['Đầu bếp tại gia',s.cooked>=15,'🍳'],['Tự lập tài chính',s.askCount===0,'💪'],['Chăm chỉ làm thêm',s.shifts>=18,'🏪'],['Hoàn thành mọi nhiệm vụ',qd===QUESTS.length,'⭐'],['Fan cứng mì gói',s.noodleTotal>=12,'🍜']];
  const lg=endChart==='stat'?STATS.map(S=>`<span><i style="--c:${SCOL[S.k]}"></i>${S.n}</span>`).join(''):'<span><i style="--c:#ffc94d"></i>Tiền trong ví</span><span><i style="--c:#ff6474"></i>Mốc 1,2 triệu</span>';
  return `<div class="hd3"><b id="endT">Kết thúc tháng đầu tiên của ${s.name}</b><span>Ngày 30 · Sinh nhật mẹ · ${qd}/${QUESTS.length} nhiệm vụ</span></div>
    <div class="scorebox well"><div class="sc"><span class="num">${r.score}</span><span class="rank" style="--rk:${RC[g]}" aria-label="Hạng ${g}">${g}</span></div>
      <div class="arch"><b>${an}</b><span>${ad}</span></div>
      <div class="fac">${fac.map(([n,v,c,w,val])=>`<div><div class="frow"><b>${n}</b><span>${val} · mũ ${w}</span></div><div class="fbar"><i style="--c:${c};width:${Math.min(1,v)*100}%"></i></div></div>`).join('')}</div>
      <div class="formula">Điểm = 1000 × Tài sản<sup>0,35</sup> × No<sup>0,2</sup> × Tinh thần<sup>0,25</sup> × Sức khỏe<sup>0,2</sup>. Hạng S từ 800, A từ 700, B từ 580, C từ 450.</div></div>
    <div class="chartbox well"><div class="tl"><span>30 ngày của ${s.name}</span><span class="lg">${lg}</span></div>
      <canvas id="chartCv" width="220" height="92" role="img" aria-label="Đồ thị 30 ngày"></canvas>
      <div class="lg" style="justify-content:space-between;color:var(--muted)"><span>Ngày 1</span><span>8</span><span>15</span><span>22</span><span>30</span></div>
      <div class="chsw"><button class="btns" type="button" data-chart="stat" aria-pressed="${endChart==='stat'}">4 chỉ số</button><button class="btns" type="button" data-chart="money" aria-pressed="${endChart==='money'}">Tiền trong ví</button></div></div>
    <div class="ends well"><h4>Mọi người nói gì</h4>${endingLines().map(([w,t])=>`<div class="en">${pxImg(Portraits.url(w,w==='me'&&!s.flags.gift?'worry':'normal',{gender:s.gender}))}<span><b>${PEOPLE[w].n.split(' · ')[0]}</b>${t}</span></div>`).join('')}</div>
    <div class="achs">${ach.map(([n,on,ic])=>`<div class="ach well${on?' on':''}"><span class="md" aria-hidden="true">${on?ic:'🔒'}</span>${n}${on?'':'<span class="vh"> (chưa đạt)</span>'}</div>`).join('')}</div>
    <div class="endbtns"><button class="btns" type="button" data-m="home">Về trang bìa</button><button class="btnp" type="button" data-m="new">Chơi lại tháng mới</button></div>`;
}
/* đồ thị 30 ngày vẽ bằng nét pixel; chế độ tiền có vạch mốc 1,2 triệu tiền nhà */
function drawChart(){
  const cv=$('chartCv');if(!cv)return;const c=cv.getContext('2d'),W=cv.width,H=cv.height;c.imageSmoothingEnabled=false;c.fillStyle='#151933';c.fillRect(0,0,W,H);
  const L=14,Rr=4,T=4,B=10,X=d=>Math.round(L+(d-1)/29*(W-L-Rr)),Y=v=>Math.round(T+(1-v/100)*(H-T-B));
  c.fillStyle='#2c335c';[0,50,100].forEach(v=>c.fillRect(L,Y(v),W-L-Rr,1));[1,8,15,22].forEach(d=>c.fillRect(X(d),T,1,H-T-B));
  const px=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};
  const line=(k,col,sc)=>{let p0=null;s.hist.forEach(o=>{const v=sc?Math.min(100,o[k]/35000):o[k],x=X(o.d),y=Y(v);
    if(p0){const [x0,y0]=p0,n=Math.max(1,Math.abs(x-x0),Math.abs(y-y0));for(let i=0;i<=n;i++)px(Math.round(x0+(x-x0)*i/n),Math.round(y0+(y-y0)*i/n),col)}else px(x,y,col);p0=[x,y]})};
  if(endChart==='stat'){for(let x=L;x<W-Rr;x+=2)px(x,Y(25),'#ff6474');STATS.forEach(S=>line(S.k,SCOL[S.k]))}
  else{line('money','#ffc94d',1);for(let x=L;x<W-Rr;x+=2)px(x,Y(1200000/35000),'#ff6474')}
  c.fillStyle='#6a70a0';[1,8,15,22,30].forEach(d=>c.fillRect(X(d),H-B+2,1,3));
}

/* Điện thoại trong game (design/12 thẻ 5): mở từ nút Tiền bạc ở phòng trọ. Không có ứng dụng vay. */
let phoneApp='home';
const PH_TIME=['07:30','12:00','16:00','20:30'];
function txAdd(n,v){if(!v)return;sfx(v>0?'coinIn':'coinOut');(s.tx=s.tx||[]).unshift({d:s.day,n,v});if(s.tx.length>40)s.tx.length=40}
function phoneHTML(){
  const sb=`<div class="sb"><span>${PH_TIME[s.slot]}</span><span>▮▮▮ 64%</span></div>`,hdr=t=>`<div class="ah"><button type="button" data-ph="home" aria-label="Về màn hình chính">‹</button>${t}</div>`;
  const ask=A.home.find(x=>x.id==='askparents'),ship=A.home.find(x=>x.id==='ship');
  let scr;
  if(phoneApp==='home')scr=`<div class="ph dark"><div class="wall"></div><div class="sb" style="position:relative"><span>${PH_TIME[s.slot]}</span><span>▮▮▮ 64%</span></div>
    <div class="apps"><button class="app" type="button" data-ph="chat"><span class="ai" style="--c:#4f7fd0">💬</span>Tin nhắn${s.flags.momCall?'':'<span class="bd">1</span>'}</button><button class="app" type="button" data-ph="call"><span class="ai" style="--c:#3f9a5a">📞</span>Gọi điện</button>
    <button class="app" type="button" data-ph="wallet"><span class="ai" style="--c:#2f7a46">💳</span>Ví</button><button class="app" type="button" data-ph="food"><span class="ai" style="--c:#ff9a3a">🛵</span>Đặt đồ ăn</button></div></div>`;
  else if(phoneApp==='wallet'){const nb=Object.keys(BILLS).map(Number).find(d=>d>=s.day&&!(d===s.day&&s.slot>0));
    scr=`<div class="ph">${sb}${hdr('Ví của tôi')}<div class="pb">
    <div class="bal"><small>Số dư</small><span class="num">${fmt(s.money)}</span></div>
    <div class="kv"><span>Lương part-time chờ trả</span><b class="pos">${fmt(s.accrued)}</b></div><div class="kv"><span>Hóa đơn sắp tới</span><b>${nb?`${BILLS[nb][0]} ngày ${nb}: ${fmt(BILLS[nb][1])}`:'Không còn'}</b></div>
    <b style="font-size:.86em">Giao dịch gần đây</b>${(s.tx||[]).slice(0,6).map(t=>`<div class="tx"><span>${t.n}</span><span class="num" style="color:${t.v<0?'#d6453a':'#2f8a4a'}">${t.v>0?'+':'−'}${fmt(Math.abs(t.v))}</span></div>`).join('')||'<p style="margin:0;font-size:.8em">Chưa có giao dịch.</p>'}</div></div>`}
  else if(phoneApp==='chat')scr=`<div class="ph">${sb}${hdr('Mẹ')}<div class="chat">
    <div class="msg">“Bố mẹ gửi con 3 triệu cho tháng đầu, đã gồm tiền nhà. Con chi tiêu cho khéo, học hành cho đàng hoàng nghe con.”<small>Ngày 1 · 07:00</small></div>
    <div class="msg me">Dạ, con biết rồi mẹ<small>Ngày 1 · 07:02</small></div>
    ${s.flags.momCall?'<div class="msg">“Con ăn uống có đủ không? Tiền còn đủ xài không con?”<small>Ngày 18 · 20:30</small></div>':''}</div>
    <div class="quick"><button type="button" data-ph="call">Gọi cho mẹ<small>Mở màn hình gọi điện</small></button></div></div>`;
  else if(phoneApp==='call'){const r=reason(ask);
    scr=`<div class="ph dark call">${sb}<div class="pb" style="align-items:center;justify-content:center;text-align:center">
    <span class="momc ringd">${pxImg(Portraits.url('me','normal',{}))}</span><b style="font-size:1.2em">Mẹ</b><small style="opacity:.7">Đang gọi…</small>
    <div class="quick" style="background:transparent;border:0;width:100%;padding:0"><button type="button" data-phdo="askparents" ${r?'disabled':''} style="background:#fff">Con xin thêm 500k<small>+500.000đ · tinh thần −8 · ảnh hưởng nhiệm vụ Tự lập${r?' · '+r.toLowerCase():` · đã xin ${s.askCount}/2 lần`}</small></button>
    <button type="button" data-ph="home" style="background:#ff5a5a;color:#fff;border-color:#ff5a5a">Kết thúc cuộc gọi<small style="color:#ffe0e0">Không mất buổi, không đổi chỉ số</small></button></div></div></div>`}
  else{const r=reason(ship);
    scr=`<div class="ph">${sb}${hdr('Đặt đồ ăn')}<div class="pb">
    <div class="loanh"><b>Cơm gà xối mỡ + trà đá</b><small style="display:block">Giao tới phòng trọ trong 20 phút</small><span class="num" style="display:block;color:#1d2136;font-size:2em">${fmt(ship.cost)}</span></div>
    <div class="kv"><span>Hiệu ứng</span><b>Độ no +40, tinh thần +5</b></div><div class="kv"><span>Phòng</span><b>Thêm hộp xốp (bừa hơn)</b></div><div class="alert">${ship.d} Chỉ đặt được khi đang ở phòng trọ.</div>
    ${r?`<div class="alert" style="background:#ffe8ea;color:#a8283a">${r}</div>`:''}<button class="pbtn" type="button" data-phdo="ship" ${r?'disabled':''}>Đặt món</button></div></div>`}
  return `<div class="hand" role="dialog" aria-label="Điện thoại">${scr}</div><button class="btns phx" type="button" data-close>Cất điện thoại (Esc)</button>`;
}
function phoneDo(id){
  const a=A.home.find(x=>x.id===id);if(!a||reason(a))return;
  hideWin();const ok=doAction(a);
  if(ok&&!win){phoneApp=id==='askparents'?'wallet':'home';if(id==='askparents')openWin('phone')}
}

/* Layer clicks */
$('layer').addEventListener('click',e=>{
  const t=e.target;
  if(typingNow()&&t.closest('.evw')){finishType();return}
  const ch=t.closest('[data-ch]');if(ch){if(!ch.disabled)pickChoice(+ch.dataset.ch);return}
  const ms=t.closest('[data-msel]');if(ms){mapSel=ms.dataset.msel;renderWin();const f=$('win').querySelector(`[data-msel="${mapSel}"]`);if(f)f.focus({preventScroll:true});return}
  const go=t.closest('[data-go]');if(go){if(!go.disabled)travel(go.dataset.go);return}
  const use=t.closest('[data-use]');if(use){if(!use.disabled)useItem(use.dataset.use);return}
  const pin=t.closest('[data-pin]');if(pin){s.pin=pin.dataset.pin;refresh();return}
  const tb=t.closest('[data-tab]');if(tb){openWin(tb.dataset.tab);return}
  const qq=t.closest('[data-q]');if(qq){questSel=qq.dataset.q;renderWin();const f=$('win').querySelector(`[data-q="${questSel}"]`);if(f)f.focus({preventScroll:true});return}
  const sl=t.closest('[data-slot]');if(sl){bagSel=sl.dataset.slot;renderWin();const u=$('win').querySelector(`[data-slot="${bagSel}"]`);if(u)u.focus({preventScroll:true});return}
  const day=t.closest('[data-day]');if(day){calSel=+day.dataset.day;renderWin();return}
  const cs=t.closest('[data-chart]');if(cs){endChart=cs.dataset.chart;renderWin();return}
  const ph=t.closest('[data-ph]');if(ph){phoneApp=ph.dataset.ph;if(phoneApp==='chat')sfx('message');renderWin();const f=$('win').querySelector('.ah button,.app,.quick button');if(f)f.focus({preventScroll:true});return}
  const pd=t.closest('[data-phdo]');if(pd){if(!pd.disabled)phoneDo(pd.dataset.phdo);return}
  const m=t.closest('[data-m]');if(m){cmd(m.dataset.m);return}
  if(t.closest('[data-close]')){closeWin();return}
  if(t.id==='layer'&&win!=='event'&&win!=='end')closeWin();
});

/* ============ Title screen & commands ============ */
function renderTitle(){
  const st=loadSaved(),cont=st&&st.started&&!st.over;
  $('titleBtns').innerHTML=`<button class="btn primary lg" type="button" data-m="new">Bắt đầu câu chuyện</button>`+
    (cont?`<button class="btn" type="button" data-m="cont">Chơi tiếp · ngày ${st.day}, chương ${chOf(st.day)}</button>`:'')+
    `<button class="btn" type="button" data-m="rules">Luật chơi</button>`;
}
/* Màn hình đang hiện: title (trang bìa), create (tạo nhân vật), intro (chuyển cảnh ngày 1), game */
let mode='title';
function showScreen(m){mode=m;$('titleScreen').hidden=m!=='title';$('createScreen').hidden=m!=='create';$('intro').hidden=m!=='intro';$('ui').hidden=m!=='game';syncMusic()}
function showTitle(){hideWin();closeMenu();showScreen('title');renderTitle();const f=$('titleBtns').querySelector('button');if(f)f.focus({preventScroll:true})}
function startGame(){hideWin();closeMenu();queue=[];showScreen('game');render();save()}
/* Ván mới với tên và giới tính đã chọn (trình mô phỏng gọi thẳng hàm này) */
function newGame(ch){s=newState();s.name=ch.name;s.gender=ch.gender;s.started=true;txAdd('Bố mẹ gửi',START_MONEY);startGame();addLog(`Ngày đầu ở Sài Gòn. Bố mẹ gửi ${fmt(START_MONEY)}.`);
  activateChapter(1);
  queue.push(ev('Tin nhắn của mẹ','“Bố mẹ gửi con 3 triệu cho tháng đầu, đã gồm tiền nhà. Con chi tiêu cho khéo, học hành cho đàng hoàng nghe con.”',[{l:'Dạ, con biết rồi mẹ'}],'me'));
  queue.push(ev('Phòng ghép với Khoa','“Chìa khóa nè. Con ở chung với thằng Khoa, tiền nhà phần con 1 triệu 2, đóng sáng mùng 5 nghen. Trong túi con có ít nguyên liệu cô cho, tối về nấu ăn cho đỡ tốn.”',[{l:'Dạ, con cảm ơn cô'}],'tu'));
  genDaily();afterChange()}

/* Tạo nhân vật (design/02): 1–12 ký tự, chỉ chữ cái và khoảng trắng */
const CR_HELP='Từ 1 đến 12 ký tự, chỉ gồm chữ cái và khoảng trắng.';
const CR_LABEL={nam:'Chân dung nhân vật nam: tóc ngắn nâu đen, mắt to, má hồng, áo xanh, đeo ba lô vàng',nu:'Chân dung nhân vật nữ: tóc dài nâu đen, mái lệch, kẹp tóc vàng, mắt to, má hồng, áo xanh, đeo ba lô vàng'};
let crGender='nam',pendingChar=null;
const cleanName=v=>v.normalize('NFC').replace(/\s+/g,' ').trim();
function crCheck(){
  const raw=$('crName').value.normalize('NFC'),name=cleanName(raw),n=[...raw].length;
  $('crCount').textContent=n+'/12';$('crCount').classList.toggle('full',n>=12);
  const err=/[^\p{L}\p{M}\s]/u.test(raw)?'Tên chỉ dùng chữ cái và khoảng trắng. Hãy xóa số hoặc ký hiệu.':'';
  $('crField').classList.toggle('err',!!err);$('crName').setAttribute('aria-invalid',String(!!err));
  $('crHelp').textContent=err||CR_HELP;$('crHelp').classList.toggle('err',!!err);
  $('crCreate').disabled=!!err||!name;
  $('crPlate').textContent=name||'Chưa có tên';$('crPlate').classList.toggle('empty',!name);
  return err?null:name||null;
}
function openCreate(){hideWin();showScreen('create');crCheck();$('crName').focus({preventScroll:true})}
['nam','nu'].forEach(gd=>{const c=document.createElement('canvas');c.width=c.height=48;Scenes.cover.bust(c.getContext('2d'),0,false,gd);
  $(gd==='nam'?'icNam':'icNu').style.backgroundImage='url('+c.toDataURL()+')'});
$('crName').addEventListener('input',crCheck);
document.querySelectorAll('input[name="gender"]').forEach(r=>r.addEventListener('change',()=>{crGender=r.value;$('crAva').setAttribute('aria-label',CR_LABEL[crGender])}));
$('crForm').addEventListener('submit',e=>{e.preventDefault();const name=crCheck();if(!name)return;pendingChar={name,gender:crGender};startIntro()});
$('crBack').addEventListener('click',showTitle);

/* Chuyển cảnh ngày 1 (design/03): đêm → bình minh → mặt trời mọc → thẻ Ngày 1 */
const IN_T={fade:1.2,p0:1.0,p1:7.5,card:7.8,ready:8.5};
const inPAt=ts=>{const u=Math.max(0,Math.min(1,(ts-IN_T.p0)/(IN_T.p1-IN_T.p0)));return u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2};
const IN_MORNING=(()=>{for(let ts=IN_T.p0;ts<IN_T.p1;ts+=.02)if(inPAt(ts)>=.7)return ts;return IN_T.p1})();
let introStart=0;
$('inMonth').innerHTML='<i></i>'.repeat(30);
function startIntro(){
  au('stop');au('sting','dawn');
  showScreen('intro');$('inName').textContent=pendingChar.name;$('inDay').classList.remove('show','ready');$('inGo').disabled=true;$('inSkip').hidden=false;
  introStart=performance.now()-(reduceMotion()?IN_T.ready*1000:0);
}
function introUI(ts){
  $('inFade').style.opacity=String(1-Math.max(0,Math.min(1,ts/IN_T.fade)));
  const show=ts>=IN_T.card,ready=ts>=IN_T.ready,d=$('inDay');
  d.classList.toggle('show',show);$('inSkip').hidden=show;
  if(ready&&!d.classList.contains('ready')){d.classList.add('ready');$('inGo').disabled=false;$('inGo').focus({preventScroll:true})}
}
$('inSkip').addEventListener('click',()=>{introStart=performance.now()-IN_T.ready*1000});
$('inGo').addEventListener('click',()=>{if(pendingChar)newGame(pendingChar)});

function cmd(k){
  if(k==='new'){audioStart();openCreate()}
  else if(k==='cont'){audioStart();const st=loadSaved();if(!st)return;s=st;startGame();processQueue()}
  else if(k==='rules'){win=null;openWin('rules')}
  else if(k==='home'){save();showTitle()}
}
$('titleBtns').addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b)cmd(b.dataset.m)});

document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='Escape'&&mode==='create'&&!win){showTitle();return}
  if(e.key==='Escape'){if(win&&win!=='event'&&win!=='end'){closeWin();return}if(menuCat){closeMenu();renderCmd()}return}
  if(!s.started||$('ui').hidden)return;
  if(win==='event'&&curEvent&&curEvent.kind!=='chapter'){
    if(e.key===' '&&typingNow()){e.preventDefault();finishType();return}
    const n=+e.key;if(!typingNow()&&n>=1&&n<=curEvent.choices.length){const b=$('win').querySelectorAll('.e-ch')[n-1];if(b&&!b.disabled){e.preventDefault();pickChoice(n-1)}}
    return}
  const k={b:'bag',l:'cal',m:'map',n:'log',j:'tasks'}[e.key.toLowerCase()];
  if(k){e.preventDefault();if(TAB_WINS.includes(win)&&TAB_WINS.includes(k)&&win!==k)openWin(k);else toggleWin(k);return}
  const c=/^[1-9]$/.test(e.key)&&visCats()[+e.key-1];
  if(c&&!win){e.preventDefault();openCat(c.id)}
});

/* ============ Pixel scene ============ */
/* Cảnh 320×180 vẽ bằng src/gfx/scenes/. Mỗi địa điểm có một cảnh chính; một số hành động mở cảnh riêng
 * (hướng B trong design/05–08) trong ACT_MS mili giây rồi trở về cảnh chính. Bấm vào cảnh để bỏ qua. */
const cv=$('scene'),sctx=cv.getContext('2d');sctx.imageSmoothingEnabled=false;
const ACT_MS=1600;
const reduceMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let actScene=null;
const shiftIdx=sl=>sl===0?0:sl===2?1:2;
/* hành động → [hàm cảnh, tên cảnh, tùy chọn]; slot là buổi lúc bắt đầu hành động */
const ACT_SCENES={
  class:sl=>[Scenes.school,'hall',{week:chOf(s.day)-1}],
  exam:sl=>[Scenes.school,'hall',{week:'exam'}],
  library:sl=>[Scenes.school,'lib',{stack:Math.min(6,s.study)}],
  club:sl=>[Scenes.school,'club',{poster:chOf(s.day)===2}],
  canteen:sl=>[Scenes.school,'canteen',{}],
  interview:sl=>[Scenes.store,'shop',{state:1}],
  shift:sl=>[Scenes.store,'shift',{shift:shiftIdx(sl),name:s.name}],
  comtam:sl=>[Scenes.food,'table',{dish:'comtam'}],pho:sl=>[Scenes.food,'table',{dish:'pho'}],bunbo:sl=>[Scenes.food,'table',{dish:'bunbo'}],
  trada:sl=>[Scenes.food,'table',{dish:'trada'}],oc:sl=>[Scenes.food,'table',{dish:'oc'}],
  cfsd:sl=>[Scenes.rest,'cafeTable',{variant:'cfsd'}],chill:sl=>[Scenes.rest,'cafeTable',{variant:'chill'}],khoa:sl=>[Scenes.rest,'cafeTable',{variant:'khoa'}],
};
function startActScene(a){
  const mk=ACT_SCENES[a.id];if(!mk)return;
  const [fn,name,o]=mk(s.slot);actScene={fn,name,o:{...o,slot:s.slot},until:performance.now()+ACT_MS};
}
/* cảnh chính của từng địa điểm, trạng thái theo tiến độ (DESIGN_SPEC mục 3) */
function locScene(){
  const sl=s.slot,sale=curEvent&&curEvent.title&&curEvent.title.startsWith('Giày');
  switch(s.loc){
    case 'home':return [Scenes.room,null,{mess:messLv(),slot:sl,x:148,feet:152}];
    case 'school':return [Scenes.school,'hub',{slot:sl,poster:chOf(s.day)===2&&s.day<=13}];
    case 'store':return [Scenes.store,'shop',{slot:sl,state:s.flags.hired?2:0}];
    case 'street':return [Scenes.food,'street',{slot:sl}];
    case 'market':return [Scenes.food,'market',{slot:sl,sick:s.sk<40}];
    case 'cafe':return [Scenes.rest,'cafe',{slot:sl}];
    case 'park':return [Scenes.rest,'park',{slot:sl}];
    case 'mall':return [Scenes.rest,'mall',{slot:sl,state:sale?2:s.q.q4_gift==='active'?1:0}];
  }
}
const coverT=t=>reduceMotion()?0:t+2500;
function drawScene(t){
  const anim=!reduceMotion();
  if(mode==='title'){Scenes.cover.frame(sctx,coverT(t),anim);return}
  if(mode==='create'){Scenes.cover.frame(sctx,coverT(t),anim,{minh:false});Scenes.cover.bust($('crAva').getContext('2d'),t,anim,crGender);return}
  if(mode==='intro'){const ts=(performance.now()-introStart)/1000;
    if(anim)Scenes.cover.day1Frame(sctx,ts*1000,inPAt(ts),{morning:ts-IN_MORNING});else Scenes.cover.day1Frame(sctx,0,1,{static:true});
    introUI(anim?ts:IN_T.ready);return}
  if(actScene&&performance.now()>actScene.until)actScene=null;
  const [fn,name,o]=actScene?[actScene.fn,actScene.name,actScene.o]:locScene();
  const opt={...o,gender:s.gender,animate:!reduceMotion(),hero:drawHero};
  if(name)fn(sctx,name,t,opt);else fn(sctx,t,opt);
}
cv.addEventListener('pointerdown',()=>{actScene=null});
/* Nhân vật chính (design/12 thẻ 3): trang phục theo hoàn cảnh, biểu cảm theo chỉ số, bong bóng khi chỉ số nguy hiểm */
function heroLook(){
  const outfit=s.loc==='store'&&s.flags.hired?'store':isWE(s.day)?'weekend':'week';
  let mood='normal',bub=null;
  if(s.started){if(s.sk<30){mood='sick';bub='sick'}else if(s.no<25){mood='hungry';bub='hungry'}else if(s.nl<15){mood='tired';bub='tired'}else if(s.tt<30){mood='sad';bub=s.tt<25?'sad':null}else if(s.tt>=60)mood='happy'}
  return {outfit,mood,bub};
}
function drawHero(c,cx,feet,t){
  const {outfit,mood,bub}=heroLook(),b=Math.floor(t/900)%2,x=cx-15,y=feet-52;
  GFX.use(c);for(let k=0;k<18;k++)GFX.dith(cx-9+k,feet-1,1,3,'#3a2e36',.45);
  c.drawImage(Chars.sprite(s.gender==='nu'?'nu':'nam',outfit,mood,{b}),x,y);
  if(bub)c.drawImage(Chars.BUB[bub],x+16,y-18-(Math.floor(t/400)%2));
}
let lastDraw=0;
function loop(t){if(t-lastDraw>66){lastDraw=t;try{drawScene(t);if(win==='map')drawMap(t)}catch(e){console.error(e)}}requestAnimationFrame(loop)}

/* ============ Boot ============ */
function boot(data){
  document.querySelectorAll('[data-ic]').forEach(el=>el.style.setProperty('--i',`url(${icURL(el.dataset.ic)})`));
  if(data&&data.state&&data.state.started&&data.state.q){s=data.state;startGame();if(s.over)openWin('end');else processQueue()}
  else{s=newState();showTitle()}
  requestAnimationFrame(loop);
}
boot({});
