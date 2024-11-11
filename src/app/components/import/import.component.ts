import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { ImportService } from '../../core/service/import.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
})
export class ImportComponent {
  AllSalon: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;
  isLoading: boolean = false;

  searchText: string = '';
  constructor(
    private importService: ImportService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllSalon(this.currentPage);
  }

  
  loadAllSalon(page: number): void {
    this.importService
      .loadAllSalonToExport(page, this.pageSize, this.searchText)
      .subscribe({
        next: (response: any) => {
          this.AllSalon = response.data;
          this.totalItems = response.totalItems;
        },
        error: (err) => {
          console.error('Error loading salons', err);
        },
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


  updateWithExcel(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.importService.importUpdateExcel(file).subscribe(
        (response: any) => {
          //console.log('File uploaded successfully', response);
          this.isLoading = false;
          if (response.error) {
            alert('Error: ' + response.error);
          } else {
            this.toastr.success(
              '<i class="las la-info-circle"> Actualización completada con éxito.</i>'
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000); // 2000 milisegundos = 2 segundos
          }
        },
        (error) => {
          //console.error('Error uploading file', error);
          this.toastr.success(
            '<i class="las la-info-circle"> Error: Revisar el fichero.</i>'
          );
          setTimeout(() => {
            this.isLoading = false;
            window.location.reload();
          }, 2000); // 2000 milisegundos = 2 segundos
        }
      );
    }
  }
  downloadTemplateExcel(): void {
    this.isLoading = true;
    this.importService.downloadTemplateExcel().subscribe({
      next: (blob: Blob) => {
        saveAs(blob, 'plantilla_nuevos.xlsx');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error exporting to Excel', err);
      },
    });
  }


  uploadNewSalons(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.importService.uploadNewSalons(file).subscribe(
        (response: any) => {
          console.log('File uploaded successfully', response);
          this.isLoading = false;
          if (response.error) {
            alert('Error: ' + response.error);
          } else {
            this.toastr.success(
              '<i class="las la-info-circle">Nuevos salones añadidos.</i>'
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000); // 2000 milisegundos = 2 segundos
          }
        },
        (error) => {
          console.error('Error uploading file', error);
          this.toastr.success(
            '<i class="las la-info-circle"> Error: Revisar el fichero no cumple los requisitos</i>'
          );
          setTimeout(() => {
            this.isLoading = false;
          }, 2000); // 2000 milisegundos = 2 segundos
        }
      );
    }
  }
}
