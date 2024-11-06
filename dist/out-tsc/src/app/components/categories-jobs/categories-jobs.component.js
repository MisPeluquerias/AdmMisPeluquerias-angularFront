import { __decorate } from "tslib";
import { Component } from '@angular/core';
let CategoriesJobsComponent = class CategoriesJobsComponent {
    constructor(CategoriesJobsService, toastr) {
        this.CategoriesJobsService = CategoriesJobsService;
        this.toastr = toastr;
        this.AllCategoriesJobs = [];
        this.AllCategories = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.categories = [];
        this.Math = Math;
        this.allSelected = false;
        this.searchText = '';
        this.selectedCategoryJob = '';
        this.subCategories = [];
        this.newCategoryJob = '';
        this.editCategoryJob = '';
        this.newSubCategoryJob = '';
    }
    ngOnInit() {
        this.loadAllCategoriesJobs(this.currentPage);
        this.getCategories();
    }
    getCategories() {
        this.CategoriesJobsService.getCategories().subscribe({
            next: (response) => {
                //console.log('Respuesta completa:', response); // Imprime la respuesta completa
                this.AllCategories = response.data || response; // Asigna los datos según la estructura
                //console.log('Categorias cargadas:', this.AllCategories);
            },
            error: (err) => {
                console.error('Error fetching categories', err);
            }
        });
    }
    addSubCategory(value) {
        if (value.trim()) {
            this.subCategories.push(value.trim());
            this.newSubCategoryJob = ''; // Agrega la subcategoría a la lista
        }
    }
    removeCategory(index) {
        this.subCategories.splice(index, 1); // Elimina la subcategoría de la lista
    }
    selectCategoryJob(categoryJob) {
        this.selectedCategoryJob = categoryJob.name;
    }
    loadAllCategoriesJobs(page) {
        this.CategoriesJobsService.loadAllCategoriesJobs(page, this.pageSize, this.searchText).subscribe({
            next: (response) => {
                // Convertir 'categories' en un array vacío si es una cadena vacía
                this.AllCategoriesJobs = response.data.map((categoryJobs) => {
                    return {
                        ...categoryJobs,
                        categories: categoryJobs.categories && categoryJobs.categories !== ''
                            ? Array.from(new Set(categoryJobs.categories.split(',').map((category) => category.trim())))
                            : []
                    };
                });
                this.totalItems = response.totalItems;
                console.log('Categorias de empleo cargadas', this.AllCategoriesJobs);
            },
            error: (err) => {
                console.error('Error loading categories jobs', err);
            }
        });
    }
    removeUpdateCategory(index) {
        // Eliminar la categoría en el índice proporcionado
        this.categories.splice(index, 1);
    }
    onSearch() {
        this.loadAllCategoriesJobs(this.currentPage);
        if (this.searchText.trim() === '') {
            this.loadAllCategoriesJobs(this.currentPage); // Reload with current page if search is cleared
        }
    }
    onPageChange(page) {
        this.currentPage = page;
        this.loadAllCategoriesJobs(page);
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
        this.AllCategoriesJobs.forEach(categoryJob => categoryJob.selected = this.allSelected);
    }
    checkIfAllSelected() {
        this.allSelected = this.AllCategoriesJobs.every(categoryJob => categoryJob.selected);
    }
    hasSelected() {
        return this.AllCategoriesJobs.some(categoryJob => categoryJob.selected);
    }
    confirmDelete() {
        const selectedCategories = this.AllCategoriesJobs.filter(categoryJob => categoryJob.selected);
        const CategoryJobId = selectedCategories.map(CategoryJob => CategoryJob.id_job_cat);
        console.log('id categorías de empleo a eliminar', CategoryJobId);
        console.log('id categorías de empleo a eliminar', CategoryJobId);
        if (CategoryJobId.length > 0) {
            this.CategoriesJobsService.deleteCategoryJobs(CategoryJobId).subscribe({
                next: () => {
                    this.toastr.success('Categorias de Empleo eliminadas con éxito');
                    this.loadAllCategoriesJobs(this.currentPage);
                },
                error: (err) => {
                    console.error('Error eliminando Categorías de Empleo', err);
                    this.toastr.error('Hubo un error al eliminar las Categorias de Empleo', 'Error');
                }
            });
        }
    }
    updateCategoryJobs() {
        /*
        this.CategoriesJobsService.updateCategoryJobs(this.AllCategoriesJobs).subscribe({
          next: () => {
            this.toastr.success('Categorias de Empleo actualizados con suceceso');
            this.loadAllCategoriesJobs(this.currentPage);
          },
          error: (err) => {
            console.error('Error actualizando Categorías de Empleo', err);
            this.toastr.error('Hubo un error al actualizar las Categorias de Empleo', 'Error');
          }
            
        });
        */
    }
    addCategoryJob() {
        if (!this.newCategoryJob) {
            this.toastr.warning('Debe seleccionar una categoría de empleo');
            return;
        }
        if (this.subCategories.length === 0) {
            this.toastr.warning('Debe añadir al menos una subcategoría de empleo');
            return;
        }
        // Prepara los datos como JSON en lugar de FormData
        const data = {
            category: this.newCategoryJob,
            subCategories: this.subCategories
        };
        // Verificar los datos enviados
        console.log("Datos enviados:", data);
        // Enviar los datos JSON
        this.CategoriesJobsService.addCategorySubcategoryJob(data).subscribe({
            next: (response) => {
                this.toastr.success('Categoría y subcategorías de empleo añadidas con éxito', 'Éxito');
                this.newCategoryJob = '';
                this.subCategories = [];
                this.loadAllCategoriesJobs(this.currentPage);
            },
            error: (err) => {
                console.error('Error añadiendo categoría y subcategorías de empleo', err);
                this.toastr.error('Hubo un error al añadir la categoría y subcategorías de empleo', 'Error');
            },
        });
    }
};
CategoriesJobsComponent = __decorate([
    Component({
        selector: 'app-categories-jobs',
        templateUrl: './categories-jobs.component.html',
        styleUrl: './categories-jobs.component.scss'
    })
], CategoriesJobsComponent);
export { CategoriesJobsComponent };
//# sourceMappingURL=categories-jobs.component.js.map