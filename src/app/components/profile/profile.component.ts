import { Component} from '@angular/core';
import { ProfileService } from '../../core/service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userData: any = {
  };
  id_user: string = '';
  errorMessage: string = '';
  cities: any[] = [];
  provinces: any[] = [];


  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('usuarioId');
    if (userId) {
      this.id_user = userId;
      this.getDataUser();
      this.loadProvinces();
    }
  }

  getDataUser(): void {
    this.profileService.getDataUser(this.id_user).subscribe(
      (data) => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          this.userData = data.data[0];
          if (this.userData.id_city) {
            this.loadCities(this.userData.id_city, true); // Cargar ciudades si ya hay una ciudad seleccionada
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
      },
      (error) => {
        console.error('Error fetching provinces:', error);
      }
    );
  }

  loadCities(provinceId: number, initialLoad: boolean = false): void {
    if (!initialLoad) {
      this.userData.id_city = '';
      this.userData.city_name = '';
    }

    this.profileService.getCitiesByProvince(provinceId).subscribe(
      (response: any) => {
        console.log('API Response for Cities:', response);  // Verificar la respuesta de la API en la consola
        if (response && response.data && response.data.length > 0) {
          this.cities = response.data;
          console.log('Cities array:', this.cities);  // Verifica que las ciudades se están cargando correctamente
        } else {
          console.warn('No cities data found for the selected province.');
        }

        if (initialLoad && this.userData.id_city) {
          const selectedCity = this.cities.find(
            (city) => city.id_city === this.userData.id_city
          );
          if (selectedCity) {
            this.userData.city_name = selectedCity.city_name;
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
    console.log('Province selected:', provinceId);
    if (provinceId) {
      this.loadCities(provinceId);
    }
  }

  onCityChange(cityId: number): void {
    const selectedCity = this.cities.find((city) => city.id_city === cityId);
    if (selectedCity) {
      this.userData.city_name = selectedCity.city_name;
      this.userData.id_city = selectedCity.id_city;
    }
  }
}
