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
  name:string ="";
  lastname:string="";
  email:string="";
  phone:string=""
  address:string="";
  id_province:string="";
  id_city:string="";
  dni:string="";
  confirmPassword: string = '';
  errorMessage: string = '';
  userData: any = [];
  cities: any[] = [];
  provinces: any[] = [];
  errors: any = {};
  formValid: boolean = false;

  constructor(private toastr: ToastrService, private newClientService: NewClientService) {}

  ngOnInit(): void {
    this.getProvinces();
  }

  addNewClient(): void {
    this.formValid = true;
  
    // Verificar si todos los campos requeridos están llenos
    if (!this.name || !this.lastname || !this.email || !this.phone || !this.address || !this.id_province || !this.id_city || !this.dni || !this.password || !this.confirmPassword) {
    
      return;
    }
  
    console.log('Contraseña', this.address);
    this.newClientService.addNewClient(this.name, this.lastname, this.email, this.phone,this.address, this.id_province, this.id_city, this.dni, this.password).subscribe(
      response => {
        // Cliente creado con éxito
        this.toastr.success('<i class="las la-info-circle"></i> Cliente creado con éxito');
      },
      error => {
        console.error('Error al crear el cliente:', error);
  
        // Verificar si el error tiene un código 409 (conflicto, es decir, duplicado)
        if (error.status === 409 && error.error && error.error.error === 'User with this email already exists') {
          this.toastr.error('<i class="las la-exclamation-circle"></i> El correo electrónico ya está registrado.');
        } else if (error.status === 409 && error.error && error.error.error === 'User with this dni already exists') {
          this.toastr.error('<i class="las la-exclamation-circle"></i> El DNI ya está registrado.');
        } else {
          // Otro tipo de error
          this.toastr.error('<i class="las la-info-circle"></i> Error al crear cliente');
        }
      }
    );
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
