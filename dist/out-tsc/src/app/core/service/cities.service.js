import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
let CitiesService = class CitiesService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllCities(page, pageSize, searchText) {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        return this.http.get(`${this.baseUrl}/cities/getAllCities`, { params });
    }
    deleteCities(citiesToDelete) {
        return this.http.post(`${this.baseUrl}/cities/deleteCities`, citiesToDelete);
    }
};
CitiesService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CitiesService);
export { CitiesService };
//# sourceMappingURL=cities.service.js.map