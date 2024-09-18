import { Component } from '@angular/core';
import { CategoriesService } from '../../core/service/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  AllCategories: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;
  allSelected: boolean = false;
  searchText:string ='';
  selectedCategory: any = { name: '' };
  
  category:any;
  oldCategory:any;
  newCategory:any;


  constructor(private categoriesService: CategoriesService,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAllCategories(this.currentPage);
  }

  loadAllCategories (page: number): void {
    this.categoriesService.loadAllCategories(page, this.pageSize,this.searchText).subscribe({
      next: (response: any) => {
        this.AllCategories = response.data;
        this.totalItems = response.totalItems;
        console.log('Categorias cargadas',this.AllCategories);
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }

  selectCategory(category: any): void {
    this.oldCategory = category.category;  // Guardamos el nombre original de la categoría
    this.selectedCategory = category.category;  // Guardamos el nombre seleccionado para su edición
    this.category = category;
    console.log('nombre de categoria antigua',this.oldCategory);
  }

  updateCategoryName(): void {
    if (!this.selectedCategory || this.selectedCategory.trim() === '') {
      this.toastr.warning('El nombre de la categoría no puede estar vacío', 'Advertencia');
      return;
    }

    this.categoriesService.updateCategoryName(this.selectedCategory, this.oldCategory).subscribe({
      next: (response: any) => {
        this.toastr.success('Categoría actualizada con éxito');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.loadAllCategories(this.currentPage);
        
      },
      error: (err) => {
        console.error('Error updating category', err);
        this.toastr.error('Hubo un error al actualizar la categoría', 'Error');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
  }

  onSearch(): void {
    this.loadAllCategories(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllCategories(this.currentPage); // Reload with current page if search is cleared
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllCategories(page);
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
    this.AllCategories.forEach(category => category.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllCategories.every(category => category.selected);
  }

  hasSelected() {
    return this.AllCategories.some(category => category.selected);
  }

  confirmDelete() {
    const selectedCategories = this.AllCategories.filter(category => category.selected);
    const categoryNames = selectedCategories.map(category => category.category);

    if (categoryNames.length > 0) {
      this.categoriesService.deleteCategories(categoryNames).subscribe({
        next: () => {
          this.toastr.success('Categorías eliminadas con éxito');
          this.loadAllCategories(this.currentPage);
        },
        error: (err) => {
          console.error('Error eliminando categorías', err);
          this.toastr.error('Hubo un error al eliminar las categorías', 'Error');
        }
      });
    }
  }


  addCategory(): void {
    if (!this.newCategory || this.newCategory.trim() === '') {
        this.toastr.warning('El nombre de la categoría no puede estar vacío', 'Advertencia');
        return;
    }

    this.categoriesService.addCategory(this.newCategory).subscribe({
        next: (response: any) => {
            this.toastr.success('Categoría añadida con éxito', 'Éxito');
            this.loadAllCategories(this.currentPage); // Recargar la lista de categorías
            this.newCategory = ''; // Limpiar el campo de entrada después de agregar
        },
        error: (err: any) => {
            console.error('Error añadiendo categoría', err);
            this.toastr.error('Hubo un error al añadir la categoría', 'Error');
        }
    });
}
}
