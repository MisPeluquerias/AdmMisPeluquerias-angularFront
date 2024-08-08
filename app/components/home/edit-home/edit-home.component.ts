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
    sortedHours: []
  };

  provinces: any[] = [];
  cities: any[] = [];
  dias: any[] = [];


  selectedFile: File | null = null;
  images: any[] = [];
  fileDescription = '';
  fileGroup = '';
  filePrincipal = false;
  fileActive = true;
  currentImageUrl: string = '';
  currentImageAlt: string = '';
  isImageOpen =false;


  constructor(
    private route: ActivatedRoute,
    private editHomeService: EditHomeService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  
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
      }
    );
  }

  processHours(hours_old: string): void {
    const days = hours_old.split(';').map(day => day.trim());
    this.dias = days.map(day => {
      const [nombre, manana, tarde] = day.split(',').map(part => part.trim());
      return {
        nombre,
        mananaInicio: manana && manana !== 'Cerrado' ? manana.split(' ')[1] : '',
        mananaFin: manana && manana !== 'Cerrado' ? manana.split(' ')[3] : '',
        cerradoManana: !manana || manana === 'Cerrado',
        tardeInicio: tarde && tarde !== 'Cerrado' ? tarde.split(' ')[1] : '',
        tardeFin: tarde && tarde !== 'Cerrado' ? tarde.split(' ')[3] : '',
        cerradoTarde: !tarde || tarde === 'Cerrado'
      };
    });
  }

  saveHours(): void {
    let hasError = false;

    // Validar y convertir this.dias a un formato adecuado para hours_old
    const hours_old = this.dias.map(dia => {
      let manana = 'Cerrado';
      let tarde = 'Cerrado';

      // Validar y formatear las horas de la mañana
      if (!dia.cerradoManana) {
        if (dia.mananaInicio && dia.mananaFin) {
          manana = `De ${dia.mananaInicio} a ${dia.mananaFin}`;
        } else {
          this.toastr.error(`Las horas de la mañana para ${dia.nombre} no son válidas`);
          hasError = true;
        }
      }

      // Validar y formatear las horas de la tarde
      if (!dia.cerradoTarde) {
        if (dia.tardeInicio && dia.tardeFin) {
          tarde = `De ${dia.tardeInicio} a ${dia.tardeFin}`;
        } else {
          this.toastr.error(`Las horas de la tarde para ${dia.nombre} no son válidas`);
          hasError = true;
        }
      }

      return `${dia.nombre}, ${manana}, ${tarde}`;
    }).filter(item => item !== undefined).join('; ');

    // Si hay errores, no continuar con la actualización
    if (hasError) {
      return;
    }

    // Llamar al servicio para actualizar los horarios en el servidor
    this.editHomeService.updateSalonHours(this.salonId, hours_old).subscribe(
      response => {
        this.toastr.success('Horarios actualizados con éxito');
        this.modalService.dismissAll();
        console.log(hours_old);
      },
      error => {
        console.error('Error updating salon hours:', error);
        this.toastr.error('Error al actualizar los horarios');
      }
    );
  }


  updateSalon(): void {
    if (!this.salonData.id_city) {
      this.toastr.warning("Por favor, seleccione una ciudad para actualizar los datos");
      return;
    }
    console.log(this.salonData);

    this.editHomeService.updateSalon(this.salonData).subscribe(
      (response) => {
        console.log('Salon updated successfully', response);
        this.toastr.success(
          '<i class="las la-info-circle"> Cambios realizados con éxito</i>'
        );

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

  toggleManana(dia: any): void {
    if (dia.cerradoManana) {
      dia.mananaInicio = '';
      dia.mananaFin = '';
    }
  }

  toggleTarde(dia: any): void {
    if (dia.cerradoTarde) {
      dia.tardeInicio = '';
      dia.tardeFin = '';
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.toastr.error('<i class="las la-info-circle">Por favor, seleccione una imagen primero.</i>');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('file_name', this.selectedFile.name);
    formData.append('file_description', this.fileDescription);
    formData.append('file_group', this.fileGroup);
    formData.append('file_principal', this.filePrincipal ? '1' : '0');
    formData.append('file_active', this.fileActive ? '1' : '0');
    formData.append('salon_id', this.salonId.toString()); // Convertir a string

    this.editHomeService.uploadImage(formData).subscribe(
      response => {
        console.log('Image uploaded successfully', response);
        this.loadImages(); // Recargar las imágenes después de la subida
      },
      error => console.error('Error uploading image', error)
    );
  }


  loadImages(): void {
    this.editHomeService.getImages(this.salonId).subscribe(
      (response) => {
        if (response.success) {
          this.images = response.data;
        } else {
          console.error('Error fetching images', response);
        }
      },
      (error) => {
        console.error('Error fetching images', error);
      }
    );
  }

  deleteImage(imageId: number): void {

      this.editHomeService.deleteImage(imageId).subscribe(response => {
        console.log('Image deleted successfully', response);
        this.loadImages(); // Recargar la lista de imágenes
      }, error => {
        console.error('Error deleting image', error);
      });
  }
  imgPrefer(){

  }
}
