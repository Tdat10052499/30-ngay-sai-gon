/* 30 Ngày Sài Gòn · thẻ ăn và thẻ hành động (bản chơi thử 2, mục 3).
 * Hàm thuần: đọc trạng thái s và trả về món hoặc thẻ gợi ý, không đổi gì. game.js thực hiện qua eatMeal() và runCard().
 * Dùng ITEMS, A, LOCS của game.js, chỉ chạy sau khi game đã nạp nên thứ tự nạp không ảnh hưởng. */

/* ---------- thẻ ăn (mục 3.2) ---------- */
const HUNGRY_HL=45;   // độ no dưới mức này thì thẻ ăn được tô nổi; dưới 25 có nhãn "Đang đói"
/* đồ ăn trong túi dùng được ở nơi đang đứng, mỗi loại một món, món sắp hỏng nhất trước */
function bagFoods(s){
  const seen={};
  return s.bag.filter(x=>{const it=ITEMS[x.id];return it.type==='food'&&(!it.where||it.where.includes(s.loc))})
    .sort((a,b)=>(a.exp==null?999:a.exp)-(b.exp==null?999:b.exp)).filter(x=>!seen[x.id]&&(seen[x.id]=1));
}
/* mọi món ăn được ở nơi đang đứng: đồ trong túi, món gọi tại chỗ, đồ mua lẻ rồi ăn ngay.
 * Mỗi món {kind:'item'|'act'|'buy', id, n, cost, eff, bag, exp, buy} */
function mealOptions(s){
  const o=[];
  for(const x of bagFoods(s)){const it=ITEMS[x.id];o.push({kind:'item',id:x.id,n:x.id==='nguyenlieu'?'Nấu cơm':it.n,cost:0,eff:effOf(it),bag:true,exp:x.exp})}
  for(const a of A[s.loc]){
    if((a.show&&!a.show(s))||reason(a))continue;
    if(a.k==='meal')o.push({kind:'act',id:a.id,n:a.n,cost:a.cost||0,eff:effOf(a)});
    else if(a.k==='buy'&&a.qty===1){const id=a.id.slice(4),it=ITEMS[id];
      if(it&&it.type==='food'&&(!it.where||it.where.includes(s.loc))&&!o.some(m=>m.id===id))o.push({kind:'buy',id,buy:a.id,n:it.n,cost:a.cost,eff:effOf(it)})}
  }
  return o;
}
/* 2 đến 3 món cho thẻ ăn: đồ trong túi sắp hỏng (hỏng sau hôm nay) nếu có, món rẻ nhất,
 * một món no hơn hoặc tốt cho sức khỏe hơn. Đã ăn trong buổi hoặc không có gì để ăn thì trả mảng rỗng. */
function pickMeals(s){
  if(s.ateThisSlot)return [];
  const all=mealOptions(s),out=[],add=m=>{if(m&&!out.includes(m))out.push(m)};
  add(all.find(m=>m.bag&&m.exp!=null&&m.exp<=s.day));
  add([...all].sort((a,b)=>a.cost-b.cost||(b.eff.no||0)-(a.eff.no||0))[0]);
  const val=m=>(m.eff.no||0)+2*(m.eff.sk||0);
  add(all.filter(m=>!out.includes(m)).sort((a,b)=>val(b)-val(a)||a.cost-b.cost)[0]);
  return out.slice(0,3);
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
/* 3 đến 5 thẻ cho buổi hiện tại; thẻ cuối luôn là "Tự chọn". Có thẻ ăn thì chỉ lấy 3 thẻ việc để tổng vẫn tối đa 5 */
function pickCards(s){
  const maxN=pickMeals(s).length?MAX_CARDS-1:MAX_CARDS;
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
  for(const [loc,a] of all){if(out.length>=maxN)break;
    if(!has(a.id)&&QUEST_DAY[a.id]&&questOfAct(s,a.id)&&QUEST_DAY[a.id](s))out.push(makeCard(s,loc,a,a.id==='gift'?{n:'Mua quà sinh nhật mẹ'}:{}))}
  /* cúp điện ở phòng trọ: gợi ý ra quán cà phê */
  if(s.flags.blackout===s.day*10+s.slot&&out.length<maxN){const ch=A.cafe.find(a=>a.id==='chill');if(ch&&!has('chill'))out.push(makeCard(s,'cafe',ch,{n:'Ra quán cà phê'}))}
  /* các thẻ còn lại: việc làm được, ưu tiên việc giúp chỉ số đang thấp nhất; mỗi nhóm việc một thẻ */
  const best={},grp=a=>CARD_GROUP[a.id]||a.id,used=new Set(out.map(c=>CARD_GROUP[c.id]||c.id));
  for(const [loc,a] of all){if(a.id==='idle'||a.k!=='act'||has(a.id)||used.has(grp(a))||reasonAt(s,loc,a))continue;
    const sc=cardScore(s,loc,a),g=grp(a);if(!best[g]||sc>best[g].sc)best[g]={sc,loc,a}}
  Object.values(best).sort((x,y)=>y.sc-x.sc).forEach(b=>{if(out.length<maxN)out.push(makeCard(s,b.loc,b.a))});
  if(out.length<2)out.push(makeCard(s,s.loc,IDLE));
  out.push({id:'custom',n:'Tự chọn',custom:true});
  return out;
}
