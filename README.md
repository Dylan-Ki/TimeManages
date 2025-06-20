# Time Manager - Ứng dụng Quản lý Thời gian

## Mô tả
Time Manager là một ứng dụng web toàn diện để quản lý thời gian hiệu quả, tích hợp nhiều tính năng hữu ích:

- **Đồng hồ thời gian thực**: Hiển thị thời gian analog và digital
- **Đếm ngược tùy chỉnh**: Thiết lập bộ đếm ngược theo ý muốn
- **Pomodoro Timer**: Áp dụng kỹ thuật Pomodoro linh hoạt
- **Lịch tháng**: Xem lịch và theo dõi ngày tháng

## Tính năng chính

### 🕐 Đồng hồ thời gian thực
- Hiển thị đồng hồ analog với kim giờ, phút, giây
- Thời gian digital và ngày tháng hiện tại
- Cập nhật theo thời gian thực

### ⏱️ Đếm ngược tùy chỉnh
- Thiết lập thời gian đếm ngược (giờ, phút, giây)
- Thanh tiến trình trực quan
- Thông báo khi hoàn thành
- Chức năng tạm dừng và tiếp tục

### 🍅 Pomodoro Timer
- Cài đặt linh hoạt thời gian làm việc và nghỉ ngơi
- Tự động chuyển đổi giữa các giai đoạn
- Theo dõi chu kỳ làm việc
- Nghỉ ngắn và nghỉ dài tùy chỉnh

### 📅 Lịch tháng
- Hiển thị lịch tháng đầy đủ
- Đánh dấu ngày hiện tại
- Điều hướng qua các tháng
- Thông tin ngày tháng chi tiết

## Cách sử dụng

### Khởi chạy ứng dụng
1. Mở terminal/command prompt
2. Điều hướng đến thư mục `time-change`
3. Chạy lệnh: `python -m http.server 8001`
4. Mở trình duyệt và truy cập: `http://localhost:8001`

### Sử dụng Đếm ngược
1. Nhập thời gian mong muốn (giờ, phút, giây)
2. Nhấn "Bắt đầu" để khởi động
3. Sử dụng "Tạm dừng" để dừng tạm thời
4. Nhấn "Đặt lại" để reset về 0

### Sử dụng Pomodoro
1. Cài đặt thời gian làm việc và nghỉ ngơi
2. Thiết lập số chu kỳ trước khi nghỉ dài
3. Nhấn "Bắt đầu" để bắt đầu chu kỳ Pomodoro
4. Ứng dụng sẽ tự động chuyển đổi giữa các giai đoạn

### Sử dụng Lịch
- Sử dụng nút "‹" và "›" để điều hướng qua các tháng
- Ngày hiện tại được đánh dấu màu đỏ
- Hover vào các ngày để xem hiệu ứng tương tác

## Tính năng nâng cao

### Thông báo
- Ứng dụng sẽ yêu cầu quyền thông báo
- Nhận thông báo khi đếm ngược hoặc Pomodoro hoàn thành
- Thông báo chuyển giai đoạn trong Pomodoro

### Responsive Design
- Tối ưu cho cả desktop và mobile
- Giao diện thích ứng với nhiều kích thước màn hình
- Hiệu ứng animation mượt mà

### Lưu trữ cài đặt
- Cài đặt Pomodoro được lưu tự động
- Khôi phục trạng thái khi reload trang

## Công nghệ sử dụng
- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling và animations
- **JavaScript**: Logic ứng dụng và tương tác
- **Web APIs**: Notifications, Local Storage

## Tùy chỉnh

Bạn có thể tùy chỉnh ứng dụng bằng cách:
- Thay đổi màu sắc trong CSS variables (`:root`)
- Điều chỉnh thời gian mặc định trong JavaScript
- Thêm âm thanh thông báo
- Tích hợp với các API khác

## Hỗ trợ trình duyệt
- Chrome/Chromium (khuyến nghị)
- Firefox
- Safari
- Edge

## Lưu ý
- Cần quyền thông báo để nhận alerts
- Hoạt động tốt nhất trên các trình duyệt hiện đại
- Không cần kết nối internet sau khi tải

---

**Phát triển bởi**: dyl-and team
**Phiên bản**: 1.0.0  
**Cập nhật**: 21/6/2025
