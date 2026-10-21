/* 30 Ngày Sài Gòn · đồ họa: công cụ vẽ dùng chung cho mọi cảnh, nhân vật, chân dung, biểu tượng.
 * Gom từ design/05-truong-dai-hoc.html (giống hệt ở các file thiết kế khác). Lưới cảnh 320×180.
 * Mọi hàm vẽ R/P/dith/text vẽ lên ngữ cảnh hiện tại; đổi ngữ cảnh bằng GFX.use(ctx). */
const GFX=(()=>{
const W=320,H=180;
const BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(r=>r.map(v=>(v+.5)/16));
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const mk=(w=W,h=H)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
let g=null;
const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
const P=(x,y,col)=>R(x,y,1,1,col);
const shade=(v,t,x,y)=>{v=Math.max(0,Math.min(1,v));const s=v*(t.length-1),i=Math.floor(s),f=s-i;return t[Math.min(t.length-1,i+(f>BAYER[y&3][x&3]?1:0))]};
function dith(x,y,w,h,col,lv){for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=x+i,Y=y+j;if(BAYER[Y&3][X&3]<lv)P(X,Y,col)}}
function outlined(w,h,draw){
  const cv=mk(w,h),x=cv.getContext('2d'),keep=g;g=x;draw();g=keep;
  const im=x.getImageData(0,0,w,h),d=im.data,s=new Uint8ClampedArray(d),at=(i,j)=>(j*w+i)*4;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){if(s[at(i,j)+3])continue;let n=null;
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=i+a,Y=j+b;if(X>=0&&Y>=0&&X<w&&Y<h&&s[at(X,Y)+3]){n=at(X,Y);break}}
    if(n===null)continue;const k=at(i,j);d[k]=s[n]*.28+8;d[k+1]=s[n+1]*.22+6;d[k+2]=s[n+2]*.3+16;d[k+3]=255}
  x.putImageData(im,0,0);return cv;
}
function canopy(cx,cy,rx,ry,tones,seed,light){
  const r=rng(seed),blobs=[],n=Math.round(rx*ry/14)+6;
  for(let i=0;i<n;i++){const a=r()*Math.PI*2,d=Math.sqrt(r())*.72;blobs.push({x:cx+Math.cos(a)*d*rx,y:cy+Math.sin(a)*d*ry,r:Math.min(rx,ry)*(.35+r()*.3)})}
  const [lx,ly]=light,ll=Math.hypot(lx,ly);
  for(let y=Math.floor(cy-ry-6);y<cy+ry+6;y++)for(let x=Math.floor(cx-rx-6);x<cx+rx+6;x++){
    let best=null,bd=9;for(const b of blobs){const d=Math.hypot(x-b.x,y-b.y)/b.r;if(d<bd){bd=d;best=b}}
    if(bd>1+(BAYER[y&3][x&3]-.5)*.25)continue;
    const nx=(x-best.x)/best.r,ny=(y-best.y)/best.r,gx=(x-cx)/rx,gy=(y-cy)/ry;
    P(x,y,shade(.42+.28*(-(nx*lx+ny*ly)/ll)+.3*(-(gx*lx+gy*ly)/ll)-.18*Math.max(0,gy),tones,x,y));
  }
}
const LEAF=['#163b33','#1f5040','#2f6b4a','#55915a','#a8b860'];

/* ---------- Chữ pixel 3×5 có dấu tiếng Việt ---------- */
const GL={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['011','100','100','100','011'],D:['110','101','101','101','110'],
 'Đ':['0110','0101','1101','0101','0110'],E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['011','100','101','101','011'],
 H:['101','101','111','101','101'],I:['111','010','010','010','111'],K:['101','101','110','101','101'],L:['100','100','100','100','111'],
 M:['10001','11011','10101','10001','10001'],N:['1001','1101','1011','1001','1001'],O:['010','101','101','101','010'],P:['110','101','110','100','100'],Q:['010','101','101','110','011'],
 R:['110','101','110','101','101'],S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],
 V:['101','101','101','101','010'],X:['101','101','010','101','101'],Y:['101','101','010','010','010'],
 0:['111','101','101','101','111'],1:['010','110','010','010','111'],2:['110','001','010','100','111'],3:['110','001','010','001','110'],
 4:['101','101','111','001','001'],5:['111','100','110','001','110'],6:['011','100','110','101','010'],7:['111','001','010','010','010'],
 8:['010','101','010','101','010'],9:['010','101','011','001','110'],':':['0','1','0','1','0'],'/':['001','001','010','100','100'],
 '-':['000','000','111','000','000'],'+':['000','010','111','010','000'],'.':['0','0','0','0','1'],'!':['1','1','1','0','1'],' ':['00','00','00','00','00']};
function chars(str){const out=[];for(const ch of str.toUpperCase().normalize('NFD')){if(/[\u0300-\u036f]/.test(ch)){if(out.length)out[out.length-1].m.push(ch)}else out.push({b:ch,m:[]})}return out}
function textW(str){return chars(str).reduce((s,c)=>s+(GL[c.b]||GL[' '])[0].length+(c.m.includes('\u031b')?1:0)+1,0)-1}
function text(str,x,y,col){
  for(const c of chars(str)){const gl=GL[c.b]||GL[' '],w=gl[0].length,cx=x+Math.floor((w-1)/2);
    gl.forEach((row,j)=>{for(let i=0;i<w;i++)if(row[i]==='1')P(x+i,y+j,col)});
    let up=0;
    for(const m of c.m){
      if(m==='\u031b'){P(x+w,y-1,col);P(x+w,y,col)}
      else if(m==='\u0302'){P(cx-1,y-1,col);P(cx,y-2,col);P(cx+1,y-1,col);up=2}
      else if(m==='\u0306'){P(cx-1,y-2,col);P(cx+1,y-2,col);P(cx,y-1,col);up=2}
      else if(m==='\u0323')P(cx,y+6,col);
      else if(m==='\u0301'){P(cx+1,y-2-up,col)}
      else if(m==='\u0300'){P(cx-1,y-2-up,col)}
      else if(m==='\u0309'){P(cx,y-3-up,col);P(cx+1,y-3-up,col);P(cx+1,y-2-up,col)}
      else if(m==='\u0303'){P(cx-1,y-2-up,col);P(cx,y-3-up,col);P(cx+1,y-2-up,col)}
    }
    x+=w+(c.m.includes('\u031b')?1:0)+1;
  }
}
function sign(cx,y,str,bg,fg,pad=3){const w=textW(str)+pad*2,x=Math.round(cx-w/2);R(x,y,w,11,bg);R(x,y,w,1,'rgba(255,255,255,.25)');R(x,y+10,w,1,'rgba(0,0,0,.3)');text(str,x+pad,y+4,fg);return [x,w]}

/* ---------- Phủ màu theo buổi: mỗi cảnh có bảng hệ số kênh màu riêng, buổi trưa (slot 1) giữ nguyên ---------- */
function grade(src,slot,table){const c=mk(src.width,src.height),x=c.getContext('2d');x.drawImage(src,0,0);if(slot===1)return c;const im=x.getImageData(0,0,c.width,c.height),d=im.data,[mr,mg,mb]=table[slot];
  for(let k=0;k<d.length;k+=4){d[k]=Math.min(255,d[k]*mr);d[k+1]=Math.min(255,d[k+1]*mg);d[k+2]=Math.min(255,d[k+2]*mb)}x.putImageData(im,0,0);return c}

return {W,H,BAYER,rng,mk,R,P,shade,dith,outlined,canopy,LEAF,GL,chars,textW,text,sign,grade,use:ctx=>{g=ctx},ctx:()=>g};
})();
/* Mỗi file trong src/gfx/scenes/ đăng ký hàm vẽ cảnh vào đây */
const Scenes={};
