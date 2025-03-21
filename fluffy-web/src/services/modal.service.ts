import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private productDataSubject = new BehaviorSubject<any>(null);

  isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  productData$: Observable<any> = this.productDataSubject.asObservable();

  constructor() { }

  openProductDetail(product: any): void {
    this.productDataSubject.next(product);
    this.isOpenSubject.next(true);
    // Vô hiệu hóa scroll của body khi modal mở
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isOpenSubject.next(false);
    // Khôi phục scroll của body khi modal đóng
    document.body.style.overflow = 'auto';
  }
} 