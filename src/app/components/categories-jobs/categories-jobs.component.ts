import { Component } from '@angular/core';
import { Subject, of } from 'rxjs';
import  {ToastrService} from 'ngx-toastr';
import {CategoriesJobsService} from '../../core/service/categories-jobs.service';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-categories-jobs',
  templateUrl: './categories-jobs.component.html',
  styleUrl: './categories-jobs.component.scss'
})
export class CategoriesJobsComponent {

  AllCategoriesJobs: any[] = [];
  AllCategories: any[] = []; 
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  categories: Array<{ name: string }> = []
  Math = Math;
  allSelected: boolean = false;
  searchText:string ='';
  selectedCategoryJob: string = '';
  subCategories: string[] = [];
  newCategoryJob: string = '';
  editCategoryJob: string = '';
  newSubCategoryJob: string = ''; 
  selectedCategoryId: number | null = null;
  selectedSubCategories: string[] = [];
  selectedSubCategoriesText: string = '';
  subCategoriesAsText: string = '';
  selectedSubCategoryIds: number[] = [];
  


  

  constructor(private CategoriesJobsService: CategoriesJobsService,
    private toastr : ToastrService
  ) { }



  ngOnInit(): void {
    this.loadAllCategoriesJobs(this.currentPage);
    this.getCategories();
  
  }

  getCategories() {
    this.CategoriesJobsService.getCategories().subscribe({
      next: (response: any) => {
        //console.log('Respuesta completa:', response); // Imprime la respuesta completa
        this.AllCategories = response.data || response; // Asigna los datos según la estructura
        //console.log('Categorias cargadas:', this.AllCategories);
      },
      error: (err) => {
        console.error('Error fetching categories', err);
      }
    });
  }
    addSubCategory(value: string) {
      if (value.trim()) {
        this.subCategories.push(value.trim());
        this.newSubCategoryJob = ''; // Agrega la subcategoría a la lista
      }
    }

    removeCategory(index: number): void {
      this.subCategories.splice(index, 1); // Elimina la subcategoría de la lista
    }


    selectCategoryJob(categoryJob: any) {
      this.selectedCategoryJob = categoryJob.name;
       this.selectedCategoryId = categoryJob.id_job_cat;
    }
   
    

  loadAllCategoriesJobs(page: number): void {
    this.CategoriesJobsService.loadAllCategoriesJobs(page, this.pageSize, this.searchText).subscribe({
      next: (response: any) => {
        // Convertir 'categories' en un array vacío si es una cadena vacía
        this.AllCategoriesJobs = response.data.map((categoryJobs: any) => {
          return {
            ...categoryJobs,
            categories: categoryJobs.categories && categoryJobs.categories !== '' 
              ? Array.from(new Set(categoryJobs.categories.split(',').map((category: string) => category.trim()))) 
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
  
  removeUpdateCategory(index: number): void {
    // Eliminar la categoría en el índice proporcionado
    this.categories.splice(index, 1);
  }
  onSearch(): void {
    this.loadAllCategoriesJobs(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllCategoriesJobs(this.currentPage); // Reload with current page if search is cleared
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllCategoriesJobs(page);
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
    console.log('id categorías de empleo a eliminar',CategoryJobId);

    console.log('id categorías de empleo a eliminar',CategoryJobId);
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


  selectSubCategories(categoryJob: any) {
    this.selectedCategoryId = categoryJob.id_job_cat;
    // Extraer nombres de las subcategorías
    this.selectedSubCategories = categoryJob.subcategories.map((subcat: any) => subcat.name);
    this.selectedSubCategoriesText = this.selectedSubCategories.join(', ');

    // Extraer IDs de las subcategorías
    this.selectedSubCategoryIds = categoryJob.subcategories.map((subcat: any) => subcat.id_job_subcat);

    // Imprimir resultados en consola
    //console.log('Texto de subcategorías:', this.selectedSubCategoriesText);
    //console.log('Array de subcategorías:', this.selectedSubCategories);
    //console.log('ID de categoría:', this.selectedCategoryId);
    //console.log('ID de las subcategorías seleccionadas:', this.selectedSubCategoryIds);
}


updateSubCategories(): void {
  // Mostrar el contenido actual del textarea antes de procesarlo
  //console.log('Contenido de selectedSubCategoriesText antes de procesar:', this.selectedSubCategoriesText);

  // Paso 1: Convertir el texto del textarea en un arreglo de subcategorías
  this.selectedSubCategories = this.selectedSubCategoriesText.split(',')
    .map(subCategory => subCategory.trim()) // Eliminar espacios en blanco
    .filter(subCategory => subCategory.length > 0); // Filtrar elementos vacíos

  //console.log('Array de subcategorías después de dividir y filtrar:', this.selectedSubCategories);

  // Paso 2: Verificar si el array de subcategorías está vacío después de procesarlo
  if (this.selectedSubCategories.length === 0) {
    this.toastr.error('Error, introduzca al menos una subcategoría');
    return;
  }

  // Paso 3: Asegurarse de que el ID de la categoría está presente
  if (!this.selectedCategoryId) {
    this.toastr.error('No se pudo actualizar las subcategorías porque falta el ID de la categoría');
    return;
  }

  // Paso 4: Preparar el objeto de actualización para enviar al backend
  const updatedCategory = {
    subcategories: this.selectedSubCategories, // Array de subcategorías procesadas
    id_category: this.selectedCategoryId       // ID de la categoría seleccionada
  };

  //console.log('Objeto actualizado para enviar al backend:', updatedCategory);

  // Paso 5: Llamada al servicio para actualizar las subcategorías
  this.CategoriesJobsService.updateSubCategories(this.selectedCategoryId, updatedCategory).subscribe({
    next: (response) => {
      console.log('Respuesta del servidor:', response);
      this.toastr.success('Subcategorías actualizadas con éxito');
      // Recargar la lista de categorías si es necesario
      this.loadAllCategoriesJobs(this.currentPage);
    },
    error: (err) => {
      console.error('Error al actualizar las subcategorías:', err);
      this.toastr.error('Error al actualizar las subcategorías');
    }
  });
}



  updateCategoryJobs() {
    if (this.selectedCategoryJob && this.selectedCategoryId) {
      const updatedCategory = {
        id: this.selectedCategoryId,
        name: this.selectedCategoryJob
      };

      console.log('Datos enviados para actualizar categoria de empleo:', updatedCategory);


      // Llamada al servicio para actualizar la categoría
      this.CategoriesJobsService.updateCategoryJobs(updatedCategory).subscribe({
        next: (response) => {
          this.toastr.success('Categoría actualizada exitosamente');
          this.loadAllCategoriesJobs(this.currentPage); // Llama a esta función si quieres recargar las categorías después de actualizar
         // Limpia la selección después de actualizar
        },
        error: (error) => {
          this.toastr.error('Error al actualizar la categoría');
          console.error(error); // Para ver el error en la consola y depurar si es necesario

        }
      });
    } else {
      this.toastr.warning('No se seleccionó ninguna categoría para actualizar');
    }
  }

  addCategoryJob(): void {
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
      next: (response: any) => {
        this.toastr.success('Categoría y subcategorías de empleo añadidas con éxito', 'Éxito');
        this.newCategoryJob = '';
        this.subCategories = [];
        this.loadAllCategoriesJobs(this.currentPage);
      },
      error: (err: any) => {
        console.error('Error añadiendo categoría y subcategorías de empleo', err);
        this.toastr.error('Hubo un error al añadir la categoría y subcategorías de empleo', 'Error');
      },
    });
  }
}