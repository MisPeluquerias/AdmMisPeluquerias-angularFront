import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ServicesComponent = class ServicesComponent {
    constructor(servicesService, toastr) {
        this.servicesService = servicesService;
        this.toastr = toastr;
        this.AllServices = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math;
        this.allSelected = false;
        this.searchText = '';
        this.newService = { name: '', subservices: [] };
        this.newSubservice = [];
        this.newSubserviceInput = '';
        this.selectedService = { service_name: '' };
        this.selectedSubServices = [];
        this.subservicesAsText = "";
        this.selectedSubServiceIds = [];
    }
    ngOnInit() {
        this.loadAllServices(this.currentPage);
    }
    loadAllServices(page) {
        this.servicesService.loadAllServices(page, this.pageSize, this.searchText).subscribe({
            next: (response) => {
                this.AllServices = response.data;
                console.log('Servicios cargados:', this.AllServices);
                this.totalItems = response.totalItems;
            },
            error: (err) => {
                console.error('Error loading services', err);
            }
        });
    }
    selectService(service) {
        this.selectedService = { ...service }; // Asignamos el servicio seleccionado a la variable
    }
    selectSubService(service) {
        if (Array.isArray(service.subservices)) {
            this.selectedSubServices = [...service.subservices];
        }
        else if (typeof service.subservices === 'string') {
            this.selectedSubServices = service.subservices.split(',').map((subservice) => subservice.trim());
        }
        else {
            this.selectedSubServices = [];
        }
        this.selectedService = { ...service };
        this.subservicesAsText = this.selectedSubServices.join(', ');
    }
    onSearch() {
        this.loadAllServices(this.currentPage);
        if (this.searchText.trim() === '') {
            this.loadAllServices(this.currentPage);
        }
    }
    onPageChange(page) {
        this.currentPage = page;
        this.loadAllServices(page);
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
        this.AllServices.forEach(service => service.selected = this.allSelected);
    }
    checkIfAllSelected() {
        this.allSelected = this.AllServices.every(service => service.selected);
    }
    hasSelected() {
        return this.AllServices.some(service => service.selected);
    }
    removeService(index) {
        this.newSubservice.splice(index, 1); // Eliminar subservicio de la lista
    }
    addSubservice() {
        if (this.newSubserviceInput.trim() !== '') {
            this.newSubservice.push(this.newSubserviceInput.trim());
            this.newSubserviceInput = '';
        }
    }
    addNewService() {
        if (this.newService.name.trim() !== '' && this.newSubservice.length > 0) {
            this.newService.subservices = this.newSubservice;
            // Llamada al servicio para crear el nuevo servicio en el backend
            this.servicesService.addNewService(this.newService).subscribe({
                next: (response) => {
                    this.toastr.success('Servicios y subservicios añadidos con éxito');
                    //console.log('Servicio creado exitosamente:', response);
                    // Reiniciar el formulario después de la creación exitosa
                    this.newService = { name: '', subservices: [] };
                    this.newSubservice = [];
                    this.loadAllServices(this.currentPage); // Recargar la lista de servicios
                },
                error: (err) => {
                    this.toastr.error('No se pudo crear el servicio y subservicio');
                    console.error('Error creando el servicio:', err);
                }
            });
        }
        else {
            this.toastr.error('Por favor rellene todos los campos');
        }
    }
    deleteSelected() {
        const selectedServices = this.AllServices.filter(service => service.selected);
        if (selectedServices.length === 0) {
            this.toastr.error('No hay servicios seleccionados para eliminar');
            return;
        }
        // Confirmar eliminación a través del modal
        selectedServices.forEach(service => {
            this.servicesService.deleteServiceWithSubservice(service.id_service).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.toastr.success('Servicio y subservicios eliminados con éxito');
                    }
                    else {
                        this.toastr.error('Error al eliminar el servicio');
                    }
                },
                error: (err) => {
                    this.toastr.error('Error al eliminar el servicio');
                    console.error('Error eliminando el servicio:', err);
                },
                complete: () => {
                    // Después de eliminar, recargar la lista de servicios
                    this.loadAllServices(this.currentPage);
                }
            });
        });
    }
    updateService() {
        if (this.selectedService.service_name.trim() === '') {
            this.toastr.error('El nombre del servicio no puede estar vacío');
            return;
        }
        const updatedService = {
            name: this.selectedService.service_name, // Cambia a 'name' para coincidir con el backend
        };
        this.servicesService.updateService(this.selectedService.id_service, updatedService).subscribe({
            next: (response) => {
                this.toastr.success('Servicio actualizado con éxito');
                this.loadAllServices(this.currentPage); // Recargar la lista de servicios
            },
            error: (err) => {
                console.error('Error actualizando el servicio:', err);
                this.toastr.error('Error al actualizar el servicio');
            }
        });
    }
    updateSubService() {
        if (this.subservicesAsText.trim() === "" || this.subservicesAsText === "") {
            this.toastr.error('Error, Introduzca al menos un subservicio');
            return;
        }
        // Convertir el texto del textarea en un arreglo de subservicios
        this.selectedSubServices = this.subservicesAsText.split(',')
            .map(subservice => subservice.trim())
            .filter(subservice => subservice.length > 0);
        // Asegurarse de que la lista de subservicios contiene los id_service_type
        const updatedService = {
            subservices: this.selectedSubServices,
            service_type_ids: this.selectedSubServiceIds // Asegúrate de que este arreglo contiene los IDs
        };
        console.log('Servicio actualizado:', updatedService);
        // Asegurarse de que el id_service esté presente
        if (!this.selectedService.id_service) {
            this.toastr.error('No se pudo actualizar los subservicios porque falta el ID del servicio');
            return;
        }
        // Llamada al servicio para actualizar los subservicios
        this.servicesService.updateSubservices(this.selectedService.id_service, updatedService).subscribe({
            next: (response) => {
                this.toastr.success('Subservicios actualizados con éxito');
                this.loadAllServices(this.currentPage); // Recargar la lista de servicios
            },
            error: (err) => {
                this.toastr.error('Error al actualizar los subservicios');
                console.error('Error actualizando los subservicios:', err);
            }
        });
    }
};
ServicesComponent = __decorate([
    Component({
        selector: 'app-services',
        templateUrl: './services.component.html',
        styleUrls: ['./services.component.scss']
    })
], ServicesComponent);
export { ServicesComponent };
//# sourceMappingURL=services.component.js.map