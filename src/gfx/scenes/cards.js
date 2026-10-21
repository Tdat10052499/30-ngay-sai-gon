/* 30 Ngày Sài Gòn · tranh nhỏ 64×48 trên thẻ chương (design/12 thẻ 2): vali và chìa khóa, trường và cửa hàng với đồng hồ, phong bì lương, đề kiểm tra và hộp quà */
(()=>{
function vignette(c,n){const g=c.getContext('2d');g.imageSmoothingEnabled=false;const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  const sky=[['#bcdcf2','#86bbe8'],['#f2c8b0','#e89a7a'],['#c8e8d0','#86bc6a'],['#f8dce2','#c97aa8']][n-1];for(let y=0;y<48;y++)R(0,y,64,1,y<30?sky[0]:sky[1]);
  if(n===1){R(0,36,64,12,'#c9b896');R(36,8,18,32,'#a8744a');R(38,10,14,12,'#94643e');R(38,24,14,14,'#94643e');R(50,24,2,2,'#e6c46a');
    R(8,24,20,14,'#c8463c');R(8,24,20,2,'#e86a5a');R(14,21,8,3,'#2c2a40');R(8,30,20,1,'#a8302a');R(24,36,6,3,'#ffc94d');R(29,37,6,1,'#ffc94d');R(33,36,2,3,'#ffc94d')}
  if(n===2){R(0,36,64,12,'#b8a890');R(6,10,24,26,'#efe2d4');for(let x=8;x<30;x+=5)R(x,10,1,26,'#f07a2e');R(34,16,24,20,'#f4f6f6');R(34,16,24,4,'#3f9a5a');R(38,24,8,8,'#bfe0f0');
    for(let k=0;k<12;k++){const a=k/12*Math.PI*2;R(Math.round(32+Math.cos(a)*7),Math.round(8+Math.sin(a)*7),1,1,'#1d2136')}R(32,4,1,4,'#d6453a');R(32,8,4,1,'#1d2136')}
  if(n===3){R(0,36,64,12,'#86bc6a');R(12,16,40,24,'#f4ecda');R(12,16,40,2,'#ffffff');for(let k=0;k<20;k++)R(12+k,16+Math.round(k*.5),1,1,'#d8c8a8');for(let k=0;k<20;k++)R(51-k,16+Math.round(k*.5),1,1,'#d8c8a8');
    R(26,24,12,6,'#3f9a5a');R(28,25,8,4,'#72de90');R(18,34,6,4,'#ffc94d');R(42,32,6,4,'#ffc94d');R(44,30,4,2,'#fff0a0');R(30,4,4,8,'#ffc94d');R(29,6,6,2,'#ffc94d')}
  if(n===4){R(0,36,64,12,'#c8a888');R(6,14,22,22,'#f4f1ea');R(6,14,22,3,'#d6453a');for(let y=20;y<34;y+=4)R(9,y,16,1,'#9a9aa8');R(18,26,8,6,'#d6453a');R(20,28,4,2,'#f4f1ea');
    R(36,20,22,18,'#ff86b3');R(36,20,22,2,'#ffb0cc');R(45,20,4,18,'#ffc94d');R(36,27,22,3,'#ffc94d');R(42,14,4,6,'#ffc94d');R(48,14,4,6,'#ffc94d');R(46,18,2,2,'#e6aa2c')}}
Scenes.vignette=vignette;
})();
