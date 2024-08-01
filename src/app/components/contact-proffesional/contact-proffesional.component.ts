import { Component } from '@angular/core';
import { ContactProffesionalService } from '../../core/service/contact-proffesional.service';



@Component({
  selector: 'app-contact-proffesional',
  templateUrl: './contact-proffesional.component.html',
  styleUrl: './contact-proffesional.component.scss'
})
export class ContactProffesionalComponent {



  AllContactMenssage: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;  // Exponer Math al contexto de la plantilla
  allSelected: boolean = false;
  
  constructor(private contactService: ContactProffesionalService) { }

  ngOnInit(): void {
    this.loadAllContactProffesionalMenssage(this.currentPage);
  }

  loadAllContactProffesionalMenssage(page: number): void {

    this.contactService.loadContacProffesionaltMenssage(page, this.pageSize).subscribe({
      next: (response: any) => {
        this.AllContactMenssage = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllContactProffesionalMenssage(page);
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
    this.AllContactMenssage.forEach(contact => contact.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllContactMenssage.every(contact => contact.selected);
  }

  hasSelected() {
    return this.AllContactMenssage.some(contact => contact.selected);
  }

  deleteSelected() {
    this.AllContactMenssage = this.AllContactMenssage.filter(contact => !contact.selected);
    this.allSelected = false;
  }

}
