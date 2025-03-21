import { Component, OnInit, HostListener, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../app/pages/product-page/models/product.model';
import { Router, RouterModule } from '@angular/router';
interface CartProduct extends Product {
  quantity: number;
  totalPrice: number;
  selected: boolean;
  discount_price: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
})
export class CartComponent implements OnInit {
  products: CartProduct[] = [];
  totalAmount = 0;
  selectAll = false;
  isOpen = false;

  private isCartOpenSubject = new BehaviorSubject<boolean>(false);
  isCartOpen$ = this.isCartOpenSubject.asObservable();

  @HostBinding('class.open')
  get isOpenClass() {
    return this.isOpen;
  }

  constructor(private cartService: CartService, private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.cartService.isCartOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        this.loadCart();
      } else {
        document.body.style.overflow = 'auto';
      }
    });
  }

  loadCart() {
    const cart = this.cartService.getCart();
    const productIds = cart.map((p: CartProduct) => p.product_id);
    if (productIds.length > 0) {
      this.productService.getProductsByIds(productIds).subscribe({
        next: (products) => {
          this.products = products.map((product: Product) => {
            const cartItem = cart.find((p: CartProduct) => p.product_id === product.product_id);
            const originalPrice = parseFloat(product.pricing.original_price.replace(/[,.]/g, ''));
            const discountPercentage = parseFloat(product.pricing.discount_percentage) || 0;
            const discountPrice = originalPrice * (1 - discountPercentage / 100);

            // Đảm bảo quantity được gán đúng từ cartItem
            const quantity = cartItem?.quantity ?? 1; 

            return {
              ...product,
              discount_price: discountPrice,
              quantity: quantity,
              totalPrice: discountPrice * quantity,
              selected: cartItem?.selected || false
            };
          });
          this.updateTotalAmount();
        },
        error: (err) => console.error('Error loading cart from backend:', err)
      });
    } else {
      this.products = [];
      this.totalAmount = 0;
    }
  }

  closeCart() {
    this.cartService.closeCart();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isOpen) {
      this.closeCart();
    }
  }

  updateTotalAmount() {
    this.totalAmount = this.products.reduce((total, product) => {
      return total + (product.selected ? product.totalPrice : 0);
    }, 0);
  }

  updateProductTotalPrice(product: CartProduct) {
    product.totalPrice = product.discount_price * product.quantity;
    this.updateTotalAmount();
    const cart = this.cartService.getCart();
    const updatedCart = cart.map((item: CartProduct) =>
      item.product_id === product.product_id ? { ...item, quantity: product.quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  changeQuantity(product: CartProduct, increment: boolean) {
    if (increment) {
      product.quantity++;
    } else if (product.quantity > 1) {
      product.quantity--;
    }
    this.updateProductTotalPrice(product);
  }

  toggleSelectProduct(product: CartProduct) {
    product.selected = !product.selected;
    this.updateTotalAmount();
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.products.forEach(product => (product.selected = this.selectAll));
    this.updateTotalAmount();
  }

  deleteAll() {
    this.cartService.clearCart();
    this.products = [];
    this.totalAmount = 0;
  }

  deleteProduct(product: CartProduct) {
    this.cartService.removeFromCart(product.product_id);
    this.loadCart();
  }

  toggleCart(): void {
    this.isCartOpenSubject.next(!this.isCartOpenSubject.value);
    document.body.style.overflow = this.isCartOpenSubject.value ? 'hidden' : 'auto';
  }

  goToCheckout() {
    this.closeCart(); // Đóng giỏ hàng
    setTimeout(() => {
    this.router.navigate(['/payment']);
  }, 200); // Đợi 200ms để UI cập nhật
  }

}