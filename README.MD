# Giới thiệu
- Tên game: Bầu Cua
- Tác giả: Kỳ Viết Tool / Facebook: KA Tự Kỉ
- Ngôn ngữ lập trình: NodeJS
- Thư viện: ExpressJS & socket.io
- Phiên bản: 1.0.0

# Config server và game
- Thay đổi port của server tại dòng 22 của file "index.js"
- Thay đổi thời gian đặt cược và thời gian nghỉ giữa các phiên tại dòng 7 và 8 của file "baucua.js"
- Thay đổi số tiền khởi đầu cho mỗi người chơi / 1 client tại function addAccount, dòng 154 của file "baucua.js"

# Khởi chạy server
- Cài đặt NodeJS (Source code sử dụng v14.17.0)
- Source code đã bao gồm thư viện ExpressJS và socket.io
- Chạy server bằng cách mở cmd tại folder source code, sau đó gõ lệnh
```bash
node index.js
```

# Chơi game (client)
- Mở trình duyệt web, truy cập địa chỉ: localhost:8080 hoặc 127.0.0.1:8080 để chơi
- Để các máy trong mạng LAN chơi cùng nhau, mở cmd và gõ lệnh
```bash
ipconfig
```
=> Lấy IPv4, sau đó truy cập IP:8080 trên trình duyệt để chơi.
- **Lưu ý: Port 8080 thay đổi tuỳ theo bạn config trên server**

# Assets
- Assets được crawl từ game Bầu Cua trên CH Play
- File PSD để lấy toạ độ design UI nằm tại đường dẫn "www/assets/design.psd"