const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * Route đăng ký tài khoản mới
 * POST /api/auth/signup
 */
router.post('/signup', authController.signup);

/**
 * Route đăng nhập
 * POST /api/auth/login
 */
router.post('/login', authController.login);

/**
 * Route đăng nhập qua mạng xã hội
 * POST /api/auth/social-login
 */
router.post('/social-login', authController.socialLogin);

/**
 * Route lấy thông tin người dùng hiện tại
 * GET /api/auth/me
 * Yêu cầu xác thực
 */
router.get('/me', protect, authController.getMe);

/**
 * Route kiểm tra token hợp lệ
 * GET /api/auth/check-token
 * Yêu cầu xác thực
 */
router.get('/check-token', protect, authController.checkToken);

/**
 * Route đổi mật khẩu
 * POST /api/auth/change-password
 * Yêu cầu xác thực
 */
router.post('/change-password', protect, authController.changePassword);

/**
 * Route cập nhật thông tin cá nhân
 * PUT /api/auth/update-profile
 * Yêu cầu xác thực
 */
router.put('/update-profile', protect, authController.updateProfile);

/**
 * Route quên mật khẩu
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * Route chỉ dành cho admin
 * GET /api/auth/admin
 * Yêu cầu xác thực và quyền admin
 */
router.get('/admin', protect, restrictTo('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bạn có quyền truy cập trang admin'
  });
});

module.exports = router;