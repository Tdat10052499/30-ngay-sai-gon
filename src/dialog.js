/* 30 Ngày Sài Gòn · sáu loại hộp hội thoại (CLAUDE-CODE-DIEN-THOAI.md mục 5, design/14 phần "Hộp hội thoại").
 * talk (1 lựa chọn), choice (từ 2 lựa chọn), msg (tin nhắn), call (cuộc gọi), alert (cảnh báo quan trọng): dựng HTML ở đây,
 * game.js đặt vào #win rồi chạy chữ hiện dần (startType). think (tự nhủ) là bong bóng cạnh nhân vật, không chặn thao tác.
 * Cùng một HTML cho cả hai hướng điện thoại, CSS xếp lại khi xoay máy. Máy tính giữ khung hội thoại cũ cho talk và choice.
 * Dùng Portraits, PEOPLE, SLOTS, PH_TIME, evLook, evChips, pxImg của game.js, chỉ chạy lúc mở hộp nên thứ tự nạp không ảnh hưởng. */
const Dialog=(()=>{
const STYLES=['talk','choice','msg','call','alert'];
/* loại hộp: sự kiện khai báo style thì theo đó; hộp cảnh báo (warnEv) là alert; còn lại theo số lựa chọn */
function style(e){
  if(e.style&&STYLES.includes(e.style))return e.style;
  if(e.kind==='warn')return 'alert';
  return e.choices.length>1?'choice':'talk';
}
/* máy tính giữ khung hội thoại cũ (design/10) cho talk và choice */
const useNew=(st,lay)=>lay!=='desktop'||!['talk','choice'].includes(st);
const stamp=()=>`Ngày ${s.day} · ${SLOTS[s.slot]}`;
const accent=who=>who&&Portraits.CH[who]?Portraits.CH[who].bg[1]:'#4a5390';
const face=(e,ex)=>pxImg(Portraits.url(e.who,ex||evLook(e).ex,{gender:s.gender}));
const noMoney=c=>(c.cost&&s.money<c.cost)?'Không đủ tiền':c.need?c.need(s):null;
function btn(c,i,cls,one){
  const no=noMoney(c),ch=(c.cost||c.gain||c.eff||c.x||no)?`<span class="e-chips">${evChips(c)}${no?`<span class="no">${no}</span>`:''}</span>`:'';
  return `<button class="${cls}" type="button" data-ch="${i}" ${no?'disabled':''}><b>${c.l}</b>${ch}${one?'<i class="dd-arrow" aria-hidden="true">▼</i>':''}</button>`;
}
function html(e,st){
  const C=e.who&&Portraits.CH[e.who],P=e.who&&PEOPLE[e.who],name=P?P.n.split(' · ')[0]:e.from||'Tin nhắn',role=P?(P.n.split(' · ')[1]||C.role):'';
  const one=e.choices.length===1,say=`<p class="dd-say" id="evSay" aria-live="polite" data-typing="${typingOn()?1:0}">${e.text}</p>`;
  if(st==='msg')return `<section class="dd dd-msg">
    <div class="dd-mh">${C?`<span class="dd-av">${face(e)}</span>`:`<span class="dd-av dd-av0" aria-hidden="true">${name[0]}</span>`}<div><b>${name}</b><small>Tin nhắn · ${PH_TIME[s.slot]}</small></div><span class="dd-mbadge">1 tin mới</span></div>
    <h2 class="vh" id="evT">${e.title}</h2>
    <div class="dd-chat"><div class="dd-bub">${say}</div></div>
    <div class="dd-quick" data-chs>${e.choices.map((c,i)=>btn(c,i,'dd-q')).join('')}</div></section>`;
  if(st==='call')return `<section class="dd dd-call"><div class="dd-cbg"></div>
    <h2 class="vh" id="evT">${e.title}</h2>
    <div class="dd-ctop"><small>Cuộc gọi đến · ${stamp()}</small><span class="dd-ring">${C?face(e,'normal'):''}</span><b>${name}</b><span>${C?C.role:''}</span></div>
    <div class="dd-cr">${say}<div class="dd-cch" data-chs>${e.choices.map((c,i)=>btn(c,i,'dd-b')).join('')}</div></div></section>`;
  if(st==='alert'){const last=e.choices.length-1;
    return `<section class="dd dd-alert"><div class="dd-aic" aria-hidden="true">!</div><small class="num">${stamp()}</small><h2 id="evT">${e.title}</h2>
    <p class="dd-say" id="evSay" data-typing="0">${e.text}</p>
    <div class="dd-ab${e.choices.length>1?' two':''}" data-chs>${e.choices.map((c,i)=>{const no=noMoney(c),sec=e.choices.length>1&&i===last;
      return `<button class="${sec?'dd-sec':'dd-pri'}" type="button" data-ch="${i}" ${no?'disabled':''}><b>${c.l}</b>${c.x||no?`<small>${no||c.x}</small>`:''}</button>`}).join('')}</div></section>`}
  /* talk, choice */
  return `<section class="dd dd-sheet${one?' one':''}${C?'':' noface'}" style="--acc:${accent(e.who)}">
    ${C?`<div class="dd-face">${face(e)}</div><div class="dd-head"><span class="dd-name">${name}</span><span class="dd-role">${role}</span></div>`:''}
    <div class="dd-meta"><h2 id="evT">${e.title}</h2><span class="num">${stamp()}</span></div>
    ${say}
    <div class="dd-ch" data-chs>${e.choices.map((c,i)=>btn(c,i,'dd-b'+(one?' cont':''),one)).join('')}</div></section>`;
}
const typingOn=()=>!reduceMotion()&&typeof setInterval==='function';

/* ---------- think: bong bóng tự nhủ cạnh nhân vật, tự ẩn sau 3 giây ---------- */
let thinkT=0;
function think(text){
  if(typeof getComputedStyle!=='function')return;
  const ov=document.getElementById('ov'),cv=document.getElementById('scene');if(!ov||!cv)return;
  hideThink(true);
  const el=document.createElement('div');el.className='dd-think';el.id='think';el.setAttribute('role','status');
  el.innerHTML=`<p>${nm(text)}</p><i></i><i></i>`;ov.appendChild(el);placeThink();
  thinkT=setTimeout(()=>hideThink(),3000);
}
/* đặt bong bóng phía trên bên phải đầu nhân vật (vị trí nhân vật ghi lại lúc vẽ cảnh), không ra ngoài vùng cảnh */
function placeThink(){
  if(typeof getComputedStyle!=='function')return;
  const el=document.getElementById('think'),cv=document.getElementById('scene'),host=document.getElementById('scn');if(!el||!cv||!host)return;
  const r=cv.getBoundingClientRect(),hb=host.getBoundingClientRect(),ui=(el.offsetParent||document.body).getBoundingClientRect();
  const fit=getComputedStyle(cv).objectFit,hx=heroPos.cx,hy=heroPos.feet-54;
  let k=r.width/320,ox=0,oy=0;if(fit==='cover'){k=Math.max(r.width/320,r.height/180);ox=(r.width-320*k)/2;oy=r.height-180*k}
  const x=r.left+ox+hx*k,y=r.top+oy+hy*k,w=el.offsetWidth,h=el.offsetHeight;
  const left=Math.max(hb.left+8,Math.min(hb.right-w-8,x+6)),top=Math.max(hb.top+8,y-h-18);
  el.style.left=(left-ui.left)+'px';el.style.top=(top-ui.top)+'px';
  /* đuôi bong bóng chỉ về phía đầu nhân vật */
  el.style.setProperty('--tx',Math.max(10,Math.min(w-20,x-left))+'px');
}
function hideThink(now){
  clearTimeout(thinkT);const el=document.getElementById('think');if(!el)return;
  if(now||reduceMotion()){el.remove();return}
  el.classList.add('out');setTimeout(()=>el.remove(),400);
}
/* lời tự nhủ theo trạng thái (ngưỡng như bong bóng trên đầu nhân vật, heroLook) — chữ đã duyệt trong docs/PLAN-DIEN-THOAI.md */
const THINK=[
  ['hungry',s=>s.no<25,'Bụng hơi cồn cào… chắc phải kiếm gì ăn.'],
  ['tired',s=>s.nl<15,'Mệt rã rời… phải ngủ một giấc mới được.'],
  ['sick',s=>s.sk<30,'Người cứ nôn nao, chắc sắp ốm rồi.'],
  ['sad',s=>s.tt<25,'Dạo này buồn buồn… ra ngoài một chút cho khuây khỏa.'],
  ['messy',s=>s.loc==='home'&&messLv()===2,'Phòng bừa quá, nhìn mà nản.'],
];
/* trạng thái nào mới bắt đầu thì tự nhủ một câu; mỗi trạng thái tối đa một lần mỗi buổi */
let thinkPrev=new Set(),thinkSaid=new Set();
function thinkCheck(){
  if(!s||!s.started||s.over||mode!=='game')return;
  const now=new Set(THINK.filter(([,f])=>f(s)).map(([k])=>k)),slot=s.day*10+s.slot;
  if(!win){const hit=THINK.find(([k])=>now.has(k)&&!thinkPrev.has(k)&&!thinkSaid.has(slot+k));if(hit){thinkSaid.add(slot+hit[0]);think(hit[2])}}
  thinkPrev=now;
}

/* ---------- ?debug=dialog: bật nhanh từng loại hộp với lời mẫu để chụp ---------- */
const LONG='“Chìa khóa nè. Con ở chung với thằng Khoa, tiền nhà phần con 1 triệu 2, đóng sáng mùng 5 nghen. Trong túi con có ít nguyên liệu cô cho, tối về nấu ăn cho đỡ tốn. Đi đâu nhớ khóa cửa, xe để trong hẻm thì khóa thêm cái khóa đĩa. Nước nóng mở từ 6 giờ tối, xài xong nhớ tắt bình. Có gì hư hỏng cứ kêu cô, đừng ngại. Mà con nhớ ăn uống đàng hoàng, đừng ăn mì gói hoài nghen, hại sức khỏe lắm đó con. Nhớ lời cô nghen.”';
function sample(kind,long){
  const t=long?LONG:null;
  const E={
    talk:()=>ev('Phòng ghép với Khoa',t||'“Chìa khóa nè. Con ở chung với thằng Khoa, tiền nhà phần con 1 triệu 2, đóng sáng mùng 5 nghen. Trong túi con có ít nguyên liệu cô cho, tối về nấu ăn cho đỡ tốn.”',[{l:'Dạ, con cảm ơn cô'}],'tu'),
    choice:()=>ev('Khoa hỏi mượn tiền',t||'“Cho tao mượn 300k, cuối tháng trả nha. Tháng này nhà tao gửi tiền trễ.”',[{l:'Cho mượn',cost:300000,eff:{tt:3},x:'Hẹn trả ngày 28'},{l:'Từ chối',eff:{tt:-6}}],'khoa'),
    msg:()=>ev('Tin nhắn của mẹ',t||'“Bố mẹ gửi con 3 triệu cho tháng đầu, đã gồm tiền nhà. Con chi tiêu cho khéo, học hành cho đàng hoàng nghe con.”',[{l:'Dạ, con biết rồi mẹ'}],'me',{style:'msg'}),
    call:()=>ev('Mẹ gọi điện',t||'“Con ăn uống có đủ không? Tiền còn đủ xài không con?”',[{l:'Con đủ mà, mẹ đừng lo',eff:{tt:5}},{l:'Con xin thêm 500k',gain:500000,eff:{tt:-4},x:'Ảnh hưởng nhiệm vụ Tự lập'}],'me',{style:'call'}),
    alert:()=>warnEv('dbg','Bài kiểm tra giữa kỳ',t||'“Sáng nay là bài kiểm tra giữa kỳ. Vắng là không có điểm.”',{l:'Đi thi ngay',x:'Trường · 6.000đ'}),
  };
  if(kind==='think'){think(long?LONG.slice(0,120):'Bụng hơi cồn cào… chắc phải kiếm gì ăn.');return}
  /* mẫu chỉ để xem: chọn xong không đổi gì trong ván */
  const e=E[kind]();e.choices=e.choices.map(c=>({l:c.l,cost:c.cost,gain:c.gain,eff:c.eff,x:c.x,need:c.need,dbg:1}));
  if(win)hideWin();queue.unshift(e);processQueue();
}
function debugBar(){
  if(typeof Layout==='undefined'||!Layout.debug.includes('dialog'))return;
  const bar=document.createElement('div');bar.id='dbgDlg';
  bar.innerHTML=['talk','choice','msg','call','alert','think'].map(k=>`<button type="button" data-k="${k}">${k}</button>`).join('')+'<label><input type="checkbox" id="dbgLong"> 400 chữ</label>';
  bar.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(!b)return;if(!s||!s.started){MG.off=true;newGame({name:'Minh',gender:'nam'});let g=0;while(win==='event'&&g++<50){finishType();pickChoice(0)}hideWin();queue=[]}
    sample(b.dataset.k,document.getElementById('dbgLong').checked)});
  document.body.appendChild(bar);
}
return {STYLES,style,useNew,html,think,hideThink,placeThink,thinkCheck,sample,debugBar,LONG};
})();
