# 30 Ngày Sài Gòn · Tài liệu thiết kế trò chơi

Phiên bản tài liệu: 0.1.0 · Cập nhật: 20/10/2026

**30 Ngày Sài Gòn** là game mô phỏng chi tiêu theo lượt có cốt truyện. Người chơi đưa nhân vật Minh vượt qua 30 ngày thử việc đầu tiên ở Sài Gòn, cân bằng giữa tiền, sức khỏe, tinh thần và công việc.

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Cốt truyện và nhân vật](#2-cốt-truyện-và-nhân-vật)
3. [Vòng lặp chơi](#3-vòng-lặp-chơi)
4. [Hệ thống chỉ số](#4-hệ-thống-chỉ-số)
5. [Địa điểm và hành động](#5-địa-điểm-và-hành-động)
6. [Túi đồ và vật phẩm](#6-túi-đồ-và-vật-phẩm)
7. [Hệ thống nhiệm vụ](#7-hệ-thống-nhiệm-vụ)
8. [Sự kiện](#8-sự-kiện)
9. [Kinh tế và cân bằng](#9-kinh-tế-và-cân-bằng)
10. [Tính điểm và kết cục](#10-tính-điểm-và-kết-cục)
11. [Giao diện](#11-giao-diện)

---

## 1. Tổng quan

| Hạng mục | Mô tả |
| --- | --- |
| Thể loại | Mô phỏng đời sống, quản lý tài nguyên theo lượt; điều khiển bằng bấm chọn (point-and-click) |
| Nền tảng | Trình duyệt web trên máy tính và điện thoại |
| Hình ảnh | Pixel art, canvas 192×108 phóng to; một nhân vật ở giữa, cảnh đổi theo địa điểm và buổi |
| Độ dài một ván | 30 ngày × 4 buổi = 120 lượt |
| Ngôn ngữ | Tiếng Việt, giá cả theo TP.HCM |
| Mục tiêu trải nghiệm | Người chơi tự cảm nhận đánh đổi giữa chi tiêu, tiết kiệm và chăm sóc bản thân qua lựa chọn |

## 2. Cốt truyện và nhân vật

Minh, 23 tuổi, rời Tuy Hòa vào Sài Gòn làm designer thử việc 30 ngày ở một agency Quận 1. Hai mục tiêu song song: **qua thử việc** để ký hợp đồng chính thức, và **sống ổn, lo được cho mẹ ở quê**. Ngày 30 là sinh nhật mẹ.

| Nhân vật | Mã trong code | Vai trò |
| --- | --- | --- |
| Minh | `self` | Nhân vật chính |
| Cô Tư, chủ nhà trọ | `tu` | Thu tiền nhà, hướng dẫn những việc đầu tiên |
| Anh Quân, trưởng nhóm | `quan` | Giao việc, chấm điểm thử việc |
| Chị Hạnh, phòng kế toán | `hanh` | Mời đám cưới |
| Khoa, bạn thân | `khoa` | Hẹn cà phê, hỏi mượn tiền |
| Mẹ | `me` | Động lực cảm xúc, nhiệm vụ cuối truyện |

| Chương | Ngày | Nội dung |
| --- | --- | --- |
| 1. Chân ướt chân ráo | 1–7 | Nhận phòng trọ, đi làm ngày đầu, học nấu ăn, giữ đủ tiền nhà |
| 2. Guồng quay | 8–14 | Dự án banner Trung Thu hạn thứ Sáu; đám cưới chị Hạnh; ví mỏng dần |
| 3. Ngày lương | 15–21 | Lương kỳ 1 về; cám dỗ tiêu xài; lập quỹ phòng thân; cà phê với Khoa |
| 4. Về đích | 22–30 | Chuẩn bị thuyết trình ngày 29; quà sinh nhật mẹ; kết thúc thử việc |

## 3. Vòng lặp chơi

![Vòng lặp chơi](images/game-loop.svg)

| Việc trong một buổi | Giới hạn | Tốn thời gian |
| --- | --- | --- |
| Đi tới địa điểm khác | Không giới hạn | Không |
| Ăn một bữa | Tối đa 1 lần | Không |
| Uống, dùng thuốc | Không giới hạn | Không |
| Mua đồ, giao dịch ngân hàng | Không giới hạn | Không |
| Hoạt động chính | Đúng 1 lần | Có, sang buổi sau |

- Ngày 1 là thứ Hai. Giờ làm là ca sáng và ca chiều từ thứ Hai đến thứ Sáu; không có mặt thì tính vắng ca (trừ nghỉ ốm có phép).
- Qua đêm: độ no giảm, năng lượng hồi, đồ hết hạn bị bỏ. Sáng hôm sau hóa đơn đến hạn tự trừ và có 2 việc hằng ngày mới.

## 4. Hệ thống chỉ số

| Chỉ số | Khởi đầu | Vai trò | Tự thay đổi |
| --- | --- | --- | --- |
| Độ no `no` | 70 | Ràng buộc sinh tồn | −9 mỗi buổi, −10 qua đêm |
| Năng lượng `nl` | 80 | Sức làm việc | −4 mỗi buổi; ngủ +50 (+35 nếu đói) |
| Tinh thần `tt` | 65 | Thu nhập và điểm cuối tháng | −2 mỗi buổi |
| Sức khỏe `sk` | 80 | Hậu quả dài hạn | +2 mỗi đêm ngủ no |

**Ngưỡng nguy hiểm (dưới 25):**

- Độ no < 25: tinh thần −4, sức khỏe −2 mỗi buổi.
- Năng lượng < 15: tinh thần −3, sức khỏe −2 mỗi buổi; lương ca còn 60k.
- Tinh thần < 25: lương ca còn 90k.
- Sức khỏe < 40: 45% bị ốm mỗi sáng. Sức khỏe = 0: nhập viện 1.200.000đ, mất trọn ngày.

**Lợi ích giảm dần:** ăn khi độ no > 80 chỉ được 50%; giải trí khi tinh thần > 85 chỉ được 60%.

## 5. Địa điểm và hành động

| Địa điểm | Mở cửa | Đi lại | Hành động chính |
| --- | --- | --- | --- |
| Phòng trọ `home` | Cả ngày | 0 | Đặt đồ ăn (68k), ngủ trưa, lướt mạng, dọn phòng, freelance (+110k, từ chiều), ngủ sớm |
| Quán ăn `street` | Cả ngày | 0 | Cơm tấm 40k, phở 55k, bún bò 75k, mua bánh mì/xôi, trà đá, ăn ốc buổi tối 150k |
| Chợ `market` | Sáng–chiều | 0 | Mua nguyên liệu, mì gói, trái cây, sữa, thuốc; dạo chợ |
| Công viên `park` | Cả ngày | 0 | Chạy bộ (không chạy buổi trưa), đi dạo, ghế đá, bắp xào |
| Cà phê `cafe` | Cả ngày | 5k | Cà phê tại quán, mua mang về, đọc sách 45k, part-time cuối tuần +150k, gặp Khoa (nhiệm vụ) |
| Công ty `office` | T2–T6 | 8k | Làm việc, căng tin trưa, ngủ trưa tại bàn, tán gẫu, tăng ca tối, ứng lương |
| Ngân hàng `bank` | Sáng–chiều | 5k | Gửi/rút tiết kiệm, vay app, trả nợ, chuyển tiền về quê (nhiệm vụ) |
| TTTM `mall` | Trưa–tối | 12k | Buffet 199k, xem phim 110k, quần áo 350k, đi dạo (35% gặp giày sale) |

Hết tiền xăng thì đi bộ: năng lượng −8, tinh thần −2. Xe hỏng: phí đi lại ×3 trong 4 ngày.

## 6. Túi đồ và vật phẩm

Túi 12 ô. Đồ ăn chiếm lượt ăn của buổi; đồ uống và thuốc dùng tự do. Đồ hết hạn bị bỏ cuối ngày.

| Vật phẩm | Loại | Giá | Hiệu ứng | Hạn | Nơi dùng |
| --- | --- | --- | --- | --- | --- |
| Bánh mì thịt | Đồ ăn | 20k | no +22, tt +1 | 1 ngày | Mọi nơi |
| Xôi gà | Đồ ăn | 25k | no +28, tt +2 | 1 ngày | Mọi nơi |
| Mì gói | Đồ ăn | 30k/5 | no +24, tt −2, sk −4 (gói thứ 2 trong ngày −8) | Không | Phòng trọ, công ty |
| Nguyên liệu | Đồ ăn | 95k/3 | no +36, sk +3, tt +3, nl −3 | 3 ngày | Phòng trọ |
| Trái cây | Đồ ăn | 25k | no +12, sk +5, tt +2 | 2 ngày | Mọi nơi |
| Bánh ngọt | Đồ ăn | 30k | no +15, tt +6 | 1 ngày | Mọi nơi |
| Cà phê lon | Đồ uống | 18k | nl +12, tt +2 | Không | Mọi nơi |
| Sữa tươi | Đồ uống | 12k | no +8, nl +4, sk +3 | 3 ngày | Mọi nơi |
| Thuốc cảm | Thuốc | 45k | sk +12, nl −2 | Không | Mọi nơi |

Túi khởi đầu: 3 mì gói, 1 nguyên liệu, 1 cà phê lon.

## 7. Hệ thống nhiệm vụ

| Ch. | ID | Nhiệm vụ | Giao | Điều kiện | Hạn | Thưởng |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `q1_work` | Ngày đầu đi làm | Quân | Làm ca sáng ngày 1 | 1 | tt +5 |
| 1 | `q1_cook` | Bữa cơm nhà đầu tiên | Tư | Nấu 1 bữa ở phòng trọ | 4 | tt +6, sk +3 |
| 1 | `q1_rent` | Tiền nhà cho cô Tư | Tư | Đủ 1,5tr sáng ngày 5 | 5 | tt +4, 2 trái cây |
| 1 | `q1_week` | Tuần đầu trọn vẹn | Quân | 10 ca tuần đầu | 5 | tt +8 |
| 2 | `q2_banner` | Dự án banner Trung Thu | Quân | 8 ca ngày 8–12 | 12 | tt +6, thưởng 200k |
| 2 | `q2_wedding` | Đám cưới chị Hạnh | Hạnh | Dự đám cưới trưa ngày 13 | 13 | tt +6 |
| 2 | `q2_mood` | Đừng để mình kiệt quệ | Minh | Tinh thần ≥ 30 suốt ngày 8–14 | 14 | tt +5, sk +3 |
| 3 | `q3_save` | Quỹ khẩn cấp | Minh | Tiết kiệm ≥ 1tr | 21 | tt +6 |
| 3 | `q3_noloan` | Nói không với vay nóng | Minh | Không vay app cả tháng | 21 | tt +5 |
| 3 | `q3_khoa` | Cà phê với Khoa | Khoa | Gặp Khoa chiều ngày 20 hoặc 21 | 21 | tt +8 |
| 4 | `q4_present` | Chuẩn bị thuyết trình | Quân | 10 ca ngày 22–29 | 29 | tt +6 |
| 4 | `q4_mom` | Quà sinh nhật mẹ | Mẹ | Chuyển 500k về quê | 30 | tt +15 |
| 4 | `q4_health` | Về đích khỏe mạnh | Minh | Sức khỏe ≥ 50 cuối ngày 30 | 30 | Điểm cao hơn |

Quá hạn chưa xong thì thất bại; nhiệm vụ dạng "không được làm" thất bại ngay khi vi phạm.

**Việc hằng ngày** (mỗi việc xong: tt +3): ngày thường "Đi làm đủ 2 ca" + "Ăn ít nhất 2 bữa" (hoặc "Nấu một bữa ở nhà"); cuối tuần "Làm một việc thư giãn" + "Tiêu dưới 100k hôm nay".

**Điểm thử việc** (0–100):

```
điểm = round(số_ca / 44 × 70) + 5 × nhiệm_vụ_công_việc_xong + 2 × min(tăng_ca, 5) − 3 × số_ca_vắng
```

≥ 75: ký hợp đồng · 55–74: gia hạn thử việc · < 55: không đạt.

## 8. Sự kiện

**Cốt truyện (ngày cố định):** ngày 1 nhận phòng (cô Tư) · lần đầu tới công ty (anh Quân) · ngày 5 thu tiền nhà · ngày 11 tối flash sale 450k · ngày 13 trưa đám cưới (mừng 500k / 300k / không đi) · ngày 15 lương kỳ 1 · ngày 28 Khoa trả tiền (65%) · ngày 29 sáng thuyết trình.

**Theo điều kiện:** ốm (sk < 40, sáng) · đau bụng (≥ 2 gói mì/ngày) · ngất (sk = 0) · giày sale (đi dạo TTTM) · sếp khen +200k (≥ 14 ca, chiều ở công ty).

**Ngẫu nhiên** (22% mỗi buổi): đi nhậu 250k · xe hỏng 300k hoặc xe ôm 4 ngày · mưa to · Khoa mượn 300k · rơi điện thoại 400k · sinh nhật bạn 200k · nhặt được 50k.

## 9. Kinh tế và cân bằng

| Thu | Số tiền |
| --- | --- |
| Tiền đầu tháng | 3.500.000đ |
| Mỗi ca làm | 120.000đ (tối đa 44 ca) |
| Tăng ca | 170.000đ |
| Thưởng chuyên cần | 300.000đ |
| Freelance / part-time | 110.000đ / 150.000đ |

| Chi cố định | Ngày | Số tiền |
| --- | --- | --- |
| Tiền nhà | 5 | 1.500.000đ |
| Điện, nước, internet | 10 | 350.000đ |
| Trả góp điện thoại | 20 | 400.000đ |

Thiếu tiền trả hóa đơn: ghi nợ + phạt 10%, tinh thần −12. Công cụ: tiết kiệm 500k/lần (lãi 0,4%), vay app 1tr → trả 1,3tr (tối đa 2 lần), ứng lương 500k mỗi kỳ không lãi.

Ngân sách nửa đầu tháng: (3,5tr − 1,5tr − 0,35tr) / 14 ngày ≈ **118.000đ/ngày**.

Kết quả mô phỏng (`npm run sim`, 150 ván mỗi kiểu): bot thận trọng ~857 điểm, 11/13 nhiệm vụ, thử việc 90; bot ngẫu nhiên ~150 điểm, 3/13 nhiệm vụ.

## 10. Tính điểm và kết cục

```
Điểm = 1000 × T^0,35 × N^0,2 × M^0,25 × S^0,2
```

| | Yếu tố | Quy đổi 0–1 |
| --- | --- | --- |
| T | Tài sản = tiền + tiết kiệm × 1,004 + lương kỳ 2 + thưởng chuyên cần − nợ | ÷ 4.000.000, tối đa 1,25 |
| N | Độ no trung bình cả tháng | ÷ 100 |
| M | Tinh thần trung bình cả tháng | ÷ 100 |
| S | Sức khỏe cuối ngày 30 | ÷ 100 |

Hạng: S ≥ 800 · A ≥ 700 · B ≥ 580 · C ≥ 450 · D.

Kiểu người chơi: Con nợ cuối tháng · Cỗ máy cày cuốc · Kẻ khổ hạnh · Sống cho hiện tại · Người cân bằng · Người sống sót.

Kết cục theo nhân vật: anh Quân (theo điểm thử việc), mẹ (có nhận quà không), Khoa và chị Hạnh (nếu đã gặp), cô Tư (còn nợ hay không). Thành tựu: Chuyên cần, Đầu bếp tại gia, Không một đồng nợ, Tiết kiệm có kỷ luật, Hoàn thành mọi nhiệm vụ, Fan cứng mì gói.

## 11. Giao diện

Một màn hình 16:9 tự co giãn; trên điện thoại dọc chuyển sang bố cục cảnh trên, bảng dưới.

| Vị trí | Thành phần |
| --- | --- |
| Trên trái | Ngày, 4 buổi, 4 thanh chỉ số mini |
| Giữa trên | Biển tên địa điểm |
| Trên phải | Ví tiền, khung theo dõi nhiệm vụ |
| Giữa dưới | Thanh lệnh: Ăn uống · Mua · Hoạt động · Giao dịch (menu mở khi bấm) |
| Dưới trái | Túi đồ · Lịch · Nhiệm vụ · Nhật ký · Luật |
| Dưới phải | Bản đồ |

Tiến trình tự lưu vào `localStorage` (khóa `ba-muoi-ngay-sg-v3`) sau mỗi hành động.
