import { Component } from '@angular/core';
import { CategoriesService } from '../../core/service/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {



  AllCategories: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;  // Exponer Math al contexto de la plantilla
  allSelected: boolean = false;
  searchText:string ='';

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.loadAllCategories(this.currentPage);
  }

  loadAllCategories (page: number): void {
    this.categoriesService.loadAllCategories(page, this.pageSize,this.searchText).subscribe({
      next: (response: any) => {
        this.AllCategories = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }

  onSearch(): void {
    this.loadAllCategories(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllCategories(this.currentPage); // Reload with current page if search is cleared
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllCategories(page);
  }

  get pageCount(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const maxPagesToShow = 5;
    const pages = [];
    const half = Math.floor(maxPagesToShow / 2);

    let start = Math.max(this.currentPage - half, 1);
    let end = Math.min(start + maxPagesToShow - 1, this.pageCount);

    if (end - start < maxPagesToShow) {
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  toggleAllSelection() {
    this.allSelected = !this.allSelected;
    this.AllCategories.forEach(category => category.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllCategories.every(category => category.selected);
  }

  hasSelected() {
    return this.AllCategories.some(category => category.selected);
  }

  deleteSelected() {
    this.AllCategories = this.AllCategories.filter(category => !category.selected);
    this.allSelected = false;
  }

}
