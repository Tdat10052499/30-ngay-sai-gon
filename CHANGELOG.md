# Lịch sử phiên bản

Định dạng theo [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/), đánh số phiên bản theo [Semantic Versioning](https://semver.org/lang/vi/).

## [0.5.0] - 2026-10-23

Giao diện điện thoại làm lại và sáu loại hộp hội thoại, theo bản thiết kế `design/14-giao-dien-dien-thoai.html`. Kế hoạch và từng giai đoạn: `docs/PLAN-DIEN-THOAI.md`. Luật chơi, số liệu, lời thoại và hình vẽ cảnh không đổi.

### Thêm mới

- **Chơi được khi cầm dọc.** Game chọn một trong ba bố cục theo kích thước vùng nhìn thấy (`src/layout.js`), không dựa vào `(pointer:coarse)` vì trình duyệt trong Zalo, Messenger báo sai:
  - **dọc** (rộng ≤ 600, rộng < cao): cảnh 16:9 phủ bề ngang, có chip ngày và dải cảnh báo; bên dưới là bảng trạng thái (tiền, lương chờ, 4 thanh chỉ số, nhiệm vụ đang theo dõi), thẻ ăn, thẻ hành động xếp dọc; thanh công cụ ở đáy;
  - **ngang** (cao ≤ 500, rộng > cao): cảnh bên trái, cột điều khiển 330px bên phải;
  - **máy tính**: khung 16:9 như cũ.
- Xoay máy giữa chừng giữ nguyên hộp hội thoại, cửa sổ, menu, minigame và chữ đang hiện dần.
- Cảnh "phủ kín và giữ tâm": nhân vật luôn nằm giữa vùng cảnh, chạm vào cảnh đổi đúng tọa độ.
- **Thẻ ăn** trên điện thoại: 3 món đặt cạnh nhau (đồ trong túi, món tại chỗ), bấm là ăn ngay. Chỉ là giao diện, gọi lại hành động ăn sẵn có.
- **Cửa sổ dạng ngăn kéo** trên điện thoại: từ dưới lên khi cầm dọc (kéo xuống để đóng), từ bên phải khi nằm ngang (rộng 400px). Túi đồ lưới 4 cột, ô lịch từ 44px, dòng nhiệm vụ từ 52px, bản đồ chạm địa điểm thì hiện nút "Đi đến".
- **Sáu loại hộp hội thoại** (`src/dialog.js`):
  - `talk`, `choice`: hộp trượt lên có chân dung khung gỗ, bảng tên vàng; lựa chọn là nút to có giá và nhãn hiệu ứng, "Không đủ tiền" thì mờ đi;
  - `msg`: kiểu ứng dụng nhắn tin (tin nhắn của mẹ, Ngân, thùng đồ quê, tin nhắn trúng thưởng, bạn cùng quê);
  - `call`: cuộc gọi đến toàn màn hình (mẹ gọi ngày 18);
  - `alert`: hộp cảnh báo giữa màn hình, nút chính vàng có dòng phụ và nút "Để sau";
  - `think`: bong bóng tự nhủ cạnh nhân vật khi đói, kiệt sức, sắp ốm, buồn, phòng bừa; tự ẩn sau 3 giây, không chặn thao tác.
- Hộp hội thoại: viền theo màu chân dung người nói; chữ hiện dần khoảng 45 ký tự/giây, chạm để hiện hết; lựa chọn mờ dần hiện ra khi hết chữ; tiếng `message` cho `msg` và `call`, `warn` cho `alert`; `role="dialog"`/`alertdialog`, focus vào lựa chọn đầu, Esc chỉ đóng `talk` và `think`; tắt hiệu ứng khi máy bật giảm chuyển động. Máy tính giữ khung hội thoại cũ cho `talk` và `choice`.
- **Minigame toàn màn hình** trên điện thoại ở cả hai hướng, nút từ 48px, nút "Bỏ qua" ở góc trên phải trong vùng an toàn.
- Trang gỡ lỗi `?debug=layout` (viền các vùng, kích thước, vùng an toàn) và `?debug=dialog` (bật nhanh từng loại hộp, lời mẫu 400 ký tự).
- **Bộ kiểm tra giao diện** `npm run test:ui` (`tools/ui-test.js`, Playwright chromium, webkit, firefox × 9 kích thước): chụp ảnh và kiểm cuộn ngang, nút trong vùng an toàn, nút từ 44px, chữ từ 11px, hộp lời dài, lỗi console, xoay máy, số lần bấm, tạo nhân vật khi bàn phím mở, hành vi hộp hội thoại, bản đồ, ngăn kéo. `npm run serve` dùng máy chủ Node (`tools/serve.js`), không cần python. `tools/test.js` có 172 test.

### Thay đổi

- Bỏ màn hình nhắc xoay ngang và bố cục điện thoại nằm ngang của v0.4.0 (thay bằng bố cục ngang mới).
- Trên điện thoại, mọi kích thước tính bằng px cố định: nút từ 48px, thẻ hành động cao từ 60px, chữ nhỏ nhất 11px, lời thoại 15,5px (dọc) và 14,5px (ngang); chừa vùng an toàn bằng `env(safe-area-inset-*)`.
- Máy tính giữ nguyên bố cục và hình ảnh, nhưng chữ nhỏ nhất 11px và mọi nút từ 44×44px ở mọi cỡ cửa sổ. Thông báo nổi và menu nổi đặt ngay trên hàng thẻ; danh sách địa điểm trên bản đồ cuộn bên trong để nút "Đi đến" luôn hiện; nhãn ngày trong Lịch xuống dòng thay vì bị cắt.
- Một ngày thường ở bản dọc (đi học, ăn trưa, ngủ trưa, ca chiều, ăn tối, ca tối) mất 8 lần bấm.
- Số phiên bản trong đường dẫn script và CSS: `?v=0.5.0`.

### Sửa lỗi

- Màn tạo nhân vật trên máy nhỏ: luôn cuộn được tới nút "Tạo nhân vật"; khi bàn phím ảo mở, game không đổi bố cục giữa lúc bấm nên cú bấm không bị trượt.

## [0.4.0] - 2026-10-22

Bản chơi thử thứ 2 theo góp ý vòng 2: ít thao tác hơn, khó hơn và có chiều sâu hơn. Kế hoạch và từng giai đoạn: `docs/PLAN-BAN-THU-2.md`.

### Thêm mới

- **Thẻ hành động theo buổi** thay thanh lệnh: 3–5 thẻ gợi ý, bấm một thẻ là tự đi tới nơi, tự ăn nếu đói, làm việc rồi sang buổi sau (phím 1–5). Sáng ngày thường "Đi học" đứng đầu; thẻ nhiệm vụ đúng ngày luôn có mặt kể cả khi khóa; các thẻ khác ưu tiên việc bù chỉ số đang thấp. Thẻ "Tự chọn" mở các nhóm hành động như cũ. Một ngày thường (đi học, ăn trưa, ca chiều, ca tối) từ 15 lần bấm còn 5.
- **Chế độ ăn** trong Lịch: Tự nấu, Bình dân (mặc định), Thoải mái, Tự chọn bữa. Đầu mỗi buổi, độ no dưới 45 thì tự ăn theo bảng chế độ ăn × địa điểm, có thông báo ngắn và dòng nhật ký.
- **Độ khó** Thường và Dễ chọn ở màn tạo nhân vật. Thường: hao hụt tăng theo chương, đói và kiệt sức phạt nặng hơn, đi ngủ đói hồi ít năng lượng, vắng học −4 điểm và thầy Hải nhắc khi vắng 3 buổi một tuần, xác suất ốm tăng dần theo sức khỏe, "Kệ, ráng chịu" có thể còn ốm hôm sau, đội mưa có thể ốm hôm sau, thiếu tiền hóa đơn phạt theo số tiền thiếu, nhiệm vụ thất bại tinh thần −5, ngất xỉu nghỉ cả sáng hôm sau. Dễ giữ số của v0.3.0.
- **Ca trưa** ở cửa hàng mọi ngày: 90.000đ, năng lượng −30.
- **Điểm học tập vào công thức điểm**: 1000 × Tài sản^0,30 × No^0,15 × Tinh thần^0,20 × Sức khỏe^0,15 × Học tập^0,20. Màn tổng kết có thanh "Điểm học tập".
- **Hộp cảnh báo giữa màn hình** có nút làm ngay và "Để sau": tối ngày 4 tiền nhà, tối ngày 28 và sáng ngày 29 bài kiểm tra giữa kỳ, trưa ngày 29 và 30 quà sinh nhật mẹ, ngày cuối của nhiệm vụ chính còn đang làm.
- **Bộ bài sự kiện** (`src/events.js`): mỗi sự kiện có nơi, buổi, loại, số lần tối đa và thời gian chờ; mỗi ngày tối đa 1 sự kiện ngẫu nhiên, không cùng loại hai ngày liền, ngày 14–19 sự kiện bạn bè và chuyện vui ra nhiều hơn.
- **10 sự kiện mới**: tin nhắn trúng thưởng lừa đảo, nhặt được ví, thùng đồ quê của mẹ, tô canh của cô Tư, bạn cùng quê rủ đi ăn, hỏng sạc laptop, cúp điện (có thẻ "Ra quán cà phê"), khách để quên điện thoại, bài tập nhóm, Khoa rủ chạy bộ.
- **Nhân vật Ngân**, bạn cùng lớp: chân dung 48×48 (bình thường, vui), dáng đứng, nhắn tin rủ đi cà phê chiều ngày 11, 17, 24, cảnh ngồi bàn cà phê cùng Ngân, lời kết riêng khi đi đủ 2 lần.
- **Sinh nhật mẹ ở TTTM**: trưa ngày 30 mẹ lên Sài Gòn, có thể đưa mẹ đi ăn mừng (300.000đ) với cảnh và lời thoại riêng, thêm câu ở kết cục.
- **Minigame** (`src/minigames.js`): Thối tiền khi làm ca (3 khách, 25 giây, thưởng 0–20.000đ) và Canh lửa khi nấu cơm (3 bước, vùng xanh 25%). Lần đầu mỗi tuần, sau đó khoảng 1 trong 3 lần; có nút Bỏ qua; không giới hạn thời gian khi bật giảm chuyển động.
- Tờ tiền Việt Nam pixel 12×24 (`src/gfx/money.js`).
- Mô phỏng 4 bot (thêm "Chỉ lo làm ca"), 300 ván, cột phân vị 90 và tỉ lệ ván bị ốm; dòng Thận trọng ở độ khó Dễ. `tools/test.js` có 154 test.

### Thay đổi

- Mỗi lần bị phạt, nhật ký ghi rõ nguyên nhân và con số.
- Mưa khi đi lại còn 8%, chỉ buổi trưa hoặc chiều, tối đa 2 lần mỗi tháng, cách nhau ít nhất 5 ngày.
- Thiếu tiền nhà ngày 5 thì nhiệm vụ "Tiền nhà cho cô Tư" thất bại ngay.
- Túi đồ, Lịch, Nhiệm vụ, Bản đồ, Menu dời thành cột biểu tượng nhỏ.
- Điện thoại nằm ngang: thẻ xếp dọc bên phải, cột công cụ bên trái, nút chính từ 48×48 điểm, chữ nhỏ nhất 11 điểm.
- Khóa lưu đổi thành `ba-muoi-ngay-sg-v6`; bản lưu v0.3.0 không dùng được, trang bìa báo và game bắt đầu ván mới.

### Sửa lỗi

- Trên một số máy không nghe được âm thanh: đường dẫn script và CSS có số phiên bản (`?v=0.4.0`) để trình duyệt không dùng bản cũ trong bộ nhớ đệm; Safari đặt phiên âm thanh "playback" để nút gạt im lặng trên iPhone không chặn; mỗi lần bấm, ngữ cảnh âm thanh bị tạm dừng được chạy lại.

## [0.3.0] - 2026-10-21

Đồ họa và giao diện mới theo bộ thiết kế trong `design/` (đặc tả ở `docs/DESIGN_SPEC.md`), cùng các thay đổi luật đã chốt.

### Thêm mới

- **Tạo nhân vật**: chọn Nam hoặc Nữ, đặt tên từ 1 đến 12 ký tự. Tên người chơi thay cho "Minh" trong mọi lời thoại, nhiệm vụ, nhật ký và kết cục.
- **Màn mở đầu mới**: trang bìa cổng trường lúc hoàng hôn, màn tạo nhân vật, chuyển cảnh đêm → bình minh → thẻ Ngày 1 (có nút Bỏ qua).
- **Độ bừa bộn phòng** (0–100, 3 mức gọn gàng, hơi bừa, bừa bộn): tăng sau mỗi đêm, mỗi bữa ăn và lần nấu trong phòng, mỗi buổi ở phòng. Phòng bừa làm tinh thần giảm khi ở nhà và ngủ hồi ít năng lượng hơn; Dọn phòng giảm 50 và cho tinh thần +5/+8/+12 theo mức. Căn phòng vẽ đủ 3 mức.
- **Cảnh hành động**: lên lớp, kiểm tra giữa kỳ, thư viện, CLB, căng tin, phỏng vấn, làm ca, ăn ở quán, trà đá, ốc, ngồi cà phê, gặp Khoa có cảnh riêng.
- **Cảnh đổi theo tiến độ**: tờ tuyển dụng, poster đêm nhạc tuần 2, chồng sách thư viện, bài giảng theo tuần, chợ và TTTM đóng cửa, quán ốc chỉ mở tối, nhà thuốc sáng đèn khi ốm, quầy quà mẹ tuần 4.
- **Thẻ sang ngày** mỗi sáng (hôm qua, hôm nay, hóa đơn tự trừ, lương, hẹn) và **thẻ chương** có tranh minh họa.
- **Điện thoại trong game** ở phòng trọ: tin nhắn của mẹ, gọi xin thêm tiền, ví (số dư, lương chờ, hóa đơn sắp tới, giao dịch gần đây), đặt đồ ăn.
- Nhân vật chính đổi trang phục (ngày thường, cuối tuần, đồng phục) và biểu cảm (vui, buồn, mệt, đói, ốm), có bong bóng trạng thái; 7 chân dung có biểu cảm theo sự kiện.
- **Bố cục điện thoại nằm ngang**: chừa vùng an toàn, nút lớn từ 48×48 điểm theo hai ngón cái, menu thành ngăn bên phải; điện thoại dọc hiện lời nhắc xoay ngang.
- **Âm thanh** (`src/audio.js`, Web Audio, không cần file nhạc): 9 bản nhạc nền theo màn hình và địa điểm, đoạn bình minh ngày 1, nhạc dịu lại buổi tối, 17 hiệu ứng (bấm nút, mở và đóng cửa sổ, tiền vào ra, chỉ số tăng giảm, ăn, ngủ, sang ngày, nhiệm vụ, cảnh báo, tin nhắn, chữ hội thoại, cửa, máy tính tiền). Menu → Âm thanh có thanh Nhạc nền, Hiệu ứng và nút Tắt tiếng, lưu riêng khỏi bản lưu game. Âm thanh chỉ bật sau lần bấm đầu tiên.
- **2 sự kiện mới trong nhà**: "Quán hết chỗ" ở quán cà phê và "Mời làm thẻ thành viên" ở TTTM (buổi trưa đến tối, mỗi sự kiện 1 lần trong tháng).
- Bộ thiết kế `design/` (13 trang HTML tự chạy, gồm trang nghe thử âm thanh), bản WAV của nhạc nền trong `audio/` và đặc tả `docs/DESIGN_SPEC.md`.
- Test cố định `tools/test.js` chạy trong `npm test`; trình mô phỏng có bot "Ví trống ngày 5" kiểm tra việc cố tình để ví trống trước ngày đóng tiền nhà, cùng số liệu hạng, tiền cuối tháng, tinh thần trung bình, số lần dọn phòng.

### Thay đổi

- Đồ họa vẽ lại hoàn toàn ở lưới 320×180, giao diện ở lưới 640×360; mã vẽ tách ra `src/gfx/` (công cụ chung, nhân vật, chân dung, biểu tượng, từng cảnh).
- HUD mới gọn trong 5 cụm: thời gian và nơi đang đứng, tiền và nhiệm vụ, 4 chỉ số dạng cột, thanh lệnh gộp (phím 1–4), cảnh báo kèm nút làm ngay. Bấm một dòng trong menu là làm ngay.
- Cửa sổ mới: Bản đồ toàn màn hình (vị trí 8 địa điểm theo giá đi lại), Túi đồ, Lịch, Nhiệm vụ chung một khung có tab, hội thoại có chân dung và lời thoại hiện dần, tổng kết cuối tháng có đồ thị 30 ngày.
- **Thiếu tiền hóa đơn**: trừ hết tiền trong ví, tinh thần −12, không ghi nợ, không phạt. Lời cô Tư và kết cục đổi theo việc có thiếu tiền nhà ngày 5 hay không.
- Nhiệm vụ "Tự lập tài chính" và thành tựu cùng tên chỉ còn điều kiện không xin thêm tiền bố mẹ.
- Đồng phục cửa hàng chỉ mặc sau khi được nhận việc.
- Khóa lưu đổi thành `ba-muoi-ngay-sg-v5`; bản lưu v0.2.0 không dùng được, game bắt đầu ván mới.

### Sửa lỗi

- Sự kiện "Mưa to bất chợt" xảy ra cả khi đang ngồi trong quán cà phê hoặc TTTM. Nay chỉ xảy ra khi vừa đi tới nơi khác bằng bản đồ (buổi trưa hoặc chiều, 15%) hoặc khi đang ở công viên buổi trưa hoặc chiều, tối đa 1 lần mỗi ngày.
- Đã ăn, độ no trên 30 vẫn bị báo "Đi ngủ với cái bụng đói": game trừ độ no buổi tối và qua đêm rồi mới xét mức 35, nên phải còn khoảng 54 lúc đi ngủ. Nay xét độ no lúc chọn hành động cuối ngày, dưới 30 mới bị phạt, sau đó mới trừ độ no qua đêm. Dòng "Đi ngủ sớm" báo trước khi bụng đói.
- Nhiệm vụ "Không bỏ buổi học nào" thất bại vào tối ngày 12 mà không nói vắng ngày nào (kể cả khi buổi bị lỡ là nghỉ có phép vì ốm), khiến người chơi tưởng ngày 12 bị tính vắng. Nay thông báo ghi "(vắng ngày X)" và cửa sổ Nhiệm vụ hiện ngày vắng.

### Gỡ bỏ

- **Vay qua app** và trả nợ app.
- **Nợ hóa đơn** và phạt 10%; kiểu người chơi "Con nợ cuối tháng".
- Bố cục điện thoại dọc (thay bằng lời nhắc xoay ngang).

## [0.2.0] - 2026-10-20

Cập nhật theo góp ý của khách hàng: đổi bối cảnh sang tân sinh viên vừa học vừa làm thêm.

### Thay đổi

- Cốt truyện mới "Tháng đầu tiên của tân sinh viên": Minh 18 tuổi, học năm nhất, ở ghép phòng trọ với Khoa.
- Tiền đầu tháng là **tiền bố mẹ chu cấp** (3.000.000đ, gồm tiền nhà); **ngày 15 nhận lương part-time** kỳ 1.
- 4 chương mới: Tân sinh viên · Vừa học vừa làm · Lương part-time đầu tiên · Về đích.
- Nhân vật mới: thầy Hải (cố vấn học tập), chị Mai (quản lý cửa hàng), chị Linh (trưởng CLB); Khoa thành bạn cùng phòng.
- Công ty đổi thành **Trường đại học** (lên lớp, thư viện, CLB, căng tin); ngân hàng đổi thành **Cửa hàng tiện lợi** nơi làm part-time; cảnh pixel mới cho cả hai.
- Điểm thử việc đổi thành **điểm học tập**, chấm ở bài kiểm tra giữa kỳ sáng ngày 29.
- 14 nhiệm vụ chính mới, gồm Tìm việc làm thêm, Đêm nhạc chào tân sinh viên, Ôn bài ở thư viện, Tự lập tài chính, Quà sinh nhật mẹ.
- Sự kiện mới: tin nhắn của mẹ đầu tháng, mẹ gọi hỏi tiền ngày 18, lớp rủ đi lẩu, chị Mai khen.
- Chi phí cố định theo đời sống sinh viên: tiền nhà 1,2tr, điện nước 200k, giáo trình và quỹ lớp 300k.
- Cân bằng lại: ca part-time 90k (ca tối 110k), tài sản 2,5tr đạt điểm tối đa phần tiền.

### Gỡ bỏ

- **Tính năng gửi tiết kiệm** (game chỉ kéo dài một tháng nên không có tác dụng), cùng nhiệm vụ Quỹ khẩn cấp và thành tựu Tiết kiệm có kỷ luật.
- Tăng ca, thưởng chuyên cần đi làm, chuyển tiền về quê.

### Thêm mới

- Xin thêm tiền bố mẹ (+500k, ảnh hưởng nhiệm vụ Tự lập); vay app và trả nợ chuyển về phòng trọ (qua điện thoại).
- Đồng phục cửa hàng cho nhân vật khi đang ở chỗ làm.
- Bản chơi thử trên GitHub Pages, tự xuất bản khi push nhánh `main`.

## [0.1.0] - 2026-10-20

Bản chơi thử đầu tiên gửi khách hàng.

### Thêm mới

- Cốt truyện "Tháng thử việc của Minh": 4 chương, 6 nhân vật có chân dung pixel, hội thoại và thẻ giới thiệu chương.
- Hệ thống nhiệm vụ: 13 nhiệm vụ chính, 2 việc hằng ngày, điểm thử việc và khung theo dõi trên màn hình.
- Vòng lặp 30 ngày × 4 buổi; 4 chỉ số (độ no, năng lượng, tinh thần, sức khỏe) có ngưỡng nguy hiểm và lợi ích giảm dần.
- 8 địa điểm vẽ pixel, đổi cảnh theo sáng, trưa, chiều, tối; bản đồ khu phố có chi phí đi lại.
- Túi đồ 12 ô với 9 vật phẩm có hạn dùng và nơi dùng; lịch tháng dạng tờ lịch giấy; nhật ký.
- Kinh tế: lương theo ca trả 2 kỳ, hóa đơn cố định, tiết kiệm, vay app, ứng lương, đi bộ khi hết tiền.
- Sự kiện cốt truyện, sự kiện theo điều kiện và sự kiện ngẫu nhiên.
- Tổng kết cuối tháng: điểm theo công thức nhân, hạng S–D, kiểu người chơi, kết cục từng nhân vật, biểu đồ 30 ngày, 6 thành tựu.
- Giao diện gói trong một màn hình 16:9, bố cục dọc cho điện thoại, phím tắt, tự lưu tiến trình.
- Công cụ mô phỏng cân bằng `tools/simulate.js` và CI kiểm tra tự động.

[0.3.0]: https://github.com/Tdat10052499/30-ngay-sai-gon/releases/tag/v0.3.0
[0.2.0]: https://github.com/Tdat10052499/30-ngay-sai-gon/releases/tag/v0.2.0
[0.1.0]: https://github.com/Tdat10052499/30-ngay-sai-gon/releases/tag/v0.1.0
