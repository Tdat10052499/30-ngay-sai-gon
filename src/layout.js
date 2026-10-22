/* 30 Ngày Sài Gòn · co giãn khung game theo màn hình.
 * Tính kích thước bằng JavaScript, không phụ thuộc container query (cqw, cqh) vì Safari dưới 16, Chrome dưới 105,
 * Samsung Internet cũ và trình duyệt trong Zalo, Messenger, Facebook có thể không hỗ trợ.
 * Đặt lên thẻ html:
 *   --sw, --sh  kích thước khung game (px)          --p   1/640 bề ngang khung (lưới giao diện 640×360)
 *   --cw, --ch  1/100 bề ngang, bề cao khung         --lp  1/280 bề cao khung (cửa sổ trên điện thoại)
 *   --vh        1/100 chiều cao vùng nhìn thấy (dự phòng cho 100dvh)
 *   lớp js-fit (đã tính bằng JS), phone (điện thoại nằm ngang), portrait (điện thoại cầm dọc, hiện nhắc xoay),
 *   portrait-play (chơi dọc), touch (có cảm ứng), short (màn thấp dưới 400px), no-cq (không dùng container query).
 * ?legacy=1 buộc đi nhánh không dùng container query; ?debug=layout hiện bảng thông số ở góc màn hình. */
const Layout=(()=>{
  const root=typeof document!=='undefined'?document.documentElement:null;
  if(!root||!root.classList||typeof window==='undefined')return {fit(){},isPhone:()=>false,allowPortrait(){}};
  const q=new URLSearchParams(location.search||'');
  const LEGACY=q.get('legacy')==='1',DEBUG=q.get('debug')==='layout';
  const CQ=!LEGACY&&typeof CSS!=='undefined'&&!!CSS.supports&&CSS.supports('container-type','size');
  const PORTRAIT_KEY='ba-muoi-ngay-sg-choi-doc';
  let portraitOK=false;try{portraitOK=localStorage.getItem(PORTRAIT_KEY)==='1'}catch(e){}
  const PHONE_SHORT=500;   // cạnh ngắn tối đa của điện thoại (px); máy tính bảng từ 768 dùng bố cục máy tính
  const mq=s=>typeof matchMedia==='function'&&matchMedia(s).matches;
  /* cảm ứng: con trỏ chính là ngón tay, hoặc máy có màn chạm (một số trình duyệt trong app báo sai pointer) */
  const isTouch=()=>mq('(pointer:coarse)')||mq('(any-pointer:coarse)')||('ontouchstart' in window&&(navigator.maxTouchPoints||0)>0);
  function view(){const v=window.visualViewport;return v&&v.width?{w:v.width,h:v.height}:{w:window.innerWidth,h:window.innerHeight}}
  const set=(k,v)=>root.style.setProperty(k,v);
  let last='';
  function fit(){
    const {w,h}=view(),touch=isTouch(),small=touch&&Math.min(w,h)<=PHONE_SHORT,land=w>=h;
    const phone=small&&land,portrait=small&&!land;
    const C=root.classList;
    C.add('js-fit');C.toggle('touch',touch);C.toggle('phone',phone);C.toggle('portrait',portrait&&!portraitOK);
    C.toggle('portrait-play',portrait&&portraitOK);C.toggle('short',phone&&h<400);C.toggle('no-cq',!CQ);C.toggle('legacy',LEGACY);
    let sw,sh;
    if(phone){sw=w;sh=h}
    else{/* khung 16:9 vừa màn hình, chừa viền như .screen (16px hai bên, 10px trên dưới; dọc thì 8px) */
      const px=portrait?16:32,py=portrait?16:20;sw=Math.max(160,Math.min(w-px,(h-py)*16/9));sh=sw*9/16}
    sw=Math.floor(sw);sh=Math.floor(sh);
    const key=[w,h,sw,sh,C.value].join('|');if(key===last)return;last=key;
    set('--vh',h/100+'px');set('--sw',sw+'px');set('--sh',sh+'px');
    set('--p',sw/640+'px');set('--cw',sw/100+'px');set('--ch',sh/100+'px');set('--lp',sh/280+'px');
    if(DEBUG)debug();
    if(typeof window.onLayout==='function')window.onLayout();
  }
  /* bảng gỡ lỗi ?debug=layout: người chơi thử chụp màn hình gửi lại */
  let box=null,probe=null;
  function debug(){
    if(!box){box=document.createElement('pre');box.id='layoutDebug';document.body.appendChild(box);
      probe=document.createElement('div');probe.style.cssText='position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';document.body.appendChild(probe)}
    const v=window.visualViewport,cs=getComputedStyle(probe),r=getComputedStyle(root),st=document.getElementById('stage');
    const sr=st?st.getBoundingClientRect():{width:0,height:0};
    box.textContent=[
      'Vùng nhìn thấy: '+(v?Math.round(v.width)+'×'+Math.round(v.height)+' (visualViewport)':'không có visualViewport'),
      'innerWidth×innerHeight: '+innerWidth+'×'+innerHeight+' · màn hình '+screen.width+'×'+screen.height,
      'devicePixelRatio: '+(window.devicePixelRatio||1),
      'Khung game: '+Math.round(sr.width)+'×'+Math.round(sr.height)+' · --p '+r.getPropertyValue('--p').trim(),
      'Container query: '+(CQ?'có':'không')+(LEGACY?' (đang ép ?legacy=1)':''),
      'Vùng an toàn T/P/D/T: '+[cs.paddingTop,cs.paddingRight,cs.paddingBottom,cs.paddingLeft].join(' '),
      'Chế độ: '+(root.classList.contains('phone')?'điện thoại nằm ngang':root.classList.contains('portrait')?'điện thoại dọc (nhắc xoay)':root.classList.contains('portrait-play')?'chơi dọc':'máy tính')+(isTouch()?' · cảm ứng':' · chuột')+(root.classList.contains('short')?' · màn thấp':''),
      'pointer:coarse '+mq('(pointer:coarse)')+' · ontouchstart '+('ontouchstart' in window)+' · maxTouchPoints '+(navigator.maxTouchPoints||0),
      'Trình duyệt: '+navigator.userAgent.slice(0,120),
    ].join('\n');
  }
  function allowPortrait(){portraitOK=true;try{localStorage.setItem(PORTRAIT_KEY,'1')}catch(e){}last='';fit()}
  let t=0;const later=()=>{clearTimeout(t);t=setTimeout(fit,60);fit()};
  window.addEventListener('resize',later);window.addEventListener('orientationchange',()=>{later();setTimeout(fit,350)});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',later);
  fit();
  return {fit,isPhone:()=>root.classList.contains('phone'),allowPortrait,CQ,LEGACY};
})();
