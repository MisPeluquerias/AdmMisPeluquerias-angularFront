import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../core/service/home.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  AllSalon: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;
  searchText='';
  filterState: string = '';
  filterActive: boolean = true;
  salonPermiso:string='';
  showBoton:boolean=false;

  constructor(private homeService: HomeService, private router:Router,
    private toastr: ToastrService
  ) { }

  allSelected: boolean = false;

  ngOnInit(): void {
    this.loadAllSalon(this.currentPage);
    this.homeService.getUserPermiso().subscribe(
      (response: any) => {
        //console.log('Permiso recibido:', response.permiso);
        if (response.permiso === 'salon') {
          this.salonPermiso = 'salon';
          this.showBoton = false;
          //console.log('mostrarNegocios se establece en true');
        } else if (response.permiso === 'admin') {
          this.salonPermiso = 'admin';
          this.showBoton = true;
          //console.log('mostrarNegocios se establece en true');
        } else {
          this.showBoton = false;
          //console.log('mostrarNegocios se establece en false');
        }
      },
      (error) => {
        console.log('Error fetching permiso:', error);
      }
    );
  }


  
  loadAllSalon(page: number): void {
    this.homeService.loadAllSalon(page, this.pageSize, this.searchText, this.filterState, this.filterActive).subscribe({
      next: (response: any) => {
        this.AllSalon = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }
  

  onFilterChange(): void {
    this.currentPage = 1; // Resetea la página actual a 1 cuando cambia el filtro
    this.loadAllSalon(this.currentPage);
  }

  onSearch(): void {

    this.loadAllSalon(this.currentPage);

    if (this.searchText.trim() === '') {
      this.loadAllSalon(this.currentPage); // Reload with current page if search is cleared
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllSalon(page);
  }

  getSalonUrl(salon: any): string {
    if (!salon || !salon.name || !salon.id_salon) {
      return '#';  // Si faltan datos del salón, devuelve una URL por defecto o vacía
    }
    const salonSlug = salon.name
      .toLowerCase()
      .replace(/ /g, '-')           // Reemplaza los espacios con guiones
      .replace(/[^a-z0-9-]/g, '')   // Elimina caracteres no alfanuméricos y deja solo guiones y letras
      .replace(/--+/g, '-');        // Reemplaza múltiples guiones seguidos por uno solo
  
    // Construye y retorna la URL completa
    return `https://www.mispeluquerias.com/centro/${salonSlug}/${salon.id_salon}`;
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
    this.AllSalon.forEach(salon => salon.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllSalon.every(salon => salon.selected);
  }

  hasSelected() {
    return this.AllSalon.some(salon => salon.selected);
  }

 

  editSalon(id: number) {
    this.router.navigate(['home/edit', id]);
  }

  confirmDelete(): void {
    const selectedBusiness = this.AllSalon.filter(business => business.selected);
    if (selectedBusiness.length === 0) {
      this.toastr.warning('No has seleccionado ningún negocio para eliminar.');
      return;
    }
    console.log('Negocios seleccionados para eliminar:', selectedBusiness); // Muestra los contactos seleccionados en la consola
  
    const idsToDelete = selectedBusiness.map(business => business.id_salon);
  
    this.homeService.deleteBusiness(idsToDelete).subscribe({

      next: () => {
        this.toastr.success('Negocio/s eliminados con éxito');
        this.loadAllSalon(this.currentPage);
        this.AllSalon.forEach(businnes => businnes.selected = false); // Limpiar selección
        this.allSelected = false;
      },
      error: (err) => {
        console.error('Error eliminando negocios', err);
        this.toastr.error('Error al eliminar los negocio/s seleccionados.');
      }
    });
  } 
}
