/* 30 Ngày Sài Gòn · chọn bố cục theo kích thước màn hình (CLAUDE-CODE-DIEN-THOAI.md mục 2).
 * Gắn đúng một lớp lên <html>: lay-desktop (khung 16:9 như cũ), lay-portrait (điện thoại cầm dọc, phương án A),
 * lay-landscape (điện thoại nằm ngang, phương án B). Không dùng (pointer:coarse) vì trình duyệt trong Zalo, Messenger báo sai.
 * Chỉ đổi lớp CSS và kích thước canvas, không đụng trạng thái game nên xoay máy giữa chừng không mất gì.
 * Hàm pick() và box() là hàm thuần để test trong Node. */
const Layout=(()=>{
const NAMES=['desktop','portrait','landscape'];
/* quy tắc mục 2 */
function pick(w,h){
  if(w<h&&w<=600)return 'portrait';
  if(w>h&&h<=500)return 'landscape';
  return 'desktop';
}
/* cảnh 320×180 "phủ kín và giữ tâm" (design/14 sceneBox): tỉ lệ đủ phủ kín vùng w×h,
 * điểm focus (0..1 theo bề ngang cảnh) nằm giữa vùng nếu không lộ mép. Trả kích thước và vị trí canvas tính bằng px. */
function box(w,h,focus=.46){
  const k=Math.max(w/320,h/180),cw=320*k,ch=180*k;
  const left=Math.min(0,Math.max(w-cw,w*.5-320*focus*k));
  return {k,w:cw,h:ch,left,top:(h-ch)/2};
}
/* điểm chạm (tọa độ màn hình) → điểm ảnh cảnh 320×180, dùng khung thật của canvas nên đúng với mọi cách co giãn */
function toScene(cv,clientX,clientY){
  const r=cv.getBoundingClientRect(),fit=getComputedStyle(cv).objectFit;
  let k=r.width/320,ox=0,oy=0;
  if(fit==='cover'||fit==='contain'){k=(fit==='cover'?Math.max:Math.min)(r.width/320,r.height/180);ox=(r.width-320*k)/2;oy=(r.height-180*k)/2}
  return {x:(clientX-r.left-ox)/k,y:(clientY-r.top-oy)/k};
}

let cur=null;const subs=[];
const size=()=>{const v=typeof window!=='undefined'&&window.visualViewport;
  return v&&v.width?{w:Math.round(v.width),h:Math.round(v.height)}:{w:window.innerWidth,h:window.innerHeight}};
const is=n=>cur===n,phone=()=>cur==='portrait'||cur==='landscape';
/* tâm nhân vật theo cảnh (phòng trọ: nhân vật đứng ở x=148); bố cục ngang lệch về trái một chút như design/14 */
const FOCUS={portrait:.46,landscape:.44};
function fitScene(){
  const cv=document.getElementById('scene'),host=document.getElementById('scn');if(!cv||!host)return;
  if(!phone()){cv.style.cssText='';return}
  const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  const b=box(w,h,FOCUS[cur]);
  cv.style.cssText=`width:${b.w}px;height:${b.h}px;left:${b.left}px;top:${b.top}px`;
}
/* đang gõ chữ (bàn phím ảo mở) thì vùng nhìn thấy thấp hẳn đi: máy 360×640 còn khoảng 360×340 và sẽ bị đổi sang
 * bố cục ngang giữa lúc nhập tên. Giữ nguyên bố cục khi đang gõ và thêm HOLD_MS sau khi rời ô nhập: bấm nút Tạo nhân vật làm ô tên
 * mất focus trong lúc bàn phím chưa kịp đóng, đổi bố cục lúc đó sẽ dời nút đi và cú bấm bị trượt. */
const HOLD_MS=700;let typedAt=-1e9;
const typing=()=>{const a=document.activeElement;return !!a&&(a.tagName==='INPUT'&&!/^(radio|checkbox|range|button|submit)$/.test(a.type)||a.tagName==='TEXTAREA'||a.isContentEditable)};
function apply(){
  const now=Date.now();if(typing())typedAt=now;
  const {w,h}=size(),root=document.documentElement,n=cur&&now-typedAt<HOLD_MS?cur:pick(w,h);
  if(n!==cur){NAMES.forEach(x=>root.classList.toggle('lay-'+x,x===n));const old=cur;cur=n;subs.forEach(f=>{try{f(n,old)}catch(e){console.error(e)}})}
  fitScene();debugInfo();
}
const on=f=>subs.push(f);

/* khung 16:9 trên máy tính: trình duyệt không hỗ trợ đơn vị cqw thì tính --p bằng JS (đề bài giao diện mobile: fitStage) */
const noCq=typeof CSS!=='undefined'&&CSS.supports&&!CSS.supports('width','1cqw');
function fitStage(){
  const st=document.getElementById('stage');if(!st||!noCq)return;
  if(cur==='desktop')st.style.setProperty('--p',st.clientWidth/640+'px');else st.style.removeProperty('--p');
}
on(()=>fitStage());

/* ?debug=layout: viền các vùng, in kích thước vùng nhìn thấy, vùng an toàn và lớp bố cục */
const dbg=typeof location!=='undefined'&&/[?&]debug=([^&]*)/.exec(location.search);
const debug=dbg?dbg[1].split(','):[];
function debugInfo(){
  if(!debug.includes('layout'))return;
  let el=document.getElementById('dbgLay');
  if(!el){document.documentElement.classList.add('dbg-layout');el=document.createElement('div');el.id='dbgLay';el.setAttribute('aria-hidden','true');document.body.appendChild(el)}
  const p=document.createElement('div');p.style.cssText='position:fixed;visibility:hidden;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
  document.body.appendChild(p);const c=getComputedStyle(p),sa=[c.paddingTop,c.paddingRight,c.paddingBottom,c.paddingLeft].map(parseFloat).join('/');p.remove();
  const {w,h}=size();el.textContent=`lay-${cur} · ${w}×${h} · an toàn ${sa}${noCq?' · không cqw':''}`;
}

if(typeof window!=='undefined'&&window.addEventListener&&typeof document!=='undefined'&&document.documentElement){
  addEventListener('resize',apply);addEventListener('orientationchange',apply);
  if(window.visualViewport&&window.visualViewport.addEventListener)window.visualViewport.addEventListener('resize',apply);
  addEventListener('resize',fitStage);
  addEventListener('focusin',()=>{if(typing())typedAt=Date.now()});
  addEventListener('focusout',()=>{if(typing())typedAt=Date.now();setTimeout(apply,HOLD_MS+50)});
  if(typeof ResizeObserver==='function')addEventListener('DOMContentLoaded',()=>{const h=document.getElementById('scn');if(h)new ResizeObserver(fitScene).observe(h)});
}
return {pick,box,toScene,apply,on,fitScene,fitStage,is,phone,debug,get cur(){return cur}};
})();
