import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpParams } from "@angular/common/http";
let ServicesService = class ServicesService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllServices(page, pageSize, searchText) {
        let params = new HttpParams()
            .set("page", page.toString())
            .set("pageSize", pageSize.toString());
        if (searchText) {
            params = params.set("search", searchText);
        }
        return this.http.get(`${this.baseUrl}/services/getAllServices`, {
            params,
        });
    }
    addNewService(service) {
        return this.http.post(`${this.baseUrl}/services/addService`, service);
    }
    deleteServiceWithSubservice(id_service) {
        return this.http.delete(`${this.baseUrl}/services/deleteServiceWithSubservices/${id_service}`);
    }
    updateSubservices(id_service, data) {
        return this.http.put(`${this.baseUrl}/services/updateSubservices/${id_service}`, data);
    }
    updateCategories(id_service, data) {
        return this.http.put(`${this.baseUrl}/services/updateCategories/${id_service}`, data);
    }
    updateService(service_type_ids, data) {
        return this.http.put(`${this.baseUrl}/services/updateService/${service_type_ids}`, data);
    }
    getCategoryInLive(category) {
        return this.http.get(`${this.baseUrl}/services/searchCategoryInLive`, {
            params: {
                category,
            },
        });
    }
};
ServicesService = __decorate([
    Injectable({
        providedIn: "root",
    })
], ServicesService);
export { ServicesService };
//# sourceMappingURL=services.service.js.map