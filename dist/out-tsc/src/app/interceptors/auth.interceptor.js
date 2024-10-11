import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
let AuthInterceptor = class AuthInterceptor {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    intercept(req, next) {
        return next.handle(req).pipe(catchError((error) => {
            if (error.status === 401 && error.error.message === 'Token expired') {
                this.authService.logout();
            }
            return throwError(error);
        }));
    }
};
AuthInterceptor = __decorate([
    Injectable()
], AuthInterceptor);
export { AuthInterceptor };
//# sourceMappingURL=auth.interceptor.js.map