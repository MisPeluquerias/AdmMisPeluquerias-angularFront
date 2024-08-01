import { Component } from '@angular/core';
import { ReclamationService } from '../../core/service/reclamation.service';


@Component({
  selector: 'app-reclamations',
  templateUrl: './reclamations.component.html',
  styleUrl: './reclamations.component.scss'
})
export class ReclamationsComponent {

  AllReclamations: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;  // Exponer Math al contexto de la plantilla
  allSelected: boolean = false;


  constructor(private reclamationService: ReclamationService) { }

  ngOnInit(): void {
    this.loadAllReclamations(this.currentPage);
  }

  loadAllReclamations (page: number): void {
    this.reclamationService.loadAllReclamation(page, this.pageSize).subscribe({
      next: (response: any) => {
        this.AllReclamations = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllReclamations(page);
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

  deleteSelected() {
    this.AllReclamations = this.AllReclamations.filter(reclamation => !reclamation.selected);
    this.allSelected = false;
  }

}
