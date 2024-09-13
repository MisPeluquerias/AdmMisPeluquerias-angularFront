import { Component } from '@angular/core';
import { EditOwnerService } from '../../../core/service/edit-owner.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Modal } from 'bootstrap';
import { Subject,of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';



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
  selectedSalon: string = '';
  editOwner: any = { email: '', salons: [] };
  dataSalonList: any[] = [];
  private searchTermsSalon = new Subject<string>();
  id_user_salon:any;
  id_salon:any;
  isSalonSelected: boolean = false;
  

  constructor(private editOwnerService:EditOwnerService,
    private toastr : ToastrService,
    private route : ActivatedRoute
  )
  {}


  ngOnInit(): void {
    const id_user_str = this.route.snapshot.paramMap.get('id');  // Obtén el ID como cadena de texto

    if (id_user_str) {
      this.id_user = +id_user_str;  // Convierte el ID a número y lo asigna a id_user
      this.getOwnerData(this.id_user); // Convierte id_user a número antes de pasar
      this.getSalonOwnerById(this.id_user);
    } else {
      console.error('No id_user found in the URL');
    }

    this.getProvinces();

    this.searchTermsSalon.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.length >= 2) {
          return this.editOwnerService.getSalonName(term);
        } else {
          return of([]);
        }
      })
    ).subscribe({
      next: (dataSalon) => {
        this.dataSalonList = dataSalon
          .filter((salon: any) => salon && salon.id_salon && salon.name)
          .map((salon: any) => ({
            id: salon.id_salon,
            name: salon.name
          }));
      },
      error: (error) => {
        console.error('Error al buscar salones:', error);
      },
    });
  }



  editSalon(salon: any): void {
    //console.log('Objeto salon:', salon); // Verifica que el objeto tiene las propiedades correctas
    this.selectedSalon = salon.name; 
    this.id_user_salon = salon.id_user_salon;
    this.id_salon = salon.id_salon;
}

  getOwnerData(id_user: number): void {
    this.editOwnerService.getOwnerById(id_user).subscribe(
      (response: any) => {
        this.ownerData = response.data;
        //console.log(this.ownerData); // Asegúrate de que response.data contiene los datos correctos

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
        //console.log('Propietario actualizado exitosamente', response);
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
        //console.log('Salones asignados', this.salons);
      },
      (error) => {
        console.error('Error fetching salons:', error);
      }
    );
  }

  deleteSalon(salon: any): void {
    //console.log('Objeto salon:', salon); // Verifica que el objeto tiene las propiedades correctas
    this.selectedSalon = salon.name; 
    this.id_user_salon = salon.id_user_salon;
    this.id_salon = salon.id_salon;
  }

  selectSalon(salon: { id: number, name: string }): void {
    this.selectedSalon = salon.name;
    this.id_salon = salon.id; 
    this.isSalonSelected = true; // Actualiza el id_salon con el nuevo salón seleccionado
    this.dataSalonList = [];   // Limpiar la lista después de la selección
  }



searchSalon(term: string): void {
  this.isSalonSelected = false;
  this.searchTermsSalon.next(term);
}

updateUserSalon(id_user_salon: number, id_salon: number): void {
  if (!this.isSalonSelected) {
    this.toastr.error('Por favor, selecciona un salón de la lista.');
    return;
  }

  //console.log('Datos que se envían al backend:', { id_user_salon, id_salon });
  this.editOwnerService.updateUserSalon(id_user_salon, id_salon).subscribe(
    (response: any) => {
      //console.log('Relación usuario-salón actualizada exitosamente', response);
      this.toastr.success('Salón actualizado con éxito');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      this.getSalonOwnerById(this.id_user); 
    },
    (error) => {
      console.error('Error al actualizar el salón del usuario', error);
      this.toastr.error('No se pudo actualizar el salón');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  );
}


deleteUserSalon(id_user_salon: number): void {
    this.editOwnerService.deleteUserSalon(id_user_salon).subscribe({
      next: (response: any) => {
        //console.log('Salón eliminado exitosamente', response);
        this.toastr.success('Salón eliminado con éxito');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.getSalonOwnerById(this.id_user);  // Actualiza la lista de salones después de la eliminación
      },
      error: (error) => {
        console.error('Error al eliminar el salón', error);
        this.toastr.error('No se pudo eliminar el salón');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
  }

  addUserSalon(): void {
    if (!this.isSalonSelected || !this.id_salon) {
      this.toastr.error('Por favor, selecciona un salón de la lista.');
      return;
    }

    if (this.id_user === undefined) {  // Verifica que id_user no es undefined
      this.toastr.error('ID de usuario no válido.');
      return;
    }

    const data = {
      id_user: this.id_user,
      id_salon: this.id_salon
    };

    console.log('Datos enviados:', data);

    this.editOwnerService.addUserSalon(data).subscribe(
      (response: any) => {
        this.toastr.success('Salón añadido con éxito');
        this.getSalonOwnerById(this.id_user);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        console.error('Error al añadir el salón', error);
        this.toastr.error('No se pudo añadir el salón');
      }
    );
  }
}
