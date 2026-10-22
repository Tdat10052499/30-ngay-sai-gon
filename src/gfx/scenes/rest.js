/* 30 Ngày Sài Gòn · cảnh cà phê, công viên, TTTM (design/08): cafe, cafeTable (o.variant), park, mall (o.state 1 quà mẹ, 2 giày sale) */
(()=>{
const {W,H,BAYER,rng,mk,R,P,shade,dith,outlined,canopy,LEAF,chars,textW,text,sign}=GFX;
const {K,LOOK,spr,drawPerson,backBust,student,sitter,SIT,SITF,WALKERS,walker,heroAt}=Chars;
/* ---------- Bổ sung nhân vật ---------- */
Chars.decorate(function(base,o,blink,b){if(!o.apronK&&!o.cap&&!o.armsUp)return base;
  const c=mk(30,54),x=c.getContext('2d');x.drawImage(base,0,0);const keep=GFX.ctx();GFX.use(x);const cc=15,C={...K,...(o.c||{})};
  if(o.apronK){R(cc-6,30+b,12,10-b,o.apronK);R(cc-6,30+b,12,1,'rgba(255,255,255,.3)');R(cc-3,26+b,1,4,o.apronK);R(cc+2,26+b,1,4,o.apronK)}
  if(o.cap){R(cc-8,2+b,16,4,o.cap);R(cc-8,2+b,16,1,'rgba(255,255,255,.35)');R(cc+4,5+b,6,2,o.cap)}
  if(o.armsUp){x.clearRect(cc-11,25+b,3,13);x.clearRect(cc+8,25+b,3,13);R(cc-11,10+b,3,15,C.sh);R(cc-11,8+b,3,3,C.sk);R(cc+8,10+b,3,15,C.shD);R(cc+8,8+b,3,3,C.skD)}
  GFX.use(keep);return c});
Object.assign(LOOK,{
  khoa:{c:{h:'#1e1612',hD:'#100b08',hL:'#4a3628',hR:'#6a4a38',sh:'#e06a5a',shD:'#b44a40',shL:'#f8907c',col:'#e06a5a',sk:'#e0ac82',skD:'#b98060',skL:'#f2c49c'}},
  barista:{hair:'side',tuft:false,apronK:'#6a4428',cap:'#2c3550',c:{sh:'#f4f1ea',shD:'#cfc6bc',shL:'#ffffff',col:'#f4f1ea',sk:'#e8b890',skD:'#c99872',skL:'#f6d0ac'}},
  ong:{hair:'side',tuft:false,grey:1,armsUp:1,c:{h:'#c8c4c0',hD:'#9a9690',hL:'#e8e4e0',hR:'#d8d4d0',sh:'#f4f1ea',shD:'#cfc6bc',shL:'#ffffff',col:'#f4f1ea',pa:'#5a5a68',sk:'#e0ac82',skD:'#b98060',skL:'#f2c49c'}},
  ba:{hair:'side',tuft:false,lash:1,armsUp:1,c:{h:'#5a5650',hD:'#3a3630',hL:'#8a8680',hR:'#7a7670',sh:'#c9a0e8',shD:'#a07cc4',shL:'#e4c8ff',col:'#c9a0e8',pa:'#3a3a48',sk:'#e8b890',skD:'#c99872',skL:'#f6d0ac'}},
  bap:{hair:'side',tuft:false,lash:1,cap:'#ffc94d',apronK:'#3f7ac0',c:{sh:'#e85a3a',shD:'#b44a40',shL:'#f8907c',col:'#e85a3a',pa:'#3a3a48',sk:'#d8a078',skD:'#b07c58',skL:'#ecbc94'}},
  nv:{hair:'pony',lash:1,tieC:'#ff86b3',c:{sh:'#2c3550',shD:'#1d2136',shL:'#4a5578',col:'#f4f1ea',pa:'#2c3550'}},
  ngan:{hair:'bob',glasses:'round',lash:1,clip:'#ff86b3',c:{h:'#2a1a12',hD:'#170e0a',hL:'#5a3a28',hR:'#7a4a30',sh:'#f2dc8c',shD:'#d4b860',shL:'#fff0b8',col:'#f4f1ea',pa:'#3a4a70',paD:'#2a3656',paL:'#4a5a84'}},
  meS:{hair:'side',tuft:false,lash:1,c:{h:'#3a2418',hD:'#24150e',hL:'#5a3a28',hR:'#6e4630',sh:'#c97aa8',shD:'#a85a88',shL:'#e8a0c8',col:'#f4e0ec',pa:'#3a3a48',sk:'#eebc94',skD:'#cc9670',skL:'#fad4b0'}},
});
function mini(o,up){return outlined(14,26,()=>{const c=7;
  R(c-3,18,2,6,o.b);R(c+1,18,2,6,o.b);R(c-3,24,3,1,'#2a2a34');R(c+1,24,3,1,'#2a2a34');
  R(c-3,10,6,8,o.top);R(c-3,10,1,8,'rgba(255,255,255,.4)');if(o.apron)R(c-2,13,4,5,o.apron);
  if(up){R(c-5,3,2,7,o.top);R(c+3,3,2,7,o.top);R(c-5,2,2,1,'#f2c7a0');R(c+3,2,2,1,'#f2c7a0')}else{R(c-5,11,2,5,o.top);R(c+3,11,2,5,o.top);R(c-5,16,2,1,'#f2c7a0');R(c+3,16,2,1,'#f2c7a0')}
  R(c-1,9,2,1,'#d09a74');R(c-3,3,6,6,'#f2c7a0');R(c-3,2,6,2,o.h);R(c-4,3,1,4,o.h);R(c+3,3,1,4,o.h);P(c-1,6,'#2a1c14');P(c+1,6,'#2a1c14');
  if(o.cap){R(c-4,1,8,2,o.cap);R(c+3,2,3,1,o.cap)}})}
const EX=[{h:'#c8c4c0',top:'#f4f1ea',b:'#5a5a68'},{h:'#5a5650',top:'#c9a0e8',b:'#3a3a48'},{h:'#d8d4d0',top:'#72de90',b:'#3a3a48'},{h:'#3a3630',top:'#ff86b3',b:'#3a3a48'}];
const EXF=EX.map(o=>[mini(o,false),mini(o,true)]);
const BAPF=mini({h:'#3a2a20',top:'#e85a3a',b:'#3a3a48',cap:'#ffc94d',apron:'#3f7ac0'},false);
const GRADE=[[1,.97,.95],[1.04,1.03,1],[1,.86,.78],[.34,.36,.6]];
const grade=(src,slot)=>GFX.grade(src,slot,GRADE);
function glowBox(x,y,w,h,col,a){for(let j=-4;j<h+4;j++)for(let i=-4;i<w+4;i++){const dx=Math.max(0,Math.max(-i,i-w+1)),dy=Math.max(0,Math.max(-j,j-h+1)),d=Math.hypot(dx,dy);if(d>0&&d<5&&BAYER[(y+j)&3][(x+i)&3]<a*(1-d/5))P(x+i,y+j,col)}}
const SKY4=[['#9cc8ee','#bcdcf2','#e2eef2'],['#7cb6ec','#a0cdf2','#cfe6f4'],['#e89a7a','#f2b884','#f8d89a'],['#141838','#1e2450','#2a2f60']];
function windowView(x0,y0,w,h,slot){for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)P(x,y,shade((y-y0)/(h*.6),SKY4[slot],x,y));
  const n=slot===3;R(x0,y0+h*.45,w,h*.55,n?'#2a2a44':'#d8c09a');for(let x=x0+3;x<x0+w-3;x+=9){R(x,y0+h*.55,5,5,n?'#ffd47a':'#8a9ab8')}R(x0,y0+h*.85,w,h*.15,n?'#3a3850':'#b8aaa0')}
function plant(x,y,s=1){R(x,y,8*s,7*s,'#c8704a');R(x,y,8*s,1,'#e09070');for(let k=0;k<7;k++)R(x+1+((k*5)%7)*s,y-3*s-(k%3)*2*s,2*s,4*s,['#3f9a5a','#5ab06a','#2f7a46'][k%3])}
function hangPlant(x,y){R(x,0,1,y,'#5a4434');R(x-4,y,9,5,'#f4f1ea');for(let k=0;k<6;k++)R(x-5+k*2,y+5,2,6+(k*7)%9,['#3f9a5a','#5ab06a','#2f7a46'][k%3])}
function stringLights(t,y0,anim){for(let x=0;x<W;x++){const y=Math.round(y0+Math.sin(x/W*Math.PI*3)*3);P(x,y,'#3a2a20')}for(let x=8;x<W;x+=14){const y=Math.round(y0+Math.sin(x/W*Math.PI*3)*3),on=!anim||((Math.floor(t/700)+x/14)%4!==0);R(x,y+1,2,2,on?'#ffd47a':'#7a6a4a');if(on)P(x,y+3,'rgba(255,240,200,.7)')}}

/* =================== 1. Quán cà phê =================== */
function cafeBase(){
  const c=mk();GFX.use(c.getContext('2d'));
  // tường gạch trần bên trái, tường kem bên phải
  for(let y=0;y<124;y++)for(let x=0;x<112;x++){const row=y>>2,off=(row%2)*4,bx=((x+off)%8),edge=bx===0||y%4===0;P(x,y,edge?'#8a4a34':shade(.5+((x*7+row*13)%5)/12,['#a8543a','#b4603e','#c06a48'],x,y))}
  R(112,0,208,124,'#efe4d0');for(let x=112;x<W;x+=16)R(x,0,1,124,'rgba(160,140,110,.25)');R(0,0,W,6,'#5a3a28');
  // cửa sổ ra phố (vẽ theo buổi ở lớp riêng), khung gỗ
  R(10,22,64,62,'#6a4428');R(12,24,60,58,'#000');
  // bảng thực đơn
  R(128,14,124,52,'#2a2a2a');R(130,16,120,48,'#363636');text('CÀ PHÊ PHIN',190-textW('CÀ PHÊ PHIN')/2,20,'#ffc94d');R(140,28,100,1,'#5a5a5a');
  [['CÀ PHÊ SỮA ĐÁ','25K'],['CÀ PHÊ LON MANG ĐI','18K'],['BÁNH NGỌT','30K'],['GÓC ĐỌC SÁCH','45K']].forEach(([a,p],i)=>{text(a,136,32+i*8,'#f4f1ea');text(p,232,32+i*8,'#ffc94d')});
  // kệ sách và chậu cây bên phải
  R(262,20,54,90,'#8a5a36');for(let sh=0;sh<4;sh++){const y=28+sh*21;R(264,y+14,50,3,'#6a4428');let x=266;const r=rng(sh+50);while(x<310){const w=2+Math.floor(r()*3),h=9+Math.floor(r()*5);R(x,y+14-h,w,h,['#d65a5a','#4f7fd0','#e6aa2c','#3f9a5a','#e8dcc4','#c9a0e8'][Math.floor(r()*6)]);x+=w;if(r()<.12)x+=3}}
  plant(268,100);plant(298,100);
  // quầy gỗ: máy pha, phin, tủ bánh
  R(120,96,140,4,'#c8946a');R(120,96,140,1,'#e2b48a');R(120,100,140,24,'#8a5a36');for(let x=124;x<260;x+=10)R(x,102,1,20,'#7a4e30');R(120,122,140,2,'#5a3a24');
  R(204,72,28,24,'#c8ccd6');R(206,74,24,10,'#9aa0a8');R(210,86,6,6,'#2a2a34');R(220,86,6,6,'#2a2a34');R(208,76,4,3,'#e85a3a');
  R(236,78,22,18,'#e8f2f4');R(236,78,22,1,'#ffffff');R(236,95,22,1,'#9aa0a8');R(238,86,8,6,'#ff86b3');R(238,86,8,2,'#ffffff');R(248,84,8,8,'#c8803a');R(248,84,8,2,'#f4e0c0');
  // sàn gỗ, bàn nhỏ có khách
  for(let y=124;y<H;y++)for(let x=0;x<W;x++)P(x,y,((x+(y>>3)*11)%24===0)?'#7a5236':shade(.4+(y-124)/120,['#94643e','#a8744a','#b8845a'],x,y));
  R(14,140,40,4,'#c8946a');R(32,144,4,22,'#6a4428');R(240,144,44,4,'#c8946a');R(260,148,4,20,'#6a4428');
  const b1=backBust('#2a1a12','#e6aa2c',true,61),b2=backBust('#1e1612','#7ec0a8',false,63);GFX.ctx().drawImage(b1,6,124);GFX.ctx().drawImage(b2,272,128);
  plant(88,148,1);
  return c;
}
function cafeTableBg(slot){
  const c=mk();GFX.use(c.getContext('2d'));
  R(0,0,W,H,'#efe4d0');for(let x=0;x<W;x+=16)R(x,0,1,104,'rgba(160,140,110,.25)');
  R(20,14,80,70,'#6a4428');R(22,16,76,66,'#000');windowView(22,16,76,66,slot);R(59,16,2,66,'#6a4428');R(22,48,76,2,'#6a4428');
  R(216,10,90,94,'#8a5a36');for(let sh=0;sh<4;sh++){const y=18+sh*21;R(218,y+14,86,3,'#6a4428');let x=220;const r=rng(sh+70);while(x<300){const w=2+Math.floor(r()*3),h=9+Math.floor(r()*5);R(x,y+14-h,w,h,['#d65a5a','#4f7fd0','#e6aa2c','#3f9a5a','#e8dcc4','#c9a0e8'][Math.floor(r()*6)]);x+=w;if(r()<.12)x+=3}}
  hangPlant(120,18);hangPlant(180,12);
  for(let y=104;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(.4+(y-104)/140,['#94643e','#a8744a','#b8845a'],x,y));
  return c;
}
function cafeTableFront(v){
  const c=mk();GFX.use(c.getContext('2d'));
  R(50,100,220,6,'#c8946a');R(50,100,220,1,'#e2b48a');R(56,106,208,22,'#8a5a36');for(let x=60;x<262;x+=12)R(x,108,1,18,'#7a4e30');R(66,128,5,40,'#5a3a24');R(250,128,5,40,'#5a3a24');
  const cfsd=(x)=>{R(x,82,12,18,'rgba(230,240,248,.65)');R(x+1,88,10,12,'#c8803a');R(x+1,95,10,5,'#e8c8a0');[[2,89],[6,90],[4,93]].forEach(([dx,dy])=>R(x+dx,dy,3,3,'#e8f4f8'));R(x+1,78,10,4,'#c8ccd6');R(x+3,74,6,4,'#9aa0a8')};
  if(v==='cfsd'){cfsd(150);R(170,96,14,4,'#f4f1ea');R(172,94,10,2,'#c8803a')}
  if(v==='chill'){R(130,92,34,8,'#f4f1ea');R(130,92,34,1,'#ffffff');R(146,92,2,8,'#c8c0b4');for(let k=0;k<3;k++){R(133,94+k*2,10,1,'#9a9aa8');R(150,94+k*2,10,1,'#9a9aa8')}R(128,98,38,2,'#d65a5a');
    cfsd(176);R(110,94,14,6,'#f4f1ea');R(112,90,10,5,'#ff86b3');R(112,90,10,1,'#ffffff');P(116,89,'#d6453a')}
  if(v==='khoa'){cfsd(132);cfsd(176);R(150,94,20,6,'#f4f1ea');for(let k=0;k<4;k++)R(152+k*4,92,3,3,'#c8803a')}
  /* Ngân: hai ly cà phê, cuốn sổ phác thảo mở và hộp bút chì */
  if(v==='ngan'){cfsd(128);cfsd(182);R(146,90,30,10,'#f4f1ea');R(146,90,30,1,'#ffffff');R(160,90,2,10,'#c8c0b4');
    R(149,92,8,5,'rgba(79,127,208,.35)');R(150,93,3,1,'#4f7fd0');R(164,93,8,1,'#9a9aa8');R(164,95,6,1,'#9a9aa8');R(165,92,4,3,'rgba(255,134,179,.4)');
    R(108,96,16,4,'#e85a3a');for(let k=0;k<4;k++)R(110+k*3,93,2,3,['#ffc94d','#4f7fd0','#3f9a5a','#ff86b3'][k])}
  return c;
}
/* =================== 2. Công viên =================== */
function parkBase(){
  const c=mk();GFX.use(c.getContext('2d'));
  for(let y=0;y<54;y++)for(let x=0;x<W;x++)P(x,y,shade(y/54,['#86bbe8','#a2cdee','#c8e2f2'],x,y));
  // dãy nhà bên kia kênh
  const r=rng(41);let x=0;while(x<W){const w=14+Math.floor(r()*18),h=10+Math.floor(r()*22);R(x,54-h,w,h,['#e8d49a','#cfe0d8','#f2c8b0','#d8d0e8'][Math.floor(r()*4)]);for(let yy=58-h;yy<50;yy+=6)for(let xx=x+2;xx<x+w-3;xx+=5)R(xx,yy,3,3,'#8aa0b8');x+=w}
  R(0,54,W,6,'#86bc6a');
  // kênh
  for(let y=60;y<84;y++)for(let x=0;x<W;x++)P(x,y,shade((y-60)/24+(BAYER[y&3][x&3]-.5)*.25,['#5aa0c8','#6ab0d0','#7ac0dc','#8acce4'],x,y));
  // lan can bờ kênh
  R(0,84,W,3,'#c8c0b8');R(0,84,W,1,'#e8e2dc');for(let x=0;x<W;x+=12){R(x,86,3,10,'#a8a098');R(x,86,3,1,'#c8c0b8')}R(0,90,W,2,'#b8b0a8');
  // bãi cỏ và hàng cây
  R(0,96,W,84,'#86bc6a');for(let y=96;y<H;y+=3)for(let x=0;x<W;x+=3)if(BAYER[y&3][x&3]<.25)P(x+1,y+1,'#9ad07a');
  [[20,78],[90,74],[200,76],[290,78]].forEach(([tx,ty],i)=>{R(tx-2,ty,4,24,'#4a3428');canopy(tx,ty-10,18,13,LEAF,400+i,[-1,.4])});
  // đường chạy bộ
  for(let y=118;y<146;y++)for(let x=0;x<W;x++)P(x,y,shade(.5+(y-118)/80,['#c8a888','#d4b494','#e0c0a0'],x,y));R(0,118,W,1,'#b0906e');R(0,145,W,1,'#b0906e');
  for(let x=6;x<W;x+=22)R(x,131,10,1,'#f4ecda');
  R(118,104,3,16,'#5a5a62');R(112,98,15,8,'#3f9a5a');text('3 KM',113,100,'#ffffff');
  // ghế đá
  R(34,108,40,4,'#c8c0b8');R(34,108,40,1,'#e8e2dc');R(37,112,5,6,'#a8a098');R(66,112,5,6,'#a8a098');
  // xe bắp xào
  R(232,98,40,16,'#e85a3a');R(232,98,40,2,'#ff8a6a');R(236,102,32,8,'#c8ccd6');for(let k=0;k<6;k++)R(238+k*5,103,4,3,'#ffd84a');R(234,114,4,4,'#2a2a34');R(266,114,4,4,'#2a2a34');
  R(250,72,2,26,'#9aa0a8');for(let k=0;k<34;k++)R(234+k,70-Math.round(Math.sin(k/34*Math.PI)*6),1,3,k%8<4?'#ffc94d':'#3f9a5a');
  sign(252,53,'BẮP XÀO 15K','#1d2136','#ffc94d',2);
  // cột đèn
  [[100,96],[300,96]].forEach(([lx,ly])=>{R(lx,ly-34,2,40,'#2a2840');R(lx-3,ly-36,8,3,'#2a2840')});
  // cỏ phía trước
  for(let y=146;y<H;y++)for(let x=0;x<W;x+=1)if(BAYER[y&3][x&3]<.12)P(x,y,'#6aa858');
  return c;
}
function parkOverlay(slot,t,anim){
  GFX.ctx().globalAlpha=1;
  if(slot===1){// trưa nắng gắt
    R(140,92,42,22,'#f4ecda');R(140,92,42,3,'#e85a3a');text('TRƯA NẮNG',161-textW('TRƯA NẮNG')/2,97,'#d6453a');text('KHÔNG NÊN',161-textW('KHÔNG NÊN')/2,103,'#2c2a30');text('CHẠY BỘ',161-textW('CHẠY BỘ')/2,109,'#2c2a30');R(160,114,2,6,'#5a5a62');
    for(let y=-6;y<=6;y++)for(let x=-6;x<=6;x++){const d=Math.hypot(x,y);if(d<6)P(286+x,16+y,d<4?'#fffbe8':'#ffe9a0')}
    if(anim)for(let k=0;k<8;k++){const x=20+k*38,ph=(t/600+k)%1;for(let j=0;j<6;j++)P(x+Math.round(Math.sin(j*1.2+ph*6)*1.5),140-j*2-Math.round(ph*4),'rgba(255,255,255,.45)')}
  }
  if(slot===2&&anim){[[60,22,'#e85a3a'],[230,30,'#4f7fd0']].forEach(([x0,y0,col],i)=>{const x=x0+Math.round(Math.sin(t/900+i)*6),y=y0+Math.round(Math.cos(t/1100+i)*3);
    for(let j=0;j<5;j++)R(x-j,y+j,1+2*j,1,col);for(let j=0;j<5;j++)R(x-4+j,y+5+j,9-2*j,1,col);for(let k=0;k<26;k++)P(x+Math.round(Math.sin(k/3+t/400)*2),y+10+k*2,'#5a5a62')})}
  if(slot===3){[[100,96],[300,96]].forEach(([lx,ly])=>{R(lx-2,ly-33,6,2,'#fff4cc');glowBox(lx-2,ly-33,6,2,'#ffd98a',.5)});R(240,92,4,3,'#fff4cc');glowBox(240,92,4,3,'#ffd98a',.6)}
}
/* =================== 3. Trung tâm thương mại =================== */
function mallBase(){
  const c=mk();GFX.use(c.getContext('2d'));
  R(0,0,W,H,'#e8ecf2');for(let x=0;x<W;x+=20){R(x,0,1,8,'#c8d0dc')}R(0,0,W,8,'#d8e4f0');for(let x=0;x<W;x+=8)R(x,2,6,4,'#bcd8f0');
  // tầng 2: rạp phim, buffet lẩu
  R(0,10,W,48,'#f4f6f8');
  const shop=(x,w,y,h,nm,bg,fg)=>{R(x,y,w,h,'#2c3550');R(x+2,y+12,w-4,h-14,'#3a4466');sign(x+w/2,y+1,nm,bg,fg,3)};
  shop(8,120,12,44,'RẠP PHIM','#1d2136','#ffc94d');shop(170,142,12,44,'BUFFET LẨU 199K','#c83a3a','#fff3e2');
  [[14,'#e85a3a','#ffc94d'],[44,'#3f7ac0','#72de90'],[74,'#7a4ab0','#ff86b3']].forEach(([x,a,b])=>{R(x,26,24,28,a);R(x+2,28,20,16,b);R(x+6,32,12,8,a);R(x+3,47,18,2,'#ffffff');R(x+3,50,12,1,'#ffffff')});
  R(104,40,18,14,'#e85a3a');for(let k=0;k<5;k++)R(106+k*3,36+(k%2),3,4,'#fff4cc');R(104,40,18,2,'#ffffff');
  for(let k=0;k<4;k++){const x=180+k*32;R(x,40,24,6,'#c8a070');R(x+4,34,16,6,'#c8ccd6');R(x+6,32,12,2,'#e85a3a')}
  // lan can tầng 2
  R(0,58,W,4,'#c8d0dc');R(0,58,W,1,'#ffffff');for(let x=0;x<W;x+=10)R(x,62,1,8,'rgba(150,170,190,.6)');R(0,70,W,2,'#c8d0dc');
  // thang cuốn ở giữa
  // tầng trệt: thời trang, quà tặng
  R(0,72,W,52,'#f4f6f8');
  shop(6,112,74,48,'THỜI TRANG','#ff86b3','#1d1a10');shop(200,114,74,48,'QUÀ TẶNG','#3f9a5a','#ffffff');
  for(let k=0;k<44;k++){const y=70+Math.round(k*1.2);R(136+k,y,14,3,'#5a6474');R(136+k,y,14,1,'#8a94a4');P(136+k,y-6,'#2c3550');P(149+k,y-6,'#2c3550')}
  [[24,'#e85a3a'],[54,'#4f7fd0'],[84,'#ffc94d']].forEach(([x,col])=>{R(x,92,8,8,'#f2d8c0');R(x-2,100,12,16,col);R(x+2,116,2,4,'#9aa0a8');R(x-4,120,16,2,'#9aa0a8')});
  R(96,104,18,8,'#f4f1ea');text('350K',98,106,'#d6453a');
  // tủ kính quà: khăn lụa và thiệp
  R(214,90,40,26,'#e8f2f4');R(214,90,40,1,'#ffffff');for(let k=0;k<12;k++)R(218+k*2,96+Math.round(Math.sin(k/2)*3),3,10,k%2?'#ff86b3':'#f9a8c8');R(244,100,8,10,'#f4f1ea');R(244,100,8,1,'#d6453a');P(247,104,'#d6453a');
  R(262,92,44,24,'#e8f2f4');for(let k=0;k<4;k++){R(266+k*10,104,8,8,['#e85a3a','#ffc94d','#4f7fd0','#c9a0e8'][k]);R(269+k*10,102,2,10,'#f4f1ea')}
  // sàn bóng
  for(let y=124;y<H;y++)for(let x=0;x<W;x++){const t=((x>>4)+((y-124)>>3))%2;P(x,y,t?'#f4f6f8':'#e2e8ee');if((y-124)%8===0||x%16===0)P(x,y,'#d4dae2')}
  for(let x=20;x<W;x+=60)for(let y=126;y<H;y+=2)R(x,y,14,1,'rgba(255,255,255,.4)');
  // cây cảnh
  plant(126,150,2);plant(176,150,2);
  return c;
}
function mallClosed(){const c=mk();GFX.use(c.getContext('2d'));R(0,0,W,H,'rgba(10,12,30,.55)');
  R(0,72,W,52,'rgba(80,86,104,.6)');for(let y=74;y<124;y+=3)R(0,y,W,1,'rgba(40,44,60,.5)');
  R(108,92,104,24,'#f4f1ea');R(108,92,104,3,'#d6453a');text('TTTM CHƯA MỞ CỬA',160-textW('TTTM CHƯA MỞ CỬA')/2,99,'#2c2a30');text('MỞ CỬA TỪ BUỔI TRƯA',160-textW('MỞ CỬA TỪ BUỔI TRƯA')/2,108,'#d6453a');return c}
function mallOverlay(state,t,anim){
  if(state===1){const on=!anim||Math.floor(t/450)%2;glowBox(214,90,40,26,'#ffc94d',on?.6:.3);const bob=anim?Math.floor(t/300)%2:0;R(205,92-bob,7,8,'#ffc94d');R(208,94-bob,1,4,'#1d1a10');P(208,99-bob,'#1d1a10');
    R(216,118,40,8,'#ffc94d');text('KHĂN LỤA 300K',236-textW('KHĂN LỤA 300K')/2,120,'#1d1a10')}
  if(state===2){R(150,128,44,22,'#e85a3a');R(150,128,44,2,'#ff8a6a');text('GIÀY SALE',172-textW('GIÀY SALE')/2,132,'#ffffff');text('-40%',172-textW('-40%')/2,140,'#ffc94d');
    R(150,150,44,10,'#c8ccd6');for(let k=0;k<4;k++){R(153+k*10,148,8,3,['#f4f1ea','#2c3550','#ff86b3','#4f7fd0'][k]);R(153+k*10,151,9,2,'#2a2a34')}R(152,160,3,8,'#9aa0a8');R(189,160,3,8,'#9aa0a8')}
  if(anim){for(let k=0;k<4;k++){const ph=((t/1300)+k*.25)%1,x=184+k*32+Math.round(Math.sin(ph*6+k)),y=Math.round(32-ph*12);if(ph<.8)P(x,y,'rgba(255,255,255,.85)')}}
}

/* ---------- Ghép cảnh ---------- */
let B=null;
function build(){B={cafe:cafeBase(),cwin:{},ctb:{},ctf:{},park:parkBase(),pg:{},mall:mallBase(),closed:mallClosed()};B.pg=[0,1,2,3].map(s=>grade(B.park,s))}
function frame(ctx,scene,t,o={}){
  if(!B)build();const anim=o.animate!==false;ctx.imageSmoothingEnabled=false;GFX.use(ctx);const hero=o.gender==='nu'?'nu':'nam',slot=o.slot||0;
  if(scene==='cafe'){
    ctx.drawImage(B.cafe,0,0);if(!B.cwin[slot]){const c=mk(),x=c.getContext('2d'),k=GFX.ctx();GFX.use(x);windowView(12,24,60,58,slot);R(41,24,2,58,'#6a4428');R(12,52,60,2,'#6a4428');GFX.use(k);B.cwin[slot]=c}ctx.drawImage(B.cwin[slot],0,0);
    GFX.use(ctx);stringLights(t,10,anim);hangPlant(96,8);hangPlant(116,10);
    drawPerson(ctx,'barista',182,124,t,anim);GFX.use(ctx);R(120,96,140,4,'#c8946a');R(120,96,140,1,'#e2b48a');R(120,100,140,24,'#8a5a36');for(let x=124;x<260;x+=10)R(x,102,1,20,'#7a4e30');
    for(let k=0;k<4;k++){R(124+k*9,86,6,6,'#c8ccd6');R(124+k*9,86,6,1,'#ffffff');R(125+k*9,92,4,3,'#f4f1ea')}
    R(204,72,28,24,'#c8ccd6');R(206,74,24,10,'#9aa0a8');R(210,86,6,6,'#2a2a34');R(220,86,6,6,'#2a2a34');R(208,76,4,3,'#e85a3a');
    if(anim){const k=Math.floor(t/500)%4;P(126+k*9,93+Math.floor(t/120)%3,'#5a3a20');const ph=(t/1100)%1;if(ph<.7)P(214+Math.round(Math.sin(ph*6)),Math.round(70-ph*10),'rgba(255,255,255,.8)')}
    heroAt(ctx,o,96,166,t,anim);
    if(slot===3){GFX.use(ctx);R(0,0,W,H,'rgba(255,200,120,.06)')}
  }
  if(scene==='cafeTable'){
    const v=o.variant||'cfsd';if(!B.ctb[slot])B.ctb[slot]=cafeTableBg(slot);ctx.drawImage(B.ctb[slot],0,0);GFX.use(ctx);stringLights(t,6,anim);
    if(v==='khoa'){drawPerson(ctx,'khoa',120,116,t,anim);heroAt(ctx,o,196,116,t,anim,true)}
    else if(v==='ngan'){drawPerson(ctx,'ngan',120,116,t,anim);heroAt(ctx,o,196,116,t,anim,true)}else heroAt(ctx,o,156,116,t,anim);
    ctx.drawImage(B.ctf[v]||(B.ctf[v]=cafeTableFront(v)),0,0);
    if(anim){GFX.use(ctx);const xs=v==='khoa'||v==='ngan'?[136,180]:v==='chill'?[180]:[154];xs.forEach(x=>{if(Math.floor(t/400)%3===0)P(x+2,82,'#5a3a20')})}
    if(v==='khoa'&&anim){GFX.use(ctx);if(Math.floor(t/1400)%2){R(96,50,22,12,'#f4f1ea');R(96,62,4,3,'#f4f1ea');for(let k=0;k<3;k++)R(100+k*5,55,3,2,'#9a9aa8')}else{R(204,50,22,12,'#f4f1ea');R(220,62,4,3,'#f4f1ea');text('HAHA',206,54,'#e85a3a')}}
  }
  if(scene==='park'){
    ctx.drawImage(B.pg[slot],0,0);GFX.use(ctx);parkOverlay(slot,t,anim);
    if(slot===0){const up=anim?Math.floor(t/800)%2:1;[[156,112],[172,113],[188,112],[204,113]].forEach(([x,y],i)=>ctx.drawImage(EXF[i][up],x-7,y-25))}
    if(slot!==1){const n=slot===0?2:1;for(let i=0;i<n;i++){const v=[22,-18][i];let x=anim?(([0,320][i]+v*t/1000)%360+360)%360-20:[90,220][i];const im=walker(i,anim?Math.floor(t/90+i)%4:0);
      if(v<0){ctx.save();ctx.translate(Math.round(x)+10,136-29);ctx.scale(-1,1);ctx.drawImage(im,0,0);ctx.restore()}else ctx.drawImage(im,Math.round(x)-9,138-29)}}
    if(slot===3){ctx.drawImage(SITF[0],34,86);ctx.save();ctx.translate(76,86);ctx.scale(-1,1);ctx.drawImage(SITF[0],0,0);ctx.restore()}
    ctx.drawImage(BAPF,252-7,104-25);GFX.use(ctx);R(232,98,40,16,'#e85a3a');R(232,98,40,2,'#ff8a6a');R(236,102,32,8,'#c8ccd6');for(let k=0;k<6;k++)R(238+k*5,103,4,3,'#ffd84a');
    if(anim){for(let k=0;k<3;k++){const ph=((t/1200)+k*.33)%1;P(244+k*8+Math.round(Math.sin(ph*6)),Math.round(100-ph*12),'rgba(255,255,255,.7)')}}
    heroAt(ctx,o,160,170,t,anim);
  }
  if(scene==='mall'){
    ctx.drawImage(B.mall,0,0);GFX.use(ctx);
    if(slot===0){ctx.drawImage(B.closed,0,0);heroAt(ctx,o,160,170,t,anim);return}
    mallOverlay(o.state||0,t,anim);
    /* sinh nhật mẹ: mẹ đứng cạnh nhân vật chính, túi quà và trái tim bay lên */
    if(o.mom){drawPerson(ctx,'meS',152,170,t,anim);GFX.use(ctx);R(166,150,9,10,'#ff86b3');R(166,150,9,1,'#ffd0e0');R(169,147,3,3,'#ffc94d');
      if(anim)for(let k=0;k<3;k++){const ph=((t/1500)+k*.33)%1,x=136+k*10+Math.round(Math.sin(ph*6+k)*2),y=Math.round(110-ph*30);if(ph<.85){P(x,y,'#ff6474');P(x+2,y,'#ff6474');R(x,y+1,3,1,'#ff6474');P(x+1,y+2,'#ff6474')}}}
    const n=slot===3?3:2;for(let i=0;i<n;i++){const v=[8,-6,5][i];let x=anim?(([40,280,160][i]+v*t/1000)%360+360)%360-20:[60,250,110][i];const im=walker(i,anim?Math.floor(t/160+i)%4:0);
      if(v<0){ctx.save();ctx.translate(Math.round(x)+10,150-29+i*4);ctx.scale(-1,1);ctx.drawImage(im,0,0);ctx.restore()}else ctx.drawImage(im,Math.round(x)-9,150-29+i*4)}
    heroAt(ctx,o,o.mom?128:124,170,t,anim);
  }
}
LOOK.ongD={...LOOK.ong,armsUp:0};LOOK.baD={...LOOK.ba,armsUp:0};
Scenes.rest=frame;
})();
