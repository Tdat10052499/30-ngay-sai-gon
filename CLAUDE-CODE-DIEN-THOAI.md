# Đề bài cho Claude Code: làm lại giao diện điện thoại và hộp hội thoại

Đặt file này ở gốc repo `30-ngay-sai-gon`, và đặt `design/14-giao-dien-dien-thoai.html` (bản thiết kế chạy được) vào thư mục `design/`. Claude Code đọc file này, **lập kế hoạch vào `docs/PLAN-DIEN-THOAI.md`**, chờ tôi duyệt, rồi làm lần lượt từng bước.

---

## 0. Bối cảnh

- Game web tĩnh, JavaScript thuần, không có bước build. Đã có:
  - thẻ hành động theo buổi và thẻ ăn chọn món;
  - âm thanh (`src/audio.js`);
  - các thay đổi trong `CLAUDE-CODE-BAN-THU-2.md`.
- Trên điện thoại, giao diện hiện tại rất khó dùng. Toàn bộ giao diện nằm đè lên một khung 16:9 rồi co nhỏ theo màn hình, nên chữ và nút quá nhỏ, che mất cảnh, và người chơi phải xoay ngang mới chơi được.
- Bản thiết kế mới nằm ở `design/14-giao-dien-dien-thoai.html`. Mở bằng trình duyệt để xem và bấm thử. Trang có 2 phần:
  1. Ba phương án bố cục. Đã chọn: **A (dọc) làm mặc định, B (ngang) khi xoay máy**. Không làm C.
  2. Sáu loại hộp hội thoại, mỗi loại có bản dọc và bản ngang.
- Mã HTML, CSS, JavaScript trong file thiết kế dùng được làm nguồn tham khảo. Không chép nguyên cả trang vào game: phải gom vào cấu trúc code hiện có.
- Đề bài này **thay thế** phần bố cục điện thoại trong các đề bài trước (`design/12` thẻ 4, mục 3.1 của `CLAUDE-CODE-BAN-THU-2.md`). Riêng phần sửa lỗi co giãn trong đề bài "giao diện mobile" vẫn giữ: `fitStage`, `100dvh`, bỏ `min-width`, nhánh dự phòng khi không có container query, chế độ `?debug=layout`.

## 1. Quy tắc làm việc

1. **Bước đầu tiên.**
   - Đọc file này và mở `design/14-giao-dien-dien-thoai.html`.
   - Đọc các phần code: bố cục, HUD, thẻ hành động, thẻ ăn, cửa sổ (Túi đồ, Lịch, Nhiệm vụ, Bản đồ, Menu), hộp sự kiện, minigame.
   - Chạy `git log --oneline -20`.
   - Báo tôi trong khoảng 10 dòng: cấu trúc giao diện hiện tại, phần sẽ thay, phần giữ nguyên, rủi ro lớn nhất.
2. **Lập kế hoạch** vào `docs/PLAN-DIEN-THOAI.md`:
   - danh sách việc có ô đánh dấu, chia theo giai đoạn ở mục 7;
   - mỗi việc ghi file sẽ sửa, cách kiểm tra, tiêu chí đạt;
   - chờ tôi duyệt.
3. **Làm lần lượt.** Xong việc nào thì đánh dấu `[x]` và commit, có dòng Co-Authored-By như các commit trước.
4. **Cuối mỗi giai đoạn** chạy `npm test` và bộ kiểm tra ở mục 6. Báo kết quả kèm ảnh chụp, rồi dừng lại chờ tôi duyệt.
5. **Hỏi tôi và chờ đồng ý** trước mỗi lần `git push`, mở pull request, tạo tag hoặc release. Không `push --force`.
6. **Không đổi** luật chơi, số liệu, lời thoại hay hình vẽ của cảnh. Chỉ làm bố cục, giao diện và hộp hội thoại.
7. **Giao diện máy tính giữ nguyên** như hiện tại, chỉ sửa nếu bị ảnh hưởng.
8. JavaScript thuần, không thêm thư viện. Báo cáo bằng tiếng Việt, ngắn gọn.
9. Khi mở phiên mới: đọc lại file này và `docs/PLAN-DIEN-THOAI.md`, xem ô nào đã đánh dấu và `git log`, rồi làm tiếp.

## 2. Chọn bố cục theo thiết bị

- Một hàm JavaScript gắn đúng 1 trong 3 lớp lên thẻ `<html>`: `lay-desktop`, `lay-portrait`, `lay-landscape`. Gọi lại khi `resize`, `orientationchange`, `visualViewport` resize.
- Quy tắc chọn, đọc kích thước từ `window.visualViewport`, dự phòng `innerWidth` và `innerHeight`:
  - `lay-portrait`: chiều rộng nhỏ hơn chiều cao và chiều rộng ≤ 600.
  - `lay-landscape`: chiều rộng lớn hơn chiều cao và chiều cao ≤ 500.
  - `lay-desktop`: các trường hợp còn lại.
- Không dựa vào media query `(pointer: coarse)` để chọn bố cục, vì một số trình duyệt trong ứng dụng (Zalo, Messenger) báo sai.
- Đổi hướng máy giữa chừng không làm mất trạng thái: hộp hội thoại đang mở, cửa sổ đang mở, minigame đang chơi đều phải giữ nguyên, chỉ xếp lại vị trí.
- Bỏ màn hình nhắc xoay ngang trong đề bài trước, vì giờ đã chơi được ở chiều dọc.
- Ở cả hai bố cục điện thoại, mọi kích thước tính bằng px cố định (không co theo tỉ lệ khung game):
  - nút từ 48×48;
  - thẻ hành động cao từ 60;
  - chữ nhỏ nhất 11px;
  - lời thoại 15,5px ở bản dọc, 14,5px ở bản ngang.
- Vùng an toàn dùng `env(safe-area-inset-*)`, kèm giá trị dự phòng.

## 3. Bố cục dọc (A)

Theo phương án A trong `design/14`, từ trên xuống:

1. **Vùng an toàn trên cùng**, tô màu nền tối.
2. **Cảnh 16:9 phủ hết bề ngang.**
   - Góc trên trái có chip ngày và buổi.
   - Cảnh báo (giờ học, đói, kiệt sức) là một dải nằm ở mép dưới cảnh.
   - Bong bóng "tự nhủ" hiện cạnh nhân vật.
3. **Bảng trạng thái:**
   - chip tiền và dòng "Lương chờ";
   - 4 chỉ số dạng thanh ngang xếp 2×2, có số bên phải, số chuyển đỏ khi dưới 25;
   - chip nhiệm vụ đang theo dõi, bấm vào thì mở cửa sổ Nhiệm vụ.
4. **Dòng tiêu đề** "[ĐỊA ĐIỂM] · BẠN SẼ LÀM GÌ?".
5. **Thẻ ăn**, nếu đang hiện: 3 món đặt cạnh nhau.
6. **Các thẻ hành động xếp dọc**, mỗi thẻ hiện:
   - biểu tượng, tên việc;
   - nơi diễn ra và tiền đi lại;
   - nhãn hiệu ứng;
   - tiền lương ở góc phải nếu có.

   Thẻ cuối là "Tự chọn việc khác". Phần từ mục 3 tới đây cuộn được khi không đủ chỗ.
7. **Thanh công cụ ở đáy:** Túi đồ, Lịch, Nhiệm vụ, Bản đồ, Menu. Mỗi nút rộng ít nhất 52, cao ít nhất 48, chừa vùng an toàn dưới đáy.

- **Các cửa sổ** (Túi đồ, Lịch, Nhiệm vụ, Bản đồ, Menu) mở thành ngăn kéo từ dưới lên, cao khoảng 70% màn hình, có nút Đóng. Vuốt xuống cũng đóng được.
  - Lưới túi đồ 4 cột.
  - Lịch: mỗi ô ngày ít nhất 44px.
  - Nhiệm vụ: mỗi dòng ít nhất 52px.
  - Bản đồ: chạm vào địa điểm thì hiện nút "Đi đến".
- **Cảnh vẽ bằng canvas** theo cách "phủ kín và giữ tâm" như trong `design/14` (hàm `sceneBox`): chọn tỉ lệ đủ để phủ kín vùng cảnh, căn sao cho nhân vật nằm giữa, giữ `image-rendering: pixelated`. Tọa độ chạm phải đổi đúng theo tỉ lệ này.

## 4. Bố cục ngang (B)

Theo phương án B trong `design/14`:

- **Bên trái:** cảnh phủ kín theo chiều cao, căn nhân vật vào giữa vùng cảnh.
  - Phần tai thỏ nằm bên phía cảnh, không đặt nút nào ở đó.
  - Chip ngày và buổi ở góc trên trái, cách vùng an toàn trái.
  - Cảnh báo ở góc dưới trái.
- **Bên phải:** cột điều khiển rộng 330px, cộng thêm vùng an toàn phải. Từ trên xuống:
  - tiền và chip nhiệm vụ;
  - 4 chỉ số xếp 2×2;
  - thẻ ăn và các thẻ hành động, phần này cuộn được;
  - hàng nút công cụ ở đáy.
- **Các cửa sổ** mở thành ngăn kéo từ bên phải, phủ lên cột điều khiển, cảnh bên trái vẫn thấy được.

## 5. Sáu loại hộp hội thoại

Làm đúng như phần "Hộp hội thoại cho bố cục dọc" trong `design/14`, cả bản dọc lẫn bản ngang. Dùng chân dung có sẵn (`src/gfx/portraits.js` hoặc tương đương).

| Loại | Dùng cho | Bản dọc | Bản ngang |
| --- | --- | --- | --- |
| `talk` (1 lựa chọn) | Sự kiện chỉ có một lựa chọn: cô Tư giao chìa khóa, thầy Hải chào lớp… | Hộp trượt lên từ dưới, cảnh phía trên vẫn sáng, phần dưới tối dần. Chân dung 96px khung gỗ nhô lên mép trên bên trái, bảng tên vàng (tên và vai trò), tiêu đề và ngày giờ bên phải chân dung. Nút "tiếp tục" viền mảnh có mũi tên nhấp nháy | Hộp trượt vào từ bên phải, thay chỗ cột điều khiển. Chân dung 88px nhô sang phía cảnh |
| `choice` | Sự kiện có từ 2 lựa chọn | Như `talk`, các lựa chọn là nút to bằng cả bề ngang, cao từ 56px, giá tiền và nhãn hiệu ứng nằm trong nút. Không đủ tiền thì nút mờ đi và có nhãn đỏ "Không đủ tiền" | Như bản dọc, lựa chọn ở đáy cột, cao từ 50px |
| `msg` | Tin nhắn của mẹ, Ngân rủ đi cà phê, các tin nhắn điện thoại | Kiểu ứng dụng nhắn tin: đầu hộp có ảnh tròn, tên, giờ, nhãn "1 tin mới". Lời thoại là bong bóng trắng, lựa chọn là nút trả lời nhanh bo tròn | Một cột trắng bên phải |
| `call` | Mẹ gọi điện ngày 18 và các cuộc gọi khác | Chiếm cả màn hình như cuộc gọi đến: chân dung tròn 116px có vòng sóng, tên, nơi ở, câu hỏi, lựa chọn ở dưới | Chia hai: chân dung bên trái, câu hỏi và lựa chọn bên phải |
| `alert` | Các cảnh báo quan trọng trong `CLAUDE-CODE-BAN-THU-2.md` mục 4.2 (tiền nhà, thi giữa kỳ, sinh nhật mẹ, ngày cuối của nhiệm vụ chính) | Hộp giữa màn hình, viền trên màu san hô, biểu tượng "!", ngày giờ, tiêu đề, nội dung, một nút chính màu vàng (có dòng phụ, ví dụ "Trường · 6.000đ"), một nút phụ "Để sau". Nền phía sau làm tối toàn bộ | Hai nút đặt cạnh nhau |
| `think` | Lời tự nhủ, nhắc nhẹ: sắp đói, sắp kiệt sức, phòng bừa… | Bong bóng suy nghĩ chữ nghiêng cạnh nhân vật, tự biến mất sau khoảng 3 giây, không chặn thao tác | Như bản dọc |

**Quy tắc chung cho mọi loại hộp:**

- **Gắn loại hộp cho sự kiện:**
  - Mỗi sự kiện có thể khai báo `style` (`talk`, `choice`, `msg`, `call`, `alert`).
  - Không khai báo thì tự chọn: 1 lựa chọn là `talk`, từ 2 lựa chọn là `choice`.
  - Khai báo sẵn: "Tin nhắn của mẹ" và lời mời của Ngân là `msg`; "Mẹ gọi điện" là `call`.
  - Lập bảng mọi sự kiện và loại hộp của từng sự kiện, đưa vào kế hoạch để tôi duyệt.
- **Màu viền theo người nói:** viền của hộp lấy màu nền chân dung của người nói.
- **Chữ hiện dần**, khoảng 40 đến 50 ký tự mỗi giây.
  - Chạm vào hộp thì hiện hết ngay.
  - Lựa chọn chỉ hiện khi đã hiện hết chữ, hiện bằng hiệu ứng mờ dần.
  - Tiếng `text` tối đa một lần mỗi 3 đến 4 chữ.
  - Hộp `msg` và `call` phát `message` khi mở.
  - Hộp `alert` phát `warn`.
- **Chuyển động** khoảng 0,2 giây (trượt lên, trượt vào, phóng nhẹ). Khi máy bật `prefers-reduced-motion`: không có hiệu ứng, chữ hiện ngay.
- **Hộp không được tràn ra ngoài vùng an toàn.** Lời thoại dài thì cuộn bên trong hộp, nút lựa chọn luôn nằm trong màn hình.
- **Trợ năng:**
  - `role="dialog"` cho hộp thường, `role="alertdialog"` cho hộp cảnh báo, có `aria-labelledby`;
  - mở hộp thì đưa focus vào lựa chọn đầu tiên;
  - Esc chỉ đóng được hộp `talk` và `think`, không đóng được hộp có lựa chọn;
  - trên máy tính, phím 1, 2 vẫn chọn được.
- **Giao diện máy tính** dùng chung các loại hộp này, nhưng có thể giữ khung hội thoại hiện có nếu đẹp hơn. Báo tôi trước khi quyết định.

**Minigame trên điện thoại:** khung minigame (Thối tiền, Canh lửa) chiếm cả màn hình ở cả hai hướng, nút từ 48px, tờ tiền đủ to để chạm, nút "Bỏ qua" luôn ở góc trên phải trong vùng an toàn.

## 6. Bộ kiểm tra

Dùng Playwright với cả 3 bộ máy trình duyệt (chromium, webkit, firefox).

- **Kích thước dọc:** 390×844, 375×667, 360×780, 430×932.
- **Kích thước ngang:** 844×390, 667×375, 780×360, 932×430.
- **Máy tính:** 1280×720.

**Với mỗi kích thước, chụp màn hình:**
- màn hình chơi (phòng trọ, buổi sáng ngày thường);
- thẻ ăn đang hiện;
- một cửa sổ đang mở;
- mỗi loại hộp `talk`, `choice`, `msg`, `call`, `alert`, `think`;
- một minigame.

Thêm ở trang gỡ lỗi (`?debug=dialog`) một nút bật nhanh từng loại hộp với lời thoại mẫu, để chụp được.

**Kiểm tra tự động ở mọi kích thước:**
- không có thanh cuộn ngang;
- mọi nút nằm trọn trong vùng nhìn thấy, không nằm dưới tai thỏ hay thanh vuốt;
- nút nhỏ nhất từ 44×44px, chữ nhỏ nhất từ 11px;
- hộp hội thoại không tràn ra ngoài màn hình kể cả khi lời thoại dài 400 ký tự;
- không có lỗi console.

**Kịch bản đổi hướng máy:** đang mở hộp `choice` thì đổi từ 390×844 sang 844×390. Hộp phải vẫn mở, đúng lời thoại, các lựa chọn vẫn bấm được.

**Kịch bản số lần bấm:** một ngày thường (đi học, ăn trưa, làm ca chiều, ăn tối, làm ca tối) ở bản dọc không quá 8 lần bấm.

Báo kết quả dạng bảng theo từng kích thước, đánh dấu chỗ chưa đạt, kèm ảnh chụp.

## 7. Giai đoạn (gợi ý cho kế hoạch)

1. **Chọn bố cục** (mục 2) và khung bố cục dọc A (mục 3) với thẻ hành động, thẻ ăn, bảng trạng thái, thanh công cụ.
2. **Bố cục ngang B** (mục 4) và chuyển đổi khi xoay máy.
3. **Các cửa sổ** dạng ngăn kéo cho cả hai hướng.
4. **Sáu loại hộp hội thoại** (mục 5) và bảng gắn loại hộp cho từng sự kiện.
5. **Minigame** trên điện thoại.
6. **Bộ kiểm tra** (mục 6) đưa vào `npm test`, gồm các phần chạy được nhanh; phần chụp màn hình tách thành lệnh `npm run test:ui`.
7. **Tài liệu và phát hành:**
   - cập nhật `docs/DESIGN_SPEC.md` (mục bố cục điện thoại, hộp hội thoại), README, CHANGELOG;
   - hỏi tôi rồi mở pull request vào `main`;
   - sau khi tôi merge: kiểm tra trang Pages trên 390×844 và 844×390, báo link để gửi anh Đạt;
   - soạn danh sách thử trên máy thật cho anh Đạt: Safari iPhone, Chrome Android, Samsung Internet, mở trong Zalo và Messenger, cả hai hướng máy.
