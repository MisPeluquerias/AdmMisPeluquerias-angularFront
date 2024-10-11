import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ContactComponent = class ContactComponent {
    constructor(contactService, toastr) {
        this.contactService = contactService;
        this.toastr = toastr;
        this.AllContactMenssage = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        this.Math = Math; // Exponer Math al contexto de la plantilla
        this.allSelected = false;
        this.searchText = '';
        this.selectStateContact = {};
        this.selectedMessage = {};
        this.replySubject = '';
        this.replyMessage = '';
        this.filterState = '';
    }
    ngOnInit() {
        this.loadAllContactMenssage(this.currentPage);
    }
    onFilterChange() {
        this.currentPage = 1; // Resetea la página actual a 1 cuando cambia el filtro
        this.loadAllContactMenssage(this.currentPage);
    }
    loadAllContactMenssage(page) {
        this.contactService.loadContactMenssage(page, this.pageSize, this.searchText, this.filterState).subscribe({
            next: (response) => {
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
    selectMessageToReply(message) {
        this.selectedMessage = message;
        this.replySubject = '';
        this.replyMessage = '';
    }
    onSearch() {
        this.loadAllContactMenssage(this.currentPage);
        if (this.searchText.trim() === '') {
            this.loadAllContactMenssage(this.currentPage);
        }
    }
    onPageChange(page) {
        this.currentPage = page;
        this.loadAllContactMenssage(page);
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
    selectedStateContact(message) {
        this.selectStateContact = {
            id_contact: message.id_contact,
            state: message.state
        };
    }
    confirUpdateStateContact() {
        this.contactService.updateStateContact(this.selectStateContact.id_contact, this.selectStateContact.state).subscribe({
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
        this.contactService.sendEmailContact(to, subject, message).subscribe((response) => {
            this.toastr.success('Correo enviado con éxito');
            // Cerrar el modal después de enviar el correo
        }, (error) => {
            this.toastr.error('Error al enviar el correo');
            console.error(error);
        });
    }
};
ContactComponent = __decorate([
    Component({
        selector: 'app-contact',
        templateUrl: './contact.component.html',
        styleUrl: './contact.component.scss'
    })
], ContactComponent);
export { ContactComponent };
//# sourceMappingURL=contact.component.js.map