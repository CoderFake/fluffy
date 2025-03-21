import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /**
   * Email người dùng
   */
  email: string = '';
  
  /**
   * Mật khẩu
   */
  password: string = '';
  
  /**
   * Trạng thái ghi nhớ đăng nhập
   */
  rememberMe: boolean = false;
  
  /**
   * Trạng thái hiển thị mật khẩu
   */
  showPassword: boolean = false;
  
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
    // Kiểm tra xem đã có email được lưu trước đó không
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
    
    // Nếu đã đăng nhập, chuyển hướng đến trang chính
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Chuyển đổi hiển thị mật khẩu (ẩn/hiện)
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Xử lý quá trình đăng nhập
   * @param event Sự kiện form submit
   */
  onLogin(event: Event): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    this.isLoading = true;
    this.errorMessage = '';

    // Kiểm tra form hợp lệ
    if (!this.email || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ email và mật khẩu';
      this.isLoading = false;
      return;
    }

    // Gọi service đăng nhập
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        // Lưu remember me nếu được chọn
        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Chuyển hướng đến trang home
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Lỗi đăng nhập:', error);
        this.errorMessage = error.message || 'Email hoặc mật khẩu không đúng, vui lòng thử lại!';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}