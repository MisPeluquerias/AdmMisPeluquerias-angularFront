import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
let ContactService = class ContactService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadContactMenssage(page, pageSize, searchText, filterState = '') {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        if (filterState) {
            params = params.set('filterState', filterState);
        }
        return this.http.get(`${this.baseUrl}/contact/getAllMessageContact`, { params });
    }
    updateStateContact(id_contact, state) {
        const data = {
            id_contact: id_contact,
            state: state
        };
        return this.http.put(`${this.baseUrl}/contact/updateStateContact`, data);
    }
    sendEmailContact(to, subject, message) {
        const emailData = { to, subject, message };
        return this.http.post(`${this.baseUrl}/contact/send-reply-contact`, emailData); // Asegúrate de que esta URL coincida con tu backend
    }
};
ContactService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ContactService);
export { ContactService };
//# sourceMappingURL=contact.service.js.map