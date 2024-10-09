import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
let AsideService = class AsideService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getUserName(id_user) {
        const params = new HttpParams().set('id_user', id_user.toString());
        return this.http.get(`${this.baseUrl}/aside/getUserName`, { params });
    }
    getUserPermiso() {
        const permiso = localStorage.getItem('permiso');
        return this.http.get(`${this.baseUrl}/decode-permiso/permiso-aside`, {
            params: { permiso: permiso || '' }
        });
    }
};
AsideService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AsideService);
export { AsideService };
//# sourceMappingURL=aside.service.js.map