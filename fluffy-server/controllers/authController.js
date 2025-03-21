const User = require('../models/User');
const UserLogin = require('../models/UserLogin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

/**
 * Tạo JWT token từ thông tin người dùng
 * @param {Object} user Thông tin người dùng
 * @returns {string} JWT token
 */
const createToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'fluffy_secret_key',
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
    }
  );
};

/**
 * Tạo chuỗi cookies ngẫu nhiên
 * @returns {string} Chuỗi cookies
 */
const generateUserCookies = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

/**
 * Đăng ký tài khoản mới
 * @route POST /api/auth/signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
exports.signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp email và mật khẩu' 
      });
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không hợp lệ' 
      });
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu phải có ít nhất 6 ký tự' 
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email này đã được sử dụng' 
      });
    }

    // Tạo chuỗi cookies ngẫu nhiên
    const user_cookies = generateUserCookies();

    // Tạo mật khẩu hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({
      email,
      password: hashedPassword,
      user_cookies,
      role: 'user'
    });

    // Lưu vào database
    await newUser.save();

    // Tạo thông tin đăng nhập
    const userLogin = new UserLogin({
      User_id: newUser._id,
      email,
      password: hashedPassword,
      name: name || email.split('@')[0]
    });

    await userLogin.save();

    // Phản hồi thành công
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công'
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    next(error);
  }
};

/**
 * Đăng nhập
 * @route POST /api/auth/login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp email và mật khẩu' 
      });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Kiểm tra trạng thái tài khoản
    if (!user.active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Tài khoản của bạn đã bị vô hiệu hóa' 
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Cập nhật thời gian đăng nhập cuối cùng
    user.updatedAt = Date.now();
    await user.save();

    // Lấy thông tin user login
    const userLogin = await UserLogin.findOne({ User_id: user._id });
    const userName = userLogin ? userLogin.name : email.split('@')[0];

    // Tạo JWT token
    const token = createToken(user);

    // Phản hồi thành công với token và thông tin người dùng
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: userName
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    next(error);
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 * @route GET /api/auth/me
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
exports.getMe = async (req, res, next) => {
  try {
    // req.user được đặt từ middleware protect
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    // Lấy thông tin user login
    const userLogin = await UserLogin.findOne({ User_id: user._id });
    const userName = userLogin ? userLogin.name : user.email.split('@')[0];

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: userName,
        user_cookies: user.user_cookies,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    next(error);
  }
};

/**
 * Đăng nhập với mạng xã hội
 * @route POST /api/auth/social-login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
exports.socialLogin = async (req, res, next) => {
  try {
    const { email, name, provider, providerId } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !provider || !providerId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin đăng nhập' 
      });
    }

    // Tìm người dùng theo email
    let user = await User.findOne({ email });
    let userLogin;

    if (!user) {
      // Tạo chuỗi cookies ngẫu nhiên
      const user_cookies = generateUserCookies();

      // Tạo người dùng mới
      user = new User({
        email,
        password: await bcrypt.hash(Math.random().toString(36).substring(2), 10), // Mật khẩu ngẫu nhiên
        user_cookies,
        role: 'user'
      });

      await user.save();

      // Tạo thông tin đăng nhập với OAuth
      userLogin = new UserLogin({
        User_id: user._id,
        email,
        password: user.password,
        name: name || email.split('@')[0],
        OAuth_id: providerId,
        Provider: provider
      });

      await userLogin.save();
    } else {
      // Kiểm tra trạng thái tài khoản
      if (!user.active) {
        return res.status(401).json({ 
          success: false, 
          message: 'Tài khoản của bạn đã bị vô hiệu hóa' 
        });
      }

      // Cập nhật thông tin đăng nhập nếu đã tồn tại
      userLogin = await UserLogin.findOne({ User_id: user._id });
      
      if (userLogin) {
        userLogin.OAuth_id = providerId;
        userLogin.Provider = provider;
        await userLogin.save();
      } else {
        // Tạo mới nếu chưa có
        userLogin = new UserLogin({
          User_id: user._id,
          email,
          password: user.password,
          name: name || email.split('@')[0],
          OAuth_id: providerId,
          Provider: provider
        });
        await userLogin.save();
      }

      // Cập nhật thời gian đăng nhập cuối cùng
      user.updatedAt = Date.now();
      await user.save();
    }

    // Tạo JWT token
    const token = createToken(user);

    // Phản hồi thành công với token và thông tin người dùng
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: userLogin.name
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập mạng xã hội:', error);
    next(error);
  }
};

/**
 * Kiểm tra token hợp lệ
 * @route GET /api/auth/check-token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkToken = (req, res) => {
  // Middleware protect đã kiểm tra token trước khi đến đây
  // Nên nếu đã vào được đây nghĩa là token hợp lệ
  res.status(200).json({
    success: true,
    message: 'Token hợp lệ',
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    }
  });
};

/**
 * Đổi mật khẩu
 * @route POST /api/auth/change-password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' 
      });
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
      });
    }

    // Lấy thông tin người dùng từ database
    const user = await User.findById(req.user._id);

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Mật khẩu hiện tại không đúng' 
      });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    user.updatedAt = Date.now();
    await user.save();

    // Cập nhật cả trong bảng UserLogin
    const userLogin = await UserLogin.findOne({ User_id: user._id });
    if (userLogin) {
      userLogin.password = hashedPassword;
      userLogin.updatedAt = Date.now();
      await userLogin.save();
    }

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Lỗi đổi mật khẩu:', error);
    next(error);
  }
};

/**
 * Cập nhật thông tin cá nhân
 * @route PUT /api/auth/update-profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tên hiển thị'
      });
    }

    // Cập nhật thông tin trong UserLogin
    const userLogin = await UserLogin.findOne({ User_id: req.user._id });
    
    if (userLogin) {
      userLogin.name = name;
      userLogin.updatedAt = Date.now();
      await userLogin.save();
    } else {
      // Tạo mới nếu chưa có
      const newUserLogin = new UserLogin({
        User_id: req.user._id,
        email: req.user.email,
        password: req.user.password,
        name
      });
      await newUserLogin.save();
    }

    // Cập nhật thời gian cập nhật trong User
    await User.findByIdAndUpdate(req.user._id, { updatedAt: Date.now() });

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        name
      }
    });
  } catch (error) {
    console.error('Lỗi cập nhật thông tin:', error);
    next(error);
  }
};

/**
 * Quên mật khẩu (gửi email)
 * @route POST /api/auth/forgot-password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email'
      });
    }

    // Kiểm tra email tồn tại trong hệ thống
    const user = await User.findOne({ email });
    
    if (!user) {
      // Không thông báo cụ thể để bảo mật
      return res.status(200).json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu'
      });
    }

    // TODO: Gửi email đặt lại mật khẩu
    // Ở đây chỉ mô phỏng việc gửi email
    console.log(`Gửi hướng dẫn đặt lại mật khẩu đến email: ${email}`);

    // Trả về thông báo thành công (ngay cả khi email không tồn tại, để bảo mật)
    res.status(200).json({
      success: true,
      message: 'Nếu email tồn tại trong hệ thống, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu'
    });
  } catch (error) {
    console.error('Lỗi quên mật khẩu:', error);
    next(error);
  }
};