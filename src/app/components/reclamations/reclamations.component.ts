import { Component } from '@angular/core';
import { ReclamationService } from '../../core/service/reclamation.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-reclamations',
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.scss'] // corregido styleUrl a styleUrls
})
export class ReclamationsComponent {
  AllReclamations: any[] = [];
  currentPage: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;
  allSelected: boolean = false;
  searchText: string = '';
  selectedReclamation:any={};
  filterState: string = '';

  constructor(private reclamationService: ReclamationService,private toastr : ToastrService) { }

  ngOnInit(): void {
    this.loadAllReclamations(this.currentPage);
  }

  onFilterChange(): void {
    this.currentPage = 1; // Resetea la página actual a 1 cuando cambia el filtro
    this.loadAllReclamations(this.currentPage);
  }

  loadAllReclamations(page: number): void {
    this.reclamationService.loadAllReclamation(this.currentPage, this.pageSize, this.searchText,this.filterState).subscribe({
      next: (response: any) => {
        this.AllReclamations = response.data;
        this.totalItems = response.pagination.totalItems;
      },
      error: (err) => {
        console.error('Error loading reclamations', err);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1; // Resetea la página actual a 1 cuando buscas
    this.loadAllReclamations(this.currentPage);
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.pageCount) {
      this.currentPage = page;
      this.loadAllReclamations(this.currentPage);
    }
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
    this.AllReclamations.forEach(reclamation => reclamation.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllReclamations.every(reclamation => reclamation.selected);
  }

  hasSelected() {
    return this.AllReclamations.some(reclamation => reclamation.selected);
  }


  selectedReclamationUpdate(reclamation: any) {
    this.selectedReclamation = {
      id_salon_reclamacion: reclamation.id_salon_reclamacion,
      id_user:reclamation.id_user,
      salon_name: reclamation.salon_name,
      state: reclamation.state,
      email: reclamation.email,
    };
    console.log('selectedReclamation:', this.selectedReclamation);
  }
  
  cofirmUpdateState(){
    this.reclamationService.updateStateReclamation(this.selectedReclamation.id_salon_reclamacion,this.selectedReclamation.id_user,this.selectedReclamation.salon_name,this.selectedReclamation.state,this.selectedReclamation.email).subscribe({
      next: () => {
        this.loadAllReclamations(this.currentPage);
        this.allSelected = false;
        this.toastr.success('Estado actualizado con éxito');
        
      },
      error: (err) => {
        this.toastr.error('Error al actualizar el estado del reclamación');
        console.error('Error updating reclamation state', err);
      }
    });
  }


  confirmDelete(): void {
    const selectedReclamations = this.AllReclamations
      .filter(reclamation => reclamation.selected)
      .map(reclamation => reclamation.id_salon_reclamacion);
      
    if (selectedReclamations.length > 0) {
      this.reclamationService.deleteReclamations(selectedReclamations).subscribe({
        next: () => {
          // Filtrar la lista localmente para eliminar las seleccionadas
          this.AllReclamations = this.AllReclamations.filter(reclamation => !reclamation.selected);
          this.allSelected = false;
          // Mostrar notificación de éxito
          this.toastr.success('Reclamaciones eliminadas correctamente');
        },
        error: (err) => {
          console.error('Error eliminando reclamaciones', err);
          // Mostrar notificación de error
          this.toastr.error('Error al eliminar reclamaciones');
        }
      });
    } else {
      this.toastr.warning('No hay reclamaciones seleccionadas para eliminar');
    }
  }
}
