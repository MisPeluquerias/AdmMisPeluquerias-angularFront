import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
let NewHomeService = class NewHomeService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getProvinces() {
        return this.http.get(`${this.baseUrl}/edithome/getProvinces`);
    }
    getCitiesByProvince(id_province) {
        return this.http.get(`${this.baseUrl}/edithome/getCitiesByProvince`, {
            params: { id_province: id_province.toString() }
        });
    }
    createSalon(salonData) {
        const url = `${this.baseUrl}/edithome/createSalon`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post(url, salonData, { headers });
    }
    getUserPermiso() {
        const permiso = localStorage.getItem('permiso');
        return this.http.get(`${this.baseUrl}/decode-permiso/permiso-home`, {
            params: { permiso: permiso || '' }
        });
    }
};
NewHomeService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NewHomeService);
export { NewHomeService };
//# sourceMappingURL=new-home.service.js.map