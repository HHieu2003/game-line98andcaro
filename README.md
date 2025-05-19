# 🕹️ Nền Tảng Trò Chơi Trực Tuyến: Line 98 & Caro

Một nền tảng trò chơi trực tuyến bao gồm hai trò chơi phổ biến: **Line 98** và **Caro**. Hệ thống được xây dựng với NestJS cho backend, MongoDB để lưu trữ dữ liệu, Socket.IO cho giao tiếp thời gian thực, và giao diện người dùng sử dụng HTML, CSS, và JavaScript.

---

## 🚀 Tính Năng

- **Xác Thực Người Dùng**:
  - Đăng ký tài khoản
  - Đăng nhập
  - Cập nhật hồ sơ (email, tên, tuổi, mật khẩu)

- **Trò Chơi**:
  - 🎯 **Line 98**: Trò chơi giải đố, xếp các bóng cùng màu để ghi điểm.
  - ❌ **Caro**: Trò chơi cờ caro trên lưới 30x30, hỗ trợ nhiều người chơi qua Socket.IO.

- **Chơi Thời Gian Thực**: 
  - Socket.IO đảm bảo cập nhật trạng thái trò chơi mượt mà, không cần tải lại trang.

---

## 🧰 Công Nghệ Sử Dụng

| Thành phần     | Công nghệ                     |
|----------------|-------------------------------|
| Backend        | NestJS, Socket.IO, Mongoose   |
| Frontend       | HTML5, CSS3, JavaScript       |
| Cơ sở dữ liệu  | MongoDB (MongoDB Atlas)       |
| Giao tiếp thời gian thực | Socket.IO           |
| Môi trường     | Node.js, Ngrok (tuỳ chọn)     |

---

## 📦 Yêu Cầu Cài Đặt

Trước khi cài đặt, bạn cần đảm bảo:

- ✅ Node.js phiên bản 16.x trở lên ([Tải Node.js](https://nodejs.org))
- ✅ Tài khoản MongoDB Atlas ([Đăng ký MongoDB](https://www.mongodb.com))
- ✅ (Tuỳ chọn) Tài khoản Ngrok để public ứng dụng ([Đăng ký Ngrok](https://ngrok.com))

---

## 💾 Cài Đặt

### 1. Tải Mã Nguồn
```bash
git clone https://github.com/HHieu2003/game-line98andcaro.git
```

Thiết Lập MongoDB:

Tạo một cluster trên MongoDB Atlas và lấy URI kết nối.
URI có dạng:mongodb+srv://<username>:<password>@cluster0.9lok5.mongodb.net/gametest?retryWrites=true&w=majority

Biến Môi Trường
Tạo tệp .env trong thư mục gốc và thêm các biến sau:
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.9lok5.mongodb.net/gametest?retryWrites=true&w=majority
JWT_SECRET=your-strong-secret

PORT: Cổng chạy backend (mặc định: 3000).
MONGO_URI: Chuỗi kết nối MongoDB Atlas.
JWT_SECRET: Chuỗi bí mật để ký JWT (thay your-strong-secret bằng chuỗi ngẫu nhiên, ví dụ: a1b2c3d4e5f6g7h8i9j0).

Lưu ý: Nếu dùng Ngrok để truy cập công khai, thêm:
NGROK_URL=https://your-ngrok-url.ngrok-free.app

Tuy nhiên, bạn có thể bỏ qua nếu dùng URL tương đối (xem Chạy Ứng Dụng).
Chạy Ứng Dụng

Khởi Động Backend:
npm run start

Backend sẽ chạy trên http://localhost:3000.

Truy Cập Ứng Dụng:

Mở trình duyệt và truy cập http://localhost:3000.
