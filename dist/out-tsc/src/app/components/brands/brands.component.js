import { __decorate } from "tslib";
import { Component } from '@angular/core';
let BrandsComponent = class BrandsComponent {
    constructor(brandsService, toastr) {
        this.brandsService = brandsService;
        this.toastr = toastr;
        this.AllBrands = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math;
        this.allSelected = false;
        this.searchText = '';
        this.selectedBrand = { name: '' };
        this.selectedImgFile = null;
        this.imagePreview = null;
    }
    ngOnInit() {
        this.loadAllBrands(this.currentPage);
    }
    loadAllBrands(page) {
        this.brandsService.loadAllBrands(page, this.pageSize, this.searchText).subscribe({
            next: (response) => {
                this.AllBrands = response.data;
                this.totalItems = response.totalItems;
                console.log('Marcas cargadas', this.AllBrands);
            },
            error: (err) => {
                console.error('Error loading brands', err);
            }
        });
    }
    selectBrand(brand) {
        this.id_brand = brand.id_brand; // Guardamos el nombre original de la categoría
        this.selectedBrand = brand.name;
        this.selectedImgBrang = brand.imagePath; // Guardamos el nombre seleccionado para su edición
        this.brand = brand;
        //console.log('nombre de marca seleccionada',this.brand.name);
        //console.log('id_marca seleccionada',this.id_brand);
        console.log('ruta de la imagen seleccionada', this.selectedImgBrang);
    }
    updatebrand() {
        if (!this.selectedBrand || this.selectedBrand.trim() === '') {
            this.toastr.warning('El nombre de la marca no puede estar vacío.');
            return;
        }
        if (this.selectedUpdateImgFile) {
            const formData = new FormData();
            formData.append('id_brand', this.id_brand.toString());
            formData.append('name', this.selectedBrand);
            formData.append('brandImage', this.selectedUpdateImgFile); // Asegúrate de que este nombre coincida con el backend
            // Llama a tu servicio para actualizar la marca
            this.brandsService.updateBrand(formData).subscribe((response) => {
                this.toastr.success('Marca actualizada con éxito');
                this.loadAllBrands(this.currentPage);
                //console.log('Marca actualizada exitosamente', response);
                // Aquí puedes cerrar el modal y actualizar la lista de marcas si es necesario
            }, (error) => {
                this.toastr.error('Error al actualizar la marca');
                console.error('Error al actualizar la marca', error);
            });
        }
        else {
            console.warn('No se seleccionó ninguna imagen para actualizar.');
        }
    }
    onEditImageSelected(event) {
        const file = event.target.files[0];
        if (file) {
            this.selectedUpdateImgFile = file;
            // Crear una vista previa de la imagen seleccionada
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedImgBrang = e.target.result; // Actualizar la imagen mostrada en el modal
            };
            reader.readAsDataURL(file);
        }
    }
    onSearch() {
        this.loadAllBrands(this.currentPage);
        if (this.searchText.trim() === '') {
            this.loadAllBrands(this.currentPage); // Reload with current page if search is cleared
        }
    }
    onPageChange(page) {
        this.currentPage = page;
        this.loadAllBrands(page);
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
        this.AllBrands.forEach(brand => brand.selected = this.allSelected);
    }
    checkIfAllSelected() {
        this.allSelected = this.AllBrands.every(brand => brand.selected);
    }
    hasSelected() {
        return this.AllBrands.some(brand => brand.selected);
    }
    confirmDelete() {
        const selectedCategories = this.AllBrands.filter(brand => brand.selected);
        const brandsId = selectedCategories.map(brand => brand.id_brand);
        console.log('id marcas a eliminar', brandsId);
        if (brandsId.length > 0) {
            this.brandsService.deleteBrand(brandsId).subscribe({
                next: () => {
                    this.toastr.success('Marcas eliminadas con éxito');
                    this.loadAllBrands(this.currentPage);
                },
                error: (err) => {
                    console.error('Error eliminando Marcas', err);
                    this.toastr.error('Hubo un error al eliminar las marcas', 'Error');
                }
            });
        }
    }
    addBrand() {
        if (!this.newBrand || this.newBrand.trim() === '') {
            this.toastr.warning('El nombre de la marca no puede estar vacío', 'Advertencia');
            return;
        }
        // Verificar si se seleccionó una imagen
        if (!this.selectedImgFile) {
            this.toastr.warning('Debe seleccionar una imagen para la marca', 'Advertencia');
            return;
        }
        const formData = new FormData();
        formData.append('name', this.newBrand);
        formData.append('brandImage', this.selectedImgFile);
        this.brandsService.addBrand(formData).subscribe({
            next: (response) => {
                this.toastr.success('Marca añadida con éxito', 'Éxito');
                this.loadAllBrands(this.currentPage);
                this.newBrand = ''; // Resetear el archivo seleccionado
                this.imagePreview = '../../../assets/img/sello.jpg'; // Resetear el archivo seleccionado si es necesario
            },
            error: (err) => {
                console.error('Error añadiendo marca', err);
                this.toastr.error('Hubo un error al añadir la marca', 'Error');
            },
        });
    }
    onImageSelected(event) {
        const fileInput = event.target;
        if (fileInput.files && fileInput.files.length > 0) {
            this.selectedImgFile = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(this.selectedImgFile);
        }
    }
};
BrandsComponent = __decorate([
    Component({
        selector: 'app-brands',
        templateUrl: './brands.component.html',
        styleUrl: './brands.component.scss'
    })
], BrandsComponent);
export { BrandsComponent };
//# sourceMappingURL=brands.component.js.map