/* 30 Ngày Sài Gòn · minigame (bản chơi thử 2, mục 6): khung chung, Thối tiền, Canh lửa.
 * Phần chấm điểm là hàm thuần (test được). Phần giao diện vẽ vào khung cửa sổ của game (win === 'event', kind 'mg').
 * Dùng fmt, chOf của game.js và Money của src/gfx/money.js, chỉ gọi lúc chơi nên thứ tự nạp không ảnh hưởng.
 * MG.off = true thì không mở minigame, luôn lấy kết quả trung bình (tools/simulate.js). */
const MG={off:false};
const MG_TIME={change:25,cook:15};   // giây cho cả lượt; máy bật giảm chuyển động thì không giới hạn

/* ---------- tần suất: lần đầu mỗi tuần cho mỗi loại, sau đó khoảng 1 trong 3 lần ---------- */
function mgWant(s,type,rand){
  s.mg=s.mg||{};const k=type+chOf(s.day);
  if(!s.mg[k]){s.mg[k]=1;return true}
  return rand()<1/3;
}

/* ---------- Thối tiền ---------- */
const MG_GOODS=[['Mì ly',8000],['Nước suối',6000],['Bánh snack',12000],['Sữa tươi',12000],['Cà phê lon',18000],['Cơm hộp',30000],
  ['Bánh mì',15000],['Kẹo cao su',3000],['Trà xanh',11000],['Xúc xích',9000],['Khăn giấy',7000],['Kem que',5000]];
const MG_PAY=[20000,50000,100000,200000];
/* 3 khách: 1–3 món, tổng tiền, tiền khách đưa (tờ nhỏ nhất lớn hơn tổng) */
function mgCustomers(rand){
  const out=[];
  for(let k=0;k<3;k++){
    const n=1+Math.floor(rand()*3),pool=[...MG_GOODS],items=[];
    for(let i=0;i<n;i++)items.push(pool.splice(Math.floor(rand()*pool.length),1)[0]);
    const total=items.reduce((a,[,p])=>a+p,0);
    const ok=MG_PAY.filter(v=>v>total),paid=ok[Math.min(ok.length-1,Math.floor(rand()*2))];
    out.push({items,total,paid});
  }
  return out;
}
const mgChangeOk=(c,given)=>given.reduce((a,v)=>a+v,0)===c.paid-c.total;
/* kết quả theo số khách thối đúng; bỏ qua hoặc không chơi thì lấy mức trung bình */
function mgChangeResult(n){return n>=3?{gain:20000,tt:3,praise:true}:n===2?{gain:10000}:{tt:-2}}
const MG_CHANGE_AVG={gain:10000};

/* ---------- Canh lửa ---------- */
const MG_STEPS=['Xào rau','Chiên trứng','Nêm nếm'];
const MG_ZONE=0.25;                  // vùng xanh rộng 25% thanh
const mgZone=rand=>0.08+rand()*(1-MG_ZONE-0.16);
const mgFireHit=(pos,z)=>pos>=z&&pos<=z+MG_ZONE;
function mgCookResult(h){return h>=3?{tt:3,no:4}:h===0?{burnt:true}:{}}
const MG_COOK_AVG={};
const MG_BURNT='Món trứng hơi khét, nhưng vẫn ăn hết sạch.';

/* ---------- giao diện ---------- */
const mgReduce=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const MG_TXT={
  change:{t:'Thối tiền',h:'Bấm tờ tiền để thối lại cho khách, rồi bấm Đưa tiền.'},
  cook:{t:'Canh lửa',h:'Bấm Dừng (hoặc phím Space) khi vạch nằm trong vùng xanh.'},
};
let mgCur=null;   // {e, type, st, timer, anim, done}
/* e: {kind:'mg', type, done(result|null)}; null là bỏ qua */
function mgNew(type,done){
  const st=type==='change'?{cs:mgCustomers(Math.random),i:0,given:[],res:[]}:{step:0,hits:[],zone:mgZone(Math.random),pos:0,dir:1,res:[]};
  return {kind:'mg',type,title:MG_TXT[type].t,choices:[],st,done};
}
function mgTimeLeft(){if(!mgCur||mgReduce())return null;return Math.max(0,Math.ceil((mgCur.end-performance.now())/1000))}
function mgBody(){
  const e=mgCur.e,st=e.st;
  if(e.type==='change'){
    if(mgCur.fin)return mgFinHTML();
    const c=st.cs[st.i],sum=st.given.reduce((a,v)=>a+v,0);
    const dots=st.cs.map((_,k)=>`<i class="${k<st.res.length?(st.res[k]?'ok':'no'):k===st.i?'cur':''}"></i>`).join('');
    return `<div class="mg-cust"><div class="mg-k">Khách ${st.i+1}/3 <span class="mg-dots">${dots}</span></div>
      <ul class="mg-items">${c.items.map(([n,p])=>`<li><span>${n}</span><b>${fmt(p)}</b></li>`).join('')}</ul>
      <div class="mg-sum"><span>Tổng</span><b>${fmt(c.total)}</b></div><div class="mg-sum"><span>Khách đưa</span><b>${fmt(c.paid)}</b></div>
      <div class="mg-sum give"><span>Đang thối</span><b>${fmt(sum)}</b></div>
      <div class="mg-given">${st.given.map(v=>`<img class="px" src="${Money.url(v)}" alt="${fmt(v)}">`).join('')}</div></div>
      <div class="mg-notes">${Money.VALUES.map((v,k)=>`<button type="button" class="mg-note" data-note="${v}"><img class="px" src="${Money.url(v)}" alt=""><span>${v>=1000?v/1000+'k':v}</span><kbd>${k+1}</kbd></button>`).join('')}</div>
      <div class="mg-acts"><button class="btns" type="button" data-mg="clear">Xóa <kbd>⌫</kbd></button><button class="btnp" type="button" data-mg="give">Đưa tiền <kbd>Enter</kbd></button></div>`;
  }
  if(mgCur.fin)return mgFinHTML();
  const steps=MG_STEPS.map((n,k)=>`<li class="${k<st.res.length?(st.res[k]?'ok':'no'):k===st.step?'cur':''}">${n}</li>`).join('');
  return `<ol class="mg-steps">${steps}</ol><div class="mg-bar"><i class="z" style="left:${st.zone*100}%;width:${MG_ZONE*100}%"></i><i class="m" id="mgMark" style="left:${st.pos*100}%"></i></div>
    <div class="mg-acts"><button class="btnp big" type="button" data-mg="stop">Dừng <kbd>Space</kbd></button></div>`;
}
function mgFinHTML(){const r=mgCur.fin;return `<p class="mg-fin">${r.txt}</p>`}
function mgHTML(){
  const e=mgCur.e,T=MG_TXT[e.type],tl=mgTimeLeft();
  return `<div class="mg-h"><h2 id="mgT">${T.t}</h2><span class="mg-time" id="mgTime">${tl===null?'Không giới hạn':tl+' giây'}</span><button class="btns" type="button" data-mg="skip">Bỏ qua</button></div>
    <p class="mg-hint">${T.h}</p><div class="mg-b" id="mgB">${mgBody()}</div>`;
}
function mgRender(){const w=document.getElementById('win');if(!w||!mgCur)return;const b=document.getElementById('mgB');if(b)b.innerHTML=mgBody();else w.innerHTML=mgHTML()}
/* bắt đầu: gọi sau khi khung cửa sổ đã có HTML */
function mgMount(e){
  mgCur={e,end:performance.now()+MG_TIME[e.type]*1000,fin:null};
  clearInterval(MG.timer);clearInterval(MG.anim);
  MG.timer=setInterval(()=>{if(!mgCur||mgCur.fin)return;const tl=mgTimeLeft(),el=document.getElementById('mgTime');if(el&&tl!==null)el.textContent=tl+' giây';if(tl===0)mgTimeout()},200);
  if(e.type==='cook'){const per=mgReduce()?2400:1100;let last=performance.now();
    MG.anim=setInterval(()=>{const now=performance.now(),st=e.st;if(!mgCur||mgCur.fin)return;st.pos+=st.dir*(now-last)/per;last=now;
      if(st.pos>=1){st.pos=1;st.dir=-1}if(st.pos<=0){st.pos=0;st.dir=1}const m=document.getElementById('mgMark');if(m)m.style.left=(st.pos*100)+'%'},30)}
}
function mgResult(){
  const e=mgCur.e,st=e.st;
  if(e.type==='change'){const n=st.res.filter(Boolean).length,r=mgChangeResult(n);
    return {...r,n,txt:`Thối đúng ${n}/3 khách.`+(r.gain?` Thưởng ${fmt(r.gain)}.`:'')+(r.tt<0?' Tinh thần −2.':'')+(r.praise?' Chị Mai khen.':'')}}
  const n=st.res.filter(Boolean).length,r=mgCookResult(n);
  return {...r,n,txt:`Trúng ${n}/3 bước.`+(r.tt?' Tinh thần +3, no +4.':'')+(r.burnt?' '+MG_BURNT:'')};
}
function mgEnd(skip){
  if(!mgCur||mgCur.fin)return;clearInterval(MG.anim);
  if(skip){const e=mgCur.e;mgCur=null;clearInterval(MG.timer);e.done(null);return}
  mgCur.fin=mgResult();mgRender();if(typeof sfx==='function')sfx(mgCur.fin.n>=2?'questDone':'statDown');
  const e=mgCur.e,r=mgCur.fin;setTimeout(()=>{if(mgCur&&mgCur.e===e){mgCur=null;clearInterval(MG.timer);e.done(r)}},1300);
}
function mgTimeout(){const st=mgCur.e.st;if(mgCur.e.type==='change')while(st.res.length<3)st.res.push(false);else while(st.res.length<3)st.res.push(false);mgEnd(false)}
function mgDo(cmd,arg){
  if(!mgCur||mgCur.fin)return;const e=mgCur.e,st=e.st;
  if(cmd==='skip'){mgEnd(true);return}
  if(e.type==='change'){
    if(cmd==='note'){if(st.given.length<12){st.given.push(arg);if(typeof sfx==='function')sfx('coinOut')}}
    if(cmd==='clear')st.given=[];
    if(cmd==='give'){st.res.push(mgChangeOk(st.cs[st.i],st.given));st.given=[];st.i++;if(typeof sfx==='function')sfx(st.res[st.res.length-1]?'register':'statDown');if(st.i>=3){mgEnd(false);return}}
    mgRender();return;
  }
  if(cmd==='stop'){st.res.push(mgFireHit(st.pos,st.zone));if(typeof sfx==='function')sfx(st.res[st.res.length-1]?'statUp':'statDown');
    st.step++;if(st.step>=3){mgEnd(false);return}st.zone=mgZone(Math.random);st.pos=0;st.dir=1;mgRender()}
}
function mgClick(t){
  const n=t.closest('[data-note]');if(n){mgDo('note',+n.dataset.note);return true}
  const b=t.closest('[data-mg]');if(b){mgDo(b.dataset.mg);return true}
  return false;
}
function mgKey(ev){
  if(!mgCur)return;const e=mgCur.e;
  if(ev.key==='Escape'){ev.preventDefault();mgDo('skip');return}
  if(e.type==='change'){const k=+ev.key;if(k>=1&&k<=Money.VALUES.length){ev.preventDefault();mgDo('note',Money.VALUES[k-1])}
    else if(ev.key==='Backspace'){ev.preventDefault();mgDo('clear')}else if(ev.key==='Enter'){ev.preventDefault();mgDo('give')}return}
  if(ev.key===' '||ev.key==='Enter'){ev.preventDefault();mgDo('stop')}
}
