import { Component } from "@angular/core";
import { OwnerSalonService } from "../../core/service/owner-salon.service";
import { Router } from "@angular/router";
import { Subject, of } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: "app-owner-salon",
  templateUrl: "./owner-salon.component.html",
  styleUrls: ["./owner-salon.component.scss"],
})
export class OwnerSalonComponent {
  AllOwners: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  searchText: string = "";
  allSelected: boolean = false;
  newOwner: any = { email: '', salons: [] }; // Añadido un array para almacenar múltiples salones
  private searchTermsEmail = new Subject<string>();
  private searchTermsSalon = new Subject<string>();
  emailOwners: string[] = [];
  dataSalonList: any[] = [];
  selectedSalon: string = '';

  constructor(
    private ownerSalonService: OwnerSalonService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllOwners(this.currentPage);

    this.searchTermsEmail.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.length >= 2) {
          return this.ownerSalonService.getUserEmail(term);
        } else {
          return of([]); 
        }
      })
    ).subscribe({
      next: (emailOwners) => {
        this.emailOwners = emailOwners
          .filter((user: any) => user && user.email)
          .map((user: any) => user.email);
      },
      error: (error) => {
        console.error('Error al buscar emails:', error);
      },
    });

    
    this.searchTermsSalon.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.length >= 2) {
          return this.ownerSalonService.getSalonName(term);
        } else {
          return of([]); 
        }
      })
    ).subscribe({
      next: (dataSalon) => {
        // Filtrando salones válidos y manteniendo tanto id_salon como name
        this.dataSalonList = dataSalon
          .filter((salon: any) => salon && salon.id_salon && salon.name)
          .map((salon: any) => ({
            id: salon.id_salon,
            name: salon.name
          }));
      },
      error: (error) => {
        console.error('Error al buscar salones:', error);
      },
    });
  }

  addNewOwner(email: string): void {
    if (this.newOwner.salons.length === 0) {
        this.toastr.error("Debes añadir al menos un salón.");
        return;
    }

    // Especificar el tipo de dato esperado en el método map
    const salonIds = this.newOwner.salons.map((salon: { id: number, name: string }) => salon.id);

    const requestData = {
        email: this.newOwner.email,
        salons: salonIds
    };

    this.ownerSalonService.addNewOwner(requestData).subscribe({
        next: () => {
            this.toastr.success("Propietario y salones añadidos con éxito.");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
        error: (error) => {
            console.error("Error al añadir el propietario:", error);
            this.toastr.error("Error, no se pudo añadir el propietario.");
        },
    });
}

  onSearch(): void {
    this.loadAllOwners(this.currentPage);
    if (this.searchText.trim() === "") {
      this.loadAllOwners(this.currentPage);
    }
  }

  searchEmail(term: string): void {
    this.searchTermsEmail.next(term);
  }

  searchSalon(term: string): void {
    this.searchTermsSalon.next(term);
  }

  selectEmail(email: string): void {
    this.newOwner.email = email;
    this.emailOwners = []; // Limpiar la lista después de la selección
  }

  selectSalon(salon: { id: number, name: string }): void {
    // Almacenar tanto el id como el nombre del salón en el array newOwner.salons
    this.newOwner.salons.push({ id: salon.id, name: salon.name }); 
    this.dataSalonList = []; // Limpiar la lista después de la selección
    this.selectedSalon = ''; // Limpiar el campo de entrada
}

  removeSalon(index: number): void {
    this.newOwner.salons.splice(index, 1); // Eliminar el salón de la lista
  }

  loadAllOwners(page: number): void {
    this.ownerSalonService
      .loadAllOwners(page, this.pageSize, this.searchText)
      .subscribe({
        next: (response: any) => {
          this.AllOwners = response.data;
          this.totalItems = response.totalItems;
        },
        error: (err) => {
          console.error("Error cargando los propietarios", err);
        },
      });
  }

  hasSelected() {
    return this.AllOwners.some((owner) => owner.selected);
  }

  deleteSelected() {
    this.AllOwners = this.AllOwners.filter((owner) => !owner.selected);
    this.allSelected = false;
  }

  toggleAllSelection() {
    this.allSelected = !this.allSelected;
    this.AllOwners.forEach((owner) => (owner.selected = this.allSelected));
  }

  checkIfAllSelected() {
    this.allSelected = this.AllOwners.every((owner) => owner.selected);
  }

  editOwner(id: number) {
    this.router.navigate(["edit-owner/edit", id]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllOwners(page);
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
}
