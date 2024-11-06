import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs/operators';
let CategoriesJobsService = class CategoriesJobsService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllCategoriesJobs(page, pageSize, searchText) {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());
        if (searchText) {
            params = params.set('search', searchText);
        }
        return this.http.get(`${this.baseUrl}/categories-jobs/getAllCategoriesJobs`, { params }).pipe(map((response => {
            // Mapea las categorías y convierte las subcategorías en una cadena separada por comas
            response.data = response.data.map((category) => ({
                ...category,
                subcategoriesText: category.subcategories.map((sub) => sub.name).join(', ')
            }));
            return response;
        })));
    }
    updateBrand(id, data) {
        return this.http.put(`${this.baseUrl}/brands/updateBrand/${id}`, data);
    }
    deleteCategoryJobs(categoryIds) {
        return this.http.post(`${this.baseUrl}/categories-jobs/delete`, { categoryIds: categoryIds });
    }
    addCategorySubcategoryJob(data) {
        console.log('Datos enviados en el servicio:', data);
        return this.http.post(`${this.baseUrl}/categories-jobs/addCategoryWithSubcategoriesJobs`, data);
    }
    getCategories() {
        return this.http.get(`${this.baseUrl}/categories-jobs/getCategories`);
    }
    getCategoryInLive(category) {
        return this.http.get(`${this.baseUrl}/brands/searchCategoryInLive`, {
            params: {
                category,
            },
        });
    }
};
CategoriesJobsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CategoriesJobsService);
export { CategoriesJobsService };
//# sourceMappingURL=categories-jobs.service.js.map