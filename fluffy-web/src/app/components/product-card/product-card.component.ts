import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';

interface ProductPricing {
  original_price: string;
  discount_percentage: string;
}

interface Product {
  product_id: number;
  product_name: string;
  pricing: ProductPricing;
  images: string[];
  image: string;
  color: { selected_colors: string[] };
  size: { available_sizes: string[] };
  rating: number;
  description: string;
  collection: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  isFavorite: boolean = false;

  constructor(private cartService: CartService, private router: Router) {}

  addToCart(event: Event): void {
    event.stopPropagation(); 

    const originalPrice = parseFloat(this.product.pricing.original_price.replace(/[,.]/g, ''));
    const discountPercentage = parseFloat(this.product.pricing.discount_percentage) || 0;
    const discountPrice = originalPrice * (1 - discountPercentage / 100);

    const productToAdd = {
      product_id: this.product.product_id,
      product_name: this.product.product_name,
      discount_price: discountPrice,
      original_price: originalPrice,
      image: this.product.image,
      color: this.product.color,
      size: this.product.size,
      rating: this.product.rating,
      description: this.product.description,
      collection: this.product.collection,
      quantity: 1
    };
    this.cartService.addToCart(productToAdd);
    this.cartService.openCart(); 
  }

  calculateDiscountedPrice(originalPrice: string, discountPercentage: string): string {
    const price = parseFloat(originalPrice.replace(/[,.]/g, ''));
    const discount = parseFloat(discountPercentage) || 0;
    if (isNaN(price) || isNaN(discount)) return originalPrice;
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice.toLocaleString('vi-VN');
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }
}