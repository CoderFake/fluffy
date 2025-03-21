/**
 * Auth Middleware
 * Xử lý xác thực JWT và phân quyền người dùng
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware bảo vệ route, yêu cầu xác thực JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Kiểm tra xem có token trong header không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];
    }

    // Nếu không có token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập.'
      });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fluffy_secret_key');

    // Tìm người dùng từ id trong token
    const currentUser = await User.findById(decoded.userId);

    // Kiểm tra nếu không tìm thấy người dùng
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (!currentUser.active) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản của bạn đã bị vô hiệu hóa'
      });
    }

    // Thêm thông tin người dùng vào request
    req.user = currentUser;
    next();
  } catch (error) {
    // Xử lý lỗi token không hợp lệ hoặc hết hạn
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    } 
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại'
      });
    }

    // Các lỗi khác
    return res.status(401).json({
      success: false,
      message: 'Xác thực không thành công'
    });
  }
};

/**
 * Middleware kiểm tra quyền người dùng
 * @param {...String} roles - Các vai trò được phép
 * @returns {Function} Middleware function
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Kiểm tra xem người dùng hiện tại có role phù hợp không
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này'
      });
    }
    
    next();
  };
};