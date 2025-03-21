import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart';
  private isCartOpen = new BehaviorSubject<boolean>(false);
  isCartOpen$ = this.isCartOpen.asObservable();
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor() {
    this.updateCartItemCount();
  }

  getCart(): any[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: any): void {
    const cart = this.getCart();
    const existingProduct = cart.find((item: any) => item.product_id === product.product_id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + (product.quantity || 1);
    } else {
      cart.push({ ...product, quantity: product.quantity || 1 });
    }
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartItemCount();
  }

  removeFromCart(productId: number): void {
    const cart = this.getCart().filter((item: any) => item.product_id !== productId);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartItemCount();
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.updateCartItemCount();
  }

  openCart(): void {
    this.isCartOpen.next(true);
    document.body.style.overflow = 'hidden';
  }

  closeCart(): void {
    this.isCartOpen.next(false);
    document.body.style.overflow = 'auto';
  }

  toggleCart(): void {
    const newState = !this.isCartOpen.value;
    this.isCartOpen.next(newState);
    document.body.style.overflow = newState ? 'hidden' : 'auto';
  }

  getCartItemCount(): Observable<number> {
    return this.cartItemCount$;
  }

  private updateCartItemCount(): void {
    const cart = this.getCart();
    this.cartItemCount.next(cart.length);
  }
}