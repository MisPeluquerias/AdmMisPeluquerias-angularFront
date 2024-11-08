import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
let HeaderService = class HeaderService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getImgUser(id_user) {
        const params = new HttpParams().set('id_user', id_user.toString());
        return this.http.get(`${this.baseUrl}/header/getImgUser`, { params });
    }
    getAlertCount() {
        return this.http.get(`${this.baseUrl}/notifications/count`);
    }
    getAllNotifications() {
        return this.http.get(`${this.baseUrl}/notifications/all`);
    }
    deleteNotification(id) {
        return this.http.delete(`${this.baseUrl}/notifications/delete/${id}`);
    }
};
HeaderService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], HeaderService);
export { HeaderService };
//# sourceMappingURL=header.service.js.map