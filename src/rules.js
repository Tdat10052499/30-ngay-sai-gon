/* 30 Ngày Sài Gòn · luật theo độ khó (bản chơi thử 2, CLAUDE-CODE-BAN-THU-2.md mục 4.4).
 * "Thường": hình phạt mới, hao hụt tăng theo chương. "Dễ": giữ số của v0.2.0, không tăng theo chương.
 * Chỉ có dữ liệu và hàm thuần; game.js đọc qua rulesOf(s). Mọi con số là giả thuyết, chỉnh theo mô phỏng. */
const DIFFS={
  thuong:{
    n:'Thường',
    decay:{no:10,tt:2,nl:5},            // hao hụt cuối mỗi buổi (mô phỏng: tinh thần −3 làm Thận trọng chỉ còn 500 điểm)
    chap:[1,1,1,1.05,1.1],             // hệ số hao hụt theo chương (chỉ số 1–4)
    hungry:{tt:-5,sk:-2},               // no dưới 25
    starve:{sk:-8,nl:-5},               // no về 0
    exhaust:{tt:-4,sk:-3},              // năng lượng dưới 15 (lương ca còn một nửa)
    lowMoodPay:30000,                   // tinh thần dưới 25: lương ca bị trừ
    sleep:50,bedHungry:{nl:30,tt:-8,sk:-4},  // đi ngủ đói (no dưới 30 lúc chọn hành động cuối ngày)
    absence:4,truantWarn:3,truantTt:-5, // vắng học: trừ điểm học tập mỗi buổi; vắng 3 buổi trong một tuần thì thầy Hải nhắc
    sickCurve:{min:.02,max:.30},        // xác suất ốm mỗi sáng: min khi sức khỏe 100, tăng dần tới max khi 40; dưới 40 là 45%
    ignoreSick:{sk:-10,tt:-8,nl:-15},ignoreSickRelapse:.5,
    rain:{sk:-12,tt:-6,nl:-6},rainSick:.25,
    billScale:true,                     // thiếu tiền hóa đơn: thêm −1 tinh thần mỗi 50.000đ thiếu, tối đa −30
    questFailTt:-5,                     // nhiệm vụ chính thất bại
    faintRest:true,                     // ngất xỉu: nghỉ cả sáng hôm sau, có giấy xin nghỉ
  },
  de:{
    n:'Dễ',
    decay:{no:9,tt:2,nl:4},
    chap:[1,1,1,1,1],
    hungry:{tt:-4,sk:-2},
    starve:{sk:-4,nl:0},
    exhaust:{tt:-3,sk:-2},
    lowMoodPay:20000,
    sleep:50,bedHungry:{nl:35,tt:-6,sk:-2},
    absence:2,truantWarn:0,truantTt:0,
    sickCurve:false,
    ignoreSick:{sk:-5,tt:-6,nl:-10},ignoreSickRelapse:0,
    rain:{sk:-6,tt:-4},rainSick:0,
    billScale:false,
    questFailTt:0,
    faintRest:false,
  },
};
const rulesOf=s=>DIFFS[(s&&s.diff)||'thuong']||DIFFS.thuong;
/* hao hụt cuối buổi đã nhân hệ số chương (làm tròn) */
function slotDecay(s,ch){const R=rulesOf(s),m=R.chap[ch]||1;return {no:Math.round(R.decay.no*m),tt:Math.round(R.decay.tt*m),nl:Math.round(R.decay.nl*m)}}
/* xác suất bị ốm buổi sáng: Thường tăng dần theo sức khỏe (2% khi 100, 45% khi dưới 40); Dễ như v0.2.0 */
function sickChance(s){
  const R=rulesOf(s);let p;
  if(R.sickCurve)p=s.sk<40?0.45:R.sickCurve.min+(R.sickCurve.max-R.sickCurve.min)*(100-s.sk)/60;
  else p=s.sk<40?0.45:0;
  if(s.flags&&s.flags.rainSickDay===s.day-1)p+=R.rainSick;
  if(s.flags&&s.flags.relapseDay===s.day)p=Math.max(p,R.ignoreSickRelapse);
  return Math.min(1,p);
}
/* tinh thần bị trừ khi thiếu tiền hóa đơn */
function billPenalty(s,short){const R=rulesOf(s);return R.billScale?Math.min(30,12+Math.floor(short/50000)):12}
/* trọng số công thức điểm (mục 4.3) */
const SCORE_W={tien:0.30,no:0.15,tt:0.20,sk:0.15,hoc:0.20};
