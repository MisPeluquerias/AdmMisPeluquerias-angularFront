import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
let EditHomeService = class EditHomeService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    getSalonById(id_salon) {
        return this.http.get(`${this.baseUrl}/edithome/getSalonById`, {
            params: {
                id_salon
            },
        });
        ;
    }
    getUserPermiso() {
        const permiso = localStorage.getItem('permiso');
        return this.http.get(`${this.baseUrl}/decode-permiso/permiso-aside`, {
            params: { permiso: permiso || '' }
        });
    }
    updateSalon(salonData) {
        return this.http.put(`${this.baseUrl}/edithome/updateSalon`, salonData);
    }
    getCitiesByProvince(id_province) {
        return this.http.get(`${this.baseUrl}/edithome/getCitiesByProvince`, {
            params: { id_province: id_province.toString() }
        });
    }
    getProvinces() {
        return this.http.get(`${this.baseUrl}/edithome/getProvinces`);
    }
    responseReview(responseReview) {
        return this.http.put(`${this.baseUrl}/edithome/responseReview`, responseReview);
    }
    updateSalonHours(id, hours_old) {
        const url = `${this.baseUrl}/edithome/updateSalonHours/${id}`;
        const body = { hours_old };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(url, body, { headers });
    }
    uploadImage(imageData) {
        const url = `${this.baseUrl}/edithomeimages/uploadImg`;
        return this.http.post(url, imageData).pipe(catchError(this.handleError));
    }
    // Manejo de errores
    handleError(error) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
        }
        else {
            // Error del lado del servidor
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
    getImages(salonId) {
        return this.http.get(`${this.baseUrl}/edithomeimages/getImages`, {
            params: { salon_id: salonId.toString() }
        }).pipe(catchError(this.handleError));
    }
    getServices() {
        return this.http.get(`${this.baseUrl}/edithome/getServices`);
    }
    getSubservicesByService(id_service) {
        return this.http.get(`${this.baseUrl}/edithome/getSubservicesByService`, {
            params: { id_service: id_service.toString() }
        });
    }
    deleteImage(imageId) {
        return this.http.delete(`${this.baseUrl}/edithomeimages/deleteImage/${imageId}`);
    }
    updatePrincipalImage(fileId, filePrincipal) {
        const body = {
            file_id: fileId,
            file_principal: filePrincipal
        };
        return this.http.put(`${this.baseUrl}/edithomeimages/updatePrincipalImage`, body);
    }
    addService(id_salon, id_service, id_service_type, time) {
        const body = {
            id_salon: id_salon,
            id_service: id_service,
            id_service_type: id_service_type,
            time: time
        };
        return this.http.post(`${this.baseUrl}/edithome/addService`, body);
    }
    addCategorySalon(id_salon, category) {
        const body = {
            id_salon: id_salon,
            category: category
        };
        return this.http.post(`${this.baseUrl}/edithome/addCategorySalon`, body);
    }
    getServicesWithSubservices(salonId, page = 1, pageSize = 10) {
        const url = `${this.baseUrl}/edithome/getServicesWithSubservices?id_salon=${salonId}&page=${page}&pageSize=${pageSize}`;
        return this.http.get(url);
    }
    deleteServiceWithSubservice(id_salon_service_type) {
        const url = `${this.baseUrl}/edithome/deleteServiceWithSubservices/${id_salon_service_type}`;
        return this.http.delete(url);
    }
    getFaqByIdSalon(id_salon, page = 1, pageSize = 10) {
        const url = `${this.baseUrl}/edithome/getFaqByIdSalon?id_salon=${id_salon}&page=${page}&pageSize=${pageSize}`;
        return this.http.get(url).pipe(catchError(this.handleError));
    }
    updateFaq(id_faq, answer) {
        return this.http.put(`${this.baseUrl}/edithome/updateQuestion`, { id_faq, answer });
    }
    deleteFaq(id_faq) {
        return this.http.post(`${this.baseUrl}/edithome/deleteQuestion`, { id_faq });
    }
    updateServiceWithSubservice(updateData) {
        return this.http.put(`${this.baseUrl}/edithome/updateServiceWithSubservice`, updateData);
    }
    updateCategorySalon(updateData) {
        return this.http.put(`${this.baseUrl}/edithome/updateCategorySalon`, updateData);
    }
    deleteCategorySalon(id_category) {
        return this.http.delete(`${this.baseUrl}/edithome/deleteCategotySalon/${id_category}`);
    }
    loadReview(id_salon) {
        return this.http.get(`${this.baseUrl}/edithome/loadReview`, {
            params: {
                id_salon: id_salon.toString(),
            },
        });
    }
    updateReview(review) {
        return this.http.put(`${this.baseUrl}/edithome/updateReview`, review);
    }
    deleteReview(id_review) {
        return this.http.delete(`${this.baseUrl}/edithome/deleteReview`, {
            params: { id_review: id_review },
        });
    }
    getBrands() {
        return this.http.get(`${this.baseUrl}/edithome/getAllBrands`);
    }
    getCategories() {
        return this.http.get(`${this.baseUrl}/edithome/getAllCategoriesSalon`);
    }
};
EditHomeService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], EditHomeService);
export { EditHomeService };
//# sourceMappingURL=edit-home.service.js.map