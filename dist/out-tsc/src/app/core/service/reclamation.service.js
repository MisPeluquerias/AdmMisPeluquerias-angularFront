import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
let ReclamationService = class ReclamationService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllReclamation(page, pageSize, searchText, filterState = '') {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        if (filterState) {
            params = params.set('filterState', filterState);
        }
        return this.http.get(`${this.baseUrl}/reclamations/getAllReclamations`, { params });
    }
    updateStateReclamation(id_salon_reclamacion, id_user, salon_name, state, email) {
        const data = {
            id_salon_reclamacion: id_salon_reclamacion,
            id_user: id_user,
            salon_name: salon_name,
            state: state,
            email: email
        };
        return this.http.put(`${this.baseUrl}/reclamations/updateStateReclamation`, data);
    }
};
ReclamationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ReclamationService);
export { ReclamationService };
//# sourceMappingURL=reclamation.service.js.map