import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
let NewClientService = class NewClientService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getClientById(id_salon) {
        return this.http.get(`${this.baseUrl}/edithome/getSalonById`, {
            params: {
                id_salon
            },
        });
        ;
    }
    getProvinces() {
        return this.http.get(`${this.baseUrl}/new-client/getProvincesForNewClient`);
    }
    getCitiesByProvince(id_province) {
        return this.http.get(`${this.baseUrl}/new-client/getCitiesByProvinceForNewClient`, {
            params: { id_province: id_province.toString() }
        });
    }
    uploadProfilePicture(id_user, formData) {
        return this.http.put(`${this.baseUrl}/new-client/uploadProfilePicture/${id_user}`, formData);
    }
    addNewClient(name, lastname, email, phone, address, id_province, id_city, dni, password) {
        const body = {
            name: name,
            lastname: lastname,
            email: email,
            phone: phone,
            address: address,
            id_province: id_province,
            id_city: id_city,
            dni: dni,
            password: password
        };
        console.log('datos enviados al backend:', body);
        return this.http.post(`${this.baseUrl}/new-client/addNewClient`, body);
    }
};
NewClientService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NewClientService);
export { NewClientService };
//# sourceMappingURL=new-client.service.js.map