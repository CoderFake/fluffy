const mongoose = require('mongoose');
const initializeDatabase = require('../init-database');

/**
 * Kết nối đến MongoDB
 * @returns {Promise<boolean>} Kết quả kết nối
 */
async function connect() {
  try {
    console.log('Đang kết nối đến MongoDB với URI:', process.env.MONGO_URI);
    
    // Thêm các tùy chọn kết nối
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Kết nối thành công đến MongoDB');
    
    // Khởi tạo cơ sở dữ liệu
    await initializeDatabase(connection.connection.db);
    
    return true;
  } catch (error) {
    console.error('Lỗi kết nối đến MongoDB:', error.message);
    return false;
  }
}

/**
 * Đóng kết nối đến MongoDB
 * @returns {Promise<void>}
 */
async function disconnect() {
  try {
    await mongoose.disconnect();
    console.log('Đã đóng kết nối đến MongoDB');
  } catch (error) {
    console.error('Lỗi khi đóng kết nối MongoDB:', error.message);
  }
}

// Sự kiện kết nối
mongoose.connection.on('connected', () => {
  console.log('Mongoose đã kết nối thành công');
});

// Sự kiện mất kết nối
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose đã mất kết nối');
});

// Sự kiện lỗi
mongoose.connection.on('error', (err) => {
  console.error('Lỗi kết nối Mongoose:', err.message);
});

// Xử lý khi process kết thúc
process.on('SIGINT', async () => {
  await disconnect();
  console.log('Đã đóng kết nối Mongoose do ứng dụng kết thúc');
  process.exit(0);
});

module.exports = { 
  connect,
  disconnect
};