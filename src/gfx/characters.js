/* 30 Ngày Sài Gòn · đồ họa: nhân vật.
 * - person/LOOK/drawPerson: nhân vật nhìn thẳng khung 30×54 (người phụ), backBust, student (khách đi bộ), sitter (người ngồi)
 *   gom từ design/05-truong-dai-hoc.html (giống hệt ở 06–09)
 * - hero/sprite/BUB: nhân vật chính theo giới tính, trang phục, biểu cảm và bong bóng trạng thái, từ design/12 thẻ 3 */
const Chars=(()=>{
const {W,H,BAYER,rng,mk,R,P,shade,dith,outlined}=GFX;
/* ---------- Nhân vật ---------- */
const K={h:'#3b2418',hD:'#24150e',hL:'#6e4630',hR:'#9a6440',sk:'#f2c7a0',skD:'#d09a74',skL:'#ffdcbc',
  sh:'#4f7fd0',shD:'#3a5ea8',shL:'#86afee',col:'#f4f1ea',pa:'#33405e',paD:'#252f48',paL:'#4b5a80',so:'#5a3a2a',soL:'#80583e',
  bp:'#e6aa2c',bpD:'#b47c1c',eye:'#241a2a',bl:'#f39a9a',mo:'#9a4636'};
// nhân vật đứng nhìn thẳng, dùng chung cho nhân vật chính và nhân vật phụ
function person(o,blink,b){
  const C={...K,...(o.c||{})};
  return outlined(30,54,()=>{
    const c=15;
    if(o.hair==='long')R(c-9,6+b,18,24,C.hD);
    if(o.seated){
      // ngồi trên ghế đá: đùi hướng về phía trước nên chỉ thấy đầu gối và cẳng chân ngắn
      R(c-7,38,14,4,C.pa);R(c-7,38,14,1,C.paL);R(c-1,39,2,3,C.paD);
      R(c-6,42,4,4,C.pa);R(c+2,42,4,4,C.paD);R(c-6,42,1,4,C.paL);
      R(c-7,46,6,3,C.so);R(c+1,46,6,3,C.so);R(c-7,46,6,1,C.soL);R(c+1,46,6,1,C.soL);
    }else{
    R(c-6,48,5,4,C.so);R(c+1,48,5,4,C.so);R(c-6,48,5,1,C.soL);R(c+1,48,5,1,C.soL);
    if(o.skirt){R(c-5,44,4,4,C.sk);R(c+1,44,4,4,C.skD);R(c-5,46,4,2,'#f4f1ea');R(c+1,46,4,2,'#d8d2c8')}
    else{R(c-6,38,12,5,C.pa);R(c-6,43,5,5,C.pa);R(c+1,43,5,5,C.pa);R(c-6,38,1,10,C.paL);R(c+5,38,1,10,C.paD);R(c-2,43,1,5,C.paD)}
    }
    R(c-7,24+b,14,15-b,C.sh);R(c-7,24+b,2,15-b,C.shL);R(c+5,24+b,2,15-b,C.shD);R(c-7,38,14,1,C.shD);
    R(c-2,24+b,4,2,C.col);P(c-3,24+b,C.col);P(c+2,24+b,C.col);R(c-1,26+b,2,1,C.skD);
    if(o.skirt){for(let y=36;y<45;y++){const half=7+Math.floor((y-36)/3);for(let x=c-half;x<c+half;x++){const pl=((x-c+20)%3===0);R(x,y,1,1,x<c-half+2?C.paL:x>=c+half-2?C.paD:pl?C.paD:C.pa)}}R(c-7,36,14,1,'#252f48');R(c-9,44,18,1,C.paD)}
    if(o.straps){R(c-5,24+b,2,13-b,C.bp);R(c+3,24+b,2,13-b,C.bp);R(c-5,24+b,1,13-b,'#ffd468');R(c+4,24+b,1,13-b,C.bpD)}
    if(o.tie){R(c-1,26+b,2,8,o.tie);P(c-1,26+b,'#ffffff')}
    if(o.lanyard){P(c-3,26+b,o.lanyard);P(c-2,28+b,o.lanyard);P(c-1,30+b,o.lanyard);R(c-2,31+b,4,4,'#f4f1ea');R(c-1,32+b,2,1,'#4f7fd0')}
    if(o.apron){R(c-6,30+b,12,10-b,o.apron);R(c-6,30+b,12,1,'#ffffff');R(c-3,26+b,1,4,o.apron);R(c+2,26+b,1,4,o.apron)}
    if(o.print){R(c-2,29+b,4,4,o.print);P(c-1,30+b,'#ffffff')}
    R(c-11,25+b,3,5,C.sh);R(c-11,25+b,1,5,C.shL);R(c-11,30+b,3,6,C.sk);R(c-11,35+b,3,2,C.skD);
    R(c+8,25+b,3,5,C.shD);R(c+8,30+b,3,6,C.skD);R(c+8,35+b,3,2,C.skD);
    if(o.reading){R(c-6,29+b,12,9,o.reading);R(c-6,29+b,12,1,'rgba(255,255,255,.4)');R(c-5,37+b,10,1,'#f4f1ea');R(c,29+b,1,9,'rgba(0,0,0,.3)');R(c-3,32+b,3,2,'#ffc94d');
      R(c-9,32+b,3,3,C.sk);R(c+6,32+b,3,3,C.skD)}
    if(o.book){R(c+6,28+b,6,8,o.book);R(c+6,28+b,6,1,'#ffffff');R(c+11,28+b,1,8,'rgba(0,0,0,.3)')}
    R(c-2,21+b,4,3,C.skD);
    const y=3+b;
    R(c-7,y+6,14,13,C.sk);R(c-6,y+19,12,1,C.sk);R(c-8,y+8,1,9,C.sk);R(c+7,y+8,1,9,C.sk);
    R(c-7,y+8,2,10,C.skL);R(c+5,y+7,2,12,C.skD);R(c-9,y+10,2,4,C.sk);R(c+7,y+10,2,4,C.skD);
    if(blink){R(c-5,y+13,3,1,C.eye);R(c+2,y+13,3,1,C.eye)}
    else{[c-5,c+2].forEach(x=>{R(x,y+11,3,3,C.eye);P(x,y+11,'#ffffff');P(x+2,y+13,'#6a7ab0')});if(o.lash){P(c-6,y+11,C.eye);P(c+5,y+11,C.eye)}}
    if(o.glasses){R(c-6,y+10,5,5,'rgba(0,0,0,0)');[c-6,c+1].forEach(x=>{R(x,y+10,5,1,'#2a2a38');R(x,y+14,5,1,'#2a2a38');R(x,y+10,1,5,'#2a2a38');R(x+4,y+10,1,5,'#2a2a38')});R(c-1,y+11,2,1,'#2a2a38')}
    if(o.beard)R(c-4,y+17,8,2,'#5a4a42');
    R(c-6,y+15,2,1,C.bl);R(c+4,y+15,2,1,C.bl);
    R(c-1,y+16,3,1,C.mo);P(c-2,y+15,C.mo);P(c+2,y+15,C.mo);
    R(c-8,y+1,16,6,C.h);R(c-7,y,14,1,C.h);R(c-5,y-1,10,1,C.h);R(c-9,y+3,2,8,C.h);R(c+7,y+3,2,8,C.h);
    if(o.hair==='long'){R(c-10,y+6,3,22,C.h);R(c+7,y+6,3,22,C.h);R(c-10,y+6,1,21,C.hR);R(c+9,y+8,1,20,C.hD);R(c-7,y+7,10,2,C.h);R(c-7,y+9,5,1,C.h);R(c+3,y+7,4,3,C.h);if(o.clip){R(c+2,y+3,4,2,o.clip);R(c+2,y+3,4,1,'#fff0a0')}}
    else if(o.hair==='pony'){R(c-7,y+7,14,2,C.h);R(c+8,y+2,3,3,C.h);R(c+9,y+5,3,10,C.h);R(c+9,y+12,2,4,C.hD);P(c+8,y+3,o.tieC||'#ff7a9a')}
    else if(o.hair==='side'){R(c-7,y+7,9,2,C.h);R(c+4,y+7,3,2,C.h);R(c-7,y+9,3,1,C.h);R(c-1,y,6,2,C.hL)}
    else if(o.hair==='net'){R(c-8,y,16,7,'#e8eef4');R(c-8,y+6,16,1,'#c8d0da');for(let x=c-7;x<c+8;x+=2)P(x,y+2,'#c8d0da')}
    else{[[-7,2],[-4,3],[-1,2],[2,3],[5,2]].forEach(([dx,hh])=>R(c+dx,y+7,3,hh,C.h));if(o.tuft!==false){R(c+1,y-3,2,2,C.h);P(c+3,y-3,C.hD);P(c,y-2,C.h)}}
    if(o.hair!=='net'){R(c+3,y+1,5,5,C.hD);R(c-8,y+2,1,6,C.hR);R(c-6,y,4,1,C.hL);R(c-7,y+1,3,2,C.hL)}
    R(c-6,y+9,3,1,C.hD);R(c+2,y+9,3,1,C.hD);
    if(o.grey){R(c-8,y+3,1,4,'#c8c4c0');R(c+7,y+3,1,4,'#c8c4c0')}
  });
}
const LOOK={
  nam:{straps:1},nu:{straps:1,hair:'long',clip:'#ffc94d',lash:1,skirt:1},
  hai:{tuft:false,glasses:1,grey:1,hair:'side',c:{h:'#2a2420',hD:'#1a1612',hL:'#4a4038',hR:'#6a5a50',sh:'#f2f0ea',shD:'#cfc6bc',shL:'#ffffff',col:'#f2f0ea',pa:'#5a4a3a',paD:'#3e3226',paL:'#7a6a58',sk:'#e8b890',skD:'#c99872',skL:'#f6d0ac'},tie:'#3a5ea8',book:'#d65a5a'},
  linh:{hair:'pony',lash:1,tieC:'#ffc94d',c:{h:'#5a3424',hD:'#3a2016',hL:'#8a5a40',hR:'#a8704e',sh:'#9a6ad0',shD:'#7a4ab0',shL:'#c09af0',col:'#9a6ad0',pa:'#33405e'},lanyard:'#ffc94d',print:'#ffc94d'},
  sit:{seated:1,hair:'long',lash:1,reading:'#d65a5a',c:{h:'#2a1a12',hD:'#170e0a',hL:'#5a3a28',hR:'#7a4a30',sh:'#7ec0a8',shD:'#5a9a84',shL:'#a8e0c8',col:'#f4f1ea',pa:'#3a4a70',paD:'#2a3656',paL:'#4a5a84',so:'#f2ece4',soL:'#ffffff'}},
  co:{hair:'net',c:{sh:'#e06a5a',shD:'#b44a40',shL:'#f8907c',col:'#e06a5a',sk:'#e0ac82',skD:'#b98060',skL:'#f2c49c',pa:'#3a3a48'},apron:'#f4f1ea'},
};
const SPR={};
function spr(key){if(!SPR[key]){const o=LOOK[key];SPR[key]=[person(o,false,0),person(o,false,1),person(o,true,0)]}return SPR[key]}
function drawPerson(ctx,key,cx,feet,t,animate,flip){
  const f=spr(key),blink=animate&&Math.floor((t+cx*37)/120)%34===0,bob=animate&&Math.floor((t+cx*11)/900)%2;
  GFX.use(ctx);for(let k=0;k<18;k++)dith(cx-9+k,feet-1,1,3,'#3a2e36',.45);
  const im=blink?f[2]:f[bob?1:0];
  if(flip){ctx.save();ctx.translate(cx+15,feet-52);ctx.scale(-1,1);ctx.drawImage(im,0,0);ctx.restore()}else ctx.drawImage(im,cx-15,feet-52);
}
// sinh viên ngồi, nhìn từ phía sau (đầu và vai)
function backBust(hair,shirt,long,seed){
  return outlined(20,22,()=>{const r=rng(seed);
    R(2,13,16,9,shirt);R(2,13,2,9,'rgba(255,255,255,.3)');R(15,13,3,9,'rgba(0,0,0,.25)');
    R(8,10,4,3,'#d09a74');
    R(4,1,12,11,hair);R(5,0,10,1,hair);R(3,3,1,7,hair);R(16,3,1,7,hair);
    if(long){R(3,8,14,9,hair);R(2,10,1,6,hair);R(17,10,1,6,hair)}
    R(4,2,4,2,'rgba(255,255,255,.18)');R(12,2,4,9,'rgba(0,0,0,.22)');
    R(2,6,2,3,'#f2c7a0');R(16,6,2,3,'#d09a74');
    if(r()<.5)P(10,0,hair);
  });
}
function student(o,f){ // nhìn nghiêng, đi bộ (rút gọn từ bộ sinh viên ở trang bìa)
  return outlined(20,32,()=>{const c=9,stride=[2,0,-2,0][f%4],T=f%2?-1:0;
    [[c-1-stride,o.bD],[c-1+stride,o.b]].forEach(([lx,col])=>{R(lx,21,3,6,o.skirt?'#e0b490':col);R(lx,27,4,2,'#2a2a34');R(lx+1,28,3,1,'#e8e0d4')});
    if(o.skirt){R(c-4,19+T,8,4,o.b);R(c-4,22+T,8,1,o.bD)}else{R(c-3,19+T,6,3,o.b)}
    if(o.bag){R(c-7,12+T,4,8,o.bag);R(c-7,12+T,1,8,'rgba(255,255,255,.35)')}
    R(c-3,12+T,6,8,o.top);R(c-3,12+T,2,8,'rgba(0,0,0,.18)');R(c+2,12+T,1,8,'rgba(255,255,255,.35)');
    const sw=[1,0,-1,0][f%4];R(c-1+sw,13+T,2,4,o.top);R(c-1+sw,17+T,2,2,'#f2c7a0');
    R(c-1,11+T,2,1,'#d09a74');const hy=1+T;R(c-4,hy+1,9,9,'#f2c7a0');R(c-3,hy,7,1,'#f2c7a0');R(c+5,hy+5,1,2,'#f2c7a0');
    R(c+2,hy+4,1,2,'#2a1c14');P(c+3,hy+7,'#f39a9a');
    R(c-4,hy-1,8,3,o.h);R(c-5,hy+1,4,7,o.h);R(c-3,hy-2,6,1,o.h);R(c+3,hy,2,3,o.h);R(c,hy+2,4,1,o.h);
    if(o.long){R(c-5,hy+1,3,14,o.h)}
  });
}
function sitter(o,blink,page){
  return outlined(22,32,()=>{const c=9;
    if(o.long)R(c-5,2,3,13,o.h);
    R(c+4,26,5,2,o.shoe);R(c+4,27,6,1,'#e8e0d4');
    R(c+4,20,3,7,o.b);R(c+4,20,1,7,'rgba(255,255,255,.25)');
    R(c-3,18,10,3,o.b);R(c-3,18,10,1,'rgba(255,255,255,.3)');
    R(c-3,11,6,8,o.top);R(c-3,11,2,8,'rgba(0,0,0,.18)');R(c+2,11,1,8,'rgba(255,255,255,.35)');
    R(c+2,14,6,4,o.book);R(c+2,13,6,1,'#f4f1ea');R(c+2+(page?3:2),13,1,1,'#c8c0b4');R(c+5,14,1,4,'rgba(0,0,0,.3)');
    R(c,13,2,4,o.top);R(c+1,16,2,2,'#f2c7a0');
    R(c-1,10,2,1,'#d09a74');const hy=1;
    R(c-4,hy+1,9,9,'#f2c7a0');R(c-3,hy,7,1,'#f2c7a0');R(c+5,hy+5,1,2,'#f2c7a0');
    if(blink)R(c+2,hy+6,2,1,'#2a1c14');else{R(c+2,hy+5,1,2,'#2a1c14');P(c+3,hy+5,'#2a1c14')}
    P(c+3,hy+8,'#f39a9a');P(c+4,hy+8,'#f7b0a8');
    R(c-4,hy-1,8,3,o.h);R(c-5,hy+1,4,7,o.h);R(c-3,hy-2,6,1,o.h);R(c+3,hy,2,3,o.h);R(c,hy+2,4,1,o.h);R(c-2,hy-1,4,1,'rgba(255,255,255,.18)');
    if(o.clip)R(c-1,hy-1,2,2,o.clip);
  });
}
const SIT={h:'#2a1a12',top:'#7ec0a8',b:'#3a4a70',shoe:'#f2ece4',book:'#d65a5a',long:1,clip:'#ff86b3'};
const SITF=[sitter(SIT,false,0),sitter(SIT,false,1),sitter(SIT,true,0)];
const WALKERS=[{h:'#2a1a12',top:'#f4f1ea',b:'#3a4a70',bD:'#2a3656',skirt:1,long:1,bag:'#e8c27a'},{h:'#1e1612',top:'#e06a5a',b:'#3b4560',bD:'#2a3248',bag:'#3a7fd0'},{h:'#241812',top:'#7ec0a8',b:'#c9b48a',bD:'#a8946a',bag:'#4a8a56'}];
const WCACHE={};function walker(i,f){const k=i+'-'+f;return WCACHE[k]||(WCACHE[k]=student(WALKERS[i],f))}

const OUT={
  week:{n:'Ngày thường',sh:'#4f7fd0',shD:'#3a5ea8',shL:'#86afee',col:'#f4f1ea',straps:1,when:'Thứ Hai đến thứ Sáu'},
  weekend:{n:'Cuối tuần',sh:'#ff7a59',shD:'#d85a3e',shL:'#ffa088',col:'#ffd0c0',straps:0,when:'Thứ Bảy, Chủ Nhật'},
  store:{n:'Đồng phục cửa hàng',sh:'#3f9a5a',shD:'#2f7a46',shL:'#6aca8a',col:'#e8f4ea',straps:0,tag:1,when:'Khi ở cửa hàng, sau khi được nhận việc'},
};
const SKIN={norm:['#f2c7a0','#d09a74','#ffdcbc'],pale:['#c8d29a','#a8b27a','#dce4b4']};
function hero(gender,outfit,mood,opt={}){
  const O=OUT[outfit],sk=SKIN[mood==='sick'?'pale':'norm'],skirt=gender==='nu'&&!(outfit==='store'&&opt.pants);
  const h='#3b2418',hD='#24150e',hL='#6e4630',hR='#9a6440',pa='#33405e',paD='#252f48',paL='#4b5a80',eye='#241a2a',mo='#9a4636';
  return outlined(30,54,()=>{const c=15,b=opt.b||0;
    if(gender==='nu')R(c-9,6+b,18,24,hD);
    if(skirt){R(c-5,44,4,4,sk[0]);R(c+1,44,4,4,sk[1]);R(c-5,46,4,2,'#f4f1ea');R(c+1,46,4,2,'#d8d2c8')}
    else{R(c-6,38,12,5,pa);R(c-6,43,5,5,pa);R(c+1,43,5,5,pa);R(c-6,38,1,10,paL);R(c+5,38,1,10,paD);R(c-2,43,1,5,paD)}
    R(c-6,48,5,4,'#5a3a2a');R(c+1,48,5,4,'#5a3a2a');R(c-6,48,5,1,'#80583e');R(c+1,48,5,1,'#80583e');
    R(c-7,24+b,14,15-b,O.sh);R(c-7,24+b,2,15-b,O.shL);R(c+5,24+b,2,15-b,O.shD);R(c-7,38,14,1,O.shD);
    R(c-2,24+b,4,2,O.col);P(c-3,24+b,O.col);P(c+2,24+b,O.col);R(c-1,26+b,2,1,sk[1]);
    if(skirt){for(let y=36;y<45;y++){const half=7+Math.floor((y-36)/3);for(let x=c-half;x<c+half;x++){const pl=((x-c+20)%3===0);R(x,y,1,1,x<c-half+2?paL:x>=c+half-2?paD:pl?paD:pa)}}R(c-7,36,14,1,'#252f48');R(c-9,44,18,1,paD)}
    if(O.straps){R(c-5,24+b,2,13-b,'#e6aa2c');R(c+3,24+b,2,13-b,'#e6aa2c');R(c-5,24+b,1,13-b,'#ffd468');R(c+4,24+b,1,13-b,'#b47c1c')}
    if(O.tag){R(c+2,28+b,4,2,'#f4f1ea');R(c+2,30+b,4,1,'#d8d2c8')}
    if(outfit==='weekend'){R(c-2,29+b,4,4,'#ffc94d');P(c-1,30+b,'#ffffff')}
    R(c-11,25+b,3,5,O.sh);R(c-11,25+b,1,5,O.shL);R(c-11,30+b,3,6,sk[0]);R(c-11,35+b,3,2,sk[1]);
    R(c+8,25+b,3,5,O.shD);R(c+8,30+b,3,6,sk[1]);R(c+8,35+b,3,2,sk[1]);R(c-8,25+b,1,3,O.sh);R(c+7,25+b,1,3,O.shD);
    if(mood==='hungry'){R(c-4,33+b,8,3,O.shD);R(c-11,31+b,3,3,O.sh);R(c-8,32+b,3,3,sk[0])}
    R(c-2,21+b,4,3,sk[1]);
    const y=3+b;
    R(c-7,y+6,14,13,sk[0]);R(c-6,y+19,12,1,sk[0]);R(c-8,y+8,1,9,sk[0]);R(c+7,y+8,1,9,sk[0]);R(c-7,y+8,2,10,sk[2]);R(c+5,y+7,2,12,sk[1]);
    R(c-9,y+10,2,4,sk[0]);R(c+7,y+10,2,4,sk[1]);
    // mắt
    if(mood==='happy'){[c-5,c+2].forEach(x=>{P(x,y+13,eye);R(x+1,y+12,1,1,eye);P(x+2,y+13,eye)})}
    else if(mood==='tired'){[c-5,c+2].forEach(x=>{R(x,y+12,3,1,sk[1]);R(x,y+13,3,1,eye);R(x,y+14,3,1,'#9a8aa8')})}
    else if(mood==='sick'){[c-5,c+2].forEach(x=>{R(x,y+12,3,2,eye);P(x,y+12,'#ffffff');R(x,y+14,3,1,'#9aa070')})}
    else{[c-5,c+2].forEach(x=>{R(x,y+11,3,3,eye);P(x,y+11,'#ffffff');P(x+2,y+13,'#6a7ab0')});if(gender==='nu'){P(c-6,y+11,eye);P(c+5,y+11,eye)}}
    // lông mày
    if(mood==='sad'||mood==='sick'){P(c-5,y+9,hD);P(c-4,y+9,hD);P(c-3,y+8,hD);P(c+2,y+8,hD);P(c+3,y+9,hD);P(c+4,y+9,hD)}
    else{R(c-6,y+9,3,1,hD);R(c+2,y+9,3,1,hD)}
    // má, miệng
    if(mood==='happy'||mood==='normal'){R(c-6,y+15,2,1,'#f39a9a');R(c+4,y+15,2,1,'#f39a9a')}
    if(mood==='sick'){R(c-6,y+15,2,1,'#e87a7a');R(c+4,y+15,2,1,'#e87a7a')}
    if(mood==='happy'){R(c-2,y+16,4,1,mo);R(c-1,y+17,2,1,'#c85a4a');P(c-3,y+15,mo);P(c+2,y+15,mo)}
    else if(mood==='sad'){R(c-1,y+16,3,1,mo);P(c-2,y+17,mo);P(c+2,y+17,mo)}
    else if(mood==='tired'||mood==='sick'){R(c-1,y+16,3,1,mo)}
    else if(mood==='hungry'){R(c-1,y+16,2,2,mo)}
    else{R(c-1,y+16,3,1,mo);P(c-2,y+15,mo);P(c+2,y+15,mo)}
    if(mood==='tired'){R(c+6,y+6,1,2,'#9ad6ff');P(c+6,y+5,'#9ad6ff')}
    // tóc
    R(c-8,y+1,16,6,h);R(c-7,y,14,1,h);R(c-5,y-1,10,1,h);R(c-9,y+3,2,8,h);R(c+7,y+3,2,8,h);
    if(gender==='nu'){R(c-10,y+6,3,22,h);R(c+7,y+6,3,22,h);R(c-10,y+6,1,21,hR);R(c+9,y+8,1,20,hD);R(c-7,y+7,10,2,h);R(c-7,y+9,5,1,h);R(c+3,y+7,4,3,h);R(c+2,y+3,4,2,'#ffc94d');R(c+2,y+3,4,1,'#fff0a0')}
    else{[[-7,2],[-4,3],[-1,2],[2,3],[5,2]].forEach(([dx,hh])=>R(c+dx,y+7,3,hh,h));R(c+1,y-3,2,2,h);P(c+3,y-3,hD);P(c,y-2,h)}
    R(c+3,y+1,5,5,hD);R(c-8,y+2,1,6,hR);R(c-6,y,4,1,hL);R(c-7,y+1,3,2,hL);R(c-1,y+1,3,1,hL);
  });
}
// bong bóng trạng thái phía trên đầu, giống game hiện tại nhưng có viền
function bubble(icon){return outlined(20,18,()=>{
  R(2,1,16,12,'#ffffff');R(1,2,18,10,'#ffffff');R(4,13,3,2,'#ffffff');R(3,15,1,1,'#ffffff');const bx=2,by=1;
  if(icon==='hungry'){R(bx+3,by+6,10,2,'#e9e2d0');R(bx+4,by+8,8,2,'#c0392b');R(bx+6,by+2,1,3,'#9aa0b0');R(bx+9,by+2,1,3,'#9aa0b0')}
  if(icon==='tired'){R(bx+3,by+3,6,1,'#3a78c2');P(bx+7,by+4,'#3a78c2');P(bx+6,by+5,'#3a78c2');P(bx+5,by+6,'#3a78c2');P(bx+4,by+7,'#3a78c2');R(bx+3,by+8,6,1,'#3a78c2');R(bx+10,by+2,3,1,'#3a78c2');P(bx+11,by+3,'#3a78c2');R(bx+10,by+4,3,1,'#3a78c2')}
  if(icon==='sad'){R(bx+3,by+2,10,4,'#8a90a8');R(bx+5,by+1,6,1,'#8a90a8');R(bx+4,by+7,1,2,'#5cc8ff');R(bx+8,by+8,1,2,'#5cc8ff');R(bx+11,by+7,1,2,'#5cc8ff')}
  if(icon==='sick'){R(bx+7,by+1,3,9,'#e23d4f');R(bx+4,by+4,9,3,'#e23d4f')}
})}
const CACHE={};
function sprite(gender,outfit,mood,opt={}){const k=[gender,outfit,mood,opt.pants?1:0,opt.b||0].join('-');return CACHE[k]||(CACHE[k]=hero(gender,outfit,mood,opt))}
const BUB={};['hungry','tired','sad','sick'].forEach(k=>BUB[k]=bubble(k));

/* Cảnh có thể bổ sung chi tiết cho hàm vẽ người (bảng tên, nón lá, tạp dề...): decorate(fn(base,o,blink,b) → canvas).
 * Phải đăng ký trước lần vẽ đầu tiên vì spr() lưu đệm. */
const DECOR=[],basePerson=person;
person=function(o,blink,b){let im=basePerson(o,blink,b);for(const d of DECOR)im=d(im,o,blink,b);return im};
function decorate(fn){DECOR.push(fn)}
/* Nhân vật chính trong cảnh: game truyền o.hero(ctx,cx,feet,t) để vẽ theo trang phục và biểu cảm hiện tại */
function heroAt(ctx,o,cx,feet,t,anim,flip){if(o.hero)o.hero(ctx,cx,feet,t);else drawPerson(ctx,o.gender==='nu'?'nu':'nam',cx,feet,t,anim,flip)}

return {decorate,heroAt,K,person,LOOK,spr,drawPerson,backBust,student,sitter,SIT,SITF,WALKERS,walker,OUT,SKIN,hero,sprite,BUB};
})();
