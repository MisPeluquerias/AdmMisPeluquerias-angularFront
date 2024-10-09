import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
let ClientsService = class ClientsService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllClients(page, pageSize, searchText) {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        return this.http.get(`${this.baseUrl}/clients/getAllClients`, { params });
    }
};
ClientsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ClientsService);
export { ClientsService };
//# sourceMappingURL=clients.service.js.map