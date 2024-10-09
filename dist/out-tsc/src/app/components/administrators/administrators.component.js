import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
let AdministratorsComponent = class AdministratorsComponent {
    constructor(administratorsService, toastr, router) {
        this.administratorsService = administratorsService;
        this.toastr = toastr;
        this.router = router;
        this.AllAdministrators = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math;
        this.allSelected = false;
        this.searchText = '';
        this.newAdmin = [];
        this.emailUsers = [];
        this.searchTermsEmail = new Subject();
    }
    ngOnInit() {
        this.loadAllAministrators(this.currentPage);
        this.searchTermsEmail.pipe(debounceTime(300), distinctUntilChanged(), switchMap((term) => {
            if (term.length >= 2) {
                return this.administratorsService.getUserEmail(term);
            }
            else {
                return of([]);
            }
        }))
            .subscribe({
            next: (emailUsers) => {
                // Verificamos si el array contiene objetos y si estos objetos tienen la propiedad 'email'
                this.emailUsers = emailUsers
                    .filter((user) => user && user.email)
                    .map((user) => user.email);
                console.log('Resultados de la búsqueda de emails:', this.emailUsers);
            },
            error: (error) => {
                console.error('Error al buscar emails:', error);
            },
        });
    }
    searchEmail(term) {
        this.searchTermsEmail.next(term);
    }
    selectEmail(email) {
        this.newAdmin.email = email;
        this.emailUsers = []; // Limpiar la lista de resultados después de seleccionar
    }
    loadAllAministrators(page) {
        this.administratorsService.loadAllAdministrators(page, this.pageSize, this.searchText).subscribe({
            next: (response) => {
                this.AllAdministrators = response.data;
                this.totalItems = response.totalItems;
            },
            error: (err) => {
                console.error('Error loading administrators', err);
            }
        });
    }
    addNewAdmin(email) {
        this.administratorsService.addnewAdmin(email).subscribe({
            next: (response) => {
                //console.log('Administrador añadido con éxito:', response);
                this.toastr.success('Administrador añadido con éxito');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            error: (error) => {
                console.error('Error al añadir el administrador:', error);
                this.toastr.success('Error, no se pudo añadir el administrador');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        });
    }
    onSearch() {
        this.loadAllAministrators(this.currentPage);
        if (this.searchText.trim() === '') {
            this.loadAllAministrators(this.currentPage); // Recargar con la página actual si se borra la búsqueda
        }
    }
    onPageChange(page) {
        this.currentPage = page;
        this.loadAllAministrators(page);
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
        this.AllAdministrators.forEach(administrator => administrator.selected = this.allSelected);
    }
    checkIfAllSelected() {
        this.allSelected = this.AllAdministrators.every(administrator => administrator.selected);
    }
    hasSelected() {
        return this.AllAdministrators.some(administrator => administrator.selected);
    }
    deleteSelected() {
        this.AllAdministrators = this.AllAdministrators.filter(administrator => !administrator.selected);
        this.allSelected = false;
    }
    editAdministrator(id) {
        this.router.navigate(['edit-administrator/edit', id]);
    }
};
AdministratorsComponent = __decorate([
    Component({
        selector: 'app-administrators',
        templateUrl: './administrators.component.html',
        styleUrls: ['./administrators.component.scss']
    })
], AdministratorsComponent);
export { AdministratorsComponent };
//# sourceMappingURL=administrators.component.js.map