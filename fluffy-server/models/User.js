const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Định nghĩa schema cho User
 */
const userSchema = new mongoose.Schema({
  // Email người dùng, bắt buộc và phải là duy nhất
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true, // Chuyển email về chữ thường
    trim: true,      // Loại bỏ khoảng trắng thừa
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email không hợp lệ']
  },
  
  // Mật khẩu người dùng, bắt buộc và có độ dài tối thiểu
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    maxlength: [100, 'Mật khẩu quá dài'] // Đảm bảo đủ độ dài cho hash bcrypt
  },
  
  // Cookie để nhận dạng người dùng, unique
  user_cookies: {
    type: String,
    required: true,
    unique: true
  },
  
  // Vai trò của người dùng: user (mặc định) hoặc admin
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Trạng thái tài khoản (active/inactive)
  active: {
    type: Boolean,
    default: true
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

// userSchema.pre('save', async function(next) {
//   // Chỉ hash mật khẩu nếu nó được sửa đổi hoặc mới
//   if (!this.isModified('password')) return next();
//   
//   try {
//     // Tạo salt với độ phức tạp 10
//     const salt = await bcrypt.genSalt(10);
//     
//     // Hash mật khẩu với salt
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

/**
 * Method kiểm tra mật khẩu có đúng không
 * @param {string} candidatePassword Mật khẩu người dùng nhập vào
 * @returns {Promise<boolean>} Kết quả so sánh
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('So sánh mật khẩu trong model User');
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    console.error('Lỗi khi so sánh mật khẩu:', error);
    return false; // Trả về false nếu có lỗi
  }
};

/**
 * Method cập nhật thời gian đăng nhập cuối cùng
 * @returns {Promise<User>} User document sau khi cập nhật
 */
userSchema.methods.updateLastLogin = async function() {
  this.updatedAt = Date.now();
  return this.save();
};

/**
 * Method kiểm tra người dùng có phải admin không
 * @returns {boolean} true nếu là admin, false nếu không
 */
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Tạo và xuất model từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;