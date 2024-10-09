import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
let CategoriesService = class CategoriesService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllCategories(page, pageSize, searchText) {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        return this.http.get(`${this.baseUrl}/categories/getAllCategories`, { params });
    }
    addCategory(category) {
        const body = { category };
        return this.http.post(`${this.baseUrl}/categories/addCategory`, body);
    }
    updateCategoryName(newCategory, OldCategory) {
        const body = { newCategory, OldCategory };
        return this.http.put(`${this.baseUrl}/categories/updateCategory`, body);
    }
    deleteCategories(categoryNames) {
        return this.http.post(`${this.baseUrl}/categories/delete`, { names: categoryNames });
    }
};
CategoriesService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CategoriesService);
export { CategoriesService };
//# sourceMappingURL=categories.service.js.map