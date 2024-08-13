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
  getSalonServices:any[]=[]
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  selectedFile: File | null = null;
  images: any[] = [];
  fileDescription = '';
  fileGroup = '';
  filePrincipal = false;
  fileActive = true;
  currentImageUrl: string = '';
  currentImageAlt: string = '';
  isImageOpen =false;
  services: any[]=[];
  newServiceName: string = '';
  newSubservices: string = '';
  newServiceTime:number=0;
  selectedService: any = {};
  totalPages: number = 1;
  getSalonDataSelect:any[]=[];
  faqByIdSalon:any[]=[];
  faqToEdit: any;
  editAnswerText: string = '';
  editQuestionText: string = ''
  reviews:any[]=[];
  reviewToEdit: any;
  editRating: string = '';
  editReviewText: string = '';
  averageRating: number = 0;


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
      this.getUniqueServices();
      this.getServicesWithSubservices();
      this.getFaqByIdSalon();
      this.getReviewsById();
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
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      this.editHomeService.deleteImage(imageId).subscribe(response => {
        //console.log('Image deleted successfully', response);
        this.loadImages(); // Recargar la lista de imágenes
      }, error => {
        console.error('Error deleting image', error);
      });
    }
  }

  uniqueCheckboxSelectImge(index: number): void {
    const selectedImage = this.images[index];
    if (selectedImage.file_principal) {
      // Si el checkbox se ha marcado, desmarcar todos los demás y actualizar el backend
      this.images.forEach((image, i) => {
        if (i !== index) {
          image.file_principal = false;
          this.updatePrincipalmage(image.file_id, false); // Desmarcar en el backend
        }

      });
    }

    // Actualizar el estado de la imagen seleccionada en el backend
    this.updatePrincipalmage(selectedImage.file_id, selectedImage.file_principal);
  }

  updatePrincipalmage(fileId: number, filePrincipal: boolean): void {
    this.editHomeService.updatePrincipalImage(fileId, filePrincipal).subscribe({
      next: (response) => {
       // console.log('Image status updated successfully', response);
        // Aquí puedes manejar el éxito, por ejemplo, mostrar un mensaje al usuario
      },
      error: (error) => {
        console.error('Failed to update image status', error);
        // Aquí puedes manejar el error, por ejem[(ngModel)]="salonData.state"plo, mostrar un mensaje de error
      }
    });
  }

  getUniqueServices(){
    this.editHomeService.getServices().subscribe(
      (response) => {
        if (response.success) {
          this.getSalonDataSelect = response.data;
          console.log('Servicios cargados',this.getSalonServices); // Usa este valor para gestionar la paginación en el frontend
        } else {
          console.error('Error fetching services', response);

        }
      },
      (error) => {
        console.error('Error fetching services ', error);
      }
    );
  }

  addService(): void {

    const subservicesArray = this.newSubservices.split(';').map(subservice => subservice.trim());

    this.editHomeService.addService(this.salonId, this.newServiceName, subservicesArray, this.newServiceTime).subscribe(
      (response) => {
        if (response.success) {
          this.toastr.success('Servicio agregado con éxito');
          this.getServicesWithSubservices(); // Recargar la lista de servicios
        } else {
          this.toastr.error('Error al agregar el servicio');
        }
      },
      (error) => {
        console.error('Error adding service:', error);
        this.toastr.error('Error al agregar el servicio');
      }
    );
  }

  getServicesWithSubservices() {
    this.editHomeService.getServicesWithSubservices(this.salonId).subscribe(
      (response) => {
        if (response.data && response.data.length > 0) {
          this.getSalonServices = response.data;
          console.log(this.getSalonServices); // Asegúrate de que los datos se asignen correctamente
        } else {
          console.error('No data found or response format incorrect', response);
        }
      },
      (error) => {
        console.error('Error fetching services with subservices', error);
      }
    );
  }

  openEditModal(service: any): void {
    this.selectedService = { ...service }; // Clona el objeto del servicio seleccionado
    this.newServiceName = this.selectedService.service_name;
    this.newServiceTime = this.selectedService.time;
    this.newSubservices = this.selectedService.subservices;
  }

  updateServiceWithSubservice(): void {
    const subservicesArray = this.newSubservices.split(';').map(subservice => subservice.trim());

    this.editHomeService.updateServiceWithSubservice(
      this.selectedService.id_service,
      this.salonId,
      this.newServiceName,
      subservicesArray,
      this.newServiceTime
    ).subscribe(
      (response) => {
        if (response.success) {
          this.toastr.success('Servicio actualizado con éxito');
          this.getServicesWithSubservices(); // Recargar la lista de servicios
          this.modalService.dismissAll(); // Cerrar el modal
        } else {
          this.toastr.error('Error al actualizar el servicio');
        }
      },
      (error) => {
        console.error('Error updating service:', error);
        this.toastr.error('Error al actualizar el servicio');
      }
    );
  }
  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getServicesWithSubservices();
    }
  }

  getPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }


  deleteServiceWithSubservice(serviceId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      this.editHomeService.deleteServiceWithSubservice(serviceId).subscribe(
        (response) => {
          if (response.success) {
            this.toastr.success('Servicio eliminado con éxito');
            this.getServicesWithSubservices(); // Refresca la lista de servicios
          } else {
            this.toastr.error('Error al eliminar el servicio');
          }
        },
        (error) => {
          console.error('Error deleting service:', error);
          this.toastr.error('Error al eliminar el servicio');
        }
      );
    }
  }

  updateQuestion(): void {
    const updatedQuestion = {
      id_faq: this.faqToEdit.id_faq,
      answer: this.editAnswerText
    };

    this.editHomeService.updateFaq(updatedQuestion.id_faq, updatedQuestion.answer).subscribe(
      response => {
        this.toastr.success('Pregunta respondida con éxito');
        this.getFaqByIdSalon();
      },
      error => console.error('Error actualizando la pregunta', error)
    );
  }


  getFaqByIdSalon() {
    this.editHomeService.getFaqByIdSalon(this.salonId, this.currentPage, this.pageSize).subscribe(
      (response) => {
        if (response.success) {
          this.faqByIdSalon = response.data;
          this.totalItems = response.total;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          console.log('FAQs loaded successfully', this.faqByIdSalon);
        } else {
          console.error('Error fetching FAQs', response);
        }
      },
      (error) => {
        console.error('Error fetching FAQs', error);
      }
    );
  }

  editQuestion(faq: any): void {
    this.faqToEdit = faq;
    this.editQuestionText = faq.question;
    this.editAnswerText = faq.answer;
  }

  deleteQuestion(id_faq: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
    if (this.salonId) {
      this.editHomeService.deleteFaq(id_faq).subscribe(
        response => {
          this.toastr.success('Pregunta eliminada con éxito');
          this.getFaqByIdSalon();
        },
        error => console.error('Error eliminando la pregunta', error)
      );
    } else {
      console.error('No se encontró el ID del salón.');
    }
  }
  }

  getReviewsById(){
    this.editHomeService.loadReview(this.salonId).subscribe(
      reviews => {
        this.reviews = reviews;
        this.calculateAverageRating();
        console.log('Reseñas cargadas:', reviews);
      },
      error => console.error('Error loading reviews', error)

    );
    console.log('id_salon reviews: ',this.salonId);
  }

  updateReview(): void {
    const updatedReview = {
      ...this.reviewToEdit,
      observacion: this.editReviewText,
      qualification: this.editRating
    };

    this.editHomeService.updateReview(updatedReview).subscribe(
      response => {
        this.toastr.success('Reseña acutalizada con éxito')
        console.log('Reseña actualizada:', response);
        this.getReviewsById();
      },
      error => console.error('Error actualizando la reseña', error)
    );

  }
  editReview(review: any): void {
    this.reviewToEdit = review;
    this.editReviewText = review.observacion;
    this.editRating = review.qualification;
  }

  deleteReview(reviewId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
    if (this.salonId) {
      this.editHomeService.deleteReview(reviewId).subscribe(
        response => {
          console.log('Reseña eliminada:', response);
          this.getReviewsById();
        },
        error => console.error('Error eliminando la reseña', error)
      );
    } else {
      console.error('No se encontró el ID del salón.');
    }
  }
  }
  getFilledStars(qualification: number): number[] {
    return Array(qualification).fill(0).map((x, i) => i + 1);
  }

  getEmptyStars(qualification: number): number[] {
    const totalStars = 5;
    return Array(totalStars - qualification).fill(0).map((x, i) => i + 1);
  }
  calculateAverageRating(): void {
    if (this.reviews.length > 0) {
      const total = this.reviews.reduce((sum, review) => sum + review.qualification, 0);
      this.averageRating = total / this.reviews.length;
    } else {
      this.averageRating = 0;  // Si no hay reseñas, la media es 0
    }
  }

  generateStarRatingArray(rating: number): number[] {
    const totalStars = 5;
    const fullStars = Math.floor(rating);  // Número de estrellas completas
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;  // Determina si hay media estrella
    const emptyStars = totalStars - fullStars - halfStar;  // Estrellas vacías

    // Genera un array que representa las estrellas: llenas, medias y vacías
    return [
      ...Array(fullStars).fill(1),  // Estrellas completas
      ...Array(halfStar).fill(0.5),  // Media estrella, si corresponde
      ...Array(emptyStars).fill(0),  // Estrellas vacías
    ];
  }
}
