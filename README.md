# BEE MỐC — Frontend Redesign

## Chạy local
1. Khởi động FastAPI backend tại `http://127.0.0.1:8000`.
2. Mở thư mục `frontend` bằng VS Code và chạy `index.html` với Live Server (cổng 5500 hoặc 5501 đều được).
3. Frontend local tự sử dụng API base `http://127.0.0.1:8000`.

## Trang
- `index.html`: đăng nhập / đăng ký
- `dashboard.html`: tổng quan
- `library.html`: thư viện, tải tài liệu, xem câu hỏi
- `practice.html`: tạo đề, làm bài, đếm giờ, nộp bài
- `analytics.html`: Mastery, Review Queue, lịch sử
- `profile.html`: hồ sơ

## API
Các endpoint được dùng theo Backend BEE MỐC A1–A5 hiện tại. Frontend không yêu cầu thay đổi schema hay chạy migration.

Lưu ý: Google Fonts yêu cầu kết nối Internet; nếu offline, trình duyệt dùng font sans-serif dự phòng.
