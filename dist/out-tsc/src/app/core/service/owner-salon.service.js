import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
let OwnerSalonService = class OwnerSalonService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    loadAllOwners(page, pageSize, searchText) {
        let params = new HttpParams()
            .set("page", page.toString())
            .set("pageSize", pageSize.toString());
        if (searchText) {
            params = params.set("search", searchText);
        }
        return this.http.get(`${this.baseUrl}/owner-salon/getAllOwners`, {
            params,
        });
    }
    addNewOwner(data) {
        return this.http.post(`${this.baseUrl}/owner-salon/addNewOwner`, data);
    }
    getUserEmail(email) {
        return this.http.get(`${this.baseUrl}/owner-salon/searchEmailInLive`, {
            params: {
                email,
            },
        });
    }
    getSalonName(name) {
        return this.http.get(`${this.baseUrl}/owner-salon/searchSalonInLive`, {
            params: {
                name,
            },
        });
    }
};
OwnerSalonService = __decorate([
    Injectable({
        providedIn: "root",
    })
], OwnerSalonService);
export { OwnerSalonService };
//# sourceMappingURL=owner-salon.service.js.map