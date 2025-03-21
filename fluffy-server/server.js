const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product.router');

// Cấu hình biến môi trường
dotenv.config();

// Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Kết nối đến MongoDB
const db = require('./config/db');
db.connect()
  .then(() => console.log('MongoDB kết nối thành công'))
  .catch(err => {
    console.error('Lỗi kết nối MongoDB:', err);
    process.exit(1);
  });

// Middleware
app.use(cors()); // Cho phép CORS
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/products', productRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.send('Fluffy API đang hoạt động');
});

// Route không tồn tại
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại'
  });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Lỗi server, vui lòng thử lại sau',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Xử lý sự kiện không bắt được ngoại lệ
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Xử lý sự kiện promise bị reject nhưng không được bắt
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});