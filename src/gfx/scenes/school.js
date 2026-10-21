/* 30 Ngày Sài Gòn · cảnh trường đại học (design/05): sân trường hub và 4 cảnh hành động hall, lib, club, canteen */
(()=>{
const {W,H,BAYER,rng,mk,R,P,shade,dith,outlined,canopy,LEAF,chars,textW,text,sign}=GFX;
const {K,LOOK,spr,drawPerson,backBust,student,sitter,SIT,SITF,WALKERS,walker,heroAt}=Chars;
/* ---------- Phủ màu theo buổi (dùng cho sân trường) ---------- */
const GRADE=[[1,.97,.95],[1.02,1.02,1.04],[1,.86,.78],[.3,.32,.55]];
const grade=(src,slot)=>GFX.grade(src,slot,GRADE);

/* =================== 1. Sân trường =================== */
function skyBand(top,bot,cols){for(let y=top;y<bot;y++)for(let x=0;x<W;x++)P(x,y,shade((y-top)/(bot-top),cols,x,y))}
function hub(){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(5);
  skyBand(0,60,['#86bbe8','#a2cdee','#bfdcf0','#dcecf2']);
  R(0,60,W,52,'#cfc0b2');for(let x=0;x<W;x+=6)R(x,60,1,52,'#c2b2a4');canopy(121,96,8,18,LEAF,42,[-1,.4]);
  // tháp phía xa
  R(150,2,60,60,'#e6d8ca');for(let y=6;y<60;y+=6)R(152,y,56,3,'#9a8aa8');for(let x=152;x<210;x+=10)R(x,2,2,58,'#f07a2e');
  // giảng đường A bên trái
  const gx=0,gw=118,gt=14;
  R(gx,gt,gw,100-gt,'#efe2d4');R(gx,gt,gw,2,'#fff3e2');R(gx,gt+4,gw,2,'#f07a2e');
  for(let f=0;f<3;f++){const y=gt+12+f*22;for(let x=gx+6;x<gx+gw-8;x+=14){R(x,y,10,14,'#5a6a9a');R(x,y,10,1,'#3e4a74');R(x+1,y+1,4,12,'#7a8cc0');if(r()<.3)R(x+6,y+2,3,10,'#a8b8e0')}}
  for(let x=gx+3;x<gx+gw;x+=14)R(x,gt+6,2,94,'#f07a2e');
  R(gx+40,78,36,36,'#3e4a74');R(gx+42,80,15,34,'#5a6a9a');R(gx+59,80,15,34,'#5a6a9a');R(gx+57,80,2,34,'#2c3550');R(gx+36,74,44,4,'#f07a2e');
  sign(gx+58,22,'GIẢNG ĐƯỜNG','#1d2136','#ffc94d');
  // thư viện ở giữa: mặt kính, mái hình quyển sách mở
  const lx=124,lw=92,lt=40;
  R(lx,lt,lw,114-lt,'#efe2d4');
  for(let y=lt+10;y<108;y++)for(let x=lx+6;x<lx+lw-6;x++){P(x,y,shade(.75-(y-lt)/90+.15*((x-lx)/lw),['#2a5e58','#3a7a70','#5a9a8c','#8ac0b0','#c0e0d4'],x,y));if((x-lx-6)%10===9||(y-lt-10)%14===13)P(x,y,'#244a46')}
  for(let k=0;k<lw/2+4;k++){const y=lt-6+Math.round(Math.abs(k-lw/4-2)*.18);R(lx-4+k,y,1,8,'#f4ecda');R(lx+lw+4-k,y,1,8,'#e8dcc4');P(lx-4+k,y,'#ffffff');P(lx+lw+4-k,y+7,'#c8b89a')}
  R(lx+lw/2-1,lt-8,2,12,'#c8b89a');
  R(lx+34,88,24,26,'#2c3550');R(lx+36,90,9,24,'#8ac0b0');R(lx+47,90,9,24,'#8ac0b0');
  sign(lx+lw/2,76,'THƯ VIỆN','#1d2136','#ffc94d');
  // phòng CLB cạnh thư viện
  R(lx+lw-2,74,24,40,'#e2d4c6');R(lx+lw+2,86,14,28,'#7a4ab0');R(lx+lw+2,86,14,1,'#a07ad0');P(lx+lw+13,100,'#ffc94d');
  sign(lx+lw+9,74,'CLB','#7a4ab0','#ffffff',2);
  // căng tin bên phải: mái hiên sọc cam
  const cx0=232;R(cx0,52,W-cx0,62,'#efe2d4');R(cx0,52,W-cx0,2,'#fff3e2');
  for(let x=cx0-4;x<W;x+=8){R(x,70,4,9,'#f07a2e');R(x+4,70,4,9,'#fff3e2')}for(let x=cx0-4;x<W;x+=8){R(x,79,4,2,'#c45a24');R(x+4,79,4,2,'#d8ccbc')}
  R(cx0+4,82,W-cx0-4,32,'#7a5a42');R(cx0+4,82,W-cx0-4,2,'#5a3e2a');
  for(let x=cx0+10;x<W-6;x+=22){R(x,98,14,3,'#c8a070');R(x+2,101,2,13,'#8a6a48');R(x+10,101,2,13,'#8a6a48');R(x+3,94,3,4,'#f4f1ea');R(x+8,95,3,3,'#e6aa2c')}
  sign(cx0+44,58,'CĂNG TIN','#c45a24','#fff3e2');
  // sân lát gạch
  for(let y=114;y<H;y++)for(let x=0;x<W;x++){const t=((x>>3)+(y>>2))%2,v=.5+.3*((y-114)/66)+(t?.06:-.06);P(x,y,shade(v,['#b8a08c','#c8b09a','#d8c2ac','#e6d2bc'],x,y));if((y-114)%4===0||((x+((y>>2)%2)*4)%8===0))P(x,y,'#b49c88')}
  R(0,112,W,2,'#9a8a7e');
  // bồn cây và ghế đá
  // tường rào và bụi cây lấp khoảng trống giữa các khối nhà
  R(216,60,18,54,'#d8c8b8');canopy(225,100,12,14,LEAF,41,[-1,.4]);
  [[30,148],[292,152]].forEach(([tx,ty],i)=>{
    R(tx-20,ty-6,40,8,'#a8988c');R(tx-20,ty-6,40,1,'#c8b8ac');R(tx-18,ty-8,36,3,'#5a3a2a');
    R(tx-2,ty-50,4,44,'#4a3428');R(tx-2,ty-50,1,44,'#7a5a44');
    canopy(tx,ty-62,30,20,LEAF,11+i,[-1,.4]);
    const bx=tx+(i?-56:16),bw=42;R(bx,ty+2,bw,4,'#c8c0b8');R(bx,ty+2,bw,1,'#e8e2dc');R(bx,ty+5,bw,1,'#a8a098');R(bx+3,ty+6,5,6,'#a8a098');R(bx+bw-8,ty+6,5,6,'#a8a098');R(bx+3,ty+6,1,6,'#c8c0b8');for(let k=0;k<bw;k++)dith(bx+k,ty+12,1,2,'#8a7a70',.4);
  });
  // bảng tin
  R(98,92,24,20,'#5a3a28');R(100,94,20,16,'#d8b88a');R(102,96,7,8,'#f4f1ea');R(111,95,7,6,'#86bbe8');R(111,102,6,6,'#ff86b3');R(103,105,6,4,'#e6aa2c');
  R(102,112,2,12,'#5a3a28');R(116,112,2,12,'#5a3a28');sign(110,85,'BẢNG TIN','#5a3a28','#fff3e2',2);
  return c;
}
function hubPoster(){const c=mk();GFX.use(c.getContext('2d'));R(101,95,18,14,'#2a1a4a');R(101,95,18,1,'#7a4ab0');text('ĐÊM',103,98,'#ffc94d');R(103,105,14,2,'#ff86b3');P(117,96,'#ffc94d');return c}
let HUB=null,HUBG=null;

/* =================== 2. Giảng đường =================== */
const WEEK=[{t:'NGUYÊN LÝ THỊ GIÁC',d:'shapes'},{t:'MÀU SẮC',d:'color'},{t:'BỐ CỤC',d:'grid'},{t:'ÔN TẬP GIỮA KỲ',d:'list'}];
function hall(variant){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(9),exam=variant==='exam';
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(.45+.25*(1-y/H)+.15*(x/W),['#c8bca8','#d6cab6','#e2d8c6','#ece4d4'],x,y));
  R(0,0,W,8,'#b8ac98');R(0,8,W,1,'#9a8e7c');
  // cửa sổ bên trái hứng nắng
  for(let k=0;k<2;k++){const x=6+k*30,y=18;R(x,y,22,46,'#8a7a5a');R(x+2,y+2,18,42,'#bfdcf0');R(x+2,y+24,18,20,'#9ac06a');R(x+10,y+2,2,42,'#8a7a5a');R(x+2,y+22,18,2,'#8a7a5a')}
  for(let y=20;y<H;y++){const k=(y-20)/160,x1=Math.round(30+k*60),x2=Math.round(70+k*110);for(let x=x1;x<x2;x++)if(BAYER[y&3][x&3]<.12*(1-k))P(x,y,'#fff6dc')}
  // bảng trắng và máy chiếu
  R(84,16,170,74,'#6a6a78');R(86,18,166,70,'#f8f8f4');R(86,18,166,1,'#ffffff');R(84,90,170,3,'#9a9aa8');
  for(let k=0;k<4;k++)R(100+k*10,91,6,2,['#d65a5a','#4f7fd0','#3f9a5a','#2a2a38'][k]);
  if(exam){const t='KIỂM TRA GIỮA KỲ';text(t,169-textW(t)/2,30,'#d6453a');const t2='60 PHÚT - KHÔNG DÙNG ĐIỆN THOẠI';text(t2,169-textW(t2)/2,44,'#2a2a38');
    R(140,58,58,20,'#e8e4dc');R(140,58,58,1,'#c8c4bc');text('9:00 - 10:00',148,65,'#2a2a38')}
  else{const wk=WEEK[+variant||0];text(wk.t,169-textW(wk.t)/2,26,'#2a3a6a');R(110,34,118,1,'#86bbe8');
    if(wk.d==='shapes'){R(110,46,22,22,'#d65a5a');for(let y=0;y<22;y++)for(let x=0;x<22;x++)if(Math.hypot(x-11,y-11)<11)P(150+x,46+y,'#4f7fd0');for(let y=0;y<22;y++)R(190+11-y/2,46+y,y,1,'#e6aa2c')}
    if(wk.d==='color'){for(let a=0;a<12;a++){const ang=a/12*Math.PI*2,cx=169+Math.cos(ang)*18,cy=58+Math.sin(ang)*18,col=`hsl(${a*30},70%,58%)`;R(cx-4,cy-4,8,8,col)}text('3 MÀU CƠ BẢN',200,52,'#2a2a38')}
    if(wk.d==='grid'){for(let k=0;k<3;k++){R(112+k*44,44,40,30,'#e8eef8');R(112+k*44,44,40,1,'#86bbe8')}R(126,50,12,10,'#d65a5a');R(170,56,20,8,'#4f7fd0');R(210,48,16,20,'#e6aa2c');for(let x=112;x<244;x+=13)R(x,78,1,4,'#9a9aa8')}
    if(wk.d==='list'){['1. HÌNH VÀ NỀN','2. TƯƠNG PHẢN MÀU','3. LƯỚI BỐ CỤC'].forEach((s,i)=>text(s,112,44+i*10,'#2a2a38'));R(222,40,22,30,'#ffc94d');text('29',227,52,'#d6453a')}}
  // máy chiếu, quạt trần, đồng hồ
  R(160,8,18,6,'#d8d8e0');R(166,4,6,4,'#9a9aa8');R(176,10,2,2,'#5cc8ff');
  [[60,10],[270,10]].forEach(([x,y])=>{R(x-1,y-6,2,6,'#5a5a68');R(x-14,y,28,2,'#7a7a88');R(x-3,y-1,6,4,'#5a5a68')});
  for(let y=-5;y<=5;y++)for(let x=-5;x<=5;x++){const d=Math.hypot(x,y);if(d<5.5)P(282+x,34+y,d>4.4?'#2c3550':'#f4f1ea')}R(282,30,1,4,'#2c3550');R(282,34,3,1,'#2c3550');
  // bục giảng
  R(32,96,34,28,'#a8744a');R(32,96,34,3,'#c8946a');R(36,102,26,18,'#94643e');R(30,94,38,3,'#7a4e30');R(44,90,12,4,'#d8d8e0');
  // sàn và các dãy bàn
  R(0,124,W,H-124,'#a8906c');for(let y=124;y<H;y+=6)R(0,y,W,1,'#9a8260');
  return c;
}
function hallDesks(exam){
  const c=mk();GFX.use(c.getContext('2d'));
  const rows=exam?[[136,[30,110,190,270]],[160,[70,150,230]]]:[[132,[22,62,102,142,182,222,262,302]],[156,[10,50,90,130,170,210,250,290]]];
  rows.forEach(([y,xs])=>{R(0,y+12,W,3,'#6a4428');
    xs.forEach(x=>{R(x-18,y+8,36,5,'#c8946a');R(x-18,y+8,36,1,'#e2b48a');R(x-18,y+13,36,2,'#8a5a36');if(exam){R(x-6,y+6,12,3,'#f8f8f4');R(x+4,y+5,1,3,'#2a2a38')}})});
  return c;
}
function hallStudents(exam,hero){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(3);
  const H=['#2a1a12','#1e1612','#3e2a1e','#5a3424','#241812'],S=['#f4f1ea','#e06a5a','#7ec0a8','#c9a0e8','#3a4a70','#e6aa2c','#f2b8c8'];
  const rows=exam?[[136,[30,110,270]],[160,[70,230]]]:[[132,[22,62,102,182,222,262,302]],[156,[10,50,90,130,210,250,290]]];
  let k=0;rows.forEach(([y,xs])=>xs.forEach(x=>{const b=backBust(H[k%5],S[k%7],k%3===0,k);k++;GFX.ctx().drawImage(b,x-10,y-12+(exam?2:0))}));
  return c;
}
/* =================== 3. Thư viện =================== */
function library(){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(14);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(.5+.2*(1-y/H),['#3a4a52','#46565e','#52646a','#5e7276'],x,y));
  // kệ sách cao
  for(let s=0;s<4;s++){const x0=4+s*80,w=72;R(x0,6,w,104,'#6a4428');R(x0,6,w,2,'#8a5a3a');
    for(let sh=0;sh<5;sh++){const y=12+sh*20;R(x0+3,y+16,w-6,3,'#8a5a3a');let x=x0+4;while(x<x0+w-5){const bw=2+Math.floor(r()*3),bh=10+Math.floor(r()*6);
      const col=['#d65a5a','#4f7fd0','#e6aa2c','#3f9a5a','#c9a0e8','#e8dcc4','#2c3550','#e06a5a'][Math.floor(r()*8)];R(x,y+16-bh,bw,bh,col);R(x,y+16-bh,1,bh,'rgba(255,255,255,.25)');if(r()<.3)R(x,y+8,bw,1,'#ffc94d');x+=bw;if(r()<.08)x+=3}}}
  sign(160,2,'THƯ VIỆN - GIỮ YÊN LẶNG','#1d2136','#ffc94d');
  // sàn thảm
  R(0,110,W,H-110,'#4a5e66');for(let y=110;y<H;y+=2)for(let x=(y/2)%2;x<W;x+=4)P(x,y,'#52686e');
  // bàn đọc dài và đèn bàn xanh (vẽ ở lớp trước)
  return c;
}
function libraryFront(stack){
  const c=mk();GFX.use(c.getContext('2d'));
  R(20,128,280,8,'#8a5a36');R(20,128,280,2,'#b07a4a');R(20,136,280,4,'#6a4428');R(26,140,6,40,'#5a3a24');R(288,140,6,40,'#5a3a24');R(32,140,256,14,'#7a4e30');R(32,153,256,1,'#5a3a24');for(let x=40;x<288;x+=32)R(x,142,1,10,'#6a4428');
  [[70,'#3f9a5a'],[250,'#3f9a5a']].forEach(([x,col])=>{R(x,118,2,10,'#c8a05a');R(x-7,112,16,6,col);R(x-7,112,16,1,'#6aca8a');R(x-5,118,12,1,'rgba(255,240,200,.8)');for(let y=119;y<128;y++)dith(x-8-(y-119),y,18+(y-119)*2,1,'#fff0c8',.25)});
  // vở và laptop của nhân vật
  R(126,124,22,4,'#f4f1ea');R(126,124,22,1,'#ffffff');R(136,124,1,4,'#c8c0b4');R(130,125,4,1,'#4f7fd0');
  R(170,116,22,9,'#b8bcc8');R(170,116,22,1,'#dfe2ea');R(166,125,30,3,'#8e92a0');R(178,119,6,4,'#ffc94d');
  // chồng sách lớn dần theo số buổi đã học
  const cols=['#d65a5a','#4f7fd0','#e6aa2c','#3f9a5a','#c9a0e8','#e06a5a'];
  for(let i=0;i<stack;i++){const y=124-i*4,w=16-(i%2)*2;R(104+(i%2),y,w,4,cols[i%cols.length]);R(104+(i%2),y,w,1,'rgba(255,255,255,.35)');R(104+(i%2),y+3,w,1,'rgba(0,0,0,.25)');R(104+w-2+(i%2),y+1,2,2,'#f4f1ea')}
  return c;
}
function libraryPeople(){
  const c=mk();GFX.use(c.getContext('2d'));
  // bạn ngủ gục trên bàn và bạn đang đọc
  const b=backBust('#1e1612','#7ec0a8',false,4);GFX.ctx().save();GFX.ctx().translate(268,128);GFX.ctx().drawImage(b,-10,-14);GFX.ctx().restore();R(258,122,20,6,'#7ec0a8');
  const b2=backBust('#5a3424','#f2b8c8',true,6);GFX.ctx().drawImage(b2,36,108);R(40,124,12,4,'#e8dcc4');
  return c;
}
/* =================== 4. Phòng CLB =================== */
function club(){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(21);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(.4+.25*(1-y/H),['#3a2a5a','#46346a','#523e78','#5e4884'],x,y));
  // dây đèn trang trí
  for(let x=0;x<W;x++){const y=Math.round(14+Math.sin(x/W*Math.PI*3)*4);P(x,y,'#2a1a3a')}
  // poster nhạc và bảng lịch tập
  [[18,'#e06a5a'],[52,'#ffc94d'],[262,'#5cc8ff']].forEach(([x,col],i)=>{R(x,26,26,34,col);R(x+2,28,22,22,'#2a1a3a');R(x+6,32,14,14,col);R(x+3,52,20,2,'#2a1a3a');R(x+3,56,14,1,'#2a1a3a')});
  R(96,24,74,48,'#f4f1ea');R(96,24,74,2,'#ffffff');text('LỊCH TẬP',104,30,'#7a4ab0');['T2 - GUITAR','T4 - HÁT','T6 - BAN NHẠC'].forEach((s,i)=>text(s,102,42+i*9,'#2a2a38'));
  // sàn gỗ, thảm tròn
  R(0,112,W,H-112,'#8a6a4a');for(let y=112;y<H;y+=5)R(0,y,W,1,'#7a5a3e');
  for(let y=-12;y<=12;y++)for(let x=-60;x<=60;x++){const d=Math.hypot(x/60,y/12);if(d<1)P(160+x,150+y,d>.85?'#c45a24':d>.6?'#e6aa2c':'#f07a2e')}
  // trống, bàn phím, ampli
  R(212,96,40,22,'#c83a3a');R(212,96,40,2,'#e86a5a');for(let y=0;y<10;y++)R(214+y,118,1,10,'#9a9aa8');R(250,118,1,10,'#9a9aa8');
  for(let y=-6;y<=6;y++)for(let x=-8;x<=8;x++)if(Math.hypot(x/8,y/6)<1)P(232+x,92+y,'#e8e4dc');R(220,74,2,22,'#9a9aa8');R(214,72,14,2,'#ffc94d');
  R(270,100,40,6,'#2a2a34');R(272,100,36,3,'#f4f1ea');for(let x=273;x<308;x+=3)R(x,100,1,3,'#2a2a34');R(274,106,2,22,'#5a5a68');R(304,106,2,22,'#5a5a68');
  R(14,96,24,26,'#2a2a34');R(16,98,20,16,'#4a4a56');for(let y=100;y<112;y+=2)R(18,y,16,1,'#3a3a46');R(16,116,20,2,'#ffc94d');
  // ghế lười
  [[66,130,'#5cc8ff'],[96,134,'#ff86b3']].forEach(([x,y,col])=>{for(let j=0;j<12;j++)for(let i=0;i<22;i++){const d=Math.hypot((i-11)/11,(j-8)/8);if(d<1)P(x+i,y+j,d>.7?'rgba(0,0,0,.25)':col)}});
  // đàn guitar dựng
  R(186,96,2,22,'#3a2418');R(184,112,10,12,'#c8803a');R(183,116,12,8,'#c8803a');P(188,118,'#2a1408');R(185,92,6,4,'#3a2418');
  return c;
}
function clubPoster(){const c=mk();GFX.use(c.getContext('2d'));
  const X=180,cx=X+33;R(X,22,66,54,'#1a0e32');R(X,22,66,2,'#ffc94d');R(X,74,66,2,'#ffc94d');
  for(let k=0;k<12;k++){const a=k/12*Math.PI*2;P(cx+Math.round(Math.cos(a)*9),36+Math.round(Math.sin(a)*9),'#ffc94d')}
  R(cx-4,32,8,8,'#ff86b3');text('ĐÊM NHẠC',cx-textW('ĐÊM NHẠC')/2,50,'#ffffff');text('TỐI T7 - NGÀY 13',cx-textW('TỐI T7 - NGÀY 13')/2,60,'#ffc94d');text('VÉ 100K',cx-textW('VÉ 100K')/2,68,'#ff86b3');return c}
function clubLights(t){for(let x=6;x<W;x+=16){const y=Math.round(14+Math.sin(x/W*Math.PI*3)*4),on=(Math.floor(t/500)+x/16)%3<2;const col=['#ffc94d','#ff86b3','#5cc8ff','#72de90'][(x/16|0)%4];R(x,y+1,2,3,on?col:'#4a3a5a');if(on)P(x,y+4,'rgba(255,255,255,.7)')}}
/* =================== 5. Căng tin =================== */
function canteen(){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(31);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(.5+.2*(1-y/H),['#d8c8a8','#e2d4b6','#ece0c6','#f4ead6'],x,y));
  for(let x=0;x<W;x+=12)R(x,0,1,70,'rgba(160,140,110,.35)');
  // bảng thực đơn
  R(100,2,120,48,'#2a3a2a');R(102,4,116,44,'#34503a');text('CƠM SINH VIÊN',160-textW('CƠM SINH VIÊN')/2,11,'#ffffff');
  R(150,20,20,9,'#ffc94d');text('25K',154,22,'#1d1a10');['CƠM + 1 MẶN + RAU + CANH','CHỈ MỞ BUỔI TRƯA'].forEach((s,i)=>text(s,160-textW(s)/2,31+i*12,i?'#ffc94d':'#d8e8d0'));
  // quạt trần
  [[50,6],[270,6]].forEach(([x,y])=>{R(x-1,y-6,2,8,'#5a5a68');R(x-16,y+2,32,2,'#7a7a88');R(x-3,y,6,4,'#5a5a68')});
  // quầy inox với khay thức ăn
  R(60,74,200,8,'#c8ccd6');R(60,74,200,1,'#ffffff');R(60,82,200,26,'#9aa0ac');for(let x=64;x<258;x+=14)R(x,84,1,22,'#8a909c');
  const foods=[['#f4f1ea','#e8e2d4'],['#c8803a','#a8602a'],['#5a9a4a','#3f7a3a'],['#e8b840','#c8901e'],['#d65a3a','#a83e2a'],['#c8a070','#a88050']];
  foods.forEach(([a,b],i)=>{const x=68+i*32;R(x,68,26,7,'#d8dce4');R(x+2,66,22,4,a);for(let k=0;k<6;k++)P(x+3+((k*7)%20),66+(k%2),b)});
  for(let k=0;k<3;k++){const x=72+k*70;R(x,56,30,2,'rgba(255,255,255,.5)')}
  // bàn ghế
  R(0,108,W,H-108,'#b8a890');for(let y=108;y<H;y+=10)for(let x=((y/10)%2)*10;x<W;x+=20)R(x,y,10,10,'#c4b49c');
  [[40,150],[280,150]].forEach(([x,y])=>{R(x-24,y-10,48,4,'#3f9a8a');R(x-24,y-10,48,1,'#6ac0b0');R(x-20,y-6,3,14,'#2a6a5e');R(x+17,y-6,3,14,'#2a6a5e');
    [x-18,x+12].forEach(sx=>{R(sx,y+4,8,3,'#e06a5a');R(sx+1,y+7,2,6,'#a8302a');R(sx+5,y+7,2,6,'#a8302a')});
    R(x-10,y-13,12,3,'#d8dce4');R(x-8,y-14,4,2,'#f4f1ea');R(x-3,y-14,3,2,'#c8803a')});
  return c;
}

/* ---------- Ghép cảnh ---------- */
let BUILT=null;
function build(){
  BUILT={hub:hub(),hubPoster:hubPoster(),hall:{},desks:{n:hallDesks(false),e:hallDesks(true)},hallSt:{n:hallStudents(false),e:hallStudents(true)},
    lib:library(),libP:libraryPeople(),libF:{},club:club(),clubPoster:clubPoster(),canteen:canteen()};
  BUILT.hubG=[0,1,2,3].map(s=>grade(BUILT.hub,s));
}
function hallBg(v){return BUILT.hall[v]||(BUILT.hall[v]=hall(v))}
function libFront(n){return BUILT.libF[n]||(BUILT.libF[n]=libraryFront(n))}
function frame(ctx,scene,t,o={}){
  if(!BUILT)build();
  const anim=o.animate!==false;ctx.imageSmoothingEnabled=false;GFX.use(ctx);const hero=o.gender==='nu'?'nu':'nam';
  if(scene==='hub'){
    ctx.drawImage(BUILT.hubG[o.slot||0],0,0);
    if(o.poster)ctx.drawImage(BUILT.hubPoster,0,0);
    if(anim){[[0,140,8],[1,300,-6],[2,200,5]].forEach(([i,x0,v],k)=>{let x=x0+v*t/1000;x=((x+20)%360+360)%360-20;const f=Math.floor(t/160+k)%4,im=walker(i,f);
      if(v<0){ctx.save();ctx.translate(Math.round(x)+10,126+k*4-29);ctx.scale(-1,1);ctx.drawImage(im,0,0);ctx.restore()}else ctx.drawImage(im,Math.round(x)-9,126+k*4-29)})}
    else[[0,140],[2,200]].forEach(([i,x],k)=>ctx.drawImage(walker(i,0),x-9,126+k*8-29));
    // bạn ngồi trên ghế đá
    // bạn ngồi đọc sách trên ghế đá dưới tán cây: hông chạm mặt ghế (y=150), chân chạm đất
    {const blink=anim&&Math.floor((t+500)/120)%40===0,page=anim&&Math.floor(t/2600)%2;ctx.drawImage(blink?SITF[2]:SITF[page?1:0],52,131);}
    heroAt(ctx,o,160,166,t,anim);
  }
  if(scene==='hall'){
    const exam=o.week==='exam';ctx.drawImage(hallBg(exam?'exam':String(o.week||0)),0,0);
    drawPerson(ctx,'hai',exam?120:52,124,t,anim);
    ctx.drawImage(BUILT.hallSt[exam?'e':'n'],0,0);
    // nhân vật chính ngồi ở hàng đầu (nhìn từ phía sau)
    const hb=backBust(hero==='nu'?'#3b2418':'#3b2418','#4f7fd0',hero==='nu',99);
    const hx=exam?140:132,hy=exam?150:126;ctx.drawImage(hb,hx,hy);GFX.use(ctx);R(hx+19,hy+8,7,9,'#e6aa2c');R(hx+19,hy+8,7,1,'#ffd468');R(hx+20,hy+12,5,3,'#b47c1c');R(hx+21,hy+6,3,2,'#7a5216');
    ctx.drawImage(BUILT.desks[exam?'e':'n'],0,0);
    if(exam&&anim){GFX.use(ctx);const s=Math.floor(t/1000)%60;R(274,34,1,1,'#d6453a')}
  }
  if(scene==='lib'){
    ctx.drawImage(BUILT.lib,0,0);ctx.drawImage(BUILT.libP,0,0);
    heroAt(ctx,o,138,150,t,anim);
    ctx.drawImage(libFront(Math.min(6,o.stack||0)),0,0);
    if(anim){GFX.use(ctx);const z=(t/1000)%3;const y=Math.round(112-z*5);if(z<2.4){R(276,y,3,1,'#f4f1ea');P(277,y+1,'#f4f1ea');R(276,y+2,3,1,'#f4f1ea')}}
  }
  if(scene==='club'){
    ctx.drawImage(BUILT.club,0,0);if(o.poster)ctx.drawImage(BUILT.clubPoster,0,0);if(anim)clubLights(t);else clubLights(0);
    drawPerson(ctx,'linh',196,158,t,anim,true);heroAt(ctx,o,128,160,t,anim);
  }
  if(scene==='canteen'){
    ctx.drawImage(BUILT.canteen,0,0);
    drawPerson(ctx,'co',160,100,t,anim);
    GFX.use(ctx);R(60,74,200,8,'#c8ccd6');R(60,74,200,1,'#ffffff');R(60,82,200,26,'#9aa0ac');for(let x=64;x<258;x+=14)R(x,84,1,22,'#8a909c');
    const q=[[0,232,0],[1,212,1],[2,252,2]];q.forEach(([i,x,f])=>{const im=walker(i,anim?Math.floor(t/400+i)%2*2:0);ctx.save();ctx.translate(x+10,120-29);ctx.scale(-1,1);ctx.drawImage(im,0,0);ctx.restore()});
    heroAt(ctx,o,184,160,t,anim);
    if(anim){GFX.use(ctx);for(let k=0;k<3;k++){const ph=((t/1200)+k*.33)%1;for(let j=0;j<5;j++){const y=Math.round(64-ph*12-j),x=Math.round(84+k*64+Math.sin(j+ph*6)*1.5);if(j<4-ph*3)P(x,y,'rgba(255,255,255,.7)')}}}
  }
}
Scenes.school=frame;
})();
