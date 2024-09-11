import { Component } from '@angular/core';
import { EditOwnerService } from '../../../core/service/edit-owner.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Modal } from 'bootstrap';



@Component({
  selector: 'app-edit-owner',
  templateUrl: './edit-owner.component.html',
  styleUrl: './edit-owner.component.scss'
})
export class EditOwnerComponent {

  ownerData:any = [];
  provinces: any = [];
  salons:any[]=[];
  cities: any[] = [];
  id_user: any;
  userData: any = [];
  ownerSalon:any =[];
  salonToDelete: number | null = null;
  

  constructor(private editOwnerService:EditOwnerService,
    private toastr : ToastrService,
    private route : ActivatedRoute
  )
  {}

  ngOnInit(): void {
    const id_user = this.route.snapshot.paramMap.get('id');

    if (id_user) {
      this.getOwnerData(+id_user); // Convierte id_user a número antes de pasar
    } else {
      console.error('No id_user found in the URL');
    }
    this.getProvinces();
    this.getSalonOwnerById(id_user)
  }

  getOwnerData(id_user: number): void {
    this.editOwnerService.getOwnerById(id_user).subscribe(
      (response: any) => {
        this.ownerData = response.data;
        console.log(this.ownerData); // Asegúrate de que response.data contiene los datos correctos

        if (this.ownerData.id_province) {
          this.getCities(this.ownerData.id_province, true); // Asegúrate de que se cargan las ciudades primero
        }
      },
      (error) => {
        console.error('Error fetching client data:', error);
      }
    );
  }


  updateOwner(): void {
    this.editOwnerService.updateOwner(this.ownerData).subscribe(
      (response) => {
        console.log('Propietario actualizado exitosamente', response);
        this.toastr.success('Cambios realizados con éxito');
      },
      (error) => {
        console.error('Error al actualizar el propietario', error);
        this.toastr.error('No se realizaron los cambios');
      }
    );
  }

  getProvinces(): void {
    this.editOwnerService.getProvinces().subscribe(
      (response: any) => {
        this.provinces = response.data;
      },
      (error) => {
        console.error('Error fetching provinces:', error);
      }
    );
  }


  onProvinceChange(eventOrProvinceId: Event | number): void {
    let provinceId: number;

    if (typeof eventOrProvinceId === 'number') {
      provinceId = eventOrProvinceId;
    } else if (eventOrProvinceId && eventOrProvinceId.target) {
      const target = eventOrProvinceId.target as HTMLSelectElement;
      provinceId = Number(target.value);
    } else {
      console.error('Event o target es undefined en onProvinceChange');
      return;
    }

    if (!isNaN(provinceId) && provinceId > 0) {
      this.getCities(provinceId); // No reinicies el id_city aquí
    } else {
      this.cities = [];
    }
  }

  getCities(provinceId: number, initialLoad: boolean = false): void {
    this.editOwnerService.getCitiesByProvince(provinceId).subscribe(
      (response: any) => {
        this.cities = response.data;

        if (this.cities.length > 0) {
          if (initialLoad && this.ownerData.id_city) {
            const selectedCity = this.cities.find(city => city.id_city === this.ownerData.id_city);
            if (selectedCity) {
              this.ownerData.id_city = selectedCity.id_city;  // Asegura que el id_city se mantiene
            }
          } else if (!this.ownerData.id_city) {
            this.ownerData.id_city = this.cities[0].id_city;  // Selecciona la primera ciudad si no hay una preseleccionada
          }
        } else {
          this.ownerData.id_city = '';  // Resetea si no hay ciudades
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
      this.userData.city_name = selectedCity.city_name;
      this.ownerData.id_city = selectedCity.id_city;
    }
  }
  getSalonOwnerById(id_user: any): void { // Cambié el tipo de id_user a number
    this.editOwnerService.getSalonOwnerById(id_user).subscribe(
      (response: any) => {
        // Si response.data no es un array, conviértelo a array
        this.salons = Array.isArray(response.data) ? response.data : [response.data];
        console.log('Salones asignados', this.salons);
      },
      (error) => {
        console.error('Error fetching salons:', error);
      }
    );
  }

  deleteSalon(id_salon: number): void {
    this.salonToDelete = id_salon;

    const deleteModalElement = document.getElementById('deleteSalonModal');
    if (deleteModalElement) {
      const deleteModal = new Modal(deleteModalElement);
      deleteModal.show();

      const confirmButton = document.querySelector('#deleteSalonModal .btn-danger') as HTMLElement;
      confirmButton.onclick = () => {
        if (this.salonToDelete !== null) {
          this.editOwnerService.deleteSalonById(this.salonToDelete).subscribe(
            () => {
              this.toastr.success('Salón eliminado con éxito');
              this.salons = this.salons.filter(salon => salon.id_salon !== this.salonToDelete);
              this.salonToDelete = null;
              deleteModal.hide();
            },
            (error) => {
              console.error('Error al eliminar el salón', error);
              this.toastr.error('No se pudo eliminar el salón');
              this.salonToDelete = null;
            }
          );
        }
      };
    }
  }
}
