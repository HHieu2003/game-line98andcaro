# 🎩 Nền Tảng Trò Chơi Trực Tuyến: Line 98 & Caro

Một nền tảng trò chơi trực tuyến bao gồm hai trò chơi phổ biến: **Line 98** và **Caro**. Hệ thống được xây dựng với **NestJS** cho backend, **MongoDB** để lưu trữ dữ liệu, **Socket.IO** cho giao tiếp thời gian thực, và giao diện người dùng sử dụng **HTML, CSS, JavaScript**.

---

## 🚀 Tính Năng

### ✔️ Xác Thực Người Dùng
- 📅 Đăng ký tài khoản
- 🔑 Đăng nhập
- ✏️ Cập nhật hồ sơ (email, tên, tuổi, mật khẩu)

### 🎯 Trò Chơi
- 🎯 **Line 98**: Trò chơi giải đố, xếp các bóng cùng màu để ghi điểm
- ❌ **Caro**: Trò chơi cờ caro trên lưới 30x30, hỗ trợ chơi đa người qua Socket.IO

### ⏳ Chơi Thời Gian Thực
- Socket.IO đảm bảo cập nhật trạng thái trò chơi mượt mà, không cần tải lại trang

### 💻 Giao Diện Thân Thiện
- Thiết kế hiện đại, tương thích với mọi trình duyệt phổ biến (Chrome, Edge, Firefox, v.v.)


## 🧰 Công Nghệ Sử Dụng

| Thành phần                | Công nghệ                    |
|-------------------------|------------------------------|
| Backend                 | NestJS, Socket.IO, Mongoose  |
| Frontend                | HTML5, CSS3, JavaScript      |
| Cơ sở dữ liệu         | MongoDB (MongoDB Atlas)     |        
| Môi trường                | Node.js, Ngrok (tùy chọn)     |

---

## 📦 Yêu Cầu Cài Đặt

Trước khi cài đặt, hãy đảm bảo bạn đã cài:

- ✅ Node.js v16+ ([Tải Node.js](https://nodejs.org))
- ✅ Tài khoản MongoDB Atlas ([Đăng ký MongoDB](https://mongodb.com))
- ✅ Ngrok (tuỳ chọn) ([Đăng ký Ngrok](https://ngrok.com))

---

## 💾 Cài Đặt

### 1. Tải Mã Nguồn
```bash
git clone https://github.com/HHieu2003/game-line98andcaro.git
cd game-line98andcaro
```

### 22. Thiết Lập MongoDB
- Tạo cluster trong MongoDB Atlas
- Lấy URI:

```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/gametest?retryWrites=true&w=majority
```

### 33. Tạo Biến Môi Trường
Tạo file `.env`:

```
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gametest?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0
```

(Nếu dùng Ngrok):
```
NGROK_URL=https://your-ngrok-url.ngrok-free.app
```

---

## 🚀 Chạy Ứng Dụng

### 1. Khởi Động Backend
```bash
npm run start
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 2. Truy Cập Frontend
Mở trình duyệt và truy cập trang:
```url
http://localhost:3000
```

### 3. (Tuỳ chọn) Dùng Ngrok
```bash
ngrok http 3000
```

### 📷 Ảnh DemoDemo

## Giao diện Chính

![Giao diện chính](images/giaodien1.png)

## Trò Chơi Line 98

![Line 98 Gameplay](images/giaodien2.png)

## Trò Chơi Caro

![Caro Gameplay](images/giaodien3.png)
