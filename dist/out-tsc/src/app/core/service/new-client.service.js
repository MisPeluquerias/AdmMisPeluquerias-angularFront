import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
let NewClientService = class NewClientService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getClientById(id_salon) {
        return this.http.get(`${this.baseUrl}/edithome/getSalonById`, {
            params: {
                id_salon
            },
        });
        ;
    }
    getProvinces() {
        return this.http.get(`${this.baseUrl}/new-client/getProvincesForNewClient`);
    }
    getCitiesByProvince(id_province) {
        return this.http.get(`${this.baseUrl}/new-client/getCitiesByProvinceForNewClient`, {
            params: { id_province: id_province.toString() }
        });
    }
    uploadProfilePicture(id_user, formData) {
        return this.http.put(`${this.baseUrl}/new-client/uploadProfilePicture/${id_user}`, formData);
    }
    addNewClient(userData) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(`${this.baseUrl}/new-client/addNewUser`, userData, { headers });
    }
};
NewClientService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NewClientService);
export { NewClientService };
//# sourceMappingURL=new-client.service.js.map