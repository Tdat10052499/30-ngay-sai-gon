/* 30 Ngày Sài Gòn · trang bìa, tạo nhân vật, chuyển cảnh ngày 1.
 * - frame(ctx,t,animate,opt): cổng trường lúc hoàng hôn, nhân vật quay lưng (design/01; opt.minh=false cho màn tạo nhân vật, design/02)
 * - day1Frame(ctx,t,p,opt): đêm → bình minh → mặt trời mọc, p từ 0 đến 1 (design/03)
 * - bust(ctx,t,animate,gender): chân dung 48×48 ở màn tạo nhân vật (design/02) */
(()=>{
const {W,H,BAYER,rng,R,P,shade,dith,outlined}=GFX;
const layer=()=>GFX.mk(W,H);
/* ---------- Bảng màu ---------- */
const C={
  white:'#efe2d4',whiteLit:'#fff3e2',whiteShade:'#cbb7b2',whiteDeep:'#a8949c',sideLit:'#f8cfa2',sideLitDk:'#d99a78',
  orange:'#f07a2e',orangeDk:'#c45a24',orangeLt:'#ffa05a',
  glassHi:'#a06a8a',glassMid:'#7a5c8c',glassLo:'#525a8c',mull:'#3e3f6a',lit:'#ffd47a',litHi:'#fff0bf',
  ink:'#1d2136',lantern:'#ffc94d',
};
const SKY=['#161939','#1c1e45','#252450','#302a5b','#3e3165','#4f386d','#633f72','#7b4674','#944d73','#ad566f','#c4616a','#d87064','#e6845e','#f09b5c','#f6b462','#fbcd72'];
const HORIZON=128;

/* ---------- Lớp 0: bầu trời và mặt trời ---------- */
function drawSky(){
  const n=SKY.length,bh=HORIZON/n;
  for(let y=0;y<HORIZON;y++){
    const t=y/bh,i=Math.floor(t),f=t-i;
    for(let x=0;x<W;x++){const c2=i+1<n&&f>.55&&BAYER[y&3][x&3]<(f-.55)/.45?SKY[i+1]:SKY[Math.min(i,n-1)];P(x,y,c2)}
  }
  const r=rng(7);
  for(let k=0;k<34;k++){const x=Math.floor(r()*W),y=Math.floor(r()*40);P(x,y,r()<.3?'#e9ebff':'#8f90c8')}
  // mặt trời vừa lặn: chỉ còn quầng sáng sau dãy nhà phía xa
  const sx=96,sy=124;
  for(let y=sy-34;y<HORIZON;y++)for(let x=sx-52;x<sx+52;x++){
    const d=Math.hypot((x-sx)/1.6,y-sy);
    if(d<16){if(BAYER[y&3][x&3]<.55*(1-d/16)+.1)P(x,y,'#ffe4a6')}
    else if(d<30){if(BAYER[y&3][x&3]<.2*(1-(d-16)/14))P(x,y,'#ffd58a')}
  }
}

/* ---------- Mây trôi (vẽ động) ---------- */
const CLOUDS=[
  {x:20,y:30,rows:[[6,18],[2,30],[0,40],[4,30]],v:1.1},
  {x:150,y:18,rows:[[4,22],[0,34],[6,24]],v:.7},
  {x:250,y:46,rows:[[8,16],[2,32],[0,44],[10,22]],v:1.4},
  {x:90,y:62,rows:[[2,26],[0,38],[6,20]],v:1.8},
];
function drawCloud(ctx,cl,ox){
  GFX.use(ctx);const n=cl.rows.length;
  cl.rows.forEach(([o,len],j)=>{
    const y=cl.y+j,col=j===n-1?'#f6a37a':j===n-2?'#c06a7c':'#6b4676';
    for(let k=-1;k<=1;k++){const x=((cl.x+ox+o)%(W+80)+W+80)%(W+80)-60+k*(W+80);R(x,y,len,1,col)}
    if(j===n-1){for(let k=-1;k<=1;k++){const x=((cl.x+ox+o)%(W+80)+W+80)%(W+80)-60+k*(W+80);R(x+3,y+1,Math.max(4,len-10),1,'#ffc58a')}}
  });
}

/* ---------- Lớp 1: phố xa, khuôn viên trường, sân trường ---------- */
function drawFar(){
  const r=rng(21);
  // dãy nhà cao tầng phía xa (mờ trong sương chiều)
  let x=-4;
  while(x<W){const w=8+Math.floor(r()*16),h=8+Math.floor(r()*30),top=HORIZON-h;
    const col=r()<.5?'#5a4274':'#533d6e';R(x,top,w,h,col);R(x+w-1,top,1,h,'#674a7a');
    if(r()<.4)R(x+2+Math.floor(r()*(w-4)),top-3,1,3,col);
    if(r()<.3)R(x+2,top-2,4,2,col);
    for(let yy=top+3;yy<HORIZON-2;yy+=4)for(let xx=x+2;xx<x+w-2;xx+=3)if(r()<.12)P(xx,yy,'#e9b06a');
    x+=w+Math.floor(r()*3)}
  // tòa tháp cao nhất thành phố ở phía xa (hình bậc thang thon dần)
  const tx=46,segs=[[18,96],[16,76],[14,60],[11,48],[8,40],[5,34]];
  segs.forEach(([w,top],i)=>{const bot=i?segs[i-1][1]:HORIZON;R(tx-w/2,top,w,bot-top,'#4a3768');R(tx+w/2-1,top,1,bot-top,'#7c5480');
    for(let yy=top+2;yy<bot-1;yy+=3)for(let xx=tx-w/2+2;xx<tx+w/2-2;xx+=2)if(r()<.1)P(xx,yy,'#f2bf72')});
  R(tx-1,20,2,14,'#4a3768');R(tx,12,1,8,'#4a3768');
  // dãy nhà phố thấp gần hơn (bên trái, sẽ chìm trong lớp tối của chữ)
  x=-2;
  while(x<128){const w=10+Math.floor(r()*8),h=14+Math.floor(r()*14),top=HORIZON+4-h;
    R(x,top,w,h,'#3b2d55');R(x,top,w,1,'#56406c');R(x+w-1,top,1,h,'#4a3864');
    for(let yy=top+3;yy<HORIZON;yy+=5){R(x+1,yy+3,w-2,1,'#2e2446');if(r()<.45)R(x+2+Math.floor(r()*(w-6)),yy,3,2,r()<.5?'#ffcf7a':'#f59a62')}
    if(r()<.35)R(x+1,top+6,4,3,['#d65a5a','#4fb0a0','#e0b040'][Math.floor(r()*3)]);
    x+=w}
}
const GROUND=122;
function drawCampus(){
  const r=rng(33);
  // sân trường
  R(110,GROUND,W-110,10,'#c9b3a6');
  for(let y=GROUND;y<132;y+=3)R(110,y,W-110,1,'#b8a196');
  for(let xx=114;xx<W;xx+=12)R(xx,GROUND,1,10,'#bba498');
  dith(110,GROUND,90,10,'#e3c6a4',.35);

  /* Tháp A: 12 tầng, lam đứng màu cam */
  tower(236,20,46,'fins',r);
  /* Tháp B: lam ngang màu cam */
  tower(290,36,40,'bands',r);

  /* Khối hành chính vuông, gợi hình bánh chưng: mặt kính xanh lá, buộc "lạt" */
  const bx=136,by=80,bw=48;
  R(bx-5,by+2,5,GROUND-by-2,C.sideLit);
  for(let yy=by+6;yy<GROUND-2;yy+=6)R(bx-5,yy,5,2,C.sideLitDk);
  R(bx,by,bw,GROUND-by,C.white);
  R(bx,by,bw,1,C.whiteLit);R(bx,by,1,GROUND-by,C.whiteLit);
  const gx=bx+3,gy=by+4,gw=bw-6,gh=GROUND-by-6;
  for(let y=gy;y<gy+gh;y++)for(let x=gx;x<gx+gw;x++){
    const v=.25+.55*(1-(y-gy)/gh)-.2*((x-gx)/gw);
    P(x,y,shade(v,['#1f4a44','#2a5e52','#3a7a64','#5f9a74','#9ac08a'],x,y));
    if((x-gx)%6===5||(y-gy)%5===4)P(x,y,'#1a3c38');
  }
  for(let y=gy;y<gy+gh;y+=5)for(let x=gx;x<gx+gw;x+=6)if(r()<.16)R(x,y,5,4,C.lit);
  [gx+13,gx+28].forEach(xx=>{R(xx,by,3,GROUND-by,'#f3eadc');R(xx+2,by,1,GROUND-by,'#cdbfb2')});
  [gy+9,gy+24].forEach(yy=>{R(bx,yy,bw,3,'#f3eadc');R(bx,yy+2,bw,1,'#cdbfb2')});
  R(bx,by-3,bw,3,'#3f7a52');for(let xx=bx+1;xx<bx+bw;xx+=4)R(xx,by-5,3,2,r()<.5?'#5fa05e':'#4a8a50');

  /* Khối tròn, gợi hình bánh dày: trụ trắng, viền cam */
  const cx=212,rx=23,top=92;
  const tones=['#9a8698','#b29ca6','#cbb4b2','#dfc9c0','#efdccc','#fbebd8','#fff5e6'];
  for(let x=cx-rx;x<=cx+rx;x++){
    const u=(x-cx)/rx,v=.92-.62*((u+1)/2)-.18*u*u;
    const capH=Math.round(4*Math.sqrt(Math.max(0,1-u*u)));
    for(let y=top-capH;y<GROUND;y++){
      let col;
      if(y<top-capH+1)col='#fff8ec';
      else if(y<top)col=shade(.95-.3*((u+1)/2),tones,x,y);
      else if(y===top||y===top+1)col=shade(v,['#a8461c','#c45a24','#f07a2e','#ff9a50'],x,y);
      else if((y-top-5)%8<4&&y>top+3&&y<GROUND-3)col=shade(v*.8,['#3e3f6a','#525a8c','#7a5c8c','#a06a8a','#c88a8e'],x,y);
      else col=shade(v,tones,x,y);
      P(x,y,col);
    }
  }
  for(let k=0;k<10;k++){const x=cx-rx+3+Math.floor(r()*(2*rx-6)),band=Math.floor(r()*3),y=top+5+band*8;if(Math.abs(x-cx)<rx-3)R(x,y+1,3,2,C.lit)}

  // hàng cây trong khuôn viên
  canopy(124,92,13,28,['#163b33','#1f5040','#2f6b4a','#55915a','#a8b860'],5,[-1,.2]);
  R(123,110,3,GROUND-110,'#3a2a30');
  canopy(262,112,12,10,['#163b33','#1f5040','#2f6b4a','#55915a','#a8b860'],9,[-1,.3]);
  canopy(300,106,18,14,['#163b33','#1f5040','#2f6b4a','#4f8a56','#98ac5c'],11,[-1,.3]);
}
function tower(x0,y0,w,style,r){
  const bot=GROUND,side=6;
  // mặt bên trái hứng nắng chiều
  R(x0-side,y0+4,side,bot-y0-4,C.sideLit);
  R(x0-side,y0+4,1,bot-y0-4,'#ffe2bd');
  for(let yy=y0+10;yy<bot-2;yy+=7)R(x0-side+1,yy,side-1,4,'#c98a74');
  // mặt chính
  R(x0,y0,w,bot-y0,C.white);
  const floors=12,fh=Math.floor((bot-y0-10)/floors),fy=y0+8;
  for(let f=0;f<floors;f++){
    const y=fy+f*fh,gh=fh-2;
    for(let yy=y+2;yy<y+2+gh;yy++)for(let xx=x0+2;xx<x0+w-2;xx++){
      const v=.85-.75*(f/floors)-.15*((xx-x0)/w)+(yy-y-2===0?.15:0);
      P(xx,yy,shade(v,[C.mull,C.glassLo,C.glassMid,C.glassHi,'#d08a86'],xx,yy));
      if((xx-x0-2)%5===4)P(xx,yy,C.mull);
    }
    for(let xx=x0+2;xx<x0+w-4;xx+=5)if(r()<(f>8?.32:.18))R(xx,y+2,4,gh,r()<.3?C.litHi:C.lit);
    if(style==='bands'){R(x0,y+1,w,1,C.orange);R(x0,y+2,w,1,C.orangeDk)}
  }
  if(style==='fins')for(let xx=x0+1;xx<x0+w;xx+=9){R(xx,y0+4,2,bot-y0-4,C.orange);R(xx+2,y0+4,1,bot-y0-4,C.orangeDk);P(xx,y0+4,C.orangeLt)}
  // đỉnh tháp
  R(x0,y0,w,4,C.white);R(x0,y0,w,1,C.whiteLit);R(x0,y0+2,w,1,C.orange);
  R(x0+6,y0-4,10,4,C.whiteShade);R(x0+6,y0-4,10,1,C.whiteLit);
  R(x0+w-14,y0-3,6,3,C.whiteShade);
  if(style==='fins'){R(x0+w-9,y0-12,1,8,'#7a6a80');}
  for(let xx=x0+18;xx<x0+w-16;xx+=3)P(xx,y0-1,r()<.5?'#4f8a56':'#2f6b4a');
  R(x0,y0,1,bot-y0,C.whiteLit);
  R(x0+w-1,y0,1,bot-y0,C.whiteShade);
}
function canopy(cx,cy,rx,ry,tones,seed,light){
  const r=rng(seed),blobs=[];
  const n=Math.round(rx*ry/14)+6;
  for(let i=0;i<n;i++){const a=r()*Math.PI*2,d=Math.sqrt(r())*.72;
    blobs.push({x:cx+Math.cos(a)*d*rx,y:cy+Math.sin(a)*d*ry,r:Math.min(rx,ry)*(.35+r()*.3)})}
  const [lx,ly]=light,ll=Math.hypot(lx,ly);
  for(let y=Math.floor(cy-ry-6);y<cy+ry+6;y++)for(let x=Math.floor(cx-rx-6);x<cx+rx+6;x++){
    let best=null,bd=9;
    for(const b of blobs){const d=Math.hypot(x-b.x,y-b.y)/b.r;if(d<bd){bd=d;best=b}}
    const edge=1+(BAYER[y&3][x&3]-.5)*.25;
    if(bd>edge)continue;
    const nx=(x-best.x)/best.r,ny=(y-best.y)/best.r;
    const gx=(x-cx)/rx,gy=(y-cy)/ry;
    const local=-(nx*lx+ny*ly)/ll,glob=-(gx*lx+gy*ly)/ll;
    const v=.42+.28*local+.3*glob-.18*Math.max(0,gy);
    P(x,y,shade(v,tones,x,y));
  }
}

/* ---------- Lớp 2: cổng trường, hàng rào, cây lớn, vỉa hè, đường ---------- */
const GATE={l:180,r:244,top:74};
function drawFront(){
  const r=rng(51);
  // hàng rào thấp và bồn hoa
  const fence=(x1,x2)=>{
    R(x1,126,x2-x1,6,'#e2d3c6');R(x1,126,x2-x1,1,'#fff1e0');R(x1,131,x2-x1,1,'#a8949c');
    for(let xx=x1;xx<x2;xx+=3)R(xx,114,1,12,'#3b3452');
    R(x1,113,x2-x1,1,'#4a4262');R(x1,119,x2-x1,1,'#4a4262');
    for(let xx=x1;xx<x2;xx++){const hh=4+Math.floor(r()*3);for(let yy=126-hh;yy<126;yy++){
      const v=.3+.5*((126-yy)/hh)-.2*((xx-x1)/(x2-x1));P(xx,yy,shade(v,['#1b4436','#2a5e48','#3e7a52','#6a9a5a'],xx,yy))}}
    for(let k=0;k<(x2-x1)/5;k++){const xx=x1+Math.floor(r()*(x2-x1-2)),yy=119+Math.floor(r()*5);
      P(xx,yy,'#e04f86');P(xx+1,yy,'#ff7fae');P(xx,yy+1,'#b83a6a')}
  };
  fence(110,GATE.l-6);fence(GATE.r+6,W);
  // cổng: hai trụ và mái
  [GATE.l,GATE.r-10].forEach(x=>{
    R(x-2,128,14,4,'#9d8a92');R(x-2,128,14,1,'#c9b8bc');
    R(x,GATE.top+10,10,128-GATE.top-10,C.white);
    R(x,GATE.top+10,2,128-GATE.top-10,C.whiteLit);
    R(x+8,GATE.top+10,2,128-GATE.top-10,C.whiteShade);
    R(x+4,GATE.top+16,2,128-GATE.top-24,C.orange);R(x+5,GATE.top+16,1,128-GATE.top-24,C.orangeDk);
  });
  const cl=GATE.l-10,cw=GATE.r-GATE.l+20;
  R(cl,GATE.top,cw,10,C.white);R(cl,GATE.top,cw,1,C.whiteLit);
  R(cl,GATE.top+7,cw,2,C.orange);R(cl,GATE.top+9,cw,1,C.orangeDk);
  R(cl,GATE.top+10,cw,1,'#7a6878');
  R(cl+cw-1,GATE.top,1,10,C.whiteShade);
  // bảng tên cổng
  const px0=197,pw=31;
  R(px0,GATE.top+1,pw,6,C.ink);R(px0,GATE.top+1,pw,1,'#2e3352');
  drawText('ĐẠI HỌC',px0+3,GATE.top+1,C.lantern);
  // cây lớn tiền cảnh bên trái
  R(30,58,8,100,'#2c2028');R(30,58,2,100,'#5a3a34');R(36,58,2,100,'#1e161e');
  R(26,150,16,8,'#2c2028');
  R(34,60,10,3,'#2c2028');R(42,54,3,7,'#2c2028');
  canopy(30,16,62,36,['#0f2a26','#163b33','#1f5040','#2f6b4a','#55894a','#a8a050'],3,[1,1.1]);
  // vỉa hè
  for(let y=132;y<158;y++)for(let x=0;x<W;x++){
    const warm=1-Math.min(1,Math.abs(x-104)/170);
    const v=.35+.35*warm+.12*((y-132)/26);
    P(x,y,shade(v,['#5c4e66','#6c5c72','#7e6a7c','#937b86','#a88a8a'],x,y));
  }
  for(let y=136;y<158;y+=7)R(0,y,W,1,'rgba(60,48,80,.45)');
  for(let y=136,row=0;y<158;y+=7,row++)for(let x=(row%2)*9;x<W;x+=18)R(x,y,1,7,'rgba(60,48,80,.35)');
  // bóng dài của cổng đổ sang phải (nắng chiều thấp)
  [GATE.l,GATE.r-10].forEach(x=>dith(x+10,132,26,3,'#3e3450',.5));
  // bó vỉa và lòng đường
  R(0,158,W,2,'#b3a2a6');R(0,160,W,2,'#544760');
  for(let y=162;y<H;y++)for(let x=0;x<W;x++)P(x,y,shade(.35+.2*BAYER[(y*3)&3][(x*5)&3]+.25*(1-Math.abs(x-104)/220),['#241f38','#2b2642','#332d4c','#3e3656'],x,y));
  for(let x=4;x<W;x+=18)R(x,171,9,1,'#8a7f94');
  // cột đèn đường
  R(160,66,2,92,'#2a2840');R(160,66,1,92,'#4a4462');
  R(160,64,10,2,'#2a2840');R(166,66,7,2,'#3a3652');
  R(156,156,10,2,'#2a2840');
}
const FONT={
  'Đ':['0110','0101','1101','0101','0110'],'A':['010','101','111','101','101'],'I':['1','1','1','1','1'],
  'H':['101','101','111','101','101'],'O':['010','101','101','101','010'],'C':['011','100','100','100','011'],' ':['0','0','0','0','0'],
};
function drawText(str,x,y,col){
  for(const ch of str.normalize('NFD')){
    if(ch==='\u0323'){P(x-3,y+6,col);continue}
    const gph=FONT[ch]||FONT[' '];gph.forEach((row,j)=>{for(let i=0;i<row.length;i++)if(row[i]==='1')P(x+i,y+j,col)});
    x+=gph[0].length+1;
  }
}

/* ---------- Nhân vật: tỉ lệ chibi đầu to, viền màu tối, đổ bóng 3 tông ---------- */
const MK={h:'#3b2418',hD:'#24150e',hL:'#6e4630',hR:'#9a6440',sk:'#f2c7a0',skD:'#d09a74',skL:'#ffdcbc',
  sh:'#4f7fd0',shD:'#3a5ea8',shL:'#86afee',pa:'#33405e',paD:'#252f48',paL:'#4b5a80',so:'#5a3a2a',soD:'#3e2618',soL:'#80583e',
  bp:'#e6aa2c',bpD:'#b47c1c',bpL:'#ffd468',bpS:'#7a5216',zip:'#f4ecd8'};
function minhFrame(breath){
  // khung 30×54, tâm x=15, chân ở hàng 52
  return outlined(30,54,()=>{
    const c=15,b=breath;
    // giày
    R(c-6,48,5,4,MK.so);R(c+1,48,5,4,MK.so);R(c-6,48,5,1,MK.soL);R(c+1,48,5,1,MK.soL);R(c-6,51,5,1,MK.soD);R(c+1,51,5,1,MK.soD);
    // quần: hông liền, hai ống tách nhau
    R(c-6,38,12,5,MK.pa);R(c-6,43,5,5,MK.pa);R(c+1,43,5,5,MK.pa);
    R(c-6,38,1,10,MK.paL);R(c+5,38,1,10,MK.paD);R(c-2,43,1,5,MK.paD);R(c+1,43,1,5,MK.paL);
    // thân áo
    R(c-7,25+b,14,14-b,MK.sh);R(c-7,25+b,2,14-b,MK.shL);R(c+5,25+b,2,14-b,MK.shD);R(c-7,38,14,1,MK.shD);
    // tay tách khỏi thân 1 điểm ảnh để viền tự tách
    R(c-11,26+b,3,5,MK.sh);R(c-11,26+b,1,5,MK.shL);R(c-11,31+b,3,5,MK.sk);R(c-11,31+b,1,5,MK.skL);R(c-11,36+b,3,2,MK.skD);
    R(c+8,26+b,3,5,MK.shD);R(c+8,31+b,3,5,MK.skD);R(c+8,36+b,3,2,MK.skD);
    R(c-8,26+b,1,3,MK.sh);R(c+7,26+b,1,3,MK.shD);
    // ba lô to, nắp tròn, túi trước
    R(c-6,26+b,12,13-b,MK.bp);R(c-5,25+b,10,1,MK.bp);
    R(c-6,26+b,1,13-b,MK.bpL);R(c-5,25+b,4,1,MK.bpL);R(c+5,26+b,1,13-b,MK.bpD);
    R(c-6,30+b,12,1,MK.bpD);R(c-5,29+b,10,1,MK.bpL);
    R(c-4,32+b,8,6-b,MK.bpD);R(c-4,32+b,8,1,MK.bpS);R(c-4,33+b,1,5-b,'#cf9424');R(c-3,35,6,1,MK.bpS);P(c+2,34,MK.zip);
    R(c-7,25+b,2,3,MK.bpS);R(c+5,25+b,2,3,MK.bpS);
    // cổ
    R(c-2,21+b,4,4,MK.skD);R(c-2,21+b,1,4,MK.sk);
    // đầu nhìn từ phía sau: tròn, tóc chia lọn, viền nắng chiều bên trái
    const top=5+b;
    R(c-8,top+2,16,13,MK.h);R(c-7,top,14,2,MK.h);R(c-5,top-1,10,1,MK.h);R(c-9,top+4,1,9,MK.h);R(c+8,top+4,1,9,MK.h);
    [[-7,1],[-4,2],[-1,1],[2,2],[5,1]].forEach(([dx,hh])=>R(c+dx,top+15,3,hh,MK.h));
    // tai
    R(c-11,top+8,2,4,MK.sk);R(c-11,top+8,1,4,MK.skL);R(c+9,top+8,2,4,MK.skD);
    // sáng tối của tóc
    R(c+4,top+3,4,12,MK.hD);R(c+8,top+5,1,7,MK.hD);
    R(c-9,top+4,1,9,MK.hR);R(c-8,top+2,1,3,MK.hR);R(c-7,top,2,1,MK.hR);
    R(c-5,top+1,5,1,MK.hL);R(c-7,top+2,3,1,MK.hL);R(c-8,top+3,2,2,MK.hL);R(c+1,top+1,3,1,MK.hL);R(c,top+2,2,1,MK.hL);
    [[-5,7],[-1,6],[3,7]].forEach(([dx,y0])=>R(c+dx,top+y0,1,15-y0,MK.hD));
    P(c+1,top-2,MK.h);P(c+2,top-3,MK.h);P(c+3,top-3,MK.hD);
  });
}
const MINH=[minhFrame(0),minhFrame(1)];
function drawMinh(ctx,cx,feet,t){
  GFX.use(ctx);
  for(let k=0;k<36;k++)dith(cx-6+k,feet-1+Math.floor(k/12),9,2,'#2c2440',.55-k*.012);
  const f=Math.floor(t/900)%2;
  ctx.drawImage(MINH[f],cx-15,feet-52);
}
/* ---------- Sinh viên trong trường: nhìn nghiêng, có mặt, kiểu tóc, trang phục, đồ mang theo ---------- */
const SKIN={a:['#f2c7a0','#d09a74','#ffdcbc'],b:['#e0ac82','#b98060','#f2c49c'],c:['#c98f68','#9e6a4c','#dca582']};
const SCACHE={};
// pose: 'walk' (4 khung), 'idle', 'talk', 'phone'
function studentSprite(o,pose,f){
  const key=JSON.stringify(o)+pose+f;if(SCACHE[key])return SCACHE[key];
  return SCACHE[key]=outlined(20,32,()=>{
    const c=9,[sk,skD,skL]=SKIN[o.skin||'a'];
    const walk=pose==='walk',bob=walk&&(f%2===1)?-1:0,talkBob=pose==='talk'&&f%2?-1:0;
    const T=bob+talkBob; // độ nhún của thân trên
    // --- chân và giày ---
    const stride=walk?[2,0,-2,0][f%4]:0;
    const legs=[[c-1-stride,'back'],[c-1+stride,'front']];
    legs.forEach(([lx,which])=>{
      const legCol=o.bottomType==='pants'?(which==='back'?o.bottomD:o.bottom):(which==='back'?skD:sk);
      R(lx,21,3,6,legCol);
      if(o.bottomType!=='pants'&&which==='front')R(lx,21,1,6,skL);
      R(lx,27,4,2,which==='back'?o.shoesD:o.shoes);R(lx+1,28,3,1,'#e8e0d4');
    });
    // --- quần, váy, quần short ---
    if(o.bottomType==='pants'){R(c-3,19+T,6,3,o.bottom);R(c-3,19+T,1,3,o.bottomD)}
    else if(o.bottomType==='skirt'){R(c-3,19+T,6,2,o.bottom);R(c-4,21+T,8,2,o.bottom);R(c-4,22+T,8,1,o.bottomD);R(c-4,21+T,1,2,o.bottomD)}
    else {R(c-3,19+T,6,4,o.bottom);R(c-3,19+T,1,4,o.bottomD)}
    // --- đồ đeo sau lưng ---
    if(o.acc==='backpack'){R(c-7,12+T,4,8,o.accC);R(c-7,12+T,1,8,o.accL);R(c-6,15+T,2,3,o.accD)}
    if(o.acc==='tote'){R(c-6,16+T,4,6,o.accC);R(c-6,16+T,4,1,o.accL);R(c-5,18+T,2,2,o.accD)}
    // --- thân áo ---
    R(c-3,12+T,6,8,o.top);R(c-3,12+T,2,8,o.topD);R(c+2,12+T,1,8,o.topL);
    if(o.print)R(c,14+T,2,2,o.print);
    if(o.collar){R(c-1,12+T,3,1,o.collar)}
    if(o.acc==='backpack')R(c-1,12+T,1,5,o.accD);
    if(o.acc==='tote')R(c-1,12+T,1,5,o.accD);
    // --- tay ---
    if(pose==='phone'){R(c+1,13+T,2,4,o.top);R(c+2,16+T,2,1,sk);R(c+3,13+T,2,3,'#22263a');R(c+3,13+T,2,1,'#9ad6ff')}
    else if(o.acc==='books'){R(c,14+T,2,3,o.top);R(c+1,16+T,3,2,sk);R(c+2,13+T,3,5,o.accC);R(c+2,13+T,3,1,o.accL);R(c+4,13+T,1,5,o.accD)}
    else if(pose==='talk'){R(c,13+T,2,3,o.top);R(c+2,f%2?13:14,2,2,sk)}
    else {const sw=walk?[1,0,-1,0][f%4]:0;R(c-1+sw,13+T,2,4,o.top);R(c-1+sw,17+T,2,2,sk);R(c-1+sw,18+T,2,1,skD)}
    // --- cổ và đầu ---
    R(c-1,11+T,2,1,skD);
    const hy=1+T;
    R(c-4,hy+1,9,9,sk);R(c-3,hy,7,1,sk);R(c+5,hy+5,1,2,sk);
    R(c+1,hy+8,3,1,skD);
    // mắt, lông mày, má hồng
    R(c+2,hy+4,1,2,'#2a1c14');P(c+3,hy+4,'#2a1c14');R(c+1,hy+3,2,1,o.hairD);
    P(c+3,hy+7,'#f39a9a');P(c+4,hy+7,'#f7b0a8');
    // tóc theo kiểu
    const H=o.hair,HD=o.hairD,HL=o.hairL;
    R(c-4,hy-1,8,3,H);R(c-5,hy+1,4,7,H);R(c-3,hy-2,6,1,H);R(c+3,hy,2,3,H);R(c,hy+2,4,1,H);
    R(c-2,hy-1,4,1,HL);R(c-4,hy+1,1,3,HL);
    if(o.hairStyle==='bob'){R(c-5,hy+1,3,10,H);R(c-5,hy+8,4,2,HD);R(c+3,hy+2,2,5,H)}
    if(o.hairStyle==='long'){R(c-5,hy+1,3,15,H);R(c-6,hy+5,1,10,H);R(c-5,hy+12,3,3,HD);R(c+3,hy+2,2,4,H)}
    if(o.hairStyle==='ponytail'){const sway=walk?[0,1,0,-1][f%4]:0;R(c-7,hy+1,3,2,H);R(c-8+sway,hy+3,3,6,H);R(c-8+sway,hy+7,2,2,HD);P(c-5,hy+2,o.tie||'#ff7a9a')}
    if(o.hairStyle==='spiky'){P(c-2,hy-3,H);P(c+1,hy-3,H);P(c+2,hy-2,H)}
    R(c-5,hy+3,1,4,HD);
    if(o.glasses){R(c+1,hy+4,3,1,'#2a2a38');P(c+1,hy+5,'#2a2a38');P(c+3,hy+5,'#2a2a38')}
    if(o.cap){R(c-4,hy-2,8,3,o.cap);R(c+4,hy,3,1,o.cap);R(c-3,hy-2,5,1,'rgba(255,255,255,.35)')}
  });
}
function drawStudent(ctx,s,x,pose,f){
  const sp=studentSprite(s.look,pose,f),X=Math.round(x),Y=s.feet-29;
  // bóng chân
  GFX.use(ctx);dith(X-5,s.feet-1,10,2,'#5a4658',.5);
  if(s.dir<0){ctx.save();ctx.translate(X+10,Y);ctx.scale(-1,1);ctx.drawImage(sp,0,0);ctx.restore()}
  else ctx.drawImage(sp,X-9,Y);
}

/* ---------- Ghép cảnh ---------- */
const L0=layer(),L1=layer(),L2=layer();
GFX.use(L0.getContext('2d'));drawSky();
GFX.use(L1.getContext('2d'));drawFar();drawCampus();
GFX.use(L2.getContext('2d'));drawFront();

const LOOK={
  thu:{skin:'a',hair:'#2a1a12',hairD:'#170e0a',hairL:'#5a3a28',hairStyle:'long',top:'#f4f1ea',topD:'#cfc6bc',topL:'#ffffff',collar:'#9ab8e8',bottom:'#3a4a70',bottomD:'#2a3656',bottomType:'skirt',shoes:'#f2ece4',shoesD:'#c9bfb4',acc:'tote',accC:'#e8c27a',accD:'#b08a48',accL:'#f8dc9a'},
  bao:{skin:'b',hair:'#1e1612',hairD:'#100b08',hairL:'#4a3628',hairStyle:'spiky',top:'#e06a5a',topD:'#b44a40',topL:'#f8907c',print:'#ffd46a',bottom:'#3b4560',bottomD:'#2a3248',bottomType:'pants',shoes:'#2a2a34',shoesD:'#1a1a22',acc:'backpack',accC:'#3a7fd0',accD:'#2a5ea0',accL:'#6aa6ee'},
  vy:{skin:'a',hair:'#5a3424',hairD:'#3a2016',hairL:'#8a5a40',hairStyle:'ponytail',tie:'#ff7a9a',top:'#7ec0a8',topD:'#5a9a84',topL:'#a8e0c8',bottom:'#e9e2d6',bottomD:'#c4bcae',bottomType:'shorts',shoes:'#ffffff',shoesD:'#d6d0c8',acc:'books',accC:'#d65a5a',accD:'#a83e3e',accL:'#f08a7a'},
  khang:{skin:'c',hair:'#241812',hairD:'#140c08',hairL:'#4a3426',hairStyle:'short',glasses:true,top:'#2f3f66',topD:'#222e4c',topL:'#4a5e8e',collar:'#e9e2d6',bottom:'#c9b48a',bottomD:'#a8946a',bottomType:'pants',shoes:'#5a3a2a',shoesD:'#3e2618',acc:'backpack',accC:'#4a8a56',accD:'#336a3e',accL:'#6aaa70'},
  ngoc:{skin:'b',hair:'#2a1a12',hairD:'#170e0a',hairL:'#5a3a28',hairStyle:'bob',top:'#f2b8c8',topD:'#d290a4',topL:'#ffd6e0',bottom:'#4a5578',bottomD:'#363f5c',bottomType:'pants',shoes:'#f2ece4',shoesD:'#c9bfb4',acc:'tote',accC:'#f4f1ea',accD:'#c9c0b4',accL:'#ffffff'},
  long:{skin:'a',hair:'#1e1612',hairD:'#100b08',hairL:'#4a3628',hairStyle:'short',cap:'#ffc94d',top:'#f4f1ea',topD:'#cfc6bc',topL:'#ffffff',print:'#e06a5a',bottom:'#2c3550',bottomD:'#1f2640',bottomType:'shorts',shoes:'#e06a5a',shoesD:'#b44a40',acc:'none'},
};
const students=[
  // đi bộ trong sân (sau hàng rào và cổng)
  {look:LOOK.bao,x:120,feet:130,v:7,pose:'walk'},
  {look:LOOK.thu,x:300,feet:128,v:-5,pose:'walk'},
  {look:LOOK.khang,x:230,feet:129,v:-6.2,pose:'walk'},
  {look:LOOK.vy,x:170,feet:127,v:4.6,pose:'walk'},
  // đứng yên: hai bạn trò chuyện, một bạn xem điện thoại
  {look:LOOK.ngoc,x:163,feet:128,v:0,pose:'talk',dir:1},
  {look:LOOK.long,x:175,feet:128,v:0,pose:'talk',dir:-1},
  {look:{...LOOK.vy,hairStyle:'long',top:'#c9a0e8',topD:'#a07cc4',topL:'#e4c8ff',acc:'none',bottomType:'skirt',bottom:'#f4f1ea',bottomD:'#cfc6bc'},x:296,feet:129,v:0,pose:'phone',dir:-1},
];
const leaves=Array.from({length:6},(_,i)=>({x:40+i*9,y:40+i*11,s:.5+((i*37)%10)/20,ph:i}));

function frame(ctx,t,animate,opt={}){
  const sec=t/1000;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(L0,0,0);
  GFX.use(ctx);
  if(animate){const r=rng(7);for(let k=0;k<34;k++){const x=Math.floor(r()*W),y=Math.floor(r()*40);r();if((k*7+Math.floor(sec*2))%23===0)P(x,y,'#ffffff')}}
  CLOUDS.forEach(cl=>drawCloud(ctx,cl,animate?-sec*cl.v:0));
  // đàn chim
  if(animate){const bx=W+20-((sec*14)%(W+120));GFX.use(ctx);[[0,0],[7,-3],[13,1],[19,-2]].forEach(([dx,dy],i)=>{const flap=Math.floor(sec*4+i)%2;const X=Math.round(bx+dx),Y=Math.round(52+dy);P(X,Y,'#2a2040');P(X-1,Y-flap,'#2a2040');P(X+1,Y-flap,'#2a2040')})}
  ctx.drawImage(L1,0,0);
  students.forEach(s=>{
    let x=s.x;
    if(animate&&s.v){x=s.x+s.v*sec;const span=220;x=104+((x-104)%span+span)%span}
    const dir=s.dir||(s.v<0?-1:1);
    const f=animate?(s.v?Math.floor(sec*6+s.x)%4:Math.floor(sec*(s.pose==='talk'?2.5:.8)+s.x)%2):0;
    drawStudent(ctx,{...s,dir},x,s.pose,f);
  });
  ctx.drawImage(L2,0,0);
  GFX.use(ctx);
  // đèn: cổng và cột đèn
  const pulse=animate?.04*Math.sin(sec*2):0;
  dith(GATE.l-6,GATE.top+11,GATE.r-GATE.l+12,4,'#ffd98a',.32+pulse);
  [188,212,236].forEach(x=>P(x,GATE.top+10,'#fff4cc'));
  R(167,68,5,1,'#fff4cc');R(168,69,3,1,'#ffe7a8');
  for(let y=60;y<78;y++)for(let x=158;x<182;x++){const d=Math.hypot(x-169.5,(y-69)*1.4);if(d<11&&d>2)if(BAYER[y&3][x&3]<.28*(1-d/11)+pulse)P(x,y,'#ffd98a')}
  for(let y=146;y<158;y++)for(let x=140;x<200;x++){const d=Math.hypot((x-169)/30,(y-152)/6);if(d<1&&BAYER[y&3][x&3]<.22*(1-d))P(x,y,'#ffd98a')}
  // đèn đỏ trên nóc tháp
  if(!animate||Math.floor(sec*1.2)%2)P(236+46-9,7,'#ff5a5a');
  if(opt.minh!==false)drawMinh(ctx,212,157,animate?t:0);
  // lá rơi
  if(animate){GFX.use(ctx);leaves.forEach((l,i)=>{const y=((l.y+sec*7*l.s)%110)+40,x=l.x+Math.sin(sec*1.3+l.ph)*5+((sec*3*l.s)%40);
    P(Math.round(x),Math.round(y),i%2?'#c0a850':'#6a9a4a')})}
}


/* ===== Chuyển cảnh Ngày 1: đêm → bình minh → mặt trời mọc ===== */
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,sstep=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const SKYK=[
  [0,['#05081a','#0a0f2c','#121a40','#1f2754']],
  [.42,['#121636','#33306c','#874c84','#e48c78']],
  [.68,['#30448a','#7676b0','#e49aa0','#ffd194']],
  [1,['#4a88d4','#76ade6','#b2d4ef','#f1e9cf']]];
const GRADE=[[0,[.22,.25,.47]],[.42,[.5,.42,.64]],[.68,[.97,.8,.78]],[1,[.97,1,1.05]]];
function keyAt(K,p,mix){let k=0;while(k<K.length-2&&p>K[k+1][0])k++;const [p0,a]=K[k],[p1,b]=K[k+1];return mix(a,b,sstep(0,1,(p-p0)/(p1-p0)))}
function skyColor(p,u){return keyAt(SKYK,p,(s0,s1,tt)=>{
  const st=s=>{const x=u*(s.length-1),i=Math.min(s.length-2,Math.floor(x)),f=x-i,a=hex(s[i]),b=hex(s[i+1]);return a.map((v,j)=>lerp(v,b[j],f))};
  const a=st(s0),b=st(s1);return a.map((v,j)=>lerp(v,b[j],tt))})}
const gradeAt=p=>keyAt(GRADE,p,(a,b,tt)=>a.map((v,j)=>lerp(v,b[j],tt)));
const EMIT=new Set(['#ffd47a','#fff0bf','#e9b06a','#f2bf72','#ffcf7a','#f59a62'].map(h=>{const c=hex(h);return c[0]<<16|c[1]<<8|c[2]}));
const WORLD=layer(),wctx=WORLD.getContext('2d');
const STARS=(()=>{const r=rng(91),a=[];for(let k=0;k<60;k++)a.push([Math.floor(r()*W),Math.floor(r()*86),r()]);return a})();
function day1Frame(ctx,t,p,opt={}){
  const sec=t/1000,ms=Math.max(0,opt.morning||0);
  /* bầu trời: vẽ thẳng vào bộ đệm điểm ảnh */
  const img=ctx.createImageData(W,H),d=img.data,N=18,bands=[];
  for(let i=0;i<=N;i++)bands.push(skyColor(p,i/N));
  const put=(x,y,c)=>{const k=(y*W+x)*4;d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2];d[k+3]=255};
  for(let y=0;y<HORIZON;y++){const tt=y/HORIZON*N,i=Math.floor(tt),f=tt-i;for(let x=0;x<W;x++)put(x,y,f>BAYER[y&3][x&3]?bands[Math.min(N,i+1)]:bands[i])}
  const night=1-sstep(.12,.5,p);
  STARS.forEach(([x,y,b])=>{if(b<night*.95)put(x,y,b<.3?[236,238,255]:[150,152,205])});
  // trăng khuyết mờ dần
  if(night>.05){const mx=176,my=24;for(let y=my-6;y<=my+6;y++)for(let x=mx-6;x<=mx+6;x++){const a=Math.hypot(x-mx,y-my),b=Math.hypot(x-mx-3,y-my+2);
    if(a<5.5&&b>4.6&&BAYER[y&3][x&3]<night)put(x,y,[236,232,250])}}
  // mặt trời mọc ở cùng phía với ánh nắng của khung cảnh (bên trái)
  const sx=100,sy=lerp(150,80,sstep(.38,1,p)),glow=sstep(.25,.7,p)*(1-.45*sstep(.85,1,p));
  for(let y=Math.max(0,Math.floor(sy-40));y<HORIZON;y++)for(let x=sx-60;x<sx+60;x++){
    const dd=Math.hypot((x-sx)/1.5,y-sy),dc=Math.hypot(x-sx,y-sy),k=(y*W+x)*4;
    if(dc<8&&p>.4){const c=dc<5.5?[255,252,236]:[255,238,190];d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2]}
    else if(dd<34&&BAYER[y&3][x&3]<glow*.6*(1-dd/34)){d[k]=lerp(d[k],255,.55);d[k+1]=lerp(d[k+1],226,.55);d[k+2]=lerp(d[k+2],160,.55)}
  }
  ctx.putImageData(img,0,0);
  /* cảnh vật: vẽ vào lớp riêng rồi chỉnh màu theo giờ */
  wctx.clearRect(0,0,W,H);
  CLOUDS.forEach(cl=>drawCloud(wctx,cl,-sec*cl.v*.6));
  if(p>.6){GFX.use(wctx);const bx=-20+((sec-6)*16)%(W+80);[[0,0],[7,-3],[13,1],[19,-2]].forEach(([dx,dy],i)=>{const flap=Math.floor(sec*4+i)%2,X=Math.round(bx+dx),Y=Math.round(40+dy);P(X,Y,'#2a2040');P(X-1,Y-flap,'#2a2040');P(X+1,Y-flap,'#2a2040')})}
  wctx.drawImage(L1,0,0);
  if(ms>0)students.forEach((s,i)=>{
    if(!s.v)return;const start=s.v>0?116:330,el=ms-i*.9;if(el<0)return;
    let x=start+s.v*el;const span=216;x=114+((x-114)%span+span)%span;
    drawStudent(wctx,{...s,dir:s.v<0?-1:1},x,'walk',Math.floor(el*6)%4);
  });
  if(opt.static)students.forEach(s=>drawStudent(wctx,{...s,dir:s.dir||(s.v<0?-1:1)},s.x,s.v?'walk':s.pose,0));
  wctx.drawImage(L2,0,0);
  const wi=wctx.getImageData(0,0,W,H),wd=wi.data,[mr,mg,mb]=gradeAt(p),lights=1-sstep(.55,.9,p);
  for(let k=0,n=W*H;k<n;k++){const o=k*4;if(!wd[o+3])continue;const r=wd[o],gg=wd[o+1],b=wd[o+2];
    if(EMIT.has(r<<16|gg<<8|b)){
      const x=k%W,y=(k/W)|0,h=(((x>>3)*73856093)^((y>>2)*19349663))>>>0,th=(h%997)/997;
      const off=lights<th?1:0;
      wd[o]=off?120*mr:r;wd[o+1]=off?92*mg:gg;wd[o+2]=off?140*mb:b;
    }else{wd[o]=r*mr;wd[o+1]=gg*mg;wd[o+2]=b*mb}}
  wctx.putImageData(wi,0,0);
  ctx.drawImage(WORLD,0,0);
  /* đèn đường và đèn cổng tắt dần khi trời sáng */
  GFX.use(ctx);
  if(lights>.02){
    dith(GATE.l-6,GATE.top+11,GATE.r-GATE.l+12,4,'#ffd98a',.36*lights);
    [188,212,236].forEach(x=>P(x,GATE.top+10,'#fff4cc'));
    R(167,68,5,1,'#fff4cc');R(168,69,3,1,'#ffe7a8');
    for(let y=58;y<80;y++)for(let x=156;x<184;x++){const dd=Math.hypot(x-169.5,(y-69)*1.4);if(dd<13&&dd>2&&BAYER[y&3][x&3]<.34*(1-dd/13)*lights)P(x,y,'#ffd98a')}
    for(let y=144;y<158;y++)for(let x=134;x<206;x++){const dd=Math.hypot((x-169)/34,(y-152)/7);if(dd<1&&BAYER[y&3][x&3]<.3*(1-dd)*lights)P(x,y,'#ffd98a')}
  }
  if(opt.minh)drawMinh(ctx,212,157,t);
}
/* ---------- Chân dung ở màn tạo nhân vật ---------- */
const BK={h:'#3b2418',hD:'#24150e',hL:'#6e4630',hR:'#9a6440',sk:'#f2c7a0',skD:'#d09a74',skL:'#ffdcbc',skS:'#b9805e',
  sh:'#4f7fd0',shD:'#3a5ea8',shL:'#86afee',col:'#e9e2d6',bp:'#e6aa2c',bpD:'#b47c1c',bpL:'#ffd468',eye:'#241a2a',mo:'#9a4636',bl:'#f39a9a'};
function face(blink,lash){
  // tai, mặt tròn, đổ bóng phải
  R(9,19,3,7,BK.sk);R(9,19,1,7,BK.skL);R(10,21,1,3,BK.skD);R(36,19,3,7,BK.skD);R(37,21,1,3,BK.skS);
  R(12,12,24,20,BK.sk);R(13,32,22,1,BK.sk);R(15,33,18,1,BK.sk);R(11,15,1,13,BK.sk);R(36,15,1,13,BK.sk);
  R(11,15,2,13,BK.skL);R(33,14,3,18,BK.skD);R(31,30,4,3,BK.skD);R(17,33,14,1,BK.skD);
}
function eyes(blink,lash,brow){
  R(15,17,5,1,brow);R(28,17,5,1,brow);P(14,18,brow);P(33,18,brow);
  if(blink){R(15,22,5,1,BK.eye);R(28,22,5,1,BK.eye);if(lash){P(14,21,BK.eye);P(33,21,BK.eye)}}
  else{
    [[15],[28]].forEach(([x])=>{R(x+1,19,3,1,BK.eye);R(x,20,5,4,BK.eye);R(x+1,24,3,1,BK.eye);R(x+1,20,2,2,'#ffffff');P(x+3,23,'#6a7ab0')});
    if(lash){P(14,19,BK.eye);P(13,20,BK.eye);P(15,19,BK.eye);P(33,19,BK.eye);P(34,20,BK.eye);P(32,19,BK.eye)}
  }
  [[13,25],[30,25]].forEach(([x,y])=>{R(x+1,y,3,2,BK.bl);P(x,y+1,BK.bl);P(x+4,y,BK.bl)});
  P(24,25,BK.skD);P(23,26,BK.skS);
  R(21,28,6,1,BK.mo);P(20,27,BK.mo);P(27,27,BK.mo);R(22,29,4,1,'#c96a5a');
}
function body(){
  R(7,39,34,9,BK.sh);R(9,37,30,2,BK.sh);R(7,39,3,9,BK.shL);R(10,37,3,2,BK.shL);R(36,39,5,9,BK.shD);R(33,37,6,2,BK.shD);
  R(19,36,10,3,BK.col);R(18,37,2,3,BK.col);R(28,37,2,3,BK.col);R(22,38,4,2,BK.skD);
  R(12,37,4,11,BK.bp);R(12,37,1,11,BK.bpL);R(15,37,1,11,BK.bpD);R(32,37,4,11,BK.bp);R(35,37,1,11,BK.bpD);R(32,37,1,11,BK.bpL);
  R(12,43,4,1,BK.bpD);R(32,43,4,1,BK.bpD);
  R(20,31,8,6,BK.skD);R(20,31,2,6,BK.sk);R(21,35,6,1,BK.skS);
}
// Nam: tóc ngắn, mái lởm chởm, lọn dựng trên đỉnh
function bustM(blink){
  return outlined(48,48,()=>{
    body();face();
    R(10,5,28,8,BK.h);R(12,3,24,2,BK.h);R(15,2,18,1,BK.h);R(9,8,2,12,BK.h);R(37,8,2,12,BK.h);
    [[12,13,3],[15,13,4],[19,13,2],[22,13,3],[26,13,4],[30,13,2],[33,13,3]].forEach(([x,y,h],i)=>R(x,y,i%2?3:4,h,BK.h));
    R(11,13,2,4,BK.h);R(35,13,2,5,BK.h);
    R(26,0,3,3,BK.h);R(28,0,2,1,BK.hD);R(24,1,2,2,BK.h);
    R(28,4,9,9,BK.hD);R(33,13,4,4,BK.hD);R(37,9,2,10,BK.hD);
    R(9,9,1,11,BK.hR);R(10,6,1,4,BK.hR);R(12,4,3,1,BK.hR);
    R(14,4,8,1,BK.hL);R(12,6,6,1,BK.hL);R(11,7,3,2,BK.hL);R(20,5,5,1,BK.hL);R(16,9,3,2,BK.hL);
    [[18,9],[24,8],[29,9]].forEach(([x,y])=>R(x,y,1,5,BK.hD));
    eyes(blink,false,BK.hD);
  });
}
// Nữ: tóc dài qua vai, mái lệch, kẹp tóc vàng, mi cong
function bustF(blink){
  return outlined(48,48,()=>{
    // tóc phía sau đầu, rủ xuống sau vai
    R(9,8,30,30,BK.hD);R(8,14,32,22,BK.hD);
    body();face();
    // hai lọn tóc dài phía trước vai
    R(7,14,6,27,BK.h);R(6,20,2,18,BK.h);R(8,41,4,2,BK.h);R(7,14,1,26,BK.hR);R(8,15,1,20,BK.hL);R(11,24,1,16,BK.hD);
    R(35,14,6,27,BK.h);R(41,20,1,17,BK.h);R(36,41,4,2,BK.h);R(39,16,2,24,BK.hD);R(36,24,1,14,BK.hL);
    // đỉnh đầu
    R(10,5,28,9,BK.h);R(12,3,24,2,BK.h);R(15,2,18,1,BK.h);R(9,8,2,10,BK.h);R(37,8,2,10,BK.h);
    // mái lệch sang phải người xem
    R(12,13,20,2,BK.h);R(12,15,13,1,BK.h);R(12,16,8,1,BK.h);R(12,17,4,1,BK.h);R(31,13,3,3,BK.h);R(34,13,3,6,BK.h);R(11,13,2,6,BK.h);
    R(14,14,6,1,BK.hL);R(21,13,5,1,BK.hL);R(26,14,1,1,BK.hD);R(18,15,1,2,BK.hD);
    // sáng tối
    R(29,4,8,9,BK.hD);R(37,9,2,9,BK.hD);
    R(9,9,1,9,BK.hR);R(10,6,1,4,BK.hR);R(12,4,3,1,BK.hR);
    R(14,4,8,1,BK.hL);R(12,6,6,1,BK.hL);R(11,7,3,2,BK.hL);R(20,5,5,1,BK.hL);R(17,9,3,2,BK.hL);
    [[19,8],[25,7]].forEach(([x,y])=>R(x,y,1,5,BK.hD));
    // kẹp tóc
    R(30,9,5,2,'#ffc94d');R(30,9,5,1,'#fff0a0');P(34,10,'#c8901e');
    eyes(blink,true,BK.hD);
  });
}
const FR={nam:{open:bustM(false),blink:bustM(true)},nu:{open:bustF(false),blink:bustF(true)}};
function drawBg(c){
  const cols=['#2a2756','#3e3165','#5a3d71','#7b4674','#a0506f','#c8626a','#e27c60','#f39f5e'];
  for(let i=0;i<cols.length;i++){c.fillStyle=cols[i];c.fillRect(0,Math.round(i*48/cols.length),48,Math.ceil(48/cols.length))}
  c.fillStyle='#4a3768';[[2,28,6,20],[8,34,5,14],[38,24,7,24],[44,32,4,16]].forEach(([x,y,w,h])=>c.fillRect(x,y,w,h));
  c.fillStyle='#f2bf72';[[4,32],[40,28],[42,36],[3,40]].forEach(([x,y])=>c.fillRect(x,y,1,1));
}
function bustDraw(ctx,t,animate,gender='nam'){
  ctx.imageSmoothingEnabled=false;drawBg(ctx);
  const blink=animate&&(Math.floor(t/120)%32===0),fr=FR[gender]||FR.nam;
  ctx.drawImage(blink?fr.blink:fr.open,0,0);
}

Scenes.cover={frame,day1Frame,bust:bustDraw};
})();
