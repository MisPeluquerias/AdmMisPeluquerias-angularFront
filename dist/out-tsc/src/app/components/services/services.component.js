import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
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
        this.categoriesAsText = "";
        this.selectedSubServiceIds = [];
        this.selectedCategoryIds = [];
        this.selectedCategory = '';
        this.selectedCategories = [];
        this.searchTermsCategory = new Subject();
        this.dataCategoryList = [];
        this.id_category = '';
        this.newCategory = { category: '', salons: [] };
    }
    ngOnInit() {
        this.loadAllServices(this.currentPage);
        this.searchTermsCategory.pipe(debounceTime(300), distinctUntilChanged(), switchMap((term) => {
            if (term.length >= 2) {
                return this.servicesService.getCategoryInLive(term);
            }
            else {
                return of([]);
            }
        })).subscribe({
            next: (category) => {
                this.dataCategoryList = category.map((cat) => cat.categories);
            },
            error: (error) => {
                console.error('Error al buscar categorias:', error);
            },
        });
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
    searchCategory(term) {
        this.searchTermsCategory.next(term);
    }
    removeCategory(index) {
        this.newCategory.categories.splice(index, 1); // Eliminar el salón de la lista
    }
    selectService(service) {
        this.selectedService = { ...service }; // Asignamos el servicio seleccionado a la variable
    }
    selectCategories(service) {
        // Verifica si `service.categories` es un arreglo de nombres o una cadena separada por comas
        console.log('Contenido de service.categories:', service.categories);
        if (Array.isArray(service.categories)) {
            this.selectedCategories = [...service.categories];
        }
        else if (typeof service.categories === 'string') {
            this.selectedCategories = service.categories.split(',').map((category) => category.trim());
        }
        else {
            this.selectedCategories = [];
        }
        this.selectedService = { ...service };
        this.categoriesAsText = this.selectedCategories.join(', '); // Actualiza el área de texto con los nombres de categorías
    }
    selectCategory(category) {
        // Asegurarse de que 'categories' esté inicializado
        if (!this.newCategory.categories) {
            this.newCategory.categories = [];
        }
        // Almacenar solo el nombre de la categoría en el array newCategory.categories
        this.newCategory.categories.push({ name: category.name });
        this.dataCategoryList = []; // Limpiar la lista después de la selección
        this.selectedCategory = ''; // Limpiar el campo de entrada
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
            this.newService.categories = this.newCategory.categories; // Añadir las categorías seleccionadas
            // Llamada al servicio para crear el nuevo servicio en el backend
            this.servicesService.addNewService(this.newService).subscribe({
                next: (response) => {
                    this.toastr.success('Servicios, subservicios y categorías añadidos con éxito');
                    // Reiniciar el formulario después de la creación exitosa
                    this.newService = { name: '', subservices: [] };
                    this.newSubservice = [];
                    this.newCategory.categories = []; // Limpiar las categorías seleccionadas
                    this.loadAllServices(this.currentPage); // Recargar la lista de servicios
                },
                error: (err) => {
                    this.toastr.error('No se pudo crear el servicio, subservicio y categorías');
                    console.error('Error creando el servicio:', err);
                }
            });
        }
        else {
            this.toastr.error('Por favor, rellene todos los campos');
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
            id_service: this.selectedService.id_service,
            service_type_ids: this.selectedSubServiceIds // Asegúrate de que este arreglo contiene los IDs
        };
        console.log('Servicio actualizado:', updatedService);
        // Asegurarse de que el id_service esté presente
        if (!this.selectedService.id_service) {
            this.toastr.error('No se pudo actualizar los subservicios porque falta el ID del servicio');
            return;
        }
        // Llamada al servicio para actualizar los subservicios
        this.servicesService.updateSubservices(this.selectedService.service_type_ids, updatedService).subscribe({
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
    updateCategories() {
        if (this.categoriesAsText.trim() === "") {
            this.toastr.error('Error, Introduzca al menos una categoría');
            return;
        }
        // Convertir el texto en un arreglo de nombres de categorías
        this.selectedCategories = this.categoriesAsText.split(',')
            .map(category => category.trim())
            .filter(category => category.length > 0);
        const updatedCategories = {
            categories: this.selectedCategories, // Asegúrate de que aquí solo enviamos los nombres de las categorías
            id_service: this.selectedService.id_service
        };
        console.log('Datos de categorías a enviar:', updatedCategories);
        if (!this.selectedService.id_service) {
            this.toastr.error('No se pudo actualizar las categorías porque falta el ID del servicio');
            return;
        }
        // Llamada al servicio para actualizar las categorías
        this.servicesService.updateCategories(this.selectedService.id_service, updatedCategories).subscribe({
            next: (response) => {
                this.toastr.success('Categorías actualizadas con éxito');
                this.loadAllServices(this.currentPage); // Recargar la lista de servicios
            },
            error: (err) => {
                this.toastr.error('Error al actualizar las categorías, por favor compruebe los nombres...');
                console.error('Error actualizando las categorías:', err);
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