import { Component } from '@angular/core';
import { ContactProffesionalService } from '../../core/service/contact-proffesional.service';
import { ToastrService } from 'ngx-toastr';


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
  searchText: string = '';
  replyMessage: string = '';
  reply:string="";
  selectedContactProffesional:any={}
  selectedMessage: any = {};
  replySubject: string = '';
  filterState: string = '';
  addressNewEmail:string='';
  replyNewEmailSubject:string='';
  replyNewEmailMessage:string='';
 

  constructor(private contactProffesionalService: ContactProffesionalService,private toastr:ToastrService) { }
;

  ngOnInit(): void {
    this.loadAllContactProffesionalMenssage(this.currentPage);
  }

  onFilterChange(): void {
    this.currentPage = 1; // Resetea la página actual a 1 cuando cambia el filtro
    this.loadAllContactProffesionalMenssage(this.currentPage);
  }

  loadAllContactProffesionalMenssage(page: number): void {

    this.contactProffesionalService.loadContacProffesionaltMenssage(page, this.pageSize,this.searchText,this.filterState).subscribe({
      next: (response: any) => {
        this.AllContactMenssage = response.data;
        this.totalItems = response.totalItems;
        console.log('Mensajes cargados:', this.AllContactMenssage);
      },
      error: (err) => {
        console.error('Error loading salons', err);
      }
    });
  }

  selectMessageToReply(message: any) {
    this.selectedMessage = message;
    this.replySubject = ''; 
    this.replyMessage = '';
  }


  sendReply() {
    if (!this.replyMessage.trim()) {
      alert('El mensaje no puede estar vacío.');
      return;
    }

    // Aquí deberías implementar la lógica para enviar el mensaje, probablemente llamando a un servicio
    console.log('Enviando respuesta:', {
      to: this.selectedMessage.email,
      subject: this.replySubject,
      message: this.replyMessage,
    });

    // Luego de enviar, podrías resetear los campos o cerrar el modal.
  }

  onSearch(): void {
    this.loadAllContactProffesionalMenssage(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllContactProffesionalMenssage(this.currentPage);
    }
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

  selectedStateContactProffesional(message:any){
    this.selectedContactProffesional = {
      id_contact: message.id_contact,
      state: message.state
    };
  }


  UpdateStateContactProffesional(){
    this.contactProffesionalService.updateStateContactProffesional(this.selectedContactProffesional.id_contact,this.selectedContactProffesional.state).subscribe({
      next: () => {
        this.loadAllContactProffesionalMenssage(this.currentPage);
        this.allSelected = false;
        this.toastr.success('Estado actualizado con éxito');
        
      },
      error: (err) => {
        console.error('Error updating contact state', err);
        this.toastr.error('Error al actualizar el estado del contacto profesional');
      }
    });
  }
  
  sendReplyContactProffesional() {
    const id_contact = this.selectedMessage.id_contact;
    const to = this.selectedMessage.email;
    const subject = this.replySubject;
    const message = this.replyMessage;
    const replyMessage = this.replyMessage;
  

    this.contactProffesionalService.sendEmailContactProffesional(id_contact,to, subject, message,replyMessage).subscribe(
      (response) => {
        this.toastr.success('Correo enviado con éxito');
        this.loadAllContactProffesionalMenssage(this.currentPage);
      
        // Cerrar el modal después de enviar el correo
      },
      (error) => {
        this.toastr.error('Error al enviar el correo');
        console.error(error);
      }
    );
  }
    sendNewEmailContactProffesional() {
    const to = this.addressNewEmail;
    const subject = this.replyNewEmailSubject;
    const message = this.replyNewEmailMessage;
    
  
    this.contactProffesionalService.sendNewEmailContactProffesional(to, subject, message).subscribe(
      (response) => {
        this.toastr.success('Correo enviado con éxito');
        this.loadAllContactProffesionalMenssage(this.currentPage);
      },
      (error) => {
        this.toastr.error('Error al enviar el correo');
        console.error(error);
      }
    );
  }

  
  confirmDelete(): void {
    const selectedContacts = this.AllContactMenssage.filter(contact => contact.selected);
    if (selectedContacts.length === 0) {
      this.toastr.warning('No has seleccionado ningún mensaje para eliminar.');
      return;
    }
    console.log('Contactos seleccionados para eliminar:', selectedContacts); // Muestra los contactos seleccionados en la consola
  
    const idsToDelete = selectedContacts.map(contact => contact.id_contact);
  
    this.contactProffesionalService.deleteContactsProfessional(idsToDelete).subscribe({

      next: () => {
        this.toastr.success('Mensajes eliminados con éxito');
        this.loadAllContactProffesionalMenssage(this.currentPage);
        this.AllContactMenssage.forEach(contact => contact.selected = false); // Limpiar selección
        this.allSelected = false;
      },
      error: (err) => {
        console.error('Error eliminando contactos', err);
        this.toastr.error('Error al eliminar los mensajes seleccionados.');
      }
    });
  }
}
