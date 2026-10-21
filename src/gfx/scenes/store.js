/* 30 Ngày Sài Gòn · cảnh cửa hàng tiện lợi (design/06): gian hàng shop (state 0 chưa phỏng vấn, 1 đang phỏng vấn, 2 đã nhận việc) và cảnh làm ca shift */
(()=>{
const {W,H,BAYER,rng,mk,R,P,shade,dith,outlined,canopy,LEAF,chars,textW,text,sign}=GFX;
const {K,LOOK,spr,drawPerson,backBust,student,sitter,SIT,SITF,WALKERS,walker,heroAt}=Chars;
/* ---------- Đồng phục và nhân vật ở cửa hàng ---------- */
const UNI={sh:'#3f9a5a',shD:'#2f7a46',shL:'#6aca8a',col:'#e8f4ea'};
Object.assign(LOOK,{
  namU:{tag:1,c:UNI},
  nuU:{hair:'long',clip:'#ffc94d',lash:1,skirt:1,tag:1,c:UNI},
  nuUP:{hair:'long',clip:'#ffc94d',lash:1,tag:1,c:UNI},
  mai:{hair:'pony',tieC:'#3f9a5a',lash:1,tag:1,clipboard:1,c:{...UNI,h:'#2a1a12',hD:'#170e0a',hL:'#5a3a28',hR:'#7a4a30',sk:'#eebc94',skD:'#cc9670',skL:'#fad4b0',pa:'#2c3550'}},
});
// bổ sung vào hàm vẽ người: bảng tên, búi tóc, bìa kẹp hồ sơ, mắt mệt
Chars.decorate(function(base,o,blink,b){if(!o.tag&&!o.bun&&!o.clipboard&&!o.tired)return base;
  const c=mk(30,54),x=c.getContext('2d');x.drawImage(base,0,0);const keep=GFX.ctx();GFX.use(x);const cc=15;
  if(o.tag){R(cc+2,28+b,4,2,'#f4f1ea');R(cc+2,30+b,4,1,'#d8d2c8');P(cc+2,28+b,'#3f9a5a')}
  if(o.bun){R(cc-3,0+b,6,4,'#2a1a12');R(cc-2,0+b,3,1,'#5a3a28');R(cc-4,3+b,8,1,'#1a100a')}
  if(o.clipboard){R(cc-12,29+b,7,9,'#8a5a36');R(cc-11,30+b,5,7,'#f4f1ea');R(cc-10,29+b,3,1,'#c8c8d0');R(cc-10,32+b,3,1,'#9a9aa8');R(cc-10,34+b,3,1,'#9a9aa8')}
  if(o.tired){const y=3+b;[cc-5,cc+2].forEach(xx=>{R(xx,y+11,3,1,'#cfa080');R(xx,y+12,3,1,'#241a2a')})}
  GFX.use(keep);return c;
});
LOOK.namUt={...LOOK.namU,tired:1};LOOK.nuUt={...LOOK.nuU,tired:1};LOOK.nuUPt={...LOOK.nuUP,tired:1};
// khách nhìn từ phía sau, đứng ở quầy
function backPerson(o){
  return outlined(30,54,()=>{const c=15;
    R(c-6,48,5,4,'#2a2a34');R(c+1,48,5,4,'#2a2a34');
    if(o.skirt){R(c-5,40,4,8,'#e0b490');R(c+1,40,4,8,'#c99a78');R(c-8,36,16,6,o.b)}else{R(c-6,38,12,10,o.b);R(c-1,42,1,6,'rgba(0,0,0,.3)')}
    R(c-7,24,14,15,o.top);R(c-7,24,2,15,'rgba(255,255,255,.3)');R(c+5,24,2,15,'rgba(0,0,0,.2)');
    R(c-10,25,3,11,o.top);R(c+7,25,3,11,o.top);R(c-10,34,3,3,'#e8b890');R(c+7,34,3,3,'#c99a78');
    if(o.bag){R(c-6,25,12,12,o.bag);R(c-6,25,12,1,'rgba(255,255,255,.35)');R(c-4,30,8,5,'rgba(0,0,0,.18)')}
    R(c-2,21,4,3,'#c99a78');
    R(c-7,4,14,17,o.h);R(c-6,3,12,1,o.h);R(c-8,7,1,10,o.h);R(c+7,7,1,10,o.h);
    if(o.long){R(c-8,10,16,16,o.h)}
    R(c-6,5,4,3,'rgba(255,255,255,.15)');R(c+3,6,4,14,'rgba(0,0,0,.2)');
    R(c-9,11,2,4,'#e8b890');R(c+7,11,2,4,'#c99a78');
    if(o.helmet){R(c-8,2,16,9,o.helmet);R(c-7,1,14,1,o.helmet);R(c-6,3,5,2,'rgba(255,255,255,.4)')}
  });
}
const CUST=[backPerson({h:'#1e1612',top:'#e06a5a',b:'#3b4560',helmet:'#4f7fd0'}),backPerson({h:'#2a1a12',top:'#f4f1ea',b:'#3a4a70',skirt:1,long:1,bag:'#e8c27a'})];

/* ---------- Khung cửa kính: phố bên ngoài theo buổi ---------- */
const SKY4=[['#9cc8ee','#bcdcf2','#e2eef2'],['#7cb6ec','#a0cdf2','#cfe6f4'],['#e89a7a','#f2b884','#f8d89a'],['#141838','#1e2450','#2a2f60']];
function street(x0,y0,w,h,slot,ctx){
  const keep=GFX.ctx();GFX.use(ctx);const night=slot===3;
  for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)P(x,y,shade((y-y0)/(h*.55),SKY4[slot],x,y));
  // nhà bên kia đường
  const bc=night?['#2a2a44','#34345a']:['#d8c09a','#c8a880'];
  R(x0,y0+h*.3,w,h*.4,bc[0]);for(let x=x0+4;x<x0+w-4;x+=10){R(x,y0+h*.36,6,6,night?'#ffd47a':'#8a9ab8');R(x,y0+h*.52,6,6,night?(x%20?'#3a3a5a':'#ffcf7a'):'#8a9ab8')}
  R(x0,y0+h*.3,w,2,bc[1]);
  // vỉa hè, xe máy dựng
  R(x0,y0+h*.7,w,h*.3,night?'#3a3850':'#b8aaa0');R(x0,y0+h*.7,w,1,night?'#4a4862':'#d0c4ba');
  [[x0+6,'#d65a5a'],[x0+30,'#4f7fd0']].forEach(([x,col])=>{const y=y0+h*.86;R(x,y,16,4,col);R(x+10,y-4,6,4,col);R(x+2,y+3,4,4,'#14141a');R(x+12,y+3,4,4,'#14141a');R(x+3,y-2,7,2,'#2a2a34')});
  if(night){R(x0+w-10,y0+4,2,h*.66,'#2a2840');R(x0+w-14,y0+4,6,2,'#2a2840');dith(x0+w-24,y0+6,22,h*.66,'#ffd98a',.08)}
  GFX.use(keep);
}

/* =================== A. Gian hàng =================== */
function drawCounterTop(){
  // tủ hấp bánh bao bên trái quầy
  R(74,78,24,14,'#c8ccd6');R(75,79,22,9,'#e8f2f4');for(let k=0;k<3;k++){R(77+k*7,83,6,4,'#f4f1ea');P(79+k*7,82,'#f4f1ea');P(80+k*7,85,'#e85a3a')}R(74,88,24,4,'#9aa0ac');
  // máy tính tiền bên phải quầy
  R(116,82,14,10,'#2c3550');R(117,83,12,5,'#5cc8ff');R(119,85,6,1,'#ffffff');
}
function shopBase(){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(61);
  // tường và trần
  R(0,0,W,H,'#e9ede9');R(0,0,W,10,'#f4f6f6');R(0,10,W,1,'#cfd6d2');
  for(const x of [30,110,190,270]){R(x,3,40,4,'#ffffff');R(x,7,40,1,'#d8e0dc');dith(x-6,8,52,6,'#ffffff',.25)}
  R(0,12,W,8,'#3f9a5a');R(0,12,W,1,'#6aca8a');R(0,19,W,1,'#2f7a46');
  text('TIỆN LỢI 24H',156-textW('TIỆN LỢI 24H')/2,14,'#ffffff');
  // kệ hàng dọc tường sau
  const sx=134,sw=102;R(sx,30,sw,88,'#c8ccd2');R(sx,30,sw,2,'#e2e6ea');
  const rows=[['snack',38],['snack',56],['mi',74],['lon',92],['sua',108]];
  rows.forEach(([kind,y])=>{R(sx+2,y+12,sw-4,2,'#9aa0a8');R(sx+2,y+14,sw-4,2,'#ffc94d');
    let x=sx+4;while(x<sx+sw-6){
      if(kind==='snack'){const col=['#e85a3a','#ffc94d','#4f7fd0','#3f9a5a','#c9a0e8','#ff86b3'][Math.floor(r()*6)];R(x,y+3,7,9,col);R(x+1,y+2,5,1,col);R(x+1,y+5,5,2,'rgba(255,255,255,.4)');x+=8}
      else if(kind==='mi'){const col=['#e85a3a','#ffc94d','#3f9a5a'][Math.floor(r()*3)];R(x,y+4,9,8,col);R(x+1,y+6,7,3,'#f4f1ea');R(x+3,y+7,3,1,'#c8901e');x+=10}
      else if(kind==='lon'){R(x,y+5,4,7,['#8a5a36','#e6aa2c','#d65a3a','#4f7fd0'][Math.floor(r()*4)]);R(x,y+5,4,1,'#d8d8e0');x+=5}
      else{R(x,y+3,6,9,'#f4f1ea');R(x,y+3,6,2,['#4f7fd0','#3f9a5a','#e6aa2c'][Math.floor(r()*3)]);R(x+1,y+1,4,2,'#f4f1ea');x+=7}
    }});
  // tủ đồ uống kính bên phải
  const fx=240;R(fx,22,78,98,'#2c3550');
  for(let d=0;d<3;d++){const x=fx+3+d*25;R(x,25,23,92,'#d8eef4');for(let k=0;k<5;k++){const y=30+k*17;R(x+1,y+13,21,1,'#9ab0c0');
      for(let b=0;b<5;b++){const col=['#5cc8ff','#72de90','#ffb057','#f4f1ea','#ff86b3'][(b+k+d)%5];R(x+2+b*4,y+3,3,10,col);R(x+3+b*4,y+1,1,2,'#c8c8d0');R(x+2+b*4,y+3,1,10,'rgba(255,255,255,.5)')}}
    R(x+20,60,2,14,'#9aa0a8');dith(x,25,23,92,'#ffffff',.08)}
  // cửa kính và phố bên ngoài được vẽ theo buổi ở lớp riêng
  R(0,20,72,104,'#2f7a46');R(2,22,68,100,'#000000');
  // quầy thu ngân
  R(72,96,60,30,'#3f9a5a');R(72,96,60,2,'#6aca8a');R(72,92,60,4,'#e8ece8');R(72,92,60,1,'#ffffff');R(74,104,56,1,'#2f7a46');
  text('THU NGÂN',102-textW('THU NGÂN')/2,108,'#ffffff');
  drawCounterTop();
  // biển cơm hộp treo trần, lò vi sóng sau quầy
  R(76,34,52,13,'#e85a3a');R(76,34,52,1,'#ff8a6a');text('CƠM HỘP 30K',102-textW('CƠM HỘP 30K')/2,38,'#ffffff');R(90,24,1,10,'#9aa0a8');R(114,24,1,10,'#9aa0a8');
  R(80,56,20,12,'#d8dce4');R(82,58,12,8,'#2c3550');R(96,59,2,2,'#72de90');R(102,58,22,8,'#c9a878');R(102,58,22,1,'#e2c49a');
  // sàn gạch trắng bóng
  for(let y=124;y<H;y++)for(let x=0;x<W;x++){const t=((x>>4)+((y-124)>>3))%2;P(x,y,t?'#f2f4f4':'#e6eaea');if((y-124)%8===0||x%16===0)P(x,y,'#d4dada')}
  for(const x of [50,130,210,290])for(let y=126;y<H;y+=2)R(x-6,y,12,1,'rgba(255,255,255,.35)');
  // giỏ mua hàng
  R(74,130,18,8,'#e85a3a');R(74,128,18,2,'#ff8a6a');for(let k=0;k<3;k++)R(76+k*5,132,3,4,'#c8463c');
  return c;
}
function shopDoor(slot,poster){
  const c=mk(),x=c.getContext('2d');street(2,22,68,100,slot,x);GFX.use(x);
  R(24,22,2,100,'#2f7a46');R(46,22,2,100,'#2f7a46');R(36,70,2,10,'#d8dce4');R(32,70,2,10,'#d8dce4');
  dith(2,22,68,100,'#ffffff',slot===3?.03:.1);R(8,26,14,1,'rgba(255,255,255,.6)');R(10,28,8,1,'rgba(255,255,255,.4)');
  text('MỞ CỬA 24/7',8,112,slot===3?'#ffc94d':'#2f7a46');
  if(poster){R(26,38,20,26,'#ffc94d');R(26,38,20,2,'#e85a3a');text('TUYỂN',28,43,'#2c3550');text('NHÂN',29,51,'#2c3550');text('VIÊN',29,58,'#e85a3a')}
  if(slot===3){GFX.use(x);R(0,20,72,104,'rgba(0,0,0,0)')}
  return c;
}
/* =================== B. Sau quầy thu ngân (làm ca) =================== */
function counterBase(){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(71);
  R(0,0,W,H,'#e9ede9');R(0,0,W,8,'#f4f6f6');for(const x of [60,200]){R(x,2,60,4,'#ffffff');dith(x-6,6,72,6,'#ffffff',.22)}
  R(0,8,W,6,'#3f9a5a');R(0,8,W,1,'#6aca8a');
  // bảng lịch ca bên trái
  R(10,20,92,62,'#5a3a28');R(12,22,88,58,'#f4f1ea');text('LỊCH CA TUẦN',16,26,'#3f9a5a');R(14,33,84,1,'#c8c0b4');
  ['T2','T3','T4','T5','T6','T7','CN'].forEach((d,i)=>text(d,34+i*9,37,'#2c3550'));
  // kệ phía sau: máy pha cà phê, mì, đồ dùng
  R(112,24,84,58,'#c8ccd2');[40,58].forEach(y=>{R(114,y+12,80,2,'#9aa0a8');R(114,y+14,80,2,'#ffc94d')});
  let x=116;while(x<190){const col=['#e85a3a','#ffc94d','#3f9a5a'][Math.floor(r()*3)];R(x,44,8,8,col);R(x+1,46,6,3,'#f4f1ea');x+=9}
  x=116;while(x<190){R(x,63,5,7,['#8a5a36','#e6aa2c','#d65a3a','#4f7fd0'][Math.floor(r()*4)]);R(x,63,5,1,'#d8d8e0');x+=6}
  R(116,26,24,12,'#2c3550');R(118,28,8,6,'#5a5a68');R(130,28,8,3,'#d65a3a');
  // máy pha cà phê bên phải
  R(206,30,26,36,'#3a3a48');R(208,32,22,12,'#5a5a68');R(212,34,14,6,'#72de90');R(214,50,10,8,'#2a2a34');R(216,58,6,6,'#f4f1ea');R(208,44,22,2,'#9aa0a8');
  R(236,40,22,26,'#f4f1ea');for(let k=0;k<4;k++)R(238+k*5,44,4,20,'#e8e2d4');text('CÀ PHÊ',236,32,'#8a5a36');
  // cửa sổ bên phải (phố bên ngoài vẽ theo ca)
  R(266,18,52,70,'#2f7a46');R(268,20,48,66,'#000000');
  // đồng hồ treo
  for(let y=-5;y<=5;y++)for(let xx=-5;xx<=5;xx++){const d=Math.hypot(xx,y);if(d<5.5)P(108+xx,90+y,d>4.4?'#2c3550':'#f4f1ea')}
  return c;
}
function counterFront(){
  const c=mk();GFX.use(c.getContext('2d'));
  R(30,110,260,4,'#e8ece8');R(30,110,260,1,'#ffffff');R(30,114,260,40,'#3f9a5a');R(30,114,260,2,'#6aca8a');R(30,152,260,2,'#2f7a46');
  R(30,124,260,8,'#2f7a46');text('TIỆN LỢI 24H',160-textW('TIỆN LỢI 24H')/2,126,'#ffffff');
  // máy tính tiền, máy quét, túi ni lông
  R(166,94,30,16,'#2c3550');R(168,96,26,9,'#1a2a3a');text('45.000',170,98,'#72de90');R(176,106,10,4,'#3a3a48');
  R(200,100,8,10,'#2a2a34');R(201,101,6,3,'#e85a3a');dith(194,104,10,6,'#ff6474',.25);
  R(92,102,14,8,'#f4f1ea');R(94,99,2,4,'#f4f1ea');R(102,99,2,4,'#f4f1ea');
  // tủ hấp bánh bao trên quầy
  R(216,88,30,22,'#c8ccd6');R(217,89,28,15,'#e8f2f4');for(let k=0;k<4;k++){R(219+k*7,96,6,5,'#f4f1ea');P(221+k*7,95,'#f4f1ea');P(222+k*7,98,'#e85a3a')}R(216,104,30,6,'#9aa0ac');
  // kệ kẹo trước quầy
  R(62,100,22,10,'#c8ccd2');for(let k=0;k<4;k++)R(64+k*5,101,4,8,['#ff86b3','#ffc94d','#72de90','#5cc8ff'][k]);
  return c;
}
function counterWindow(slot){const c=mk(),x=c.getContext('2d');street(268,20,48,66,slot,x);GFX.use(x);dith(268,20,48,66,'#ffffff',slot===3?.03:.1);return c}

/* ---------- Ghép cảnh ---------- */
let B=null;
function build(){B={shop:shopBase(),door:{},counter:counterBase(),front:counterFront(),win:{}}}
const door=(s,p)=>B.door[s+'-'+p]||(B.door[s+'-'+p]=shopDoor(s,p));
const cwin=s=>B.win[s]||(B.win[s]=counterWindow(s));
function scheduleNames(ctx,name,shift){
  GFX.use(ctx);const given=((name||'Minh').trim().split(/\s+/).pop()||'Minh').toUpperCase().slice(0,5);
  const rowsN=[['MAI',[1,1,1,1,1,0,0]],[given,[0,0,1,0,1,1,1]],['TUẤN',[1,1,0,1,0,1,0]]];
  rowsN.forEach(([n,days],i)=>{const y=46+i*10;text(n,15,y,i===1?'#e85a3a':'#2c3550');days.forEach((d,j)=>{if(d)R(34+j*9,y-1,7,7,i===1?'#ffc94d':'#c8e8d0')});R(14,y+7,84,1,'#e8e2d4')});
  // tô sáng ca đang làm
  R(33+5*9,55,9,9,'rgba(0,0,0,0)');const j=shift===0?5:2;R(33+j*9,55,1,9,'#e85a3a');R(41+j*9,55,1,9,'#e85a3a');R(33+j*9,55,9,1,'#e85a3a');R(33+j*9,63,9,1,'#e85a3a');
  text(['CA SÁNG','CA CHIỀU','CA TỐI'][shift],16,76-2,'#3f9a5a');
}
function clockHands(ctx,shift){GFX.use(ctx);const [hx,hy]=[[108,86],[112,90],[104,92]][shift];R(108,86,1,4,'#2c3550');P(hx,hy,'#d6453a');P((108+hx)>>1,(90+hy)>>1,'#d6453a')}
function frame(ctx,scene,t,o={}){
  if(!B)build();const anim=o.animate!==false;ctx.imageSmoothingEnabled=false;GFX.use(ctx);
  const female=o.gender==='nu';
  if(scene==='shop'){
    const slot=o.slot||0,st=o.state||0;
    ctx.drawImage(B.shop,0,0);ctx.drawImage(door(slot,st===0?1:0),0,0);
    // chị Mai đứng quầy, hoặc ra phỏng vấn
    if(st===1){drawPerson(ctx,'mai',212,164,t,anim,true)}else{drawPerson(ctx,'mai',104,121,t,anim);GFX.use(ctx);R(72,92,60,4,'#e8ece8');R(72,92,60,1,'#ffffff');R(72,96,60,30,'#3f9a5a');R(72,96,60,2,'#6aca8a');R(74,104,56,1,'#2f7a46');text('THU NGÂN',102-textW('THU NGÂN')/2,108,'#ffffff');drawCounterTop()}
    // khách đang chọn đồ uống
    const wi=anim?Math.floor(t/700)%2:0;ctx.drawImage(walker(2,wi*2),262,92);
    // đã nhận việc thì mặc đồng phục khi ở cửa hàng
    const who=st===2?(female?(o.uniform==='quan'?'nuUP':'nuU'):'namU'):(female?'nu':'nam');
    heroAt(ctx,o,st===1?170:180,166,t,anim);
    if(anim){GFX.use(ctx);const ph=(t/1400)%1;for(let k=0;k<3;k++){const y=Math.round(76-ph*8-k*2),xx=79+k*7+Math.round(Math.sin(ph*6+k));if(ph<.8)P(xx,y,'rgba(255,255,255,.8)')}}
  }
  if(scene==='shift'){
    const sh=o.shift||0,slot=[0,2,3][sh];
    ctx.drawImage(B.counter,0,0);ctx.drawImage(cwin(slot),0,0);scheduleNames(ctx,o.name,sh);clockHands(ctx,sh);
    drawPerson(ctx,'mai',282,124,t,anim,true);
    const key=(female?(o.uniform==='quan'?'nuUP':'nuU'):'namU')+(sh===2?'t':'');
    heroAt(ctx,o,132,124,t,anim);
    ctx.drawImage(B.front,0,0);
    // khách xếp hàng ở quầy (nhìn từ phía sau)
    const n=sh===2?1:2;for(let i=0;i<n;i++)ctx.drawImage(CUST[i],[182,236][i]-15,180-52+(i?6:0));
    if(anim){GFX.use(ctx);if(Math.floor(t/600)%2)R(201,101,6,3,'#ff6474');const ph=(t/1300)%1;for(let k=0;k<4;k++){const y=Math.round(92-ph*8-(k%2)*2),xx=221+k*7;if(ph<.8)P(xx,y,'rgba(255,255,255,.8)')}}
    if(sh===2&&anim){GFX.use(ctx);const z=(t/1000)%3;if(z<1.2){const y=Math.round(74-z*6);R(146,y,3,1,'#2c3550');P(147,y+1,'#2c3550');R(146,y+2,3,1,'#2c3550')}}
  }
}
Scenes.store=frame;
})();
