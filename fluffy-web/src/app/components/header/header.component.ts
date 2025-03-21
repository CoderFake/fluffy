import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CartComponent } from '../cart/cart.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isUserMenuOpen: boolean = false;
  cartItemCount: number = 0;
  isScrolled: boolean = false;
  userName: string = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Đăng ký lắng nghe số lượng sản phẩm trong giỏ hàng
    this.cartService.getCartItemCount().subscribe((count: number) => {
      this.cartItemCount = count;
    });

    // Đăng ký lắng nghe trạng thái đăng nhập
    this.authService.loggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      // Nếu đã đăng nhập, lấy tên người dùng
      if (loggedIn) {
        this.userName = this.authService.getUserName();
      }
    });

    // Kiểm tra trạng thái đăng nhập ban đầu
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.authService.getUserName();
    }
  }

  // Theo dõi sự kiện cuộn trang
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
   
    // Thêm class vào body để có thể tạo style khác khi cuộn
    if (this.isScrolled) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  navigateToAccountSettings() {
    this.router.navigate(['/account-settings']);
  }

  openCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.toggleCart();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    // Sử dụng AuthService để đăng xuất
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.router.navigate(['/']);
  }
}