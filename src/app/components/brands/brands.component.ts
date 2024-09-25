import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { BrandsService } from '../../core/service/brands.service';


@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {

  AllBrands: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;
  allSelected: boolean = false;
  searchText:string ='';
  selectedBrand: any = { name: '' };
  
  brand:any;
  id_brand:any;
  newBrand:any;


  constructor(private brandsService: BrandsService,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAllBrands(this.currentPage);
  }

  loadAllBrands (page: number): void {
    this.brandsService.loadAllBrands(page, this.pageSize,this.searchText).subscribe({
      next: (response: any) => {
        this.AllBrands = response.data;
        this.totalItems = response.totalItems;
        console.log('Marcas cargadas',this.AllBrands);
      },
      error: (err) => {
        console.error('Error loading brands', err);
      }
    });
  }


  selectBrand(brand: any): void {
    this.id_brand = brand.id_brand;  // Guardamos el nombre original de la categoría
    this.selectedBrand = brand.name;  // Guardamos el nombre seleccionado para su edición
    this.brand = brand;
    console.log('nombre de marca seleccionada',this.brand.name);
     console.log('id_marca seleccionada',this.id_brand);
  }

  updatebrand(): void {
    if (!this.selectedBrand || this.selectedBrand.trim() === '') {
      this.toastr.warning('El nombre de la marca no puede estar vacío', 'Advertencia');
      return;
    }

    this.brandsService.updateBrand(this.id_brand, this.selectedBrand).subscribe({
      next: (response: any) => {
        this.toastr.success('Marca actualizada con éxito');
        this.loadAllBrands(this.currentPage);
      },
      error: (err) => {
        console.error('Error updating brand', err);
        this.toastr.error('Hubo un error al actualizar la marca', 'Error');
       this.loadAllBrands(this.currentPage);
      }
    });
  }

  onSearch(): void {
    this.loadAllBrands(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllBrands(this.currentPage); // Reload with current page if search is cleared
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllBrands(page);
  }

  get pageCount(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
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

    console.log('id marcas a eliminar',brandsId);
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


  addBrand(): void {
    if (!this.newBrand || this.newBrand.trim() === '') {
        this.toastr.warning('El nombre de la marca no puede estar vacío', 'Advertencia');
        return;
    }

    this.brandsService.addBrand(this.newBrand).subscribe({
        next: (response: any) => {
            this.toastr.success('Marca añadida con éxito', 'Éxito');
            this.loadAllBrands(this.currentPage); // Recargar la lista de categorías
            this.newBrand = ''; // Limpiar el campo de entrada después de agregar
        },
        error: (err: any) => {
            console.error('Error añadiendo marca', err);
            this.toastr.error('Hubo un error al añadir la marca', 'Error');
        }
    });
}
}
