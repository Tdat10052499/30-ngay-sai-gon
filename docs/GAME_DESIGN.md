# 30 Ngày Sài Gòn · Tài liệu thiết kế trò chơi

Phiên bản tài liệu: 0.4.0 · Cập nhật: 22/10/2026

**30 Ngày Sài Gòn** là game mô phỏng chi tiêu theo lượt có cốt truyện. Người chơi vào vai một tân sinh viên năm nhất (tự đặt tên và chọn giới tính, mặc định là Minh) vừa học vừa làm thêm, sống qua tháng đầu tiên ở Sài Gòn: đi học đầy đủ, làm part-time, chi tiêu khéo từ tiền bố mẹ chu cấp, và giữ cho mình đủ no, đủ khỏe, đủ vui.

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Cốt truyện và nhân vật](#2-cốt-truyện-và-nhân-vật)
3. [Vòng lặp chơi](#3-vòng-lặp-chơi)
4. [Hệ thống chỉ số và độ khó](#4-hệ-thống-chỉ-số-và-độ-khó)
5. [Địa điểm, hành động và thẻ ăn](#5-địa-điểm-hành-động-và-thẻ-ăn)
6. [Túi đồ và vật phẩm](#6-túi-đồ-và-vật-phẩm)
7. [Nhiệm vụ và điểm học tập](#7-nhiệm-vụ-và-điểm-học-tập)
8. [Sự kiện](#8-sự-kiện)
9. [Minigame](#9-minigame)
10. [Kinh tế và cân bằng](#10-kinh-tế-và-cân-bằng)
11. [Tính điểm và kết cục](#11-tính-điểm-và-kết-cục)
12. [Giao diện](#12-giao-diện)

---

## 1. Tổng quan

| Hạng mục | Mô tả |
| --- | --- |
| Thể loại | Mô phỏng đời sống, quản lý tài nguyên theo lượt; điều khiển bằng thẻ hành động theo buổi (point-and-click) |
| Nền tảng | Trình duyệt web trên máy tính và điện thoại nằm ngang |
| Hình ảnh | Pixel art: cảnh 320×180, giao diện trên lưới 640×360, phóng to nguyên lần. Cảnh đổi theo địa điểm, buổi và tiến độ; một số hành động có cảnh riêng. Quy tắc hình ảnh và bảng màu: [DESIGN_SPEC.md](DESIGN_SPEC.md) |
| Độ dài một ván | 30 ngày × 4 buổi = 120 lượt; một ngày thường khoảng 5 lần bấm |
| Độ khó | Thường (mặc định) và Dễ, chọn ở màn tạo nhân vật |
| Ngôn ngữ | Tiếng Việt, giá cả theo TP.HCM |
| Mục tiêu trải nghiệm | Người chơi tự cảm nhận đánh đổi giữa học, làm thêm, chi tiêu và chăm sóc bản thân |

## 2. Cốt truyện và nhân vật

Minh (hoặc tên người chơi đặt), 18 tuổi, rời Tuy Hòa vào Sài Gòn học năm nhất ngành Thiết kế, ở ghép phòng trọ với Khoa. Mọi chỗ lời thoại, nhiệm vụ, nhật ký và kết cục nhắc "Minh" đều thay bằng tên người chơi; lời thoại dùng xưng hô trung tính nên không đổi theo giới tính. **Bố mẹ gửi 3.000.000đ cho tháng đầu**, đã gồm tiền nhà. Phần còn lại Minh phải tự lo bằng việc làm part-time ở cửa hàng tiện lợi. Ba mục tiêu song song: **học đầy đủ** để qua bài kiểm tra giữa kỳ, **tự lập tài chính** không xin thêm tiền nhà, và **tự tay mua quà sinh nhật mẹ** (ngày 30) bằng tiền mình làm ra.

| Nhân vật | Mã trong code | Vai trò |
| --- | --- | --- |
| Minh (tên do người chơi đặt) | `self` | Nhân vật chính, tân sinh viên năm nhất, nam hoặc nữ |
| Cô Tư, chủ nhà trọ | `tu` | Thu tiền nhà, hướng dẫn những việc đầu tiên, thỉnh thoảng cho tô canh |
| Thầy Hải, cố vấn học tập | `hai` | Theo dõi chuyên cần, nhắc khi vắng nhiều, giao bài nhóm, ra bài kiểm tra giữa kỳ |
| Chị Mai, quản lý cửa hàng tiện lợi | `mai` | Phỏng vấn, xếp ca, trả lương part-time |
| Chị Linh, trưởng CLB | `linh` | Mời dự đêm nhạc chào tân sinh viên |
| Khoa, bạn cùng phòng | `khoa` | Rủ đi chơi, rủ chạy bộ cuối tuần, hỏi mượn tiền |
| Ngân, bạn cùng lớp | `ngan` | Thích ngồi cà phê vẽ phác thảo, nhắn tin rủ đi cà phê chiều ngày 11, 17, 24 |
| Mẹ | `me` | Gửi tiền đầu tháng, gọi điện hỏi thăm, gửi thùng đồ quê, lên Sài Gòn ngày 30 |

| Chương | Ngày | Nội dung |
| --- | --- | --- |
| 1. Tân sinh viên | 1–7 | Nhận phòng trọ, buổi học đầu tiên, phỏng vấn xin việc làm thêm, tự nấu ăn, giữ đủ tiền nhà |
| 2. Vừa học vừa làm | 8–14 | Sáng lên lớp, chiều tối đi làm; Ngân rủ cà phê ngày 11; đêm nhạc CLB tối thứ Bảy; ví mỏng dần trước ngày lương |
| 3. Lương part-time đầu tiên | 15–21 | Nhận lương ngày 15; cám dỗ tiêu xài; ôn bài ở thư viện; Ngân rủ cà phê ngày 17; mẹ gọi hỏi thăm; cà phê với Khoa |
| 4. Về đích | 22–30 | Ngân rủ ôn bài ngày 24; kiểm tra giữa kỳ sáng ngày 29; mua quà sinh nhật mẹ; trưa ngày 30 mẹ lên Sài Gòn; về đích khỏe mạnh |

## 3. Vòng lặp chơi

![Vòng lặp chơi](images/game-loop.svg)

Mỗi buổi có **3 đến 5 thẻ hành động** gợi ý. Bấm một thẻ là làm trọn: tự đi tới nơi (trừ tiền đi lại), làm việc đó, chạy cảnh hành động rồi sang buổi sau. Thẻ cuối luôn là **Tự chọn**, mở các nhóm hành động như trước (Ăn uống, Mua, Hoạt động, Tiền bạc, Bản đồ).

| Việc trong một buổi | Giới hạn | Tốn thời gian |
| --- | --- | --- |
| Đi tới địa điểm khác | Không giới hạn | Không |
| Ăn một bữa (bấm món trên thẻ ăn, hoặc Tự chọn → Ăn uống) | Tối đa 1 lần | Không |
| Uống, dùng thuốc | Không giới hạn | Không |
| Mua đồ, việc tiền bạc (ứng lương, xin tiền) | Không giới hạn | Không |
| Hoạt động chính (lên lớp, làm ca, nghỉ, giải trí…) | Đúng 1 lần | Có, sang buổi sau |

**Chọn thẻ** (`pickCards` trong `src/cards.js`):

- Sáng ngày thường: thẻ **Đi học** đứng đầu và được tô nổi; ngày 29 là **Đi thi giữa kỳ**.
- Thẻ nhiệm vụ đúng ngày luôn có mặt, kể cả khi đang khóa (hiện lý do): Phỏng vấn xin việc, Cà phê với Khoa (ngày 20, 21), Mua quà sinh nhật mẹ. Thẻ gắn với nhiệm vụ đang làm có dấu chấm than.
- Cúp điện ở phòng trọ thì có thẻ **Ra quán cà phê**.
- Các thẻ còn lại là việc làm được trong buổi đó, ưu tiên việc bù chỉ số đang thấp nhất; mỗi nhóm việc (nghỉ, giải trí, làm ca, học, dọn phòng…) chỉ một thẻ. Không gợi ý việc bị khóa vì giờ mở cửa.
- Mỗi thẻ hiện tên việc, nơi diễn ra và tiền đi lại, tiền và chỉ số chính, lý do khóa, cảnh báo khi một chỉ số sẽ xuống dưới 25.

**Lịch tuần của Minh** (ngày 1 là thứ Hai):

| Buổi | Thứ Hai – thứ Sáu | Thứ Bảy, Chủ Nhật |
| --- | --- | --- |
| Sáng | **Lên lớp** (bắt buộc, vắng bị trừ điểm học tập) | Ca part-time hoặc tự do |
| Trưa | Căng tin, thư viện, nghỉ trưa, ca trưa | Ca trưa hoặc tự do |
| Chiều | Ca part-time, thư viện, CLB | Ca part-time hoặc tự do |
| Tối | Ca part-time (lương cao hơn) hoặc nghỉ | Ca part-time hoặc tự do |

Qua đêm: năng lượng hồi 50, độ no giảm 10, đồ hết hạn bị bỏ, phòng bừa thêm. **Bụng đói khi đi ngủ** xét theo độ no lúc người chơi chọn hành động cuối ngày, trước mọi lần trừ: dưới 30 thì ngủ không ngon (xem mục 4). Sáng hôm sau hóa đơn đến hạn tự trừ và có 2 việc hằng ngày mới.

## 4. Hệ thống chỉ số và độ khó

| Chỉ số | Khởi đầu | Vai trò |
| --- | --- | --- |
| Độ no `no` | 70 | Ràng buộc sinh tồn |
| Năng lượng `nl` | 80 | Sức học và làm |
| Tinh thần `tt` | 65 | Lương ca và điểm cuối tháng |
| Sức khỏe `sk` | 80 | Hậu quả dài hạn; +2 mỗi đêm ngủ no |

**Độ khó** (`src/rules.js`, mọi con số chỉnh theo mô phỏng):

| Luật | Thường (mặc định) | Dễ |
| --- | --- | --- |
| Hao hụt mỗi buổi | no −11, năng lượng −5, tinh thần −2 | no −9, năng lượng −4, tinh thần −2 |
| Hệ số theo chương 1/2/3/4 | ×1 / ×1 / ×1,05 / ×1,1 | ×1 |
| Đói (no < 25), mỗi buổi | tinh thần −5, sức khỏe −2 | tinh thần −4, sức khỏe −2 |
| Đói lả (no = 0), mỗi buổi | sức khỏe −8, năng lượng −5 | sức khỏe −4 |
| Kiệt sức (năng lượng < 15), mỗi buổi | tinh thần −4, sức khỏe −3; lương ca còn một nửa | tinh thần −3, sức khỏe −2; lương ca còn một nửa |
| Tinh thần < 25 | lương ca −30.000đ | lương ca −20.000đ |
| Đi ngủ đói | năng lượng chỉ hồi 30, tinh thần −8, sức khỏe −4 | năng lượng hồi 35, tinh thần −6, sức khỏe −2 |
| Vắng buổi học sáng | điểm học tập −4; vắng 3 buổi trong một tuần thì thầy Hải nhắc (tinh thần −5) | điểm học tập −2 |
| Bị ốm mỗi sáng | 2% khi sức khỏe 100, tăng dần tới 30% khi 40; dưới 40 là 45%; đội mưa hôm trước +25% | 45% khi sức khỏe dưới 40 |
| Ốm mà "Kệ, ráng chịu" | sức khỏe −10, tinh thần −8, năng lượng −15; 50% sáng hôm sau còn ốm | sức khỏe −5, tinh thần −6, năng lượng −10 |
| Đội mưa đi tiếp | sức khỏe −12, tinh thần −6, năng lượng −6 | sức khỏe −6, tinh thần −4 |
| Thiếu tiền hóa đơn | tinh thần −12, thêm −1 mỗi 50.000đ thiếu, tối đa −30 | tinh thần −12 |
| Nhiệm vụ chính thất bại | tinh thần −5 | không trừ thêm |
| Ngất xỉu (sức khỏe = 0) | viện phí 1.200.000đ, mất trọn ngày, nghỉ cả sáng hôm sau (có giấy, không tính vắng) | viện phí 1.200.000đ, mất trọn ngày |

Mỗi lần bị phạt, nhật ký ghi rõ nguyên nhân và con số, gộp một dòng mỗi buổi, ví dụ “Đói: tinh thần −5, sức khỏe −2 · Kiệt sức: tinh thần −4, sức khỏe −3”.

**Lợi ích giảm dần:** ăn khi độ no > 80 chỉ được 50%; giải trí khi tinh thần > 85 chỉ được 60%.

**Độ bừa bộn phòng** (chỉ số ẩn 0–100, hiện bằng 3 vạch trong khung thời gian và bằng chính căn phòng):

| Mức | Ngưỡng | Ảnh hưởng | Dọn phòng |
| --- | --- | --- | --- |
| Gọn gàng | 0–33 | Sáng hôm sau tinh thần +2 | Tinh thần +5 |
| Hơi bừa | 34–66 | Mỗi buổi ở phòng tinh thần −1 | Tinh thần +8 |
| Bừa bộn | 67–100 | Mỗi buổi ở phòng tinh thần −2; ngủ hồi 40 năng lượng thay vì 50 | Tinh thần +12 |

Tăng +10 mỗi đêm, +6 mỗi bữa ăn trong phòng, +4 mỗi lần nấu (nấu là một bữa nên tổng +10), +2 mỗi buổi ở phòng. Dọn phòng −50, năng lượng −6, mất một buổi.

## 5. Địa điểm, hành động và thẻ ăn

| Địa điểm | Mở cửa | Đi lại | Hành động chính |
| --- | --- | --- | --- |
| Phòng trọ `home` | Cả ngày | 0 | Đặt đồ ăn (68k), ngủ trưa, lướt mạng, dọn phòng, nhận vẽ thuê (+80k, từ chiều), ngủ sớm; **Tiền bạc** mở điện thoại: tin nhắn, gọi xin thêm tiền bố mẹ (+500k), ví, đặt đồ ăn |
| Quán ăn `street` | Cả ngày | 0 | Cơm tấm 40k, phở 55k, bún bò 75k, mua bánh mì/xôi, trà đá, ăn ốc buổi tối 150k |
| Chợ `market` | Sáng–chiều | 0 | Mua nguyên liệu, mì gói, trái cây, sữa, thuốc; dạo chợ |
| Công viên `park` | Cả ngày | 0 | Chạy bộ (không chạy buổi trưa), đi dạo, ghế đá, bắp xào |
| Cà phê `cafe` | Cả ngày | 5k | Cà phê tại quán, mua mang về, đọc sách 45k, cà phê với Khoa (nhiệm vụ) |
| Trường đại học `school` | T2–T6, sáng–chiều | 6k | Lên lớp (sáng), học thư viện (trưa, chiều), sinh hoạt CLB (chiều), căng tin 25k (trưa), chợp mắt ở ghế đá; kiểm tra giữa kỳ sáng ngày 29 |
| Cửa hàng tiện lợi `store` | 24 giờ | 0 | Phỏng vấn xin việc; làm ca part-time; xin ứng lương 300k; cơm hộp 30k; mua mì, cà phê lon, sữa |
| TTTM `mall` | Trưa–tối | 12k | Buffet 199k, xem phim 110k, quần áo 350k, đi dạo (35% gặp giày sale), mua quà sinh nhật mẹ 300k (nhiệm vụ) |

Hết tiền xăng thì đi bộ: năng lượng −8, tinh thần −2. Xe hỏng: phí đi lại ×3 trong 4 ngày. Trang phục: áo xanh ngày thường, áo cam cuối tuần, đồng phục xanh lá khi ở cửa hàng sau khi đã được nhận việc (nữ mặc váy).

**Ca part-time** (chỉ sau khi phỏng vấn; mỗi ca có thể có minigame Thối tiền, mục 9):

| Ca | Khi nào | Lương | Hao tổn |
| --- | --- | --- | --- |
| Ca sáng | Thứ Bảy, Chủ Nhật | 90.000đ | Năng lượng −20, tinh thần −3, no −4 |
| Ca trưa | Mọi ngày | 90.000đ | Năng lượng −30, tinh thần −3, no −4 |
| Ca chiều | Mọi ngày | 90.000đ | Năng lượng −20, tinh thần −3, no −4 |
| Ca tối | Mọi ngày | 110.000đ | Năng lượng −28, tinh thần −4, sức khỏe −2, no −4 |

**Thẻ ăn** (`pickMeals` trong `src/cards.js`): đứng đầu hàng thẻ khi buổi hiện tại chưa ăn và có món ăn được ở nơi đang đứng. Trên thẻ có 2 đến 3 món: đồ trong túi sắp hỏng (hỏng sau hôm nay) nếu có, món rẻ nhất, một món no hơn hoặc tốt cho sức khỏe hơn (độ no + 2 × sức khỏe cao nhất). Món lấy từ đồ trong túi (0đ), món gọi tại chỗ và đồ mua lẻ ăn ngay (bánh mì, xôi ở quán ăn; trái cây ở chợ; bánh ngọt ở quán cà phê); món không đủ tiền thì không gợi ý. Mỗi món ghi giá và nhãn hiệu ứng, bấm là ăn (phím Q, W, E); "Món khác…" (phím R) mở nhóm Ăn uống đầy đủ. Ăn không hết buổi; ăn xong thẻ ăn biến mất. Độ no dưới 45 thì thẻ được tô nổi, dưới 25 có nhãn đỏ "Đang đói". Khi có thẻ ăn chỉ hiện 3 thẻ việc.

## 6. Túi đồ và vật phẩm

Túi 12 ô. Đồ ăn chiếm lượt ăn của buổi; đồ uống và thuốc dùng tự do. Đồ hết hạn bị bỏ cuối ngày.

| Vật phẩm | Loại | Giá | Hiệu ứng | Hạn | Nơi dùng |
| --- | --- | --- | --- | --- | --- |
| Bánh mì thịt | Đồ ăn | 20k | no +22, tt +1 | 1 ngày | Mọi nơi |
| Xôi gà | Đồ ăn | 25k | no +28, tt +2 | 1 ngày | Mọi nơi |
| Mì gói | Đồ ăn | 30k/5 | no +24, tt −2, sk −4 (gói thứ 2 trong ngày −8) | Không | Phòng trọ, cửa hàng |
| Nguyên liệu | Đồ ăn | 95k/3 | no +36, sk +3, tt +3, nl −3 (có thể có minigame Canh lửa) | 3 ngày | Phòng trọ |
| Trái cây | Đồ ăn | 25k | no +12, sk +5, tt +2 | 2 ngày | Mọi nơi |
| Bánh ngọt | Đồ ăn | 30k | no +15, tt +6 | 1 ngày | Mọi nơi |
| Cà phê lon | Đồ uống | 18k | nl +12, tt +2 | Không | Mọi nơi |
| Sữa tươi | Đồ uống | 12k | no +8, nl +4, sk +3 | 3 ngày | Mọi nơi |
| Thuốc cảm | Thuốc | 45k | sk +12, nl −2 | Không | Mọi nơi |

Túi khởi đầu: 3 mì gói, 1 nguyên liệu (cô Tư cho), 1 cà phê lon.

## 7. Nhiệm vụ và điểm học tập

| Ch. | ID | Nhiệm vụ | Giao | Điều kiện | Hạn | Thưởng |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `q1_class` | Buổi học đầu tiên | Thầy Hải | Lên lớp sáng ngày 1 | 1 | tt +5 |
| 1 | `q1_job` | Tìm việc làm thêm | Chị Mai | Phỏng vấn ở cửa hàng | 3 | tt +6 |
| 1 | `q1_cook` | Bữa cơm tự nấu đầu tiên | Cô Tư | Nấu 1 bữa ở phòng trọ | 4 | tt +6, sk +3 |
| 1 | `q1_rent` | Tiền nhà cho cô Tư | Cô Tư | Đủ 1,2tr sáng ngày 5 (thiếu thì thất bại ngay) | 5 | tt +4, 2 trái cây |
| 2 | `q2_class` | Không bỏ buổi học nào | Thầy Hải | Lên lớp 5 buổi ngày 8–12 | 12 | tt +6 |
| 2 | `q2_shift` | Quen việc ở cửa hàng | Chị Mai | 4 ca part-time ngày 8–14 | 14 | tt +5, thưởng 100k vào lương |
| 2 | `q2_club` | Đêm nhạc chào tân sinh viên | Chị Linh | Dự đêm nhạc tối ngày 13 (vé 100k) | 13 | tt +6 |
| 2 | `q2_mood` | Đừng để mình kiệt quệ | Minh | Tinh thần ≥ 30 suốt ngày 8–14 | 14 | tt +5, sk +3 |
| 3 | `q3_study` | Ôn bài ở thư viện | Thầy Hải | 3 buổi thư viện ngày 15–21 | 21 | tt +5 |
| 3 | `q3_indep` | Tự lập tài chính | Minh | Không xin thêm tiền bố mẹ | 21 | tt +6 |
| 3 | `q3_khoa` | Cà phê với Khoa | Khoa | Gặp Khoa chiều ngày 20 hoặc 21 | 21 | tt +8 |
| 4 | `q4_exam` | Kiểm tra giữa kỳ | Thầy Hải | Có mặt sáng ngày 29, đạt ≥ 55 điểm học tập | 29 | tt +8 |
| 4 | `q4_gift` | Quà sinh nhật mẹ | Mẹ | Mua quà 300k ở TTTM (ăn mừng ngày 30 không bắt buộc) | 30 | tt +15 |
| 4 | `q4_health` | Về đích khỏe mạnh | Minh | Sức khỏe ≥ 50 cuối ngày 30 | 30 | Điểm cao hơn |

Quá hạn chưa xong thì thất bại; nhiệm vụ dạng "không được làm" thất bại ngay khi vi phạm. Ngày cuối của nhiệm vụ còn đang làm có hộp cảnh báo (mục 12).

**Việc hằng ngày** (mỗi việc xong: tt +3): ngày thường "Lên lớp buổi sáng" + "Ăn ít nhất 2 bữa" (hoặc "Nấu một bữa ở nhà"); cuối tuần "Làm ít nhất 1 ca part-time" (hoặc "Làm một việc thư giãn" khi chưa có việc) + "Tiêu dưới 100k hôm nay".

**Điểm học tập** (0–100):

```
điểm = round(số_buổi_lên_lớp / 22 × 61) + 3 × min(số_buổi_thư_viện, 8) + 5 × nhiệm_vụ_học_tập_xong
       + thưởng_bài_nhóm − (4 ở Thường, 2 ở Dễ) × số_buổi_vắng
```

Nhiệm vụ học tập: `q1_class`, `q2_class`, `q3_study`. Thưởng bài nhóm: sau sự kiện "Bài tập nhóm", 2 buổi thư viện tiếp theo mỗi buổi +2. Bài kiểm tra giữa kỳ sáng ngày 29 chấm theo điểm học tập lúc đó: ≥ 75 giỏi · 55–74 đạt · < 55 không đạt · vắng mặt phải thi lại.

## 8. Sự kiện

**Cốt truyện (ngày cố định, không bị giới hạn bởi bộ bài):** ngày 1 tin nhắn của mẹ và nhận phòng (cô Tư) · lần đầu tới trường (thầy Hải) · phỏng vấn xin việc (chị Mai) · ngày 5 thu tiền nhà · chiều ngày 11, 17, 24 Ngân nhắn tin rủ đi cà phê · ngày 11 tối flash sale 450k · ngày 13 tối đêm nhạc chào tân sinh viên · ngày 15 lương part-time kỳ 1 · ngày 18 tối mẹ gọi hỏi tiền · ngày 28 Khoa trả tiền (65%) · ngày 29 sáng kiểm tra giữa kỳ · trưa ngày 30 mẹ lên Sài Gòn.

- **Lời mời của Ngân:** "Đi cà phê với Ngân" (tới quán cà phê, −30.000đ, tinh thần +12, năng lượng +4, hết buổi, có cảnh ngồi bàn cùng Ngân) hoặc "Hẹn lần sau" (tinh thần −2). Đi đủ 2 lần thì có lời kết riêng.
- **Sinh nhật mẹ:** "Đưa mẹ đi ăn mừng ở TTTM" (−300.000đ, tinh thần +10, hết buổi trưa, có cảnh mẹ và Minh ở TTTM và lời thoại của mẹ) hoặc "Mời mẹ bữa cơm ở phòng trọ" (tinh thần +4).

**Theo điều kiện:** ốm (sáng, theo độ khó; khám 200k có giấy nghỉ học) · đau bụng (≥ 2 gói mì/ngày) · ngất (sk = 0) · giày sale (đi dạo TTTM) · thầy Hải nhắc khi vắng 3 buổi trong tuần (Thường) · nghỉ dưỡng sau khi nằm viện (Thường).

**Bộ bài sự kiện ngẫu nhiên** (`src/events.js`): xét 22% mỗi đầu buổi theo nơi đang đứng. Mỗi sự kiện có `tags` (nơi, buổi), `loai`, `max` (số lần tối đa trong tháng, mặc định 1) và `cooldown` (số ngày chờ trước khi lặp lại). Mỗi ngày tối đa 1 sự kiện ngẫu nhiên; không ra cùng loại hai ngày liên tiếp; ngày 14–19 sự kiện bạn bè và chuyện vui có trọng số ×2.

| Sự kiện | Loại | Khi nào | Lựa chọn |
| --- | --- | --- | --- |
| Lớp rủ đi ăn lẩu | Bạn bè | Tối ngày thường; tối đa 3 lần, cách 5 ngày | 150k, tt +14, no +20 · ở nhà tt −4 |
| Xe chết máy | Tiền bạc | Buổi sáng; tối đa 2 lần, cách 7 ngày | Sửa 250k · xe ôm 4 ngày |
| Nhặt được tiền | Chuyện vui | Quán ăn, công viên, chợ | +50k · gửi bảo vệ tt +8 |
| Chị Mai khen | Chuyện vui | Cửa hàng chiều/tối, từ 8 ca | +100k, tt +10 |
| Mưa to bất chợt | Thời tiết | Công viên trưa/chiều, hoặc vừa đi lại buổi trưa/chiều (8%); tối đa 2 lần, cách 5 ngày | Trú mưa 20k · đội mưa (theo độ khó) |
| Quán hết chỗ | Bạn bè | Quán cà phê, trưa đến tối | Ngồi chung tt +6 · mang về tt −1 |
| Mời làm thẻ thành viên | Tiền bạc | TTTM, trưa đến tối | 99k tt +2 · để sau tt +1 |
| Khoa hỏi mượn tiền | Tiền bạc | Ngày 6–19 | Cho mượn 300k (hẹn trả ngày 28) · từ chối tt −6 |
| Rơi điện thoại | Tiền bạc | Bất kỳ | Thay màn hình 400k · dùng tạm tt −10 |
| Sinh nhật bạn cùng lớp | Bạn bè | Tối cuối tuần | 150k tt +12 · nhắn tin tt −4 |
| Tin nhắn trúng thưởng | Tiền bạc | Ngày 9–25 | Chuyển 200k, tt −10, rồi biết là lừa đảo · chặn số tt +2 |
| Nhặt được ví | Chuyện vui | Công viên | Nộp bảo vệ tt +6 · tự tìm chủ (hết buổi, tt +10, +50k) |
| Thùng đồ quê | Chuyện vui | Ngày 10–20, phòng trọ | +2 nguyên liệu, +3 mì (không quá 12 ô), tt +6 |
| Tô canh của cô Tư | Chuyện vui | Phòng trọ, buổi tối | no +30, tt +4 |
| Bạn cùng quê rủ đi ăn | Bạn bè | Cuối tuần | 60k, tt +10, nl −4 · hẹn dịp khác tt −2 |
| Hỏng sạc laptop | Tiền bạc | Bất kỳ | Mua sạc 150k · mượn của bạn (không học thư viện được 2 ngày) |
| Cúp điện | Bất ngờ | Phòng trọ, buổi tối | Không lướt mạng được buổi đó; có thẻ "Ra quán cà phê" |
| Khách để quên điện thoại | Bạn bè | Đang làm ca ở cửa hàng | Giữ lại tt +6 · để trên quầy |
| Bài tập nhóm | Học tập | Ngày thường, ở trường | 2 buổi thư viện tới mỗi buổi điểm học tập +2 |
| Khoa rủ chạy bộ | Bạn bè | Sáng cuối tuần, phòng trọ; tối đa 3 lần | Chạy với Khoa (công viên, sk +8, tt +5, nl −14, hết buổi) · ngủ nướng nl +10, tt −2 |

## 9. Minigame

Khung chung (`src/minigames.js`): tiêu đề, hướng dẫn một dòng, đồng hồ đếm ngược, nút "Bỏ qua" (nhận kết quả trung bình). Chơi bằng chuột, phím hoặc cảm ứng. Máy bật giảm chuyển động thì không giới hạn thời gian. Mỗi loại được chơi lần đầu mỗi tuần, sau đó khoảng 1 trong 3 lần; các lần còn lại tự tính kết quả trung bình. Mô phỏng luôn dùng kết quả trung bình.

| Minigame | Khi nào | Cách chơi | Kết quả |
| --- | --- | --- | --- |
| Thối tiền | Làm ca ở cửa hàng | 3 khách, mỗi khách 1–3 món; bấm tờ tiền 1.000–200.000đ (phím 1–8) để thối, Xóa, Đưa tiền; 25 giây | Đúng 3: +20.000đ, tt +3, chị Mai khen · đúng 2: +10.000đ · đúng 0–1: tt −2 · bỏ qua hoặc trung bình: +10.000đ |
| Canh lửa | Nấu cơm ở phòng trọ | 3 bước (xào rau, chiên trứng, nêm nếm); bấm Dừng khi vạch trong vùng xanh 25%; 15 giây | Trúng 3: tt +3, no +4 · trúng 1–2: không cộng · trúng 0: món khét (nhật ký vui) · bỏ qua: không cộng |

Tờ tiền vẽ pixel 12×24 (`src/gfx/money.js`) theo màu tờ tiền thật, không chép hình in.

## 10. Kinh tế và cân bằng

Trò chơi chỉ kéo dài một tháng nên **không có tính năng gửi tiết kiệm**. Tiền còn lại cuối tháng được tính thẳng vào tài sản.

| Thu | Số tiền |
| --- | --- |
| Bố mẹ chu cấp đầu tháng | 3.000.000đ (gồm tiền nhà) |
| Ca part-time | 90.000đ, ca tối 110.000đ |
| Thưởng thối tiền | 0–20.000đ mỗi ca (trung bình 10.000đ) |
| Lương part-time kỳ 1 | Trả ngày 15 cho các ca từ đầu tháng |
| Lương part-time kỳ 2 | Cộng vào tài sản khi tổng kết ngày 30 |
| Thưởng chăm chỉ | 200.000đ nếu làm từ 18 ca |
| Vẽ thuê | 80.000đ |

| Chi cố định | Ngày | Số tiền |
| --- | --- | --- |
| Tiền nhà (phòng ghép) | 5 | 1.200.000đ |
| Điện, nước, internet | 10 | 200.000đ |
| Giáo trình và quỹ lớp | 20 | 300.000đ |

Thiếu tiền trả hóa đơn (và viện phí): trừ hết tiền trong ví, phạt tinh thần theo độ khó (mục 4), không ghi nợ. Thiếu tiền nhà ngày 5 thì nhiệm vụ "Tiền nhà cho cô Tư" thất bại ngay và cô Tư nhắc khéo ở kết cục.

**Các cách xoay xở khi kẹt tiền:**

| Cách | Hoạt động | Hệ quả |
| --- | --- | --- |
| Xin ứng lương | Ứng 300k từ lương đang chờ, mỗi kỳ 1 lần, không lãi | Cách lành mạnh |
| Xin thêm tiền bố mẹ (gọi điện ở phòng trọ, hoặc khi mẹ gọi ngày 18) | +500k, tối đa 2 lần | Tinh thần −8, thất bại nhiệm vụ Tự lập |

**Kết quả mô phỏng** (`npm run sim`, 300 ván mỗi bot, độ khó Thường trừ dòng cuối, v0.4.0). Bot ăn qua thẻ ăn như người chơi; minigame lấy kết quả trung bình. Số dưới đây là của bản v0.4.0 (còn chế độ ăn tự động); kết quả sau khi đổi sang thẻ ăn ghi trong CHANGELOG.

| Bot | Điểm trung vị | Phân vị 90 | Hạng S / A / B / C / D | Nhiệm vụ TB | Điểm học tập | Ca | Tài sản cuối | Tinh thần TB | Bị ốm ≥ 1 lần |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Thận trọng | 763 | 800 | 11% / 82% / 7% / 0% / 0% | 12,4/14 | 100 | 34 | ~1,80tr | 74 | 69% |
| Chỉ lo làm ca | 384 | 414 | 100% hạng D | 7,0/14 | 49 | 90 | ~2,62tr | 6 | 100% |
| Ví trống ngày 5 | 525 | 589 | 0% / 0% / 16% / 69% / 15% | 9,9/14 | 100 | 35 | ~1,48tr | 25 | 100% |
| Ngẫu nhiên | 136 | 164 | 100% hạng D | 3,5/14 | 0 | 3 | ~0,10tr | 34 | 100% |
| Thận trọng (Dễ) | 805 | 836 | 61% / 39% / 0% / 0% / 0% | 12,9/14 | 100 | 35 | ~2,07tr | 77 | 0% |

Mục tiêu đã đạt: Thận trọng 700–780 điểm và 10% ván tốt nhất đạt S; Ngẫu nhiên dưới 250; Chỉ lo làm ca không quá hạng B; Ví trống thấp hơn Thận trọng ít nhất 100 điểm; Dễ khoảng 800. Chưa đạt: Thận trọng hoàn thành 12,4/14 nhiệm vụ (mục tiêu 10–11), vì bot làm mọi nhiệm vụ làm được; muốn hạ phải đổi điều kiện nhiệm vụ.

## 11. Tính điểm và kết cục

```
Điểm = 1000 × T^0,30 × N^0,15 × M^0,20 × S^0,15 × H^0,20
```

| | Yếu tố | Quy đổi 0–1 |
| --- | --- | --- |
| T | Tài sản = tiền mặt + lương part-time kỳ 2 + thưởng chăm chỉ | ÷ 2.500.000, tối đa 1,25 |
| N | Độ no trung bình cả tháng | ÷ 100 |
| M | Tinh thần trung bình cả tháng | ÷ 100 |
| S | Sức khỏe cuối ngày 30 | ÷ 100 |
| H | Điểm học tập | ÷ 100, tối thiểu 0,05 |

Hạng: S ≥ 800 · A ≥ 700 · B ≥ 580 · C ≥ 450 · D.

Kiểu người chơi: Cỗ máy làm thêm (sức khỏe thấp, từ 24 ca) · Kẻ khổ hạnh · Sống cho hiện tại · Người cân bằng · Người sống sót.

Kết cục theo nhân vật: thầy Hải (kết quả kiểm tra giữa kỳ), chị Mai (số ca đã làm), mẹ (ăn mừng ngày 30, có nhận quà không, có phải gửi thêm tiền không), Khoa và chị Linh (nếu đã gặp), Ngân (nếu đã đi cà phê từ 2 lần: “Ngân rủ [tên] cùng làm bài tập nhóm học kỳ sau.”), cô Tư (có thiếu tiền nhà ngày 5 hay không).

Thành tựu: Chuyên cần (không vắng buổi học), Đầu bếp tại gia (15 bữa tự nấu), Tự lập tài chính (không xin thêm tiền bố mẹ), Chăm chỉ làm thêm (18 ca), Hoàn thành mọi nhiệm vụ, Fan cứng mì gói.

## 12. Giao diện

Thiết kế chi tiết từng màn hình nằm trong `design/`, đặc tả trong [DESIGN_SPEC.md](DESIGN_SPEC.md).

**Luồng màn hình:** trang bìa → tạo nhân vật (Nam/Nữ, độ khó Thường/Dễ, tên 1–12 ký tự chỉ gồm chữ cái và khoảng trắng) → chuyển cảnh ngày 1 (có nút Bỏ qua) → thẻ chương 1 → vào game. Mỗi sáng từ ngày 2 có thẻ sang ngày; ngày 8, 15, 22 thêm thẻ chương. Ngày 30 kết thúc bằng màn tổng kết.

**HUD** (một màn hình 16:9, lưới 640×360):

| Vị trí | Thành phần |
| --- | --- |
| Trên trái | Thứ, chương, ngày, 4 buổi, nơi đang đứng, độ bừa bộn phòng (khi ở phòng trọ) |
| Trên phải | Ví và lương chờ; nhiệm vụ đang theo dõi, hạn, việc hôm nay; cột công cụ Túi đồ · Lịch · Nhiệm vụ · Bản đồ · Menu |
| Dưới trái | 4 chỉ số dạng cột, vạch đỏ ở mức 25 |
| Giữa dưới | Thẻ ăn (phím Q, W, E, R) và 3–5 thẻ hành động (phím 1–5); trong Tự chọn là các nhóm Ăn uống · Mua · Hoạt động · Tiền bạc · Bản đồ · Thẻ gợi ý |
| Giữa trên | Cảnh báo kèm nút làm ngay: giờ học, nơi đóng cửa, phòng bừa bộn |

**Hộp cảnh báo giữa màn hình** (nút làm ngay và "Để sau", phát âm `warn`, mỗi cảnh báo một lần): tối ngày 4 tiền nhà kèm số dư · tối ngày 28 “Sáng mai là bài kiểm tra giữa kỳ…” (nút Về phòng ngủ sớm) · sáng ngày 29 “Sáng nay là bài kiểm tra giữa kỳ…” (nút Đi thi ngay) · trưa ngày 29, 30 nhắc quà sinh nhật mẹ (nút Đi TTTM) · sáng ngày cuối của nhiệm vụ chính còn đang làm.

**Cửa sổ:** Bản đồ toàn màn hình; Túi đồ, Lịch, Nhiệm vụ chung một khung có tab; hội thoại có chân dung, lời thoại hiện dần, tin nhắn qua khung điện thoại; minigame; điện thoại trong game ở phòng trọ; tổng kết có đồ thị 30 ngày và 5 thanh yếu tố điểm kèm số mũ.

**Điện thoại nằm ngang** (`pointer: coarse`, `orientation: landscape`): cảnh phủ kín màn hình, giao diện chừa vùng an toàn; thẻ hành động xếp dọc bên phải (cao từ 52 điểm), cột công cụ 48×48 bên trái, nhiệm vụ cạnh ví; nút chính từ 48×48 điểm, hàng danh sách từ 44 điểm, chữ nhỏ nhất 11 điểm. Điện thoại dọc hiện lời nhắc xoay ngang.

**Trợ năng:** phím tắt B, L, J, M, N, 1–5, Q, W, E, R, Space, Esc; vùng có `aria-label`, cửa sổ có tiêu điểm bàn phím; tắt hoạt ảnh và bỏ giới hạn thời gian minigame khi bật `prefers-reduced-motion`.

**Âm thanh:** nhạc nền theo màn hình và địa điểm, dịu lại buổi tối; hiệu ứng cho thao tác và kết quả. Chỉ bật sau lần bấm đầu tiên; mỗi lần bấm, ngữ cảnh âm thanh bị tạm dừng sẽ được chạy lại; Safari đặt phiên âm thanh "playback" để nút gạt im lặng trên iPhone không chặn. Menu → Âm thanh chỉnh Nhạc nền, Hiệu ứng, Tắt tiếng (lưu ở khóa `ba-muoi-ngay-sg-audio`). Chi tiết: DESIGN_SPEC mục 6.

Tiến trình tự lưu vào `localStorage` (khóa `ba-muoi-ngay-sg-v6`) sau mỗi hành động. Bản lưu của v0.3.0 trở về trước không dùng được: trang bìa báo “Bản lưu cũ không dùng được với phiên bản mới. Hãy bắt đầu một tháng mới.” và bản cũ bị xóa khi bắt đầu tháng mới.
