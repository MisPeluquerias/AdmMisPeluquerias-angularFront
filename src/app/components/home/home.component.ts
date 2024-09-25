import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../core/service/home.service';
import { Router } from '@angular/router';

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

  constructor(private homeService: HomeService, private router:Router) { }

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

  deleteSelected() {
    this.AllSalon = this.AllSalon.filter(salon => !salon.selected);
    this.allSelected = false;
  }

  editSalon(id: number) {
    this.router.navigate(['home/edit', id]);
  }

}
