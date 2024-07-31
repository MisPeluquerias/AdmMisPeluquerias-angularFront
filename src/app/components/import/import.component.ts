import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { ImportService } from '../../core/service/import.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss'
})
export class ImportComponent {


  AllSalon: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;

  constructor(private importService: ImportService) { }

  ngOnInit(): void {
    this.loadAllSalon(this.currentPage);
  }

  loadAllSalon(page: number): void {
    this.importService.loadAllSalonToExport(page, this.pageSize).subscribe({
      next: (response: any) => {
        this.AllSalon = response.data;
        this.totalItems = response.totalItems;

      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
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

  updateWithExcel(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.importService.importUpdateExcel(file).subscribe(
        (response: Blob) => {
          console.log('File uploaded successfully', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error uploading file', error);
        }
      );
    }
  }


}
