import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import * as CryptoJS from 'crypto-js';
let LoginComponent = class LoginComponent {
    constructor(fb, http, router) {
        this.fb = fb;
        this.http = http;
        this.router = router;
        this.errorMessage = '';
        this.encryptionKey = "b3d5b524b5064bf7714c59261101b842ad378f2ba94d98a739b9b01cf219515f";
        this.showPassword = false;
        this.baseUrl = environment.baseUrl;
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [false]
        });
    }
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
    ngOnInit() {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            const email = this.getDecryptedData(localStorage, 'email');
            const password = this.getDecryptedData(localStorage, 'password');
            if (email && password) {
                this.loginForm.patchValue({
                    email: email, // Se carga el valor desencriptado
                    password: password, // Se carga el valor desencriptado
                    rememberMe: true
                });
            }
        }
    }
    onSubmit() {
        if (this.loginForm.valid) {
            this.http.post(`${this.baseUrl}/login`, this.loginForm.value).subscribe({
                next: (response) => {
                    if (response.token) {
                        localStorage.setItem('Token', response.token);
                        localStorage.setItem('usuarioId', response.usuarioId);
                        localStorage.setItem('permiso', response.permiso);
                        // Solo almacenar email y password si "Recuérdame" está marcado
                        if (this.loginForm.get('rememberMe')?.value) {
                            this.saveEncryptedData(localStorage, 'email', this.loginForm.get('email')?.value);
                            this.saveEncryptedData(localStorage, 'password', this.loginForm.get('password')?.value);
                        }
                        else {
                            // Eliminar los valores almacenados si "Recuérdame" no está marcado
                            localStorage.removeItem('email');
                            localStorage.removeItem('password');
                        }
                        this.errorMessage = '';
                        this.router.navigate(['/home']);
                    }
                    else {
                        this.errorMessage = 'Faltan datos en la respuesta del servidor';
                    }
                },
                error: (error) => {
                    console.error('Error en login', error);
                    this.errorMessage = error.error.message || 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
                }
            });
        }
    }
    saveEncryptedData(storage, key, data) {
        const encryptedData = CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
        storage.setItem(key, encryptedData);
    }
    getDecryptedData(storage, key) {
        const encryptedData = storage.getItem(key);
        if (encryptedData) {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        return null;
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.scss']
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map