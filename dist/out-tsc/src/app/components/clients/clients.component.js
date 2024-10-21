import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ClientsComponent = class ClientsComponent {
    constructor(clientsService, router, toastr) {
        this.clientsService = clientsService;
        this.router = router;
        this.toastr = toastr;
        this.AllClients = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math;
        this.searchText = '';
        this.allSelected = false;
    }
    ngOnInit() {
        this.loadAllClients(this.currentPage);
    }
    loadAllClients(page) {
        this.clientsService.loadAllClients(page, this.pageSize, this.searchText).subscribe({
            next: (response) => {
                this.AllClients = response.data;
                this.totalItems = response.totalItems;
            },
            error: (err) => {
                console.error('Error loading salons', err);
            }
        });
    }
    onSearch() {
        this.loadAllClients(this.currentPage);
        if (this.searchText.trim() === '') {
            this.loadAllClients(this.currentPage);
        }
    }
    onPageChange(page) {
        this.currentPage = page;
        this.loadAllClients(page);
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
        this.AllClients.forEach(client => client.selected = this.allSelected);
    }
    checkIfAllSelected() {
        this.allSelected = this.AllClients.every(client => client.selected);
    }
    hasSelected() {
        return this.AllClients.some(client => client.selected);
    }
    editClient(id) {
        this.router.navigate(['edit-client/edit', id]);
    }
    deleteSelected() {
        const selectedClients = this.AllClients.filter(client => client.selected).map(client => client.id_user);
        if (selectedClients.length > 0) {
            this.clientsService.deleteClients(selectedClients).subscribe({
                next: () => {
                    // Filtra la lista localmente para eliminar los seleccionados
                    this.AllClients = this.AllClients.filter(client => !client.selected);
                    this.allSelected = false;
                    // Mostrar notificación de éxito
                    this.toastr.success('Clientes eliminados correctamente');
                },
                error: (err) => {
                    console.error('Error eliminando clientes', err);
                    // Mostrar notificación de error
                    this.toastr.error('Error al eliminar clientes');
                }
            });
        }
        else {
            this.toastr.warning('No hay clientes seleccionados');
        }
    }
};
ClientsComponent = __decorate([
    Component({
        selector: 'app-clients',
        templateUrl: './clients.component.html',
        styleUrl: './clients.component.scss'
    })
], ClientsComponent);
export { ClientsComponent };
//# sourceMappingURL=clients.component.js.map