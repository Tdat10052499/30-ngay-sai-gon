# Kế hoạch giao diện điện thoại và hộp hội thoại (v0.5.0)

Theo đề bài `CLAUDE-CODE-DIEN-THOAI.md` và bản thiết kế `design/14-giao-dien-dien-thoai.html`. Làm trên nhánh mới `dien-thoai` tách từ `main`. Mỗi việc xong thì đánh dấu `[x]` và commit. Cuối mỗi giai đoạn: `npm test`, `npm run test:ui` (từ giai đoạn 6 mới đủ bộ; trước đó chụp tay bằng Playwright ở các kích thước mục 6), báo cáo kèm ảnh rồi chờ duyệt. Hỏi trước mọi lần push, mở PR, tạo tag hoặc release.

## Quyết định đã chốt (duyệt ngày 23/10/2026: làm theo cột Đề xuất)

| # | Câu hỏi | Đề xuất (đã duyệt) |
| --- | --- | --- |
| Q1 | Code hiện **chưa có "thẻ ăn chọn món"** (3 món cạnh nhau). Hiện tại: tự ăn theo chế độ ăn (`autoMeal`), muốn chọn món thì vào "Tự chọn" → Ăn uống. | Thêm thẻ ăn chỉ là giao diện: hiện khi buổi này chưa ăn và có món ăn được ở nơi đang đứng; 3 món lấy từ các hành động ăn có sẵn (`A[loc]`, đồ ăn trong túi), xếp theo giá. Bấm = gọi đúng hành động cũ, không đổi số liệu. Tự ăn vẫn chạy như cũ (ăn rồi thì thẻ ẩn). |
| Q2 | Code **chưa có** `fitStage`, `?debug=layout`, nhánh dự phòng container query (đề bài "giao diện mobile" chưa được làm). | Làm `?debug=layout` (viền các vùng, in kích thước và lớp bố cục) cùng `?debug=dialog` ở giai đoạn 1. `fitStage` chỉ cần cho máy tính: tính `--p` bằng JS khi trình duyệt không hỗ trợ `cqw`. |
| Q3 | Giao diện máy tính: giữ khung hội thoại hiện có (`.e-dlg`, design/10) hay dùng hộp mới? | Giữ khung hiện có cho `talk`/`choice` (vừa khung 16:9, đã đẹp). Dùng hộp mới cho `msg`, `call`, `alert`, `think` trên mọi bố cục. |
| Q4 | Lời "tự nhủ" (`think`) và dải cảnh báo đói, kiệt sức là **chữ mới**. | Duyệt danh sách ở mục "Bảng loại hộp" bên dưới. Ngưỡng dùng lại ngưỡng sẵn có của bong bóng nhân vật (`heroLook`), không thêm số mới. |
| Q5 | Bộ kiểm tra cần Playwright. | Thêm `playwright` vào `devDependencies` (chỉ dùng để test, game vẫn không có thư viện). Tải 3 bộ máy bằng `npx playwright install`. |
| Q6 | `CLAUDE-CODE-BAN-THU-2.md` không có trong repo. | Dùng `docs/PLAN-BAN-THU-2.md` mục 3.5 (cảnh báo bật lên) làm danh sách hộp `alert`. |

## Cách tổ chức code

- **Một DOM cho cả 3 bố cục.** `index.html` gom các bảng HUD thành 3 vùng: `#sceneBox` (cảnh, chip ngày, dải cảnh báo, bong bóng tự nhủ), `#panel` (tiền, chỉ số, nhiệm vụ, tiêu đề, thẻ ăn, thẻ hành động), `#toolbar`. Trên máy tính các vùng là `display:contents`, nên mọi bảng vẫn đặt tuyệt đối trong `.stage` như bây giờ.
- **`src/layout.js`** (mới): hàm thuần `pickLayout(w,h)` trả `desktop|portrait|landscape`; `applyLayout()` gắn lớp lên `<html>`, nghe `resize`, `orientationchange`, `visualViewport.resize`; `sceneBox(w,h,focus)` tính kích thước và vị trí canvas (phủ kín, giữ tâm nhân vật); hàm đổi tọa độ chạm từ màn hình về điểm ảnh cảnh 320×180. Không đụng trạng thái game nên đổi hướng không làm mất gì.
- **`src/dialog.js`** (mới): `evStyle(e)` chọn loại hộp; `dialogHTML(e,style,lay)` dựng 6 loại hộp; chữ hiện dần dùng chung `startType/finishType` hiện có (đưa sang file này). `think` là hàm riêng `think(text)`, không đi qua hàng đợi sự kiện.
- **`src/style.css`**: thêm hai khối `html.lay-portrait …` và `html.lay-landscape …`, đơn vị px cố định. Xóa các khối `@media (pointer:coarse) and (orientation:…)` cũ và màn hình nhắc xoay ngang `.rotate` sau khi khối mới thay xong.
- **`src/game.js`**: chỉ sửa phần dựng HUD (`renderTop`, `renderCmd`, `renderWin`, `openWin`, `eventHTML`), không sửa luật. `isPhone()` và `phoneMinFont()` đổi sang đọc lớp bố cục.
- `tools/harness.js` tự nạp file mới theo `index.html`. Test nhanh trong `tools/test.js`; test giao diện trong `tools/ui-test.js` (Playwright).

---

## Giai đoạn 1: chọn bố cục và bố cục dọc A

- [x] **1.1 Hàm chọn bố cục** (`src/layout.js`, `index.html`, `tools/test.js`)
  - Quy tắc mục 2, đọc `visualViewport`, dự phòng `innerWidth/innerHeight`. Không dùng `(pointer:coarse)`.
  - Kiểm tra: test thuần cho 9 kích thước mục 6 và các ca biên (600×601, 501×500, 1024×768).
  - Đạt: 390×844 → portrait, 844×390 → landscape, 1280×720 → desktop; đúng 1 lớp trên `<html>` mọi lúc.
- [x] **1.2 Khung bố cục dọc và cảnh phủ kín** (`index.html`, `src/style.css`, `src/layout.js`, `src/game.js`)
  - Vùng an toàn trên tô nền tối; cảnh 16:9 phủ bề ngang theo `sceneBox`, nhân vật ở giữa, `pixelated`; chạm vào cảnh (bỏ qua cảnh hành động) đổi tọa độ đúng tỉ lệ.
  - Chip ngày và buổi góc trên trái cảnh; dải cảnh báo ở mép dưới cảnh (giờ học, đóng cửa, phòng bừa như hiện tại, thêm đói và kiệt sức nếu Q4 được duyệt).
  - Bỏ `.rotate`.
  - Kiểm tra: chụp 4 kích thước dọc, chế độ `?debug=layout`.
  - Đạt: không thanh cuộn ngang, cảnh không méo, nhân vật nằm giữa ±10% bề ngang.
- [x] **1.3 Bảng trạng thái** (`src/game.js` `renderTop`/`renderTracker`, `src/style.css`)
  - Chip tiền + "Lương chờ"; 4 thanh chỉ số 2×2 có số bên phải, đỏ khi dưới 25; chip nhiệm vụ đang theo dõi, bấm mở Nhiệm vụ.
  - Đạt: chữ nhỏ nhất 11px, chip nhiệm vụ cao từ 48px.
- [x] **1.4 Thẻ hành động xếp dọc** (`src/game.js` `cardHTML`, `src/style.css`)
  - Dòng "[ĐỊA ĐIỂM] · BẠN SẼ LÀM GÌ?"; mỗi thẻ cao từ 60px: biểu tượng, tên, nơi + tiền đi lại, nhãn hiệu ứng, lương góc phải; thẻ cuối "Tự chọn việc khác". Vùng từ bảng trạng thái tới thẻ cuối cuộn được.
  - "Tự chọn" trên điện thoại: hiện các nhóm hành động như thẻ, menu hành động mở thành ngăn kéo (dùng chung giai đoạn 3).
  - Đạt: dùng đúng `pickCards(s)` hiện có, bấm 1 thẻ làm trọn việc như máy tính.
- [x] **1.5 Thẻ ăn** (`src/cards.js` hàm thuần `mealCard(s)`, `src/game.js`, `tools/test.js`) — theo Q1
  - Đạt: test thuần `mealCard` chỉ trả món làm được; bấm món gọi đúng hành động/đồ trong túi cũ; số liệu không đổi (so trước/sau bằng test).
- [x] **1.6 Thanh công cụ ở đáy** (`src/game.js` `renderTools`, `src/style.css`)
  - Túi đồ, Lịch, Nhiệm vụ, Bản đồ, Menu; mỗi nút từ 52×48 có nhãn chữ, chừa `env(safe-area-inset-bottom)`.
- [x] **1.7 Trang bìa, tạo nhân vật, chuyển cảnh ngày 1 ở bản dọc** (`src/style.css`)
  - Cảnh ở trên, chữ và nút bên dưới, nút từ 48px. Không đổi chữ.
- [x] **1.8 `?debug=layout`** (`src/layout.js`)
  - Viền các vùng, in kích thước vùng nhìn thấy, vùng an toàn và lớp bố cục.

## Giai đoạn 2: bố cục ngang B và xoay máy

- [x] **2.1 Bố cục ngang** (`src/style.css`, `src/layout.js`)
  - Trái: cảnh phủ theo chiều cao, tâm nhân vật (focus 0,44); chip ngày cách vùng an toàn trái; cảnh báo góc dưới trái. Không có nút nào trong vùng tai thỏ.
  - Phải: cột 330px + vùng an toàn phải: tiền + chip nhiệm vụ, 4 chỉ số 2×2, thẻ ăn + thẻ hành động (cuộn), hàng công cụ ở đáy.
  - Đạt: 4 kích thước ngang không cuộn ngang, nút trọn trong vùng an toàn.
- [x] **2.2 Đổi hướng giữ trạng thái** (`src/layout.js`, `src/game.js`)
  - Đổi lớp chỉ xếp lại vị trí: không gọi `openWin`/`hideWin`, không dựng lại hộp đang gõ chữ (chỉ đổi lớp CSS; hộp nào cần HTML khác theo hướng thì dựng lại nhưng giữ số chữ đã hiện và focus).
  - Kiểm tra: Playwright đổi 390×844 ↔ 844×390 khi đang mở cửa sổ, hộp `choice`, minigame.
  - Đạt: cùng `win`, `curEvent`, `mgCur`, lựa chọn vẫn bấm được.

## Giai đoạn 3: cửa sổ dạng ngăn kéo

- [ ] **3.1 Khung ngăn kéo** (`src/style.css`, `src/game.js` `openWin`/`closeWin`)
  - Dọc: từ dưới lên, cao ~70%, nút Đóng từ 48px, vuốt xuống trên thanh kéo để đóng (pointer events, ngưỡng 80px). Ngang: từ bên phải, phủ cột điều khiển, cảnh trái vẫn thấy.
- [ ] **3.2 Túi đồ** lưới 4 cột, chi tiết món xuống dưới lưới.
- [ ] **3.3 Lịch** ô ngày từ 44px, chế độ ăn và chi tiết ngày bên dưới.
- [ ] **3.4 Nhiệm vụ** mỗi dòng từ 52px, chạm mở chi tiết.
- [ ] **3.5 Bản đồ** trong ngăn kéo; chạm địa điểm (trên bản đồ hoặc danh sách) hiện nút "Đi đến".
- [ ] **3.6 Menu, Nhật ký, Luật chơi, Âm thanh, menu hành động "Tự chọn"** dạng ngăn kéo.
- [ ] **3.7 Các màn còn lại** (không ghi trong đề bài nhưng sẽ vỡ nếu bỏ): thẻ sang ngày, thẻ chương, tổng kết cuối tháng, điện thoại trong game (ví, tin nhắn) — xếp một cột, cuộn bên trong, nút từ 48px.
  - Kiểm tra giai đoạn 3: chụp mỗi cửa sổ ở 390×844 và 844×390.
  - Đạt: không tràn, chữ ≥ 11px, nút ≥ 44px; Esc vẫn đóng trên máy tính.

## Giai đoạn 4: sáu loại hộp hội thoại

- [ ] **4.1 `evStyle` và bảng gắn loại hộp** (`src/dialog.js`, `src/events.js`, `src/game.js`, `tools/test.js`)
  - Thêm trường `style` cho các sự kiện ở bảng dưới; không khai báo thì 1 lựa chọn → `talk`, từ 2 → `choice`; `warnEv` → `alert`.
  - Đạt: test duyệt mọi sự kiện trong `DECK` và sự kiện cốt truyện, đúng bảng.
- [ ] **4.2 `talk` và `choice`** dọc (trượt lên, chân dung 96px khung gỗ nhô lên, bảng tên vàng, tiêu đề + ngày giờ, nút tiếp tục viền mảnh có mũi tên; lựa chọn cao từ 56px, giá và nhãn trong nút, "Không đủ tiền") và ngang (trượt vào từ phải, chân dung 88px nhô sang cảnh, lựa chọn từ 50px). Viền theo `Portraits.CH[who].bg[1]`. Sự kiện không có người nói: bỏ chân dung, tiêu đề lên đầu hộp.
- [ ] **4.3 `msg`** dọc: ảnh tròn, tên, giờ (`PH_TIME`), "1 tin mới", bong bóng trắng, nút trả lời nhanh bo tròn. Ngang: cột trắng bên phải.
- [ ] **4.4 `call`** dọc: toàn màn hình, chân dung tròn 116px có vòng sóng, tên, nơi ở (vai trò trong `Portraits.CH`). Ngang: chia hai.
- [ ] **4.5 `alert`** giữa màn hình, viền trên san hô, "!", ngày giờ, tiêu đề, nội dung, nút chính vàng có dòng phụ (`x`), nút phụ "Để sau"; ngang hai nút cạnh nhau. Thay `.warnc` trên mọi bố cục.
- [ ] **4.6 `think`** bong bóng chữ nghiêng cạnh nhân vật (vị trí tính từ `sceneBox`), tự ẩn sau 3 giây, không chặn thao tác, `role="status"`. Kích hoạt khi một trạng thái trong bảng dưới mới bắt đầu, mỗi trạng thái tối đa 1 lần mỗi buổi.
- [ ] **4.7 Quy tắc chung**: chữ hiện dần ~45 ký tự/giây, chạm hiện hết, lựa chọn hiện mờ dần sau khi hết chữ; tiếng `text` tối đa 1 lần mỗi 3 chữ; `msg`/`call` phát `message`, `alert` phát `warn`; chuyển động 0,2 giây, tắt khi `prefers-reduced-motion`; lời dài cuộn trong hộp, nút luôn trong màn hình; `role="dialog"`/`alertdialog` + `aria-labelledby`, focus vào lựa chọn đầu; Esc chỉ đóng `talk`/`think`; phím 1, 2 vẫn chọn trên máy tính.
- [ ] **4.8 `?debug=dialog`** (`src/dialog.js`): hàng nút bật từng loại hộp với lời mẫu (lấy từ design/14) và một lời dài 400 ký tự.
  - Kiểm tra giai đoạn 4: chụp 6 loại × 9 kích thước; đo hộp nằm trong vùng an toàn với lời 400 ký tự.

### Bảng loại hộp (cần duyệt)

| Sự kiện | Nơi khai báo | Người nói | Số lựa chọn | Loại hộp |
| --- | --- | --- | --- | --- |
| Tin nhắn của mẹ | game.js | me | 1 | **msg** |
| Ngân nhắn tin (ngày 11, 17, 24) | game.js | ngan | 2 | **msg** |
| Thùng đồ quê | events.js | me | 1 | **msg** (đang hiện khung "Tin nhắn") |
| Tin nhắn trúng thưởng | events.js | (số lạ) | 2 | **msg**, tên "Số lạ", ảnh tròn mặc định — đề xuất |
| Bạn cùng quê rủ đi ăn | events.js | (bạn cùng quê) | 2 | **msg**, tên "Bạn cùng quê" — đề xuất |
| Mẹ gọi điện (ngày 18) | game.js | me | 2 | **call** |
| Tiền nhà sắp đến hạn (tối ngày 4) | warnEv | — | 2 | **alert** |
| Bài kiểm tra giữa kỳ (tối 28, sáng 29) | warnEv | — | 2 | **alert** |
| Quà sinh nhật mẹ (trưa 29, 30) | warnEv | — | 2 | **alert** |
| Hạn cuối nhiệm vụ | warnEv | — | 2 | **alert** |
| Phòng ghép với Khoa | game.js | tu | 1 | talk |
| Chào mừng tân sinh viên | game.js | hai | 1 | talk |
| Nhận việc part-time | game.js | mai | 1 | talk |
| Kết quả kiểm tra giữa kỳ | game.js | hai | 1 | talk |
| Cô Tư thu tiền nhà | game.js | tu | 1 | talk |
| Điện nước / giáo trình đến hạn | game.js | — | 1 | talk (không chân dung) |
| Lương part-time đầu tiên | game.js | mai | 1 | talk |
| Khoa trả tiền / Khoa hẹn lần sau | game.js | khoa | 1 | talk |
| Ngất xỉu | game.js | — | 1 | talk (không chân dung) |
| Nghỉ dưỡng sau khi nằm viện | game.js | — | 1 | talk (không chân dung) |
| Thầy Hải nhắc nhở | game.js | hai | 1 | talk |
| Sinh nhật mẹ | game.js | me | 1 | talk |
| Chị Mai khen, Tô canh của cô Tư, Bài tập nhóm | events.js | mai, tu, hai | 1 | talk |
| Cúp điện, Bị lừa rồi | events.js | — | 1 | talk (không chân dung) |
| Đêm nhạc chào tân sinh viên | game.js | linh | 2 | choice |
| Mẹ lên Sài Gòn | game.js | me | 2 | choice |
| Flash sale 0 giờ, Giày đang sale 40% | game.js | — | 2 | choice |
| Bị ốm | game.js | — | 3 | choice |
| Đau bụng, Mưa to bất chợt | game.js | — | 2 | choice |
| Lớp rủ đi ăn lẩu, Khoa hỏi mượn tiền, Sinh nhật bạn cùng lớp, Khoa rủ chạy bộ | events.js | khoa | 2 | choice |
| Xe chết máy, Nhặt được tiền, Quán hết chỗ, Mời làm thẻ thành viên, Rơi điện thoại, Nhặt được ví, Hỏng sạc laptop, Khách để quên điện thoại | events.js | — | 2 | choice |
| Thẻ sang ngày, thẻ chương, minigame | — | — | — | giữ khung riêng (không phải hộp hội thoại) |

**Lời tự nhủ (`think`) — chữ mới, cần duyệt.** Ngưỡng lấy từ `heroLook()` hiện có:

| Trạng thái | Ngưỡng | Lời |
| --- | --- | --- |
| Đói | Độ no < 25 | Bụng hơi cồn cào… chắc phải kiếm gì ăn. |
| Kiệt sức | Năng lượng < 15 | Mệt rã rời… phải ngủ một giấc mới được. |
| Sắp ốm | Sức khỏe < 30 | Người cứ nôn nao, chắc sắp ốm rồi. |
| Buồn | Tinh thần < 25 | Dạo này buồn buồn… ra ngoài một chút cho khuây khỏa. |
| Phòng bừa | Phòng "Bừa bộn" | Phòng bừa quá, nhìn mà nản. |

Dải cảnh báo đói và kiệt sức (mục 3.2) lấy câu trong design/14 sau khi kiểm lại với `src/rules.js`; nếu câu không đúng luật thì sửa cho đúng và báo lại.

## Giai đoạn 5: minigame trên điện thoại

- [ ] **5.1 Thối tiền, Canh lửa toàn màn hình** (`src/style.css`, `src/minigames.js` chỉ phần HTML)
  - Cả hai hướng; nút từ 48px; tờ tiền ô chạm từ 48×64px (dọc: lưới 4×2); "Bỏ qua" cố định góc trên phải trong vùng an toàn.
  - Đạt: chụp 2 minigame × 8 kích thước điện thoại; không cuộn ngang; đổi hướng giữa chừng giữ thời gian và lượt.

## Giai đoạn 6: bộ kiểm tra

- [ ] **6.1 Test nhanh trong `npm test`** (`tools/test.js`, `package.json`): `pickLayout`, `sceneBox` (phủ kín, tâm), đổi tọa độ chạm, `evStyle` theo bảng, `mealCard`, thêm `node --check` cho file mới.
- [ ] **6.2 `npm run test:ui`** (`tools/ui-test.js`, `package.json`): Playwright chromium, webkit, firefox × 9 kích thước. Phục vụ trang bằng server tĩnh viết bằng Node (không cần python). Chụp: màn chơi (phòng trọ, sáng ngày thường), thẻ ăn, một cửa sổ, 6 loại hộp, một minigame → `test-results/ui/<máy>/<kích thước>/*.png` (thêm vào `.gitignore`).
  - Kiểm tự động: không cuộn ngang; mọi nút hiện trọn trong vùng nhìn thấy trừ vùng an toàn giả lập (47/34 dọc, 47 hai bên + 21 đáy ngang); nút nhỏ nhất ≥ 44×44; chữ nhỏ nhất ≥ 11px; hộp không tràn với lời 400 ký tự; không lỗi console.
  - Kịch bản xoay máy: `choice` mở ở 390×844 → 844×390, cùng lời thoại, bấm được lựa chọn.
  - Kịch bản tạo nhân vật trên máy nhỏ: 320×480, 360×640, 375×667, 390×844, 568×320, 667×375, 844×390, 800×450, 1280×720, có giả lập bàn phím ảo (vùng nhìn thấy còn 340/380/180px). Người chơi tự cuộn tới nút "Tạo nhân vật" rồi bấm, không để Playwright tự cuộn hộ. Đạt khi vào được ngày 1 và bố cục không đổi giữa lúc gõ tên.
  - Kịch bản số lần bấm: một ngày thường ở 390×844 (đi học, ăn trưa, ca chiều, ăn tối, ca tối) ≤ 8 lần bấm.
  - In bảng kết quả theo kích thước, đánh dấu ô chưa đạt.

## Giai đoạn 7: tài liệu và phát hành

- [ ] **7.1** `docs/DESIGN_SPEC.md` (bố cục điện thoại, hộp hội thoại), README, CHANGELOG (v0.5.0), số phiên bản trong `?v=`.
- [ ] **7.2** Hỏi rồi mở PR vào `main`.
- [ ] **7.3** Sau khi merge: kiểm trang Pages ở 390×844 và 844×390, báo link.
- [ ] **7.4** Danh sách thử trên máy thật: Safari iPhone, Chrome Android, Samsung Internet, mở trong Zalo và Messenger, cả hai hướng máy.
