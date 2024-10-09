import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
let EditCityService = class EditCityService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getCityById(id_city) {
        return this.http.get(`${this.baseUrl}/edit-city/getCityById`, {
            params: {
                id_city
            },
        });
        ;
    }
    updateCity(cityData) {
        const id_city = cityData.id_city;
        return this.http.put(`${this.baseUrl}/edit-city/updateCity/${id_city}`, cityData);
    }
    getProvinces() {
        return this.http.get(`${this.baseUrl}/edit-city/getProvinces`);
    }
};
EditCityService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], EditCityService);
export { EditCityService };
//# sourceMappingURL=edit-city.service.js.map