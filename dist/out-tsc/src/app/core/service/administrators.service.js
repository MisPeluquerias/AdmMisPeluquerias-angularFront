import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
let AdministratorsService = class AdministratorsService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllAdministrators(page, pageSize, searchText) {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        return this.http.get(`${this.baseUrl}/administrators/getAllAdministrators`, { params });
    }
    getUserEmail(email) {
        return this.http.get(`${this.baseUrl}/administrators/searchEmailInLive`, {
            params: {
                email
            },
        });
    }
    addnewAdmin(email) {
        console.log('email enviado desde el servicio', email);
        return this.http.put(`${this.baseUrl}/administrators/addNewAdmin`, { email });
    }
};
AdministratorsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AdministratorsService);
export { AdministratorsService };
//# sourceMappingURL=administrators.service.js.map