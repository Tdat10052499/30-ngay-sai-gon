/* 30 Ngày Sài Gòn · cảnh quán ăn và chợ (design/07): phố ăn uống street, ngồi ăn table (o.dish), chợ market */
(()=>{
const {W,H,BAYER,rng,mk,R,P,shade,dith,outlined,canopy,LEAF,chars,textW,text,sign}=GFX;
const {K,LOOK,spr,drawPerson,backBust,student,sitter,SIT,SITF,WALKERS,walker,heroAt}=Chars;
/* ---------- Bổ sung nhân vật: người bán đội nón lá, bạn ngồi uống trà đá ---------- */
Chars.decorate(function(base,o,blink,b){if(!o.nonla&&!o.apronK)return base;
  const c=mk(30,54),x=c.getContext('2d');x.drawImage(base,0,0);const keep=GFX.ctx();GFX.use(x);const cc=15;
  if(o.apronK){R(cc-6,30+b,12,10-b,o.apronK);R(cc-6,30+b,12,1,'rgba(255,255,255,.35)')}
  if(o.nonla){for(let j=0;j<7;j++){const w=2+j*3;R(cc-w/2,b-1+j,w,1,j%2?'#d8b878':'#e8cc8a')}R(cc-12,b+6,24,1,'#a8884a')}
  GFX.use(keep);return c});
Object.assign(LOOK,{
  ban1:{nonla:1,lash:1,hair:'long',c:{sh:'#c9a0e8',shD:'#a07cc4',shL:'#e4c8ff',col:'#c9a0e8',pa:'#3a3a48',sk:'#e0ac82',skD:'#b98060',skL:'#f2c49c'}},
  ban2:{nonla:1,lash:1,hair:'long',c:{sh:'#72de90',shD:'#4fae6a',shL:'#a8f0bc',col:'#72de90',pa:'#3a3a48',sk:'#d8a078',skD:'#b07c58',skL:'#ecbc94'}},
  chu:{tuft:false,hair:'side',apronK:'#f4f1ea',c:{sh:'#e06a5a',shD:'#b44a40',shL:'#f8907c',col:'#e06a5a',pa:'#3a3a48',sk:'#d8a078',skD:'#b07c58',skL:'#ecbc94'}},
  khoa:{c:{h:'#1e1612',hD:'#100b08',hL:'#4a3628',hR:'#6a4a38',sh:'#e06a5a',shD:'#b44a40',shL:'#f8907c',col:'#e06a5a',sk:'#e0ac82',skD:'#b98060',skL:'#f2c49c'}},
});
function sideSeat(o,f){ // ngồi ghế nhựa thấp, cầm ly trà đá
  return outlined(22,30,()=>{const c=9,up=f%2;
    R(c+4,24,5,2,'#2a2a34');R(c+4,18,3,7,o.b);R(c-3,16,10,3,o.b);
    R(c-3,9,6,8,o.top);R(c-3,9,2,8,'rgba(0,0,0,.18)');R(c+2,9,1,8,'rgba(255,255,255,.35)');
    R(c,11,2,4,o.top);R(c+1,14-up,3,2,'#f2c7a0');R(c+3,10-up*3,3,5,'#c8701e');R(c+3,10-up*3,3,1,'#f4f1ea');P(c+4,12-up*3,'#ffffff');
    R(c-1,8,2,1,'#d09a74');const hy=-1;R(c-4,hy+1,9,9,'#f2c7a0');R(c-3,hy,7,1,'#f2c7a0');R(c+5,hy+5,1,2,'#f2c7a0');
    R(c+2,hy+5,1,2,'#2a1c14');P(c+3,hy+8,'#f39a9a');R(c+2,hy+8+0,2,1,'#9a4636');
    R(c-4,hy-1,8,3,o.h);R(c-5,hy+1,4,7,o.h);R(c-3,hy-2,6,1,o.h);R(c+3,hy,2,3,o.h);R(c,hy+2,4,1,o.h);if(o.long)R(c-5,hy+1,3,12,o.h);
  });
}
const SEAT=[{h:'#1e1612',top:'#e06a5a',b:'#3b4560'},{h:'#2a1a12',top:'#f2b8c8',b:'#3a4a70',long:1},{h:'#3b2418',top:'#4f7fd0',b:'#33405e',long:1},{h:'#3b2418',top:'#4f7fd0',b:'#33405e'}];
const SEATF={};const seatF=(i,f)=>SEATF[i+'-'+f]||(SEATF[i+'-'+f]=sideSeat(SEAT[i],f));
function stool(x,y,col,dark){R(x,y,10,2,col);R(x,y,10,1,'rgba(255,255,255,.35)');R(x+1,y+2,2,6,dark);R(x+7,y+2,2,6,dark);R(x+3,y+5,4,1,dark)}

/* ---------- Phủ màu theo buổi; đèn biển hiệu vẽ sau nên không bị tối đi ---------- */
const GRADE=[[1,.97,.95],[1.02,1.02,1.04],[1,.86,.78],[.32,.34,.56]];
const grade=(src,slot)=>GFX.grade(src,slot,GRADE);
function glowBox(x,y,w,h,col,a){for(let j=-4;j<h+4;j++)for(let i=-4;i<w+4;i++){const dx=Math.max(0,Math.max(-i,i-w+1)),dy=Math.max(0,Math.max(-j,j-h+1)),d=Math.hypot(dx,dy);if(d>0&&d<5&&BAYER[(y+j)&3][(x+i)&3]<a*(1-d/5))P(x+i,y+j,col)}}

/* =================== 1. Phố ăn uống =================== */
function streetBase(){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(81);
  for(let y=0;y<40;y++)for(let x=0;x<W;x++)P(x,y,shade(y/40,['#86bbe8','#a2cdee','#c8e2f2'],x,y));
  // dãy nhà phố
  const houses=[[0,72,'#e8d49a',3],[72,80,'#cfe0d8',3],[152,72,'#f2c8b0',2],[224,46,'#d8d0e8',3],[270,50,'#e8dcc4',2]];
  houses.forEach(([x,w,col,fl])=>{const top=112-fl*30;R(x,top,w,112-top,col);R(x,top,w,2,'rgba(255,255,255,.4)');R(x+w-2,top,2,112-top,'rgba(0,0,0,.12)');
    for(let f=1;f<fl;f++){const y=top+(f-1)*30+6;R(x+6,y,w-12,16,'#5a6a7a');R(x+8,y+2,(w-16)/2-1,12,'#8aa0b8');R(x+w/2+1,y+2,(w-16)/2-1,12,'#8aa0b8');R(x+4,y+18,w-8,2,'#7a6a5a');for(let k=x+6;k<x+w-6;k+=4)R(k,y+14,1,4,'#7a6a5a')}
    R(x+2,top-4,w-4,4,'rgba(0,0,0,.2)');if(r()<.6){R(x+w-14,top-10,8,6,'#9aa0a8');R(x+w-12,top-12,4,2,'#9aa0a8')}});
  // tầng trệt: các quán
  R(4,82,64,30,'#3a2a22');R(6,84,60,28,'#5a4434');for(let x=8;x<64;x+=12){R(x,98,8,2,'#c8a070');R(x+1,100,2,8,'#8a6a48')}
  R(76,82,72,30,'#2a2a34');R(78,84,68,28,'#4a4a56');for(let x=82;x<144;x+=16){R(x,98,12,2,'#c8ccd6');R(x+2,100,2,8,'#9aa0a8');R(x+8,100,2,8,'#9aa0a8')}
  R(276,82,40,30,'#8a8e98');for(let y=84;y<112;y+=3)R(276,y,40,1,'#6a6e78');R(276,82,40,2,'#a8acb4');
  // mái hiên vải
  [[2,70,'#e85a3a'],[74,76,'#3f7ac0']].forEach(([x,w,col])=>{for(let k=0;k<w;k+=8){R(x+k,76,4,6,col);R(x+k+4,76,4,6,'#f4f1ea')}R(x,82,w,1,'rgba(0,0,0,.3)')});
  // dây điện
  for(let x=0;x<W;x++){P(x,Math.round(26+Math.sin(x/W*Math.PI)*8),'#2a2f3a');P(x,Math.round(30+Math.sin(x/W*Math.PI*1.2)*7),'#2a2f3a')}
  R(150,10,3,102,'#6a6a72');R(149,10,5,2,'#5a5a62');
  // vỉa hè và lòng đường
  for(let y=112;y<150;y++)for(let x=0;x<W;x++){P(x,y,((x>>3)+(y>>3))%2?'#c8b8a8':'#bcac9c')}R(0,112,W,1,'#9a8a7e');
  R(0,150,W,3,'#d8ccc0');R(0,153,W,2,'#7a6e66');for(let y=155;y<H;y++)R(0,y,W,1,y%2?'#3a3644':'#363240');for(let x=8;x<W;x+=26)R(x,168,12,1,'#8a8494');
  // lò than nướng sườn trước quán cơm tấm
  R(10,104,26,10,'#5a5a62');R(12,102,22,3,'#2a2a30');for(let k=0;k<4;k++)R(14+k*5,100,4,2,'#b4683a');R(14,114,2,8,'#3a3a40');R(30,114,2,8,'#3a3a40');
  R(40,96,22,16,'#c8ccd6');R(41,97,20,10,'#e8f2f4');R(43,101,7,4,'#f4f1ea');R(52,100,7,5,'#c8803a');
  // nồi nước lèo lớn trước quán phở
  R(124,96,20,16,'#c8ccd6');R(124,96,20,2,'#e8ecf0');R(126,94,16,2,'#9aa0a8');R(122,112,24,4,'#3a3a40');
  // xe bánh mì
  R(156,98,30,14,'#f4f1ea');R(157,99,28,8,'#e8f2f4');for(let k=0;k<4;k++)R(159+k*7,102,6,3,'#e6aa2c');R(156,112,30,3,'#c83a3a');R(158,115,4,4,'#2a2a34');R(180,115,4,4,'#2a2a34');R(170,72,2,26,'#9aa0a8');
  for(let k=0;k<26;k++)R(158+k,70-Math.round(Math.sin(k/26*Math.PI)*5),1,3,k%6<3?'#e85a3a':'#ffc94d');
  // xe xôi
  R(196,102,22,10,'#8a5a36');R(198,96,18,6,'#c8ccd6');R(200,94,14,2,'#9aa0a8');R(196,112,22,2,'#6a4428');R(198,114,3,4,'#2a2a34');R(213,114,3,4,'#2a2a34');
  // góc trà đá dưới gốc cây
  R(254,62,4,50,'#4a3428');canopy(256,52,24,16,LEAF,77,[-1,.4]);
  R(232,108,18,4,'#3f7ac0');R(234,112,2,6,'#2a5aa0');R(246,112,2,6,'#2a5aa0');R(236,100,6,8,'#f4f1ea');R(237,102,4,5,'#c8701e');R(244,104,3,4,'#e8e2d4');
  stool(226,118,'#e0483c','#a8302a');stool(252,120,'#3f7ac0','#2a5aa0');
  return c;
}
function streetSigns(slot,ocOpen){
  const c=mk();GFX.use(c.getContext('2d'));const n=slot===3;
  const sg=(cx,y,s,bg,fg)=>{const [x,w]=sign(cx,y,s,bg,fg,3);if(n)glowBox(x,y,w,11,fg,.35)};
  sg(36,64,'CƠM TẤM 40K','#e85a3a','#fff3e2');sg(96,64,'PHỞ BÒ 55K','#1d2136','#ffc94d');sg(132,64,'BÚN BÒ','#c45a24','#fff3e2');
  sg(171,86,'BÁNH MÌ 20K','#c83a3a','#ffffff');sg(207,84,'XÔI 25K','#3f9a5a','#ffffff');
  R(232,90,20,8,'#c9a878');text('TRÀ ĐÁ',233,92,'#2c2a30');
  if(ocOpen){R(274,80,44,34,'#2a2030');R(276,82,40,28,'#4a3040');for(let k=0;k<5;k++){R(279+k*7,100,6,4,'#f4f1ea');P(281+k*7,101,['#c8803a','#e8b840','#a86a4a','#d6453a','#c9a878'][k])}
    for(let x=272;x<320;x+=6){const y=78+Math.round(Math.sin(x/6)*1.5);P(x,y,['#ffc94d','#ff86b3','#5cc8ff'][(x/6|0)%3])}
    sg(297,66,'ỐC','#ff7a59','#1d1a10')}
  else{sign(297,66,'ỐC','#5a5a62','#c8c8d0',3);R(272,92,46,9,'#f4f1ea');text('MỞ BUỔI TỐI',295-textW('MỞ BUỔI TỐI')/2,94,'#d6453a')}
  // đèn đường buổi tối
  if(n){R(147,12,10,2,'#fff4cc');R(144,14,16,1,'rgba(255,217,138,.35)');
    [[6,84,60,28],[78,84,68,28]].forEach(([x,y,w,h])=>R(x,y,w,h,'rgba(255,212,122,.28)'))}
  return c;
}
/* =================== 2. Ngồi ăn =================== */
const DISH={
  comtam:{n:'Cơm tấm sườn',bg:'quan'},pho:{n:'Phở bò',bg:'quan'},bunbo:{n:'Bún bò đặc biệt',bg:'quan'},trada:{n:'Ngồi trà đá, tám chuyện',bg:'via'},oc:{n:'Đi ăn ốc với bạn',bg:'dem'}};
function tableBg(kind){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(91);
  if(kind==='quan'){
    for(let y=0;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(.5+.2*(1-y/H),['#d8c8a8','#e2d4b6','#ece0c6'],x,y));
    for(let y=60;y<120;y+=8)for(let x=0;x<W;x+=8){R(x,y,8,8,((x+y)/8)%2?'#cfe0d8':'#e8f0ec');R(x,y,8,1,'#b8c8c0')}
    R(16,10,110,44,'#2a3a2a');R(18,12,106,40,'#34503a');text('THỰC ĐƠN',71-textW('THỰC ĐƠN')/2,16,'#ffc94d');
    [['CƠM TẤM SƯỜN','40K'],['PHỞ BÒ','55K'],['BÚN BÒ ĐẶC BIỆT','75K']].forEach(([a,p],i)=>{text(a,24,26+i*9,'#ffffff');text(p,104,26+i*9,'#ffc94d')});
    R(150,20,40,30,'#f4f1ea');R(150,20,40,6,'#d6453a');text('1',166,32,'#d6453a');
    R(220,24,60,44,'#c8ccd6');R(220,24,60,3,'#e8ecf0');R(226,20,48,4,'#9aa0a8');for(let k=0;k<3;k++){const y=14-k*3;R(234+k*10,y,2,4,'rgba(255,255,255,.7)')}
    R(0,120,W,H-120,'#a8906c');for(let y=120;y<H;y+=7)R(0,y,W,1,'#9a8260');
    const b1=backBust('#2a1a12','#4f7fd0',false,3),b2=backBust('#5a3424','#f2b8c8',true,5);GFX.ctx().drawImage(b1,24,92);GFX.ctx().drawImage(b2,282,94);
  }else if(kind==='via'){
    for(let y=0;y<70;y++)for(let x=0;x<W;x++)P(x,y,shade(y/70,['#9cc8ee','#bcdcf2','#d8ecf4'],x,y));
    R(0,40,W,60,'#e8d49a');for(let x=10;x<W;x+=40){R(x,50,24,20,'#8aa0b8');R(x+11,50,2,20,'#5a6a7a')}
    canopy(60,26,70,30,LEAF,93,[-1,.4]);R(56,40,6,70,'#4a3428');
    for(let y=100;y<H;y++)for(let x=0;x<W;x++)P(x,y,((x>>3)+(y>>3))%2?'#c8b8a8':'#bcac9c');
  }else{
    for(let y=0;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(y/H,['#141838','#1e2048','#2a2850','#34305a'],x,y));
    R(0,40,W,64,'#2a2034');for(let x=10;x<W;x+=30){R(x,52,16,14,(x/30|0)%2?'#ffd47a':'#3a2a4a')}
    for(let x=0;x<W;x+=1){const y=Math.round(20+Math.sin(x/W*Math.PI*2)*6);P(x,y,'#3a3040')}
    for(let y=104;y<H;y++)for(let x=0;x<W;x++)P(x,y,((x>>3)+(y>>3))%2?'#4a4250':'#44404e');
    R(0,104,W,76,'rgba(255,217,138,.08)');
  }
  return c;
}
function tableFront(kind,dish){
  const c=mk();GFX.use(c.getContext('2d'));
  if(kind==='via'){
    // bàn nhựa thấp, ly trà đá, đĩa hạt dưa
    R(116,138,88,5,'#3f7ac0');R(116,138,88,1,'#6a9ae0');R(120,143,3,14,'#2a5aa0');R(197,143,3,14,'#2a5aa0');
    [[128,'#c8701e'],[176,'#c8701e']].forEach(([x,col])=>{R(x,128,8,10,'rgba(230,240,248,.6)');R(x+1,131,6,7,col);R(x+1,131,6,1,'#f4f1ea');P(x+2,133,'#ffffff');P(x+5,134,'#ffffff')});
    R(188,126,10,12,'rgba(230,240,248,.7)');R(189,129,8,9,'#c8701e');R(190,124,6,2,'#9aa0a8');
    R(150,134,14,4,'#f4f1ea');for(let k=0;k<5;k++)P(152+k*2,134,'#2a2a30');
    return c;
  }
  // bàn inox
  R(60,100,200,6,'#c8ccd6');R(60,100,200,1,'#ffffff');R(64,106,192,20,'#aab0bc');R(64,106,192,1,'#8a909c');for(let x=72;x<256;x+=24)R(x,108,1,16,'#9aa0ac');R(70,126,4,30,'#7a808c');R(246,126,4,30,'#7a808c');
  stool(36,146,'#e0483c','#a8302a');stool(272,146,'#e0483c','#a8302a');
  // ống đũa, lọ tương ớt
  R(76,86,8,14,'#c8ccd6');for(let k=0;k<4;k++)R(77+k*2,80,1,7,'#c8a070');R(88,88,6,12,'#d6453a');R(88,86,6,2,'#f4f1ea');
  GFX.ctx().save();GFX.ctx().translate(0,-26);
  if(dish==='comtam'){
    for(let y=-6;y<=6;y++)for(let x=-22;x<=22;x++){const d=Math.hypot(x/22,y/6);if(d<1)P(160+x,120+y,d>.82?'#c8c0b8':'#f8f6f0')}
    for(let k=0;k<30;k++)P(146+(k*7)%22,116+(k*3)%7,'#e8e2d4');R(146,115,20,8,'#f4f1ea');
    R(166,114,16,7,'#a8502a');R(166,114,16,1,'#d0784a');R(168,116,12,1,'#7a3a1e');R(170,118,8,1,'#7a3a1e');
    for(let y=-3;y<=3;y++)for(let x=-4;x<=4;x++)if(Math.hypot(x/4,y/3)<1)P(152+x,113+y,Math.hypot(x,y)<2?'#ffc94d':'#ffffff');
    R(140,117,5,3,'#ff9a5a');R(141,116,3,1,'#f4f1ea');R(176,121,4,2,'#72de90');
    R(196,118,10,6,'#f4f1ea');R(197,119,8,3,'#e8a050');
  }
  if(dish==='pho'||dish==='bunbo'){
    const broth=dish==='pho'?['#e8c890','#d8b070']:['#e8803a','#c85a2a'];
    for(let y=-9;y<=9;y++)for(let x=-18;x<=18;x++){const d=Math.hypot(x/18,y/9);if(d<1){const top=y<-1;P(160+x,118+y,top?(d>.82?'#e8e2d4':(BAYER[(118+y)&3][(160+x)&3]<.3?broth[1]:broth[0])):(d>.7?'#c8c0b8':'#f4f1ea'))}}
    R(146,111,28,1,'#f4f1ea');
    for(let k=0;k<8;k++)R(148+k*3,112+(k%2),3,2,dish==='pho'?'#a86a5a':'#8a4a3a');
    for(let k=0;k<6;k++)P(150+k*4,111,'#3f9a5a');P(158,113,'#ffffff');P(166,112,'#ffffff');
    if(dish==='bunbo'){R(162,110,6,4,'#d8a888');R(150,112,5,3,'#e8d8c8')}
    // đĩa rau thơm, chanh, ớt
    R(194,118,20,6,'#f4f1ea');for(let k=0;k<8;k++)R(196+k*2,116+(k%3),2,3,['#3f9a5a','#72de90','#4f8a3a'][k%3]);R(208,117,3,3,'#a8d84a');R(204,119,2,1,'#d6453a');
    R(130,118,8,2,'#c8ccd6');R(128,117,3,4,'#c8ccd6');
  }
  if(dish==='oc'){
    const shells=[['#c8803a','#e8b860'],['#a86a4a','#d8a078'],['#e8d8b8','#f8f0d8'],['#6a5a4a','#9a8a7a']];
    [[110,116],[136,120],[162,114],[188,120],[214,116]].forEach(([x,y],i)=>{R(x-10,y,22,6,'#f4f1ea');R(x-10,y,22,1,'#ffffff');const [a,b]=shells[i%4];for(let k=0;k<7;k++){R(x-8+(k*3)%18,y-3+(k%2),3,3,a);P(x-7+(k*3)%18,y-3+(k%2),b)}});
    R(232,112,8,12,'rgba(230,240,248,.6)');R(233,115,6,9,'#ffb057');R(244,112,8,12,'rgba(230,240,248,.6)');R(245,115,6,9,'#ff86b3');
  }
  GFX.ctx().restore();
  return c;
}
/* =================== 3. Chợ =================== */
function marketBase(){
  const c=mk();GFX.use(c.getContext('2d'));const r=rng(101);
  R(0,0,W,H,'#5a5450');for(let x=0;x<W;x+=40){R(x,0,3,96,'#3a3634');for(let k=0;k<40;k+=10)R(x+k,6,10,1,'#4a4644')}
  R(0,0,W,6,'#3a3634');for(let x=10;x<W;x+=64){R(x+20,6,1,10,'#2a2624');R(x+14,16,14,3,'#e8ecf0');R(x+10,19,22,3,'rgba(255,246,220,.25)')}
  // dãy sạp
  const stalls=[[0,70,'RAU CỦ','#3f9a5a'],[72,62,'TRỨNG - ĐẬU HŨ','#e6aa2c'],[136,70,'TRÁI CÂY','#e85a3a'],[208,60,'TẠP HÓA','#3f7ac0'],[270,50,'NHÀ THUỐC','#2f9a7a']];
  stalls.forEach(([x,w,nm,col])=>{R(x+2,40,w-4,6,col);R(x+2,40,w-4,1,'rgba(255,255,255,.35)');R(x+2,46,w-4,50,'#6a5a4a');R(x+4,48,w-8,46,'#7a6a58');
    R(x+2,96,w-4,18,'#9a7a5a');R(x+2,96,w-4,2,'#b89a78');R(x+4,114,3,10,'#5a4a3a');R(x+w-7,114,3,10,'#5a4a3a')});
  // rau củ
  for(let k=0;k<6;k++){const x=6+k*10;for(let y=-4;y<=4;y++)for(let i=-5;i<=5;i++)if(Math.hypot(i/5,y/4)<1)P(x+i+4,92+y,['#3f9a5a','#72de90','#4f8a3a','#a8d84a','#3f9a5a','#5a9a4a'][k])}
  for(let k=0;k<5;k++){R(8+k*12,76,6,6,['#e85a3a','#ff9a3a','#e85a3a','#9a4a8a','#ffc94d'][k]);P(10+k*12,75,'#3f9a5a')}
  R(10,60,50,10,'#c9a878');for(let k=0;k<8;k++)R(12+k*6,62,4,6,['#ff9a3a','#e8d8b8','#c8a070'][k%3]);
  // trứng, đậu hũ
  for(let tr=0;tr<3;tr++){R(78+tr*18,84,16,10,'#c9b898');for(let k=0;k<8;k++)R(79+tr*18+(k%4)*4,85+(k>>2)*4,3,3,'#f4e8d4')}
  R(80,66,46,12,'#f4f1ea');for(let k=0;k<5;k++)R(82+k*9,68,7,8,'#f8f4e0');
  // trái cây
  for(let k=0;k<5;k++){const x=142+k*13,col=['#ffc94d','#72de90','#e8507a','#ff9a3a','#e85a3a'][k];for(let j=0;j<3;j++)for(let i=0;i<3;i++)R(x+i*4,86+j*-3+i%2,4,4,col)}
  R(142,62,60,12,'#f4f1ea');for(let k=0;k<6;k++){R(144+k*10,64,8,8,'rgba(230,240,248,.7)');R(145+k*10,67,6,4,['#ffc94d','#e8507a','#72de90'][k%3])}
  R(178,52,20,8,'#ffc94d');text('25K',181,54,'#1d1a10');
  // tạp hóa: mì, sữa
  for(let k=0;k<5;k++){R(214+k*10,84,9,10,['#e85a3a','#ffc94d','#3f9a5a'][k%3]);R(215+k*10,86,7,3,'#f4f1ea')}
  for(let k=0;k<6;k++){R(214+k*8,62,6,10,'#f4f1ea');R(214+k*8,62,6,3,['#4f7fd0','#3f9a5a'][k%2])}
  // nhà thuốc: chữ thập xanh, tủ kính
  R(276,52,38,40,'#e8f4f0');for(let k=0;k<3;k++){R(278,58+k*11,34,1,'#9ac0b8');for(let i=0;i<5;i++)R(280+i*6,52+k*11,4,6,['#f4f1ea','#d6453a','#4f7fd0','#ffc94d','#72de90'][(i+k)%5])}
  // nền xi măng ướt
  for(let y=124;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(.4+.3*((y-124)/56),['#6a6460','#7a7470','#8a8480','#9a948e'],x,y));
  [[60,150,30],[200,162,40],[250,140,20]].forEach(([x,y,w])=>{for(let i=0;i<w;i++)for(let j=0;j<4;j++)if(Math.hypot((i-w/2)/(w/2),(j-2)/2)<1)P(x+i,y+j,BAYER[j&3][i&3]<.5?'#a8b4c0':'#8a9aa8')});
  // rổ, cân
  R(20,140,22,10,'#c9a878');for(let k=0;k<5;k++)R(21+k*4,141,2,8,'#a88a5e');R(24,134,14,6,'#3f9a5a');
  R(108,112,14,10,'#d6453a');R(110,108,10,4,'#c8ccd6');R(113,113,8,5,'#f4f1ea');
  return c;
}
function marketSigns(sick){
  const c=mk();GFX.use(c.getContext('2d'));
  [[35,'RAU CỦ','#3f9a5a'],[103,'TRỨNG - ĐẬU HŨ','#e6aa2c'],[171,'TRÁI CÂY','#e85a3a'],[238,'TẠP HÓA','#3f7ac0']].forEach(([cx,s,col])=>sign(cx,28,s,'#2c2a30','#fff3e2',3));
  const [x,w]=sign(295,28,'NHÀ THUỐC','#2f9a7a','#ffffff',3);
  // chữ thập xanh
  const cx=295,cy=20;R(cx-2,cy-5,4,10,'#3fd09a');R(cx-5,cy-2,10,4,'#3fd09a');
  if(sick){glowBox(cx-5,cy-5,10,10,'#7af0c0',.55);glowBox(x,28,w,11,'#7af0c0',.4)}
  return c;
}
function marketClosed(){
  const c=mk();GFX.use(c.getContext('2d'));
  R(0,0,W,H,'#1a1a28');for(let x=0;x<W;x+=40)R(x,0,3,96,'#2a2a38');
  R(0,30,W,94,'#5a5e68');for(let y=30;y<124;y+=4){R(0,y,W,1,'#4a4e58');R(0,y+1,W,1,'#6a6e78')}
  for(let x=0;x<W;x+=64)R(x,30,2,94,'#3a3e48');
  R(112,58,96,30,'#f4f1ea');R(112,58,96,4,'#d6453a');text('CHỢ ĐÃ ĐÓNG CỬA',160-textW('CHỢ ĐÃ ĐÓNG CỬA')/2,66,'#2c2a30');text('MỞ CỬA SÁNG - CHIỀU',160-textW('MỞ CỬA SÁNG - CHIỀU')/2,77,'#d6453a');
  for(let y=124;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(.3+.2*((y-124)/56),['#2a2a34','#34343e','#3e3e48'],x,y));
  R(30,4,10,3,'#fff4cc');R(26,7,18,2,'rgba(255,217,138,.3)');
  // con mèo ngủ trước cửa
  R(240,148,14,6,'#e6aa2c');R(252,145,5,5,'#e6aa2c');P(252,144,'#e6aa2c');P(256,144,'#e6aa2c');R(236,151,6,2,'#e6aa2c');R(244,149,6,1,'#b47c1c');
  return c;
}

/* ---------- Ghép cảnh ---------- */
let B=null;
function build(){B={street:streetBase(),sg:{},tbg:{},tfr:{},mk:marketBase(),ms:{},closed:marketClosed()};B.streetG=[0,1,2,3].map(s=>grade(B.street,s));B.mkG=[0,1,2].map(s=>grade(B.mk,s))}
const tbg=k=>B.tbg[k]||(B.tbg[k]=tableBg(k)),tfr=(k,d)=>B.tfr[k+d]||(B.tfr[k+d]=tableFront(k,d));
function frame(ctx,scene,t,o={}){
  if(!B)build();const anim=o.animate!==false;ctx.imageSmoothingEnabled=false;GFX.use(ctx);const hero=o.gender==='nu'?'nu':'nam';
  if(scene==='street'){
    const slot=o.slot||0;ctx.drawImage(B.streetG[slot],0,0);const key=slot+(slot===3?'o':'c');ctx.drawImage(B.sg[key]||(B.sg[key]=streetSigns(slot,slot===3)),0,0);
    // hai bạn ngồi trà đá
    ctx.drawImage(seatF(0,anim?Math.floor(t/1500)%2:0),219,100);ctx.save();ctx.translate(268,100);ctx.scale(-1,1);ctx.drawImage(seatF(1,anim?Math.floor(t/1700+1)%2:0),0,0);ctx.restore();
    if(slot!==3||true){const wi=anim?Math.floor(t/160)%4:0;let x=anim?((60+t/1000*7)%360)-20:60;ctx.drawImage(walker(0,wi),Math.round(x)-9,112-29+14)}
    heroAt(ctx,o,160,166,t,anim);
    if(anim){GFX.use(ctx);for(let k=0;k<4;k++){const ph=((t/1400)+k*.25)%1,x=16+k*5+Math.round(Math.sin(ph*6+k)*2),y=Math.round(98-ph*26);if(ph<.85){P(x,y,'rgba(230,230,230,.7)');P(x+1,y-1,'rgba(230,230,230,.5)')}}
      for(let k=0;k<3;k++){const ph=((t/1200)+k*.33)%1,y=Math.round(92-ph*14);P(128+k*6+Math.round(Math.sin(ph*5)),y,'rgba(255,255,255,.7)')}}
  }
  if(scene==='table'){
    const d=o.dish||'comtam',kind=DISH[d].bg;ctx.drawImage(tbg(kind),0,0);
    if(kind==='via'){GFX.use(ctx);stool(96,140,'#e0483c','#a8302a');stool(214,140,'#3f7ac0','#2a5aa0');stool(152,150,'#ffc94d','#c8901e');
      ctx.drawImage(seatF(0,anim?Math.floor(t/1500)%2:0),92,114);
      ctx.save();ctx.translate(232,114);ctx.scale(-1,1);ctx.drawImage(seatF(1,anim?Math.floor(t/1700+1)%2:0),0,0);ctx.restore();
      const me=hero==='nu'?2:3;ctx.drawImage(seatF(me,anim?Math.floor(t/1600+2)%2:0),146,124)}
    else{if(kind==='dem'){drawPerson(ctx,'khoa',100,116,t,anim);drawPerson(ctx,'linh',222,116,t,anim,true)}
      heroAt(ctx,o,160,116,t,anim)}
    ctx.drawImage(tfr(kind,d),0,0);
    if(anim&&(d==='pho'||d==='bunbo'||d==='comtam')){GFX.use(ctx);for(let k=0;k<3;k++){const ph=((t/1300)+k*.33)%1,x=152+k*8+Math.round(Math.sin(ph*6+k)*1.5),y=Math.round(84-ph*14);if(ph<.8)P(x,y,'rgba(255,255,255,.8)')}}
    if(kind==='dem'){GFX.use(ctx);for(let x=0;x<W;x+=8){const y=Math.round(20+Math.sin(x/W*Math.PI*2)*6),on=anim?((Math.floor(t/600)+x/8)%3<2):1;R(x,y+1,2,2,on?['#ffc94d','#ff86b3','#5cc8ff'][(x/8|0)%3]:'#4a3a5a')}}
  }
  if(scene==='market'){
    const slot=o.slot||0;
    if(slot===3){ctx.drawImage(B.closed,0,0);heroAt(ctx,o,160,166,t,anim);return}
    ctx.drawImage(B.mkG[slot],0,0);const k=o.sick?'s':'n';ctx.drawImage(B.ms[k]||(B.ms[k]=marketSigns(!!o.sick)),0,0);
    drawPerson(ctx,'ban1',36,110,t,anim);drawPerson(ctx,'ban2',172,110,t,anim);
    GFX.use(ctx);[[0,70],[136,70]].forEach(([x,w])=>{R(x+2,96,w-4,18,'#9a7a5a');R(x+2,96,w-4,2,'#b89a78')});
    for(let k=0;k<6;k++){const x=6+k*10;for(let y=-4;y<=4;y++)for(let i=-5;i<=5;i++)if(Math.hypot(i/5,y/4)<1)P(x+i+4,92+y,['#3f9a5a','#72de90','#4f8a3a','#a8d84a','#3f9a5a','#5a9a4a'][k])}
    for(let k=0;k<5;k++){const x=142+k*13,col=['#ffc94d','#72de90','#e8507a','#ff9a3a','#e85a3a'][k];for(let j=0;j<3;j++)for(let i=0;i<3;i++)R(x+i*4,86+j*-3+i%2,4,4,col)}
    const n=slot===0?3:slot===1?2:1;
    for(let i=0;i<n;i++){const v=[6,-5,4][i];let x=anim?(([40,260,140][i]+v*t/1000)%360+360)%360-20:[40,260,140][i];const im=walker(i,anim?Math.floor(t/160+i)%4:0);
      if(v<0){ctx.save();ctx.translate(Math.round(x)+10,134-29+i*6);ctx.scale(-1,1);ctx.drawImage(im,0,0);ctx.restore()}else ctx.drawImage(im,Math.round(x)-9,134-29+i*6)}
    heroAt(ctx,o,160,166,t,anim);
    if(o.sick&&anim){GFX.use(ctx);if(Math.floor(t/500)%2){R(286,104,18,2,'#7af0c0')}}
  }
}
Scenes.food=frame;
})();
