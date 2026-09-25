/**
 * ====================================================================
 * FILE CẤU HÌNH TRANG WEB KỶ NIỆM TÌNH YÊU
 * Bạn có thể dễ dàng thay đổi mọi thông tin ở đây mà không cần sửa code!
 * ====================================================================
 */

const CONFIG = {
  // --- 1. MÃ PIN VÀ MÀN HÌNH KHÓA ---
  passcode: "2507", // Mã PIN 4 số (Ví dụ: 2507 - Ngày bắt đầu tìm hiểu)
  hintInitial: "Gợi ý: Ngày mà hai đứa bắt đầu tìm hiểu nhau đó! (DD/MM) 🌸",
  wrongCodeMessages: [
    "Ủa ủa, nhớ lại xem nào! 🧐",
    "Sai rồi nha, ngày quan trọng vậy mà quên hả ta? 🥺",
    "Thử lại đi nè, có 4 chữ số thui đó! 😜",
    "Gợi ý to đùng: Ngày 25 tháng mấy nè? 💖",
    "Quên ngày này là tớ giận thiệt đó nha! 😤💔"
  ],

  // --- 2. CÂU HỎI LÉM LỈNH (MÀN 2) ---
  question: {
    title: "Em có iu tôi không? 💖",
    subtitle: "Nghĩ kỹ trước khi trả lời nha, suy nghĩ kỹ vào đó!",
    yesBtn: "Dạ có iu nhìu lắmmm 🥰",
    noBtn: "Không hề nha 😝",
    noEscapeMessages: [
      "Đố bắt được nút này đó! 😝",
      "Nút này bị hư rồi không bấm được đâu! 😜",
      "Ủa bấm không được nè hihi! 🏃‍♂️💨",
      "Chỉ có một lựa chọn thôi hà! 🥰",
      "Đừng cố chấp nữa mà, chọn nút bên kia đi! ❤️",
      "Bắt được tặng 100 nụ hôn lun nè! 💋"
    ]
  },

  // --- 3. QUÀ TẶNG BÍ MẬT & HỘP QUÀ 3D (BƯỚC 3.1) ---
  gift: {
    title: "Món Quà Bất Ngờ Dành Cho Cậu 🌸",
    hint: "Chạm nhẹ vào hộp quà để mở điều bí mật bên trong nhé!",
    heartMessage: "Trái tim này thuộc về cậu ❤️",
    nextBtn: "Món quà tiếp theo dành cho cậu ➜"
  },

  // --- 4. HÀNH TRÌNH KỶ NIỆM 2 THÁNG (BƯỚC 3.2) ---
  milestone: {
    startDate: "2026-07-25T00:00:00", // Ngày bắt đầu tìm hiểu
    endDate: "2026-09-25T23:59:59",   // Mốc kỷ niệm 2 tháng
    title: "25/07 – 25/09",
    subtitle: "Kỷ Niệm 2 Tháng Tìm Hiểu Cùng Nhau ✨",
    loveLetter: `Thấm thoát mà đã tròn 2 tháng kể từ ngày 25/7 - ngày đầu tiên hai đứa bắt đầu trò chuyện và tìm hiểu nhau rồi nhỉ!

Cảm ơn cậu vì đã luôn kiên nhẫn, mang đến thật nhiều tiếng cười và sự dịu dàng trong suốt những ngày tháng qua. Mỗi khoảnh khắc được lắng nghe cậu kể chuyện, cùng chia sẻ những điều nhỏ nhặt trong ngày đều làm tớ cảm thấy ấm áp và hạnh phúc vô cùng.

2 tháng không phải là một thời gian quá dài, nhưng đủ để tớ nhận ra cậu quan trọng với tớ nhường nào. Cùng nhau viết tiếp những chương tiếp theo thật đẹp nhé! 💕`,
    nextBtn: "Gửi gắm lời yêu thương ➜"
  },

  // --- 5. HỘP PHẢN HỒI & TÍCH HỢP TELEGRAM BOT (BƯỚC 3.3) ---
  telegram: {
    // Để nhận tin nhắn ngay về Telegram cá nhân:
    // 1. Chat với @BotFather để tạo bot và lấy BOT_TOKEN
    // 2. Chat với @userinfobot để lấy CHAT_ID của bạn
    // Điền token và chat ID vào bên dưới:
    botToken: "", // Ví dụ: "123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
    chatId: "",   // Ví dụ: "987654321"
    
    // Nếu bạn chưa kịp tạo Bot Telegram, web vẫn hoạt động trơn tru 
    // và lưu tin nhắn lại vào trình duyệt để bạn đọc sau!
  },

  // --- 6. NHẠC NỀN & HIỆU ỨNG ÂM THANH ---
  bgm: {
    // Link nhạc nền nhẹ nhàng lãng mạn (mp3 online)
    url: "https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1033.mp3",
    autoPlayOnUnlock: true
  }
};

// Đảm bảo có thể truy xuất trên toàn ứng dụng
window.LOVE_CONFIG = CONFIG;
