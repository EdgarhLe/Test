# Hướng Dẫn Sử Dụng Web Kỷ Niệm Tình Yêu (25/7 - 25/9) ❤️

Trang web kỷ niệm tình yêu được thiết kế đặc biệt gồm 3 phân đoạn trải nghiệm:
1. **Màn hình khóa bảo mật (Lockscreen Gate)**: Mô phỏng điện thoại iPhone/Android với bàn phím số, âm thanh click và rung phản hồi.
2. **Màn khảo sát lém lỉnh ("Em có iu tôi không?")**: Nút "Không" né tránh nhảy ngẫu nhiên mỗi khi định chạm vào, chỉ có thể bấm nút "Có".
3. **Màn hình chính (Dashboard Hub)**:
   - *Bước 1*: Vườn hoa ảo nở rộ tự nhiên + Hộp quà 3D mở nắp bung trái tim đập nhịp.
   - *Bước 2*: Cột mốc **25/7 – 25/9 (2 tháng tìm hiểu)** với đồng hồ đếm thời gian thực và bức thư tình ngọt ngào.
   - *Bước 3*: Hộp phản hồi (Feedback Box) tự động gửi tin nhắn về **Telegram Bot cá nhân** của bạn ngay tức thì.

---

## 🚀 1. Cách Mở Và Xem Thử Ngay Lập Tức

- Bạn chỉ cần **nhấp đúp chuột vào file `index.html`** để mở trực tiếp trên trình duyệt (Google Chrome, Microsoft Edge, Cốc Cốc, Safari...).
- Hoặc mở thư mục này bằng VS Code rồi chọn **Open with Live Server**.
- Mật mã mở khóa mặc định: **`2507`** (Ngày 25 tháng 7).

---

## ⚙️ 2. Tùy Chỉnh Thông Tin Trong `config.js`

Toàn bộ thông tin được tách biệt trong file [`config.js`](file:///e:/acdm/config.js):

- **Đổi mã PIN**: Sửa dòng `passcode: "2507"` thành 4 số bất kỳ bạn muốn.
- **Đổi câu hỏi / câu trêu chọc**: Thay đổi nội dung trong mục `question`.
- **Đổi thư tình kỷ niệm**: Chỉnh sửa lời chúc trong mục `milestone.loveLetter`.
- **Đổi nhạc nền**: Thay đường link bài hát mp3 trong mục `bgm.url`.

---

## 🤖 3. Hướng Dẫn 2 Phút Nhận Tin Nhắn Qua Telegram Bot

Để khi người ấy gõ lời nhắn phản hồi ở màn cuối, tin nhắn sẽ **ting ting bay thẳng về Telegram cá nhân** của bạn:

### Bước 1: Tạo Bot Telegram
1. Mở ứng dụng Telegram, tìm kiếm **`@BotFather`** (có tích xanh).
2. Gửi lệnh `/newbot` rồi đặt tên cho Bot (ví dụ: `KyNiem2ThangBot`).
3. Đặt username kết thúc bằng chữ `bot` (ví dụ: `kyniem_tinhyeu_bot`).
4. `@BotFather` sẽ gửi lại cho bạn một chuỗi **HTTP API Token** (dạng `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`).

### Bước 2: Lấy Chat ID của bạn
1. Tìm kiếm bot **`@userinfobot`** trên Telegram và bấm `/start`.
2. Bot sẽ gửi lại thông tin của bạn, hãy copy dãy số tại dòng **`Id`** (ví dụ: `987654321`).
3. Mở bot của bạn (vừa tạo ở Bước 1) và bấm `/start` một lần để cho phép bot gửi tin nhắn cho bạn.

### Bước 3: Điền vào `config.js`
Mở file `config.js`, tìm đến mục `telegram` và điền vào:
```javascript
telegram: {
  botToken: "123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ", // Token từ @BotFather
  chatId: "987654321"                                // ID từ @userinfobot
}
```

> **Ghi chú**: Nếu bạn chưa kịp cài đặt Telegram Bot, trang web **vẫn hoạt động trơn tru 100%** và tự động lưu lại các tin nhắn vào bộ nhớ trình duyệt (`localStorage`) để bạn không bị lỡ mất lời nhắn của người ấy!

---

## 🌐 4. Cách Đăng Web Lên Mạng Miễn Phí Để Gửi Link Cho Người Ấy

Bạn có thể đưa trang web lên mạng hoàn toàn miễn phí chỉ trong 1 phút bằng một trong hai cách:

1. **Dùng Vercel (Khuyên dùng - Rất nhanh)**:
   - Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng GitHub/Google.
   - Kéo thả cả thư mục `acdm` vào trang Vercel là bạn sẽ có ngay một link web dạng `https://ten-du-an.vercel.app` để gửi cho người ấy.
2. **Dùng Netlify Drop**:
   - Truy cập [app.netlify.com/drop](https://app.netlify.com/drop).
   - Kéo thả toàn bộ thư mục `acdm` vào khung tròn là có link ngay lập tức.
3. **Dùng GitHub Pages**:
   - Đẩy mã nguồn lên một repo GitHub mới và bật GitHub Pages trong phần Settings -> Pages.
