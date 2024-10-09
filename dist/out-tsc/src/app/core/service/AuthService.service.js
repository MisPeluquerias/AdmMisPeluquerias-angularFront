import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
let AuthService = class AuthService {
    constructor(router, http) {
        this.router = router;
        this.http = http;
        this.baseUrl = environment.baseUrl;
    }
    isAuthenticated() {
        if (this.isLocalStorageAvailable()) {
            const token = localStorage.getItem('Token');
            return !!token;
        }
        return false;
    }
    getUserType() {
        const permisoToken = localStorage.getItem('permiso');
        if (permisoToken) {
            return this.http.post(`${this.baseUrl}/decode-permiso`, { permiso: permisoToken })
                .pipe(map(response => response.permiso || 'client'));
        }
        else {
            return new Observable(observer => {
                observer.next('client');
                observer.complete();
            });
        }
    }
    isLocalStorageAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    logout() {
        localStorage.removeItem('Token');
        localStorage.removeItem('usuarioId');
        localStorage.removeItem('permiso');
        this.router.navigate(['/login']);
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
//# sourceMappingURL=AuthService.service.js.map