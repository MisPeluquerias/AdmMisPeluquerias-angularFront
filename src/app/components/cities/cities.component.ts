import { Component } from '@angular/core';
import { CitiesService } from '../../core/service/cities.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent {
  AllCities: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;  // Exponer Math al contexto de la plantilla
  allSelected: boolean = false;
  searchText: string = '';

  constructor(private citiesService: CitiesService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loadAllCities(this.currentPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllCities(page);
  }

  loadAllCities(page: number): void {
    this.citiesService.loadAllCities(page, this.pageSize,this.searchText).subscribe({
      next: (response: any) => {
        this.AllCities = response.data;
        this.totalItems = response.totalItems;
        console.log('ciudades cargadas',this.AllCities);
      },
      error: (err) => {
        console.error('Error loading cities', err);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to first page on new search
    this.loadAllCities(this.currentPage);
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
    this.AllCities.forEach(city => city.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllCities.every(city => city.selected);
  }

  hasSelected() {
    return this.AllCities.some(city => city.selected);
  }

  deleteSelected() {
    this.AllCities = this.AllCities.filter(city => !city.selected);
    this.allSelected = false;
  }

  editCity(id: number) {
    this.router.navigate(['edit-city/edit',id]);
  }

}
