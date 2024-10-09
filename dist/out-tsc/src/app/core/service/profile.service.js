import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
let ProfileService = class ProfileService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getDataUser(id_user) {
        const params = new HttpParams().set('id_user', id_user.toString());
        return this.http.get(`${this.baseUrl}/profile-user/getDataUser`, { params });
    }
    getProvinces() {
        return this.http.get(`${this.baseUrl}/profile-user/getProvincesForProfile`);
    }
    getCitiesByProvince(id_province) {
        return this.http.get(`${this.baseUrl}/profile-user/getCitiesByProvinceForProfile`, {
            params: { id_province: id_province.toString() }
        });
    }
    updateUserData(userData) {
        return this.http.put(`${this.baseUrl}/profile-user/updateUser`, userData);
    }
    updateUserPassword(id_user, newPassword) {
        const body = { id_user, password: newPassword };
        return this.http.put(`${this.baseUrl}/profile-user/updateUserPassword`, body);
    }
    uploadProfilePicture(id_user, formData) {
        return this.http.put(`${this.baseUrl}/profile-user/uploadProfilePicture/${id_user}`, formData);
    }
    desactivateAccount(id_user) {
        const url = `${this.baseUrl}/profile-user/desactivateAccount/${id_user}`;
        const body = { status: 0 };
        return this.http.patch(url, body);
    }
};
ProfileService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ProfileService);
export { ProfileService };
//# sourceMappingURL=profile.service.js.map