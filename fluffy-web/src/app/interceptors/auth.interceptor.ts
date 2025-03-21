import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor thêm token xác thực vào header của HTTP request
 * @param req HTTP request
 * @param next HTTP handler
 * @returns HTTP response
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  return next(req);
};