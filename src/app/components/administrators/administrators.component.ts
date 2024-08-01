import { Component } from '@angular/core';
import { AdministratorsService } from '../../core/service/administrators.service';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrl: './administrators.component.scss'
})
export class AdministratorsComponent {

  AllAdministrators: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;
  allSelected: boolean = false;
  searchText='';

  constructor(private administratorsService: AdministratorsService) { }

  ngOnInit(): void {
    this.loadAllAministrators(this.currentPage);
  }

  loadAllAministrators(page: number): void {
    this.administratorsService.loadAllAdministrators(page, this.pageSize,this.searchText).subscribe({
      next: (response: any) => {
        this.AllAdministrators = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }
  onSearch(): void {

    this.loadAllAministrators(this.currentPage);

    if (this.searchText.trim() === '') {
      this.loadAllAministrators(this.currentPage); // Reload with current page if search is cleared
    }

  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllAministrators(page);
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
    this.AllAdministrators.forEach(administrartor => administrartor.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllAdministrators.every(administrator => administrator.selected);
  }

  hasSelected() {
    return this.AllAdministrators.some(administrator => administrator.selected);
  }

  deleteSelected() {
    this.AllAdministrators = this.AllAdministrators.filter(administrator => !administrator.selected);
    this.allSelected = false;
  }

}
