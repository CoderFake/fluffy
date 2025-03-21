import { NgClass, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  @Input() products: Product[] = [];
  @Output() filterChange = new EventEmitter<any>();

  expandedSections = {
    category: false,
    color: false,
    price: false
  };

  selectedCollections: string[] = [];
  selectedColors: string[] = [];
  priceRange = {
    min: '',
    max: ''
  };

  collections: string[] = [];
  colors: string[] = [];

  // Thông báo lỗi
  errorMessage: string = '';

  ngOnInit() {
    if (this.products && this.products.length > 0) {
      this.extractFilterOptions();
    }
  }

  ngOnChanges() {
    if (this.products && this.products.length > 0) {
      this.extractFilterOptions();
    }
  }

  private extractFilterOptions() {
    this.collections = [...new Set(this.products.map(p => p.collection))];
    
    this.colors = [...new Set(this.products.flatMap(p => p.color.selected_colors))];
  }

  toggleSection(section: keyof typeof this.expandedSections) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  onCollectionChange(event: any, collection: string) {
    if (event.target.checked) {
      this.selectedCollections.push(collection);
    } else {
      const index = this.selectedCollections.indexOf(collection);
      if (index !== -1) {
        this.selectedCollections.splice(index, 1);
      }
    }
  }

  onColorChange(event: any, color: string) {
    if (event.target.checked) {
      this.selectedColors.push(color);
    } else {
      const index = this.selectedColors.indexOf(color);
      if (index !== -1) {
        this.selectedColors.splice(index, 1);
      }
    }
  }

  applyFilters() {
    this.errorMessage = '';

    // Kiểm tra giá trị âm
    if ((this.priceRange.min && parseFloat(this.priceRange.min) < 0) || 
        (this.priceRange.max && parseFloat(this.priceRange.max) < 0)) {
      this.errorMessage = 'Giá không thể là số âm';
      return;
    }

    // Kiểm tra giá từ > giá đến
    if (this.priceRange.min && this.priceRange.max && 
        parseFloat(this.priceRange.min) > parseFloat(this.priceRange.max)) {
      this.errorMessage = 'Giá từ không thể lớn hơn giá đến';
      return;
    }

    const filters = {
      collections: this.selectedCollections,
      colors: this.selectedColors,
      priceRange: {
        min: this.priceRange.min ? parseFloat(this.priceRange.min) : null,
        max: this.priceRange.max ? parseFloat(this.priceRange.max) : null
      }
    };
    
    this.filterChange.emit(filters);
  }
}

