/* 30 Ngày Sài Gòn · v0.1.0
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
const BILLS={5:['Tiền nhà',1500000],10:['Điện, nước, internet',350000],20:['Trả góp điện thoại',400000]};
const START_MONEY=3500000;
const KEY='ba-muoi-ngay-sg-v3';
const RELAX=['net','trada','oc','walk','bench','chill','movie','shop','window','stroll','pantry','khoa','clean'];

let s, queue=[], curEvent=null, win=null, bagSel=null, calSel=1, toastTimer=0, menuCat=null, menuSel=null;

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
  p_quan:[["............","..hhhhhhhh..","..hhhhhhhh..",F3,F4,"..gegssgeg..",F6,F7,F8,F9,F10,F10],{...FACE,h:'#1a1a22',g:'#2b2f3a',c:'#3a78c2'}],
  p_hanh:[["............","...hhhhhh...","..hhhhhhhh..",".hhsssssshh.",".hssssssssh.",".hsessssesh.",".hssssssssh.",".hsssmmsssh.",".hhsssssshh.",".hcccccccch.",F10,F10],{...FACE,h:'#2a1c14',c:'#ff86b3'}],
  p_khoa:[["............","..kkkkkkk...","..kkkkkkkkkk",F3,F4,F5,F6,F7,F8,F9,F10,F10],{...FACE,h:'#2a1c14',k:'#e2525c',c:'#4caf50'}],
};
const _ico={};
function ico(key){
  if(_ico[key])return _ico[key];
  const [rows,pal]=ICON[key];let r='';
  rows.forEach((row,y)=>{for(let x=0;x<row.length;x++){const c=row[x];if(c!=='.'&&pal[c])r+=`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[c]}"/>`}});
  return _ico[key]=`<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}

/* ============ Story ============ */
const PEOPLE={
  me:{n:'Mẹ',p:'p_me'},tu:{n:'Cô Tư · chủ nhà trọ',p:'p_tu'},quan:{n:'Anh Quân · trưởng nhóm',p:'p_quan'},
  hanh:{n:'Chị Hạnh · phòng kế toán',p:'p_hanh'},khoa:{n:'Khoa · bạn thân',p:'p_khoa'},self:{n:'Minh',p:'p_minh'},
};
const CHAPTERS={
  1:{t:'Chân ướt chân ráo',from:1,to:7,txt:'Minh vừa tốt nghiệp, rời Tuy Hòa vào Sài Gòn nhận việc designer thử việc ở một agency Quận 1. Hành trang là chiếc xe máy cũ, 3,5 triệu trong ví và lời dặn của mẹ. Ba mươi ngày tới sẽ quyết định Minh có được ký hợp đồng chính thức hay không.'},
  2:{t:'Guồng quay',from:8,to:14,txt:'Tuần thứ hai, việc dồn tới. Anh Quân giao dự án banner Trung Thu, hạn chót thứ Sáu. Cuối tuần là đám cưới chị Hạnh. Ví đang mỏng dần, còn lương phải đợi tới ngày 15.'},
  3:{t:'Ngày lương',from:15,to:21,txt:'Lương kỳ đầu tiên đã về. Có tiền thì dễ chịu, và cũng dễ tiêu. Khoa, bạn thân từ hồi đại học, nhắn hẹn cà phê cuối tuần. Đây là lúc lập quỹ phòng thân trước khi tiền bay hết.'},
  4:{t:'Về đích',from:22,to:30,txt:'Tuần cuối thử việc. Sáng thứ Hai ngày 29, Minh thuyết trình tổng kết trước anh Quân. Ngày 30 cũng là sinh nhật mẹ. Mẹ nói không cần quà, nhưng Minh muốn gửi chút gì đó về quê.'},
};
const QUESTS=[
  {id:'q1_work',ch:1,who:'quan',t:'Ngày đầu đi làm',d:'Đến Công ty và làm ca sáng ngày 1.',hint:'Bản đồ → Công ty → Hoạt động → Làm việc',goal:'office',prog:s=>[Math.min(s.ca,1),1],due:1,rw:{tt:5},work:1},
  {id:'q1_cook',ch:1,who:'tu',t:'Bữa cơm nhà đầu tiên',d:'Nấu một bữa ở Phòng trọ bằng nguyên liệu trong túi.',hint:'Về Phòng trọ → Túi đồ → Nguyên liệu → Nấu cơm',goal:'home',prog:s=>[Math.min(s.cooked,1),1],due:4,rw:{tt:6,sk:3}},
  {id:'q1_rent',ch:1,who:'tu',t:'Tiền nhà cho cô Tư',d:'Giữ đủ 1.500.000đ trong ví đến sáng ngày 5.',hint:'Tiền nhà tự trừ sáng ngày 5. Đừng tiêu quá tay trước đó.',prog:s=>[s.flags.rentPaid?1:0,1],due:5,rw:{tt:4},item:['traicay',2],rwTxt:'Cô Tư tặng 2 phần trái cây'},
  {id:'q1_week',ch:1,who:'quan',t:'Tuần đầu trọn vẹn',d:'Làm đủ 10 ca từ thứ Hai đến thứ Sáu tuần đầu.',hint:'Ca sáng và ca chiều mỗi ngày thường',goal:'office',prog:s=>[Math.min(s.caCh[1],10),10],unit:'ca',due:5,rw:{tt:8},work:1},
  {id:'q2_banner',ch:2,who:'quan',t:'Dự án banner Trung Thu',d:'Làm đủ 8 ca từ ngày 8 đến ngày 12 để kịp hạn giao khách.',hint:'Tuần này chỉ được vắng tối đa 2 ca',goal:'office',prog:s=>[Math.min(s.caCh[2],8),8],unit:'ca',due:12,rw:{tt:6},bonus:200000,rwTxt:'Thưởng dự án 200k vào lương',work:1},
  {id:'q2_wedding',ch:2,who:'hanh',t:'Đám cưới chị Hạnh',d:'Dự đám cưới chị Hạnh trưa thứ Bảy, ngày 13.',hint:'Chuẩn bị sẵn 300–500k tiền mừng',prog:s=>[s.flags.weddingGo?1:0,1],due:13,rw:{tt:6}},
  {id:'q2_mood',ch:2,who:'self',t:'Đừng để mình kiệt quệ',d:'Giữ tinh thần từ 30 trở lên suốt ngày 8 đến ngày 14.',hint:'Xen kẽ việc thư giãn sau giờ làm',endCheck:1,fail:s=>!!s.flags.mood2Fail,pass:s=>!s.flags.mood2Fail,prog:s=>[s.day>14?1:0,1],label:s=>s.flags.mood2Fail?'Đã tụt dưới 30':`Giữ vững thêm ${Math.max(0,15-s.day)} ngày`,due:14,rw:{tt:5,sk:3}},
  {id:'q3_save',ch:3,who:'self',t:'Quỹ khẩn cấp',d:'Gửi tiết kiệm ít nhất 1.000.000đ ở Ngân hàng.',hint:'Ngân hàng → Giao dịch → Gửi tiết kiệm',goal:'bank',prog:s=>[Math.min(s.savings,1e6),1e6],money:1,due:21,rw:{tt:6}},
  {id:'q3_noloan',ch:3,who:'self',t:'Nói không với vay nóng',d:'Không vay qua app trong cả tháng.',hint:'Lãi app vay là 30% mỗi tháng',endCheck:1,fail:s=>s.loanCount>0,pass:s=>s.loanCount===0,prog:s=>[s.day>21?1:0,1],label:s=>s.loanCount?'Đã vay':'Giữ đến hết ngày 21',due:21,rw:{tt:5}},
  {id:'q3_khoa',ch:3,who:'khoa',t:'Cà phê với Khoa',d:'Gặp Khoa ở Cà phê Gác Nhỏ vào buổi chiều ngày 20 hoặc 21.',hint:'Chiều thứ Bảy hoặc Chủ Nhật → Cà phê → Cà phê với Khoa',goal:'cafe',prog:s=>[s.flags.metKhoa?1:0,1],due:21,rw:{tt:8}},
  {id:'q4_present',ch:4,who:'quan',t:'Chuẩn bị thuyết trình',d:'Làm đủ 10 ca từ ngày 22 đến ngày 29 để hoàn thiện bài thuyết trình.',hint:'Thuyết trình sáng thứ Hai, ngày 29',goal:'office',prog:s=>[Math.min(s.caCh[4],10),10],unit:'ca',due:29,rw:{tt:6},work:1},
  {id:'q4_mom',ch:4,who:'me',t:'Quà sinh nhật mẹ',d:'Chuyển 500.000đ về quê trước hết ngày 30.',hint:'Ngân hàng → Giao dịch → Chuyển tiền về quê',goal:'bank',prog:s=>[s.flags.sentMom?1:0,1],due:30,rw:{tt:15}},
  {id:'q4_health',ch:4,who:'self',t:'Về đích khỏe mạnh',d:'Kết thúc ngày 30 với sức khỏe từ 50 trở lên.',hint:'Ăn đủ, ngủ đủ, bớt tăng ca',endCheck:1,pass:s=>s.sk>=50,prog:s=>[s.sk>=50?1:0,1],label:s=>`Sức khỏe hiện tại ${s.sk}/50`,due:30,rw:{},rwTxt:'Điểm cuối tháng tốt hơn'},
];
const QBY=Object.fromEntries(QUESTS.map(q=>[q.id,q]));
const DAILY={
  work2:{t:'Đi làm đủ 2 ca',prog:s=>[Math.min(s.caToday,2),2]},
  eat2:{t:'Ăn ít nhất 2 bữa',prog:s=>[Math.min(s.mealsToday,2),2]},
  cook:{t:'Nấu một bữa ở nhà',prog:s=>[s.cookedToday?1:0,1]},
  relax:{t:'Làm một việc thư giãn',prog:s=>[s.relaxToday?1:0,1]},
  frugal:{t:'Tiêu dưới 100k hôm nay',eod:1,prog:s=>[s.spentToday<100000?1:0,1],label:s=>`đã tiêu ${fk(s.spentToday)}`},
};

/* ============ Items (bag) ============ */
const ITEMS={
  banhmi:{n:'Bánh mì thịt',type:'food',d:'Pate, chả lụa, đồ chua. Ăn nhanh, no vừa.',eff:{no:22,tt:1},shelf:1},
  xoi:{n:'Xôi gà',type:'food',d:'Gói lá chuối, còn ấm. Chắc bụng hơn bánh mì.',eff:{no:28,tt:2},shelf:1},
  mi:{n:'Mì gói',type:'food',d:'Rẻ, để lâu không hỏng. Từ gói thứ hai trong ngày sẽ hại sức khỏe gấp đôi.',eff:s=>({no:24,tt:-2,sk:s.noodleToday>=1?-8:-4}),shelf:null,where:['home','office'],whereTxt:'Cần nước sôi: dùng ở phòng trọ hoặc công ty',after:s=>{s.noodleToday++;s.noodleTotal++}},
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
  savings:0,debt:0,loanCount:0,accrued:0,paid1:false,caHalf:0,absences:0,ca:0,ot:0,noodleToday:0,noodleTotal:0,cooked:0,
  caToday:0,mealsToday:0,spentToday:0,relaxToday:0,cookedToday:0,caCh:{1:0,2:0,3:0,4:0},
  ateThisSlot:false,bikeBroken:0,lent:0,flags:{},log:[],hist:[],sumNo:0,sumTt:0,samples:0,
  q:{},pin:null,daily:[],
  bag:[{id:'mi',exp:null},{id:'mi',exp:null},{id:'mi',exp:null},{id:'nguyenlieu',exp:3},{id:'caphe',exp:null}]}}
function addLog(text,tone=''){s.log.unshift({d:s.day,sl:s.slot,text,tone});if(s.log.length>50)s.log.length=50;showToast(text,tone)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function loadSaved(){try{const r=localStorage.getItem(KEY);return r?JSON.parse(r):null}catch(e){return null}}

/* ============ Locations & actions ============ */
const LOCS={
  home:{name:'Phòng trọ',short:'Phòng trọ',sub:'Hẻm 42 · Bình Thạnh',cost:0,mx:14,my:62,open:()=>null},
  street:{name:'Quán ăn đầu hẻm',short:'Quán ăn',sub:'Bánh mì, cơm tấm, phở',cost:0,mx:30,my:42,open:()=>null},
  market:{name:'Chợ phường',short:'Chợ',sub:'Nguyên liệu, mì gói, trái cây, thuốc',cost:0,mx:24,my:82,open:s=>s.slot<=2?null:'Chợ đã dọn hàng'},
  park:{name:'Công viên bờ kênh',short:'Công viên',sub:'Chạy bộ, đi dạo, hóng gió',cost:0,mx:51,my:24,open:()=>null},
  cafe:{name:'Cà phê Gác Nhỏ',short:'Cà phê',sub:'Cà phê, ngồi chill, part-time cuối tuần',cost:5000,mx:47,my:58,open:()=>null},
  office:{name:'Công ty',short:'Công ty',sub:'Agency Quận 1 · ca sáng và ca chiều',cost:8000,mx:78,my:36,open:s=>isWE(s.day)?'Cuối tuần công ty nghỉ':null},
  bank:{name:'Ngân hàng',short:'Ngân hàng',sub:'Tiết kiệm, vay, chuyển tiền',cost:5000,mx:67,my:72,open:s=>s.slot<=2?null:'Ngân hàng đã đóng cửa lúc 17h'},
  mall:{name:'Trung tâm thương mại',short:'TTTM',sub:'Buffet, rạp phim, cửa hàng quần áo',cost:12000,mx:87,my:74,open:s=>s.slot>=1?null:'TTTM mở cửa từ 10h'},
};
const payPerCa=s=>s.nl<15?60000:(s.tt<25?90000:120000);
const IDLE={id:'idle',k:'act',n:'Ngồi nghỉ một lúc',d:'Không làm gì, để thời gian trôi sang buổi sau.',eff:{nl:3,tt:-1},free:true};
const buy=(item,cost,qty,n)=>({id:'buy_'+item,k:'buy',n,d:ITEMS[item].d,cost,qty,eff:{},note:()=>`+${qty} vào túi`,run:s=>bagAdd(item,qty)});
const A={
  home:[
    {id:'ship',k:'meal',n:'Đặt đồ ăn qua app',d:'Tiện, nhưng gánh thêm phí giao hàng.',cost:68000,eff:{no:40,tt:5}},
    {id:'nap',k:'act',n:'Ngủ một giấc',d:'Hồi năng lượng.',eff:{nl:22,tt:3},when:s=>s.slot===3?'Buổi tối thì đi ngủ luôn':null},
    {id:'net',k:'act',n:'Lướt mạng, xem phim',d:'Giải trí miễn phí.',eff:{tt:7,nl:-2,sk:-1}},
    {id:'clean',k:'act',n:'Dọn phòng, giặt đồ',d:'Phòng gọn thì đầu óc nhẹ.',eff:{tt:5,nl:-6}},
    {id:'free',k:'act',n:'Nhận job freelance',d:'Thiết kế banner cho khách quen. Trả tiền ngay.',gain:110000,eff:{nl:-20,tt:-5},when:s=>s.slot>=2?null:'Khách chỉ gửi việc từ chiều'},
    {id:'sleep',k:'act',n:'Đi ngủ sớm',d:'Kết thúc ngày, hồi thêm năng lượng khi ngủ.',eff:{},note:()=>'Năng lượng +15 khi ngủ',when:s=>s.slot===3?null:'Chỉ ngủ sớm vào buổi tối'},
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
    {id:'khoa',k:'act',n:'Cà phê với Khoa',d:'Ngồi tán chuyện với bạn thân, kể nhau nghe tháng đầu đi làm.',cost:30000,eff:{tt:14,nl:4},story:1,show:s=>s.q.q3_khoa==='active',when:s=>(s.day===20||s.day===21)&&s.slot===2?null:'Khoa hẹn buổi chiều ngày 20 hoặc 21',run:s=>{s.flags.metKhoa=1}},
    {id:'chill',k:'act',n:'Ngồi chill, đọc sách',d:'Một góc yên tĩnh.',cost:45000,eff:{tt:13,nl:6}},
    {id:'pt',k:'act',n:'Làm part-time phục vụ',d:'Chỉ tuyển cuối tuần. Trả tiền cuối ca.',gain:150000,eff:{nl:-25,tt:-4,no:-4},when:s=>isWE(s.day)?null:'Chỉ tuyển ca cuối tuần'},
  ],
  office:[
    {id:'canteen',k:'meal',n:'Cơm căng tin',d:'Rẻ hơn quán ngoài.',cost:35000,eff:{no:33,tt:1},when:s=>s.slot===1?null:'Căng tin chỉ mở buổi trưa'},
    {id:'work',k:'act',n:'Làm việc',d:'Mỗi ca cộng vào lương và điểm thử việc. Lương trả ngày 15 và cuối tháng.',eff:{nl:-22,tt:-4,no:-4},when:s=>(s.slot===0||s.slot===2)?null:'Ca làm là buổi sáng và buổi chiều',note:s=>`+${fk(payPerCa(s))} lương`,pre:s=>{s.accrued+=payPerCa(s);s.ca++;s.caToday++;s.caCh[chOf(s.day)]++}},
    {id:'desknap',k:'act',n:'Ngủ trưa tại bàn',d:'Chợp mắt 30 phút.',eff:{nl:14},when:s=>s.slot===1?null:'Chỉ nghỉ được giờ trưa'},
    {id:'pantry',k:'act',n:'Tán gẫu ở pantry',d:'Hóng chuyện công ty.',eff:{tt:5,nl:-2},when:s=>s.slot===1?null:'Giờ làm thì tập trung đi'},
    {id:'advance',k:'quick',n:'Xin ứng lương',d:'Ứng trước 500.000đ từ lương đang tích lũy. Không mất lãi, mỗi kỳ lương ứng được 1 lần.',eff:{},when:s=>s.accrued<500000?'Cần tích lũy đủ 500k lương':s.flags['adv'+(s.paid1?2:1)]?'Kỳ lương này đã ứng rồi':null,note:()=>'+500k · trừ vào lương chờ',run:s=>{s.money+=500000;s.accrued-=500000;s.flags['adv'+(s.paid1?2:1)]=1}},
    {id:'ot',k:'act',n:'Tăng ca',d:'Lương cao hơn ca thường, nhưng vắt sức.',eff:{nl:-30,tt:-8,sk:-3},when:s=>s.slot===3?null:'Tăng ca vào buổi tối',note:()=>'+170k lương',pre:s=>{s.accrued+=170000;s.ot++}},
  ],
  bank:[
    {id:'sendmom',k:'quick',n:'Chuyển tiền về quê',d:'Gửi mẹ 500.000đ làm quà sinh nhật.',cost:500000,eff:{tt:4},story:1,show:s=>s.q.q4_mom==='active',run:s=>{s.flags.sentMom=1}},
    {id:'dep',k:'quick',n:'Gửi tiết kiệm 500.000đ',d:'Kỳ hạn đến cuối tháng, lãi 0,4%.',cost:500000,eff:{},note:()=>'Lãi 0,4% cuối tháng',run:s=>{s.savings+=500000}},
    {id:'wd',k:'quick',n:'Rút hết tiết kiệm',d:'Rút trước hạn thì mất lãi.',eff:{},when:s=>s.savings>0?null:'Chưa có khoản tiết kiệm',note:s=>s.savings?`+${fk(s.savings)} về ví`:'',run:s=>{s.money+=s.savings;s.savings=0}},
    {id:'loan',k:'quick',n:'Vay nhanh qua app',d:'Nhận ngay 1 triệu. Cuối tháng phải trả 1,3 triệu.',eff:{tt:-3},when:s=>s.loanCount<2?null:'Đã vay tối đa 2 lần',note:()=>'+1tr · Nợ +1,3tr',run:s=>{s.money+=1000000;s.debt+=1300000;s.loanCount++}},
    {id:'repay',k:'quick',n:'Trả nợ',d:'Dùng tiền trong ví trả bớt nợ.',eff:{tt:3},when:s=>s.debt>0?(s.money>0?null:'Ví đang trống'):'Bạn không có nợ',run:s=>{const p=Math.min(s.money,s.debt);s.money-=p;s.debt-=p}},
  ],
  mall:[
    {id:'buffet',k:'meal',n:'Buffet lẩu',d:'Ăn cho đã.',cost:199000,eff:{no:50,tt:15,sk:-1}},
    {id:'movie',k:'act',n:'Xem phim',d:'Suất chiếu mới nhất.',cost:110000,eff:{tt:18,nl:-4}},
    {id:'shop',k:'act',n:'Mua quần áo mới',d:'Vui tức thì.',cost:350000,eff:{tt:22}},
    {id:'window',k:'act',n:'Đi dạo ngắm đồ',d:'Miễn phí. Nhưng dễ bị dụ mua.',eff:{tt:4,nl:-8},run:()=>{if(Math.random()<0.35)queue.push(evImpulse())}},
  ],
};
const CATS=[
  {id:'eat',n:'Ăn uống',ic:'no',ks:['meal','drink'],verb:'Ăn'},
  {id:'buy',n:'Mua',ic:'basket',ks:['buy'],verb:'Mua'},
  {id:'act',n:'Hoạt động',ic:'star',ks:['act'],verb:'Làm'},
  {id:'bank',n:'Giao dịch',ic:'coin',ks:['quick'],verb:'Thực hiện'},
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
  if(a.pre)a.pre(s);
  if(a.cost){s.money-=a.cost;s.spentToday+=a.cost}
  if(a.gain)s.money+=a.gain;
  const out=applyEff(effOf(a));
  if(a.run)a.run(s);
  if(RELAX.includes(a.id))s.relaxToday=1;
  popFx(out,s.money-m0);
  addLog(a.n+(a.cost?` (−${fk(a.cost)})`:'')+(a.gain?` (+${fk(a.gain)})`:''));
  if(a.k==='meal'){s.ateThisSlot=true;s.mealsToday++}
  if(a.k==='act'){closeMenu();endSlot(a)}
  else if(a.k==='meal'||a.k==='drink')closeMenu();
  afterChange();return true;
}
function useItem(id){
  const r=itemReason(id);if(r||s.over)return;
  const it=ITEMS[id];
  const out=applyEff(effOf(it));
  bagTake(id);if(it.after)it.after(s);
  if(it.type==='food'){s.ateThisSlot=true;s.mealsToday++}
  popFx(out,0);
  addLog(it.verb?`${it.verb} ăn`:`Dùng ${it.n.toLowerCase()}`);
  if(!bagCount(id))bagSel=null;
  refresh();
}
function endSlot(a){
  if(!isWE(s.day)&&(s.slot===0||s.slot===2)&&a.id!=='work'&&!a.excused){
    s.absences++;addLog(s.absences===1?'Vắng ca làm. Mất thưởng chuyên cần 300k.':'Lại vắng một ca làm.','bad');
  }
  s.no-=9;s.tt-=2;
  if(!['nap','bench','desknap'].includes(a.id))s.nl-=4;
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
  s.no-=10;
  if(s.no>=35){s.nl+=50;s.sk+=2}
  else{s.nl+=35;s.tt-=6;s.sk-=2;addLog('Đi ngủ với cái bụng đói, ngủ không ngon.','bad')}
  if(early){s.nl+=15;s.tt+=2}
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
  s.noodleToday=0;s.caToday=0;s.mealsToday=0;s.spentToday=0;s.relaxToday=0;s.cookedToday=0;
  if(s.bikeBroken>0)s.bikeBroken--;
  s.loc='home';s.ateThisSlot=false;
  if(s.day>=30){finish();return}
  s.day++;s.slot=0;
  showBanner();
  dayEvents();
}
function skipSlot(label){addLog(label);endSlot({id:'skip',excused:true})}
function payBill(amt,name){
  if(s.money>=amt){s.money-=amt;return true}
  const short=amt-s.money;s.money=0;s.debt+=Math.round(short*1.1);s.tt=clamp(s.tt-12);
  addLog(`Thiếu ${fk(short)} cho ${name}. Ghi nợ kèm phạt 10%.`,'bad');return false;
}
function travelCost(id){const c=LOCS[id].cost;return c&&s.bikeBroken>0?c*3:c}
function travel(id){
  if(id===s.loc)return;
  let c=travelCost(id);if(LOCS[id].open(s))return;
  const walk=c>0&&s.money<c;
  if(walk){c=0;const o=applyEff({nl:-8,tt:-2});popFx(o,0)}
  s.money-=c;s.spentToday+=c;s.loc=id;
  hideWin();closeMenu();
  addLog(walk?`Hết tiền xăng, đi bộ tới ${LOCS[id].name}`:`Đi tới ${LOCS[id].name}`+(c?` (−${fk(c)} ${s.bikeBroken?'xe ôm':'xăng'})`:''),walk?'bad':'');
  const st=$('stage');st.classList.add('fade');setTimeout(()=>st.classList.remove('fade'),230);
  if(c)popFx({},-c);
  if(id==='office'&&!s.flags.metQuan){s.flags.metQuan=1;queue.push(ev('Chào mừng tới team','“Chào Minh! Ca sáng từ 8 giờ, ca chiều từ 13 giờ 30. Mỗi ca tính 120 nghìn. Tháng này anh chấm thử việc dựa trên chuyên cần và các đầu việc. Cố lên nha.”',[{l:'Dạ, em hiểu rồi'}],'quan'))}
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
  addLog(`Hoàn thành nhiệm vụ: ${q.t}`,'quest');showToast(`Hoàn thành nhiệm vụ · ${q.t}`,'quest');
}
function failQuest(q){s.q[q.id]='fail';addLog(`Nhiệm vụ thất bại: ${q.t}`,'bad')}
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
  const d=s.day,ids=isWE(d)?['relax','frugal']:[(d%2===0&&chOf(d)>=2)?'cook':'eat2','work2'];
  if(isWE(d))ids.reverse();
  s.daily=ids.map(id=>({id,st:null}));
}
function dailyDone(d){d.st='done';const out=applyEff({tt:3});popFx(out,0);addLog(`Xong việc hôm nay: ${DAILY[d.id].t}`,'good')}
function checkDaily(){s.daily.forEach(d=>{if(d.st||DAILY[d.id].eod)return;const [c,m]=DAILY[d.id].prog(s);if(c>=m)dailyDone(d)})}
function trackedQuest(){
  if(s.pin&&s.q[s.pin]==='active')return QBY[s.pin];
  return QUESTS.filter(q=>s.q[q.id]==='active').sort((a,b)=>a.due-b.due)[0]||null;
}
function probation(){
  const w=QUESTS.filter(q=>q.work&&s.q[q.id]==='done').length;
  return clamp(Math.round(s.ca/44*70)+w*5+Math.min(s.ot,5)*2-s.absences*3);
}
const dueText=q=>q.due===s.day?'hạn hết hôm nay':`hạn ngày ${q.due} · còn ${q.due-s.day+1} ngày`;

/* ============ Events ============ */
const ev=(title,text,choices,who)=>({title,text,choices,who});
const evImpulse=()=>ev('Giày đang sale 40%','Đôi giày bạn để ý từ lâu đang giảm giá, chỉ còn 420.000đ.',[
  {l:'Mua luôn',cost:420000,eff:{tt:14}},{l:'Thôi, không cần',eff:{tt:-3}}]);
const EVENTS=[
  {id:'nhau',w:3,when:s=>s.slot===3&&!isWE(s.day),mk:()=>ev('Đồng nghiệp rủ đi nhậu','“Tối nay làm vài ly không Minh?” Cả nhóm đang chờ câu trả lời.',[
    {l:'Đi luôn',cost:250000,eff:{tt:16,sk:-8,nl:-12,no:15}},{l:'Từ chối khéo',eff:{tt:-5}}],'quan')},
  {id:'bike',w:2,when:s=>s.slot===0&&s.bikeBroken===0&&(s.flags.bikeN||0)<2,mk:s=>{s.flags.bikeN=(s.flags.bikeN||0)+1;return ev('Xe chết máy','Chiếc xe máy cũ đề không nổ. Thợ đầu hẻm báo giá sửa 300.000đ.',[
    {l:'Sửa ngay',cost:300000,eff:{tt:-2}},{l:'Đi xe ôm công nghệ vài hôm',eff:{tt:-4},x:'Phí đi lại ×3 trong 4 ngày',run:s=>{s.bikeBroken=4}}])}},
  {id:'found',w:.6,once:1,when:()=>true,mk:()=>ev('Nhặt được tiền','Tờ 50.000đ rơi trên vỉa hè, xung quanh không có ai.',[
    {l:'Bỏ túi',gain:50000,eff:{tt:3}},{l:'Gửi bảo vệ gần đó',eff:{tt:8}}])},
  {id:'bonus',w:5,once:1,when:s=>s.slot===2&&s.loc==='office'&&s.ca>=14,mk:()=>ev('Anh Quân khen trước cả phòng','“Layout tuần này của Minh khách khen lắm.” Kèm theo là một khoản thưởng nóng.',[
    {l:'Nhận thưởng',gain:200000,eff:{tt:12}}],'quan')},
  {id:'rain',w:2,when:s=>s.slot===2,mk:()=>ev('Mưa to bất chợt','Trời đổ mưa như trút, đường bắt đầu ngập.',[
    {l:'Trú mưa, gọi ly trà',cost:20000,eff:{tt:2}},{l:'Đội mưa đi tiếp',eff:{sk:-6,tt:-4}}])},
  {id:'lend',w:1.5,once:1,when:s=>s.day>=6&&s.day<=19,mk:()=>ev('Khoa hỏi mượn tiền','“Cho tao mượn 300k, cuối tháng trả nha. Tháng này kẹt quá.”',[
    {l:'Cho mượn',cost:300000,eff:{tt:3},x:'Hẹn trả ngày 28',run:s=>{s.lent=300000}},{l:'Từ chối',eff:{tt:-6}}],'khoa')},
  {id:'phone',w:1,once:1,when:()=>true,mk:()=>ev('Rơi điện thoại','Điện thoại tuột tay, màn hình nứt một đường dài.',[
    {l:'Thay màn hình',cost:400000},{l:'Dùng tạm',eff:{tt:-10}}])},
  {id:'bday',w:2,once:1,when:s=>isWE(s.day)&&s.slot===3&&s.day!==13,mk:()=>ev('Sinh nhật bạn cùng lớp','Nhóm bạn đại học tổ chức sinh nhật ở quán nướng, Khoa cũng tới.',[
    {l:'Góp quà, đi dự',cost:200000,eff:{tt:12,no:15}},{l:'Nhắn tin chúc mừng',eff:{tt:-4}}],'khoa')},
];
function slotEvents(){
  if(s.over)return;
  if(s.sk<=0){queue.push(ev('Ngất xỉu','Cơ thể kiệt quệ, Minh được đưa vào viện. Viện phí 1.200.000đ, nghỉ hết hôm nay.',[
    {l:'Chấp nhận',run:s=>{payBill(1200000,'viện phí');s.sk=45;s.nl=60;s.no=Math.max(s.no,50);s.tt=clamp(s.tt-15);if(!isWE(s.day))s.absences++;s.slot=3;endDay(false)}}]));return}
  if(s.day===13&&s.slot===1&&!s.flags.wedding){s.flags.wedding=1;queue.push(ev('Đám cưới chị Hạnh','“Trưa nay nhớ ghé nha Minh, cả phòng đều đi đó!”',[
    {l:'Đi dự, mừng 500k',cost:500000,eff:{tt:10,no:30},x:'Hết buổi trưa',run:s=>{s.flags.weddingGo=1;s.mealsToday++;skipSlot('Đi đám cưới chị Hạnh')}},
    {l:'Đi dự, mừng 300k',cost:300000,eff:{tt:5,no:30},x:'Hết buổi trưa',run:s=>{s.flags.weddingGo=1;s.mealsToday++;skipSlot('Đi đám cưới chị Hạnh')}},
    {l:'Gửi lời chúc, không đi',eff:{tt:-10}}],'hanh'));return}
  if(s.day===11&&s.slot===3&&!s.flags.sale){s.flags.sale=1;queue.push(ev('Flash sale 0 giờ','App mua sắm báo: tai nghe không dây giảm 50%, còn 450.000đ. Chỉ còn 3 phút.',[
    {l:'Chốt đơn',cost:450000,eff:{tt:15}},{l:'Đóng app',eff:{tt:-3}}]));return}
  if(s.day===29&&s.slot===0&&!s.flags.present){s.flags.present=1;const ok=s.q.q4_present==='done'||s.caCh[4]>=8;queue.push(ev('Buổi thuyết trình tổng kết',ok?'“Bài làm chỉn chu đó Minh. Anh ghi nhận.” Anh Quân gật gù khi xem slide cuối.':'“Phần này còn sơ sài quá Minh.” Anh Quân nhíu mày lật qua các trang slide.',[{l:ok?'Cảm ơn anh':'Em sẽ cố hơn'}],'quan'));return}
  if(s.slot===0&&s.sk<40&&Math.random()<0.45){queue.push(ev('Bị ốm','Sáng dậy đầu nặng, người nóng hầm hập. Sức khỏe đang yếu.',[
    {l:'Uống thuốc cảm trong túi',need:s=>bagCount('thuoc')?null:'Túi không có thuốc',eff:{sk:12,tt:-1},run:s=>bagTake('thuoc')},
    {l:'Đi khám phòng khám',cost:250000,eff:{sk:25,nl:5},x:'Hết buổi sáng · có giấy nghỉ ốm',run:()=>skipSlot('Nghỉ ốm có phép')},
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
  if(CHAPTERS[chOf(s.day)].from===s.day)activateChapter(chOf(s.day));
  const b=BILLS[s.day];
  if(b){const ok=payBill(b[1],b[0]);
    if(s.day===5&&ok)s.flags.rentPaid=1;
    addLog(`${b[0]}: −${fk(b[1])}`,ok?'':'bad');
    queue.push(s.day===5?ev('Cô Tư thu tiền nhà',ok?'“Đủ rồi nghen con. Ở đây có gì cứ kêu cô.” Cô Tư đếm tiền, cười hiền.':'“Thiếu vậy con? Thôi cô ghi sổ, nhưng nhớ là có phạt đó nghen.”',[{l:ok?'Dạ, con cảm ơn cô':'Dạ, con xin lỗi cô'}],'tu')
      :ev(`${b[0]} đến hạn`,ok?`Đã tự động trừ ${fmt(b[1])} từ ví.`:`Ví không đủ ${fmt(b[1])}. Phần thiếu được ghi nợ, cộng phạt 10%.`,[{l:'Đã hiểu'}]))}
  if(s.day===15){const x=s.accrued;s.caHalf=s.ca;s.money+=x;s.accrued=0;s.paid1=true;
    addLog(`Nhận lương kỳ 1: +${fk(x)}`,'good');
    queue.push(ev('Lương kỳ 1 đã về',`Công ty chuyển ${fmt(x)} cho ${s.ca} ca làm nửa đầu tháng. Lương nửa sau được cộng vào tổng kết ngày 30.`,[{l:'Nhận lương'}]))}
  if(s.day===28&&s.lent>0){const back=Math.random()<0.65;const amt=s.lent;s.lent=0;
    if(back){s.money+=amt;s.tt=clamp(s.tt+5);addLog(`Khoa trả lại ${fk(amt)}.`,'good');queue.push(ev('Khoa trả tiền','“Trả mày nè, cảm ơn nha. Có gì tao bao cà phê.”',[{l:'Tốt quá'}],'khoa'))}
    else{s.tt=clamp(s.tt-6);addLog('Khoa hẹn trả sau. Mất 300k.','bad');queue.push(ev('Khoa hẹn lần sau','“Tháng này tao kẹt thiệt, cho tao khất thêm nha.” Khoản 300.000đ coi như chưa về.',[{l:'Đành vậy'}],'khoa'))}}
  genDaily();
  slotEvents();
}

/* ============ Score & ending ============ */
function computeScore(){
  const sav=Math.round(s.savings*1.004),bonus=s.absences===0?300000:0;
  const asset=s.money+sav+s.accrued+bonus-s.debt,n=Math.max(1,s.samples);
  const F={tien:clamp(asset/4000000,0.05,1.25),no:Math.max(0.05,s.sumNo/n/100),tt:Math.max(0.05,s.sumTt/n/100),sk:Math.max(0.05,s.sk/100)};
  return {asset,sav,bonus,F,score:Math.round(1000*F.tien**0.35*F.no**0.2*F.tt**0.25*F.sk**0.2)};
}
function archetype({F}){
  if(s.debt>0)return ['Con nợ cuối tháng','Tháng này qua được nhờ vay mượn. Tháng sau bắt đầu với một khoản phải trả.'];
  if(F.sk<0.4&&s.ot>=5)return ['Cỗ máy cày cuốc','Lương về đều, nhưng cơ thể đã trả giá cho mỗi ca tăng ca.'];
  if(F.tien>=0.9&&(F.no<0.45||F.tt<0.45))return ['Kẻ khổ hạnh','Ví dày lên, còn bụng và tinh thần thì mỏng đi.'];
  if(F.tt>=0.7&&F.tien<0.5)return ['Sống cho hiện tại','Một tháng vui vẻ, nhưng tài khoản gần như trống trơn.'];
  if(Math.min(F.tien,F.no,F.tt,F.sk)>=0.55)return ['Người cân bằng','Đủ ăn, đủ vui, đủ khỏe và vẫn còn để dành.'];
  return ['Người sống sót','Qua tháng được, nhưng có vài chỗ hụt hơi.'];
}
const grade=sc=>sc>=800?'S':sc>=700?'A':sc>=580?'B':sc>=450?'C':'D';
function endingLines(){
  const p=probation(),L=[];
  L.push(['quan',p>=75?`Thử việc đạt ${p}/100. Anh Quân bắt tay Minh: hợp đồng chính thức bắt đầu từ tháng sau.`:p>=55?`Thử việc đạt ${p}/100. Công ty gia hạn thử việc thêm một tháng để Minh chứng minh thêm.`:`Thử việc đạt ${p}/100. Minh không qua thử việc và phải tìm công việc mới.`]);
  L.push(['me',s.flags.sentMom?'Mẹ nhận được tiền mừng sinh nhật, gọi video khoe với cả xóm.':'Sinh nhật mẹ, Minh chỉ kịp gọi điện chúc mừng.']);
  if(s.flags.metKhoa)L.push(['khoa','Buổi cà phê cuối tuần giúp tình bạn với Khoa vẫn bền như hồi đại học.']);
  if(s.flags.weddingGo)L.push(['hanh','Chị Hạnh vẫn nhắc mãi chuyện Minh tới dự đám cưới dù mới vào công ty.']);
  L.push(['tu',s.debt>0?'Cô Tư nhắc khéo: tháng sau nhớ trả tiền nhà đúng hạn.':'Cô Tư khen Minh là người thuê ngoan nhất xóm trọ.']);
  return L;
}
function finish(){s.over=true;queue=[];closeMenu();save();render();openWin('end')}

/* ============ HUD rendering ============ */
function render(){renderTop();renderTracker();renderCmd();renderToolbar();if(win&&win!=='event'&&win!=='end')renderWin()}
function renderTop(){
  $('dayNum').textContent=s.day;
  $('dow').textContent=DOW[dowOf(s.day)];
  $('slots').innerHTML=SLOTS.map((n,i)=>`<li class="${i<s.slot?'done':i===s.slot?'now':''}"${i===s.slot?' aria-current="true"':''}>${n}</li>`).join('');
  $('mstats').innerHTML=STATS.map(S=>`<div class="ms${s[S.k]<25?' low':''}" title="${S.n}: ${s[S.k]}/100" aria-label="${S.n} ${s[S.k]}">${ico(S.k)}<div class="bar"><i style="width:${s[S.k]}%;background:${SCOL[S.k]}"></i><b></b></div><span class="v" style="color:${s[S.k]<25?'':SCOL[S.k]}">${s[S.k]}</span></div>`).join('');
  $('money').textContent=fmt(s.money);
  $('ledger').innerHTML=`Lương chờ ${fk(s.accrued)}`+(s.savings?` · Tiết kiệm ${fk(s.savings)}`:'')+(s.debt?` · <span class="neg">Nợ ${fk(s.debt)}</span>`:'');
  const L=LOCS[s.loc],cl=L.open(s);
  $('placeName').textContent=L.name;$('placeSub').textContent=L.sub;
  $('placeShut').innerHTML=cl?'<span class="shut">Đang đóng cửa</span>':'';
}
function dailyRow(d){const D=DAILY[d.id],[c,m]=D.prog(s);const lbl=D.label?D.label(s):`${c}/${m}`;
  return `<span class="tr-day${d.st==='done'?' done':''}"><span class="ck${d.st==='done'?' on':d.st==='fail'?' fail':''}"></span><span class="tx">${D.t}</span><span class="pc">${lbl}</span></span>`}
function renderTracker(){
  const q=trackedQuest(),ch=chOf(s.day),total=QUESTS.filter(x=>x.ch===ch).length,done=QUESTS.filter(x=>x.ch===ch&&s.q[x.id]==='done').length;
  let h=`<span class="tr-h"><span>Chương ${ch} · ${CHAPTERS[ch].t}</span><span>${done}/${total}</span></span>`;
  if(q){const p=questProg(q);
    h+=`<span class="tr-t">${q.t}</span><span class="tr-d">${q.hint}</span><span class="bar"><i style="width:${p.pct}%;background:var(--lantern)"></i></span><span class="tr-p"><span>${p.lbl}</span><span>${dueText(q)}</span></span>`}
  else h+=`<span class="tr-t">Đã xong nhiệm vụ chương này</span><span class="tr-d">${ch<4?`Chương ${ch+1} mở vào ngày ${CHAPTERS[ch+1].from}.`:'Sống trọn những ngày cuối tháng.'}</span>`;
  h+=`<span class="tr-sep"></span>`+s.daily.map(dailyRow).join('');
  $('tracker').innerHTML=h;
}
function catActs(c){return locActs().filter(a=>c.ks.includes(a.k))}
function renderCmd(){
  const closed=LOCS[s.loc].open(s);
  $('cmdbar').innerHTML=CATS.map(c=>{const list=catActs(c);if(!list.length)return '';const any=list.some(a=>!reason(a));
    return `<button class="cbtn${menuCat===c.id?' on':''}" type="button" data-cat="${c.id}" aria-expanded="${menuCat===c.id}">${ico(c.ic)}<span>${c.n}</span>${any&&list.some(a=>a.story)?'<span class="dot"></span>':''}</button>`}).join('');
  const note=$('cmdNote');let t='',cls='';
  if(closed){t=`${closed}. Mở Bản đồ để đi nơi khác.`;cls='bad'}
  else if(!isWE(s.day)&&(s.slot===0||s.slot===2)&&s.loc!=='office'){t='Đang giờ làm. Không đến công ty sẽ bị tính vắng ca.';cls='warn'}
  note.hidden=!t||!!menuCat;note.textContent=t;note.className='cmd-note '+cls;
  renderMenu();
}
function renderMenu(){
  const pm=$('popMenu');
  if(!menuCat){pm.hidden=true;pm.innerHTML='';return}
  const c=CATS.find(x=>x.id===menuCat),list=catActs(c);
  if(!list.length){menuCat=null;pm.hidden=true;return}
  if(!menuSel||!list.find(a=>a.id===menuSel))menuSel=(list.find(a=>!reason(a))||list[0]).id;
  const a=list.find(x=>x.id===menuSel),r=reason(a);
  const tag=c.id==='eat'?`<span class="tag ${s.ateThisSlot?'':'good'}">${s.ateThisSlot?'Đã ăn buổi này':'Chưa ăn buổi '+SLOTS[s.slot].toLowerCase()}</span>`:c.id==='act'?`<span class="tag">${s.slot===3?'Xong là đi ngủ':'Sang buổi sau'}</span>`:'<span class="tag">Không tốn thời gian</span>';
  const price=x=>x.cost?`<span class="pr">−${fk(x.cost)}</span>`:x.gain?`<span class="pr gain">+${fk(x.gain)}</span>`:'<span class="pr free">0đ</span>';
  pm.innerHTML=`<div class="pm-h"><b>${c.n}</b>${tag}<button class="xbtn" type="button" data-pmclose aria-label="Đóng">×</button></div>
    <div class="pm-list" role="listbox">${list.map(x=>`<button class="pm-row${x.id===menuSel?' sel':''}${reason(x)?' off':''}" type="button" role="option" aria-selected="${x.id===menuSel}" data-pa="${x.id}"><span>${x.n}${x.story?'<span class="qt">Nhiệm vụ</span>':''}</span>${price(x)}</button>`).join('')}</div>
    <div class="pm-detail"><p>${a.d}</p><div class="chips">${chipsHTML(a)}</div>
      <div class="pm-foot"><span class="pm-why">${r||''}</span><button class="btn primary sm" type="button" data-do ${r?'disabled':''}>${c.verb}</button></div></div>`;
  pm.hidden=false;
}
function closeMenu(){menuCat=null;menuSel=null}
function renderToolbar(){
  const n=s.bag.length,expiring=s.bag.some(x=>x.exp!==null&&x.exp<=s.day);
  const b=$('bagBadge');b.hidden=!n;b.textContent=n;b.className='badge'+(expiring?' warn':'');
  $('calBadge').hidden=!Object.keys(BILLS).map(Number).some(d=>d>=s.day&&d-s.day<=2);
  const act=QUESTS.filter(q=>s.q[q.id]==='active').length,tb=$('taskBadge');tb.hidden=!act;tb.textContent=act;
}
$('cmdbar').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b||win)return;
  if(menuCat===b.dataset.cat)closeMenu();else{menuCat=b.dataset.cat;menuSel=null}renderCmd()});
$('popMenu').addEventListener('click',e=>{
  if(e.target.closest('[data-pmclose]')){closeMenu();renderCmd();return}
  const row=e.target.closest('[data-pa]');if(row){menuSel=row.dataset.pa;renderMenu();return}
  if(e.target.closest('[data-do]')){const a=locActs().find(x=>x.id===menuSel);if(a)doAction(a)}
});
$('popMenu').addEventListener('dblclick',e=>{const row=e.target.closest('[data-pa]');if(!row)return;const a=locActs().find(x=>x.id===row.dataset.pa);if(a&&!reason(a))doAction(a)});
document.querySelector('.tools').addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)toggleWin(b.dataset.open)});
document.querySelector('.mapbtn').addEventListener('click',()=>toggleWin('map'));
$('tracker').addEventListener('click',()=>toggleWin('tasks'));
$('stage').addEventListener('pointerdown',e=>{if(menuCat&&!e.target.closest('#cmdWrap')&&!e.target.closest('#layer')){closeMenu();renderCmd()}});

function popFx(out,dm){
  const items=[];
  if(dm)items.push([`${dm>0?'+':'−'}${fk(dm)}`,dm>0?'up':'money']);
  for(const S of STATS){const v=out[S.k];if(v)items.push([`${S.n} ${v>0?'+':'−'}${Math.abs(v)}`,v>0?'up':'down'])}
  items.forEach(([t,c],i)=>setTimeout(()=>{const d=document.createElement('div');d.className='pop '+c;d.textContent=t;
    d.style.left=(50+((i%2)?10:-10)+(Math.random()*4-2))+'%';d.style.marginTop=(i*1.7)+'em';$('fx').appendChild(d);setTimeout(()=>d.remove(),1700)},i*130));
}
function showBanner(){
  const b=document.createElement('div');b.className='banner';
  b.innerHTML=`<span class="num">Ngày ${s.day}</span><span>${DOW[dowOf(s.day)]}${BILLS[s.day]?' · '+BILLS[s.day][0]:''}${s.day===15?' · Ngày lương':''}</span>`;
  $('fx').appendChild(b);setTimeout(()=>b.remove(),2500);
}
function showToast(text,tone){
  if(!s||!s.started)return;
  const t=$('toast');t.textContent=text;t.className='toast '+(tone||'');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.add('out'),2800);
}
function refresh(){checkQuests();checkDaily();save();render()}
function afterChange(){refresh();processQueue()}

/* ============ Windows ============ */
const head=(icon,title,extra='',closable=true)=>`<header class="win-h">${icon?ico(icon):''}<h2>${title}</h2>${extra}${closable?'<button class="btn sm" type="button" data-close>Đóng</button>':''}</header>`;
function openWin(name){
  win=name;bagSel=null;if(name==='cal')calSel=s.day;
  closeMenu();renderCmd();
  $('layer').className='layer'+(name==='event'?' dialog':'');
  $('layer').hidden=false;renderWin();
  const f=$('win').querySelector('.choice:not(:disabled),.btn.primary:not(:disabled),.slot:not(.empty),[data-close]');if(f)f.focus({preventScroll:true});
}
function hideWin(){win=null;$('layer').hidden=true;$('win').innerHTML=''}
function closeWin(){hideWin();processQueue()}
function toggleWin(name){
  if(!s.started||win==='event'||win==='end')return;
  if(win===name){closeWin();return}
  if(name==='map'&&s.over)return;
  openWin(name);
}
function renderWin(){
  const w=$('win');w.className='win w-'+(win==='event'&&curEvent&&curEvent.kind==='chapter'?'chapter':win);
  if(win==='bag')w.innerHTML=bagHTML();
  else if(win==='cal')w.innerHTML=calHTML();
  else if(win==='tasks')w.innerHTML=tasksHTML();
  else if(win==='map'){w.innerHTML=mapHTML();drawMap()}
  else if(win==='log')w.innerHTML=head('book','Nhật ký')+`<div class="win-b"><ol class="loglist">${s.log.map(l=>`<li><span class="st">N${l.d} · ${SLOTS[l.sl]}</span><span class="${l.tone}">${l.text}</span></li>`).join('')||'<li><span></span><span class="muted">Chưa có gì.</span></li>'}</ol></div>`;
  else if(win==='rules')w.innerHTML=head('help','Luật chơi')+`<div class="win-b">${rulesHTML()}</div>`;
  else if(win==='event')w.innerHTML=curEvent.kind==='chapter'?chapterHTML(curEvent):eventHTML();
  else if(win==='end'){w.innerHTML=endHTML();requestAnimationFrame(drawChart)}
}

/* Tasks window */
function qcardHTML(q){
  const st=s.q[q.id]||'locked',P=PEOPLE[q.who],p=questProg(q),pinned=trackedQuest()===q&&st==='active';
  const stTag=st==='done'?'<span class="tag good">Hoàn thành</span>':st==='fail'?'<span class="tag bad">Thất bại</span>':`<span class="tag gold">${dueText(q)}</span>`;
  return `<div class="qcard ${st}${pinned?' pinned':''}"><span class="pt" title="${P.n}">${ico(P.p)}</span>
    <div class="qhead"><b>${q.t}</b>${stTag}</div>
    <p>${q.d} <span class="muted">· ${P.n}</span></p>
    ${st==='active'?`<p class="hint"><em>Gợi ý:</em> ${q.hint}</p><div class="qprog"><div class="bar"><i style="width:${p.pct}%;background:var(--lantern)"></i></div><span>${p.lbl}</span></div>`:''}
    <div class="qfoot"><div class="chips">${chipsHTML({rw:q.rw,rwTxt:q.rwTxt||(q.bonus?'':'')})}</div>${st==='active'?`<button class="btn sm" type="button" data-pin="${q.id}" ${pinned?'disabled':''}>${pinned?'Đang theo dõi':'Theo dõi'}</button>`:''}</div></div>`;
}
function tasksHTML(){
  const ch=chOf(s.day),C=CHAPTERS[ch],p=probation();
  let h=head('scroll','Nhiệm vụ',`<span class="tag gold">Chương ${ch}</span>`)+`<div class="win-b">
    <div class="tk-top"><div class="tk-story"><div class="chap-num">Chương ${ch} · ngày ${C.from}–${C.to}</div><b>${C.t}</b><p>${C.txt}</p></div>
    <div class="tk-prob"><span class="lbl">Đánh giá thử việc</span><span><span class="num">${p}</span><span class="muted"> /100</span></span>
      <div class="bar"><i style="width:${p}%;background:${p>=75?'var(--good)':p>=55?'var(--warn)':'var(--bad)'}"></i><span class="mark" style="left:55%"></span><span class="mark" style="left:75%"></span></div>
      <small>Từ 75: ký hợp đồng · 55–74: gia hạn thử việc. Tính từ số ca đã làm, nhiệm vụ công việc, tăng ca và số ca vắng.</small></div></div>
    <div class="tk-sec"><span>Việc hôm nay · ${DOW[dowOf(s.day)]}</span><span>Mỗi việc xong: Tinh thần +3</span></div>
    <div class="dlist">${s.daily.map(dailyRow).join('')}</div>
    <div class="tk-sec"><span>Nhiệm vụ chương ${ch}</span><span>${QUESTS.filter(q=>q.ch===ch&&s.q[q.id]==='done').length}/${QUESTS.filter(q=>q.ch===ch).length}</span></div>
    <div class="qlist">${QUESTS.filter(q=>q.ch===ch).map(qcardHTML).join('')}</div>`;
  for(let c=1;c<=4;c++){if(c===ch)continue;
    if(c<ch)h+=`<div class="tk-sec"><span>Chương ${c} · ${CHAPTERS[c].t}</span></div><div class="qmini">${QUESTS.filter(q=>q.ch===c).map(q=>`<span><span class="ck${s.q[q.id]==='done'?' on':' fail'}"></span>${q.t}</span>`).join('')}</div>`;
    else h+=`<div class="qlock">Chương ${c} · ${CHAPTERS[c].t} mở vào ngày ${CHAPTERS[c].from}.</div>`}
  return h+'</div>';
}

/* Event, dialogue & chapter */
function chapterHTML(e){
  const C=CHAPTERS[e.n];
  return `<div class="chap"><div class="chap-num">Chương ${e.n}</div><h2>${C.t}</h2><div class="chap-days">Ngày ${C.from} – ${C.to}</div><p>${C.txt}</p>
    <h4>Nhiệm vụ mới</h4><ul class="chap-q">${QUESTS.filter(q=>q.ch===e.n).map(q=>`<li><span class="pt">${ico(PEOPLE[q.who].p)}</span><div><b>${q.t}</b><span>${q.d}</span></div></li>`).join('')}</ul>
    <button class="btn primary" type="button" data-ch="0">${e.n===1?'Bắt đầu tháng mới':'Vào chương '+e.n}</button></div>`;
}
function eventHTML(){
  const e=curEvent,P=e.who?PEOPLE[e.who]:null;
  return `<div class="ev">${P?`<div class="spk"><span class="pt">${ico(P.p)}</span><span><b>${P.n}</b><small>Ngày ${s.day} · ${SLOTS[s.slot]}</small></span></div>`:`<div class="ev-stamp">Ngày ${s.day} · ${SLOTS[s.slot]}</div>`}
    <h2>${e.title}</h2><p class="${P?'say':''}">${e.text}</p><div class="choices">`+
    e.choices.map((c,i)=>{const nr=c.need?c.need(s):null,no=(c.cost&&s.money<c.cost)?'Không đủ tiền':nr;
      return `<button class="choice" type="button" data-ch="${i}" ${no?'disabled':''}><b>${c.l}</b>${(c.cost||c.gain||c.eff||c.x)?`<span class="chips">${chipsHTML(c)}</span>`:''}${no?`<span class="chip down">${no}</span>`:''}</button>`}).join('')+`</div></div>`;
}
function processQueue(){
  if(!s.started||s.over||win||!queue.length)return;
  curEvent=queue.shift();openWin('event');
}
function pickChoice(i){
  const e=curEvent,c=e&&e.choices[i];if(!c)return;
  if((c.cost&&s.money<c.cost)||(c.need&&c.need(s)))return;
  hideWin();curEvent=null;
  const m0=s.money;
  if(c.cost){s.money-=c.cost;s.spentToday+=c.cost}
  if(c.gain)s.money+=c.gain;
  const out=applyEff(c.eff||{});
  if(c.run)c.run(s);
  popFx(out,s.money-m0);
  if(e.choices.length>1)addLog(`${e.title}: ${c.l}`);
  afterChange();
}

/* Bag */
function bagHTML(){
  const st=bagStacks(),cells=[];
  for(let i=0;i<12;i++){const x=st[i];
    if(!x){cells.push('<div class="slot empty" aria-hidden="true"></div>');continue}
    const soon=x.exp!==null&&x.exp<=s.day;
    cells.push(`<button class="slot${bagSel===x.id?' sel':''}" type="button" data-slot="${x.id}" title="${ITEMS[x.id].n}" aria-label="${ITEMS[x.id].n}, ${x.q} cái">${ico(x.id)}<span class="q">${x.q}</span>${soon?'<span class="ex">Sắp hỏng</span>':''}</button>`)}
  let h=head('bag','Túi đồ',`<span class="tag ${s.ateThisSlot?'':'good'}">${s.ateThisSlot?'Đã ăn buổi này':'Chưa ăn buổi này'}</span>`)+
    `<div class="win-b"><div class="bag-grid">${cells.join('')}</div>${st.length?'':'<p class="note-line">Túi đang trống. Mua đồ mang về ở chợ, quán ăn hoặc quán cà phê.</p>'}
    <div class="bag-legend"><span>${s.bag.length} món · ${st.length}/12 ô</span><span>Đồ ăn dùng chung lượt ăn của buổi. Đồ uống và thuốc dùng lúc nào cũng được.</span></div></div>`;
  if(bagSel&&bagCount(bagSel)){
    const id=bagSel,it=ITEMS[id],x=st.find(z=>z.id===id),r=itemReason(id);
    h+=`<div class="detail"><div class="dcard" role="group" aria-label="${it.n}">
      <div class="slot">${ico(id)}<span class="q">${x.q}</span></div>
      <div><h3>${it.n}</h3><div style="margin-top:.25em"><span class="tag">${TYPE_LABEL[it.type]}</span></div></div>
      <p class="ddesc">${it.d}</p>
      <div class="chips">${chipsHTML(it,false)}</div>
      <dl class="dinfo"><dt>Số lượng</dt><dd>${x.q}</dd><dt>Hạn dùng</dt><dd>${expText(x.exp)}</dd><dt>Dùng ở đâu</dt><dd>${it.where?it.where.map(w=>LOCS[w].short).join(', '):'Ở đâu cũng được'}</dd></dl>
      ${r?`<p class="dwhy">${r}</p>`:''}
      <div class="dact"><button class="btn" type="button" data-dclose>Đóng</button><button class="btn primary" type="button" data-use="${id}" ${r?'disabled':''}>${it.verb||'Dùng'}</button></div>
    </div></div>`}
  return h;
}

/* Calendar */
function calNotes(d){const a=[];
  if(BILLS[d])a.push({t:`${BILLS[d][0]} · ${fmt(BILLS[d][1])}`,sh:{5:'Tiền nhà',10:'Điện nước',20:'Trả góp'}[d],c:'var(--cal-red)'});
  if(d===13)a.push({t:'Đám cưới chị Hạnh, buổi trưa',sh:'Đám cưới',c:'#7a56c2'});
  if(d===15)a.push({t:'Lương kỳ 1 về',sh:'Lương',c:'#2f8a4a'});
  if(d===20||d===21)a.push({t:'Hẹn cà phê với Khoa, buổi chiều',sh:'Gặp Khoa',c:'#7a56c2'});
  if(d===28&&s.lent)a.push({t:'Khoa hẹn trả 300.000đ',sh:'Khoa trả',c:'#7a56c2'});
  if(d===29)a.push({t:'Thuyết trình tổng kết thử việc',sh:'Thuyết trình',c:'#2b5d8a'});
  if(d===30)a.push({t:'Sinh nhật mẹ · Tổng kết cuối tháng',sh:'Sinh nhật mẹ',c:'#b8892a'});
  return a}
function calHTML(){
  let g=DOWS.map((d,i)=>`<div class="dh${i>=5?' we':''}">${d}</div>`).join('');
  for(let d=1;d<=30;d++){const n=calNotes(d),c=['pd'];if(isWE(d))c.push('we');if(d<s.day)c.push('past');if(d===s.day)c.push('today');if(d===calSel)c.push('sel');
    g+=`<button type="button" class="${c.join(' ')}" data-day="${d}" aria-label="Ngày ${d}">${CHAPTERS[chOf(d)].from===d?`<span class="ch">C${chOf(d)}</span>`:''}<span class="n">${d}</span>${n[0]?`<span class="nt" style="--c:${n[0].c}">${n[0].sh}</span>`:''}</button>`}
  const d=calSel,notes=calNotes(d),hh=s.hist.find(x=>x.d===d);
  let det=`<h4>Ngày ${d} · ${DOW[dowOf(d)]}</h4>`;
  if(d===s.day)det+=`<p><b>Hôm nay</b>, đang là buổi ${SLOTS[s.slot].toLowerCase()}.</p>`;
  else if(d<s.day&&hh)det+=`<p>Cuối ngày: ví còn <b>${fmt(hh.money)}</b></p><p>No ${hh.no} · Năng lượng ${hh.nl} · Tinh thần ${hh.tt} · Sức khỏe ${hh.sk}</p>`;
  else if(d>s.day)det+=`<p>Còn ${d-s.day} ngày nữa.</p>`;
  if(CHAPTERS[chOf(d)].from===d)det+=`<p><span class="sw" style="--c:#2a2730"></span>Bắt đầu chương ${chOf(d)} · ${CHAPTERS[chOf(d)].t}</p>`;
  QUESTS.filter(q=>q.due===d&&(s.q[q.id]==='active')).forEach(q=>{det+=`<p><span class="sw" style="--c:#d99a1e"></span>Hạn nhiệm vụ: ${q.t}</p>`});
  det+=notes.length?notes.map(n=>`<p><span class="sw" style="--c:${n.c}"></span>${n.t}</p>`).join(''):(d>=s.day?'<p style="color:var(--ink-soft)">Chưa có lịch hẹn.</p>':'');
  const up=[];for(let x=s.day;x<=30&&up.length<4;x++)calNotes(x).forEach(n=>up.length<4&&up.push({d:x,...n}));
  return head('cal','Lịch tháng','<span class="tag">Bấm vào ngày để xem</span>')+
   `<div class="win-b"><div class="paper"><div class="paper-h"><div class="rings"><i></i><i></i><i></i><i></i></div><b>Tháng thử việc</b><small>Ngày 1 là Thứ Hai · 30 ngày · 4 chương</small></div>
    <div class="pgrid">${g}</div>
    <div class="cal-foot"><div>${det}</div><div><h4>Sắp tới</h4><ul>${up.map(u=>`<li><span><span class="sw" style="--c:${u.c}"></span>${u.sh}</span><span class="num">${u.d===s.day?'hôm nay':'N'+u.d}</span></li>`).join('')||'<li>Hết lịch tháng này</li>'}</ul></div></div>
   </div></div>`;
}

/* Map */
function mapHTML(){
  const tq=trackedQuest(),goal=tq&&tq.goal;
  const pins=Object.entries(LOCS).map(([id,L])=>{
    const here=id===s.loc,cl=L.open(s),c=travelCost(id),poor=c>0&&s.money<c,isGoal=goal===id&&!here;
    const ct=here?'Bạn ở đây':cl?'Đóng cửa':isGoal?'Nhiệm vụ':poor?'Đi bộ · mệt hơn':c?`${s.bikeBroken?'Xe ôm':'Xăng'} ${fk(c)}`:'Đi bộ';
    return `<button class="pin${here?' here':''}${cl?' closed':''}${isGoal?' goal':''}" type="button" data-go="${id}" style="left:${L.mx}%;top:${L.my}%" ${here||cl?'disabled':''} title="${L.name}${cl?' · '+cl:''}${c&&!here?' · '+fk(c):''}"><span class="dot"></span><span class="lb">${L.short}</span><span class="ct">${ct}</span></button>`}).join('');
  return head('pin','Bản đồ khu phố',`<span class="tag">${DOW[dowOf(s.day)]}, buổi ${SLOTS[s.slot].toLowerCase()}</span>`)+
    `<div class="win-b"><div class="map-wrap"><canvas id="mapCv" width="160" height="100"></canvas>${pins}</div><p class="note-line">Di chuyển không tốn thời gian. Nơi xa tốn tiền xăng; hết tiền thì đi bộ và mệt hơn. Viền vàng là nơi cần tới cho nhiệm vụ đang theo dõi.</p></div>`;
}
function drawMap(){
  const cv=$('mapCv');if(!cv)return;const m=cv.getContext('2d');m.imageSmoothingEnabled=false;
  const P=(x,y,w,h,c)=>{m.fillStyle=c;m.fillRect(x,y,w,h)};
  P(0,0,160,100,'#2b3150');
  for(let bx=0;bx<160;bx+=10)for(let by=0;by<100;by+=10)if(((bx*7+by*3)/10)%3<2)P(bx+1,by+1,8,8,'#333a5d');
  for(let x=0;x<160;x++){const y=Math.round(9+Math.sin(x/16)*3);P(x,y,1,6,'#2c6d9d');if(x%7===0)P(x,y+2,2,1,'#5aa0cf')}
  P(66,16,30,20,'#3b7a4c');[[70,20],[78,24],[88,19],[84,30],[72,30]].forEach(([x,y])=>{P(x,y,4,4,'#2f6640');P(x+1,y-1,2,1,'#4f9a5f')});
  const rd='#5e6696';P(0,48,160,3,rd);P(0,74,160,3,rd);P(56,0,3,100,rd);P(102,0,3,100,rd);P(128,40,3,60,rd);P(20,51,3,49,rd);
  for(let x=0;x<160;x+=6){P(x,49,3,1,'#8d93bf');P(x,75,3,1,'#8d93bf')}
  for(let y=0;y<100;y+=6){P(57,y,1,3,'#8d93bf');P(103,y,1,3,'#8d93bf')}
  P(114,24,10,22,'#4b5a80');P(132,20,8,26,'#55628a');P(130,60,20,16,'#5a5f86');
}

/* Rules */
function rulesHTML(){return `<ul class="rules">
  <li>Câu chuyện chia 4 chương theo 4 tuần. Mỗi chương có nhiệm vụ chính (xem ở <b>Nhiệm vụ</b> hoặc khung theo dõi góc phải) và 2 việc nhỏ mỗi ngày.</li>
  <li>Mỗi ngày có 4 buổi. Mỗi buổi được ăn tối đa 1 lần, rồi chọn 1 <b>Hoạt động</b> để sang buổi sau. Mua đồ và giao dịch không tốn thời gian.</li>
  <li>Thanh lệnh ở giữa dưới cùng: chọn nhóm, chọn một dòng để xem chi tiết, rồi bấm nút xác nhận. Bấm đúp một dòng để làm ngay.</li>
  <li><b>Túi đồ</b> chứa đồ mua mang về. Bánh mì, xôi, bánh ngọt hỏng sau 1 ngày; nguyên liệu và sữa giữ được 3 ngày.</li>
  <li>Thứ Hai đến thứ Sáu, ca sáng và ca chiều là giờ làm. Mỗi ca cộng 120.000đ vào lương và tăng điểm thử việc. Không vắng ca nào được thưởng chuyên cần 300.000đ. Kẹt tiền thì có thể xin ứng lương ở công ty.</li>
  <li>Độ no, năng lượng, tinh thần tự giảm theo thời gian. Chỉ số nào xuống dưới 25 sẽ kéo các chỉ số khác giảm theo.</li>
</ul>
<div class="formula">Điểm = 1000 × Tài sản<sup>0,35</sup> × Độ no TB<sup>0,2</sup> × Tinh thần TB<sup>0,25</sup> × Sức khỏe cuối<sup>0,2</sup></div>
<p class="note-line">Mỗi yếu tố quy về thang 0 đến 1 (tài sản 4 triệu tính là 1). Kết cục câu chuyện phụ thuộc vào điểm thử việc và các nhiệm vụ bạn hoàn thành.</p>
<p class="note-line">Phím tắt: B túi đồ · L lịch · J nhiệm vụ · M bản đồ · N nhật ký · Esc đóng.</p>`}

/* End */
function endHTML(){
  const r=computeScore(),[an,ad]=archetype(r),g=grade(r.score),qd=QUESTS.filter(q=>s.q[q.id]==='done').length;
  const fac=[['Tài sản',r.F.tien,'#ffc94d','0,35'],['Độ no TB',r.F.no,SCOL.no,'0,2'],['Tinh thần TB',r.F.tt,SCOL.tt,'0,25'],['Sức khỏe cuối',r.F.sk,SCOL.sk,'0,2']];
  const ach=[['Chuyên cần',s.absences===0],['Đầu bếp tại gia',s.cooked>=15],['Không một đồng nợ',s.debt===0&&s.loanCount===0],['Tiết kiệm có kỷ luật',s.savings>=1000000],['Hoàn thành mọi nhiệm vụ',qd===QUESTS.length],['Fan cứng mì gói',s.noodleTotal>=12]];
  return head('scroll','Kết thúc tháng thử việc','',false)+`<div class="win-b"><div class="end-grid"><div>
    <div class="score-top"><span class="num">${r.score}</span><span class="grade">${g}</span><div class="arch"><b>${an}</b><span>${ad}</span></div></div>
    <p class="sec-h">Kết cục · ${qd}/${QUESTS.length} nhiệm vụ chính</p>
    <ul class="ending">${endingLines().map(([w,t])=>`<li><span class="pt">${ico(PEOPLE[w].p)}</span><span>${t}</span></li>`).join('')}</ul>
    <div class="asset">
      <span>Tiền mặt</span><span class="num">${fmt(s.money)}</span>
      <span>Tiết kiệm kèm lãi</span><span class="num">${fmt(r.sav)}</span>
      <span>Lương kỳ 2 (${s.ca-s.caHalf} ca)</span><span class="num">${fmt(s.accrued)}</span>
      <span>Thưởng chuyên cần</span><span class="num">${fmt(r.bonus)}</span>
      <span>Nợ phải trả</span><span class="num" style="color:var(--bad)">−${fmt(s.debt)}</span>
      <span class="tot">Tài sản cuối tháng</span><span class="num tot">${fmt(r.asset)}</span>
    </div></div><div>
    <p class="sec-h">Các yếu tố tính điểm</p>
    <div class="factors">${fac.map(([n,v,c,w])=>`<span>${n} <span class="muted">^${w}</span></span><div class="bar"><i style="width:${Math.min(100,v/1.25*100)}%;background:${c}"></i></div><span class="num">${v.toFixed(2)}</span>`).join('')}</div>
    <div class="chart-box"><canvas id="chartCv"></canvas><div class="legend">${STATS.map(S=>`<span><i style="background:${SCOL[S.k]}"></i>${S.n}</span>`).join('')}<span><i style="background:var(--bad)"></i>Ngưỡng 25</span></div></div>
    <p class="sec-h">Thành tựu</p><div class="ach">${ach.map(([n,on])=>`<span class="${on?'on':'off'}">${n}</span>`).join('')}</div>
  </div></div><div style="display:flex;gap:.5em;margin-top:1em;justify-content:flex-end"><button class="btn" type="button" data-m="home">Màn hình chính</button><button class="btn primary" type="button" data-m="new">Chơi lại từ đầu</button></div></div>`;
}
function drawChart(){
  const cv=$('chartCv');if(!cv)return;const dpr=window.devicePixelRatio||1,w=cv.clientWidth||500,h=cv.clientHeight||150;
  cv.width=w*dpr;cv.height=h*dpr;const c=cv.getContext('2d');c.scale(dpr,dpr);
  const L=28,R=8,T=8,B=18,pw=w-L-R,ph=h-T-B,X=d=>L+(d-1)/29*pw,Y=v=>T+(1-v/100)*ph;
  c.font='11px "Be Vietnam Pro", system-ui, sans-serif';c.fillStyle='#a4a9c8';c.strokeStyle='rgba(164,169,200,.16)';c.lineWidth=1;
  [0,50,100].forEach(v=>{c.beginPath();c.moveTo(L,Y(v));c.lineTo(w-R,Y(v));c.stroke();c.fillText(v,2,Y(v)+4)});
  [1,8,15,22,30].forEach(d=>c.fillText(d,X(d)-(d>9?6:3),h-4));
  c.strokeStyle='rgba(255,100,116,.55)';c.setLineDash([4,4]);c.beginPath();c.moveTo(L,Y(25));c.lineTo(w-R,Y(25));c.stroke();c.setLineDash([]);
  for(const S of STATS){c.strokeStyle=SCOL[S.k];c.lineWidth=2;c.beginPath();s.hist.forEach((p,i)=>{const x=X(p.d),y=Y(p[S.k]);i?c.lineTo(x,y):c.moveTo(x,y)});c.stroke();
    const last=s.hist[s.hist.length-1];if(last){c.fillStyle=SCOL[S.k];c.beginPath();c.arc(X(last.d),Y(last[S.k]),3,0,7);c.fill()}}
}

/* Layer clicks */
$('layer').addEventListener('click',e=>{
  const t=e.target;
  const ch=t.closest('[data-ch]');if(ch){if(!ch.disabled)pickChoice(+ch.dataset.ch);return}
  const go=t.closest('[data-go]');if(go){if(!go.disabled)travel(go.dataset.go);return}
  const use=t.closest('[data-use]');if(use){if(!use.disabled)useItem(use.dataset.use);return}
  const pin=t.closest('[data-pin]');if(pin){s.pin=pin.dataset.pin;refresh();return}
  const sl=t.closest('[data-slot]');if(sl){bagSel=sl.dataset.slot;renderWin();const u=$('win').querySelector('[data-use]:not(:disabled),[data-dclose]');if(u)u.focus({preventScroll:true});return}
  const dcBtn=t.closest('button[data-dclose]');
  if(t.closest('.dcard')&&!dcBtn)return;
  if(dcBtn||t.classList.contains('detail')){bagSel=null;renderWin();return}
  const day=t.closest('[data-day]');if(day){calSel=+day.dataset.day;renderWin();return}
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
function showTitle(){hideWin();closeMenu();$('ui').hidden=true;$('titleScreen').hidden=false;renderTitle();const f=$('titleBtns').querySelector('button');if(f)f.focus({preventScroll:true})}
function startGame(){hideWin();closeMenu();queue=[];$('titleScreen').hidden=true;$('ui').hidden=false;render();save()}
function cmd(k){
  if(k==='new'){s=newState();s.started=true;startGame();addLog(`Ngày đầu ở Sài Gòn. Ví còn ${fmt(START_MONEY)}.`);
    activateChapter(1);
    queue.push(ev('Phòng số 3 là của con','“Chìa khóa nè. Tiền nhà 1 triệu rưỡi, đóng sáng mùng 5 nghen. Trong túi con có ít nguyên liệu cô cho, tối về nấu ăn cho đỡ tốn.”',[{l:'Dạ, con cảm ơn cô'}],'tu'));
    genDaily();showBanner();afterChange()}
  else if(k==='cont'){const st=loadSaved();if(!st)return;s=st;startGame();processQueue()}
  else if(k==='rules'){win=null;openWin('rules')}
  else if(k==='home'){save();showTitle()}
}
$('titleBtns').addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b)cmd(b.dataset.m)});

document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='Escape'){if(win==='bag'&&bagSel){bagSel=null;renderWin();return}if(win&&win!=='event'&&win!=='end'){closeWin();return}if(menuCat){closeMenu();renderCmd()}return}
  if(!s.started||$('ui').hidden)return;
  const k={b:'bag',l:'cal',m:'map',n:'log',j:'tasks'}[e.key.toLowerCase()];
  if(k){e.preventDefault();toggleWin(k)}
});

/* ============ Pixel scene ============ */
const W=192,H=108,cv=$('scene'),ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const SKY=[['#7ec0ee','#9fd0f0','#c9e5ef','#ffe1bd'],['#3d8fe0','#58a5ea','#82bff0','#b6daf5'],['#5d4a8e','#b45f7c','#ef875d','#ffc27a'],['#0e1230','#151a3e','#1c224d','#252a5a']];
function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function hash(n){const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function skyRect(x,y,w,h,sl,t){
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  const c=SKY[sl],bh=h/c.length;c.forEach((col,i)=>px(x,y+i*bh,w,bh+1,col));
  if(sl===3){for(let i=0;i<46;i++){if(hash(i*3+Math.floor(t/800))<0.12)continue;px(x+hash(i)*w,y+hash(i+99)*h*0.7,1,1,i%6?'#dfe6ff':'#fff2bf')}
    const mx=x+w*0.8,my=y+7;px(mx,my,8,8,'#f4f0cf');px(mx+3,my-1,7,8,c[0]);}
  else{const sp=[[0.14,0.55],[0.55,0.1],[0.84,0.48]][sl];const sx=x+w*sp[0],sy=y+h*sp[1];const sc=sl===2?'#ffd98a':'#fff3c4';
    px(sx+1,sy,6,8,sc);px(sx,sy+1,8,6,sc);
    for(let i=0;i<3;i++){const cw=18+i*5,cx=x+((hash(i+4)*w+t/(160+i*60))%(w+40))-20,cy=y+5+i*7;const cc=sl===2?'#ffd0b8':'#ffffff';
      ctx.globalAlpha=0.85;px(cx,cy,cw,4,cc);px(cx+4,cy-3,cw-9,3,cc);ctx.globalAlpha=1}}
  ctx.restore();
}
function shadeTime(sl,a=0.42){if(sl===3){ctx.fillStyle=`rgba(10,12,40,${a})`;ctx.fillRect(0,0,W,H)}else if(sl===2){ctx.fillStyle='rgba(255,110,60,0.10)';ctx.fillRect(0,0,W,H)}}
function glow(x,y,r,col,a=0.2){ctx.fillStyle=col;for(let i=3;i>=1;i--){ctx.globalAlpha=a*(4-i)/3;ctx.beginPath();ctx.arc(x,y,r*i/3,0,7);ctx.fill()}ctx.globalAlpha=1}
function sidewalk(y,c1,c2){px(0,y,W,H-y,c1);px(0,y,W,2,c2);for(let x=0;x<W;x+=14)px(x,y+2,1,H-y,'rgba(0,0,0,.08)')}

const DRAW={
  home(sl,t){
    px(0,0,W,84,'#9db596');px(0,70,W,14,'#87a181');px(0,70,W,1,'#6f8a6c');
    px(0,84,W,24,'#9a6b45');for(let y=88;y<H;y+=6){px(0,y,W,1,'#875b39');for(let x=(y*7)%30;x<W;x+=30)px(x,y-5,1,5,'#875b39')}
    px(114,13,50,40,'#6b4a2f');skyRect(117,16,44,34,sl,t);px(138,16,2,34,'#6b4a2f');px(117,32,44,2,'#6b4a2f');
    px(108,10,8,48,'#d36a5b');px(162,10,8,48,'#d36a5b');px(108,10,62,3,'#8a5a3c');
    px(66,16,20,26,'#f2c14e');px(70,20,12,12,'#e0603e');px(70,35,12,2,'#2b2f3a');px(70,38,8,1,'#2b2f3a');
    px(2,56,6,30,'#6b4a2f');px(4,74,60,12,'#6b4a2f');px(6,69,56,6,'#efe9db');px(22,68,40,9,'#4f7fd0');px(22,68,40,2,'#6d97e0');px(9,65,12,5,'#ffffff');
    px(62,47,44,2,'#7a5536');
    const nm=s.bag?bagCount('mi'):0,ng=s.bag?bagCount('nguyenlieu'):0;
    for(let i=0;i<Math.min(nm,5);i++){px(64+i*6,41,5,6,'#f0c040');px(64+i*6,43,5,1,'#d03a2a')}
    if(ng>0){px(96,40,9,7,'#e9e2d0');px(97,37,3,3,'#4e9a5a');px(101,36,3,4,'#5bb06a')}
    px(146,66,42,3,'#7a5536');px(148,69,3,17,'#7a5536');px(183,69,3,17,'#7a5536');
    px(156,58,17,8,'#2b2f3a');px(157,59,15,6,sl===3?'#9fd7ff':'#5a7da0');px(154,66,21,1,'#555');
    px(179,52,2,14,'#333');px(175,50,10,3,'#e9b44c');
    shadeTime(sl,0.3);
    if(sl===3){glow(180,55,22,'#ffd98a',0.28);glow(164,62,12,'#9fd7ff',0.25);px(175,50,10,3,'#ffe08a')}
  },
  street(sl,t){
    skyRect(0,0,W,H,sl,t);
    const cols=['#e8a87c','#d4c17f','#8fc1c4','#e6b450','#b99ac7','#e89a9a','#93b89a','#d8a46a'],ws=[24,20,28,22,26,20,30,22],wins=[];
    let x=0;ws.forEach((w,i)=>{const h=42+Math.round(hash(i+3)*22),top=86-h;px(x,top,w,h,cols[i]);px(x,top,w,2,'rgba(0,0,0,.25)');
      for(let f=top+5;f<72;f+=12){px(x+3,f,5,6,'#4a5a6a');px(x+w-8,f,5,6,'#4a5a6a');px(x+2,f+7,w-4,1,'#3b3b3b');wins.push([x+3,f],[x+w-8,f])}
      px(x+2,72,w-4,14,'#3a3330');for(let k=74;k<86;k+=3)px(x+3,k,w-6,1,'#4a423d');x+=w});
    sidewalk(86,'#a59d92','#c9c1b6');
    px(34,38,2,32,'#555');px(18,38,34,4,'#f2c14e');px(14,42,42,4,'#e67e22');for(let k=14;k<56;k+=8)px(k,42,4,4,'#f2c14e');
    px(16,70,38,18,'#c0392b');px(18,64,34,7,'#d9eef2');px(20,88,6,6,'#222');px(44,88,6,6,'#222');px(18,74,34,2,'#e8e2d0');
    [[58,'#e74c3c'],[72,'#3d7ab8']].forEach(([sx,c])=>{px(sx,93,8,2,c);px(sx+1,95,1,6,c);px(sx+6,95,1,6,c)});
    px(62,87,14,2,'#d0d4d8');px(64,89,1,8,'#d0d4d8');px(73,89,1,8,'#d0d4d8');
    px(134,92,9,9,'#1e1e1e');px(158,92,9,9,'#1e1e1e');px(138,85,24,8,'#c23b4a');px(144,82,14,3,'#222');px(162,78,2,8,'#555');px(162,86,4,3,'#ffe9a6');
    shadeTime(sl);
    if(sl>=2){wins.forEach(([wx,wy],i)=>{if(hash(i*7.3)>(sl===3?0.45:0.8))px(wx,wy,5,6,'#ffd27a')})}
    if(sl===3){for(let k=0;k<W;k+=4){const y=26+Math.sin(k/30)*4;px(k,y,4,1,'#2a2a2a');if(k%12===0){const on=(Math.floor(t/400)+k/12)%3!==0;const c=['#ffd36e','#ff8a6b','#8ee3ff'][(k/12)%3];px(k,y+1,2,2,on?c:'#555');if(on)glow(k+1,y+2,5,c,0.25)}}
      glow(35,62,16,'#ffe2a0',0.3);px(18,64,34,7,'#fff2c8');glow(166,87,10,'#ffe9a6',0.3)}
  },
  market(sl,t){
    skyRect(0,0,W,H,sl,t);
    px(0,28,W,58,'#b8a283');px(0,24,W,6,'#8a5a3c');for(let x=6;x<W;x+=22)px(x,32,12,8,'#8f7a5f');
    const aw=[['#d9483b','#f3eee2'],['#3f9a5c','#f3eee2'],['#3a78c2','#f3eee2']],prod=['#4caf50','#e53935','#ff9800','#fdd835','#8bc34a','#9c27b0','#f06292'];
    for(let i=0;i<3;i++){const sx=6+i*64,w=56;px(sx,46,2,40,'#5b3a29');px(sx+w-2,46,2,40,'#5b3a29');
      for(let k=0;k<w;k+=6){px(sx+k,40,3,10,aw[i][0]);px(sx+k+3,40,3,10,aw[i][1]);px(sx+k+1,50,4,2,aw[i][0])}
      px(sx,70,w,4,'#7a4b2e');px(sx+2,74,w-4,12,'#9c6b3f');px(sx+2,79,w-4,1,'#7a4b2e');
      for(let j=0;j<10;j++)px(sx+3+j*5,64+(j%2),4,5,prod[(i*3+j)%prod.length])}
    sidewalk(86,'#8f877b','#a9a194');
    shadeTime(sl);
    if(sl>=2)for(let i=0;i<3;i++){const bx=6+i*64+27;px(bx,53,2,3,'#ffe29a');glow(bx+1,56,14,'#ffe29a',sl===3?0.32:0.15)}
  },
  office(sl,t){
    skyRect(0,0,W,H,sl,t);
    px(0,40,30,46,'#94a0b2');px(118,26,62,60,'#7d8aa0');px(118,26,62,2,'#66728a');
    px(36,6,76,80,'#4f6b88');px(36,6,76,2,'#3c536b');
    const wins=[];
    for(let y=12;y<64;y+=8)for(let x=40;x<106;x+=9){px(x,y,6,5,'#9fc6e3');px(x,y,2,5,'#c9e3f3');wins.push([x,y,6,5])}
    for(let y=32;y<80;y+=8)for(let x=122;x<176;x+=8){px(x,y,5,5,'#b8cde0');wins.push([x,y,5,5])}
    for(let y=46;y<80;y+=8)for(let x=4;x<26;x+=7){px(x,y,4,5,'#c3cbd6');wins.push([x,y,4,5])}
    px(58,68,34,3,'#26303d');px(62,71,26,15,'#2b3a4d');px(66,73,18,13,'#7fb0d4');px(74,73,1,13,'#2b3a4d');
    sidewalk(86,'#9aa2ab','#b8bfc7');
    px(160,72,3,14,'#6b4a2f');px(152,58,20,16,'#3f8f4f');px(155,54,14,6,'#4ea35c');px(150,84,24,3,'#7a6a5a');
    shadeTime(sl,0.5);
    if(sl>=2)wins.forEach(([x,y,w,h],i)=>{if(hash(i*1.7)>(sl===3?0.5:0.85))px(x,y,w,h,'#ffe39a')});
    if(sl===3){glow(75,80,16,'#bfe3ff',0.3);px(66,73,18,13,'#cfe9ff')}
  },
  cafe(sl,t){
    skyRect(0,0,W,H,sl,t);
    px(0,30,24,56,'#c9a27e');px(168,34,24,52,'#a7b8c4');for(let y=38;y<80;y+=10){px(5,y,10,6,'#7a6250');px(174,y,10,6,'#5d6b78')}
    px(24,22,144,64,'#2f5d50');px(24,22,144,3,'#244a3f');
    px(62,27,68,10,'#f3e2c0');[66,74,84,92,100,110,118].forEach((x,i)=>px(x,30,i%3?6:4,4,'#2f5d50'));
    for(let k=24;k<168;k+=8){px(k,40,4,8,'#e8dcc0');px(k+4,40,4,8,'#3f7f6a');px(k+1,48,6,2,'#3f7f6a')}
    px(34,52,82,30,'#5a3d2a');px(36,54,78,26,'#f2cf93');px(74,54,2,26,'#5a3d2a');
    px(44,64,6,9,'#7a5a45');px(45,60,4,4,'#7a5a45');px(92,63,6,10,'#6b4b3b');px(93,59,4,4,'#6b4b3b');px(36,73,78,2,'#a5774f');
    px(124,52,22,34,'#5a3d2a');px(128,56,14,14,'#f2cf93');px(142,70,2,3,'#e9b44c');
    sidewalk(86,'#a59d92','#c9c1b6');
    px(152,76,12,10,'#b5653a');px(150,64,16,12,'#4e9a5a');px(154,60,8,5,'#5bb06a');
    px(28,88,18,2,'#6b4a2f');px(36,90,2,8,'#6b4a2f');px(24,92,6,2,'#c0392b');px(25,94,1,5,'#c0392b');px(29,94,1,5,'#c0392b');
    shadeTime(sl,0.45);
    if(sl>=2){glow(75,67,34,'#ffcf7a',sl===3?0.3:0.12);px(36,54,78,26,sl===3?'#ffd98f':'#f5d49a');px(44,64,6,9,'#6a4a35');px(45,60,4,4,'#6a4a35');px(92,63,6,10,'#5b3b2b');px(93,59,4,4,'#5b3b2b');px(36,73,78,2,'#a5774f');px(74,54,2,26,'#5a3d2a')}
    if(sl===3)for(let k=28;k<166;k+=10){const on=(Math.floor(t/500)+k/10)%4!==0;px(k,50,2,2,on?'#ffe08a':'#665');if(on)glow(k+1,51,4,'#ffe08a',0.3)}
  },
  park(sl,t){
    skyRect(0,0,W,H,sl,t);
    for(let i=0;i<13;i++){const h=10+hash(i+20)*20;px(i*15,68-h,13,h,'#8ea2b8');px(i*15+3,68-h+3,2,2,'#a9bacb')}
    px(0,66,W,42,'#5ea35a');px(0,78,W,2,'#559650');px(0,100,W,2,'#559650');
    px(0,70,48,13,'#4f9fc4');px(4,74,12,1,'#86c6e0');px(22,78,16,1,'#86c6e0');
    px(0,90,W,9,'#d9c8a0');px(0,90,W,1,'#c8b68c');
    const tree=(x,y)=>{px(x,y,4,16,'#6b4a2f');px(x-9,y-14,22,15,'#3f8a47');px(x-6,y-20,16,7,'#4fa055');px(x-11,y-6,26,6,'#377b3f')};
    tree(22,66);tree(152,64);tree(180,70);
    px(118,82,28,2,'#8a5a3c');px(118,86,28,2,'#8a5a3c');px(120,88,2,5,'#5b3a29');px(142,88,2,5,'#5b3a29');
    px(66,56,2,34,'#3b3f4a');px(62,54,10,3,'#3b3f4a');px(64,57,6,2,'#fff2b0');
    shadeTime(sl);
    if(sl>=2){glow(67,60,22,'#fff2b0',sl===3?0.35:0.15);px(64,57,6,2,'#fffbe0')}
    if(sl===3)for(let i=0;i<7;i++){const fx=20+hash(i)*150+Math.sin(t/700+i)*6,fy=72+hash(i+9)*20+Math.cos(t/500+i)*3;if(Math.sin(t/300+i*2)>-0.3){px(fx,fy,1,1,'#eaff8a');glow(fx,fy,3,'#eaff8a',0.35)}}
  },
  mall(sl,t){
    skyRect(0,0,W,H,sl,t);
    px(4,18,184,68,'#d5d9e3');px(4,18,184,2,'#bfc4d0');px(4,22,184,13,'#d6455a');
    [64,76,88,100,116].forEach(x=>{px(x,25,8,7,'#ffffff');px(x+2,27,4,3,'#d6455a')});
    px(10,40,172,40,'#8db6d6');for(let x=10;x<182;x+=12)px(x,40,1,40,'#6f8fa8');px(10,60,172,1,'#6f8fa8');
    px(30,40,8,18,'#f2b33d');px(154,40,8,18,'#3fb5a5');
    px(78,60,36,26,'#3c5468');px(82,62,28,24,'#a9d4ee');px(95,62,2,24,'#3c5468');
    px(0,86,W,22,'#c4c8d0');for(let x=0;x<W;x+=12)px(x,86,1,22,'#b2b6bf');px(0,86,W,2,'#d8dbe2');
    shadeTime(sl,0.45);
    if(sl>=2){ctx.globalAlpha=sl===3?0.75:0.3;px(10,40,172,40,'#ffeec4');ctx.globalAlpha=1;for(let x=10;x<182;x+=12)px(x,40,1,40,'#6f8fa8');px(10,60,172,1,'#6f8fa8');px(82,62,28,24,'#fff1cc');px(95,62,2,24,'#3c5468')}
    if(sl===3){const on=Math.floor(t/600)%5!==0;px(4,22,184,13,on?'#ff5d75':'#b8384d');glow(96,28,40,'#ff6b81',on?0.22:0.08);[64,76,88,100,116].forEach(x=>{px(x,25,8,7,'#ffffff');px(x+2,27,4,3,on?'#ff5d75':'#b8384d')})}
  },
  bank(sl,t){
    skyRect(0,0,W,H,sl,t);
    px(28,30,136,56,'#e4dfd2');px(36,24,120,6,'#d6cfbf');px(50,18,92,6,'#d6cfbf');px(66,12,60,6,'#d6cfbf');
    px(40,31,112,7,'#1f5a85');for(let x=46;x<146;x+=10)px(x,33,6,3,'#e9b44c');
    for(let i=0;i<6;i++){const cx=40+i*22;px(cx-1,40,10,3,'#cfc8b6');px(cx,43,8,39,'#f6f3ea');px(cx+6,43,2,39,'#cfc8b6');if(i<5)px(cx+10,52,10,30,'#5b5a52')}
    px(24,82,144,4,'#cfc8b6');px(20,86,152,3,'#bdb5a2');
    px(166,56,22,32,'#2f6f8f');px(170,62,14,9,'#8ff0ff');px(172,74,10,6,'#1e4a60');px(166,52,22,5,'#e9b44c');
    px(0,89,W,19,'#a7a6a0');px(0,89,W,1,'#bcbbb5');
    shadeTime(sl);
    if(sl>=2){glow(177,66,16,'#8ff0ff',sl===3?0.35:0.15);px(170,62,14,9,'#b5f6ff')}
  },
};

const SPR=["...hhhhhh...","..hhhhhhhh..",".hhhhhhhhhh.",".hhsssssshh.",".hssssssssh.","..ssssssss..","..ssssssss..","..ssssssss..","...ssssss...","....ssss....",
"..wwwwwwww..",".wwwwwwwwww.",".swwwwwwwws.",".swwwwwwwws.",".s.wwwwww.s.","...pppppp...","...pppppp...","...pp..pp...","...pp..pp...","..bbb..bbb.."];
function drawChar(cx,feet,t){
  const sc=2,bob=Math.floor(t/650)%2,x0=cx-12,y0=feet-40-bob,we=isWE(s.day);
  ctx.fillStyle='rgba(0,0,0,0.28)';ctx.fillRect(cx-11,feet-1,22,3);
  const pal={h:'#2a1c14',s:s.sk<30?'#c8d29a':'#f0c49c',w:we?'#ff7a59':'#eef2f7',p:'#2c3550',b:'#16161c'};
  SPR.forEach((row,r)=>{for(let c=0;c<12;c++){const ch=row[c];if(ch==='.')continue;let col=pal[ch];if(!we&&ch==='w'&&(c===5||c===6)&&r>=10&&r<=13)col='#c0392b';px(x0+c*sc,y0+r*sc,sc,sc,col)}});
  const P=(c,r,col)=>px(x0+c*sc,y0+r*sc,sc,sc,col);
  const blink=Math.floor(t/110)%34===0;
  if(blink){P(4,6,'#c99a76');P(7,6,'#c99a76')}
  else if(s.nl<15){P(4,6,'#4a3530');P(7,6,'#4a3530');P(3,5,'#b98666');P(8,5,'#b98666')}
  else{P(4,6,'#1a1a22');P(7,6,'#1a1a22')}
  const mo='#8a3b2b';P(5,8,mo);P(6,8,mo);
  if(s.tt>=60){P(4,7,mo);P(7,7,mo);P(3,7,'#f3a59a');P(8,7,'#f3a59a')}else if(s.tt<30){P(4,9,mo);P(7,9,mo)}
  let icon=null;if(s.started){if(s.sk<30)icon='sick';else if(s.no<25)icon='hungry';else if(s.nl<15)icon='tired';else if(s.tt<25)icon='sad'}
  if(icon){const bx=x0+26,by=y0-12-(Math.floor(t/400)%2);px(bx,by,16,12,'#ffffff');px(bx-1,by+1,18,10,'#ffffff');px(bx+1,by+13,2,2,'#ffffff');px(bx-1,by+16,1,1,'#ffffff');
    if(icon==='hungry'){px(bx+3,by+6,10,2,'#e9e2d0');px(bx+4,by+8,8,2,'#c0392b');px(bx+6,by+2,1,3,'#9aa0b0');px(bx+9,by+2,1,3,'#9aa0b0')}
    if(icon==='tired'){px(bx+4,by+3,6,1,'#3a78c2');px(bx+8,by+4,1,1,'#3a78c2');px(bx+7,by+5,1,1,'#3a78c2');px(bx+6,by+6,1,1,'#3a78c2');px(bx+5,by+7,1,1,'#3a78c2');px(bx+4,by+8,6,1,'#3a78c2');px(bx+11,by+2,3,1,'#3a78c2');px(bx+12,by+3,1,1,'#3a78c2');px(bx+11,by+4,3,1,'#3a78c2')}
    if(icon==='sad'){px(bx+3,by+3,10,4,'#8a90a8');px(bx+5,by+2,6,1,'#8a90a8');px(bx+4,by+8,1,2,'#5cc8ff');px(bx+8,by+9,1,2,'#5cc8ff');px(bx+11,by+8,1,2,'#5cc8ff')}
    if(icon==='sick'){px(bx+7,by+2,3,9,'#e23d4f');px(bx+4,by+5,9,3,'#e23d4f')}}
}
let lastDraw=0;
function loop(t){if(t-lastDraw>110){lastDraw=t;try{(DRAW[s.loc]||DRAW.home)(s.slot,t);drawChar(96,95,t)}catch(e){}}requestAnimationFrame(loop)}

/* ============ Boot ============ */
function boot(data){
  document.querySelectorAll('[data-ico]').forEach(el=>{el.innerHTML=ico(el.dataset.ico)});
  if(data&&data.state&&data.state.started&&data.state.q){s=data.state;startGame();if(s.over)openWin('end');else processQueue()}
  else{s=newState();showTitle()}
  requestAnimationFrame(loop);
}
boot({});
