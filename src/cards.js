/* 30 Ngày Sài Gòn · chế độ ăn và thẻ hành động (bản chơi thử 2, mục 3).
 * Hàm thuần: đọc trạng thái s và trả về việc nên làm, không đổi gì. game.js thực hiện qua autoEat().
 * Dùng ITEMS và A của game.js, chỉ chạy sau khi game đã nạp nên thứ tự nạp không ảnh hưởng. */
const DIETS={
  tunau:{n:'Tự nấu',perDay:32000},
  binhdan:{n:'Bình dân',perDay:95000},
  thoaimai:{n:'Thoải mái',perDay:190000},
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
