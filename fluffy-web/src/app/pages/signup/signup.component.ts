import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true, 
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule, CommonModule, RouterModule] 
})
export class SignupComponent implements OnInit {
  /**
   * Email người dùng
   */
  email: string = '';
  
  /**
   * Mật khẩu
   */
  password: string = '';
  
  /**
   * Mật khẩu xác nhận
   */
  confirmPassword: string = '';
  
  /**
   * Trạng thái đồng ý điều khoản
   */
  agreeToTerms: boolean = false;
  
  /**
   * Trạng thái hiển thị mật khẩu
   */
  showPassword: boolean = false;
  
  /**
   * Trạng thái hiển thị mật khẩu xác nhận
   */
  showConfirmPassword: boolean = false;
  
  /**
   * Thông báo lỗi
   */
  errorMessage: string = '';
  
  /**
   * Trạng thái đang tải
   */
  isLoading: boolean = false;

  /**
   * Constructor
   * @param authService Service xử lý xác thực
   * @param router Router để điều hướng
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Khởi tạo component
   */
  ngOnInit(): void {
    // Nếu đã đăng nhập, chuyển hướng đến trang chính
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  /**
   * Chuyển đổi hiển thị mật khẩu (ẩn/hiện)
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Chuyển đổi hiển thị mật khẩu xác nhận (ẩn/hiện)
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Xử lý quy trình đăng ký
   */
  onSignup(): void {
    // Kiểm tra form hợp lệ
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      return;
    }
    
    // Kiểm tra định dạng email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Email không hợp lệ!';
      return;
    }
    
    // Kiểm tra mật khẩu khớp nhau
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không trùng khớp!';
      return;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (this.password.length < 6) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự!';
      return;
    }
    
    // Kiểm tra đồng ý với điều khoản
    if (!this.agreeToTerms) {
      this.errorMessage = 'Bạn cần đồng ý với điều khoản!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Gọi service đăng ký
    this.authService.signup({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        // Hiển thị thông báo thành công rồi chuyển hướng đến trang đăng nhập
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Xử lý khi đăng ký thất bại
        console.error('Lỗi đăng ký:', error);
        this.errorMessage = error.message || 'Đăng ký không thành công. Vui lòng thử lại!';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}