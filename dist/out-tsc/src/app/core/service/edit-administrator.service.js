import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
let EditAdministratorService = class EditAdministratorService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getAdminById(id_user) {
        return this.http.get(`${this.baseUrl}/edit-admin/getAdminById`, {
            params: {
                id_user
            },
        });
        ;
    }
    updateAdmin(adminData) {
        const id_user = adminData.id_user;
        return this.http.put(`${this.baseUrl}/edit-admin/updateAdmin/${id_user}`, adminData);
    }
    getCitiesByProvince(id_province) {
        return this.http.get(`${this.baseUrl}/edit-admin/getCitiesByProvinceForEditAdmin`, {
            params: { id_province: id_province.toString() }
        });
    }
    getProvinces() {
        return this.http.get(`${this.baseUrl}/edit-admin/getProvinces`);
    }
};
EditAdministratorService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], EditAdministratorService);
export { EditAdministratorService };
//# sourceMappingURL=edit-administrator.service.js.map