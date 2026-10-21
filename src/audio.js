/* ===== 30 Ngày Sài Gòn · Âm thanh: nhạc nền theo cảnh và hiệu ứng, tạo bằng Web Audio (không cần file nhạc) =====
   Mọi giai điệu là sáng tác mới cho game. Âm sắc chọn loại mềm (sóng sin, sóng tam giác), có lọc cắt tần cao,
   nén và giới hạn mức âm lượng ở đầu ra để không bị chói tai. */
(function(){
const NOTE={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
const m=s=>{const r=/^([A-G][#b]?)(-?\d)$/.exec(s);return 12*(+r[2]+1)+NOTE[r[1]]};
const hz=n=>440*Math.pow(2,(n-69)/12);
const ch=(...a)=>a.map(m);

/* ---------- Bản nhạc: dữ liệu ---------- */
// Mỗi bài: bpm, số ô (16 nốt móc kép mỗi ô nhịp), hợp âm từng ô nhịp, các bè. Giai điệu: [ô nhịp, bước, nốt, độ dài theo bước, lực]
const TRACKS={
  title:{n:'Hoàng hôn Sài Gòn',mood:'Hoài niệm, ấm áp',use:'Trang bìa, tạo nhân vật',bpm:76,bars:8,
    prog:[ch('C3','E3','G3'),ch('A2','C3','E3'),ch('F2','A2','C3'),ch('G2','B2','D3'),ch('C3','E3','G3'),ch('E2','G2','B2'),ch('F2','A2','C3'),ch('G2','C3','D3')],
    parts:{arp:{inst:'keys',oct:12,pat:[0,1,2,1,0,1,2,1],every:2,vel:.22},pad:{inst:'pad',vel:.12},bass:{inst:'bass',steps:[0,8],vel:.42}},
    mel:{inst:'keys',vel:.42,notes:[[0,0,'E5',6],[0,6,'D5',2],[0,8,'C5',4],[0,12,'A4',4],[1,0,'C5',4],[1,4,'D5',4],[1,8,'E5',8],[2,0,'G5',6],[2,6,'E5',2],[2,8,'D5',4],[2,12,'C5',4],[3,0,'D5',10],[3,12,'A4',4],
      [4,0,'E5',6],[4,6,'G5',2],[4,8,'A5',4],[4,12,'G5',4],[5,0,'E5',4],[5,4,'D5',4],[5,8,'E5',8],[6,0,'C5',4],[6,4,'D5',4],[6,8,'E5',4],[6,12,'G5',4],[7,0,'D5',12]]},
    drums:null},
  home:{n:'Phòng trọ chiều muộn',mood:'Thư thả, ấm cúng',use:'Phòng trọ',bpm:72,bars:4,
    prog:[ch('F2','A2','C3','E3'),ch('E2','G2','B2','D3'),ch('D2','F2','A2','C3'),ch('C2','E2','G2','D3')],
    parts:{comp:{inst:'rhodes',oct:12,steps:[0,6],vel:.24},bass:{inst:'bass',steps:[0,10],vel:.4}},
    mel:{inst:'rhodes',vel:.3,notes:[[0,4,'A5',2],[0,6,'G5',2],[0,8,'E5',6],[1,8,'D5',2],[1,10,'E5',2],[1,12,'G5',4],[2,4,'F5',2],[2,6,'E5',2],[2,8,'C5',6],[3,8,'D5',8]]},
    drums:{kick:[0,10],rim:[4,12],shaker:[2,6,10,14]}},
  school:{n:'Sân trường buổi sáng',mood:'Tươi sáng, rộn ràng nhẹ',use:'Trường đại học',bpm:96,bars:4,
    prog:[ch('G2','B2','D3'),ch('F#2','A2','D3'),ch('E2','G2','B2'),ch('C2','E2','G2')],
    parts:{arp:{inst:'pluck',oct:24,pat:[0,1,2,1,0,2,1,2],every:2,vel:.15},bass:{inst:'bass',steps:[0,4,8,12],vel:.3}},
    mel:{inst:'flute',vel:.24,notes:[[0,0,'B5',4],[0,4,'D6',4],[0,8,'B5',8],[1,0,'A5',4],[1,4,'F#5',4],[1,8,'A5',8],[2,0,'G5',4],[2,4,'B5',4],[2,8,'E6',6],[2,14,'D6',2],[3,0,'C6',4],[3,4,'B5',4],[3,8,'G5',8]]},
    drums:{kick:[0,8],shaker:[2,6,10,14]}},
  store:{n:'Ca làm ở quầy',mood:'Đều đặn, tập trung',use:'Cửa hàng tiện lợi',bpm:100,bars:4,
    prog:[ch('A2','C3','E3','G3'),ch('D2','F#2','A2','C3'),ch('A2','C3','E3','G3'),ch('E2','G2','B2','D3')],
    parts:{arp:{inst:'pluck',oct:12,pat:[0,2,1,3,0,2,1,3],every:2,vel:.18},pad:{inst:'pad',vel:.1},bass:{inst:'bass',steps:[0,6,8],vel:.36}},
    mel:{inst:'bell',vel:.16,notes:[[0,12,'E5',2],[0,14,'A5',2],[2,12,'E5',2],[2,14,'G5',2]]},
    drums:{kick:[0,8],rim:[4,12],shaker:[2,10]}},
  street:{n:'Phố ăn uống',mood:'Nhộn nhịp, thân quen',use:'Quán ăn, chợ',bpm:104,bars:4,
    prog:[ch('D3','F#3','A3'),ch('B2','D3','F#3'),ch('G2','B2','D3'),ch('A2','C#3','E3')],
    parts:{comp:{inst:'pluck',oct:12,steps:[2,6,10,14],vel:.15},bass:{inst:'bass',steps:[0,8,11],vel:.36}},
    mel:{inst:'tranh',vel:.36,notes:[[0,0,'A5',3],[0,3,'F#5',1],[0,4,'E5',4],[0,8,'D5',4],[0,12,'E5',4],[1,0,'F#5',6],[1,6,'A5',2],[1,8,'B5',8],[2,0,'D6',3],[2,3,'B5',1],[2,4,'A5',4],[2,8,'F#5',4],[2,12,'A5',4],[3,0,'E5',12]]},
    drums:{kick:[0,8],shaker:[2,6,10,14],rim:[12]}},
  cafe:{n:'Cà phê phin',mood:'Lãng đãng, chậm rãi',use:'Quán cà phê',bpm:84,bars:4,swing:.3,
    prog:[ch('D3','F#3','A3','C#4'),ch('B2','D3','F#3','A3'),ch('E2','G2','B2','D3'),ch('A2','C#3','G3')],
    parts:{comp:{inst:'rhodes',oct:0,steps:[0,7,10],vel:.2},bass:{inst:'bass',walk:1,vel:.36}},
    mel:{inst:'rhodes',vel:.3,notes:[[0,2,'F#5',2],[0,4,'A5',4],[0,10,'C#6',6],[1,2,'B5',2],[1,4,'A5',2],[1,6,'F#5',6],[2,2,'G5',2],[2,4,'B5',4],[2,10,'D6',4],[3,0,'C#6',4],[3,4,'A5',8]]},
    drums:{brush:[0,4,8,12],rim:[4,12]}},
  park:{n:'Bờ kênh lộng gió',mood:'Thong thả, thoáng đãng',use:'Công viên',bpm:88,bars:4,
    prog:[ch('C3','E3','G3'),ch('B2','D3','G3'),ch('A2','C3','E3'),ch('F2','A2','C3')],
    parts:{arp:{inst:'pluck',oct:12,pat:[0,1,2,1],every:4,vel:.16},pad:{inst:'pad',vel:.11},bass:{inst:'bass',steps:[0,8],vel:.32}},
    mel:{inst:'flute',vel:.25,notes:[[0,0,'G5',6],[0,6,'A5',2],[0,8,'G5',4],[0,12,'E5',4],[1,0,'D5',8],[1,8,'G5',8],[2,0,'A5',6],[2,6,'C6',2],[2,8,'B5',4],[2,12,'A5',4],[3,0,'G5',12]]},
    drums:null,birds:1},
  mall:{n:'Trung tâm thương mại',mood:'Thanh lịch, nhịp bossa nhẹ',use:'Trung tâm thương mại',bpm:108,bars:4,
    prog:[ch('E3','G#3','B3','D#4'),ch('C#3','E3','G#3','B3'),ch('A2','C#3','E3','G#3'),ch('B2','D#3','F#3','A3')],
    parts:{comp:{inst:'keys',oct:0,steps:[0,3,6,10,12],vel:.16},pad:{inst:'pad',vel:.09},bass:{inst:'bass',steps:[0,6,8,14],vel:.34}},
    mel:{inst:'bell',vel:.2,notes:[[0,0,'B5',4],[0,6,'G#5',2],[0,8,'E5',8],[1,0,'C#6',4],[1,6,'B5',2],[1,8,'G#5',8],[2,0,'A5',4],[2,6,'C#6',2],[2,8,'E6',8],[3,0,'D#6',8],[3,8,'B5',8]]},
    drums:{shaker:[0,2,4,6,8,10,12,14],rim:[3,6,10,13]}},
  summary:{n:'Tháng đầu tiên',mood:'Lắng đọng, biết ơn',use:'Tổng kết cuối tháng',bpm:68,bars:8,
    prog:[ch('G2','B2','D3'),ch('B2','D3','F#3'),ch('C3','E3','G3'),ch('D3','G3','A3'),ch('E2','G2','B2'),ch('C3','E3','G3'),ch('D3','G3','B3'),ch('D3','F#3','A3')],
    parts:{arp:{inst:'keys',oct:12,pat:[0,1,2,1,2,1,0,1],every:2,vel:.2},pad:{inst:'pad',vel:.13},bass:{inst:'bass',steps:[0],vel:.4}},
    mel:{inst:'keys',vel:.4,notes:[[0,0,'D5',4],[0,4,'G5',4],[0,8,'B5',8],[1,0,'A5',4],[1,4,'F#5',4],[1,8,'D5',8],[2,0,'E5',4],[2,4,'G5',4],[2,8,'C6',6],[2,14,'B5',2],[3,0,'A5',12],
      [4,0,'B5',4],[4,4,'G5',4],[4,8,'E5',8],[5,0,'E5',4],[5,4,'G5',4],[5,8,'C6',8],[6,0,'B5',4],[6,4,'A5',4],[6,8,'G5',8],[7,0,'A5',8],[7,8,'F#5',8]]},
    drums:null},
};
// đoạn ngắn: bình minh ngày 1 (phát một lần)
const STINGS={dawn:{n:'Bình minh ngày 1',dur:7,ev:[[0,'pad',ch('C3','G3','E4'),6,.14],[0,'bell','C5',1.2,.18],[.5,'bell','E5',1.2,.18],[1,'bell','G5',1.2,.18],[1.5,'bell','C6',1.6,.18],[2.4,'pad',ch('F3','A3','C4'),4,.12],[2.4,'bell','A5',1.4,.16],[3.2,'bell','G5',2.4,.18],[4,'keys','E5',2.5,.2]]}};

/* ---------- Bộ máy âm thanh ---------- */
function Engine(ctx){
  const E={ctx,night:false};
  // chuỗi đầu ra: cắt bớt tần cao, nén, giới hạn
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=12;comp.ratio.value=3;comp.attack.value=.01;comp.release.value=.25;
  const lim=ctx.createDynamicsCompressor();lim.threshold.value=-4;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.002;lim.release.value=.1;
  const shelf=ctx.createBiquadFilter();shelf.type='highshelf';shelf.frequency.value=3500;shelf.gain.value=-6;
  const tone=ctx.createBiquadFilter();tone.type='lowpass';tone.frequency.value=6000;tone.Q.value=.5;
  E.music=ctx.createGain();E.music.gain.value=.6;E.sfx=ctx.createGain();E.sfx.gain.value=.8;E.master=ctx.createGain();E.master.gain.value=1;
  E.musicBus=ctx.createGain();E.drumBus=ctx.createGain();E.drumBus.gain.value=1;
  // hạ mức chung của nhạc để làm nền, chừa chỗ cho hiệu ứng và lời thoại
  const trim=ctx.createGain();trim.gain.value=.28;
  E.musicBus.connect(tone);E.drumBus.connect(tone);tone.connect(trim);trim.connect(E.music);E.music.connect(shelf);E.sfx.connect(shelf);shelf.connect(comp);comp.connect(lim);lim.connect(E.master);E.analyser=ctx.createAnalyser();E.analyser.fftSize=256;E.master.connect(E.analyser);E.master.connect(ctx.destination);
  // tiếng vang mềm
  const rev=ctx.createConvolver(),len=Math.floor(ctx.sampleRate*2.2),ir=ctx.createBuffer(2,len,ctx.sampleRate);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);let lp=0;for(let i=0;i<len;i++){lp=lp*.85+(Math.random()*2-1)*.15;d[i]=lp*Math.pow(1-i/len,3)}}
  rev.buffer=ir;E.revSend=ctx.createGain();E.revSend.gain.value=.28;E.revSend.connect(rev);rev.connect(tone);
  E.tone=tone;
  const out=(node,vel,send=1)=>{const g=ctx.createGain();g.gain.value=vel;node.connect(g);g.connect(E.musicBus);if(send){const s=ctx.createGain();s.gain.value=send;g.connect(s);s.connect(E.revSend)}return g};
  const env=(g,t,a,peak,d,s,dur,r)=>{const p=g.gain;p.setValueAtTime(0,t);p.linearRampToValueAtTime(peak,t+a);p.setTargetAtTime(peak*s,t+a,d);p.setTargetAtTime(0,t+Math.max(a,dur),r)};
  const osc=(type,f,t,stop)=>{const o=ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);o.start(t);o.stop(stop);return o};
  const lpf=(f,q=.7)=>{const b=ctx.createBiquadFilter();b.type='lowpass';b.frequency.value=f;b.Q.value=q;return b};
  // nhạc cụ, đều là âm mềm
  E.inst={
    keys(n,t,dur,vel,dest){const f=hz(n),g=ctx.createGain(),lp=lpf(2400);env(g,t,.008,1,.35,.25,dur,.35);
      const o1=osc('triangle',f,t,t+dur+2),o2=osc('sine',f*2,t,t+dur+2),g2=ctx.createGain();g2.gain.value=.18;o1.connect(lp);o2.connect(g2);g2.connect(lp);lp.connect(g);(dest?g.connect(dest):out(g,vel*.9,.9))},
    rhodes(n,t,dur,vel){const f=hz(n),g=ctx.createGain(),lp=lpf(1800);env(g,t,.006,1,.8,.35,dur,.5);
      const a=osc('sine',f,t,t+dur+3),b=osc('sine',f*1.003,t,t+dur+3),c=osc('sine',f*2,t,t+dur+3),cg=ctx.createGain();cg.gain.setValueAtTime(.25,t);cg.gain.setTargetAtTime(0,t,.15);
      const trem=osc('sine',4.6,t,t+dur+3),tg=ctx.createGain();tg.gain.value=.12;const mix=ctx.createGain();mix.gain.value=.5;trem.connect(tg);tg.connect(mix.gain);
      a.connect(mix);b.connect(mix);c.connect(cg);cg.connect(mix);mix.connect(lp);lp.connect(g);out(g,vel,1.1)},
    pluck(n,t,dur,vel){const f=hz(n),g=ctx.createGain(),lp=lpf(2600);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+.004);g.gain.setTargetAtTime(0,t+.004,.12);
      osc('triangle',f,t,t+1.2).connect(lp);lp.connect(g);out(g,vel,.8)},
    tranh(n,t,dur,vel){const f=hz(n),g=ctx.createGain(),lp=lpf(2800);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+.004);g.gain.setTargetAtTime(.0,t+.004,.28);
      const o=osc('triangle',f*1.018,t,t+2);o.frequency.setTargetAtTime(f,t+.02,.05);if(dur>.5){const vib=osc('sine',5.5,t+.25,t+2),vg=ctx.createGain();vg.gain.value=f*.006;vib.connect(vg);vg.connect(o.frequency)}
      const h=osc('sine',f*2,t,t+1),hg=ctx.createGain();hg.gain.setValueAtTime(.2,t);hg.gain.setTargetAtTime(0,t,.08);h.connect(hg);hg.connect(lp);o.connect(lp);lp.connect(g);out(g,vel,1)},
    flute(n,t,dur,vel){const f=hz(n),g=ctx.createGain(),lp=lpf(2200);env(g,t,.07,1,.4,.8,dur,.18);
      const o=osc('sine',f,t,t+dur+1),vib=osc('sine',5,t,t+dur+1),vg=ctx.createGain();vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(f*.004,t+.3);vib.connect(vg);vg.connect(o.frequency);
      const o2=osc('triangle',f,t,t+dur+1),g2=ctx.createGain();g2.gain.value=.25;o2.connect(g2);g2.connect(lp);o.connect(lp);lp.connect(g);out(g,vel,1.2)},
    pad(n,t,dur,vel){const f=hz(n),g=ctx.createGain(),lp=lpf(900);env(g,t,.6,1,1,.9,dur,1.2);
      [-.004,.004].forEach(dt=>osc('triangle',f*(1+dt),t,t+dur+4).connect(lp));lp.connect(g);out(g,vel*.7,1.3)},
    bass(n,t,dur,vel){const f=hz(n),g=ctx.createGain(),lp=lpf(420);env(g,t,.01,1,.35,.55,dur,.12);
      osc('sine',f,t,t+dur+1).connect(lp);const o2=osc('triangle',f,t,t+dur+1),g2=ctx.createGain();g2.gain.value=.35;o2.connect(g2);g2.connect(lp);lp.connect(g);out(g,vel,.15)},
    bell(n,t,dur,vel,dest){const f=hz(n),g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+.005);g.gain.setTargetAtTime(0,t+.005,Math.max(.25,dur*.45));
      const a=osc('sine',f,t,t+dur+3),b=osc('sine',f*2.76,t,t+1.5),bg=ctx.createGain();bg.gain.setValueAtTime(.12,t);bg.gain.setTargetAtTime(0,t,.2);a.connect(g);b.connect(bg);bg.connect(g);(dest?g.connect(dest):out(g,vel,1))},
  };
  // bộ gõ rất nhẹ
  const noise=(()=>{const b=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b})();
  const nz=(t,dur,ftype,f,q,vel)=>{const s=ctx.createBufferSource();s.buffer=noise;const b=ctx.createBiquadFilter();b.type=ftype;b.frequency.value=f;b.Q.value=q;const g=ctx.createGain();
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.003);g.gain.setTargetAtTime(0,t+.003,dur);s.connect(b);b.connect(g);g.connect(E.drumBus);s.start(t);s.stop(t+dur*6)};
  E.drum={
    kick(t){const o=osc('sine',110,t,t+.5),g=ctx.createGain();o.frequency.setTargetAtTime(48,t,.04);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.42,t+.004);g.gain.setTargetAtTime(0,t+.004,.09);const lp=lpf(300);o.connect(lp);lp.connect(g);g.connect(E.drumBus)},
    rim(t){nz(t,.035,'bandpass',1700,1.2,.09)},
    shaker(t){nz(t,.03,'bandpass',3200,.8,.035)},
    brush(t){nz(t,.09,'bandpass',2400,.6,.04)},
  };
  return E;
}

/* ---------- Bộ phát: xếp lịch trước 0,15 giây theo đồng hồ âm thanh ---------- */
function compile(T){
  const ev=[],sp=60/T.bpm/4,L=T.bars*16;
  T.prog.forEach((cd,bar)=>{
    const P=T.parts;
    if(P.pad)ev.push({s:bar*16,inst:'pad',n:cd,len:16,vel:P.pad.vel});
    if(P.arp){const A=P.arp;for(let k=0;k<16/A.every;k++){const idx=A.pat[k%A.pat.length];ev.push({s:bar*16+k*A.every,inst:A.inst,n:cd[idx%cd.length]+A.oct+(idx>=cd.length?12:0),len:A.every,vel:A.vel})}}
    if(P.comp)P.comp.steps.forEach(s=>ev.push({s:bar*16+s,inst:P.comp.inst,n:cd.slice(1).map(x=>x+P.comp.oct),len:3,vel:P.comp.vel}));
    if(P.bass){const B=P.bass;if(B.walk){const r=cd[0]-12,steps=[r,r+4,r+7,r+5];steps.forEach((n,i)=>ev.push({s:bar*16+i*4,inst:'bass',n,len:3,vel:B.vel}))}else B.steps.forEach((s,i)=>ev.push({s:bar*16+s,inst:'bass',n:cd[0]-12+(i===B.steps.length-1&&B.steps.length>2?7:0),len:4,vel:B.vel}))}
    if(T.drums)Object.entries(T.drums).forEach(([k,st])=>st.forEach(s=>ev.push({s:bar*16+s,drum:k})));
  });
  if(T.mel)T.mel.notes.forEach(([b,s,n,len])=>ev.push({s:b*16+s,inst:T.mel.inst,n:m(n),len,vel:T.mel.vel}));
  ev.sort((a,b)=>a.s-b.s);return {ev,sp,L};
}
function scheduleEvent(E,T,C,e,t0){
  const swing=T.swing&&(e.s%4===2)?C.sp*T.swing:0,t=t0+e.s*C.sp+swing;
  if(e.drum){E.drum[e.drum](t);return}
  const notes=Array.isArray(e.n)?e.n:[e.n],dur=e.len*C.sp;notes.forEach(n=>E.inst[e.inst](n,t,dur,e.vel/(Array.isArray(e.n)?Math.sqrt(notes.length):1)))}
function birds(E,t0,t1){const ctx=E.ctx;let t=t0+.5+Math.random()*2;while(t<t1){const f=2200+Math.random()*900,g=ctx.createGain(),o=ctx.createOscillator();o.type='sine';
  for(let k=0;k<3;k++){o.frequency.setValueAtTime(f,t+k*.09);o.frequency.linearRampToValueAtTime(f*1.25,t+k*.09+.05)}g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.025,t+.01);g.gain.setTargetAtTime(0,t+.25,.05);
  o.connect(g);g.connect(E.musicBus);o.start(t);o.stop(t+.5);t+=2+Math.random()*4}}

const S={ctx:null,E:null,cur:null,timer:0,vol:{music:.6,sfx:.8},muted:false,night:false,
  init(){if(this.ctx)return this.ctx.resume();const AC=window.AudioContext||window.webkitAudioContext;this.ctx=new AC();this.E=Engine(this.ctx);this.apply();return this.ctx.resume()},
  apply(){if(!this.E)return;const t=this.ctx.currentTime,E=this.E;E.music.gain.setTargetAtTime(this.muted?0:this.vol.music,t,.08);E.sfx.gain.setTargetAtTime(this.muted?0:this.vol.sfx,t,.05);
    E.tone.frequency.setTargetAtTime(this.night?1500:6000,t,.6);E.drumBus.gain.setTargetAtTime(this.night?.45:1,t,.5)},
  setVolume(k,v){this.vol[k]=v;this.apply()},setMuted(b){this.muted=b;this.apply()},setNight(b){this.night=b;this.apply()},
  // đổi bài: nhạc cũ nhỏ dần, bài mới bắt đầu ở đầu ô nhịp kế tiếp
  play(id){if(!this.ctx)return;if(this.cur&&this.cur.id===id)return;this.stop(1.2);const T=TRACKS[id];if(!T)return;
    const C=compile(T),bus=this.ctx.createGain();bus.gain.value=0;bus.gain.setTargetAtTime(1,this.ctx.currentTime,.6);
    const E=this.E,origBus=E.musicBus;
    // mỗi bài có bus riêng để làm mờ dần khi đổi bài
    const local={...E,musicBus:bus,revSend:E.revSend};bus.connect(origBus);
    const loopDur=C.L*C.sp;let t0=this.ctx.currentTime+.1,idx=0,loopStart=t0;
    const st={id,T,C,bus,t0};this.cur=st;
    const tick=()=>{const now=this.ctx.currentTime,until=now+.15;
      while(true){const e=C.ev[idx];const t=loopStart+e.s*C.sp;if(t>until)break;scheduleEvent(withBus(E,bus),T,C,e,loopStart);idx++;if(idx>=C.ev.length){idx=0;if(T.birds)birds(withBus(E,bus),loopStart,loopStart+loopDur);loopStart+=loopDur}}};
    if(T.birds)birds(withBus(E,bus),loopStart,loopStart+loopDur);
    st.timer=setInterval(tick,40);tick()},
  stop(fade=.8){const c=this.cur;if(!c)return;clearInterval(c.timer);const t=this.ctx.currentTime;c.bus.gain.setTargetAtTime(0,t,fade/3);setTimeout(()=>c.bus.disconnect(),fade*2000+500);this.cur=null},
  sting(id){if(!this.ctx)return;const s=STINGS[id],t=this.ctx.currentTime+.05,E=this.E;s.ev.forEach(([dt,inst,n,dur,vel])=>{(Array.isArray(n)?n:[n]).forEach(x=>E.inst[inst](typeof x==='string'?m(x):x,t+dt,dur,vel))})},
  sfx(name){if(!this.ctx)return;const f=SFX[name];if(f)f(this.E,this.ctx.currentTime+.01)},
};
function withBus(E,bus){if(E._bus===bus)return E._wb;const wb=Object.create(E);wb.musicBus=bus;
  // các nhạc cụ đọc E.musicBus qua hàm out, nên tạo lại nhạc cụ trỏ vào bus mới
  wb.inst=Object.fromEntries(Object.entries(E.inst).map(([k,f])=>[k,(n,t,dur,vel)=>{const keep=E.musicBus;E.musicBus=bus;f(n,t,dur,vel);E.musicBus=keep}]));
  wb.drum=Object.fromEntries(Object.entries(E.drum).map(([k,f])=>[k,t=>{const keep=E.drumBus;f(t)}]));
  E._bus=bus;E._wb=wb;return wb}

/* ---------- Hiệu ứng âm thanh: ngắn, nhỏ, không có tiếng rít ---------- */
function tone(E,t,f,dur,vel,type='sine',slide){const c=E.ctx,o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;
  o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.006);g.gain.setTargetAtTime(0,t+.006,dur/3);
  o.connect(lp);lp.connect(g);g.connect(E.sfx);o.start(t);o.stop(t+dur+.5)}
function softNoise(E,t,dur,f,vel){const c=E.ctx,b=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
  const s=c.createBufferSource();s.buffer=b;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f;bp.Q.value=.8;const g=c.createGain();g.gain.value=vel;s.connect(bp);bp.connect(g);g.connect(E.sfx);s.start(t)}
const SFX={
  click:(E,t)=>tone(E,t,660,.05,.16,'triangle'),
  open:(E,t)=>{tone(E,t,523,.09,.16,'triangle');tone(E,t+.06,784,.12,.14,'triangle')},
  close:(E,t)=>{tone(E,t,784,.08,.14,'triangle');tone(E,t+.06,523,.12,.14,'triangle')},
  coinIn:(E,t)=>{tone(E,t,988,.18,.13);tone(E,t+.07,1319,.3,.11)},
  coinOut:(E,t)=>tone(E,t,392,.16,.14,'triangle',330),
  statUp:(E,t)=>{tone(E,t,659,.12,.12);tone(E,t+.08,880,.18,.1)},
  statDown:(E,t)=>tone(E,t,440,.22,.12,'triangle',349),
  eat:(E,t)=>{softNoise(E,t,.07,900,.18);softNoise(E,t+.14,.07,800,.16)},
  sleep:(E,t)=>{[784,659,523,392].forEach((f,i)=>tone(E,t+i*.18,f,.4,.1))},
  dayStart:(E,t)=>{[523,659,784,1047].forEach((f,i)=>tone(E,t+i*.1,f,.5,.1))},
  questDone:(E,t)=>{[659,784,1047].forEach((f,i)=>tone(E,t+i*.11,f,.45,.13))},
  questFail:(E,t)=>{tone(E,t,440,.3,.12,'triangle');tone(E,t+.18,370,.45,.11,'triangle')},
  warn:(E,t)=>{tone(E,t,587,.14,.13,'triangle');tone(E,t+.2,587,.14,.13,'triangle')},
  message:(E,t)=>{tone(E,t,880,.12,.1);tone(E,t+.12,1175,.2,.09)},
  text:(E,t)=>tone(E,t,620+Math.random()*60,.025,.05,'triangle'),
  door:(E,t)=>{tone(E,t,140,.18,.25,'sine',90);softNoise(E,t,.1,500,.08)},
  register:(E,t)=>{tone(E,t,1047,.08,.08);tone(E,t+.09,1047,.08,.08);softNoise(E,t+.2,.12,1400,.06)},
};

/* ---------- Dựng ngoại tuyến (để đo độ to và xuất file WAV) ---------- */
async function render(id,seconds){const sr=44100,OC=window.OfflineAudioContext||window.webkitOfflineAudioContext,ctx=new OC(2,Math.floor(sr*seconds),sr),E=Engine(ctx);
  if(STINGS[id]){const s=STINGS[id];s.ev.forEach(([dt,inst,n,dur,vel])=>(Array.isArray(n)?n:[n]).forEach(x=>E.inst[inst](typeof x==='string'?m(x):x,.05+dt,dur,vel)))}
  else{const T=TRACKS[id],C=compile(T),loop=C.L*C.sp;let t0=.05;while(t0<seconds){C.ev.forEach(e=>{if(t0+e.s*C.sp<seconds)scheduleEvent(E,T,C,e,t0)});if(T.birds)birds(E,t0,Math.min(seconds,t0+loop));t0+=loop}}
  return ctx.startRendering()}
function analyse(buf){let peak=0,sum=0,hf=0,all=0,n=0;for(let c=0;c<buf.numberOfChannels;c++){const d=buf.getChannelData(c);let prev=0;for(let i=0;i<d.length;i++){const v=d[i];peak=Math.max(peak,Math.abs(v));sum+=v*v;all+=v*v;hf+=(v-prev)*(v-prev);prev=v;n++}}
  const db=x=>20*Math.log10(Math.max(x,1e-9));return {peak:db(peak),rms:db(Math.sqrt(sum/n)),hf:hf/Math.max(all,1e-9)}}
function wav(buf){const ch=buf.numberOfChannels,len=buf.length,sr=buf.sampleRate,b=new ArrayBuffer(44+len*ch*2),v=new DataView(b);let p=0;const w=s=>{for(const c of s)v.setUint8(p++,c.charCodeAt(0))},u32=x=>{v.setUint32(p,x,true);p+=4},u16=x=>{v.setUint16(p,x,true);p+=2};
  w('RIFF');u32(36+len*ch*2);w('WAVE');w('fmt ');u32(16);u16(1);u16(ch);u32(sr);u32(sr*ch*2);u16(ch*2);u16(16);w('data');u32(len*ch*2);
  const data=[...Array(ch)].map((_,c)=>buf.getChannelData(c));for(let i=0;i<len;i++)for(let c=0;c<ch;c++){const s=Math.max(-1,Math.min(1,data[c][i]));v.setInt16(p,s<0?s*0x8000:s*0x7fff,true);p+=2}
  return new Blob([b],{type:'audio/wav'})}

async function renderSfx(name){const sr=44100,OC=window.OfflineAudioContext||window.webkitOfflineAudioContext,ctx=new OC(2,sr*2,sr),E=Engine(ctx);SFX[name](E,.05);return ctx.startRendering()}
S.renderSfx=renderSfx;S.TRACKS=TRACKS;S.STINGS=STINGS;S.SFX_LIST=Object.keys(SFX);S.render=render;S.analyse=analyse;S.wav=wav;
window.GameAudio=S;
})();
