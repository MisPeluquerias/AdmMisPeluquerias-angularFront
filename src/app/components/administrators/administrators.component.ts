import { Component } from '@angular/core';
import { AdministratorsService } from '../../core/service/administrators.service';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent {

  AllAdministrators: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;
  allSelected: boolean = false;
  searchText = '';
  newAdmin: any = [];
  emailUsers: string[] = [];

  private searchTermsEmail = new Subject<string>();

  constructor(private administratorsService: AdministratorsService,
    private toastr : ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllAministrators(this.currentPage);
  
    this.searchTermsEmail.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.length >= 2) {
          return this.administratorsService.getUserEmail(term);
        } else {
          return of([]); 
        }
      })
    )
    .subscribe({
      next: (emailUsers) => {
        // Verificamos si el array contiene objetos y si estos objetos tienen la propiedad 'email'
        this.emailUsers = emailUsers
          .filter((user: any) => user && user.email)
          .map((user: any) => user.email);
  
        console.log('Resultados de la búsqueda de emails:', this.emailUsers);
      },
      error: (error) => {
        console.error('Error al buscar emails:', error);
      },
    });
  }

  searchEmail(term: string): void {
    this.searchTermsEmail.next(term);
  }

  selectEmail(email: string): void {
    this.newAdmin.email = email;
    this.emailUsers = []; // Limpiar la lista de resultados después de seleccionar
  }

  loadAllAministrators(page: number): void {
    this.administratorsService.loadAllAdministrators(page, this.pageSize, this.searchText).subscribe({
      next: (response: any) => {
        this.AllAdministrators = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading administrators', err);
      }
    });
  }

  addNewAdmin(email: string): void {
    this.administratorsService.addnewAdmin(email).subscribe({
      next: (response) => {
        //console.log('Administrador añadido con éxito:', response);
        this.toastr.success('Administrador añadido con éxito');

        setTimeout(() => {
    window.location.reload();}, 1000);
      },
      error: (error) => {
        console.error('Error al añadir el administrador:', error);
        this.toastr.success('Error, no se pudo añadir el administrador');
          setTimeout(() => {
          window.location.reload();}, 2000);
      }
    });
  }

  onSearch(): void {
    this.loadAllAministrators(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllAministrators(this.currentPage); // Recargar con la página actual si se borra la búsqueda
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllAministrators(page);
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

  toggleAllSelection(): void {
    this.allSelected = !this.allSelected;
    this.AllAdministrators.forEach(administrator => administrator.selected = this.allSelected);
  }

  checkIfAllSelected(): void {
    this.allSelected = this.AllAdministrators.every(administrator => administrator.selected);
  }

  hasSelected(): boolean {
    return this.AllAdministrators.some(administrator => administrator.selected);
  }


  editAdministrator(id: number) {
    this.router.navigate(['edit-administrator/edit',id]);
  }

  confirmDelete(): void {
    const selectedAdministrators = this.AllAdministrators.filter(administrator => administrator.selected);
    if (selectedAdministrators.length === 0) {
      this.toastr.warning('No has seleccionado ningún administrador para eliminar.');
      return;
    }
    console.log('Administradores seleccionados para eliminar:', selectedAdministrators); // Muestra los contactos seleccionados en la consola
  
    const idsToDelete = selectedAdministrators.map(administrator => administrator.id_user);
  
    this.administratorsService.deleteAdministrators(idsToDelete).subscribe({

      next: () => {
        this.toastr.success('Administrador/es eliminados con éxito');
        this.loadAllAministrators(this.currentPage);
        this.AllAdministrators.forEach(administrator => administrator.selected = false); // Limpiar selección
        this.allSelected = false;
      },
      error: (err) => {
        console.error('Error eliminando administradores', err);
        this.toastr.error('Error al eliminar los adminsitradores seleccionados.');
      }
    });
  }

}
