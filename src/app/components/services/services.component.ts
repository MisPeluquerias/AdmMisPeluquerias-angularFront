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
  Math = Math;  // Exponer Math al contexto de la plantilla

  constructor(private servicesService: ServicesService) { }

  ngOnInit(): void {
    this.loadAllServices(this.currentPage);
  }

  loadAllServices(page: number): void {


    this.servicesService.loadAllServices(page, this.pageSize).subscribe({
      next: (response: any) => {
        this.AllServices = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
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
}
