import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
let HomeService = class HomeService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllSalon(page, pageSize, searchText, filterState = '', filterActive = false) {
        const permiso = localStorage.getItem('permiso') || '';
        const usuarioId = localStorage.getItem('usuarioId') || '';
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        if (filterState) {
            params = params.set('filterState', filterState);
        }
        params = params.set('filterActive', filterActive.toString());
        params = params.set('permiso', permiso);
        params = params.set('usuarioId', usuarioId);
        return this.http.get(`${this.baseUrl}/home/getAllSalon`, { params });
    }
    getUserPermiso() {
        const permiso = localStorage.getItem('permiso');
        return this.http.get(`${this.baseUrl}/decode-permiso/permiso-aside`, {
            params: { permiso: permiso || '' }
        });
    }
};
HomeService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], HomeService);
export { HomeService };
//# sourceMappingURL=home.service.js.map