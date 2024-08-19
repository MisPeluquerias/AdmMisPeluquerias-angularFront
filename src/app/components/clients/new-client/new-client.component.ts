import { NewClientService } from './../../../core/service/new-client.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent {

  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  userData: any = {};
  cities: any[] = [];
  provinces: any[] = [];
  errors: any = {};

  constructor(private toastr: ToastrService, private newClientService: NewClientService) {}

  ngOnInit(): void {
    this.getProvinces();
  }



  addNewClient(): void {
    // Resetear mensajes de error
    this.errors = {};

    let hasError = false;

    if (!this.userData.name) {
      this.errors['name'] = 'El nombre es obligatorio';
      hasError = true;
    }

    if (!this.userData.lastname) {
      this.errors['lastname'] = 'Los apellidos son obligatorios';
      hasError = true;
    }

    if (!this.userData.email || !this.validateEmail(this.userData.email)) {
      this.errors['email'] = 'El correo electrónico no es válido';
      hasError = true;
    }

    if (!this.userData.phone || !this.validatePhone(this.userData.phone)) {
      this.errors['phone'] = 'El número de teléfono no es válido';
      hasError = true;
    }

    if (!this.userData.address) {
      this.errors['address'] = 'La dirección es obligatoria';
      hasError = true;
    }

    if (!this.userData.id_province) {
      this.errors['id_province'] = 'Debe seleccionar una provincia';
      hasError = true;
    }

    if (!this.userData.id_city) {
      this.errors['id_city'] = 'Debe seleccionar una población';
      hasError = true;
    }

    if (!this.userData.dni || !this.validateDNI(this.userData.dni)) {
      this.errors['dni'] = 'El NIF no es válido';
      hasError = true;
    }

    if (this.password !== this.confirmPassword) {
      this.errors['confirmPassword'] = 'Las contraseñas no coinciden';
      hasError = true;
    }

    if (!this.password || this.password.length < 6) {
      this.errors['password'] = 'La contraseña debe tener al menos 6 caracteres';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Si no hay errores, proceder con el guardado del cliente
    console.log(this.userData.id_user);
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  validatePhone(phone: string): boolean {
    const phonePattern = /^[0-9]{9}$/; // Ajustar el patrón según el formato de teléfono deseado
    return phonePattern.test(phone);
  }

  validateDNI(dni: string): boolean {
    const dniPattern = /^[0-9]{8}[A-Z]$/; // Patrón básico para NIF
    return dniPattern.test(dni);
  }

  getProvinces(): void {
    this.newClientService.getProvinces().subscribe(
      (response: any) => {
        this.provinces = response.data;
        if (this.provinces.length > 0) {
          this.userData.id_province = this.provinces[0].id_province;
          this.getCities(this.userData.id_province, true); // Cargar ciudades al inicio
        }
      },
      (error) => {
        console.error('Error fetching provinces:', error);
      }
    );
  }

  getCities(provinceId: number, initialLoad: boolean = false): void {
    this.newClientService.getCitiesByProvince(provinceId).subscribe(
      (response: any) => {
        this.cities = response.data;
        if (this.cities.length > 0) {
          if (initialLoad && this.userData.id_city) {
            const selectedCity = this.cities.find(city => city.id_city === this.userData.id_city);
            if (selectedCity) {
              this.userData.city_name = selectedCity.city_name;
            }
          } else {
            this.userData.id_city = this.cities[0].id_city;
            this.userData.city_name = this.cities[0].city_name;
          }
        } else {
          // Reinicia el valor de la ciudad si no se encuentran ciudades para la provincia seleccionada
          this.userData.id_city = '';
          this.cities = [];
        }
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  onProvinceChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const provinceId = Number(target.value);
    if (provinceId) {
      this.getCities(provinceId);
      this.userData.id_city = ''; // Reinicia la ciudad seleccionada si se cambia la provincia
    } else {
      this.cities = [];
    }
  }

  onCityChange(cityId: number): void {
    const selectedCity = this.cities.find((city) => city.id_city === cityId);
    if (selectedCity) {
      this.userData.city_name = selectedCity.city_name;
      this.userData.id_city = selectedCity.id_city;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const maxSize = 800 * 1024;
      if (file.size > maxSize) {
        this.toastr.error('El archivo excede el tamaño máximo permitido de 800 KB.');
        return;
      }

      const validFormats = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validFormats.includes(file.type)) {
        this.toastr.error('Formato de archivo no válido. Solo se permiten JPG, GIF o PNG.');
        return;
      }

      this.uploadProfilePicture(file);
    }
  }

  uploadProfilePicture(file: File): void {
    const formData = new FormData();
    formData.append('profilePicture', file);

    this.newClientService.uploadProfilePicture(this.userData.id_user, formData).subscribe(
      response => {
        this.toastr.success('Foto de perfil actualizada exitosamente.');
        this.userData.profilePicture = response.imageUrl;
        window.location.reload(); // Asegúrate de que la respuesta contiene la URL de la imagen
      },
      error => {
        console.error('Error al subir la foto de perfil', error);
        this.toastr.error('Error al subir la foto de perfil.');
      }
    );
  }
}
