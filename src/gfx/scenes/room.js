/* 30 Ngày Sài Gòn · cảnh phòng trọ (design/04): căn phòng, 3 mức bừa bộn (opt.mess 0–2), quạt, Khoa ngủ giường trên.
 * Phòng không có bản riêng cho từng buổi nên phủ màu theo buổi bằng GFX.grade (DESIGN_SPEC mục 1). */
(()=>{
const {W,H,BAYER,rng,mk,R,P,shade,dith,outlined}=GFX;
const {heroAt}=Chars;
const GRADE=[[1,.98,.96],[1,1,1],[1,.88,.8],[.5,.5,.72]];
const GCACHE={};
const graded=(src,k,slot)=>GCACHE[k+'-'+slot]||(GCACHE[k+'-'+slot]=GFX.grade(src,slot,GRADE));
/* ---------- Tường, trần, sàn gạch bông ---------- */
const FLOOR=116;
function drawRoom(){
  const r=rng(12);
  // tường xanh bạc hà, sáng dần về phía cửa sổ
  for(let y=0;y<FLOOR;y++)for(let x=0;x<W;x++){
    const v=.3+.45*(1-Math.min(1,Math.abs(x-205)/190))+.12*(y/FLOOR)-(y<8?.25:0);
    P(x,y,shade(v,['#5f8c80','#719f92','#82b0a2','#93bfb0','#a6cdbd','#bcdccc'],x,y));
  }
  R(0,0,W,6,'#4e7569');R(0,6,W,1,'#3e5f56');
  for(let k=0;k<10;k++){const x=Math.floor(r()*W),y=80+Math.floor(r()*30);dith(x,y,3+Math.floor(r()*5),2+Math.floor(r()*3),'#7aa496',.3)}
  // dây điện và ổ cắm trên tường
  R(0,10,W,1,'#3b4a52');for(let x=0;x<W;x+=26)R(x,9,2,3,'#d8d2c4');
  R(156,10,1,78,'#3b4a52');R(153,86,6,5,'#e8e2d4');P(155,88,'#3b4a52');P(157,88,'#3b4a52');
  // chân tường
  R(0,FLOOR-4,W,4,'#567d72');R(0,FLOOR-4,W,1,'#7ea698');
  // sàn gạch bông 16×16, tông dịu, tối dần về phía tường
  const T=16;
  for(let y=FLOOR;y<H;y++)for(let x=0;x<W;x++){
    const tx=((x%T)+T)%T,ty=((y-FLOOR)%T),cx=Math.min(tx,T-1-tx),cy=Math.min(ty,T-1-ty);
    const dc=Math.hypot(tx-7.5,ty-7.5);
    let k=0; // 0 nền, 1 hoa văn nhạt, 2 hoa văn đậm, 3 ron
    if(cx+cy<3)k=2;else if(dc<2.2)k=2;else if(Math.abs(dc-5.2)<.7)k=1;
    if(tx===0||ty===0)k=3;
    const front=(y-FLOOR)/(H-FLOOR);
    const base=[['#c9b896','#d8c8a6','#e6d8bc','#efe4cc'],['#b59a7c','#c4a888','#d2b898','#dcc4a4'],['#8e6a56','#a07a62','#b08a6e','#bc9878'],['#a8987a','#b4a486','#c0b092','#c8b89a']][k];
    P(x,y,shade(.25+.7*front,base,x,y));
  }
}
/* ---------- Đồ đạc ---------- */
function drawWindow(){
  const x0=172,y0=20,w=60,h=52;
  // khung và bậu cửa
  R(x0-4,y0-4,w+8,h+8,'#3f6f9e');R(x0-4,y0-4,w+8,1,'#6a9ccc');R(x0-4,y0+h+3,w+8,1,'#284a6e');
  // bầu trời buổi sáng
  for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)P(x,y,shade(1-(y-y0)/h,['#d6ecf4','#b8dcf2','#9ccaee','#86bbe8'],x,y));
  // tường nhà hàng xóm, cục nóng máy lạnh, dây điện
  R(x0,y0+22,w,h-22,'#e6cf94');R(x0,y0+22,w,1,'#f6e2ae');
  for(let y=y0+26;y<y0+h;y+=6)R(x0,y,w,1,'#d4ba7c');
  dith(x0+38,y0+30,18,20,'#c8ab6c',.35);
  R(x0+6,y0+30,18,12,'#cfd2d6');R(x0+6,y0+30,18,1,'#eef0f2');R(x0+6,y0+41,18,1,'#9aa0a8');
  for(let a=0;a<12;a++){const ang=a/12*Math.PI*2;P(Math.round(x0+15+Math.cos(ang)*4),Math.round(y0+36+Math.sin(ang)*4),'#7a808a')}
  P(x0+15,y0+36,'#5a606a');
  for(let x=x0;x<x0+w;x++){P(x,Math.round(y0+10+Math.sin((x-x0)/w*Math.PI)*4),'#2a2f3a');P(x,Math.round(y0+14+Math.sin((x-x0)/w*Math.PI)*5),'#2a2f3a')}
  // chậu hoa giấy ở bậu cửa ngoài
  R(x0+40,y0+h-8,10,6,'#b4573e');R(x0+40,y0+h-8,10,1,'#d47a5c');
  [[41,-12],[44,-14],[47,-12],[43,-10],[48,-15],[39,-9],[46,-10]].forEach(([dx,dy],i)=>{R(x0+dx,y0+h+dy,2,2,i%2?'#e04f86':'#ff7fae')});
  R(x0+44,y0+h-10,1,2,'#3f7a52');
  // song sắt
  for(let x=x0+5;x<x0+w;x+=7)R(x,y0,1,h,'#24384e');
  R(x0,y0+18,w,1,'#24384e');R(x0,y0+36,w,1,'#24384e');
  R(x0+w/2-1,y0,2,h,'#3f6f9e');
  // rèm vải vàng mù tạt kéo sang trái
  for(let y=y0-6;y<y0+h+6;y++){const wv=12+Math.round(Math.sin(y/5)*1.5);for(let x=x0-8;x<x0-8+wv;x++){
    const v=.5+.4*Math.sin((x-x0)/2.2);P(x,y,shade(v,['#a8761a','#c98f22','#e6aa2c','#f5c860'],x,y))}}
  R(x0-10,y0-7,w+20,2,'#5a3b28');R(x0-10,y0-7,w+20,1,'#8a5a3a');
  R(x0-4,y0+h+4,w+8,3,'#e8e2d4');R(x0-4,y0+h+4,w+8,1,'#ffffff');
}
function drawDesk(){
  const x0=158,top=86;
  R(x0,top,86,5,'#b07a4a');R(x0,top,86,1,'#d49a64');R(x0,top+5,86,4,'#8a5a36');R(x0,top+8,86,1,'#6a4428');
  R(x0+2,top+9,3,FLOOR-top-9,'#6a4428');R(x0+81,top+9,3,FLOOR-top-9,'#6a4428');
  R(x0+56,top+9,22,12,'#7a4e30');R(x0+56,top+9,22,1,'#9a6a44');R(x0+65,top+14,4,1,'#d8c08a');
  // sách
  [['#d65a5a',3,12],['#4f7fd0',3,10],['#e6aa2c',2,13],['#3f7a70',3,11]].forEach(([c,w,h],i,a)=>{const x=x0+6+a.slice(0,i).reduce((s,b)=>s+b[1],0);R(x,top-h,w,h,c);R(x,top-h,1,h,'rgba(255,255,255,.35)')});
  R(x0+20,top-3,12,3,'#f4ecda');R(x0+20,top-3,12,1,'#ffffff');
  // laptop (nhìn từ phía sau màn hình), có miếng dán
  R(x0+34,top-15,22,14,'#b8bcc8');R(x0+34,top-15,22,1,'#dfe2ea');R(x0+55,top-15,1,14,'#8e92a0');
  R(x0+42,top-10,5,5,'#ffc94d');P(x0+44,top-9,'#d65a5a');R(x0+32,top-1,26,1,'#8e92a0');
  // đèn bàn
  R(x0+72,top-3,8,3,'#2c3550');R(x0+75,top-16,1,13,'#2c3550');R(x0+75,top-17,7,1,'#2c3550');R(x0+79,top-17,5,4,'#2c3550');R(x0+80,top-13,3,1,'#ffe7a8');
  // cốc cà phê
  R(x0+63,top-6,6,6,'#f4f1ea');R(x0+63,top-6,6,1,'#5a3a2a');R(x0+69,top-5,2,3,'#f4f1ea');
}
function drawStool(){const x0=190,y0=100;
  R(x0,y0,20,3,'#e0483c');R(x0,y0,20,1,'#ff7a6a');R(x0+1,y0+3,18,1,'#a8302a');
  R(x0+2,y0+3,3,FLOOR+2-y0-3,'#c83a30');R(x0+15,y0+3,3,FLOOR+2-y0-3,'#a8302a');R(x0+5,y0+10,10,2,'#c83a30');}
function drawDoor(){const x0=98,y0=28;
  R(x0-3,y0-3,38,FLOOR-y0+3,'#6a4428');R(x0,y0,32,FLOOR-y0,'#a8744a');R(x0,y0,32,1,'#c8946a');R(x0+31,y0,1,FLOOR-y0,'#7a4e30');
  [[4,6,24,30],[4,44,24,36]].forEach(([dx,dy,w,h])=>{R(x0+dx,y0+dy,w,h,'#94643e');R(x0+dx,y0+dy,w,1,'#7a4e30');R(x0+dx,y0+dy+h-1,w,1,'#c08a5e')});
  R(x0+25,y0+44,3,3,'#e6c46a');P(x0+25,y0+44,'#fff0a0');
  // dép ở cửa
  [[x0+4,'#4f7fd0'],[x0+18,'#e06a5a']].forEach(([x,c])=>{R(x,FLOOR+2,4,2,c);R(x+5,FLOOR+3,4,2,c)});
  // mũ bảo hiểm treo
  const hx=137,hy=58;R(hx,hy,10,6,'#ffc94d');R(hx+1,hy-1,8,1,'#ffc94d');R(hx,hy+6,11,1,'#c8901e');R(hx+1,hy,3,2,'#fff0a0');P(hx+5,hy-3,'#3b4a52');R(hx+5,hy-2,1,1,'#3b4a52');
}
function drawWallDecor(){
  // lịch bloc: tờ ngày 1
  const cx=138,cy=26;R(cx,cy,14,20,'#f4f1ea');R(cx,cy,14,5,'#d6453a');R(cx,cy+19,14,1,'#c8c0b4');R(cx+6,cy-2,2,2,'#3b4a52');
  R(cx+6,cy+8,2,8,'#d6453a');P(cx+5,cy+9,'#d6453a');R(cx+5,cy+15,4,1,'#d6453a');
  // đồng hồ treo tường 7 giờ
  const ox=152,oy=18;for(let y=-5;y<=5;y++)for(let x=-5;x<=5;x++){const d=Math.hypot(x,y);if(d<5.5)P(ox+x,oy+y,d>4.4?'#2c3550':'#f4f1ea')}
  R(ox,oy-3,1,3,'#2c3550');P(ox-1,oy+1,'#d6453a');P(ox-2,oy+2,'#d6453a');
  // ảnh và bản phác thảo ghim trên tường giữa hai tầng giường
  R(14,68,70,1,'#5a3b28');
  [[18,'#f4f1ea','#86bbe8'],[34,'#f4f1ea','#e6aa2c'],[52,'#f4f1ea','#ff86b3'],[68,'#f4f1ea','#72de90']].forEach(([x,f,c],i)=>{
    R(x,70+(i%2),12,14,f);R(x+1,71+(i%2),10,9,c);R(x+5,69+(i%2),2,2,'#d6453a');
    if(i===0){R(x+3,74,2,2,'#f2c7a0');R(x+7,74,2,2,'#f2c7a0');R(x+2,76,8,4,'#3a5ea8')}
    if(i===1){R(x+2,73,8,1,'#2c3550');R(x+3,75,5,4,'#2c3550');R(x+4,76,3,2,'#e6aa2c')}
  });
}
function drawBunk(){
  const L=6,Rr=90,top=18,c='#3a4466',hi='#5a6a9a',lo='#262d48';
  // giường dưới
  R(L+4,92,Rr-L-4,8,'#e8eef8');R(L+4,92,Rr-L-4,1,'#ffffff');
  for(let x=L+30;x<Rr-2;x+=6)for(let y=93;y<100;y+=6){R(x,y,3,3,'#5a8ad0');R(x+3,y+3,3,3,'#5a8ad0')}
  R(L+6,86,20,7,'#f4f1ea');R(L+6,86,20,1,'#ffffff');R(L+6,92,20,1,'#c8c0b4');
  R(L+50,88,22,5,'#4f7fd0');R(L+50,88,22,1,'#86afee');R(L+50,92,22,1,'#3a5ea8');
  R(L,100,Rr-L,3,c);R(L,100,Rr-L,1,hi);
  // vali và hộp dưới gầm
  R(28,104,30,12,'#c8463c');R(28,104,30,1,'#e86a5a');R(40,102,6,2,'#2c2a40');R(28,110,30,1,'#a8302a');
  R(62,108,18,8,'#c9a878');R(62,108,18,1,'#e2c49a');R(70,108,2,8,'#a88a5e');
  // giường trên: Khoa đang ngủ
  R(L+4,48,Rr-L-4,6,'#e8eef8');
  R(L+30,40,50,9,'#e07a4a');R(L+30,40,50,1,'#ff9a6a');R(L+30,48,50,1,'#b45a34');
  for(let x=L+34;x<L+78;x+=8)R(x,43,4,1,'#f2a070');
  R(L+6,40,20,9,'#f4f1ea');R(L+6,40,20,1,'#ffffff');
  R(L+14,36,14,8,'#1e1612');R(L+15,35,10,1,'#1e1612');R(L+22,40,5,4,'#e0ac82');P(L+24,41,'#1e1612');
  R(L+26,44,6,4,'#e0ac82');
  R(L,54,Rr-L,3,c);R(L,54,Rr-L,1,hi);R(L,26,Rr-L,2,c);R(L,26,Rr-L,1,hi);
  for(let x=L+6;x<Rr-4;x+=8)R(x,28,1,12,c);
  // áo vắt trên thành giường
  R(60,54,12,10,'#7ec0a8');R(60,54,12,1,'#a8e0c8');R(62,64,8,2,'#5a9a84');
  // cột và thang
  [L,Rr-4].forEach(x=>{R(x,top,4,FLOOR+2-top,c);R(x,top,1,FLOOR+2-top,hi);R(x+3,top,1,FLOOR+2-top,lo)});
  for(let y=62;y<100;y+=9)R(Rr-12,y,8,2,c);R(Rr-12,56,1,44,c);
}
function drawFan(){const x0=256;R(x0-6,FLOOR,13,3,'#2c3550');R(x0-5,FLOOR,11,1,'#4a5578');R(x0,78,2,FLOOR-78,'#c8ccd6');R(x0,78,1,FLOOR-78,'#ffffff')}
function drawFanHead(t){const x0=257,y0=72,o=Math.round(Math.sin(t/1400)*2);GFX.ctx().save&&0;
  for(let y=-8;y<=8;y++)for(let x=-8;x<=8;x++){const d=Math.hypot(x/(1-Math.abs(o)*.06),y);if(d<8.5){
    const ring=d>7.4,blade=((Math.atan2(y,x)+t/60)%(Math.PI*2/3)+Math.PI*2)%(Math.PI*2/3)<.9;
    P(x0+x+o,y0+y,ring?'#4a5578':(d<2?'#e6aa2c':(blade?'#cfe2ee':'#9ab0c4')))}}
  for(let k=-6;k<=6;k+=3)R(x0+o+k,y0-7,1,15,'rgba(44,53,80,.35)');}
function drawKitchen(){
  const x0=268;
  R(x0,90,48,26,'#9a6a40');R(x0,90,48,2,'#c8946a');R(x0+23,92,1,24,'#7a4e30');R(x0+10,100,4,1,'#e6c46a');R(x0+33,100,4,1,'#e6c46a');
  // kệ treo và gia vị
  R(x0,56,48,3,'#8a5a36');R(x0,56,48,1,'#b07a4a');
  [['#6a3a1e',4,10],['#e6c04a',4,12],['#f4f1ea',5,7],['#d6453a',4,8],['#3f7a52',3,9]].forEach(([c,w,h],i)=>{const x=x0+3+i*9;R(x,56-h,w,h,c);R(x,56-h,1,h,'rgba(255,255,255,.35)');R(x+1,56-h-2,w-2,2,'#2c2a40')});
  // nồi cơm điện
  R(x0+3,78,15,12,'#f4f1ea');R(x0+4,76,13,2,'#f4f1ea');R(x0+3,78,15,1,'#ffffff');R(x0+15,79,3,11,'#cfc8bc');R(x0+8,84,4,2,'#d6453a');R(x0+8,74,5,2,'#cfc8bc');
  // bếp điện và nồi
  R(x0+21,86,14,4,'#2c2a40');R(x0+22,86,12,1,'#4a4862');R(x0+23,78,10,8,'#c8ccd6');R(x0+23,78,10,1,'#ffffff');R(x0+21,79,2,2,'#2c2a40');R(x0+33,79,2,2,'#2c2a40');R(x0+26,76,4,2,'#9aa0a8');
  // thùng mì gói
  R(x0+37,76,10,14,'#c9a878');R(x0+37,76,10,1,'#e2c49a');R(x0+38,80,8,5,'#e85a3a');R(x0+40,81,4,3,'#ffc94d');
}
function drawLight(){
  // vệt nắng từ cửa sổ hắt xuống sàn
  const im=GFX.ctx().getImageData(0,0,W,H),d=im.data;
  const lit=(x,y,a)=>{const k=(y*W+x)*4;d[k]+=(255-d[k])*a;d[k+1]+=(244-d[k+1])*a;d[k+2]+=(214-d[k+2])*a};
  for(let y=FLOOR;y<172;y++){const k=(y-FLOOR)/56,x1=Math.round(176-k*60),x2=Math.round(230-k*44),a=.3*(1-k*.55);
    for(let x=x1;x<x2;x++){const edge=Math.min(x-x1,x2-1-x);lit(x,y,edge<2?a*.5:a)}}
  GFX.ctx().putImageData(im,0,0);
}

/* ---------- Ghép cảnh ---------- */
const BG=mk();GFX.use(BG.getContext('2d'));
drawRoom();drawWallDecor();drawWindow();drawDoor();drawBunk();drawDesk();drawKitchen();drawFan();drawLight();drawStool();
const motes=Array.from({length:10},(_,i)=>({x:170+((i*37)%50),y:30+((i*53)%70),s:.4+((i*13)%10)/20}));

/* ---------- Độ bừa bộn: 3 mức, vẽ chồng lên căn phòng ---------- */
function drawBin(level){
  const x=221,y=104;R(x,y,12,12,'#4a5578');R(x,y,12,1,'#6a7698');R(x+11,y,1,12,'#2c3550');R(x+1,y+11,10,1,'#2c3550');R(x+2,y+3,1,7,'#5a6688');
  if(level>=1){R(x+1,y-3,5,4,'#f4f1ea');R(x+6,y-2,5,3,'#e6aa2c');R(x+3,y-5,4,3,'#d8d2c8')}
  if(level>=2){R(x-1,y-8,7,6,'#f4f1ea');R(x+5,y-7,6,5,'#e85a3a');R(x+2,y-10,5,3,'#c9a878')}
}
function ball(x,y,c='#f4f1ea',d='#c8c0b4'){R(x,y,5,3,c);R(x+1,y-1,3,1,c);R(x+1,y+3,3,1,d);P(x+3,y,d);P(x+1,y+1,d)}
function cup(x,y,tip){if(tip){R(x,y+2,8,6,'#f4f1ea');R(x,y+3,8,2,'#e85a3a');R(x+8,y+2,1,6,'#d8d2c8');R(x-2,y+6,3,2,'#e6c46a');return}
  R(x,y,7,8,'#f4f1ea');R(x-1,y,9,1,'#ffffff');R(x,y+3,7,2,'#e85a3a');R(x+2,y+3,3,1,'#ffc94d');R(x+6,y,1,8,'#d8d2c8');R(x+1,y-2,5,2,'#e8e2d4')}
function foam(x,y,open){R(x,y,13,6,'#f8f6f0');R(x,y,13,1,'#ffffff');R(x+12,y,1,6,'#d8d2c8');R(x,y+5,13,1,'#d8d2c8');
  if(open){R(x+1,y-5,11,5,'#efece4');R(x+1,y-5,11,1,'#ffffff');R(x+3,y+1,7,3,'#c98a4a');P(x+4,y+1,'#8a5a2a');P(x+7,y+2,'#e6c04a')}}
function shirt(x,y,c,cd){R(x,y,12,8,c);R(x-3,y,3,4,c);R(x+12,y,3,4,c);R(x,y,12,1,'rgba(255,255,255,.4)');R(x+4,y,4,2,cd);R(x,y+7,12,1,cd)}
function jeans(x,y){R(x,y,16,5,'#3a5ea8');R(x+10,y-6,6,6,'#3a5ea8');R(x,y,16,1,'#5a7ec8');R(x+12,y-6,1,6,'#2e4c88');R(x,y+4,16,1,'#2e4c88')}
function bag(x,y,s=1){const w=12*s,h=11*s;R(x,y,w,h,'#26262e');R(x+1,y-1,w-2,1,'#26262e');R(x+w/2-2,y-4,4,3,'#26262e');R(x+w/2-3,y-5,2,2,'#26262e');R(x+w/2+1,y-5,2,2,'#26262e');
  R(x+2,y+1,2,h-3,'#45454f');R(x+w-3,y+2,1,h-4,'#1a1a20');P(x+4,y+3,'#5a5a66')}
function stain(x,y,w,h,col='#8a7454'){for(let j=0;j<h;j++)for(let i=0;i<w;i++){const d=Math.hypot((i-w/2)/(w/2),(j-h/2)/(h/2));if(d<1&&BAYER[(y+j)&3][(x+i)&3]<.75*(1-d)+.15)P(x+i,y+j,col)}}
function messLayer(level){
  // vẽ đồ đạc bừa bộn lên một lớp riêng rồi viền tối quanh từng món cho dễ nhìn
  const items=outlined(W,H,()=>{
    drawBin(level);
    if(level>=1){
      // chăn giường dưới nhăn nhúm, quần áo vắt ghế, hộp cơm và ly mì trên bàn
      R(28,85,60,9,'#4f7fd0');R(34,82,20,4,'#4f7fd0');R(60,83,16,3,'#4f7fd0');R(28,85,60,1,'#86afee');R(36,82,8,1,'#86afee');
      R(44,88,10,2,'#3a5ea8');R(66,87,12,2,'#3a5ea8');R(30,92,58,2,'#3a5ea8');for(let x=36;x<86;x+=9)R(x,89,4,2,'#e8eef8');
      shirt(192,95,'#ff86b3','#d8608c');R(204,103,3,8,'#ff86b3');
      foam(170,80,true);cup(211,78);
      ball(126,138);ball(262,126);jeans(100,128);
    }
    if(level>=2){
      // đống đồ chưa giặt trước giường
      const r=rng(77),cols=[['#e06a5a','#b44a40'],['#7ec0a8','#5a9a84'],['#f4f1ea','#cfc6bc'],['#e6aa2c','#b47c1c'],['#c9a0e8','#a07cc4'],['#4f7fd0','#3a5ea8']];
      for(let k=0;k<24;k++){const dx=Math.floor(r()*52),dy=Math.floor(r()*Math.max(2,14-Math.abs(dx-24)*.5)),[c1,c2]=cols[k%cols.length],w=6+Math.floor(r()*6);R(34+dx,132-dy,w,4,c1);R(34+dx,135-dy,w,1,c2);R(34+dx,132-dy,w,1,'rgba(255,255,255,.35)')}
      R(76,131,4,8,'#4f7fd0');R(79,137,3,2,'#4f7fd0');
      // túi rác, ly mì, hộp xốp, giấy vo, vết bẩn
      bag(236,104);bag(101,105);
      cup(186,77);cup(116,147,true);cup(244,140,true);cup(160,128);
      foam(270,126,true);foam(140,150);
      ball(150,126);ball(206,150);ball(98,150,'#e8d8b8','#c9b898');ball(280,146);
      R(298,85,14,2,'#f4f1ea');R(299,83,12,2,'#e8e2d4');R(300,81,10,2,'#f4f1ea');R(300,79,10,2,'#e8e2d4');P(303,82,'#a8743a');P(307,84,'#a8743a');P(305,80,'#a8743a');
      R(291,78,10,1,'#7a5a2a');
    }
  });
  const c=mk(),x=c.getContext('2d'),keep=GFX.ctx();GFX.use(x);
  if(level>=2){stain(282,122,18,7);stain(196,132,14,6);stain(150,156,16,6);stain(0,10,26,14,'#7a8e72');stain(300,10,20,16,'#7a8e72')}
  x.drawImage(items,0,0);GFX.use(keep);return c;
}
const MESS=[messLayer(0),messLayer(1),messLayer(2)];
// phòng bừa bộn thì ánh sáng xám và tối đi một chút
const BG3=(()=>{const c=mk(),x=c.getContext('2d');x.drawImage(BG,0,0);const im=x.getImageData(0,0,W,H),d=im.data;
  for(let k=0;k<d.length;k+=4){const l=(d[k]*.3+d[k+1]*.59+d[k+2]*.11);d[k]=(d[k]*.65+l*.35)*.84;d[k+1]=(d[k+1]*.65+l*.35)*.84;d[k+2]=(d[k+2]*.65+l*.35)*.76}
  x.putImageData(im,0,0);return c})();
function drawFlies(t){
  [[242,96],[107,98]].forEach(([cx,cy],n)=>{for(let i=0;i<3;i++){const a=t/(240+i*50)+i*2.1+n,x=Math.round(cx+Math.cos(a)*8+Math.sin(a*1.7)*3),y=Math.round(cy+Math.sin(a*1.3)*5);P(x,y,'#14141a');P(x+1,y,'#14141a');if(Math.floor(t/70+i)%2){P(x,y-1,'rgba(230,236,255,.9)');P(x+1,y-1,'rgba(230,236,255,.9)')}}});
  for(let k=0;k<3;k++){const ph=((t/1500)+k*.33)%1,x0=232+k*6;for(let j=0;j<10;j++){const y=Math.round(100-ph*18-j),x=Math.round(x0+Math.sin(j*.7+ph*6)*2);if(j<8-ph*6){P(x,y,'#9ac06a');P(x+1,y,'#7aa04a')}}}
  // gián chạy dọc chân tường
  const gx=((t/40)%420)-50,gy=117;if(gx>-10&&gx<330){const X=Math.round(gx);R(X,gy,5,3,'#5a2e18');R(X+1,gy,3,1,'#8a4a28');P(X+5,gy+1,'#3a1a0c');const st=Math.floor(t/90)%2;[0,2,4].forEach(i=>{P(X+i,gy+3+(st&&i===2?0:0),'#2a1408');P(X+i+(st?1:0),gy-1,'#2a1408')});P(X+6,gy,'#2a1408');P(X+7,gy-1,'#2a1408')}
}
function frame(ctx,t,opt={}){
  const animate=opt.animate!==false;ctx.imageSmoothingEnabled=false;
  const mess=Math.max(0,Math.min(2,opt.mess|0));
  const slot=opt.slot|0;ctx.drawImage(graded(mess===2?BG3:BG,mess===2?3:0,slot),0,0);GFX.use(ctx);
  drawFanHead(animate?t:0);
  ctx.drawImage(MESS[mess],0,0);GFX.use(ctx);
  if(mess===2&&animate)drawFlies(t);
  // hơi nóng bốc lên từ cốc cà phê
  if(animate){const k=Math.floor(t/300)%3;[[221,77-k],[223,74-k],[222,71-k]].forEach(([x,y],i)=>{if((i+k)%3)P(x,y,'rgba(255,255,255,.7)')})}
  // Khoa ngáy
  if(animate){const z=(t/1000)%3;[0,1].forEach(i=>{const zt=(z+i*1.5)%3,y=Math.round(34-zt*6),x=Math.round(22+zt*3);if(zt<2.4){R(x,y,3,1,'#f4f1ea');P(x+1,y+1,'#f4f1ea');R(x,y+2,3,1,'#f4f1ea')}})}
  // bụi lơ lửng trong vệt nắng
  if(animate&&slot<2)motes.forEach(m=>{const y=((m.y+t/1000*4*m.s)%80)+28,x=m.x-(y-28)*.2+Math.sin(t/900+m.x)*2;P(Math.round(x),Math.round(y),'rgba(255,246,220,.8)')});
  // nhân vật chính (game vẽ qua opt.hero theo trang phục và biểu cảm)
  heroAt(ctx,opt,opt.x||148,opt.feet||152,t,animate);
}

Scenes.room=frame;
})();
