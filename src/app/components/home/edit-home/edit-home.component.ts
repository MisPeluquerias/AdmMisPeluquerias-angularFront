import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditHomeService } from '../../../core/service/edit-home.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.scss'],
})
export class EditHomeComponent implements OnInit {
  salonId: number = 0;
  salonData: any = {
    id_salon: '',
    id_city: '',
    id_province: '', // Añadir el campo para el ID de la provincia
    plus_code: '',
    active: '',
    state: '',
    in_vacation: '',
    name: '',
    address: '',
    latitud: '',
    longitud: '',
    email: '',
    url: '',
    phone: '',
    map: '',
    iframe: '',
    image: '',
    about_us: '',
    score_old: '',
    hours_old: '',
    zip_code_old: '',
    overview_old: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    categories: '',
    city_name: '',
    city_zip_code: '',
  };

  schedule: any = {};

  provinces: any[] = [];
  cities: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private editHomeService: EditHomeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.salonId = id ? +id : 0; // Convierte el ID a número, asegurándote de que es un valor válido
      this.loadProvinces();
    });
  }

  loadProvinces(): void {
    this.editHomeService.getProvinces().subscribe(
      (response: any) => {
        this.provinces = response.data;
        if (this.salonId) {
          this.getSalonData(this.salonId);
        }
      },
      (error) => {
        console.error('Error fetching provinces:', error);
      }
    );
  }

  getSalonData(id_salon: number): void {
    this.editHomeService.getSalonById(id_salon).subscribe(
      (response: any) => {
        this.salonData = response.data; // Asegúrate de que response.data contiene los datos correctos
        this.processSchedule(); // Procesar los horarios
        if (this.salonData.id_province) {
          this.onProvinceChange(this.salonData.id_province, true);
        }
      },
      (error) => {
        console.error('Error fetching salon data:', error);
      }
    );
  }

  processSchedule(): void {
    if (this.salonData.hours_old) {
        const rawHours = this.salonData.hours_old.split('; ');

        rawHours.forEach((entry: string) => {
            const [day, hours] = entry.split(', ');
            this.schedule[day.toLowerCase()] = hours !== 'Cerrado' ? this.splitHours(hours) : { manana: 'Cerrado', tarde: 'Cerrado' };
        });
    }
}

  splitHours(hours: string): any {
    const [morning, afternoon] = hours.includes(';') ? hours.split('; ') : [hours, ''];
    return {
      manana: morning || '',
      tarde: afternoon || ''
    };
}

  updateSalon(): void {
    if (!this.salonData.id_city) {
      this.toastr.warning("Por favor, seleccione una ciudad para actualizar los datos");
      return;
    }

    this.editHomeService.updateSalon(this.salonData).subscribe(
      (response) => {
        console.log('Salon updated successfully', response);
        this.toastr.success(
          '<i class="las la-info-circle"> Cambios realizados con éxito</i>'
        );
        console.log(this.salonData);
      },
      (error) => {
        console.error('Error updating salon', error);
        this.toastr.error(
          '<i class="las la-info-circle"> No se realizaron los cambios</i>'
        );
      }
    );
  }

  onProvinceChange(provinceId: number, initialLoad: boolean = false): void {
    if (!initialLoad) {
      this.salonData.id_city = '';
      this.salonData.city_name = '';
    }

    this.editHomeService.getCitiesByProvince(provinceId).subscribe(
      (response: any) => {
        this.cities = response.data;
        if (initialLoad && this.salonData.id_city) {
          const selectedCity = this.cities.find(
            (city) => city.id_city === this.salonData.id_city
          );
          if (selectedCity) {
            this.salonData.city_name = selectedCity.city_name;
          }
        }
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  onCityChange(cityId: number): void {
    const selectedCity = this.cities.find((city) => city.id_city === cityId);
    if (selectedCity) {
      this.salonData.city_name = selectedCity.city_name;
      this.salonData.id_city = selectedCity.id_city;
    }
  }
}
