# Kế hoạch bản chơi thử thứ 2 (v0.4.0)

Theo đề bài `CLAUDE-CODE-BAN-THU-2.md`. Làm trên nhánh `v0.3`. Mỗi việc xong thì đánh dấu `[x]` và commit. Cuối mỗi giai đoạn: `npm test`, chụp Playwright ở 1280×720 và 844×390, kiểm tra lỗi console, báo cáo rồi chờ duyệt. Hỏi trước mọi lần push, mở PR, tạo tag hoặc release.

## Quyết định đã chốt (mục 9)

| Câu hỏi | Trả lời |
| --- | --- |
| Sinh nhật mẹ ở TTTM | (a) Ngày 30 mẹ lên Sài Gòn, đi ăn mừng ở TTTM: thêm 300.000đ ngoài 300.000đ tiền quà, có lời thoại và cảnh |
| Tên nhân vật mới | Ngân |
| Trả giá ở chợ | Chưa làm ở bản này |
| Số phiên bản | v0.4.0 (v0.3.0 đã phát hành ngày 21/10/2026) |
| Độ khó mặc định | Thường |
| Nhánh | `v0.3` (đã cho tiến nhanh lên `main`) |

## Cách tổ chức code

- `src/game.js` giữ luật cốt lõi, HUD, cửa sổ.
- Mã mới tách thành script thường, nạp theo thứ tự trong `index.html` trước `game.js`, chỉ khai báo dữ liệu và hàm thuần:
  - `src/rules.js`: bảng độ khó (Thường, Dễ), hệ số chương, mức phạt, công thức điểm, xác suất ốm.
  - `src/cards.js`: hàm thuần `pickCards(s)` chọn thẻ hành động, bảng chế độ ăn, hàm `autoMeal(s)`.
  - `src/events.js`: bộ bài sự kiện (tags, loai, max, cooldown) và hàm rút sự kiện.
  - `src/minigames.js`: khung minigame, Thối tiền, Canh lửa.
  - `src/gfx/money.js`: tờ tiền pixel 12×24. Chân dung Ngân thêm vào `src/gfx/portraits.js`.
- `tools/harness.js` tự nạp các file mới theo `index.html`. `tools/test.js` thêm test cho từng phần.

---

## Giai đoạn 1: việc tồn đọng (mục 2)

Âm thanh, mưa, đi ngủ đói, vắng học ngày 12 đã làm ở v0.3.0 (commit `4792f66`, `743f7b2`, `1a5b104`, `bf91014`). Giai đoạn này chỉ kiểm tra lại và sửa phần âm thanh bạn báo chưa nghe được.

- [ ] **1.1 Kiểm tra lại 4 việc đã làm**
  - Sửa: không sửa gì.
  - Kiểm tra: `npm test` (27 test B1–B3), Playwright đo mức âm thanh ở đầu ra sau khi bấm "Bắt đầu câu chuyện".
  - Đạt: test đạt hết; đỉnh tín hiệu đầu ra lớn hơn 0,05.
- [ ] **1.2 Âm thanh chắc chắn phát được trên máy người chơi**
  - Sửa: `index.html`, `src/game.js` (không sửa `src/audio.js`).
  - Gắn số phiên bản vào đường dẫn mọi script và CSS (`?v=0.4.0`) để trình duyệt không dùng bản cũ trong bộ nhớ đệm.
  - Safari: đặt `navigator.audioSession.type='playback'` trước `GameAudio.init()` để nút gạt im lặng trên iPhone không chặn âm thanh.
  - Mỗi lần người chơi bấm, nếu `AudioContext` đang `suspended` hoặc `interrupted` thì gọi `resume()`.
  - Kiểm tra: Playwright; giả lập `AudioContext` bị tạm dừng rồi bấm một nút, trạng thái trở về `running`.
  - Đạt: không lỗi console; đường dẫn script có `?v=`; ngữ cảnh âm thanh tự chạy lại.

---

## Giai đoạn 2: luật chơi và cân bằng (mục 4, 4.5, dữ liệu và luật mục 5, mô phỏng mục 7). Chưa đụng giao diện.

- [ ] **2.1 Bảng độ khó và hệ số chương** (`src/rules.js`, `src/game.js`)
  - `s.diff` = `'thuong'` hoặc `'de'`, mặc định `'thuong'`, lưu trong bản lưu.
  - Hao hụt cuối buổi theo bảng dưới, nhân hệ số chương ×1,0 (chương 1), ×1,1 (chương 2), ×1,2 (chương 3–4) ở độ khó Thường.

  | Tình huống | Thường | Dễ (số v0.2.0) |
  | --- | --- | --- |
  | Hao hụt cuối buổi | No −11, tinh thần −3, năng lượng −5 (× hệ số chương) | No −9, tinh thần −2, năng lượng −4 |
  | Đói (no dưới 25) | Tinh thần −6, sức khỏe −3 | Tinh thần −4, sức khỏe −2 |
  | Đói lả (no về 0) | Sức khỏe −8, năng lượng −5 | Sức khỏe −4 |
  | Kiệt sức (năng lượng dưới 15) | Tinh thần −4, sức khỏe −3, lương ca còn một nửa | Tinh thần −3, sức khỏe −2, lương ca còn một nửa |
  | Tinh thần thấp (dưới 25) | Lương ca −30.000đ | Lương ca −20.000đ |
  | Đi ngủ đói (no dưới 30 lúc đi ngủ) | Năng lượng hồi 30, tinh thần −8, sức khỏe −4 | Năng lượng hồi 35, tinh thần −6, sức khỏe −2 |
  | Vắng học | Điểm học tập −4 mỗi buổi; vắng 3 buổi trong một tuần thì có sự kiện thầy Hải nhắc nhở, tinh thần −5 | Điểm học tập −2 mỗi buổi |
  | Bị ốm | Xác suất mỗi sáng theo sức khỏe (xem 2.3) | Như v0.2.0: 45% khi sức khỏe dưới 40 |
  | Kệ, ráng chịu (khi ốm) | Sức khỏe −10, tinh thần −8, năng lượng −15, 50% sáng hôm sau vẫn còn ốm | Sức khỏe −5, tinh thần −6, năng lượng −10 |
  | Đội mưa | Sức khỏe −12, tinh thần −6, năng lượng −6, thêm 25% khả năng ốm sáng hôm sau | Sức khỏe −6, tinh thần −4 |
  | Thiếu tiền hóa đơn | Trừ hết ví, tinh thần −12 và thêm −1 cho mỗi 50.000đ còn thiếu (tối đa −30); nhiệm vụ liên quan thất bại | Trừ hết ví, tinh thần −12 |
  | Nhiệm vụ chính thất bại | Mất phần thưởng, thêm tinh thần −5 | Mất phần thưởng |
  | Ngất xỉu | Viện phí 1.200.000đ; nghỉ cả buổi sáng hôm sau, có giấy xin nghỉ nên không tính vắng học | Viện phí 1.200.000đ |

  - Ghi chú: "Dễ" dùng số v0.2.0 nhưng vẫn giữ các sửa lỗi v0.3 (đi ngủ đói xét lúc chọn hành động, ngưỡng 30).
  - Kiểm tra: test cho từng dòng của bảng ở cả hai độ khó; test hệ số chương ngày 1, 8, 15, 22.
  - Đạt: mọi test đạt; độ khó Dễ cho ra đúng số của v0.2.0.
- [ ] **2.2 Công bằng: nhật ký ghi rõ nguyên nhân phạt** (`src/game.js`)
  - Mỗi lần bị phạt, nhật ký ghi một dòng, ví dụ “Đói: tinh thần −6, sức khỏe −3”, “Kiệt sức: tinh thần −4, sức khỏe −3”.
  - Kiểm tra: test đọc nhật ký sau một buổi đói và một buổi kiệt sức.
  - Đạt: mỗi mức phạt có đúng một dòng nhật ký nêu nguyên nhân và con số.
- [ ] **2.3 Ốm theo sức khỏe** (`src/rules.js`)
  - Xác suất mỗi sáng: `p = 0,02 + 0,43 × (100 − sk) / 60` khi sức khỏe từ 40 đến 100; 0,45 khi dưới 40. Cộng 0,25 sau khi đội mưa hôm trước; 0,5 nếu hôm trước chọn "Kệ, ráng chịu".
  - Kiểm tra: test hàm thuần `sickChance(s)` ở sức khỏe 100, 70, 40, 20 và sau mưa.
  - Đạt: 0,02 / 0,235 / 0,45 / 0,45, cộng thêm đúng.
- [ ] **2.4 Thiếu tiền hóa đơn tăng theo số tiền thiếu, nhiệm vụ thất bại thêm −5, ngất xỉu nghỉ sáng hôm sau** (`src/game.js`)
  - Kiểm tra: test thiếu 49.000đ (−12), thiếu 220.000đ (−16), thiếu 1.200.000đ (−30); test nhiệm vụ thất bại; test ngất xỉu rồi sáng hôm sau không bị tính vắng.
  - Đạt: đúng số, `absences` không tăng sau ngất xỉu.
- [ ] **2.5 Vắng 3 buổi trong một tuần thì thầy Hải nhắc nhở** (`src/game.js`)
  - Dùng `s.absentDays` (chỉ tính vắng không phép).
  - Văn bản đề xuất (chờ duyệt): tiêu đề “Thầy Hải nhắc nhở”, lời thoại “Tuần này em vắng ba buổi rồi. Học năm nhất mà hổng kịp là khó theo lắm, em cố lên lớp đều nha.”, lựa chọn “Dạ, em sẽ cố”, tinh thần −5.
  - Kiểm tra: test vắng 3 sáng trong ngày 8–12 thì có sự kiện đúng một lần.
- [ ] **2.6 Ca part-time buổi trưa** (`src/game.js`)
  - `canShift` mở ca trưa mọi ngày; lương 90.000đ; năng lượng −30, tinh thần và độ no như ca thường. Cập nhật luật chơi trong game và cảnh làm ca (dùng cửa sổ buổi trưa).
  - Kiểm tra: test làm ca trưa ngày thường và cuối tuần, lương và hao tổn đúng.
- [ ] **2.7 Điểm học tập vào công thức điểm** (`src/game.js`)
  - Điểm = 1000 × Tài sản^0,30 × No^0,15 × Tinh thần^0,20 × Sức khỏe^0,15 × Học tập^0,20; Học tập = điểm học tập / 100, tối thiểu 0,05.
  - Kiểm tra: test `computeScore` với số liệu mẫu tính tay.
  - Màn tổng kết (thanh thứ 5) để giai đoạn 3 vì là giao diện.
- [ ] **2.8 Mưa: tối đa 2 lần mỗi tháng, cách nhau ít nhất 5 ngày; khi di chuyển 8%, chỉ trưa hoặc chiều; vẫn ở công viên trưa hoặc chiều** (`src/events.js`, `src/game.js`)
  - Kiểm tra: test lần 3 không xảy ra; test lần 2 trong vòng 5 ngày không xảy ra.
- [ ] **2.9 Bộ bài sự kiện** (`src/events.js`)
  - Mỗi sự kiện ngẫu nhiên có `tags` (nơi, buổi), `loai`, `max`, `cooldown`. Mỗi ngày tối đa 1 sự kiện ngẫu nhiên; không cùng `loai` hai ngày liên tiếp. Sự kiện cốt truyện và sự kiện theo điều kiện (ốm, đau bụng, ngất xỉu) không bị giới hạn.
  - Gán thuộc tính cho các sự kiện cũ (lẩu, xe chết máy, nhặt tiền, chị Mai khen, mưa, Khoa mượn tiền, rơi điện thoại, sinh nhật bạn, quán hết chỗ, mời làm thẻ).
  - Ngày 14 đến 19: sự kiện bạn bè và chuyện vui có trọng số ×2.
  - Kiểm tra: mô phỏng 300 ván, đếm mỗi ngày không quá 1 sự kiện ngẫu nhiên, không có 2 ngày liền cùng loại, không vượt `max`.
- [ ] **2.10 Luật của 10 sự kiện mới (mục 5.2)** (`src/events.js`, `src/game.js`)
  - `scam`, `wallet`, `homebox`, `tufood`, `friendhome`, `charger` (khóa thư viện 2 ngày), `blackout` (khóa lướt mạng buổi đó), `lostitem` (khi đang làm ca), `groupwork` (+2 điểm học tập mỗi buổi thư viện ở 2 buổi tiếp theo), `khoapark` (tối đa 3 lần).
  - Văn bản chưa có trong đề bài sẽ viết ngắn và đưa vào báo cáo để duyệt (ví dụ thông báo sau khi chuyển tiền lừa đảo, lời cô Tư, lời Khoa).
  - Kiểm tra: test từng sự kiện: điều kiện xuất hiện, hiệu ứng, khóa thư viện và lướt mạng đúng thời hạn, túi không quá 12 ô.
- [ ] **2.11 Lời mời của Ngân (luật)** (`src/game.js`)
  - Chiều ngày 11, 17, 24 có lời mời. "Đi cà phê với Ngân": đi tới quán cà phê, −30.000đ, tinh thần +12, năng lượng +4, hết buổi. "Hẹn lần sau": tinh thần −2. Đi đủ 2 lần thì có lời kết “Ngân rủ [tên] cùng làm bài tập nhóm học kỳ sau.”
  - Kiểm tra: test ba ngày mời và lời kết.
- [ ] **2.12 Sinh nhật mẹ ở TTTM (luật)** (`src/game.js`)
  - Ngày 30 mẹ lên Sài Gòn. Thêm lựa chọn đưa mẹ đi ăn mừng ở TTTM, 300.000đ ngoài tiền quà. Lời thoại và cảnh làm ở giai đoạn 4.
  - Câu hỏi thêm: ăn mừng có phải là điều kiện để hoàn thành nhiệm vụ "Quà sinh nhật mẹ" không? Đề xuất: nhiệm vụ vẫn chỉ cần mua quà; ăn mừng là lựa chọn thêm, cho tinh thần và lời kết riêng.
- [ ] **2.13 Mô phỏng** (`tools/simulate.js`, `tools/test.js`)
  - Bot dùng hàm chọn thẻ và chế độ ăn như người chơi (hàm thuần làm ở giai đoạn 3 được viết trước ở đây, chưa có giao diện).
  - 4 bot:
    - Thận trọng: ăn Bình dân, đi học đủ, làm ca vừa phải, dọn phòng khi bừa bộn từ 60.
    - Ngẫu nhiên: giữ như cũ.
    - Chỉ lo làm ca: lấy mọi ca kể cả ca trưa và ca tối, ăn Bình dân.
    - Ví trống trước ngày 5.
  - Thêm cột: điểm phân vị 90, tỉ lệ ván bị ốm ít nhất một lần.
  - Minigame dùng kết quả trung bình.
- [ ] **2.14 Chỉnh số cho đạt mục tiêu (300 ván mỗi bot, độ khó Thường)**
  - Thận trọng: điểm trung vị 700–780, 10–11/14 nhiệm vụ, 10% ván tốt nhất đạt S, ít nhất 15% ván bị ốm ít nhất một lần.
  - Ngẫu nhiên: điểm trung vị dưới 250.
  - Chỉ lo làm ca: không quá hạng B.
  - Ví trống trước ngày 5: thấp hơn Thận trọng ít nhất 100 điểm.
  - Độ khó Dễ: Thận trọng có điểm trung vị khoảng 800 trở lên.
  - Chỉ chỉnh các con số ở mục 4 (xác suất, hệ số chương, mức phạt). Báo bảng trước và sau cùng những số đã chỉnh.

---

## Giai đoạn 3: thẻ hành động, chế độ ăn, cảnh báo bật lên, chọn độ khó (mục 3, 4.2)

- [ ] **3.1 Hàm thuần `pickCards(s)`** (`src/cards.js`)
  - Trả 3 đến 5 thẻ cho buổi hiện tại; thẻ cuối luôn là "Tự chọn".
  - Sáng ngày thường: "Đi học" đứng đầu và được tô nổi; ngày 29 là "Đi thi giữa kỳ".
  - Thẻ nhiệm vụ đúng ngày được ưu tiên (ví dụ "Cà phê với Khoa" chiều ngày 20, 21; "Mua quà sinh nhật mẹ"; lời mời của Ngân), kể cả khi đang khóa (hiện lý do).
  - Các thẻ còn lại: việc làm được ở mọi nơi trong buổi đó, ưu tiên việc giúp chỉ số đang thấp nhất (năng lượng thấp → "Ngủ một giấc"; phòng bừa → "Dọn phòng"; tinh thần thấp → việc thư giãn; sức khỏe thấp → chạy bộ hoặc nghỉ). Không gợi ý việc bị khóa vì giờ mở cửa.
  - Mỗi thẻ có: tên việc, nơi diễn ra và tiền đi lại, nhãn hiệu ứng chính theo màu chỉ số, cái giá (tiền, chỉ số giảm), dấu chấm than nếu gắn nhiệm vụ, lý do khóa, nhãn cảnh báo nếu sau hành động một chỉ số xuống dưới 25.
  - Kiểm tra: test cho sáng ngày thường, ngày 29, chiều ngày 20, năng lượng thấp, phòng bừa, buổi tối.
- [ ] **3.2 Thanh thẻ thay thanh lệnh** (`index.html`, `src/style.css`, `src/game.js`)
  - Bấm một thẻ là làm trọn: tự đi tới nơi (trừ tiền đi lại, hết tiền thì đi bộ với năng lượng −8, tinh thần −2), làm hành động, chạy cảnh hành động 1 đến 2 giây không cần bấm, rồi sang buổi sau. Phím 1 đến 5 chọn thẻ.
  - "Tự chọn" mở menu đầy đủ hiện có (bản đồ, các nhóm hành động).
  - Túi đồ, Lịch, Nhiệm vụ, Bản đồ, Menu dời lên một cột biểu tượng nhỏ ở góc phải.
  - Kiểm tra: Playwright bấm thẻ "Đi học" từ phòng trọ, kiểm tra đã ở trường, `classToday`=1, sang buổi trưa, trừ 6.000đ.
- [ ] **3.3 Chế độ ăn** (`src/cards.js`, `src/game.js`, `src/style.css`)
  - Trong khung lịch có ô chọn Chế độ ăn: Tự nấu, Bình dân (mặc định), Thoải mái, Tự chọn bữa; cạnh đó là ước tính tiền ăn mỗi ngày.
  - Đầu mỗi buổi, nếu độ no dưới 45 và buổi đó chưa ăn thì tự ăn theo bảng dưới, hiện thông báo ngắn (ví dụ “Ăn cơm căng tin: −25.000đ, no +33”) và ghi nhật ký.
  - **Bảng chế độ ăn × địa điểm (chờ duyệt):** "đồ trong túi" là đồ ăn trong túi dùng được ở nơi đó, ưu tiên món sắp hỏng nhất.

  | Nơi | Tự nấu | Bình dân | Thoải mái |
  | --- | --- | --- | --- |
  | Phòng trọ | Nấu nguyên liệu trong túi: no +36, sức khỏe +3, tinh thần +3, năng lượng −3. Không có nguyên liệu thì như Bình dân | Đồ trong túi (trừ mì gói); nếu không có thì mì gói trong túi (no +24, tinh thần −2, sức khỏe −4); nếu không có gì thì đặt đồ ăn 68.000đ (no +40, tinh thần +5) | Đặt đồ ăn 68.000đ |
  | Quán ăn | Như Bình dân | Đồ trong túi; nếu không có thì cơm tấm 40.000đ (no +35, tinh thần +4) | Bún bò 75.000đ (no +45, tinh thần +9) |
  | Chợ | Như Bình dân | Đồ trong túi; nếu không có thì mua trái cây 25.000đ và ăn (no +12, sức khỏe +5, tinh thần +2) | Như Bình dân |
  | Công viên | Như Bình dân | Đồ trong túi; nếu không có thì bắp xào 15.000đ (no +12, tinh thần +2) | Như Bình dân |
  | Quán cà phê | Như Bình dân | Đồ trong túi; nếu không có thì mua bánh ngọt 30.000đ và ăn (no +15, tinh thần +6) | Như Bình dân |
  | Trường (buổi trưa) | Như Bình dân | Cơm căng tin 25.000đ (no +33, tinh thần +1); buổi khác thì đồ trong túi | Như Bình dân |
  | Cửa hàng tiện lợi | Như Bình dân | Đồ trong túi (trừ mì gói); nếu không có thì cơm hộp 30.000đ (no +30, tinh thần +1) | Cơm hộp 30.000đ |
  | TTTM | Như Bình dân | Đồ trong túi; nếu không có thì không tự ăn (chỉ có buffet 199.000đ) | Buffet lẩu 199.000đ (no +50, tinh thần +15, sức khỏe −1) |

  - Câu hỏi: Bình dân có nên tránh mì gói (rẻ nhất nhưng hại sức khỏe) như bảng trên không?
  - Ước tính tiền ăn mỗi ngày hiện cạnh ô chọn (3 bữa): Tự nấu khoảng 32.000đ, Bình dân khoảng 95.000đ, Thoải mái khoảng 190.000đ. Số này tính lại theo mô phỏng.
  - Kiểm tra: test `autoMeal(s)` cho từng ô của bảng; test không tự ăn khi độ no từ 45 hoặc đã ăn; test chế độ Tự chọn bữa.
- [ ] **3.4 Đếm số lần bấm** (`tools/test.js` hoặc Playwright)
  - Kịch bản một ngày thường (đi học, ăn trưa, làm ca chiều, làm ca tối), đếm mọi lần bấm, kể cả bấm đóng thông báo.
  - Đạt: không quá 6 lần bấm. Báo số lần bấm trung bình mỗi ngày trước khi sửa (bản v0.3.0) và sau khi sửa.
- [ ] **3.5 Cảnh báo bật lên** (`src/game.js`, `src/style.css`)
  - Hộp giữa màn hình có nút hành động nhanh và nút "Để sau", phát `warn`, mỗi cảnh báo chỉ một lần:
    - Tối ngày 4: “Sáng mai cô Tư thu tiền nhà 1.200.000đ.” kèm số dư ví hiện tại.
    - Tối ngày 28 và sáng ngày 29: “Sáng nay là bài kiểm tra giữa kỳ. Vắng là không có điểm.” Nút "Đi thi ngay" (tới trường và làm bài luôn). Ghi chú: tối ngày 28 câu "Sáng nay" chưa đúng, đề xuất dùng “Sáng mai là bài kiểm tra giữa kỳ. Vắng là không có điểm.” cho tối ngày 28 (chờ duyệt).
    - Sáng ngày 29 và ngày 30: nhắc nhiệm vụ sinh nhật mẹ nếu chưa xong, nút "Đi TTTM".
    - Ngày cuối của mọi nhiệm vụ chính còn đang làm: đề xuất “Hôm nay là hạn cuối của nhiệm vụ “[tên]”.” kèm gợi ý cách làm và nút đi tới nơi cần đến nếu có (chờ duyệt).
  - Kiểm tra: test thời điểm hiện và chỉ hiện một lần; Playwright chụp hộp cảnh báo.
- [ ] **3.6 Chọn độ khó ở màn tạo nhân vật** (`index.html`, `src/game.js`, `src/style.css`)
  - Hai lựa chọn Thường (mặc định) và Dễ; lưu vào bản lưu; hiện ở menu Luật chơi.
  - Văn bản đề xuất: “Thường: hao hụt và hình phạt tăng dần theo chương.” “Dễ: nhẹ nhàng, hợp để làm quen.”
- [ ] **3.7 Màn tổng kết có thanh "Điểm học tập"** cạnh 4 thanh cũ, ghi số mũ; cập nhật công thức hiển thị.

---

## Giai đoạn 4: nhân vật Ngân và giao diện sự kiện mới (mục 5.3, 5.2)

- [ ] **4.1 Chân dung Ngân 48×48** (`src/gfx/portraits.js`)
  - Theo phong cách chân dung hiện có: tóc ngắn ngang vai, kính tròn, áo cardigan vàng nhạt, màu nền riêng chưa trùng với ai; biểu cảm bình thường và vui.
  - Kiểm tra: ảnh ghép 8 chân dung để so phong cách.
- [ ] **4.2 Hội thoại lời mời của Ngân** qua tin nhắn điện thoại (khung điện thoại như tin nhắn của mẹ)
  - Văn bản đề xuất (chờ duyệt):
    - Ngày 11: “Chiều nay rảnh hông? Mình ra quán cà phê ngồi vẽ phác thảo nha.”
    - Ngày 17: “Tuần này mệt quá trời. Đi cà phê với mình một chút cho đỡ ngán nha?”
    - Ngày 24: “Sắp thi rồi, ra quán ngồi ôn với vẽ chung hông?”
  - Cảnh cà phê dùng biến thể ngồi bàn có thêm Ngân.
- [ ] **4.3 Giao diện 10 sự kiện mới:** người nói và biểu cảm; thẻ gợi ý "Ra quán cà phê" khi cúp điện; thông báo sau khi chuyển tiền lừa đảo.
- [ ] **4.4 Sinh nhật mẹ ở TTTM:** lời thoại và cảnh (mẹ cùng nhân vật ở TTTM). Văn bản viết nháp, đưa vào báo cáo để duyệt.

---

## Giai đoạn 5: minigame (mục 6)

- [ ] **5.1 Khung minigame** (`src/minigames.js`, `src/style.css`)
  - Tiêu đề, hướng dẫn một dòng, đồng hồ đếm ngược, nút "Bỏ qua" (nhận kết quả trung bình). Dùng được chuột, phím, cảm ứng. Bật giảm chuyển động thì không giới hạn thời gian.
  - Tần suất: lần đầu mỗi tuần cho mỗi loại, sau đó khoảng 1 trong 3 lần; còn lại tự tính kết quả trung bình.
  - Mô phỏng dùng kết quả trung bình, không chạy minigame.
- [ ] **5.2 Tờ tiền pixel 12×24** (`src/gfx/money.js`): 1.000 đến 200.000đ theo màu tờ tiền thật, không chép hình in.
- [ ] **5.3 Thối tiền** khi làm ca:
  - 3 khách, mỗi khách có các món, tổng tiền, tiền khách đưa; bấm tờ tiền để thối, nút "Xóa" và "Đưa tiền"; 25 giây cho cả 3 khách.
  - Kết quả: đúng 3 thì thưởng 20.000đ, tinh thần +3, chị Mai khen; đúng 2 thì thưởng 10.000đ; đúng 0 hoặc 1 thì tinh thần −2; bỏ qua thì thưởng 10.000đ.
  - Kiểm tra: test hàm chấm điểm; Playwright chơi đúng cả 3 khách.
- [ ] **5.4 Canh lửa** khi nấu cơm ở phòng trọ:
  - 3 bước (xào rau, chiên trứng, nêm nếm); vạch chạy qua lại, bấm để dừng; vùng xanh khoảng 25%.
  - Kết quả: trúng 3 thì tinh thần +3, no +4 cộng thêm; trúng 1 hoặc 2 thì không cộng; trúng 0 thì món bị khét, có dòng nhật ký vui (văn bản đề xuất: “Món trứng hơi khét, nhưng vẫn ăn hết sạch.”); bỏ qua thì không cộng.

---

## Giai đoạn 6: điện thoại nằm ngang

- [ ] **6.1 Thẻ hành động** xếp dọc bên phải, mỗi thẻ cao ít nhất 52 điểm; cột công cụ sang trái; giữ vùng an toàn như `design/12` thẻ 4.
- [ ] **6.2 Minigame và hộp cảnh báo** vừa màn hình 844×390, nút từ 48×48 điểm.
- [ ] **6.3 Chụp kiểm tra** ở 844×390 và 1280×720, đo kích thước nút và chữ nhỏ nhất (11 điểm).

---

## Giai đoạn 7: tài liệu và phát hành

- [ ] **7.1** Cập nhật `docs/GAME_DESIGN.md`, `docs/DESIGN_SPEC.md`, README, CHANGELOG mục `[0.4.0]`; `package.json` lên 0.4.0.
- [ ] **7.2** Tăng khóa lưu lên `ba-muoi-ngay-sg-v6`; bản lưu cũ bắt đầu ván mới, có thông báo. Văn bản đề xuất: “Bản lưu cũ không dùng được với phiên bản mới. Hãy bắt đầu một tháng mới.”
- [ ] **7.3** Hỏi rồi mở pull request `v0.3` → `main`.
- [ ] **7.4** Sau khi merge: kiểm tra trang Pages (có âm thanh, không lỗi console) và báo link để gửi anh Đạt. Hỏi trước khi tạo tag và release v0.4.0.

---

## Cần duyệt trước khi làm

1. Bảng chế độ ăn × địa điểm ở 3.3, gồm việc Bình dân tránh mì gói.
2. Nhiệm vụ "Quà sinh nhật mẹ" có cần ăn mừng ở TTTM mới hoàn thành không (2.12).
3. Câu cảnh báo tối ngày 28 dùng "Sáng mai" thay "Sáng nay" (3.5).
4. Các văn bản đề xuất có ghi "chờ duyệt" ở trên. Văn bản của các sự kiện mới và sinh nhật mẹ sẽ gửi kèm báo cáo từng giai đoạn.
