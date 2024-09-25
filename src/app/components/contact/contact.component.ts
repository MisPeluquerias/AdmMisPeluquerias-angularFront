import { Component } from '@angular/core';
import { ContactService } from '../../core/service/contact.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {


  AllContactMenssage: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;  // Exponer Math al contexto de la plantilla
  allSelected: boolean = false;
  searchText : string = '';
  selectStateContact:any={};
  selectedMessage: any = {};
  replySubject: string = '';
  replyMessage: string = '';
  filterState: string = '';

  constructor(private contactService: ContactService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.loadAllContactMenssage(this.currentPage);
  }


  onFilterChange(): void {
    this.currentPage = 1; // Resetea la página actual a 1 cuando cambia el filtro
    this.loadAllContactMenssage(this.currentPage);

  }

  loadAllContactMenssage(page: number): void {

    this.contactService.loadContactMenssage(page, this.pageSize,this.searchText,this.filterState).subscribe({
      next: (response: any) => {
        this.AllContactMenssage = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }


  sendReply() {
    if (!this.replyMessage.trim()) {
      alert('El mensaje no puede estar vacío.');
      return;
    }
  }

  selectMessageToReply(message: any) {
    this.selectedMessage = message;
    this.replySubject = ''; 
    this.replyMessage = '';
  }
  
  onSearch(): void {
    this.loadAllContactMenssage(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllContactMenssage(this.currentPage);
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllContactMenssage(page);
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

  selectedStateContact(message:any){
    this.selectStateContact = {
      id_contact: message.id_contact,
      state: message.state
    };
  }
  confirUpdateStateContact(){
    this.contactService.updateStateContact(this.selectStateContact.id_contact,this.selectStateContact.state).subscribe({
      next: () => {
        this.loadAllContactMenssage(this.currentPage);
        this.allSelected = false;
        
      },
      error: (err) => {
        console.error('Error updating contact state', err);
      }
    });
  }

  sendReplyContact() {
    const to = this.selectedMessage.email;
    const subject = this.replySubject;
    const message = this.replyMessage;
  

    this.contactService.sendEmailContact(to, subject, message).subscribe(
      (response) => {
        this.toastr.success('Correo enviado con éxito');
        // Cerrar el modal después de enviar el correo
      },
      (error) => {
        this.toastr.error('Error al enviar el correo');
        console.error(error);
      }
    );
  }
}
