import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
let ContactProffesionalService = class ContactProffesionalService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadContacProffesionaltMenssage(page, pageSize, searchText, filterState = '') {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        if (filterState) {
            params = params.set('filterState', filterState);
        }
        return this.http.get(`${this.baseUrl}/contact-proffesional/getAllMessageContactProffesional`, { params });
    }
    updateStateContactProffesional(id_contact, state) {
        const data = {
            id_contact: id_contact,
            state: state
        };
        console.log(data);
        return this.http.put(`${this.baseUrl}/contact-proffesional/updateStateContactProffesional`, data);
    }
    sendEmailContactProffesional(to, subject, message) {
        const emailData = { to, subject, message };
        return this.http.post(`${this.baseUrl}/contact-proffesional/send-reply-contactProffesional`, emailData); // Asegúrate de que esta URL coincida con tu backend
    }
};
ContactProffesionalService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ContactProffesionalService);
export { ContactProffesionalService };
//# sourceMappingURL=contact-proffesional.service.js.map