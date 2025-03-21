import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Product {
  _id: string;
  product_id: number;
  product_name: string;
  pricing: {
    original_price: string;
    discount_percentage: string;
  };
  images: string[];
  image: string;
  color: {
    selected_colors: string[];
  };
  size: {
    available_sizes: string[];
  };
  rating: number;
  description: string;
  collection: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) { }


  // Lấy chi tiết sản phẩm theo product_id
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${productId}`);
  }

  // Lấy sản phẩm theo bộ sưu tập
  getProductsByCollection(collection: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/collection/${collection}`);
  }

  // Lấy sản phẩm liên quan (dựa trên collection)
  getRelatedProducts(productId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/related/${productId}`);
  }
} 

