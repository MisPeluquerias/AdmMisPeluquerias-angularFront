import { Component } from '@angular/core';
import { ServicesService } from '../../core/service/services.service';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

  AllServices: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;
  allSelected: boolean = false;
  searchText:string = '';

  constructor(private servicesService: ServicesService) { }

  ngOnInit(): void {
    this.loadAllServices(this.currentPage);
  }

  loadAllServices(page: number): void {


    this.servicesService.loadAllServices(page, this.pageSize,this.searchText).subscribe({
      next: (response: any) => {
        this.AllServices = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }

  onSearch(): void {
    this.loadAllServices(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllServices(this.currentPage);
    }
  }

 
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllServices(page);
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
    this.AllServices.forEach(service => service.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllServices.every(service => service.selected);
  }

  hasSelected() {
    return this.AllServices.some(serivce => serivce.selected);
  }

  deleteSelected() {
    this.AllServices = this.AllServices.filter(service => !service.selected);
    this.allSelected = false;
  }

}
