import { __decorate } from "tslib";
import { Component } from '@angular/core';
let HomeComponent = class HomeComponent {
    constructor(homeService, router, toastr) {
        this.homeService = homeService;
        this.router = router;
        this.toastr = toastr;
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
    getSalonUrl(salon) {
        if (!salon || !salon.name || !salon.id_salon) {
            return '#'; // Si faltan datos del salón, devuelve una URL por defecto o vacía
        }
        const salonSlug = salon.name
            .toLowerCase()
            .replace(/ /g, '-') // Reemplaza los espacios con guiones
            .replace(/[^a-z0-9-]/g, '') // Elimina caracteres no alfanuméricos y deja solo guiones y letras
            .replace(/--+/g, '-'); // Reemplaza múltiples guiones seguidos por uno solo
        // Construye y retorna la URL completa
        return `https://www.mispeluquerias.com/centro/${salonSlug}/${salon.id_salon}`;
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
    editSalon(id) {
        this.router.navigate(['home/edit', id]);
    }
    confirmDelete() {
        const selectedBusiness = this.AllSalon.filter(business => business.selected);
        if (selectedBusiness.length === 0) {
            this.toastr.warning('No has seleccionado ningún negocio para eliminar.');
            return;
        }
        console.log('Negocios seleccionados para eliminar:', selectedBusiness); // Muestra los contactos seleccionados en la consola
        const idsToDelete = selectedBusiness.map(business => business.id_salon);
        this.homeService.deleteBusiness(idsToDelete).subscribe({
            next: () => {
                this.toastr.success('Negocio/s eliminados con éxito');
                this.loadAllSalon(this.currentPage);
                this.AllSalon.forEach(businnes => businnes.selected = false); // Limpiar selección
                this.allSelected = false;
            },
            error: (err) => {
                console.error('Error eliminando negocios', err);
                this.toastr.error('Error al eliminar los negocio/s seleccionados.');
            }
        });
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