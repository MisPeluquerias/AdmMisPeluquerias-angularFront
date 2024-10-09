import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
let ExportComponent = class ExportComponent {
    constructor(exportService) {
        this.exportService = exportService;
        this.AllSalon = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math;
        this.searchText = '';
        this.isLoading = false;
    }
    ngOnInit() {
        this.loadAllSalon(this.currentPage);
    }
    loadAllSalon(page) {
        this.exportService.loadAllSalonToExport(page, this.pageSize, this.searchText).subscribe({
            next: (response) => {
                this.AllSalon = response.data;
                this.totalItems = response.totalItems;
            },
            error: (err) => {
                console.error('Error loading salons', err);
            }
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
    exportToExcel() {
        this.isLoading = true;
        this.exportService.exportSalonsToExcel().subscribe({
            next: (blob) => {
                saveAs(blob, 'actulizar_salones.xlsx');
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error exporting to Excel', err);
            }
        });
    }
};
ExportComponent = __decorate([
    Component({
        selector: 'app-export',
        templateUrl: './export.component.html',
        styleUrl: './export.component.scss'
    })
], ExportComponent);
export { ExportComponent };
//# sourceMappingURL=export.component.js.map