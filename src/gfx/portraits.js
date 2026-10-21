/* 30 Ngày Sài Gòn · đồ họa: 7 chân dung 48×48 có biểu cảm, từ design/10-hoi-thoai-chan-dung.html (giống design/12) */
const Portraits=(()=>{
const {W,H,BAYER,rng,mk,R,P,shade,dith,outlined}=GFX;
const EYE='#241a2a',MO='#9a4636',BL='#f39a9a';
/* ---------- khuôn mặt dùng chung (8 chân dung, thêm Ngân ở bản chơi thử 2) ---------- */
function face(S){const [sk,skD,skL,skS]=S;
  R(20,31,8,6,skD);R(20,31,2,6,sk);R(21,35,6,1,skS);
  R(9,19,3,7,sk);R(9,19,1,7,skL);R(10,21,1,3,skD);R(36,19,3,7,skD);R(37,21,1,3,skS);
  R(12,12,24,20,sk);R(13,32,22,1,sk);R(15,33,18,1,sk);R(11,15,1,13,sk);R(36,15,1,13,sk);
  R(11,15,2,13,skL);R(33,14,3,18,skD);R(31,30,4,3,skD);R(17,33,14,1,skD)}
function expr(S,o,ex){const [sk,skD,skL,skS]=S,br=o.brow||'#24150e',old=o.old;
  // lông mày
  const bw=ex.brow||'n';
  if(bw==='n'){R(15,17,5,1,br);R(28,17,5,1,br)}
  if(bw==='up'){R(15,16,5,1,br);R(28,16,5,1,br);P(14,17,br);P(33,17,br)}
  if(bw==='worry'){R(16,16,3,1,br);P(15,17,br);P(19,15,br);R(29,16,3,1,br);P(32,17,br);P(28,15,br)}
  if(bw==='stern'){R(15,16,2,1,br);R(17,17,3,1,br);R(31,16,2,1,br);R(28,17,3,1,br)}
  // mắt
  const ey=ex.eyes||'o';
  if(ey==='o'){if(old){[[15],[28]].forEach(([x])=>{R(x+1,20,3,1,EYE);R(x,21,5,3,EYE);R(x+1,21,2,1,'#ffffff');R(x+1,25,3,1,skD)})}
    else{[[15],[28]].forEach(([x])=>{R(x+1,19,3,1,EYE);R(x,20,5,4,EYE);R(x+1,24,3,1,EYE);R(x+1,20,2,2,'#ffffff');P(x+3,23,'#6a7ab0')});if(o.lash){P(14,19,EYE);P(13,20,EYE);P(33,19,EYE);P(34,20,EYE)}}}
  if(ey==='happy'){[[15],[28]].forEach(([x])=>{P(x,22,EYE);R(x+1,21,3,1,EYE);P(x+4,22,EYE)})}
  if(ey==='wide'){[[15],[28]].forEach(([x])=>{R(x+1,18,3,1,EYE);R(x,19,5,5,EYE);R(x+1,24,3,1,EYE);R(x+1,19,2,2,'#ffffff');P(x+3,22,'#ffffff')})}
  if(o.glasses==='round'){[[14],[27]].forEach(([x])=>{const g='#5a3a2a';R(x+2,17,3,1,g);R(x+2,26,3,1,g);R(x,19,1,5,g);R(x+6,19,1,5,g);P(x+1,18,g);P(x+5,18,g);P(x+1,25,g);P(x+5,25,g);R(x+2,18,2,1,'rgba(255,255,255,.55)')});R(21,21,6,1,'#5a3a2a')}
  else if(o.glasses){[[14],[27]].forEach(([x])=>{R(x,18,7,1,'#2a2a38');R(x,25,7,1,'#2a2a38');R(x,18,1,8,'#2a2a38');R(x+6,18,1,8,'#2a2a38');R(x+1,19,2,1,'rgba(255,255,255,.6)')});R(21,20,6,1,'#2a2a38')}
  // má, mũi, miệng
  if(ex.blush!==false)[[13,26],[30,26]].forEach(([x,y])=>{R(x+1,y,3,2,BL);P(x,y+1,BL);P(x+4,y,BL)});
  P(24,26,skD);P(23,27,skS);
  const m=ex.mouth||'smile';
  if(m==='smile'){R(21,29,6,1,MO);P(20,28,MO);P(27,28,MO)}
  if(m==='open'){R(21,29,6,1,MO);R(22,30,4,2,'#c85a4a');R(22,31,4,1,MO);P(20,28,MO);P(27,28,MO)}
  if(m==='grin'){R(20,28,8,1,MO);R(21,29,6,2,'#ffffff');R(20,29,1,1,MO);R(27,29,1,1,MO);R(21,31,6,1,MO)}
  if(m==='flat')R(21,29,6,1,MO);
  if(m==='worry'){R(22,29,4,1,MO);P(21,30,MO);P(26,30,MO)}
  if(m==='o'){R(23,28,3,3,MO);P(24,29,'#c85a4a')}
  if(ex.sweat){R(36,12,2,4,'#9ad6ff');P(36,11,'#9ad6ff');P(37,16,'#ffffff')}
  if(ex.spark){[[6,8],[40,10],[42,4]].forEach(([x,y])=>{P(x,y,'#ffc94d');P(x-1,y,'#fff0a0');P(x+1,y,'#fff0a0');P(x,y-1,'#fff0a0');P(x,y+1,'#fff0a0')})}
  if(old){R(15,26,4,1,skD);R(29,26,4,1,skD)}
}
/* ---------- tóc và trang phục từng nhân vật ---------- */
const CH={
  me:{n:'Mẹ',role:'mẹ ở Tuy Hòa',bg:['#f8dce2','#f4c8d0','#eab4c0'],S:['#eebc94','#cc9670','#fad4b0','#b07c58'],old:1,brow:'#3a2418',
    hair(){R(33,4,10,10,'#3a2418');R(35,3,6,1,'#3a2418');R(37,6,4,3,'#5a3a28');
      R(11,6,26,9,'#3a2418');R(13,4,22,2,'#3a2418');R(16,3,16,1,'#3a2418');R(10,9,3,14,'#3a2418');R(35,9,3,14,'#3a2418');
      R(23,4,2,8,'#24150e');R(13,12,10,2,'#3a2418');R(25,12,10,2,'#3a2418');R(12,14,4,2,'#3a2418');R(32,14,4,2,'#3a2418');
      R(15,6,6,1,'#5a3a28');R(27,6,6,1,'#5a3a28');P(30,8,'#a8a098');P(18,9,'#a8a098');P(10,22,'#ffc94d');P(37,22,'#ffc94d')},
    cloth(){R(7,39,34,9,'#c97aa8');R(9,37,30,2,'#c97aa8');R(7,39,3,9,'#e8a0c8');R(36,39,5,9,'#a85a88');R(18,36,12,3,'#f4e0ec');R(21,38,6,2,'#cc9670');
      for(let k=0;k<12;k++)P(10+((k*7)%28),40+((k*5)%7),k%2?'#ffffff':'#ffd0e8')}},
  tu:{n:'Cô Tư',role:'chủ nhà trọ',bg:['#d8ece2','#bcdccc','#a6cdbd'],S:['#e0ac82','#b98060','#f2c49c','#9a6a4a'],old:1,brow:'#2a1810',
    hair(){const curl=(x,y,r,c)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r)P(x+i,y+j,c)};
      [[13,9],[18,6],[24,5],[30,6],[35,9],[11,14],[37,14],[10,19],[38,19],[16,11],[24,9],[32,11]].forEach(([x,y],k)=>curl(x,y,4,k%3?'#3a2418':'#4a3020'));
      [[18,5],[25,4],[31,6],[13,10],[36,12]].forEach(([x,y])=>{P(x,y,'#7a5a40');P(x+1,y,'#7a5a40')});R(14,13,20,2,'#3a2418');P(10,23,'#ffc94d');P(37,23,'#ffc94d');P(10,24,'#e6aa2c');P(37,24,'#e6aa2c')},
    cloth(){R(7,39,34,9,'#3f9a8a');R(9,37,30,2,'#3f9a8a');R(7,39,3,9,'#6ac0b0');R(36,39,5,9,'#2a7a6e');R(19,36,10,3,'#3f9a8a');R(21,37,6,2,'#b98060');
      for(let k=0;k<10;k++){const x=10+((k*9)%28),y=40+((k*3)%6);P(x,y,'#e85a5a');P(x+1,y,'#ff8a8a');P(x,y+1,'#ff8a8a')}R(19,38,10,1,'#ffc94d');P(24,39,'#ffc94d');
      R(36,40,6,3,'#c8c8d0');R(38,43,2,3,'#ffc94d');P(37,41,'#ffffff')}},
  hai:{n:'Thầy Hải',role:'cố vấn học tập',bg:['#d4e2f6','#bcd0ee','#a4bee6'],S:['#e8b890','#c99872','#f6d0ac','#a87c5e'],glasses:1,brow:'#2a2420',
    hair(){R(11,5,26,8,'#2a2420');R(13,3,22,2,'#2a2420');R(16,2,16,1,'#2a2420');R(10,8,3,12,'#2a2420');R(35,8,3,12,'#2a2420');
      R(13,12,9,3,'#2a2420');R(22,12,14,2,'#2a2420');R(30,13,6,2,'#2a2420');R(20,4,1,8,'#4a4038');R(14,6,5,1,'#4a4038');
      R(10,14,2,6,'#c8c4c0');R(36,14,2,6,'#c8c4c0');R(10,12,1,2,'#a8a4a0');R(37,12,1,2,'#a8a4a0')},
    cloth(){R(7,39,34,9,'#7a8494');R(9,37,30,2,'#7a8494');R(7,39,3,9,'#9aa4b4');R(36,39,5,9,'#5a6474');
      R(17,36,14,12,'#f2f0ea');R(17,36,3,4,'#ffffff');R(28,36,3,4,'#ffffff');R(22,38,4,2,'#c99872');R(22,40,4,8,'#3a5ea8');R(23,40,2,1,'#5a7ec8');R(21,47,6,1,'#2a4a88')}},
  mai:{n:'Chị Mai',role:'quản lý cửa hàng',bg:['#d6eedc','#c8e8d0','#a8d8b8'],S:['#eebc94','#cc9670','#fad4b0','#b07c58'],lash:1,brow:'#24150e',
    hair(){R(36,10,6,4,'#2a1a12');R(38,14,5,14,'#2a1a12');R(39,26,3,4,'#170e0a');R(36,11,3,3,'#3f9a5a');
      R(11,5,26,9,'#2a1a12');R(13,3,22,2,'#2a1a12');R(16,2,16,1,'#2a1a12');R(10,8,3,14,'#2a1a12');R(35,8,3,13,'#2a1a12');
      R(12,13,16,2,'#2a1a12');R(12,15,10,1,'#2a1a12');R(12,16,5,1,'#2a1a12');R(32,13,4,4,'#2a1a12');R(14,5,8,1,'#5a3a28');R(12,7,5,2,'#5a3a28');P(10,23,'#f4f1ea');P(37,23,'#f4f1ea')},
    cloth(){R(7,39,34,9,'#3f9a5a');R(9,37,30,2,'#3f9a5a');R(7,39,3,9,'#6aca8a');R(36,39,5,9,'#2f7a46');R(17,36,6,4,'#e8f4ea');R(25,36,6,4,'#e8f4ea');R(22,38,4,2,'#cc9670');R(23,40,2,5,'#2f7a46');
      R(29,41,7,3,'#f4f1ea');R(29,41,1,3,'#3f9a5a');R(31,42,4,1,'#9a9aa8')}},
  linh:{n:'Chị Linh',role:'trưởng CLB âm nhạc',bg:['#e6dcf6','#d8c8f0','#c4b0e8'],S:['#f2c7a0','#d09a74','#ffdcbc','#b9805e'],lash:1,brow:'#3a2016',
    hair(){R(30,0,8,6,'#5a3424');R(36,4,6,12,'#5a3424');R(38,14,4,8,'#3a2016');R(31,2,3,3,'#ffc94d');
      R(11,5,26,9,'#5a3424');R(13,3,22,2,'#5a3424');R(16,2,16,1,'#5a3424');R(10,8,3,14,'#5a3424');R(35,8,3,12,'#5a3424');
      R(12,13,24,3,'#5a3424');for(let x=12;x<36;x+=3)P(x+1,16,'#5a3424');R(14,5,8,1,'#8a5a40');R(13,7,4,2,'#8a5a40');P(10,23,'#ff86b3')},
    cloth(){R(7,39,34,9,'#9a6ad0');R(9,37,30,2,'#9a6ad0');R(7,39,3,9,'#c09af0');R(36,39,5,9,'#7a4ab0');R(19,36,10,2,'#9a6ad0');R(21,37,6,2,'#d09a74');
      R(21,42,6,5,'#ffc94d');P(23,41,'#ffc94d');P(24,40,'#ffc94d');R(22,43,1,1,'#9a6ad0');
      R(11,35,26,3,'#2c3550');R(9,34,4,6,'#2c3550');R(35,34,4,6,'#2c3550');R(10,35,2,4,'#5a6488');R(36,35,2,4,'#5a6488')}},
  khoa:{n:'Khoa',role:'bạn cùng phòng',bg:['#fbe2d0','#f8d0b8','#f0b898'],S:['#e0ac82','#b98060','#f2c49c','#9a6a4a'],brow:'#100b08',
    hair(){R(11,6,26,8,'#1e1612');R(13,4,22,2,'#1e1612');R(16,3,16,1,'#1e1612');R(10,9,3,12,'#1e1612');R(35,9,3,12,'#1e1612');
      [[13,13,3],[17,13,4],[21,13,2],[25,13,4],[29,13,3],[33,13,2]].forEach(([x,y,h])=>R(x,y,3,h,'#1e1612'));
      [[14,1],[19,0],[24,1],[29,0],[33,2]].forEach(([x,y])=>{R(x,y,3,4,'#1e1612');P(x+1,y-1,'#1e1612')});R(16,5,6,1,'#4a3628');R(27,6,5,1,'#4a3628')},
    cloth(){R(7,39,34,9,'#e06a5a');R(9,37,30,2,'#e06a5a');R(7,39,3,9,'#f8907c');R(36,39,5,9,'#b44a40');R(19,36,10,2,'#e06a5a');R(21,37,6,2,'#b98060');
      R(19,41,10,6,'#f4f1ea');R(21,42,6,4,'#2c3550');P(23,43,'#ffc94d');P(24,44,'#ffc94d')}},
  /* Ngân: tóc ngắn ngang vai, mái thưa, kính tròn, áo cardigan vàng nhạt, nền xanh ngọc */
  ngan:{n:'Ngân',role:'bạn cùng lớp',bg:['#d2f0ee','#b8e6e2','#9ed8d4'],S:['#f2c7a0','#d09a74','#ffdcbc','#b9805e'],lash:1,glasses:'round',brow:'#2a1a12',
    hair(){const h='#2a1a12',hL='#5a3a28';
      R(11,5,26,9,h);R(13,3,22,2,h);R(16,2,16,1,h);R(9,9,4,22,h);R(35,9,4,22,h);R(8,26,5,6,h);R(35,26,5,6,h);R(9,31,4,1,'#170e0a');R(35,31,4,1,'#170e0a');
      R(12,13,24,2,h);for(let x=12;x<36;x+=4)R(x,15,3,1,h);R(14,4,8,1,hL);R(12,7,5,2,hL);R(30,5,4,1,hL);R(31,6,3,2,'#ff86b3');P(32,6,'#ffd0e0')},
    cloth(){R(7,39,34,9,'#f2dc8c');R(9,37,30,2,'#f2dc8c');R(7,39,3,9,'#fff0b8');R(36,39,5,9,'#d4b860');
      R(18,36,12,12,'#f4f1ea');R(21,38,6,2,'#d09a74');R(23,40,2,8,'#e8e2d6');R(18,36,2,12,'#e6cc74');R(28,36,2,12,'#e6cc74');
      for(let y=40;y<48;y+=3){P(17,y,'#a88a3c');P(30,y,'#a88a3c')}R(31,42,5,4,'#4f7fd0');R(31,42,5,1,'#86afee')}},
  self:{n:'Minh',role:'nhân vật chính',bg:['#d4e4f6','#bcd4ee','#a6c4e6'],S:['#f2c7a0','#d09a74','#ffdcbc','#b9805e'],brow:'#24150e',
    hair(o,back){const h='#3b2418',hD='#24150e',hL='#6e4630';
      if(back){if(o.gender==='nu')R(9,8,30,30,hD);return}
      R(10,5,28,8,h);R(12,3,24,2,h);R(15,2,18,1,h);R(9,8,2,12,h);R(37,8,2,12,h);
      if(o.gender==='nu'){R(7,14,6,27,h);R(35,14,6,27,h);R(12,13,20,2,h);R(12,15,13,1,h);R(12,16,8,1,h);R(31,13,3,3,h);R(34,13,3,6,h);R(30,9,5,2,'#ffc94d')}
      else{[[12,13,3],[15,13,4],[19,13,2],[22,13,3],[26,13,4],[30,13,2],[33,13,3]].forEach(([x,y,hh],i)=>R(x,y,i%2?3:4,hh,h));R(26,0,3,3,h);R(24,1,2,2,h)}
      R(28,4,9,9,hD);R(14,4,8,1,hL);R(12,6,6,1,hL);R(20,5,5,1,hL)},
    cloth(){R(7,39,34,9,'#4f7fd0');R(9,37,30,2,'#4f7fd0');R(7,39,3,9,'#86afee');R(36,39,5,9,'#3a5ea8');R(19,36,10,3,'#f4f1ea');R(22,38,4,2,'#d09a74');
      R(12,37,4,11,'#e6aa2c');R(32,37,4,11,'#e6aa2c');R(12,37,1,11,'#ffd468');R(35,37,1,11,'#b47c1c')}},
};
const EX={normal:{},happy:{eyes:'happy',mouth:'open'},worry:{brow:'worry',mouth:'worry'},stern:{brow:'stern',mouth:'flat'},excited:{eyes:'wide',brow:'up',mouth:'open',spark:1},awkward:{brow:'worry',mouth:'grin',sweat:1},grin:{mouth:'grin',brow:'up'}};
const CACHE={};
function bust(id,ex,opt={}){
  const key=id+ex+(opt.gender||'')+(opt.blink?'b':'');if(CACHE[key])return CACHE[key];
  const o=CH[id],S=o.S,e={...EX[ex]};if(opt.blink&&e.eyes!=='happy')e.eyes='blink';
  const c=outlined(48,48,()=>{if(id==='self')o.hair(opt,true);o.cloth();face(S);o.hair(opt,false);
    if(e.eyes==='blink'){e.eyes='x';expr(S,o,e);[[15],[28]].forEach(([x])=>R(x,22,5,1,EYE))}else expr(S,o,e)});
  return CACHE[key]=c;
}
function draw(ctx,id,ex,opt={}){
  const o=CH[id];ctx.imageSmoothingEnabled=false;
  for(let i=0;i<3;i++){ctx.fillStyle=o.bg[i];ctx.fillRect(0,i*16,48,16)}
  ctx.fillStyle='rgba(255,255,255,.35)';for(let y=2;y<48;y+=6)for(let x=(y/6%2)*3+1;x<48;x+=6)ctx.fillRect(x,y,1,1);
  ctx.drawImage(bust(id,ex,opt),0,0);
}

/* Ảnh dữ liệu cho thẻ <img> trong giao diện, lưu đệm theo nhân vật, biểu cảm, giới tính */
const URLS={};
function url(id,ex='normal',opt={}){const k=id+ex+(opt.gender||'');if(URLS[k])return URLS[k];
  const c=mk(48,48);draw(c.getContext('2d'),id,ex,opt);return URLS[k]=c.toDataURL()}
return {CH,EX,bust,draw,url};
})();
