<div align="center">

<img src="assets/favicon.svg" width="72" alt="">

# 30 Ngày Sài Gòn

**Game mô phỏng chi tiêu có cốt truyện.** Giúp tân sinh viên Minh vừa học vừa làm thêm, sống qua tháng đầu tiên ở Sài Gòn: học đủ, làm đủ, còn tiền, còn khỏe, còn vui.

Pixel art · Chơi trên trình duyệt · Tiếng Việt · Phiên bản `0.2.0`

</div>

---

## Giới thiệu

Minh, 18 tuổi, rời Tuy Hòa vào Sài Gòn học năm nhất. Bố mẹ gửi 3 triệu cho tháng đầu, phần còn lại Minh tự lo bằng việc làm part-time ở cửa hàng tiện lợi. Mỗi ngày có 4 buổi; mỗi buổi người chơi chọn đi đâu, ăn gì, mua gì và làm một hoạt động chính: lên lớp, đi làm, tự học, nghỉ ngơi hay đi chơi. Cuối tháng, game chấm điểm theo tài sản, độ no, tinh thần và sức khỏe, đồng thời kể lại kết cục với từng nhân vật.

- **4 chương** theo 4 tuần: Tân sinh viên · Vừa học vừa làm · Lương part-time đầu tiên · Về đích
- **14 nhiệm vụ chính** và 2 việc nhỏ mỗi ngày dẫn dắt người chơi
- **Học và làm**: lên lớp mỗi sáng, ca part-time chiều tối, điểm học tập và bài kiểm tra giữa kỳ
- **8 địa điểm** pixel, đổi cảnh theo sáng, trưa, chiều, tối
- **Túi đồ** 9 vật phẩm có hạn dùng, **lịch tháng**, **bản đồ**, **nhật ký**
- **Kinh tế sinh viên**: tiền bố mẹ chu cấp, lương part-time ngày 15, tiền nhà, giáo trình, ứng lương, xin thêm tiền nhà, vay app lãi cao

![Vòng lặp chơi](docs/images/game-loop.svg)

## Chạy game

**Chơi thử ngay:** https://tdat10052499.github.io/30-ngay-sai-gon/

Game là một trang web tĩnh, không cần cài đặt hay build.

**Cách 1: mở trực tiếp**
Tải repo về, bấm đúp vào `index.html`.

**Cách 2: chạy qua máy chủ cục bộ** (khuyên dùng khi phát triển)

```bash
python3 -m http.server 8080
# mở http://localhost:8080
```

Font chữ (Be Vietnam Pro, VT323) tải từ Google Fonts. Khi không có mạng, game vẫn chạy với font dự phòng của hệ thống.

### Điều khiển

| Phím | Chức năng |
| --- | --- |
| `B` | Túi đồ |
| `L` | Lịch tháng |
| `J` | Nhiệm vụ |
| `M` | Bản đồ |
| `N` | Nhật ký |
| `Esc` | Đóng cửa sổ hoặc menu |

Mọi thao tác khác đều bấm chuột hoặc chạm, chơi được trên điện thoại.

## Cấu trúc thư mục

```
30-ngay-sai-gon/
├── index.html              Trang game (khung HTML của màn hình)
├── src/
│   ├── game.js             Toàn bộ logic: trạng thái, cốt truyện, nhiệm vụ, sự kiện, giao diện, cảnh pixel
│   └── style.css           Giao diện: HUD, thanh lệnh, cửa sổ, bố cục dọc cho điện thoại
├── assets/
│   └── favicon.svg         Biểu tượng tab trình duyệt
├── design/                 Bộ thiết kế v0.3: 12 trang HTML tự chạy
├── docs/
│   ├── GAME_DESIGN.md      Tài liệu thiết kế: cơ chế, nội dung, cân bằng
│   ├── DESIGN_SPEC.md      Đặc tả thiết kế v0.3: hình ảnh, màn hình, thay đổi luật
│   └── images/             Sơ đồ minh họa
├── tools/
│   └── simulate.js         Mô phỏng cân bằng: cho bot chơi hàng trăm ván
├── .github/                CI và mẫu báo lỗi / góp ý
├── CHANGELOG.md            Lịch sử phiên bản
└── package.json            Lệnh kiểm tra (không có thư viện phụ thuộc)
```

### Bản đồ mã nguồn `src/game.js`

| Phần | Nội dung |
| --- | --- |
| `Pixel icons` | Icon và chân dung nhân vật vẽ bằng lưới 12×12 |
| `Story` | Nhân vật, 4 chương, 14 nhiệm vụ, việc hằng ngày |
| `Items (bag)` | 9 vật phẩm, hạn dùng, nơi dùng |
| `Locations & actions` | 8 địa điểm và các hành động ở mỗi nơi |
| `Core loop` | Hành động, kết thúc buổi, qua đêm, đi lại |
| `Quests` / `Events` | Kiểm tra nhiệm vụ, sự kiện cốt truyện và ngẫu nhiên |
| `Score & ending` | Công thức điểm, điểm học tập, kiểu người chơi, kết cục |
| `HUD rendering` / `Windows` | Giao diện và các cửa sổ |
| `Pixel scene` | Vẽ 8 khung cảnh và nhân vật trên canvas 192×108 |

## Phát triển

Cần Node.js 18 trở lên, không cần cài gói nào.

```bash
npm test          # kiểm tra cú pháp + mô phỏng 40 ván mỗi kiểu chơi
npm run sim       # mô phỏng đầy đủ 150 ván, in tỉ lệ hoàn thành từng nhiệm vụ
```

Trình mô phỏng chạy logic thật của game với hai bot: **Thận trọng** (lên lớp đủ, làm ca chiều, nấu ăn ở nhà, từ chối chi tiêu bốc đồng) và **Ngẫu nhiên**. Nó báo lỗi nếu có ván bị kẹt, nên hãy chạy lại sau mỗi lần chỉnh số liệu cân bằng.

Kết quả hiện tại (150 ván mỗi kiểu):

| Kiểu chơi | Điểm trung vị | Nhiệm vụ | Điểm học tập |
| --- | --- | --- | --- |
| Thận trọng | ~824 | 12/14 | 100 |
| Ngẫu nhiên | ~160 | 3/14 | 0 |

## Thiết kế

Thư mục `design/` chứa bộ thiết kế hình ảnh cho bản `0.3.0`. Mỗi file là một trang HTML tự chạy: bấm đúp để mở bằng trình duyệt, không cần máy chủ. Mã vẽ canvas trong từng trang là nguồn khi đưa đồ họa vào game. Quy tắc hình ảnh, bảng màu và các thay đổi luật đi kèm nằm trong [Đặc tả thiết kế v0.3](docs/DESIGN_SPEC.md).

| File | Nội dung |
| --- | --- |
| [`01-trang-bia-30-ngay-sai-gon.html`](design/01-trang-bia-30-ngay-sai-gon.html) | Trang bìa |
| [`02-dat-ten-nhan-vat.html`](design/02-dat-ten-nhan-vat.html) | Tạo nhân vật: chọn Nam/Nữ, đặt tên |
| [`03-bat-dau-ngay-1.html`](design/03-bat-dau-ngay-1.html) | Chuyển cảnh vào ngày 1 |
| [`04-phong-tro-giao-dien.html`](design/04-phong-tro-giao-dien.html) | Phòng trọ, HUD, menu hành động, độ bừa bộn phòng |
| [`05-truong-dai-hoc.html`](design/05-truong-dai-hoc.html) | Sân trường, giảng đường, thư viện, phòng CLB, căng tin |
| [`06-cua-hang-tien-loi.html`](design/06-cua-hang-tien-loi.html) | Cửa hàng tiện lợi và cảnh làm ca |
| [`07-quan-an-va-cho.html`](design/07-quan-an-va-cho.html) | Phố ăn uống, cảnh ngồi ăn, chợ |
| [`08-ca-phe-cong-vien-tttm.html`](design/08-ca-phe-cong-vien-tttm.html) | Cà phê, công viên bờ kênh, TTTM |
| [`09-ban-do-khu-pho.html`](design/09-ban-do-khu-pho.html) | Bản đồ khu phố |
| [`10-hoi-thoai-chan-dung.html`](design/10-hoi-thoai-chan-dung.html) | Khung hội thoại và 7 chân dung |
| [`11-tui-do-lich-nhiem-vu.html`](design/11-tui-do-lich-nhiem-vu.html) | Túi đồ, Lịch, Nhiệm vụ |
| [`12-hoan-thien-giao-dien.html`](design/12-hoan-thien-giao-dien.html) | Tổng kết, thẻ chương, biến thể nhân vật, bố cục điện thoại |

## Tài liệu

- [Tài liệu thiết kế trò chơi](docs/GAME_DESIGN.md)
- [Đặc tả thiết kế v0.3](docs/DESIGN_SPEC.md)
- [Lịch sử phiên bản](CHANGELOG.md)

## Lộ trình

- [x] `0.1.0` Bản chơi thử đầu tiên: đủ cốt truyện, nhiệm vụ, hệ thống chỉ số, túi đồ, lịch, bản đồ
- [x] `0.2.0` Đổi bối cảnh sang tân sinh viên vừa học vừa làm theo góp ý khách hàng; bỏ tính năng tiết kiệm
- [ ] Nhận góp ý vòng 2 của khách hàng
- [ ] Thử nghiệm với người chơi thật để tinh chỉnh cân bằng
- [ ] Âm thanh và nhạc nền
- [ ] Cho người chơi chọn tên và ngoại hình nhân vật (chờ khách hàng xác nhận)

## Bản quyền

Dự án phát triển cho khách hàng. Mọi quyền được bảo lưu.
