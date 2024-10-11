import { __decorate } from "tslib";
import { Component } from '@angular/core';
let CitiesComponent = class CitiesComponent {
    constructor(citiesService, router) {
        this.citiesService = citiesService;
        this.router = router;
        this.AllCities = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math; // Exponer Math al contexto de la plantilla
        this.allSelected = false;
        this.searchText = '';
    }
    ngOnInit() {
        this.loadAllCities(this.currentPage);
    }
    onPageChange(page) {
        this.currentPage = page;
        this.loadAllCities(page);
    }
    loadAllCities(page) {
        this.citiesService.loadAllCities(page, this.pageSize, this.searchText).subscribe({
            next: (response) => {
                this.AllCities = response.data;
                this.totalItems = response.totalItems;
                console.log('ciudades cargadas', this.AllCities);
            },
            error: (err) => {
                console.error('Error loading cities', err);
            }
        });
    }
    onSearch() {
        this.currentPage = 1; // Reset to first page on new search
        this.loadAllCities(this.currentPage);
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
        this.AllCities.forEach(city => city.selected = this.allSelected);
    }
    checkIfAllSelected() {
        this.allSelected = this.AllCities.every(city => city.selected);
    }
    hasSelected() {
        return this.AllCities.some(city => city.selected);
    }
    deleteSelected() {
        this.AllCities = this.AllCities.filter(city => !city.selected);
        this.allSelected = false;
    }
    editCity(id) {
        this.router.navigate(['edit-city/edit', id]);
    }
};
CitiesComponent = __decorate([
    Component({
        selector: 'app-cities',
        templateUrl: './cities.component.html',
        styleUrl: './cities.component.scss'
    })
], CitiesComponent);
export { CitiesComponent };
//# sourceMappingURL=cities.component.js.map