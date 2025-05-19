Nền Tảng Trò Chơi
Một nền tảng trò chơi trực tuyến bao gồm hai trò chơi: Line 98 và Caro. Được xây dựng với NestJS cho backend, MongoDB để lưu trữ dữ liệu, Socket.IO cho giao tiếp thời gian thực, và frontend sử dụng HTML, CSS, JavaScript.

Tính Năng

Xác Thực Người Dùng: Đăng ký, đăng nhập, và cập nhật hồ sơ (email, tên, tuổi, mật khẩu).
Trò Chơi:
Line 98: Trò chơi giải đố, người chơi xếp các bóng cùng màu để ghi điểm.
Caro: Trò chơi cờ caro trên lưới 30x30, hỗ trợ chơi đa người qua Socket.IO.


Chơi Thời Gian Thực: Socket.IO đảm bảo cập nhật trạng thái trò chơi mượt mà.

Công Nghệ

Backend: NestJS, Mongoose, Socket.IO
Frontend: HTML5, CSS3, JavaScript, Socket.IO Client
Cơ Sở Dữ Liệu: MongoDB (MongoDB Atlas)
Môi Trường: Node.js, Ngrok (tùy chọn để truy cập công khai)

Yêu Cầu
Trước khi cài đặt, hãy đảm bảo bạn có:

Node.js: Phiên bản 16.x trở lên (tải tại nodejs.org).
Tài Khoản MongoDB Atlas: Để lưu trữ dữ liệu trên đám mây (đăng ký tại mongodb.com).
Ngrok (tùy chọn): Để công khai ứng dụng (tải tại ngrok.com).

Cài Đặt

Tải Mã Nguồn: https://github.com/HHieu2003/game-line98andcaro.git

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
