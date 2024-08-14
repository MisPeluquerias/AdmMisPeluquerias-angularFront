import { Component } from '@angular/core';
import { ProfileService } from '../../core/service/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userData: any = {};  // Contendrá los datos del usuario
  id_user: string = '';  // ID del usuario
  errorMessage: string = '';  // Mensaje de error
  cities: any[] = [];  // Lista de ciudades
  provinces: any[] = [];  // Lista de provincias

  constructor(private profileService: ProfileService,private toastr:ToastrService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('usuarioId');  // Obtener el ID del usuario desde el local storage
    if (userId) {
      this.id_user = userId;
      this.userData.id_city = '';  // Inicializar id_city a "" para mostrar "Seleccione una ciudad..."
      this.getDataUser();  // Cargar los datos del usuario
      this.loadProvinces();  // Cargar las provincias
    }
  }

  getDataUser(): void {
    this.profileService.getDataUser(this.id_user).subscribe(
      (data) => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          this.userData = data.data[0];
          if (!this.userData.id_city) {
            this.userData.id_city = '';  // Asegúrate de que id_city esté vacío si no hay una ciudad seleccionada
          }

          if (this.userData.id_province) {
            this.loadCities(this.userData.id_province, true);
          }
        }
      },
      (error) => {
        this.errorMessage = 'Error fetching user data';
        console.error('Error fetching user data:', error);
      }
    );
  }

  loadProvinces(): void {
    this.profileService.getProvinces().subscribe(
      (response: any) => {
        this.provinces = response.data;
        if (this.provinces.length > 0) {
          if (!this.userData.id_province) {
            this.userData.id_province = this.provinces[0].id_province;
            this.loadCities(this.userData.id_province); // Cargar ciudades de la primera provincia
          }
        }
      },
      (error) => {
        console.error('Error fetching provinces:', error);
      }
    );
  }

  loadCities(provinceId: number, initialLoad: boolean = false): void {
    this.profileService.getCitiesByProvince(provinceId).subscribe(
      (response: any) => {
        this.cities = response.data;
        if (this.cities.length > 0) {
          if (initialLoad && this.userData.id_city !== '') {
            const selectedCity = this.cities.find(city => city.id_city === this.userData.id_city);
            if (selectedCity) {
              this.userData.city_name = selectedCity.city_name;
            }
          } else {
            // Selecciona la primera ciudad automáticamente si no hay una ciudad seleccionada
            this.userData.id_city = this.cities[0].id_city;
            this.userData.city_name = this.cities[0].city_name;
          }
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
      this.loadCities(provinceId);
      this.userData.id_city = '';  // Resetear a "Seleccione una ciudad..." cuando cambia la provincia
    } else {
      this.cities = [];  // Vaciar las ciudades si no hay provincia seleccionada
    }
  }

  onCityChange(cityId: number): void {
    const selectedCity = this.cities.find((city) => city.id_city === cityId);
    if (selectedCity) {
      this.userData.city_name = selectedCity.city_name;
      this.userData.id_city = selectedCity.id_city;
    }
  }

  UpdateUserData(): void {
    console.log('Saving user data:', this.userData);  // Imprime los datos del usuario a guardar
    this.profileService.updateUserData(this.userData).subscribe(
      (response) => {
        this.toastr.success('<i class="las la-info-circle"> Datos actulizados con éxito</i>');
        console.log('User data saved successfully:', response);  // Muestra la respuesta exitosa
        // Aquí puedes redirigir o mostrar un mensaje de éxito al usuario
      },
      (error) => {
        console.error('Error saving user data:', error);  // Muestra el error si la solicitud falla
        this.errorMessage = 'Error saving user data';
        this.toastr.error('<i class="las la-info-circle"> No se pudieron actualizar los datos</i>');
      }
    );
  }
}
