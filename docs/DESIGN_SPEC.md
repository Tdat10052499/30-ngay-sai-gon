# 30 Ngày Sài Gòn · Đặc tả thiết kế v0.3

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
| 12-hoan-thien-giao-dien | Tổng kết cuối tháng, thẻ chương, thẻ sang ngày, biến thể nhân vật, bố cục điện thoại nằm ngang, điện thoại trong game | Màn kết thúc, thẻ, nhân vật, CSS di động, cửa sổ điện thoại |
| 13-nhac-nen-va-am-thanh | Trang nghe thử 9 bản nhạc nền, đoạn bình minh, 17 hiệu ứng; có thanh âm lượng, tắt tiếng, chế độ buổi tối | Dùng `src/audio.js` có sẵn trong gói |

Mã vẽ trong các file trùng nhau một phần (ví dụ hàm `outlined`, `canopy`, font pixel, nhân vật). Khi đưa vào game nên gom về một chỗ, không chép lặp.

## 4. Thay đổi luật chơi đã chốt

1. **Bỏ vay qua app.** Xóa `loan`, `repay`, `loanCount`. Nhiệm vụ `q3_indep`: "Không xin thêm tiền bố mẹ trong cả tháng." Thành tựu Tự lập tài chính: `askCount === 0`.
2. **Bỏ nợ.** Khi ví không đủ tiền vào ngày tự trừ hóa đơn: trừ hết tiền trong ví, tinh thần −12, không ghi nợ, không phạt 10%. Bỏ `s.debt` khỏi tài sản, kiểu người chơi, kết cục và thành tựu. Bỏ kiểu người chơi "Con nợ cuối tháng". Lời cô Tư theo cờ thiếu tiền nhà ngày 5: "Tháng này thiếu tiền nhà. Cô Tư nhắc khéo: tháng sau nhớ để dành đủ trước mùng 5."
3. **Tên và giới tính.** Lưu `s.name`, `s.gender`. Thay mọi chỗ ghi cứng "Minh" bằng tên người chơi. Lời thoại hiện tại dùng xưng hô trung tính (con, em, mày, tao), không cần đổi theo giới tính.
4. **Đồng phục** chỉ mặc khi `s.loc === 'store' && s.flags.hired`. Áo cam cuối tuần, áo xanh ngày thường.
5. **Độ bừa bộn phòng** (chỉ số ẩn 0 đến 100, 3 mức): tăng +10 mỗi đêm, +6 mỗi bữa ăn trong phòng, +4 mỗi lần nấu, +2 mỗi buổi ở phòng. Dọn phòng −50. Ảnh hưởng: gọn gàng (0–33) sáng hôm sau tinh thần +2; hơi bừa (34–66) mỗi buổi ở phòng tinh thần −1; bừa bộn (67–100) mỗi buổi ở phòng tinh thần −2, ngủ hồi 40 năng lượng thay vì 50. Dọn phòng cho tinh thần +5, +8, +12 theo mức trước khi dọn.
6. **Bản đồ mới**: vị trí 8 địa điểm theo file 09. Giá đi lại giữ nguyên (cà phê 5K, trường 6K, TTTM 12K, còn lại miễn phí).
7. **Khóa lưu** tăng lên `ba-muoi-ngay-sg-v5`.

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
