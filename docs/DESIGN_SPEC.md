# 30 Ngày Sài Gòn · Đặc tả thiết kế (v0.3, bổ sung v0.4.0 và v0.5.0)

Tài liệu này mô tả bộ thiết kế trong thư mục `design/` và các thay đổi luật chơi đã chốt sau v0.2.0. Mỗi file trong `design/` là một trang HTML tự chạy (mở bằng trình duyệt), có mã vẽ canvas dùng được làm nguồn khi đưa vào game.

## 1. Quy tắc hình ảnh

| Hạng mục | Quy tắc |
| --- | --- |
| Lưới cảnh | 320×180 điểm ảnh, phóng to nguyên lần, `image-rendering: pixelated`, không làm mịn |
| Lưới giao diện | 640×360 (mỗi điểm ảnh cảnh = 2×2 điểm ảnh giao diện). CSS: `--p: calc(100cqw / 640)` trong khung 16:9 có `container-type: size` |
| Nhân vật | Chibi, đầu to bằng khoảng một phần ba thân, khung 30×54. Viền màu tối tự sinh từ màu mảng kề bên (hàm `outlined`), không dùng viền đen. Mỗi mảng 3 tông |
| Chân dung | 48×48, phóng to đúng 2 lần trong khung gỗ |
| Biểu tượng | 12×12, có viền tối, phóng to 1, 2 hoặc 3 lần |
| Ánh sáng | Nắng chiếu từ bên trái ở mọi cảnh ngoài trời |
| Buổi trong ngày | Một cảnh gốc, đổi sáng, trưa, chiều, tối bằng phủ màu theo kênh (hàm `grade`), đèn và cửa sổ vẽ sau khi phủ màu |
| Chữ | Be Vietnam Pro cho chữ, VT323 cho số. Chữ trong cảnh dùng font pixel 3×5 có dấu tiếng Việt (hàm `text`) |
| Dấu câu | Dấu nháy cong “ ” và ’ trong mọi chữ người chơi đọc |

## 2. Bảng màu

| Vai trò | Mã |
| --- | --- |
| Nền màn hình | #0B0C16 |
| Khung giao diện: viền ngoài, nền, cạnh sáng, cạnh tối, đường trong, giếng | #0B0C16, #1F2440, #4A5390, #121527, #2C335C, #151933 |
| Nhấn chính (đèn lồng), nhấn phụ (san hô) | #FFC94D, #FF7A59 |
| Chữ, chữ phụ | #EFE9DB, #A4A9C8 |
| Chỉ số: no, năng lượng, tinh thần, sức khỏe | #F5A742, #5CC8FF, #FF86B3, #72DE90 |
| Tốt, xấu | #72DE90, #FF6474 |
| Trường: tường, lam | #EFE2D4, #F07A2E |
| Cửa hàng: thương hiệu | #3F9A5A, #2F7A46, #6ACA8A |
| Nhân vật chính: áo ngày thường, áo cuối tuần, đồng phục, ba lô, quần và váy | #4F7FD0, #FF7A59, #3F9A5A, #E6AA2C, #33405E |

## 3. Danh sách thiết kế

| File | Màn hình | Đưa vào game |
| --- | --- | --- |
| 01-trang-bia | Trang bìa: nhân vật quay lưng trước cổng trường lúc hoàng hôn, sinh viên trong sân | Thay màn tiêu đề |
| 02-dat-ten-nhan-vat | Tạo nhân vật: chân dung, chọn Nam/Nữ, nhập tên (1 đến 12 ký tự, chữ cái và khoảng trắng), nút Tạo nhân vật | Màn mới sau "Bắt đầu câu chuyện" |
| 03-bat-dau-ngay-1 | Chuyển cảnh đêm → bình minh → mặt trời mọc → thẻ Ngày 1, có nút Bỏ qua | Màn mới sau tạo nhân vật |
| 04-phong-tro-giao-dien | Phòng trọ, bộ HUD mới, menu hành động, 3 mức độ bừa bộn | Cảnh `home` và toàn bộ HUD |
| 05-truong-dai-hoc | Sân trường và 4 cảnh hành động: giảng đường (có bản thi ngày 29), thư viện (chồng sách theo số buổi), phòng CLB (poster đêm nhạc tuần 2), căng tin | Cảnh `school`, mỗi hành động mở cảnh riêng |
| 06-cua-hang-tien-loi | Gian hàng (3 trạng thái: chưa phỏng vấn, đang phỏng vấn, đã nhận việc) và cảnh sau quầy khi làm ca (lịch ca có tên gọi người chơi) | Cảnh `store` |
| 07-quan-an-va-cho | Phố ăn uống (quán ốc chỉ mở tối), cảnh ngồi ăn 5 món, chợ (đóng cửa buổi tối, nhà thuốc sáng khi ốm) | Cảnh `street`, `market` |
| 08-ca-phe-cong-vien-tttm | Quầy cà phê, ngồi bàn (3 hoạt động), công viên bờ kênh (4 buổi), TTTM (chưa mở buổi sáng, tuần 4, giày sale) | Cảnh `cafe`, `park`, `mall` |
| 09-ban-do-khu-pho | Bản đồ 8 địa điểm, nơi miễn phí gần phòng trọ, nơi tốn tiền xa dần theo giá | Cửa sổ Bản đồ |
| 10-hoi-thoai-chan-dung | Khung hội thoại và 7 chân dung có biểu cảm | Cửa sổ sự kiện |
| 11-tui-do-lich-nhiem-vu | Cửa sổ Túi đồ, Lịch, Nhiệm vụ; 9 biểu tượng vật phẩm | Thay 3 cửa sổ hiện tại |
| 12-hoan-thien-giao-dien | Tổng kết cuối tháng, thẻ chương, thẻ sang ngày, biến thể nhân vật, bố cục điện thoại cũ (đã thay bằng phương án A/B ở mục 9), điện thoại trong game | Màn kết thúc, thẻ, nhân vật, CSS di động, cửa sổ điện thoại |
| 13-nhac-nen-va-am-thanh | Trang nghe thử 9 bản nhạc nền, đoạn bình minh, 17 hiệu ứng; có thanh âm lượng, tắt tiếng, chế độ buổi tối | Dùng `src/audio.js` có sẵn trong gói |
| 14-giao-dien-dien-thoai | Ba phương án bố cục điện thoại (đã chọn A dọc, B ngang) và sáu loại hộp hội thoại, mỗi loại có bản dọc và bản ngang | Bố cục điện thoại, `src/dialog.js` (mục 9) |

Mã vẽ trong các file trùng nhau một phần (ví dụ hàm `outlined`, `canopy`, font pixel, nhân vật). Khi đưa vào game nên gom về một chỗ, không chép lặp.

## 4. Thay đổi luật chơi đã chốt

1. **Bỏ vay qua app.** Xóa `loan`, `repay`, `loanCount`. Nhiệm vụ `q3_indep`: "Không xin thêm tiền bố mẹ trong cả tháng." Thành tựu Tự lập tài chính: `askCount === 0`.
2. **Bỏ nợ.** Khi ví không đủ tiền vào ngày tự trừ hóa đơn: trừ hết tiền trong ví, tinh thần −12, không ghi nợ, không phạt 10%. Bỏ `s.debt` khỏi tài sản, kiểu người chơi, kết cục và thành tựu. Bỏ kiểu người chơi "Con nợ cuối tháng". Lời cô Tư theo cờ thiếu tiền nhà ngày 5: "Tháng này thiếu tiền nhà. Cô Tư nhắc khéo: tháng sau nhớ để dành đủ trước mùng 5."
3. **Tên và giới tính.** Lưu `s.name`, `s.gender`. Thay mọi chỗ ghi cứng "Minh" bằng tên người chơi. Lời thoại hiện tại dùng xưng hô trung tính (con, em, mày, tao), không cần đổi theo giới tính.
4. **Đồng phục** chỉ mặc khi `s.loc === 'store' && s.flags.hired`. Áo cam cuối tuần, áo xanh ngày thường.
5. **Độ bừa bộn phòng** (chỉ số ẩn 0 đến 100, 3 mức): tăng +10 mỗi đêm, +6 mỗi bữa ăn trong phòng, +4 mỗi lần nấu, +2 mỗi buổi ở phòng. Dọn phòng −50. Ảnh hưởng: gọn gàng (0–33) sáng hôm sau tinh thần +2; hơi bừa (34–66) mỗi buổi ở phòng tinh thần −1; bừa bộn (67–100) mỗi buổi ở phòng tinh thần −2, ngủ hồi 40 năng lượng thay vì 50. Dọn phòng cho tinh thần +5, +8, +12 theo mức trước khi dọn.
6. **Bản đồ mới**: vị trí 8 địa điểm theo file 09. Giá đi lại giữ nguyên (cà phê 5K, trường 6K, TTTM 12K, còn lại miễn phí).
7. **Khóa lưu** tăng lên `ba-muoi-ngay-sg-v5` (v0.4.0: `ba-muoi-ngay-sg-v6`, xem mục 8).

## 5. Quyết định còn chờ (đã chốt ở v0.3.0)

| Câu hỏi | Mặc định nếu chưa có trả lời | Đã chốt |
| --- | --- | --- |
| Mức phạt khi thiếu tiền hóa đơn có tăng theo số tiền thiếu không (đề xuất: −12, thêm −1 cho mỗi 50.000đ thiếu, tối đa −30)? | Giữ −12, nhưng báo kết quả mô phỏng việc cố tình để ví trống trước ngày 5 | Giữ −12. Bot ví trống ngày 5 chỉ được 445 điểm so với 817 của bot thận trọng (GAME_DESIGN mục 9) |
| Đồng phục nữ ở cửa hàng: váy hay quần? | Váy | Váy |
| Số liệu độ bừa bộn | Dùng số ở mục 4, chạy mô phỏng rồi báo lại | Dùng số ở mục 4; bot thận trọng dọn phòng khoảng 3 ngày một lần, điểm không đổi |
| Sự kiện ngẫu nhiên khi phòng bừa bộn (gián, Khoa than phiền) | Chưa làm | Chưa làm |

## 6. Âm thanh

- **File có sẵn:** `src/audio.js` (JavaScript thuần, Web Audio, không cần file nhạc). Cung cấp `window.GameAudio` với `init()`, `play(id)`, `stop()`, `sting('dawn')`, `sfx(name)`, `setVolume('music'|'sfx', 0..1)`, `setMuted(bool)`, `setNight(bool)`.
- **Bản nhạc theo cảnh:** `title` (trang bìa, tạo nhân vật), `home`, `school`, `store`, `street` (quán ăn và chợ), `cafe`, `park`, `mall`, `summary` (tổng kết). Đoạn ngắn `dawn` cho chuyển cảnh ngày 1.
- **Hiệu ứng:** `click`, `open`, `close`, `coinIn`, `coinOut`, `statUp`, `statDown`, `eat`, `sleep`, `dayStart`, `questDone`, `questFail`, `warn`, `message`, `text`, `door`, `register`. Bảng gắn hiệu ứng với sự kiện nằm trong file thiết kế 13.
- **Quy tắc:** gọi `init()` ở lần bấm đầu tiên của người chơi (trình duyệt chặn tự phát). Đổi địa điểm thì `play()` bài mới, bài cũ tự nhỏ dần. Buổi tối gọi `setNight(true)`. Mở bản đồ, túi đồ, lịch, nhiệm vụ không đổi bài. Tiếng `text` chỉ phát mỗi 3 đến 4 chữ. Menu có thanh âm lượng nhạc, hiệu ứng và nút tắt tiếng, lưu vào localStorage. Mặc định nhạc 0,6, hiệu ứng 0,8.
- **Mức âm lượng đã đo:** độ to trung bình −21 đến −18 dBFS, đỉnh không vượt −5 dBFS ở mức mặc định.

## 7. Ngoài phạm vi v0.3

Chạy trên điện thoại dọc, bản nữ quay lưng ở trang bìa.

## 8. Bổ sung v0.4.0 (bản chơi thử thứ 2)

Không có file thiết kế mới; các phần dưới vẽ theo đúng quy tắc mục 1 và bảng màu mục 2. Luật chơi chi tiết: [GAME_DESIGN.md](GAME_DESIGN.md).

| Thành phần | Đặc tả |
| --- | --- |
| Thẻ hành động | Hàng 3–5 thẻ giữa dưới, mỗi thẻ rộng 84 điểm giao diện: phím số, tên việc, nơi diễn ra kèm tiền đi lại (biểu tượng ghim), nhãn tiền và chỉ số theo màu chỉ số, dấu chấm than nền đèn lồng khi gắn nhiệm vụ, lý do khóa màu san hô nhạt, cảnh báo dưới 25 màu đỏ. Thẻ "Đi học" sáng ngày thường tô nền đèn lồng mờ. Thẻ cuối "Tự chọn" |
| Cột công cụ | Túi đồ, Lịch, Nhiệm vụ, Bản đồ, Menu xếp dọc dưới khung nhiệm vụ, nút 24 điểm giao diện, chỉ có biểu tượng và huy hiệu |
| Hộp cảnh báo | Giữa màn hình, khung gỗ ấm (cùng màu dải cảnh báo HUD), tiêu đề màu đèn lồng, nút làm ngay nền đèn lồng và nút "Để sau" |
| Minigame | Khung giữa màn hình rộng 330 điểm giao diện: tiêu đề, đồng hồ (VT323), nút Bỏ qua, một dòng hướng dẫn. Thối tiền: danh sách món, tổng, tiền khách đưa, tờ tiền đã chọn, 8 nút tờ tiền. Canh lửa: 3 nhãn bước, thanh lửa chuyển màu nâu → cam, vùng xanh 25%, vạch trắng |
| Tờ tiền 12×24 | Dựng đứng, viền đậm, hai vạch ngang, hoa văn chấm, khung chân dung không vẽ mặt, ô cửa sổ trong cho tờ polymer (từ 10.000đ). Màu nền: 1.000đ #C8BC6A · 2.000đ #B49478 · 5.000đ #7A9AC8 · 10.000đ #D8B45A · 20.000đ #6A8ED8 · 50.000đ #D27AA8 · 100.000đ #6AB07A · 200.000đ #D4785A |
| Chân dung Ngân | Tóc nâu đen ngắn ngang vai, mái thưa, kẹp tóc hồng, kính tròn gọng nâu #5A3A2A, cardigan vàng nhạt #F2DC8C ngoài áo trắng, nền xanh ngọc #D2F0EE / #B8E6E2 / #9ED8D4. Biểu cảm bình thường và vui. Dáng đứng 30×54 cùng kiểu tóc (`bob`) và kính tròn |
| Cảnh mới | Cà phê ngồi bàn biến thể `ngan`: Ngân ngồi đối diện, hai ly cà phê, sổ phác thảo, hộp bút chì. TTTM có `mom`: mẹ đứng cạnh nhân vật, túi quà hồng, trái tim bay lên |

**Điện thoại nằm ngang** (bổ sung mục 3, file 12 thẻ 4; **đã thay bằng mục 9 ở v0.5.0**): thẻ hành động xếp dọc bên phải, rộng 230 điểm, cao từ 52 điểm, cảnh báo một dòng có dấu "…"; cột công cụ 48×48 bên trái; khung nhiệm vụ dời sang cạnh ví. Nút chính từ 48×48 điểm, hàng danh sách và tab từ 44 điểm (ô ngày trong Lịch 38 điểm vì lưới 5 hàng). Chữ nhỏ nhất 11 điểm: các cửa sổ tính kích thước theo chiều cao màn hình nên `phoneMinFont()` nâng chữ dưới 11px lên 11px khi mở cửa sổ.

**Khóa lưu** `ba-muoi-ngay-sg-v6`. Có bản lưu cũ (v1–v5) mà chưa có bản mới thì trang bìa hiện “Bản lưu cũ không dùng được với phiên bản mới. Hãy bắt đầu một tháng mới.”; bản cũ bị xóa khi bắt đầu tháng mới.

## 9. Bổ sung v0.5.0: giao diện điện thoại và hộp hội thoại

Theo `design/14-giao-dien-dien-thoai.html`; kế hoạch và quyết định đã chốt ở [PLAN-DIEN-THOAI.md](PLAN-DIEN-THOAI.md). Thay mục "Điện thoại nằm ngang" ở mục 8 và bố cục điện thoại trong file 12 thẻ 4.

### 9.1 Chọn bố cục

`src/layout.js` gắn đúng một lớp lên `<html>`, đọc kích thước từ `visualViewport` (dự phòng `innerWidth`/`innerHeight`), gọi lại khi `resize`, `orientationchange`, `visualViewport` đổi cỡ. Không dùng `(pointer:coarse)`.

| Lớp | Điều kiện | Bố cục |
| --- | --- | --- |
| `lay-portrait` | rộng < cao và rộng ≤ 600 | Phương án A (9.2) |
| `lay-landscape` | rộng > cao và cao ≤ 500 | Phương án B (9.3) |
| `lay-desktop` | còn lại | Khung 16:9 như v0.4.0, lưới `--p` (mục 1) |

- Đổi lớp chỉ xếp lại vị trí, không đụng trạng thái: hộp hội thoại, cửa sổ, menu, minigame, chữ đang hiện dần đều giữ nguyên khi xoay máy.
- Đang gõ tên ở màn tạo nhân vật (và 0,7 giây sau khi rời ô nhập) thì giữ bố cục cũ, vì bàn phím ảo thu nhỏ vùng nhìn thấy.
- Cảnh 320×180 "phủ kín và giữ tâm" (`Layout.box`): tỉ lệ đủ phủ vùng cảnh, nhân vật nằm giữa nếu không lộ mép; `Layout.toScene` đổi điểm chạm về điểm ảnh cảnh.
- Trên điện thoại mọi kích thước tính bằng px cố định: nút từ 48×48, thẻ hành động cao từ 60, chữ nhỏ nhất 11px, lời thoại 15,5px (dọc) và 14,5px (ngang). Vùng an toàn: biến `--st`, `--sb`, `--sl`, `--sr` trên `.stage` lấy từ `env(safe-area-inset-*)`.
- Máy tính: chữ nhỏ nhất 11px (`minFont()` nâng chữ dưới 11px khi dựng giao diện và khi đổi cỡ cửa sổ), mọi nút, ô chọn, ô nhập từ 44×44px. Thông báo nổi và menu nổi đặt ngay trên hàng thẻ (`deskPlace()`).
- Gỡ lỗi: `?debug=layout` viền các vùng, in kích thước, vùng an toàn và lớp bố cục.

### 9.2 Bố cục dọc (A)

Từ trên xuống: vùng an toàn tô nền tối; cảnh 16:9 phủ bề ngang (chip ngày và buổi góc trên trái, dải cảnh báo ở mép dưới cảnh, không có nút); bảng điều khiển cuộn được gồm chip tiền và "Lương chờ", 4 thanh chỉ số 2×2 có số bên phải (đỏ khi dưới 25), chip nhiệm vụ đang theo dõi (bấm mở Nhiệm vụ), dòng "[ĐỊA ĐIỂM] · BẠN SẼ LÀM GÌ?", thẻ ăn, thẻ hành động xếp dọc (biểu tượng, tên, nơi và tiền đi lại, nhãn hiệu ứng, lương góc phải, thẻ cuối "Tự chọn việc khác"); thanh công cụ ở đáy (Túi đồ, Lịch, Nhiệm vụ, Bản đồ, Menu; mỗi nút từ 52×48, chừa vùng an toàn dưới).

**Thẻ ăn** (`mealCard` trong `src/cards.js`): hiện khi buổi này chưa ăn và có món dùng được ở nơi đang đứng; tối đa 3 món, đồ sắp hỏng trong túi trước, chừa chỗ cho món gọi tại chỗ; bỏ món không đủ tiền. Bấm món gọi đúng hành động ăn sẵn có.

**Cửa sổ** mở thành ngăn kéo từ dưới lên, cao khoảng 72%, có nút Đóng; kéo đầu ngăn xuống quá 80px thì đóng. Túi đồ lưới 4 cột; ô ngày trong Lịch từ 44px; dòng nhiệm vụ từ 52px; Bản đồ: bản đồ ở trên như cảnh, danh sách và nút "Đi đến" ở dưới.

### 9.3 Bố cục ngang (B)

Bên trái: cảnh phủ kín theo chiều cao, nhân vật giữa vùng cảnh (tai thỏ nằm bên phía cảnh, không có nút); chip ngày góc trên trái cách vùng an toàn trái; cảnh báo góc dưới trái. Bên phải: cột điều khiển 330px cộng vùng an toàn phải: tiền và chip nhiệm vụ, 4 chỉ số 2×2, thẻ ăn và thẻ hành động (cuộn được), hàng công cụ ở đáy. Cửa sổ mở thành ngăn kéo từ bên phải, rộng 400px, cảnh bên trái vẫn thấy.

### 9.4 Sáu loại hộp hội thoại

`src/dialog.js`. Loại hộp lấy từ trường `style` của sự kiện; không khai báo thì 1 lựa chọn là `talk`, từ 2 lựa chọn là `choice`; cảnh báo bật lên (`warnEv`) là `alert`. Bảng gắn loại hộp cho từng sự kiện: PLAN-DIEN-THOAI.md, mục "Bảng loại hộp".

| Loại | Dùng cho | Bản dọc | Bản ngang |
| --- | --- | --- | --- |
| `talk` | Sự kiện 1 lựa chọn | Hộp trượt lên, chân dung 96px khung gỗ nhô lên mép trên trái, bảng tên vàng (tên, vai trò), tiêu đề và ngày giờ, nút "tiếp tục" viền mảnh có mũi tên nhấp nháy | Trượt vào từ phải thay cột điều khiển, chân dung 88px nhô sang phía cảnh |
| `choice` | Từ 2 lựa chọn | Như `talk`; lựa chọn là nút to bằng bề ngang, cao từ 56px, giá và nhãn hiệu ứng trong nút, không đủ tiền thì mờ và có nhãn đỏ "Không đủ tiền" | Lựa chọn ở đáy cột, cao từ 50px |
| `msg` | Tin nhắn | Kiểu ứng dụng nhắn tin: ảnh tròn, tên, giờ, nhãn "1 tin mới", bong bóng trắng, nút trả lời nhanh bo tròn | Một cột trắng bên phải |
| `call` | Mẹ gọi điện | Toàn màn hình: chân dung tròn 116px có vòng sóng, tên, nơi ở, câu hỏi, lựa chọn ở dưới | Chia hai: chân dung trái, câu hỏi và lựa chọn phải |
| `alert` | Cảnh báo quan trọng | Giữa màn hình, viền trên san hô, dấu "!", ngày giờ, tiêu đề, nội dung, nút chính vàng có dòng phụ, nút phụ "Để sau"; nền tối toàn bộ | Hai nút cạnh nhau |
| `think` | Tự nhủ khi đói, kiệt sức, sắp ốm, buồn, phòng bừa | Bong bóng chữ nghiêng cạnh nhân vật, tự ẩn sau 3 giây, không chặn thao tác, `role="status"`; mỗi trạng thái tối đa 1 lần mỗi buổi | Như bản dọc |

Quy tắc chung:

- Viền hộp lấy màu nền chân dung người nói (`Portraits.CH[who].bg`); sự kiện không có người nói thì bỏ chân dung, tiêu đề lên đầu hộp.
- Chữ hiện dần khoảng 45 ký tự/giây; chạm vào hộp thì hiện hết; lựa chọn chỉ hiện (mờ dần) khi đã hết chữ. Tiếng `text` tối đa 1 lần mỗi 3 chữ; `msg` và `call` phát `message` khi mở, `alert` phát `warn`.
- Chuyển động khoảng 0,2 giây; bật `prefers-reduced-motion` thì không hiệu ứng, chữ hiện ngay.
- Hộp không tràn khỏi vùng an toàn: lời dài cuộn bên trong hộp, nút lựa chọn luôn trong màn hình (kiểm bằng lời 400 ký tự).
- Trợ năng: `role="dialog"` (`alertdialog` cho `alert`) có `aria-labelledby`; mở hộp thì focus vào lựa chọn đầu; Esc chỉ đóng `talk` và `think`; phím 1, 2 chọn trên máy tính.
- Máy tính giữ khung hội thoại cũ (file 10) cho `talk` và `choice`, dùng hộp mới cho `msg`, `call`, `alert`, `think`.
- Gỡ lỗi: `?debug=dialog` có nút bật nhanh từng loại hộp với lời mẫu, ô chọn lời dài 400 ký tự.

### 9.5 Minigame trên điện thoại

Thối tiền và Canh lửa chiếm cả màn hình ở cả hai hướng, chừa vùng an toàn; nút từ 48px; tờ tiền ô chạm lớn (dọc: lưới 4×2); nút "Bỏ qua" cố định ở góc trên phải trong vùng an toàn. Xoay máy giữa chừng giữ thời gian và lượt.

### 9.6 Kiểm tra

`npm run test:ui` (`tools/ui-test.js`) chạy Playwright chromium, webkit, firefox ở 390×844, 375×667, 360×780, 430×932, 844×390, 667×375, 780×360, 932×430 và 1280×720, với vùng an toàn giả lập 47/34 (dọc) và 47 hai bên, 21 đáy (ngang). Ảnh lưu ở `test-results/ui/<máy>/<kích thước>/`. Tiêu chí: không cuộn ngang; nút trọn trong màn hình, ngoài vùng an toàn; nút từ 44×44; chữ từ 11px; hộp không tràn với lời 400 ký tự; không lỗi console; xoay máy giữ trạng thái; một ngày thường ở bản dọc không quá 8 lần bấm.
