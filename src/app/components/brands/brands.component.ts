import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { BrandsService } from '../../core/service/brands.service';
import { Subject,of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
  categories: Array<{ name: string }> = []
  Math = Math;
  allSelected: boolean = false;
  searchText:string ='';
  selectedBrand: any = { name: '' };
  selectedImgFile: File | null = null;
  brand:any;
  id_brand:any;
  id_brand_category:any;
  newBrand:any;
  imagePreview: string | ArrayBuffer | null = null;
  selectedImgBrang:any;
  selectedUpdateImgFile:any;
  private searchTermsCategory = new Subject<string>();
  selectedCategory: string = '';
  dataCategoryList: any[] = [];
  newCategory: any = { email: '', salons: [] };
  

  constructor(private brandsService: BrandsService,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAllBrands(this.currentPage);
  
    this.searchTermsCategory.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.length >= 2) {
          return this.brandsService.getCategoryInLive(term);
        } else {
          return of([]); 
        }
      })
    ).subscribe({
      next: (category) => {
        this.dataCategoryList = category.map((cat: any) => cat.categories); // Aquí ajustamos el formato
      },
      error: (error) => {
        console.error('Error al buscar categorias:', error);
      },
    });
  }


  loadAllBrands(page: number): void {
    this.brandsService.loadAllBrands(page, this.pageSize, this.searchText).subscribe({
      next: (response: any) => {
        // Convertir 'categories' en un array vacío si es una cadena vacía
        this.AllBrands = response.data.map((brand: any) => {
          return {
            ...brand,
            categories: brand.categories && brand.categories !== '' 
              ? Array.from(new Set(brand.categories.split(',').map((category: string) => category.trim()))) 
              : []
          };
        });
        
        this.totalItems = response.totalItems;
        console.log('Marcas cargadas', this.AllBrands);
      },
      error: (err) => {
        console.error('Error loading brands', err);
      }
    });
  }
  

  selectCategory(category: { name: string }): void {
    // Asegurarse de que 'categories' esté inicializado
    if (!this.newCategory.categories) {
      this.newCategory.categories = [];
    }
  
    // Almacenar solo el nombre de la categoría en el array newCategory.categories
    this.newCategory.categories.push({ name: category.name }); 
    this.dataCategoryList = []; // Limpiar la lista después de la selección
    this.selectedCategory = ''; // Limpiar el campo de entrada
  }

  selectBrand(brand: any): void {
    this.id_brand_category= brand.id_brand_category;
    this.id_brand = brand.id_brand;
    this.selectedBrand = brand.name;
    this.selectedImgBrang = brand.imagePath;
    this.brand = brand;
    console.log('id_brand_category',this.id_brand_category);
     // Reiniciar las categorías antes de cargarlas
  this.categories = []; // Reiniciar la lista de categorías para evitar duplicados
  this.newCategory.categories = []; // Limpiar las categorías añadidas por el usuario
  
    // Convertir las categorías en array si es una cadena
    if (typeof brand.categories === 'string') {
      this.categories = brand.categories.split(',').map((cat: string) => cat.trim());; // Separar por comas y eliminar espacios
    } else {
      // Si ya es un array, asignarlo directamente
      this.categories = Array.isArray(brand.categories) ? brand.categories : [];
    }
    
    console.log('Categorías asignadas:', this.categories);
    console.log('id_brand_category',this.id_brand_category);
  }



  removeCategory(index: number): void {
    this.newCategory.categories.splice(index, 1); // Eliminar el salón de la lista
  }
  removeUpdateCategory(index: number): void {
    // Eliminar la categoría en el índice proporcionado
    this.categories.splice(index, 1);
  }
  


  searchCategory(term: string): void {
    this.searchTermsCategory.next(term);
  }

  updatebrand(): void {
    if (!this.selectedBrand || this.selectedBrand.trim() === '') {
      this.toastr.warning('El nombre de la marca no puede estar vacío.');
      return;
    }
  
    // Crear el FormData
    const formData = new FormData();
    formData.append('name', this.selectedBrand); // Añadir el nombre de la marca
  
    // Asegúrate de que el archivo de imagen se haya seleccionado, si no, solo actualiza las categorías y el nombre
    if (this.selectedUpdateImgFile) {
      formData.append('brandImage', this.selectedUpdateImgFile); // Añadir la imagen si fue seleccionada
    }
  
    // Combinar las categorías existentes con las nuevas categorías
    const combinedCategories = [
      ...this.categories.map(category => ({ name: category })),  // Convertir categorías existentes a objetos con 'name'
      ...this.newCategory.categories                            // Añadir las nuevas categorías seleccionadas
    ];
  
    // Eliminar duplicados (si los hay) basándonos en el nombre de la categoría
    const uniqueCategories = combinedCategories.reduce((acc, current) => {
      const found = acc.find((cat:any) => cat.name === current.name);
      if (!found) acc.push(current);
      return acc;
    }, []);
  
    // Convertir las categorías a JSON y añadirlas al FormData
    formData.append('categories', JSON.stringify(uniqueCategories));
  
    // Llamar al servicio para actualizar la marca, pasando el ID en la URL
    this.brandsService.updateBrand(this.id_brand, formData).subscribe({
      next: (response) => {
        this.toastr.success('Marca actualizada con éxito');
        this.loadAllBrands(this.currentPage); // Recargar la lista de marcas
      },
      error: (error) => {
        this.toastr.error('Error al actualizar la marca');
        console.error('Error al actualizar la marca', error);
      }
    });
  }




  onEditImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.selectedUpdateImgFile = file;
        
        // Crear una vista previa de la imagen seleccionada
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.selectedImgBrang = e.target.result; // Actualizar la imagen mostrada en el modal
        };
        reader.readAsDataURL(file);
    }
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
  
    // Verificar si se seleccionó una imagen
    if (!this.selectedImgFile) {
      this.toastr.warning('Debe seleccionar una imagen para la marca', 'Advertencia');
      return;
    }
  
    if (this.newCategory.categories.length === 0) {
      this.toastr.warning('Debe seleccionar al menos una categoría', 'Advertencia');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newBrand);
    formData.append('brandImage', this.selectedImgFile);
    
    // Extraer solo los nombres de las categorías (o IDs si es el caso)
    const categoryNames = this.newCategory.categories.map((category: any) => category.name);
    const categoriesJson = JSON.stringify(categoryNames);
    
    formData.append('categories', categoriesJson); // Añadir las categorías en formato JSON
    
    formData.forEach((value, key) => {
      console.log(key, value); // Verificar los datos que se envían
    });
    
    this.brandsService.addBrand(formData).subscribe({
      next: (response: any) => {
        this.toastr.success('Marca añadida con éxito', 'Éxito');
        this.loadAllBrands(this.currentPage);
        this.newBrand = ''; // Resetear el campo de nombre de la marca
        this.imagePreview = '../../../assets/img/sello.jpg'; // Resetear la vista previa de la imagen si es necesario
        this.newCategory.categories = []; // Limpiar las categorías seleccionadas
      },
      error: (err: any) => {
        console.error('Error añadiendo marca', err);
        this.toastr.error('Hubo un error al añadir la marca', 'Error');
      },
    });
  }


onImageSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    this.selectedImgFile = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedImgFile);
  }
}
}
