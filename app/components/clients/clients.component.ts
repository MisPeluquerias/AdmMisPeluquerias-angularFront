import { Component } from '@angular/core';
import { ClientsService } from '../../core/service/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {

  AllClients: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;  // Exponer Math al contexto de la plantilla
  searchText:string='';
  allSelected: boolean = false;

  constructor(private clientsService: ClientsService) { }

  ngOnInit(): void {
    this.loadAllClients(this.currentPage);
  }

  loadAllClients(page: number): void {
    this.clientsService.loadAllClients(page, this.pageSize,this.searchText).subscribe({
      next: (response: any) => {
        this.AllClients = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }


    onSearch(): void {
      this.loadAllClients(this.currentPage);
      if (this.searchText.trim() === '') {
        this.loadAllClients(this.currentPage); // Reload with current page if search is cleared
      }
    }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllClients(page);
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
    this.AllClients.forEach(client => client.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllClients.every(client => client.selected);
  }

  hasSelected() {
    return this.AllClients.some(client => client.selected);
  }

  deleteSelected() {
    this.AllClients = this.AllClients.filter(client => !client.selected);
    this.allSelected = false;
  }





}