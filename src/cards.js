/* 30 Ngày Sài Gòn · chế độ ăn và thẻ hành động (bản chơi thử 2, mục 3).
 * Hàm thuần: đọc trạng thái s và trả về việc nên làm, không đổi gì. game.js thực hiện qua autoEat().
 * Dùng ITEMS và A của game.js, chỉ chạy sau khi game đã nạp nên thứ tự nạp không ảnh hưởng. */
const DIETS={
  tunau:{n:'Tự nấu',perDay:40000},     // ước tính tiền ăn mỗi ngày theo mô phỏng (Thận trọng, 80 ván)
  binhdan:{n:'Bình dân',perDay:45000},
  thoaimai:{n:'Thoải mái',perDay:65000},
  tuchon:{n:'Tự chọn bữa',perDay:null},
};
const MEAL_NEED=45;  // tự ăn khi độ no dưới mức này và buổi đó chưa ăn
/* món ăn trong túi dùng được ở nơi đang đứng, món sắp hỏng nhất trước (bỏ mì gói nếu noMi) */
function bagFood(s,noMi){
  const ok=s.bag.filter(x=>{const it=ITEMS[x.id];return it.type==='food'&&!(noMi&&x.id==='mi')&&(!it.where||it.where.includes(s.loc))});
  ok.sort((a,b)=>(a.exp==null?999:a.exp)-(b.exp==null?999:b.exp));
  return ok.length?ok[0].id:null;
}
/* bữa ăn tự động theo bảng chế độ ăn × địa điểm.
 * Trả {item} (ăn đồ trong túi), {act} (gọi món tại chỗ), {buy,item} (mua rồi ăn ngay) hoặc null. */
function autoMeal(s){
  const d=s.diet||'binhdan';
  if(d==='tuchon'||s.no>=MEAL_NEED||s.ateThisSlot)return null;
  const L=s.loc,bag=noMi=>{const id=bagFood(s,noMi);return id?{item:id}:null};
  if(d==='tunau'&&L==='home'&&s.bag.some(x=>x.id==='nguyenlieu'))return {item:'nguyenlieu'};
  if(d==='thoaimai'){const m={home:'ship',street:'bunbo',store:'boxmeal',mall:'buffet'}[L];if(m)return {act:m}}
  switch(L){
    case 'home':return bag(true)||(s.bag.some(x=>x.id==='mi')?{item:'mi'}:null)||{act:'ship'};
    case 'street':return bag()||{act:'comtam'};
    case 'market':return bag()||{buy:'buy_traicay',item:'traicay'};
    case 'park':return bag()||{act:'bap'};
    case 'cafe':return bag()||{buy:'buy_banhngot',item:'banhngot'};
    case 'school':return s.slot===1?{act:'canteen'}:bag();
    case 'store':return bag(true)||{act:'boxmeal'};
    case 'mall':return bag();
  }
  return null;
}

/* ---------- thẻ hành động theo buổi (mục 3.1) ---------- */
/* hành động gắn với nhiệm vụ chính: thẻ có dấu chấm than khi nhiệm vụ đang làm */
const QUEST_ACT={q1_class:'class',q2_class:'class',q1_job:'interview',q2_shift:'shift',q3_study:'library',q3_khoa:'khoa',q4_exam:'exam',q4_gift:'gift'};
const questOfAct=(s,id)=>Object.keys(QUEST_ACT).find(q=>QUEST_ACT[q]===id&&s.q[q]==='active')||null;
/* thẻ nhiệm vụ "đúng ngày": luôn có mặt, kể cả khi đang khóa */
const QUEST_DAY={khoa:s=>s.day===20||s.day===21,gift:()=>true,interview:()=>true};
const MAX_CARDS=4;   // số thẻ việc tối đa, chưa tính thẻ "Tự chọn"
/* lý do chưa làm được việc a ở nơi loc (đã tính tiền đi lại) */
function reasonAt(s,loc,a){
  if(!a.free){const lr=LOCS[loc].open(s);if(lr)return lr}
  const r=a.when?a.when(s):null;if(r)return r;
  const tc=loc===s.loc?0:travelCost(loc);
  if(a.cost&&s.money<a.cost+tc)return 'Không đủ tiền';
  return null;
}
/* nhóm việc giống nhau: mỗi nhóm tối đa một thẻ để các thẻ khác nhau */
const CARD_GROUP={nap:'rest',bench:'rest',campusnap:'rest',idle:'rest',net:'fun',trada:'fun',walk:'fun',chill:'fun',movie:'fun',stroll:'fun',window:'fun',shop:'fun',oc:'fun',
  shift:'work',free:'freelance',library:'study',class:'study',club:'club',run:'health',clean:'clean',sleep:'sleep'};
/* điểm gợi ý: chỉ số càng thấp thì việc bù chỉ số đó càng được ưu tiên; mất chỉ số đang thấp bị trừ nặng hơn */
function cardScore(s,loc,a){
  const e=effOf(a);let v=0;
  for(const {k} of STATS){const x=e[k]||0;if(!x)continue;
    v+=x>0?x*Math.max(0,90-s[k])/40:x*(0.5+1.5*Math.max(0,60-s[k])/60)}
  const tc=loc===s.loc?0:travelCost(loc),gain=(a.gain||0)+(a.id==='shift'?shiftPay(s):0);
  const mw=s.money<600000?3:s.money<1500000?2:1.5;
  v+=(gain-(a.cost||0)-tc)/10000*mw;
  if(a.id==='clean')v+=[0,6,14][messLv()];
  if(a.id==='sleep')v+=s.nl<60?12:6;
  if(a.id==='library'&&(s.study<8||questOfAct(s,'library')))v+=8;
  if(questOfAct(s,a.id))v+=10;
  return v;
}
/* chỉ số nào sẽ xuống dưới 25 sau hành động và hao hụt cuối buổi */
function cardWarn(s,a){
  const e=effOf(a),dc=slotDecay(s,chOf(s.day)),dec={no:dc.no,nl:dc.nl,tt:dc.tt,sk:0};
  return STATS.filter(S=>s[S.k]+(e[S.k]||0)-(a.k==='act'?dec[S.k]:0)<25).map(S=>S.k);
}
function makeCard(s,loc,a,extra){
  const lock=reasonAt(s,loc,a),q=questOfAct(s,a.id);
  return {id:a.id,loc,n:a.n,place:LOCS[loc].short,travel:loc===s.loc?0:travelCost(loc),eff:effOf(a),cost:a.cost||0,gain:a.gain||0,
    pay:a.id==='shift'?shiftPay(s):0,note:typeof a.note==='function'?a.note(s):a.note||'',quest:!!q,lock,warn:lock?[]:cardWarn(s,a),hl:false,...extra};
}
/* 3 đến 5 thẻ cho buổi hiện tại; thẻ cuối luôn là "Tự chọn" */
function pickCards(s){
  const all=[];
  for(const loc of Object.keys(LOCS))for(const a of A[loc]){
    if(a.show&&!a.show(s))continue;
    if(a.k==='act'||(a.id==='gift'))all.push([loc,a]);
  }
  const out=[],has=id=>out.some(c=>c.id===id);
  const find=id=>all.find(([,a])=>a.id===id);
  /* sáng ngày thường: Đi học (ngày 29: Đi thi giữa kỳ) đứng đầu, tô nổi */
  if(!isWE(s.day)&&s.slot===0){const f=find(s.day===29?'exam':'class');if(f)out.push(makeCard(s,f[0],f[1],{hl:true,n:s.day===29?'Đi thi giữa kỳ':'Đi học'}))}
  /* thẻ nhiệm vụ đúng ngày, kể cả khi đang khóa */
  for(const [loc,a] of all){if(out.length>=MAX_CARDS)break;
    if(!has(a.id)&&QUEST_DAY[a.id]&&questOfAct(s,a.id)&&QUEST_DAY[a.id](s))out.push(makeCard(s,loc,a,a.id==='gift'?{n:'Mua quà sinh nhật mẹ'}:{}))}
  /* các thẻ còn lại: việc làm được, ưu tiên việc giúp chỉ số đang thấp nhất; mỗi nhóm việc một thẻ */
  const best={},grp=a=>CARD_GROUP[a.id]||a.id,used=new Set(out.map(c=>CARD_GROUP[c.id]||c.id));
  for(const [loc,a] of all){if(a.id==='idle'||a.k!=='act'||has(a.id)||used.has(grp(a))||reasonAt(s,loc,a))continue;
    const sc=cardScore(s,loc,a),g=grp(a);if(!best[g]||sc>best[g].sc)best[g]={sc,loc,a}}
  Object.values(best).sort((x,y)=>y.sc-x.sc).forEach(b=>{if(out.length<MAX_CARDS)out.push(makeCard(s,b.loc,b.a))});
  if(out.length<2)out.push(makeCard(s,s.loc,IDLE));
  out.push({id:'custom',n:'Tự chọn',custom:true});
  return out;
}
