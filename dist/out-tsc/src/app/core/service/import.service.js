import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
let ImportService = class ImportService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllSalonToExport(page, pageSize, searchText) {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        return this.http.get(`${this.baseUrl}/import/getAllSalon`, { params });
    }
    importUpdateExcel(file) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post(`${this.baseUrl}/import/updateExcel`, formData, { responseType: 'blob' });
    }
    uploadNewSalons(file) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post(`${this.baseUrl}/import/addExcel`, formData);
    }
    downloadTemplateExcel() {
        return this.http.get(`${this.baseUrl}/import/downloadExcel`, { responseType: 'blob' });
    }
};
ImportService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ImportService);
export { ImportService };
//# sourceMappingURL=import.service.js.map