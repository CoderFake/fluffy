import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: number = 0;
  product: any | null = null;
  quantity: number = 1;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  relatedProducts: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  displayCount: number = 4;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.updateDisplayCount();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateDisplayCount();
  }

  private updateDisplayCount() {
    this.displayCount = window.innerWidth <= 1280 ? 3 : 4;
  }

  ngOnInit() {
    this.route.params.subscribe({
      next: (params) => {
        const id = parseInt(params['id']);
        if (!isNaN(id)) {
          this.productId = id;
          this.loadProductDetails();
        } else {
          this.error = 'ID sản phẩm không hợp lệ';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy params:', error);
        this.error = 'Có lỗi xảy ra';
        this.loading = false;
      }
    });
  }

  loadProductDetails() {
    this.loading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.product = data;
        this.selectedColor = data.color?.selected_colors?.[0] || null;
        this.selectedSize = data.size?.available_sizes?.[0] || null;
        this.loading = false;
        this.loadRelatedProducts();
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin sản phẩm:', err);
        this.error = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  loadRelatedProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.relatedProducts = products.filter(p => p.product_id !== this.productId).slice(0, 4);
      },
      error: (err) => {
        console.error('Lỗi khi lấy sản phẩm liên quan:', err);
      }
    });
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  calculateDiscountedPrice(originalPrice: string, discountPercentage: string): string {
    const price = parseFloat(originalPrice.replace(/[,.]/g, ''));
    const discount = parseFloat(discountPercentage) || 0;
    if (isNaN(price) || isNaN(discount)) return originalPrice;
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice.toLocaleString('vi-VN') + 'đ';
  }

  addToCart() {
    if (this.product) {
      const originalPrice = parseFloat(this.product.pricing?.original_price.replace(/[,.]/g, '')) || 0;
      const discountPercentage = parseFloat(this.product.pricing?.discount_percentage) || 0;
      const discountPrice = originalPrice * (1 - discountPercentage / 100);

      const productToAdd = {
        product_id: this.product.product_id,
        product_name: this.product.product_name,
        discount_price: discountPrice,
        original_price: originalPrice,
        image: this.product.images?.[0] || this.product.image,
        color: this.product.color,
        size: this.product.size,
        rating: this.product.rating,
        description: this.product.description,
        collection: this.product.collection,
        quantity: this.quantity
      };
      this.cartService.addToCart(productToAdd);
      this.cartService.openCart();
    }
  }

  buyNow() {
    if (this.product) {
      // this.addToCart();
      this.router.navigate(['/payment']);
    }
  }

  navigateToRelatedProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}