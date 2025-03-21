import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SortOption = 'price-asc' | 'price-desc' | 'rating-asc' | 'rating-desc' | 'name-asc' | 'name-desc';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SortComponent {
  @Output() sortChange = new EventEmitter<SortOption>();

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value as SortOption;

    if (this.isSortOption(value)) {
      this.sortChange.emit(value);
    }
  }

  private isSortOption(value: any): value is SortOption {
    return ['price-asc', 'price-desc', 'rating-asc', 'rating-desc', 'name-asc', 'name-desc'].includes(value);
  }
}
