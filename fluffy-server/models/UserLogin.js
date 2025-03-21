const mongoose = require('mongoose');
const userLoginSchema = new mongoose.Schema({
  // ID người dùng tham chiếu đến User
  User_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Email người dùng
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  // Mật khẩu (đã hash)
  password: {
    type: String,
    required: true
  },
  
  // Tên hiển thị
  name: {
    type: String,
    trim: true
  },
  
  // ID từ dịch vụ OAuth (nếu có)
  OAuth_id: {
    type: String,
    default: null
  },
  
  // Nhà cung cấp OAuth (Facebook, Google, ...)
  Provider: {
    type: String,
    default: null
  },
  
  // Thời gian tạo và cập nhật
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Tự động tạo createdAt và updatedAt
  timestamps: false
});

// Tạo và xuất model từ schema
const UserLogin = mongoose.model('UserLogin', userLoginSchema);

module.exports = UserLogin;