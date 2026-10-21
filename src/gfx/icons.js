/* 30 Ngày Sài Gòn · đồ họa: biểu tượng 12×12.
 * - HUD: lưới ký tự từ design/04-phong-tro-giao-dien.html (giống design/12)
 * - 9 vật phẩm: vẽ bằng R/P rồi viền tối, từ design/11-tui-do-lich-nhiem-vu.html */
const Icons=(()=>{
const {W,H,BAYER,rng,mk,R,P,shade,dith,outlined}=GFX;
const ICONS={
 eat:{p:{w:'#f4f1ea',k:'#8a5a36',r:'#e85a3a',b:'#4f7fd0',B:'#86afee',d:'#2e4c88'},g:[
  "........k...","......k.k...","...wwwkwk...","..wwwwkwkw..",".rrrrrrrrrr.",".BBBBBBBBBB.","..bbbbbbbb..","..bbbbbbbb..","...bbbbbb...","....dddd....","...dddddd...","............"]},
 act:{p:{y:'#ffc94d',Y:'#fff0a0',o:'#c8901e'},g:[
  ".....yy.....",".....yy.....","....yYYy....","yyyyyYYyyyyy",".yyyYYYYyyy.","..yyyyyyyy..","...yyyyyy...","...yyyyyy...","..yyyoooyy..","..yyo..oyy..",".yo......oy.","............"]},
 money:{p:{d:'#2c3550',s:'#86bbe8',S:'#cfe8fa',y:'#ffc94d',o:'#c8901e'},g:[
  "...dddddd...","..dsSSSSsd..","..dsSssssd..","..dssyyssd..","..dsyoyysd..","..dsyyoysd..","..dssyyssd..","..dssssssd..","..dsssssd...","..dddddddd..","..dd.yy.dd..","...dddddd..."]},
 bag:{p:{y:'#e6aa2c',Y:'#ffd468',o:'#b47c1c',k:'#7a5216'},g:[
  "....kkkk....","...k....k...","..yyyyyyyy..",".yYYyyyyyyo.",".yYyyyyyyyo.",".yyyyyyyyyo.",".ykkkkkkkko.",".yoooooooko.",".yoooYooooo.",".yoooooooko.",".yyyyyyyyyo.","..oooooooo.."]},
 cal:{p:{r:'#d6453a',R:'#f07a6a',w:'#f4f1ea',g:'#c8c0b4',k:'#2c3550'},g:[
  "..k......k..",".rkrrrrrrkr.",".rRRRRRRRRr.",".rrrrrrrrrr.",".wwwwwwwwww.",".wkwkwkwkww.",".wwwwwwwwww.",".wkwkwrrkww.",".wwwwwrrwww.",".wkwkwkwkww.",".wwwwwwwwww.",".gggggggggg."]},
 quest:{p:{p:'#f4ecda',P:'#ddd2bc',k:'#8a5a36',i:'#6a6470',r:'#d6453a'},g:[
  "..kkkkkkkk..",".kppppppppk.","..pPPPPPPp..","..piiiiip...","..pppppppp..","..piiiiiip..","..pppppppp..","..piiip.rp..","..ppppprrr..","..pPPPPPrp..",".kppppppppk.","..kkkkkkkk.."]},
 map:{p:{a:'#72de90',A:'#4f9a5a',b:'#86bbe8',B:'#5a8ad0',r:'#d6453a',k:'#2c3550'},g:[
  "............","kaakbbkaak..","kaAkbBkaAkk.","kaakrbkaakk.","kAarrrkAakk.","kaakrbkaakk.","kaakbbkAakk.","kAakbBkaakk.","kaakbbkaakk.","kaakbBkAakk.",".kkkkkkkkkk.","............"]},
 menu:{p:{w:'#efe9db',s:'#a4a9c8'},g:[
  "............","............","..wwwwwwww..","..ssssssss..","............","..wwwwwwww..","..ssssssss..","............","..wwwwwwww..","..ssssssss..","............","............"]},
 coin:{p:{y:'#ffc94d',Y:'#fff0a0',o:'#c8901e',k:'#8a5a12'},g:[
  "....oooo....","..ooyyyyoo..",".oyYYyyyyyo.",".oYyykkyyyo.","oyYykyyyyyyo","oyyykyyyyyyo","oyyykyyyyyyo","oyyyykkyyyyo",".oyyyyyykyo.",".oyyyykkyyo.","..ooyyyyoo..","....oooo...."]},
 pin:{p:{r:'#ff7a59',R:'#ffb09a',k:'#a83e2a',w:'#f4f1ea'},g:[
  "....rrrr....","...rRRrrr...","..rRrrrrrk..","..rrrwwrrk..","..rrrwwrrk..","..rrrrrrrk..","...rrrrrk...","...rrrrrk...","....rrrk....","....rrk.....",".....k......","............"]},
 nl:{p:{b:'#5cc8ff',B:'#c8eeff',d:'#2a8ac0'},g:[
  "......bbb...",".....bbbd...","....bBbd....","...bBbd.....","..bbbbbbb...","..bbbbbbd...","....bbbd....","...bbbd.....","..bbbd......","..bbd.......","..bd........","............"]},
 tt:{p:{p:'#ff86b3',P:'#ffd0e2',d:'#c8507e'},g:[
  "............","..ppp..ppp..",".pPPpppppppd",".pPpppppppd.",".ppppppppp d".replace(' ','p'),".ppppppppppd","..pppppppdd.","...pppppdd..","....pppdd...",".....pdd....","......d.....","............"]},
 sk:{p:{g:'#72de90',G:'#c8f4d4',d:'#3a9a5a'},g:[
  "............","....gggg....","....gGGg....","....gGgd....",".ggggGgggg..",".gGGGGgggd..",".ggggggggd..","..dddggddd..","....gggd....","....gggd....","....dddd....","............"]},
 no:{p:{o:'#f5a742',O:'#ffd08a',d:'#b8701e',w:'#f4f1ea'},g:[
  "............","...w.w.w....","....w.w.w...","............",".oooooooooo.",".oOOOOOOOOo.","..oooooooo..","..oooooood..","...ooooodd..","....dddd....","...dddddd...","............"]},
 dawn:{p:{y:'#ffc94d',o:'#ff9a50',k:'#a4a9c8'},g:[
  "............","............","......y.....","..y...y...y.","...y.....y..","....oooo....","...oyyyyo...","y.oyyyyyyo.y","..oyyyyyyo..","kkkkkkkkkkkk","............","............"]},
 noon:{p:{y:'#ffc94d',Y:'#fff0a0'},g:[
  ".....y......","..y..y..y...","...y...y....","....yyy.....",".y.yYYyy.y..","yy.yYyyy.yy.",".y.yyyyy.y..","....yyy.....","...y...y....","..y..y..y...",".....y......","............"]},
 dusk:{p:{o:'#ff7a59',y:'#ffb057',k:'#a4a9c8'},g:[
  "............","............","............","....oooo....","...oyyyyo...","..oyyyyyyo..","..oyyyyyyo..","kkkkkkkkkkkk","..k.k..k.k..","............","............","............"]},
 night:{p:{m:'#e9ebff',d:'#a4a9c8',s:'#ffc94d'},g:[
  "............","....mmm.....","...mmd....s.","..mmd.......","..mmd...s...","..mmd.......","..mmmd......","...mmmmd....","....mmmd..s.","............","............","............"]},
 warn:{p:{y:'#ffb057',k:'#1d1a10'},g:[
  ".....yy.....","....yyyy....","....ykky....","...yykkyy...","...yykkyy...","..yyykkyyy..","..yyykkyyy..",".yyyyyyyyyy.",".yyyykkyyyy.","yyyyykkyyyyy","yyyyyyyyyyyy","............"]},
};
const ICON={
  banhmi:()=>{R(1,4,10,4,'#e8a85a');R(2,3,8,1,'#e8a85a');R(2,8,8,1,'#c8843a');R(1,7,10,1,'#c8843a');P(3,4,'#fff0c8');P(6,4,'#fff0c8');P(9,4,'#fff0c8');R(2,6,8,1,'#3f9a5a');P(4,6,'#d65a3a');P(7,6,'#d65a3a')},
  xoi:()=>{R(1,7,10,3,'#4f9a5a');R(2,10,8,1,'#3f7a4a');R(1,7,10,1,'#72c07a');R(2,4,8,3,'#f8f4e8');R(3,3,6,1,'#f8f4e8');P(4,4,'#e8a050');R(6,5,2,1,'#e8a050');P(8,4,'#e8a050');P(5,3,'#72de90');P(3,5,'#ffffff')},
  mi:()=>{R(1,2,10,8,'#e85a3a');R(1,2,10,1,'#ff8a6a');R(3,4,6,4,'#ffd84a');for(let x=3;x<9;x+=2){P(x,5,'#e8a030');P(x+1,6,'#e8a030')}R(1,9,10,1,'#b8402a');P(2,3,'#ffd84a')},
  nguyenlieu:()=>{R(1,6,10,4,'#c9a878');for(let x=2;x<11;x+=2)R(x,7,1,3,'#a88a5e');R(2,10,8,1,'#a88a5e');R(2,3,3,3,'#3f9a5a');P(3,2,'#72de90');R(6,4,3,2,'#e85a3a');P(7,3,'#3f9a5a');R(9,3,2,3,'#f4e8d4');R(5,4,1,2,'#ff9a3a')},
  traicay:()=>{R(1,4,6,5,'#ffc94d');R(2,3,4,1,'#ffc94d');R(2,9,4,1,'#ffc94d');P(2,4,'#fff0a0');R(5,5,1,3,'#e8a030');R(6,5,5,5,'#a8d84a');R(7,4,3,1,'#a8d84a');R(7,10,3,1,'#8ab83a');P(7,6,'#e85a8a');P(9,7,'#e85a8a');P(8,3,'#3f9a5a')},
  banhngot:()=>{R(2,5,8,5,'#f8e8c8');R(2,5,8,2,'#ff86b3');R(2,8,8,1,'#ff86b3');R(2,10,8,1,'#e8c8a0');R(5,2,3,3,'#e8303a');P(6,1,'#3f9a5a');P(5,2,'#ff7a7a');P(3,6,'#ffffff')},
  caphe:()=>{R(3,1,6,10,'#8a5a36');R(3,1,6,1,'#c8c8d0');R(3,10,6,1,'#c8c8d0');R(3,4,6,3,'#f4e8d4');P(5,5,'#5a3a20');P(6,5,'#5a3a20');R(4,2,1,8,'#a87850');R(8,2,1,8,'#6a4428')},
  sua:()=>{R(3,4,6,7,'#f4f1ea');R(4,2,4,2,'#f4f1ea');R(3,6,6,2,'#4f7fd0');P(4,9,'#2c3550');P(7,10,'#2c3550');R(8,1,1,3,'#ff86b3');R(8,4,1,7,'#d8d2c8')},
  thuoc:()=>{R(1,3,10,7,'#f4f1ea');R(1,3,10,1,'#ffffff');R(5,4,2,5,'#3fd09a');R(3,5,6,2,'#3fd09a');R(1,9,10,1,'#c8d8e0');R(10,4,1,5,'#d8e0e6')},
};

const URLS={};
function url(name){
  if(URLS[name])return URLS[name];const c=mk(12,12);
  if(ICON[name])return URLS[name]=outlined(12,12,ICON[name]).toDataURL();
  const ic=ICONS[name];if(!ic)return '';const x=c.getContext('2d');
  ic.g.forEach((row,j)=>{for(let i=0;i<12;i++){const ch=row[i];if(!ch||ch==='.'||ch===' ')continue;const col=ic.p[ch];if(col){x.fillStyle=col;x.fillRect(i,j,1,1)}}});
  return URLS[name]=c.toDataURL();
}
const has=name=>!!(ICONS[name]||ICON[name]);
return {ICONS,ICON,url,has};
})();
