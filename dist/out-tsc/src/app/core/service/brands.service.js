import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
let BrandsService = class BrandsService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllBrands(page, pageSize, searchText) {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        return this.http.get(`${this.baseUrl}/brands/getAllBrands`, { params });
    }
    addBrand(formData) {
        return this.http.post(`${this.baseUrl}/brands/addBrand`, formData);
    }
    updateBrand(data) {
        return this.http.put(`${this.baseUrl}/brands/updateBrand`, data);
    }
    deleteBrand(id_brand) {
        return this.http.post(`${this.baseUrl}/brands/deleteBrand`, { id_brand: id_brand });
    }
};
BrandsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], BrandsService);
export { BrandsService };
//# sourceMappingURL=brands.service.js.map