import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
let ImportComponent = class ImportComponent {
    constructor(importService, toastr) {
        this.importService = importService;
        this.toastr = toastr;
        this.AllSalon = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math;
        this.isLoading = false;
        this.searchText = '';
    }
    ngOnInit() {
        this.loadAllSalon(this.currentPage);
    }
    loadAllSalon(page) {
        this.importService
            .loadAllSalonToExport(page, this.pageSize, this.searchText)
            .subscribe({
            next: (response) => {
                this.AllSalon = response.data;
                this.totalItems = response.totalItems;
            },
            error: (err) => {
                console.error('Error loading salons', err);
            },
        });
    }
    onSearch() {
        this.loadAllSalon(this.currentPage);
        if (this.searchText.trim() === '') {
            this.loadAllSalon(this.currentPage);
        }
    }
    onPageChange(page) {
        this.currentPage = page;
        this.loadAllSalon(page);
    }
    get pageCount() {
        return Math.ceil(this.totalItems / this.pageSize);
    }
    get pages() {
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
    updateWithExcel(event) {
        const file = event.target.files[0];
        if (file) {
            this.isLoading = true;
            this.importService.importUpdateExcel(file).subscribe((response) => {
                //console.log('File uploaded successfully', response);
                this.isLoading = false;
                if (response.error) {
                    alert('Error: ' + response.error);
                }
                else {
                    this.toastr.success('<i class="las la-info-circle"> Actualización completada con éxito.</i>');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000); // 2000 milisegundos = 2 segundos
                }
            }, (error) => {
                //console.error('Error uploading file', error);
                this.toastr.success('<i class="las la-info-circle"> Error: Revisar el fichero.</i>');
                setTimeout(() => {
                    this.isLoading = false;
                    window.location.reload();
                }, 2000); // 2000 milisegundos = 2 segundos
            });
        }
    }
    downloadTemplateExcel() {
        this.isLoading = true;
        this.importService.downloadTemplateExcel().subscribe({
            next: (blob) => {
                saveAs(blob, 'plantilla_nuevos.xlsx');
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error exporting to Excel', err);
            },
        });
    }
    uploadNewSalons(event) {
        const file = event.target.files[0];
        if (file) {
            this.isLoading = true;
            this.importService.uploadNewSalons(file).subscribe((response) => {
                console.log('File uploaded successfully', response);
                this.isLoading = false;
                if (response.error) {
                    alert('Error: ' + response.error);
                }
                else {
                    this.toastr.success('<i class="las la-info-circle">Nuevos salones añadidos.</i>');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000); // 2000 milisegundos = 2 segundos
                }
            }, (error) => {
                console.error('Error uploading file', error);
                this.toastr.success('<i class="las la-info-circle"> Error: Revisar el fichero no cumple los requisitos</i>');
                setTimeout(() => {
                    this.isLoading = false;
                }, 2000); // 2000 milisegundos = 2 segundos
            });
        }
    }
};
ImportComponent = __decorate([
    Component({
        selector: 'app-import',
        templateUrl: './import.component.html',
        styleUrl: './import.component.scss',
    })
], ImportComponent);
export { ImportComponent };
//# sourceMappingURL=import.component.js.map