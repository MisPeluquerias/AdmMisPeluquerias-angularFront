import { Component } from '@angular/core';
import { EditClientService } from '../../../core/service/edit-client.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent {

  userData: any = {};
  provinces: any = [];
  cities: any[] = [];
  clientData: any = [];
  id_user: any;
  formValid:boolean=false;
 

  constructor(
    private editClientService: EditClientService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id_user = this.route.snapshot.paramMap.get('id');

    if (id_user) {
      this.getClientData(+id_user); // Convierte id_user a número antes de pasar
    } else {
      console.error('No id_user found in the URL');
    }
    this.getProvinces();
  }

  updateClient(): void {
    this.formValid = true;
    
    // Verifica si todos los campos requeridos están llenos
    if (!this.clientData.name || !this.clientData.lastname || !this.clientData.phone || !this.clientData.email || !this.clientData.address || !this.clientData.id_province || !this.clientData.id_city || !this.clientData.dni) {
      this.toastr.error('Por favor, complete todos los campos obligatorios.');
      return;
    }
  
    this.editClientService.updateClient(this.clientData).subscribe(
      (response) => {
        console.log('Cliente actualizado exitosamente', response);
        this.toastr.success('Cambios realizados con éxito');
      },
      (error) => {
        console.error('Error al actualizar el cliente', error);
  
        // Maneja el caso de errores por duplicado (correo o DNI)
        if (error.status === 409 && error.error) {
          if (error.error.message === 'El correo electrónico ya está registrado.') {
            this.toastr.error('El correo electrónico ya está registrado.');
          } else if (error.error.message === 'El DNI ya está registrado.') {
            this.toastr.error('El DNI ya está registrado.');
          } else {
            this.toastr.error('No se realizaron los cambios.');
          }
        } else {
          this.toastr.error('No se realizaron los cambios.');
        }
      }
    );
  }

  

  getClientData(id_user: number): void {
    this.editClientService.getClientById(id_user).subscribe(
      (response: any) => {
        this.clientData = response.data;
        console.log(this.clientData); // Asegúrate de que response.data contiene los datos correctos

        if (this.clientData.id_province) {
          this.getCities(this.clientData.id_province, true); // Asegúrate de que se cargan las ciudades primero
        }
      },
      (error) => {
        console.error('Error fetching client data:', error);
      }
    );
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

    this.editClientService.uploadProfilePicture(this.userData.id_user, formData).subscribe(
      (response) => {
        this.toastr.success('Foto de perfil actualizada exitosamente.');
        this.userData.profilePicture = response.imageUrl;
        window.location.reload(); // Asegúrate de que la respuesta contiene la URL de la imagen
      },
      (error) => {
        console.error('Error al subir la foto de perfil', error);
        this.toastr.error('Error al subir la foto de perfil.');
      }
    );
  }

  getProvinces(): void {
    this.editClientService.getProvinces().subscribe(
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
    this.editClientService.getCitiesByProvince(provinceId).subscribe(
      (response: any) => {
        this.cities = response.data;

        if (this.cities.length > 0) {
          if (initialLoad && this.clientData.id_city) {
            const selectedCity = this.cities.find(city => city.id_city === this.clientData.id_city);
            if (selectedCity) {
              this.clientData.id_city = selectedCity.id_city;  // Asegura que el id_city se mantiene
            }
          } else if (!this.clientData.id_city) {
            this.clientData.id_city = this.cities[0].id_city;  // Selecciona la primera ciudad si no hay una preseleccionada
          }
        } else {
          this.clientData.id_city = '';  // Resetea si no hay ciudades
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
      this.clientData.id_city = selectedCity.id_city;
    }
  }
}
