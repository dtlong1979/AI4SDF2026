# AI4SDF 2026 — Landing page

Trang giới thiệu Hội thảo khoa học quốc tế **Artificial Intelligence and Data Science for a
Sustainable Digital Future (AI4SDF 2026)** — Trường Đại học Mở Hà Nội, 12/12/2026.

- Ngôn ngữ: **tiếng Anh** (theo Call for Papers — hội thảo dùng tiếng Anh).
- Công nghệ: **HTML/CSS/JS tĩnh, không cần build, không phụ thuộc thư viện ngoài.**
- Hướng thiết kế: **"Data Aurora"** — nền tối, dải sáng cyan → emerald → violet, đồ họa sinh bằng
  canvas, chữ Sora/Inter/JetBrains Mono.

**Khối hero** gồm hai lớp canvas độc lập, cả hai đều tự dừng khi cuộn qua hoặc khi chuyển tab:

1. *Nền* (`#neural`) — lưới điểm trôi, nối các điểm ở gần nhau, phản ứng nhẹ theo con trỏ.
2. *Điểm nhấn* (`#globe`) — quả cầu dây khung **xoay liên tục** (một vòng ~70 giây, kèm dao động
   nghiêng nhẹ), các cung đại vòng nối **Hà Nội** tới 11 thành phố trên thế giới, gói dữ liệu chạy
   dọc từng cung, vòng xung nhịp tại điểm chủ nhà và **lá cờ Việt Nam nhỏ ngay tại điểm Hà Nội**.
   **Chính giữa quả cầu** là huy hiệu chủ nhà nổi
   lên trên: logo Trường ĐH Mở Hà Nội trên đĩa trắng, dưới là "Hanoi Open University" và dòng nhỏ
   "HOST INSTITUTION · HANOI, VIETNAM", có một lớp tối mềm phía sau để chữ không chọi với lưới dây.
   Toạ độ thành phố nằm ở hằng `CITIES` trong `main.js`; cặp nối ở `ARC_TO`. Ẩn dưới 1000 px vì
   ở đó chữ đã chiếm hết bề ngang — không còn khoảng trống để làm điểm nhấn.

> **Vì sao huy hiệu ở giữa chứ không gắn vào đúng điểm Hà Nội:** đã thử và phải bỏ. Quả cầu xoay
> nên điểm Hà Nội sẽ trôi sang mặt khuất, kéo cả nhãn đi và mất chữ khoảng một nửa thời gian. Cách
> duy nhất giữ điểm đó đứng yên là đặt trục xoay đâm thẳng vào mắt người xem — nhưng khi ấy phép
> chiếu phối cảnh biến chuyển động thành **một phép xoay ảnh 2D thuần tuý**, nhìn như đang quay một
> tấm hình chứ không phải một khối cầu. Đặt ở tâm giữ được cả hai: xoay thật và chữ luôn đọc được.
> Khi Hà Nội quay về mặt trước, các cung vẫn hội tụ ngay sau logo — đúng ý đồ.

**Lá cờ** (`drawFlag` trong `main.js`) đánh dấu đúng điểm Hà Nội, vẽ **sau cùng** nên luôn nằm trên.
Nó mờ đi theo **hai** điều kiện: khi điểm đó xoay sang mặt khuất, và khi nó lại gần đĩa logo (điểm
Hà Nội chiếu gần trùng tâm quả cầu lúc quay chính diện, không tránh khỏi chồng lấn). Vì vậy cờ hiện
rõ ở khoảng một phần ba mỗi vòng quay, hai lần mỗi vòng. Chỉnh dải hiện/ẩn ở hai biến `byDepth` và
`byGap`; chỉnh kích thước ở `h = size * 0.036`.

## Về hai logo trên trang

**Thanh menu — logo hội thảo** (`ai4sdf-logo.png`). Bản gốc là lockup **dọc**: biểu tượng (592 px)
rồi mới tới chữ "AI4SDF 2026" (103 px). Thu về chiều cao thanh menu thì dòng chữ chỉ còn ~8 px,
không đọc nổi. Nên tệp đang dùng là **biến thể ngang** dựng lại từ chính artwork gốc: biểu tượng
bên trái, chữ bên phải, canh giữa theo trục dọc.

Đồng thời mực xanh navy của bản gốc chỉ đạt **1.64:1** so với nền menu — dưới xa ngưỡng 3:1 tối
thiểu cho hình đồ hoạ, tức là không đọc được chứ không phải xấu. Nên tệp này là **bản đảo sáng**:
giữ nguyên hình, giữ nguyên hệ màu (xanh dương – xanh lá – sao đỏ), chỉ nâng độ sáng của mực.
Sao đỏ giữ nguyên vì đã đạt 3.78:1.

> **Giữ bản gốc để in ấn.** Tệp trong kho là bản dành riêng cho nền tối. Khi làm phông, giấy mời
> hay kỷ yếu, dùng lockup dọc màu gốc, đừng lấy tệp này.

**Quả cầu — dấu Trường ĐH Mở Hà Nội** (`hou-logo.png`). Nhận diện của Trường có phần cổng là **vùng
trong suốt**, đặt thẳng lên nền tối sẽ thành ảnh âm bản. Vì vậy nó nằm trên **đĩa trắng** — đúng
cách trình bày chính thức. Đừng bỏ đĩa trắng đi.

---

## 1. Cấu trúc

```
AI4SDF 2026/
├─ index.html                 Trang chủ (10 mục: About → Contact)
├─ cfp.html                   Call for Papers dạng trang in được (Print → PDF)
├─ assets/
│  ├─ css/style.css           Toàn bộ giao diện (biến màu ở đầu file, mục "1. Tokens")
│  ├─ js/main.js              Nav, scroll-spy, reveal, đếm ngược, 2 canvas hero
│  ├─ img/
│  │  ├─ ai4sdf-logo.png      Logo hội thảo, biến thể NGANG + ĐẢO SÁNG (dùng ở thanh menu)
│  │  ├─ hou-logo.png         Logo Trường ĐH Mở Hà Nội (400×487, nền trong suốt)
│  │  ├─ favicon.svg          Biểu tượng tab
│  │  └─ og-cover.png         Ảnh chia sẻ mạng xã hội (1200×630)
│  └─ docs/
│     └─ AI4SDF_2026_Paper_Template.doc   Template + hướng dẫn tác giả (bản gốc)
└─ .claude/launch.json        Cấu hình chạy thử cục bộ (không cần khi triển khai)
```

## 2. Chạy thử cục bộ

```bash
python -m http.server 5177 --directory "D:/dev/AI4SDF 2026"
```

Mở `http://localhost:5177`. (Mở thẳng bằng `file://` cũng chạy, chỉ khác là một số trình duyệt
chặn font Google Fonts khi ở giao thức file.)

## 3. Triển khai (dành cho bộ phận kỹ thuật)

**Yêu cầu hạ tầng: không có gì đặc biệt.** Đây là trang tĩnh thuần — không Node, không PHP, không
CSDL, không tiến trình nền, không biến môi trường. Bất kỳ máy chủ web nào phục vụ tệp tĩnh
(Apache, Nginx, IIS, hoặc hosting chia sẻ) đều chạy được.

```bash
git clone https://github.com/dtlong1979/AI4SDF2026.git
```

Rồi chép nội dung (trừ `.git/`, `README.md`) vào thư mục web, ví dụ `conf.hou.edu.vn/ai4sdf/`.
Mọi đường dẫn trong mã đều **tương đối**, nên đặt ở thư mục con vẫn chạy đúng, không cần rewrite
rule hay cấu hình base path.

### Cần lưu ý 5 điểm

1. **Sửa URL tuyệt đối nếu địa chỉ cuối khác dự kiến.** Trong `<head>` của `index.html` có
   `rel="canonical"`, `og:url` và `og:image` đang trỏ tới `https://conf.hou.edu.vn/ai4sdf/`.
   Ba dòng này **không** tự đổi theo nơi đặt — nếu triển khai ở địa chỉ khác thì phải sửa tay,
   nếu không ảnh xem trước khi chia sẻ Facebook/Zalo sẽ hỏng.
2. **Kiểu MIME cho `.doc`.** Apache/Nginx mặc định đã có. Riêng **IIS** có thể cần thêm ánh xạ
   `.doc → application/msword`, nếu không nút tải template sẽ trả lỗi 404.
3. **Bộ nhớ đệm — đọc kỹ mục này.** Máy chủ đang trả `Cache-Control: max-age=315360000`
   (**10 năm**) cho tệp tĩnh. Nghĩa là sau lần truy cập đầu, trình duyệt người dùng sẽ **không bao
   giờ tải lại** `style.css` và `main.js` nữa — cập nhật giao diện xong mà người xem vẫn thấy bản
   cũ, thậm chí vỡ bố cục vì HTML mới ghép với CSS cũ.

   Vì vậy hai tệp này được gọi kèm chuỗi phiên bản:
   `assets/css/style.css?v=20260828` và `assets/js/main.js?v=20260828`.

   > **Mỗi lần sửa `style.css` hoặc `main.js`, phải đổi con số `?v=` trong `index.html` và
   > `cfp.html`** (dùng ngày sửa, ví dụ `?v=20260915`). Quên bước này thì thay đổi sẽ không đến
   > được người dùng cũ.

   Ảnh cũng bị cache 10 năm. Khi thay ảnh, **đổi tên tệp** thay vì ghi đè.

4. **HTTPS.** Nên bật; trang không có nội dung tải qua `http://` nên không dính cảnh báo
   mixed-content.
5. **Google Fonts.** Ba họ chữ (Sora, Inter, JetBrains Mono) tải từ `fonts.googleapis.com` **về
   trình duyệt người xem**, không phải từ máy chủ — máy chủ không cần ra Internet. Nếu muốn tự
   chủ hoàn toàn: tải font về `assets/fonts/`, thay thẻ `<link>` trong `index.html` và `cfp.html`
   bằng `@font-face`. Giao diện đã khai báo sẵn font dự phòng nên không vỡ nếu font ngoài không
   tải được.

### ĐỪNG xoá đoạn cảm ơn Microsoft CMT ở chân trang

Cuối `index.html` có một đoạn văn bản cảm ơn dịch vụ Microsoft CMT. Đây là **điều kiện bắt buộc**
để dùng CMT miễn phí: CMT tự tải trang này về và **dò nguyên văn trong mã HTML**. Vì vậy:

- giữ **đúng từng chữ**, không dịch, không rút gọn, không in đậm/nghiêng;
- giữ ở dạng **HTML tĩnh** — nếu chuyển sang sinh bằng JavaScript thì máy dò của CMT sẽ không thấy;
- trang phải **truy cập công khai**, không đặt sau đăng nhập.

Xoá hoặc sửa đoạn này có thể khiến CMT khoá site quản lý phản biện của hội thảo.

### Không có phần nào cần backend

Việc nộp bài do **Microsoft CMT** đảm nhiệm, ở địa chỉ
`https://cmt3.research.microsoft.com/AISDF2026` — lưu ý viết tắt trên CMT là **AISDF**, rụng chữ
"4", đây không phải lỗi gõ. Trang web chỉ dẫn sang đó, không có biểu mẫu nào gửi dữ liệu lên máy
chủ, không thu thập thông tin cá nhân, không cookie, không script phân tích.

## 4. Sửa nội dung ở đâu

| Cần đổi | Sửa tại |
|---|---|
| Mốc thời gian hiển thị | `index.html` — mục `#dates`, mỗi `<li class="tl">` (đổi **cả** chữ hiển thị **và** thuộc tính `data-date`) |
| Ngày giờ đồng hồ đếm ngược | `assets/js/main.js` — hằng `CONFERENCE_START` ở đầu file |
| Chương trình | `index.html` — mục `#programme` |
| Diễn giả | `index.html` — mục `#speakers` |
| Chủ đề / tiểu chủ đề | `index.html` — mục `#tracks` |
| Liên hệ | `index.html` — mục `#contact` và phần chân trang |
| Bảng màu, cỡ chữ, bo góc | `assets/css/style.css` — mục **1. Tokens** ở đầu file |
| Thành phố / cung nối trên quả cầu | `assets/js/main.js` — hằng `CITIES` và `ARC_TO` (mục 6b) |
| Kích thước, vị trí quả cầu | `assets/css/style.css` — `.hero__object` |
| Tốc độ xoay quả cầu | `assets/js/main.js` — `yaw += 0.0015` ở cuối mục 6b |
| Template cho tác giả | thay tệp `assets/docs/AI4SDF_2026_Paper_Template.doc`; quy cách hiển thị ở khối `.tmpl` trong mục `#submit` và ở `cfp.html` |

Sửa mốc thời gian thì nhớ cập nhật **cả** `cfp.html` (bảng Important dates) và khối JSON-LD
`schema.org/Event` trong `<head>` của `index.html`.

## 5. Ảnh diễn giả

Đã có, **cắt sẵn về đúng khung 4:3** nên không cần điểm neo nào thêm:

| Tệp | Kích thước | Nguồn gốc |
|---|---|---|
| `assets/img/speaker-borromeo.jpg` | 900×675 | `RHB-1200x1500.jpg` — ảnh dọc, cắt 4:3 chừa khoảng đầu 12% |
| `assets/img/speaker-nantha.jpg` | 580×435 | `Dr-Nantha-4-…jpg` — ảnh ngang toàn thân, cắt quanh trục thân (x≈616) |

Ảnh gốc của thầy Nantha chỉ 1217×638 nên bản cắt hơi mềm trên màn hình retina — nếu xin được bản
độ phân giải cao hơn thì nên thay.

Muốn thay ảnh khác: cắt sẵn về 4:3 là xong. Nếu buộc phải dùng ảnh khác tỷ lệ, đặt điểm neo ở
`.speaker__portrait img.pf-head` / `.pf-figure` trong `style.css` (mục 12). Khi **thiếu tệp ảnh**,
trang tự thay bằng chữ lồng (RB / NK) trên nền chuyển sắc — không vỡ bố cục, không cần sửa mã.

## 6. Những mục còn chờ thông tin

- [ ] Ảnh thầy Nantha ở độ phân giải cao hơn (bản hiện tại nguồn chỉ 1217×638 — xem mục 5).
- [ ] Biểu tượng tab (`favicon.svg`) vẫn là hình khối AI4SDF tự thiết kế, **cố ý không dùng logo
      Trường**: con dấu nhiều chi tiết ở kích thước 16×16 px sẽ nhoè thành một vệt màu. Nếu muốn
      đổi, nên đặt làm bản logo rút gọn riêng cho favicon.
- [ ] Diễn giả toàn thể thứ ba (chương trình có 3 báo cáo chính; hiện để thẻ "To be announced").
- [ ] Địa điểm cụ thể tại Hà Nội (Call for Papers ghi "to be announced").
- [ ] **Xác nhận số thứ tự hội thảo.** Trang CMT ghi "**2nd** Artificial Intelligence & Data
      Science for a Sustainable Digital Future". Mục nộp bài trên web đã ghi "2nd", nhưng tiêu đề
      lớn ở hero và trang Call for Papers vẫn chỉ ghi "International Conference on…". Nếu đây đúng
      là lần thứ hai thì nên thống nhất — nói một câu là tôi sửa.
- [ ] Số ISBN của kỷ yếu (khi có).

## 7. Ghi chú về mốc thời gian

Tài liệu nguồn mâu thuẫn: **Call for Papers** ghi các mốc năm **2025** (hạn nộp 30/10/2025, hội
thảo 12/12/2025), trong khi **Kế hoạch tổ chức** ghi hội thảo **12/12/2026**. Theo chỉ đạo, trang
này dùng mốc **2026** cho tất cả:

| Mốc | Ngày |
|---|---|
| Hạn nộp toàn văn | 30/10/2026 |
| Thông báo chấp nhận | 01–15/11/2026 |
| Hạn đăng ký | 28/11/2026 |
| Ngày hội thảo | 12/12/2026 |

Nên cập nhật lại file Call for Papers gốc cho khớp trước khi phát hành rộng rãi.

## 8. Đã kiểm tra

- Bố cục ở 1440 px (desktop), 820 px (tablet), 390 px (mobile) — chụp bằng Chrome headless.
- Không có lỗi JavaScript trên console.
- `prefers-reduced-motion`: tắt toàn bộ hoạt ảnh, canvas vẽ tĩnh một lần.
- Bản in (`Ctrl+P`): ẩn nav/canvas/đếm ngược, mở sẵn toàn bộ chủ đề, chữ đen trên nền trắng.
- Khả năng truy cập: liên kết bỏ qua điều hướng, viền focus rõ, ảnh có `alt`, chủ đề dùng
  `<details>` nên vẫn mở/đóng được khi tắt JavaScript.
- Có `og-cover.png` + JSON-LD `schema.org/Event` để chia sẻ và lập chỉ mục.
