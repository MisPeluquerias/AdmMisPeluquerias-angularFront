import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
let EditOwnerService = class EditOwnerService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getOwnerById(id_user) {
        return this.http.get(`${this.baseUrl}/edit-owner/getOwnerById`, {
            params: {
                id_user
            },
        });
        ;
    }
    updateOwner(clientData) {
        const id_user = clientData.id_user;
        return this.http.put(`${this.baseUrl}/edit-owner/updateOwner/${id_user}`, clientData);
    }
    getCitiesByProvince(id_province) {
        return this.http.get(`${this.baseUrl}/edit-owner/getCitiesByProvinceForEditOwner`, {
            params: { id_province: id_province.toString() }
        });
    }
    getProvinces() {
        return this.http.get(`${this.baseUrl}/edit-owner/getProvinces`);
    }
    getSalonOwnerById(id_user) {
        return this.http.get(`${this.baseUrl}/edit-owner/getSalonOwnerById`, {
            params: { id_user: id_user.toString() },
        });
    }
    deleteSalonById(id_salon) {
        return this.http.get(`${this.baseUrl}/edit-owner/deleteSalonById`, {
            params: { id_user: id_salon.toString() },
        });
    }
    getSalonName(name) {
        return this.http.get(`${this.baseUrl}/edit-owner/searchSalonInLive`, {
            params: {
                name,
            },
        });
    }
    updateUserSalon(id_user_salon, id_salon) {
        const url = `${this.baseUrl}/edit-owner/updateUserSalon/${id_user_salon}`;
        const body = { id_salon };
        return this.http.put(url, body);
    }
    deleteUserSalon(id_user_salon) {
        const url = `${this.baseUrl}/edit-owner/deleteUserSalon/${id_user_salon}`;
        return this.http.delete(url);
    }
    addUserSalon(data) {
        return this.http.post(`${this.baseUrl}/edit-owner/addUserSalon`, data);
    }
};
EditOwnerService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], EditOwnerService);
export { EditOwnerService };
//# sourceMappingURL=edit-owner.service.js.map