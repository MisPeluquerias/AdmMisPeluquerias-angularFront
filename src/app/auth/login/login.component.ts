import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  baseUrl: string = environment.baseUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post(`${this.baseUrl}/login`, this.loginForm.value).subscribe({
        next: (response: any) => {
          if (response.token) {
            localStorage.setItem('Token', response.token);
            localStorage.setItem('usuarioId', response.usuarioId);
            localStorage.setItem('permiso', response.permiso);
            this.errorMessage = ''; // Limpiar mensaje de error en caso de éxito
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
}
