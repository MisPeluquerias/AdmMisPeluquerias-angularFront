import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  encryptionKey = "b3d5b524b5064bf7714c59261101b842ad378f2ba94d98a739b9b01cf219515f"

  baseUrl: string = environment.baseUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const email = this.getDecryptedData(localStorage, 'email');
      const password = this.getDecryptedData(localStorage, 'password');

      if (email && password) {
        this.loginForm.patchValue({
          email: email,         // Se carga el valor desencriptado
          password: password,   // Se carga el valor desencriptado
          rememberMe: true
        });
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post(`${this.baseUrl}/login`, this.loginForm.value).subscribe({
        next: (response: any) => {
          if (response.token) {
            localStorage.setItem('Token', response.token);
            localStorage.setItem('usuarioId', response.usuarioId);
            localStorage.setItem('permiso', response.permiso);

            // Solo almacenar email y password si "Recuérdame" está marcado
            if (this.loginForm.get('rememberMe')?.value) {
              this.saveEncryptedData(localStorage, 'email', this.loginForm.get('email')?.value);
              this.saveEncryptedData(localStorage, 'password', this.loginForm.get('password')?.value);

            } else {
              // Eliminar los valores almacenados si "Recuérdame" no está marcado
              localStorage.removeItem('email');
              localStorage.removeItem('password');
            }

            this.errorMessage = '';
            this.router.navigate(['/home']);
          } else {
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
  saveEncryptedData(storage: Storage, key: string, data: string): void {
    const encryptedData = CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
    storage.setItem(key, encryptedData);
  }

  getDecryptedData(storage: Storage, key: string): string | null {
    const encryptedData = storage.getItem(key);
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }
}
