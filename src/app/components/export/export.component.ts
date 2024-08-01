import { ExportService } from './../../core/service/export.service';
import { Component } from '@angular/core';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrl: './export.component.scss'
})
export class ExportComponent {

  AllSalon: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;
  searchText : string = '';  // Exponer Math al contexto de la plantilla

  constructor(private exportService: ExportService) { }

  ngOnInit(): void {
    this.loadAllSalon(this.currentPage);
  }

  loadAllSalon(page: number): void {
    this.exportService.loadAllSalonToExport(page, this.pageSize,this.searchText).subscribe({
      next: (response: any) => {
        this.AllSalon = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }

  onSearch(): void {
    this.loadAllSalon(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllSalon(this.currentPage);
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllSalon(page);
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
  exportToExcel(): void {
    this.exportService.exportSalonsToExcel().subscribe({
      next: (blob: Blob) => {
        saveAs(blob, 'salons.xlsx');
      },
      error: (err) => {
        console.error('Error exporting to Excel', err);
      }
    });
  }

}
