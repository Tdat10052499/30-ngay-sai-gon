/* 30 Ngày Sài Gòn · đồ họa: tờ tiền Việt Nam pixel 12×24 (dựng đứng) cho minigame Thối tiền.
 * Chỉ lấy màu chủ đạo của tờ tiền thật và vài mảng trang trí đơn giản, không chép hình in trên tờ tiền.
 * Tờ từ 10.000đ trở lên là tiền polymer nên có ô cửa sổ trong suốt. */
const Money=(()=>{
const {mk,R,P}=GFX;
/* [màu nền, màu đậm, màu sáng] */
const NOTE={
  1000:['#c8bc6a','#8a7e3a','#e8e0a0'],
  2000:['#b49478','#7a5a44','#dcc4ac'],
  5000:['#7a9ac8','#46628e','#b4c8e8'],
  10000:['#d8b45a','#9a7426','#f2dc96'],
  20000:['#6a8ed8','#3a5aa8','#a8c0f0'],
  50000:['#d27aa8','#9a4674','#f0b4d2'],
  100000:['#6ab07a','#3a7a4a','#a8dcb4'],
  200000:['#d4785a','#9a4630','#f0ac94'],
};
const VALUES=Object.keys(NOTE).map(Number);
function draw(v){
  const [b,d,l]=NOTE[v],poly=v>=10000;
  R(0,0,12,24,d);R(1,1,10,22,b);
  R(1,1,10,1,l);R(1,1,1,22,l);                         // viền sáng
  R(2,3,8,1,d);R(2,20,8,1,d);                          // hai vạch ngang
  for(let y=5;y<19;y+=2)P(y%4?3:8,y,l);                 // hoa văn chấm
  R(4,7,4,7,d);R(5,8,2,5,l);                           // khung chân dung (không vẽ mặt)
  if(poly){R(7,15,3,4,'#e8f4f8');R(7,15,3,1,'#ffffff');P(9,18,'#b8d0dc')}  // cửa sổ polymer
  else{R(2,15,3,3,l);P(3,16,d)}                       // dấu hình tròn trên tiền giấy
  /* vạch nhỏ theo mệnh giá để phân biệt khi cùng màu gần nhau */
  const n=VALUES.indexOf(v)%4+1;for(let k=0;k<n;k++)P(2+k*2,21,l);
}
const URLS={};
function url(v){if(URLS[v])return URLS[v];const c=mk(12,24),keep=GFX.ctx();GFX.use(c.getContext('2d'));draw(v);GFX.use(keep);return URLS[v]=c.toDataURL()}
return {NOTE,VALUES,url};
})();
