# Lịch sử phiên bản

Định dạng theo [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/), đánh số phiên bản theo [Semantic Versioning](https://semver.org/lang/vi/).

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
