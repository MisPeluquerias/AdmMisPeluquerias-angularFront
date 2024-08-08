import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditHomeService } from '../../../core/service/edit-home.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    id_province: '',
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
    city_details: ''
  };


  constructor(private route: ActivatedRoute, private editHomeService: EditHomeService,private toastr:ToastrService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.salonId = id ? +id : 0; // Convierte el ID a número, asegurándote de que es un valor válido
      this.loadProvinces();
      this.loadImages();
    });
  }

  openImage(url: string, alt: string): void {
    this.currentImageUrl = url;
    this.currentImageAlt = alt;
    this.isImageOpen = true;
  }

  closeImage(): void {
    this.isImageOpen = false;
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
        this.processHours(this.salonData.hours_old);

        if (this.salonData.id_province) {
          this.onProvinceChange(this.salonData.id_province, true);
          //console.log(this.salonData);
        }
      },
      (error) => {
        console.error('Error fetching salon data:', error);
          // Asegúrate de manejar también la carga en caso de error
      }
    );
  }
  updateSalon(): void {
     // Activa la carga antes de la solicitud
    this.editHomeService.updateSalon(this.salonData).subscribe(
      (response) => {
        console.log('Salon updated successfully', response);
        this.toastr.success(
          '<i class="las la-info-circle"> Cambios realizados con éxito</i>'
        );
        console.log(this.salonData);

        // Desactiva la carga una vez que los datos están cargados
        // Puedes agregar aquí cualquier lógica adicional, como redireccionar al usuario o mostrar un mensaje de éxito
      },
      error => {
        console.error('Error updating salon', error); // Asegúrate de manejar también la carga en caso de error
        this.toastr.success(
          '<i class="las la-info-circle"> No se realizaron los cambios</i>'
        );
      }
    );
  }
}
