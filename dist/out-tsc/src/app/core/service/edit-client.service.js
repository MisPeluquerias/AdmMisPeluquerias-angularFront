import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
let EditClientService = class EditClientService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getClientById(id_user) {
        return this.http.get(`${this.baseUrl}/edit-client/getClientById`, {
            params: {
                id_user
            },
        });
        ;
    }
    updateClient(clientData) {
        const id_user = clientData.id_user;
        return this.http.put(`${this.baseUrl}/edit-client/updateClient/${id_user}`, clientData);
    }
    uploadProfilePicture(id_user, formData) {
        return this.http.put(`${this.baseUrl}/edit-client/uploadProfilePicture/${id_user}`, formData);
    }
    getCitiesByProvince(id_province) {
        return this.http.get(`${this.baseUrl}/edit-client/getCitiesByProvinceForEditClient`, {
            params: { id_province: id_province.toString() }
        });
    }
    getProvinces() {
        return this.http.get(`${this.baseUrl}/edit-client/getProvinces`);
    }
};
EditClientService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], EditClientService);
export { EditClientService };
//# sourceMappingURL=edit-client.service.js.map