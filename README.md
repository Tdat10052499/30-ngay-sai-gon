<div align="center">

<img src="assets/favicon.svg" width="72" alt="">

# 30 Ngày Sài Gòn

**Game mô phỏng chi tiêu có cốt truyện.** Giúp Minh sống qua tháng thử việc đầu tiên ở Sài Gòn: còn tiền, còn khỏe, còn vui, và được ký hợp đồng.

Pixel art · Chơi trên trình duyệt · Tiếng Việt · Phiên bản `0.1.0`

</div>

---

## Giới thiệu

Minh, 23 tuổi, rời Tuy Hòa vào Sài Gòn làm designer thử việc 30 ngày. Mỗi ngày có 4 buổi; mỗi buổi người chơi chọn đi đâu, ăn gì, mua gì và làm một hoạt động chính. Cuối tháng, game chấm điểm theo tài sản, độ no, tinh thần và sức khỏe, đồng thời kể lại kết cục với từng nhân vật.

- **4 chương** theo 4 tuần: Chân ướt chân ráo · Guồng quay · Ngày lương · Về đích
- **13 nhiệm vụ chính** và 2 việc nhỏ mỗi ngày dẫn dắt người chơi
- **8 địa điểm** pixel, đổi cảnh theo sáng, trưa, chiều, tối
- **Túi đồ** 9 vật phẩm có hạn dùng, **lịch tháng**, **bản đồ**, **nhật ký**
- **Kinh tế thực tế**: tiền nhà, điện nước, trả góp, tiết kiệm, ứng lương, vay nóng lãi cao

![Vòng lặp chơi](docs/images/game-loop.svg)

## Chạy game

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
├── docs/
│   ├── GAME_DESIGN.md      Tài liệu thiết kế: cơ chế, nội dung, cân bằng
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
| `Story` | Nhân vật, 4 chương, 13 nhiệm vụ, việc hằng ngày |
| `Items (bag)` | 9 vật phẩm, hạn dùng, nơi dùng |
| `Locations & actions` | 8 địa điểm và các hành động ở mỗi nơi |
| `Core loop` | Hành động, kết thúc buổi, qua đêm, đi lại |
| `Quests` / `Events` | Kiểm tra nhiệm vụ, sự kiện cốt truyện và ngẫu nhiên |
| `Score & ending` | Công thức điểm, kiểu người chơi, kết cục |
| `HUD rendering` / `Windows` | Giao diện và các cửa sổ |
| `Pixel scene` | Vẽ 8 khung cảnh và nhân vật trên canvas 192×108 |

## Phát triển

Cần Node.js 18 trở lên, không cần cài gói nào.

```bash
npm test          # kiểm tra cú pháp + mô phỏng 40 ván mỗi kiểu chơi
npm run sim       # mô phỏng đầy đủ 150 ván, in tỉ lệ hoàn thành từng nhiệm vụ
```

Trình mô phỏng chạy logic thật của game với hai bot: **Thận trọng** (đi làm đủ ca, nấu ăn ở nhà, từ chối chi tiêu bốc đồng) và **Ngẫu nhiên**. Nó báo lỗi nếu có ván bị kẹt, nên hãy chạy lại sau mỗi lần chỉnh số liệu cân bằng.

Kết quả hiện tại (150 ván mỗi kiểu):

| Kiểu chơi | Điểm trung vị | Nhiệm vụ | Điểm thử việc |
| --- | --- | --- | --- |
| Thận trọng | ~857 | 11/13 | 90 |
| Ngẫu nhiên | ~150 | 3/13 | 0 |

## Tài liệu

- [Tài liệu thiết kế trò chơi](docs/GAME_DESIGN.md)
- [Lịch sử phiên bản](CHANGELOG.md)

## Lộ trình

- [x] `0.1.0` Bản chơi thử đầu tiên: đủ cốt truyện, nhiệm vụ, hệ thống chỉ số, túi đồ, lịch, bản đồ
- [ ] Nhận góp ý của khách hàng về cốt truyện, độ khó, giao diện
- [ ] Thử nghiệm với người chơi thật để tinh chỉnh cân bằng
- [ ] Âm thanh và nhạc nền
- [ ] Cho người chơi chọn tên và ngoại hình nhân vật (chờ khách hàng xác nhận)

## Bản quyền

Dự án phát triển cho khách hàng. Mọi quyền được bảo lưu.
