import { __decorate } from "tslib";
import { Component } from '@angular/core';
let HomeComponent = class HomeComponent {
    constructor(homeService, router) {
        this.homeService = homeService;
        this.router = router;
        this.AllSalon = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math;
        this.searchText = '';
        this.filterState = '';
        this.filterActive = true;
        this.salonPermiso = '';
        this.showBoton = false;
        this.allSelected = false;
    }
    ngOnInit() {
        this.loadAllSalon(this.currentPage);
        this.homeService.getUserPermiso().subscribe((response) => {
            //console.log('Permiso recibido:', response.permiso);
            if (response.permiso === 'salon') {
                this.salonPermiso = 'salon';
                this.showBoton = false;
                //console.log('mostrarNegocios se establece en true');
            }
            else if (response.permiso === 'admin') {
                this.salonPermiso = 'admin';
                this.showBoton = true;
                //console.log('mostrarNegocios se establece en true');
            }
            else {
                this.showBoton = false;
                //console.log('mostrarNegocios se establece en false');
            }
        }, (error) => {
            console.log('Error fetching permiso:', error);
        });
    }
    loadAllSalon(page) {
        this.homeService.loadAllSalon(page, this.pageSize, this.searchText, this.filterState, this.filterActive).subscribe({
            next: (response) => {
                this.AllSalon = response.data;
                this.totalItems = response.totalItems;
            },
            error: (err) => {
                console.error('Error loading salons', err);
            }
        });
    }
    onFilterChange() {
        this.currentPage = 1; // Resetea la página actual a 1 cuando cambia el filtro
        this.loadAllSalon(this.currentPage);
    }
    onSearch() {
        this.loadAllSalon(this.currentPage);
        if (this.searchText.trim() === '') {
            this.loadAllSalon(this.currentPage); // Reload with current page if search is cleared
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
    toggleAllSelection() {
        this.allSelected = !this.allSelected;
        this.AllSalon.forEach(salon => salon.selected = this.allSelected);
    }
    checkIfAllSelected() {
        this.allSelected = this.AllSalon.every(salon => salon.selected);
    }
    hasSelected() {
        return this.AllSalon.some(salon => salon.selected);
    }
    deleteSelected() {
        this.AllSalon = this.AllSalon.filter(salon => !salon.selected);
        this.allSelected = false;
    }
    editSalon(id) {
        this.router.navigate(['home/edit', id]);
    }
};
HomeComponent = __decorate([
    Component({
        selector: 'app-home',
        templateUrl: './home.component.html',
        styleUrls: ['./home.component.scss']
    })
], HomeComponent);
export { HomeComponent };
//# sourceMappingURL=home.component.js.map