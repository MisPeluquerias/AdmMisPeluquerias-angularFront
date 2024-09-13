import { Component } from '@angular/core';
import { EditCityService } from '../../../core/service/edit-city.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrl: './edit-city.component.scss'
})
export class EditCityComponent {

  cityData:any=[];
  cities: any[] = [];
  provinces:any =[];

constructor(private editCityService:EditCityService,
  private toastr : ToastrService,
  private route :ActivatedRoute
){}



ngOnInit(): void {
  const id_city = this.route.snapshot.paramMap.get('id');

  if (id_city) {
    this.getCityDataById(+id_city); // Convierte id_user a número antes de pasar
  } else {
    console.error('No id_user found in the URL');
  }
  this.getProvinces()
}



  updateCity(): void {
    this.editCityService.updateCity(this.cityData).subscribe(
      (response) => {
        console.log('Administrador actualizado exitosamente', response);
        this.toastr.success('Cambios realizados con éxito');
      },
      (error) => {
        console.error('Error al actualizar el Administrador', error);
        this.toastr.error('No se realizaron los cambios');
      }
    );
  }


  getCityDataById(id_city: number): void {
    this.editCityService.getCityById(id_city).subscribe(
      (response:any) => {
        this.cityData = response.data;
        console.log('Datos de la ciudad obtenidos con éxito', this.cityData);
      },
      (error) => {
        console.error('Error al obtener los datos de la ciudad', error);
        this.toastr.error('No se pudo obtener los datos de la ciudad');
      }
    );
  }

  getProvinces(): void {
    this.editCityService.getProvinces().subscribe(
      (response: any) => {
        this.provinces = response.data;
      },
      (error) => {
        console.error('Error fetching provinces:', error);
      }
    );
  }
}
