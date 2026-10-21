/* 30 Ngày Sài Gòn · bản đồ khu phố (design/09): 8 địa điểm, nơi miễn phí gần phòng trọ, nơi tốn tiền xa dần theo giá.
 * frame(ctx,t,o): o.slot, o.at (đang ở), o.sel (đang chọn), o.weekend, o.quests (id có nhiệm vụ), o.broken (xe hỏng), o.gender */
(()=>{
const {W,H,BAYER,rng,mk,R,P,shade,dith,outlined,canopy,LEAF,chars,textW,text,sign}=GFX;

/* ---------- Dữ liệu địa điểm (theo GAME_DESIGN mục 5 và src/game.js) ---------- */
const PLACES=[
 {id:'home',n:'Phòng trọ',lb:'PHÒNG TRỌ',cost:0,box:[22,128,30,22],ax:56,ay:160,lx:28,ly:116},
 {id:'street',n:'Quán ăn',lb:'QUÁN ĂN',cost:0,box:[56,110,30,14],ax:71,ay:104,lx:71,ly:126},
 {id:'market',n:'Chợ',lb:'CHỢ',cost:0,box:[14,72,64,24],ax:46,ay:104,lx:46,ly:64},
 {id:'park',n:'Công viên',lb:'CÔNG VIÊN',cost:0,box:[98,112,44,44],ax:114,ay:160,lx:120,ly:104},
 {id:'cafe',n:'Quán cà phê',lb:'CÀ PHÊ',cost:5000,box:[28,28,36,24],ax:92,ay:36,lx:46,ly:16},
 {id:'school',n:'Trường đại học',lb:'TRƯỜNG',cost:6000,box:[156,112,56,44],ax:146,ay:134,lx:184,ly:104},
 {id:'store',n:'Cửa hàng tiện lợi',lb:'TIỆN LỢI',cost:0,box:[104,76,28,18],ax:117,ay:104,lx:118,ly:66},
 {id:'mall',n:'Trung tâm thương mại',lb:'TTTM',cost:12000,box:[156,14,56,74],ax:146,ay:50,lx:184,ly:4},
];
/* ---------- Vẽ bản đồ ---------- */
const MAPW=216;
function roofs(x0,y0,w,h,seed){const r=rng(seed);for(let y=y0;y<y0+h;y+=7)for(let x=x0;x<x0+w;){const bw=5+Math.floor(r()*6);if(x+bw>x0+w)break;
  const col=['#c8704a','#d8885a','#9aa0a8','#6a8ab0','#b8a890','#c86a5a'][Math.floor(r()*6)];R(x,y,bw-1,6,col);R(x,y,bw-1,1,'rgba(255,255,255,.3)');R(x,y+5,bw-1,1,'rgba(0,0,0,.25)');if(r()<.25)R(x+1,y+2,2,2,'#e8eef0');x+=bw}}
function road(x,y,w,h,vert){R(x,y,w,h,'#5c5a66');
  if(vert){R(x-2,y,2,h,'#c8bcb0');R(x+w,y,2,h,'#c8bcb0');for(let k=y;k<y+h;k+=8)R(x+w/2-.5,k,1,4,'#d8d0a0')}
  else{R(x,y-2,w,2,'#c8bcb0');R(x,y+h,w,2,'#c8bcb0');for(let k=x;k<x+w;k+=8)R(k,y+h/2-.5,4,1,'#d8d0a0')}}
function mapBase(){
  const c=mk();GFX.use(c.getContext('2d'));
  R(0,0,W,H,'#e4d8c2');
  // khối nhà dân
  roofs(4,108,46,18,3);roofs(4,150,40,10,9);roofs(160,96,50,12,13);
  // kênh và cầu
  for(let y=166;y<H;y++)for(let x=0;x<MAPW;x++)P(x,y,shade((y-166)/14+(BAYER[y&3][x&3]-.5)*.2,['#5aa0c8','#6ab0d0','#7ac0dc','#8acce4'],x,y));R(0,165,MAPW,1,'#4a7a98');
  [[88,164],[142,164]].forEach(([x,y])=>{R(x-2,y,12,14,'#a8a098');R(x-2,y,12,1,'#d8d0c8');R(x-2,y+13,12,1,'#7a746e')});
  // góc trên trái: quán cà phê giữa các mái nhà
  roofs(8,12,76,14,21);roofs(8,52,76,6,23);roofs(8,26,18,26,25);roofs(66,26,18,26,27);
  R(28,28,36,24,'#8a5a36');R(28,28,36,2,'#b07a4a');for(let x=28;x<64;x+=6){R(x,40,3,4,'#e6aa2c');R(x+3,40,3,4,'#f4f1ea')}
  R(32,32,10,6,'#ffe7a8');R(48,32,10,6,'#ffe7a8');[[34,47,'#3f9a5a'],[46,47,'#e85a3a'],[58,47,'#3f9a5a']].forEach(([x,y,c])=>{R(x-2,y,5,1,c);R(x-1,y-1,3,1,c);R(x,y+1,1,3,'#5a4434')});
  // chợ: mái tôn đỏ
  R(14,72,64,24,'#b4503a');for(let x=14;x<78;x+=4)R(x,72,2,24,'#c8604a');R(14,72,64,2,'#e07a5a');R(14,94,64,2,'#7a3a2a');R(42,72,8,24,'#9a4030');
  // giữa trên: mái nhà và cửa hàng tiện lợi sát đường lớn
  roofs(100,10,40,20,5);roofs(100,40,40,30,15);
  R(104,76,28,18,'#f4f6f6');R(104,76,28,4,'#3f9a5a');R(104,76,28,1,'#6aca8a');R(108,84,8,8,'#bfe0f0');R(120,84,8,10,'#2f7a46');
  // quán ăn: dãy dù che
  R(56,110,30,14,'#d8c8b0');[[58,'#e85a3a'],[66,'#ffc94d'],[74,'#3f7ac0'],[82,'#e85a3a']].forEach(([x,col])=>{R(x,111,6,6,col);R(x+1,110,4,1,col);P(x+2,113,'rgba(255,255,255,.6)');R(x+2,118,2,4,'#7a6a5a')});
  // phòng trọ trong hẻm 42
  R(4,132,50,18,'#d8ccb4');R(22,128,30,22,'#93bfb0');R(22,128,30,2,'#bcdccc');R(22,148,30,2,'#5f8c80');for(let x=24;x<50;x+=7)R(x,132,4,4,'#bfdcf0');R(34,142,6,8,'#a8744a');
  R(56,148,30,7,'#8a8690');R(56,148,30,1,'#a8a4ae');text('HẺM 42',59,149,'#f4f1ea');
  // giữa dưới: công viên bờ kênh
  R(98,112,44,44,'#86bc6a');for(let y=112;y<156;y+=4)for(let x=98;x<142;x+=4)if(BAYER[y&3][x&3]<.3)P(x+1,y+1,'#9ad07a');
  for(let y=-5;y<=5;y++)for(let x=-9;x<=9;x++)if(Math.hypot(x/9,y/5)<1)P(124+x,128+y,Math.hypot(x/9,y/5)>.8?'#5a90b0':'#7ac0dc');
  for(let x=98;x<142;x++)P(x,Math.round(146+Math.sin(x/7)*2),'#e8dcb8');R(98,152,44,2,'#e8dcb8');
  [[104,118],[136,116],[104,138],[138,140],[118,150]].forEach(([x,y],i)=>canopy(x,y,4,3,LEAF,300+i,[-1,.6]));
  // góc trên phải: trung tâm thương mại mái kính
  R(156,14,56,74,'#9aa8b8');R(160,18,48,46,'#7ab0d8');for(let x=162;x<206;x+=8)R(x,18,1,46,'#5a8ab0');for(let y=20;y<64;y+=6)R(160,y,48,1,'#5a8ab0');R(156,14,56,2,'#c8d4e0');
  R(158,68,52,18,'#6a6874');for(let y=70;y<86;y+=5)for(let x=160;x<208;x+=6)R(x,y,4,2,['#d65a5a','#4f7fd0','#f4f1ea','#ffc94d'][((x/6|0)+y)%4]);
  // góc dưới phải: trường đại học
  R(156,112,56,44,'#cfc0b2');R(160,114,20,26,'#efe2d4');for(let x=162;x<180;x+=4)R(x,114,1,26,'#f07a2e');R(184,116,24,20,'#efe2d4');for(let y=118;y<136;y+=4)R(184,y,24,1,'#f07a2e');
  R(164,142,44,12,'#7ab86a');R(166,144,40,8,'#9ad07a');for(let x=168;x<204;x+=6)R(x,148,3,1,'#f4f1ea');R(180,136,6,6,'#f07a2e');
  // đường lớn và hẻm
  road(0,100,MAPW,8,false);road(88,8,8,158,true);road(142,8,8,158,true);road(0,158,MAPW,6,false);road(92,32,50,6,false);road(150,130,6,4,false);
  // khung bản đồ
  R(MAPW,0,W-MAPW,H,'#1f2440');
  return c;
}
const GRADE=[[1,.97,.95],[1.02,1.02,1.04],[1,.86,.78],[.34,.36,.6]];
const grade=(src,slot)=>GFX.grade(src,slot,GRADE);
function nightLights(){const c=mk();GFX.use(c.getContext('2d'));const r=rng(17);
  for(let k=0;k<80;k++){const x=Math.floor(r()*MAPW),y=Math.floor(r()*160);if(BAYER[y&3][x&3]<.5)P(x,y,'rgba(255,212,122,.85)')}
  [[108,84,8,8],[160,18,48,46],[24,132,26,4],[32,32,26,6]].forEach(([x,y,w,h])=>R(x,y,w,h,'rgba(255,212,122,.45)'));
  for(let x=0;x<MAPW;x+=12){P(x,99,'#ffd98a');P(x,108,'#ffd98a')}for(let y=8;y<166;y+=12){P(87,y,'#ffd98a');P(150,y,'#ffd98a')}
  return c}

/* ---------- Ghép bản đồ ---------- */
let B=null;
function build(){B={base:mapBase()};B.g=[0,1,2,3].map(s=>grade(B.base,s));B.night=nightLights()}
function isOpen(p,slot,weekend){
  if(p.id==='market')return slot<=2?null:'Chợ chỉ mở sáng đến chiều';
  if(p.id==='school')return weekend?'Cuối tuần trường không mở':slot<=2?null:'Trường chỉ mở sáng đến chiều';
  if(p.id==='mall')return slot>=1?null:'TTTM mở từ buổi trưa';
  return null;
}
function route(a,b){return [[a.ax,a.ay],[a.ax,104],[b.ax,104],[b.ax,b.ay]]}
function frame(ctx,t,o={}){
  if(!B)build();const anim=o.animate!==false;ctx.imageSmoothingEnabled=false;GFX.use(ctx);
  const slot=o.slot||0;ctx.drawImage(B.g[slot],0,0);if(slot===3)ctx.drawImage(B.night,0,0);
  const cur=PLACES.find(p=>p.id===o.at)||PLACES[0],sel=PLACES.find(p=>p.id===o.sel);
  // đường đi từ chỗ đang đứng tới nơi được chọn (chấm chạy)
  if(sel&&sel!==cur){const pts=[[cur.box[0]+cur.box[2]/2,cur.box[1]+cur.box[3]/2],...route(cur,sel),[sel.box[0]+sel.box[2]/2,sel.box[1]+sel.box[3]/2]];
    let k=0;const off=anim?Math.floor(t/90)%6:0;
    for(let i=0;i<pts.length-1;i++){const [x1,y1]=pts[i],[x2,y2]=pts[i+1],n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));
      for(let s=0;s<=n;s++){const x=Math.round(x1+(x2-x1)*s/n),y=Math.round(y1+(y2-y1)*s/n);if((k+off)%6<3){R(x-1,y-1,3,3,'#1d1a10');P(x,y,'#ffc94d')}k++}}}
  // khung chọn và nhãn từng địa điểm
  PLACES.forEach(p=>{const closed=isOpen(p,slot,o.weekend),[x,y,w,h]=p.box;
    if(closed){GFX.use(ctx);for(let j=0;j<h;j++)for(let i=0;i<w;i++)if((i+j)%4===0)P(x+i,y+j,'rgba(20,22,40,.45)')}
    if(sel===p){const on=!anim||Math.floor(t/400)%2;GFX.use(ctx);R(x-2,y-2,w+4,1,on?'#ffc94d':'#fff0a0');R(x-2,y+h+1,w+4,1,on?'#ffc94d':'#fff0a0');R(x-2,y-2,1,h+4,on?'#ffc94d':'#fff0a0');R(x+w+1,y-2,1,h+4,on?'#ffc94d':'#fff0a0')}
    const bg=closed?'#4a4e66':sel===p?'#ffc94d':'#1d2136',fg=closed?'#a4a9c8':sel===p?'#1d1a10':'#fff3e2';sign(p.lx,p.ly,p.lb,bg,fg,2);
    if(p.cost){const s=(p.cost*(o.broken?3:1)/1000)+'K';const w2=textW(s)+4,xx=Math.round(p.lx-w2/2);R(xx,p.ly+11,w2,7,'#e85a3a');text(s,xx+2,p.ly+12,'#ffffff')}
    if(o.quests&&o.quests.includes(p.id)){const bob=anim?Math.floor(t/300)%2:0,qx=Math.round(p.lx+(textW(p.lb)+4)/2+3),qy=p.ly+1-bob;R(qx,qy,7,8,'#ffc94d');R(qx+1,qy-1,5,1,'#ffc94d');R(qx+3,qy+1,1,4,'#1d1a10');P(qx+3,qy+6,'#1d1a10');R(qx+2,qy+8,3,1,'#ffc94d');P(qx+3,qy+9,'#ffc94d')}
  });
  // nhân vật ở địa điểm hiện tại
  {const [x,y,w]=cur.box,bob=anim?Math.floor(t/500)%2:0,top=cur.ly<12,cx=top?Math.round(cur.lx+textW(cur.lb)/2+10):Math.round(cur.lx),cy=(top?cur.ly+11:Math.min(y,cur.ly)-3)-bob,hair=o.gender==='nu';GFX.use(ctx);
    R(cx-5,cy-9,10,10,'#1d2136');R(cx-4,cy-8,8,8,'#f2c7a0');R(cx-4,cy-9,8,3,'#3b2418');if(hair){R(cx-5,cy-8,2,8,'#3b2418');R(cx+3,cy-8,2,8,'#3b2418')}
    P(cx-2,cy-4,'#241a2a');P(cx+1,cy-4,'#241a2a');P(cx-3,cy-2,'#f39a9a');P(cx+2,cy-2,'#f39a9a');R(cx-1,cy+1,2,2,'#1d2136');P(cx,cy+3,'#1d2136')}
}
Scenes.map={PLACES,MAPW,frame,isOpen};
})();
