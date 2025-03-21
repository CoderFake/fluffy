import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Interface định nghĩa cấu trúc dữ liệu User
 */
export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

/**
 * Interface định nghĩa cấu trúc dữ liệu đăng nhập
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface định nghĩa cấu trúc dữ liệu đăng ký
 */
export interface SignupRequest {
  email: string;
  password: string;
}

/**
 * Interface định nghĩa cấu trúc dữ liệu phản hồi sau khi đăng nhập
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * URL của API backend
   * @private
   */
  private apiUrl = 'http://localhost:4000/api/auth';
  
  /**
   * Key lưu trữ token trong localStorage
   * @private
   */
  private readonly TOKEN_KEY = 'auth_token';
  
  /**
   * Key lưu trữ thông tin user trong localStorage
   * @private
   */
  private readonly USER_KEY = 'auth_user';
  
  /**
   * BehaviorSubject để theo dõi trạng thái đăng nhập
   */
  private loggedInStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  
  /**
   * Observable để components khác có thể subscribe
   */
  public loggedIn$ = this.loggedInStatus.asObservable();

  /**
   * Constructor - Inject HttpClient
   * @param http HttpClient để gọi API
   */
  constructor(private http: HttpClient) { }

  /**
   * Đăng ký tài khoản mới
   * @param userData Thông tin đăng ký (email, password)
   * @returns Observable chứa kết quả đăng ký
   */
  signup(userData: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Đăng nhập vào hệ thống
   * @param credentials Thông tin đăng nhập (email, password)
   * @returns Observable chứa kết quả đăng nhập (token và thông tin user)
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            this.saveUserData(response.token, response.user);
            this.loggedInStatus.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Lưu thông tin người dùng và token vào localStorage
   * @param token JWT token từ server
   * @param user Thông tin người dùng
   */
  saveUserData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Lấy token từ localStorage
   * @returns Token đăng nhập hoặc null nếu chưa đăng nhập
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Lấy thông tin người dùng đã đăng nhập
   * @returns Thông tin User hoặc null nếu chưa đăng nhập
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Kiểm tra xem người dùng đã đăng nhập hay chưa
   * @returns true nếu đã đăng nhập, false nếu chưa
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Đăng xuất khỏi hệ thống
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.loggedInStatus.next(false);
  }

  /**
   * Lấy tên người dùng từ email
   * @returns Tên người dùng (phần trước @ trong email)
   */
  getUserName(): string {
    const user = this.getCurrentUser();
    if (user && user.email) {
      return user.email.split('@')[0];
    }
    return '';
  }

  /**
   * Xử lý lỗi từ HTTP Request
   * @param error Lỗi từ HttpClient
   * @returns Observable với thông báo lỗi
   * @private
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error instanceof ErrorEvent) {
      // Lỗi phía client
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi từ backend
      errorMessage = error.error?.message || `Mã lỗi: ${error.status}, Thông báo: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}