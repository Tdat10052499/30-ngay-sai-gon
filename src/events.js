/* 30 Ngày Sài Gòn · bộ bài sự kiện ngẫu nhiên (bản chơi thử 2, mục 5).
 * Mỗi sự kiện có: tags (nơi, buổi), loai, max (số lần tối đa trong tháng), cooldown (số ngày chờ trước khi lặp lại), w (trọng số).
 * Quy tắc: mỗi ngày tối đa 1 sự kiện ngẫu nhiên; không ra cùng loai hai ngày liên tiếp; ngày 14–19 sự kiện bạn bè và chuyện vui
 * có trọng số ×2. Sự kiện cốt truyện và sự kiện theo điều kiện (ốm, đau bụng, ngất xỉu) không đi qua bộ bài này.
 * Hàm mk() dùng ev(), skipSlot()... của game.js, chỉ chạy lúc rút bài nên thứ tự nạp không ảnh hưởng. */
const LOAI={thoitiet:'Thời tiết',ban:'Bạn bè',tien:'Tiền bạc',suckhoe:'Sức khỏe',hoc:'Học tập',vui:'Chuyện vui',batngo:'Bất ngờ'};
const DECK=[
  {id:'lau',loai:'ban',max:3,cooldown:5,w:3,tags:{slot:[3]},when:s=>!isWE(s.day),mk:()=>ev('Lớp rủ đi ăn lẩu','“Tối nay cả lớp đi lẩu nướng, mày đi không?” Khoa hỏi.',[
    {l:'Đi luôn',cost:150000,eff:{tt:14,no:20,nl:-8}},{l:'Ở nhà',eff:{tt:-4}}],'khoa')},
  {id:'bike',loai:'tien',max:2,cooldown:7,w:2,tags:{slot:[0]},when:s=>s.bikeBroken===0,mk:()=>ev('Xe chết máy','Chiếc xe máy cũ bố cho đề không nổ. Thợ đầu hẻm báo giá sửa 250.000đ.',[
    {l:'Sửa ngay',cost:250000,eff:{tt:-2}},{l:'Đi xe ôm công nghệ vài hôm',eff:{tt:-4},x:'Phí đi lại ×3 trong 4 ngày',run:s=>{s.bikeBroken=4}}])},
  {id:'found',loai:'vui',max:1,w:.6,tags:{loc:['street','park','market']},mk:()=>ev('Nhặt được tiền','Tờ 50.000đ rơi trên vỉa hè, xung quanh không có ai.',[
    {l:'Bỏ túi',gain:50000,eff:{tt:3}},{l:'Gửi bảo vệ gần đó',eff:{tt:8}}])},
  {id:'praise',loai:'vui',max:1,w:5,tags:{loc:['store'],slot:[2,3]},when:s=>s.shifts>=8,mk:()=>ev('Chị Mai khen','“Mấy ca của Minh quầy lúc nào cũng gọn gàng. Chị thưởng nóng nè.”',[
    {l:'Em cảm ơn chị',gain:100000,eff:{tt:10}}],'mai')},
  /* mưa: ở công viên buổi trưa hoặc chiều; khi đi lại thì xét trong travel() (8%) */
  {id:'rain',loai:'thoitiet',max:2,cooldown:5,w:2,tags:{loc:['park'],slot:[1,2]},mk:s=>rainEv(s)},
  {id:'cafeFull',loai:'ban',max:1,w:2,tags:{loc:['cafe'],slot:[1,2,3]},mk:()=>ev('Quán hết chỗ','“Quán kín bàn rồi, em ngồi chung với bạn này được không?” Người ngồi cùng là một anh năm ba cùng ngành Thiết kế.',[
    {l:'Ngồi chung, bắt chuyện',eff:{tt:6},x:'Có thêm một người quen'},{l:'Mua mang về',eff:{tt:-1}}])},
  {id:'mallCard',loai:'tien',max:1,w:2,tags:{loc:['mall'],slot:[1,2,3]},mk:()=>ev('Mời làm thẻ thành viên','Nhân viên mời đăng ký thẻ thành viên 99.000đ, hứa tích điểm đổi quà.',[
    {l:'Đăng ký thẻ 99k',cost:99000,eff:{tt:2},x:'Điểm tích lũy chưa dùng được trong tháng này'},{l:'Cảm ơn, để sau',eff:{tt:1}}])},
  {id:'lend',loai:'tien',max:1,w:1.5,when:s=>s.day>=6&&s.day<=19,mk:()=>ev('Khoa hỏi mượn tiền','“Cho tao mượn 300k, cuối tháng trả nha. Tháng này nhà tao gửi tiền trễ.”',[
    {l:'Cho mượn',cost:300000,eff:{tt:3},x:'Hẹn trả ngày 28',run:s=>{s.lent=300000}},{l:'Từ chối',eff:{tt:-6}}],'khoa')},
  {id:'phone',loai:'tien',max:1,w:1,mk:()=>ev('Rơi điện thoại','Điện thoại tuột tay, màn hình nứt một đường dài.',[
    {l:'Thay màn hình',cost:400000},{l:'Dùng tạm',eff:{tt:-10}}])},
  {id:'bday',loai:'ban',max:1,w:2,tags:{slot:[3]},when:s=>isWE(s.day)&&s.day!==13,mk:()=>ev('Sinh nhật bạn cùng lớp','Lớp tổ chức sinh nhật cho một bạn ở quán nướng, Khoa cũng đi.',[
    {l:'Góp quà, đi dự',cost:150000,eff:{tt:12,no:15}},{l:'Nhắn tin chúc mừng',eff:{tt:-4}}],'khoa')},
  /* ---------- sự kiện mới (mục 5.2) ---------- */
  {id:'scam',loai:'tien',max:1,w:1.5,when:s=>s.day>=9&&s.day<=25,mk:()=>ev('Tin nhắn trúng thưởng','Tin nhắn báo bạn trúng một chiếc điện thoại, chỉ cần chuyển 200.000đ “phí nhận quà”.',[
    {l:'Chuyển tiền',cost:200000,eff:{tt:-10},run:()=>queue.unshift(ev('Bị lừa rồi','Chuyển tiền xong thì số kia chặn liên lạc. Đó là tin nhắn lừa đảo.',[{l:'Đành chịu'}]))},
    {l:'Chặn số, bỏ qua',eff:{tt:2},x:'Tin nhắn lừa đảo'}])},
  {id:'wallet',loai:'vui',max:1,w:1.5,tags:{loc:['park']},mk:()=>ev('Nhặt được ví','Một chiếc ví rơi dưới ghế đá, trong có giấy tờ và ít tiền.',[
    {l:'Nộp cho bảo vệ công viên',eff:{tt:6}},
    {l:'Tự đi tìm chủ',eff:{tt:10},gain:50000,x:'Hết buổi · chủ ví gửi cảm ơn 50.000đ',run:()=>skipSlot('Đi tìm chủ chiếc ví nhặt được')}])},
  {id:'homebox',loai:'vui',max:1,w:2,tags:{loc:['home']},when:s=>s.day>=10&&s.day<=20,mk:()=>ev('Thùng đồ quê','“Mẹ gửi con ít đồ ăn ở quê, nhớ nấu ăn cho đàng hoàng nghe con.” Trong thùng có rau, trứng và mấy gói mì.',[
    {l:'Dạ, con cảm ơn mẹ',eff:{tt:6},x:'+2 nguyên liệu, +3 gói mì',run:()=>{bagAddFit('nguyenlieu',2);bagAddFit('mi',3)}}],'me')},
  {id:'tufood',loai:'vui',max:1,w:2,tags:{loc:['home'],slot:[3]},mk:()=>ev('Tô canh của cô Tư','“Cô nấu dư nồi canh chua, con lấy một tô ăn cho ấm bụng nè.”',[
    {l:'Dạ, con cảm ơn cô',eff:{no:30,tt:4}}],'tu')},
  {id:'friendhome',loai:'ban',max:1,w:2,when:s=>isWE(s.day),mk:()=>ev('Bạn cùng quê rủ đi ăn','Một người bạn cùng quê mới vào Sài Gòn nhắn: “Tối nay rảnh hông, đi ăn với tao một bữa nha!”',[
    {l:'Đi ăn',cost:60000,eff:{tt:10,nl:-4}},{l:'Hẹn dịp khác',eff:{tt:-2}}])},
  {id:'charger',loai:'tien',max:1,w:1,mk:()=>ev('Hỏng sạc laptop','Sạc laptop bỗng tắt ngúm, đèn không sáng nữa.',[
    {l:'Mua sạc mới',cost:150000},{l:'Mượn của bạn',x:'Không học thư viện được 2 ngày',run:s=>{s.flags.noLibUntil=s.day+1}}])},
  {id:'blackout',loai:'batngo',max:1,w:1.5,tags:{loc:['home'],slot:[3]},mk:s=>{s.flags.blackout=s.day*10+s.slot;return ev('Cúp điện','Cả xóm trọ tối om, quạt cũng đứng. Tối nay không lướt mạng được.',[{l:'Đành vậy'}])}},
  {id:'lostitem',loai:'ban',max:1,w:2,tags:{loc:['store']},when:s=>s.lastAct==='shift',mk:()=>ev('Khách để quên điện thoại','Một vị khách bỏ quên điện thoại trên quầy rồi đi mất.',[
    {l:'Giữ lại chờ khách quay lại',eff:{tt:6},x:'Chị Mai khen'},{l:'Để trên quầy'}])},
  {id:'groupwork',loai:'hoc',max:1,w:2,tags:{loc:['school']},when:s=>!isWE(s.day),mk:()=>ev('Bài tập nhóm','“Tuần này các em làm bài nhóm, nhớ lên thư viện cùng nhau làm nha.”',[
    {l:'Dạ',x:'2 buổi thư viện tới: điểm học tập +2 mỗi buổi',run:s=>{s.groupwork=2}}],'hai')},
  {id:'khoapark',loai:'ban',max:3,cooldown:2,w:2,tags:{loc:['home'],slot:[0]},when:s=>isWE(s.day),mk:()=>ev('Khoa rủ chạy bộ','“Dậy chạy bộ ở công viên với tao không? Trời đang mát.”',[
    {l:'Đi chạy với Khoa',eff:{sk:8,tt:5,nl:-14},x:'Đi tới công viên · hết buổi',run:()=>{s.loc='park';skipSlot('Chạy bộ ở công viên với Khoa')}},
    {l:'Ngủ nướng',eff:{nl:10,tt:-2}}],'khoa')},
];
const DECK_BY=Object.fromEntries(DECK.map(e=>[e.id,e]));
/* sự kiện có rút được lúc này không (bỏ qua giới hạn mỗi ngày nếu ignoreDaily) */
function deckOk(s,e,ignoreDaily){
  const u=(s.evUse||{})[e.id]||{n:0,last:-99};
  if(u.n>=(e.max||1))return false;
  if(e.cooldown&&s.day-u.last<e.cooldown)return false;
  if(!ignoreDaily){
    if(s.evDay===s.day)return false;
    if(s.evLast&&s.evLast.day===s.day-1&&s.evLast.loai===e.loai)return false;
  }
  const T=e.tags||{};
  if(T.loc&&!T.loc.includes(s.loc))return false;
  if(T.slot&&!T.slot.includes(s.slot))return false;
  return !e.when||!!e.when(s);
}
const deckWeight=(s,e)=>e.w*((s.day>=14&&s.day<=19&&(e.loai==='ban'||e.loai==='vui'))?2:1);
function deckUse(s,e){s.evUse=s.evUse||{};const u=s.evUse[e.id]||{n:0,last:-99};s.evUse[e.id]={n:u.n+1,last:s.day};s.evDay=s.day;s.evLast={day:s.day,loai:e.loai}}
/* rút một sự kiện theo trọng số; rand() trả số trong [0,1) */
function deckDraw(s,rand){
  const pool=DECK.filter(e=>deckOk(s,e));if(!pool.length)return null;
  let r=rand()*pool.reduce((a,e)=>a+deckWeight(s,e),0),pick=pool[pool.length-1];
  for(const e of pool){r-=deckWeight(s,e);if(r<=0){pick=e;break}}
  deckUse(s,pick);return pick;
}
