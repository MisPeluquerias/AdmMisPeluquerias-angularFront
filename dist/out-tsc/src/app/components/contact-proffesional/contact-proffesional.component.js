import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ContactProffesionalComponent = class ContactProffesionalComponent {
    constructor(contactProffesionalService, toastr) {
        this.contactProffesionalService = contactProffesionalService;
        this.toastr = toastr;
        this.AllContactMenssage = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math; // Exponer Math al contexto de la plantilla
        this.allSelected = false;
        this.searchText = '';
        this.replyMessage = '';
        this.reply = "";
        this.selectedContactProffesional = {};
        this.selectedMessage = {};
        this.replySubject = '';
        this.filterState = '';
    }
    ;
    ngOnInit() {
        this.loadAllContactProffesionalMenssage(this.currentPage);
    }
    onFilterChange() {
        this.currentPage = 1; // Resetea la página actual a 1 cuando cambia el filtro
        this.loadAllContactProffesionalMenssage(this.currentPage);
    }
    loadAllContactProffesionalMenssage(page) {
        this.contactProffesionalService.loadContacProffesionaltMenssage(page, this.pageSize, this.searchText, this.filterState).subscribe({
            next: (response) => {
                this.AllContactMenssage = response.data;
                this.totalItems = response.totalItems;
            },
            error: (err) => {
                console.error('Error loading salons', err);
            }
        });
    }
    selectMessageToReply(message) {
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
    onSearch() {
        this.loadAllContactProffesionalMenssage(this.currentPage);
        if (this.searchText.trim() === '') {
            this.loadAllContactProffesionalMenssage(this.currentPage);
        }
    }
    onPageChange(page) {
        this.currentPage = page;
        this.loadAllContactProffesionalMenssage(page);
    }
    get pageCount() {
        return Math.ceil(this.totalItems / this.pageSize);
    }
    get pages() {
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
    selectedStateContactProffesional(message) {
        this.selectedContactProffesional = {
            id_contact: message.id_contact,
            state: message.state
        };
    }
    UpdateStateContactProffesional() {
        this.contactProffesionalService.updateStateContactProffesional(this.selectedContactProffesional.id_contact, this.selectedContactProffesional.state).subscribe({
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
        const to = this.selectedMessage.email;
        const subject = this.replySubject;
        const message = this.replyMessage;
        this.contactProffesionalService.sendEmailContactProffesional(to, subject, message).subscribe((response) => {
            this.toastr.success('Correo enviado con éxito');
            // Cerrar el modal después de enviar el correo
        }, (error) => {
            this.toastr.error('Error al enviar el correo');
            console.error(error);
        });
    }
};
ContactProffesionalComponent = __decorate([
    Component({
        selector: 'app-contact-proffesional',
        templateUrl: './contact-proffesional.component.html',
        styleUrl: './contact-proffesional.component.scss'
    })
], ContactProffesionalComponent);
export { ContactProffesionalComponent };
//# sourceMappingURL=contact-proffesional.component.js.map