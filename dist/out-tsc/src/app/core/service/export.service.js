import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
let ExportService = class ExportService {
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
        return this.http.get(`${this.baseUrl}/export/getAllSalon`, { params });
    }
    exportSalonsToExcel() {
        return this.http.get(`${this.baseUrl}/export/exportSalonsToExcel`, { responseType: 'blob' });
    }
};
ExportService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ExportService);
export { ExportService };
//# sourceMappingURL=export.service.js.map