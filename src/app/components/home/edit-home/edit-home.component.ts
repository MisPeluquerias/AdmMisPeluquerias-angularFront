import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditHomeService } from '../../../core/service/edit-home.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.scss'],
})
export class EditHomeComponent implements OnInit {
  getCategories:any[]=[];
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
  getSalonServices:any[]=[];
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
  selectedSubservice: any = {};
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
  getSalonSubservices:any[]=['Seleccione una opción'];
  selectedServiceId: number | null = null;
  selectedServiceName: string | null = null;
  idSalonServiceType: number | null = null;
  selectedCategory: any = {};
  oldCategory: string = '';
  idCategoryToDelete: any;
  idServiceToDelete: any;
  
  constructor(
    private route: ActivatedRoute,
    private editHomeService: EditHomeService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
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
      this.getCategoriesModal();
      this.selectedCategory='';
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
        this.salonData = response.data;
        console.log('Salon Data', this.salonData);
  
        // Asegura que las categorías se parseen correctamente como un array de objetos JSON
        if (this.salonData.categories) {
          try {
            // Parsear y filtrar categorías válidas
            this.salonData.categoriesArray = JSON.parse(`[${this.salonData.categories}]`).filter(
              (category: any) => category && category.id_category !== null && category.category !== null
            );
          } catch (error) {
            console.error('Error parsing categories:', error);
            this.salonData.categoriesArray = [];
          }
        } else {
          this.salonData.categoriesArray = []; // Asegura que sea un array vacío si no hay categorías
        }


        if (this.salonData.hours_old) {
          try {
            this.salonData.hours = JSON.parse(this.salonData.hours_old);
            console.log('Parsed hours:', this.salonData.hours);
        
            // Mapear los horarios a los días de la tabla
            this.days.forEach((day) => {
              const matchingHours = this.salonData.hours.find(
                (h: any) => h.day === day.name
              );
              day.hours = matchingHours ? matchingHours.hours : [];
            });
          } catch (error) {
            console.error('Error parsing hours:', error);
            this.salonData.hours = [];
          }
        }
      },
      (error) => {
        console.error('Error fetching salon data:', error);
      }
    );
  }


  days = [
    { name: 'Lunes', hours: [] as { open: string; close: string }[] },
    { name: 'Martes', hours: [] as { open: string; close: string }[] },
    { name: 'Miércoles', hours: [] as { open: string; close: string }[] },
    { name: 'Jueves', hours: [] as { open: string; close: string }[] },
    { name: 'Viernes', hours: [] as { open: string; close: string }[] },
    { name: 'Sábado', hours: [] as { open: string; close: string }[] },
    { name: 'Domingo', hours: [] as { open: string; close: string }[] }
  ];

  addHour(day: any) {
    if (day.hours.length < 2) {
      day.hours.push({ open: '', close: '' }); // Añade una nueva franja horaria vacía
    }
  }
  



  removeHour(day: any, index: number) {
    day.hours.splice(index, 1); // Elimina la franja horaria seleccionada
  }


  saveHours() {
    const hoursToSave = this.days.map(day => ({
      day: day.name,
      hours: day.hours.filter(hour => hour.open && hour.close) 
    }));
    const hours_old = JSON.stringify(hoursToSave);
    this.editHomeService.updateSalonHours(this.salonId, hours_old).subscribe(response => {
      this.toastr.success('Horarios guardados correctamente');
      
      console.log('Horas guardadas:', hours_old);
    }, error => {
      this.toastr.error('Error al guardar los horarios');
      console.error('Error al guardar los horarios:', error);
    });
  }


  updateSalon(): void {
    if (!this.salonData.id_city) {
      this.toastr.warning("Por favor, seleccione una ciudad para actualizar los datos");
      return;
    }
  
    if (!this.salonData.name) {
      this.toastr.warning("Por favor, ingrese el nombre del salón");
      return;
    }
  
    if (!this.salonData.email) {
      this.toastr.warning("Por favor, ingrese el correo electrónico del salón");
      return;
    }
  
    if (!this.salonData.address) {
      this.toastr.warning("Por favor, ingrese la dirección del salón");
      return;
    }
  
    if (!this.salonData.phone) {
      this.toastr.warning("Por favor, ingrese el número de teléfono del salón");
      return;
    }
  
    if (!this.salonData.id_province) {
      this.toastr.warning("Por favor, seleccione una provincia");
      return;
    }
  
    if (!this.salonData.latitud) {
      this.toastr.warning("Por favor, ingrese la latitud");
      return;
    }
  
    if (!this.salonData.longitud) {
      this.toastr.warning("Por favor, ingrese la longitud");
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


  onServiceSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedServiceId = +target.value; // Convierte el valor a número
    const selectedService = this.getSalonDataSelect.find(service => service.id_service === this.selectedServiceId);
  
    if (selectedService) {
      this.selectedServiceName = selectedService.name;
    }
    this.getSubservicesByService(this.selectedServiceId);
    console.log('ID del servicio seleccionado:', this.selectedServiceId);
    console.log('Nombre del servicio seleccionado:', this.selectedServiceName);
  }



  getSubservicesByService(id_service: number): void {
    this.editHomeService.getSubservicesByService(id_service).subscribe(
      (response) => {
        if (response.success) {
          this.getSalonSubservices = response.data;
          console.log('Subservicios cargados:', this.getSalonSubservices);
        } else {
          console.error('Error al cargar los subservicios', response);
        }
      },
      (error) => {
        console.error('Error al obtener subservicios', error);
      }
    );
  }


  addService(): void {
  // Verifica que selectedServiceName no esté vacío antes de proceder
  if (!this.selectedServiceName) {
    this.toastr.error('Por favor, selecciona un servicio válido.');
    return;
  }

  if (this.selectedSubservice === null || this.selectedSubservice === undefined) {
    this.toastr.error('El Subservicio seleccionado es necesario para la actualización.');
    return;
  }
  if (this.newServiceTime === null || this.newServiceTime === undefined || this.newServiceTime <= 0) {
    this.toastr.error('El tiempo del servicio debe ser un valor válido y mayor a cero.');
    return;
  }


  // Asegúrate de enviar selectedServiceName en lugar de newServiceName
  this.editHomeService.addService(this.salonId, this.selectedServiceId,this.newSubservices, this.newServiceTime).subscribe(
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
    (response: any) => {
      if (response.data) {
        // Asignar los datos, incluso si están vacíos
        this.getSalonServices = response.data;
        console.log('Servicios actualizados:', this.getSalonServices);

        // Maneja el caso de array vacío
        if (this.getSalonServices.length === 0) {
          console.warn('No hay servicios disponibles.');
        }
      } else {
        console.error('Formato de respuesta incorrecto', response);
        this.getSalonServices = []; // Limpia la lista si el formato es incorrecto
      }
    },
    (error) => {
      console.error('Error al obtener servicios con subservicios', error);
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


  deleteServiceWithSubservice(id_salon_service_type: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      this.editHomeService.deleteServiceWithSubservice(id_salon_service_type).subscribe(
        (response) => {
          if (response.success) {
            this.getServicesWithSubservices();
            this.toastr.success('Servicio eliminado con éxito');
             // Refresca la lista de servicios
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

  openEditModal(service: any): void {
    // Clona el objeto del servicio seleccionado
    this.selectedService = { ...service };
  
    // Asigna los valores necesarios
    this.newServiceName = this.selectedService.id_service; // ID del servicio seleccionado
    this.newServiceTime = this.selectedService.time;
  
    // Asigna el ID de Salon Service Type
    this.idSalonServiceType = this.selectedService.id_salon_service_type; // Asegúrate de que este valor exista en el objeto `service`
  
    // Cargar los subservicios correspondientes al servicio seleccionado
    this.editHomeService.getSubservicesByService(this.selectedService.id_service).subscribe(
      (response) => {
        if (response.success) {
          // Asigna los subservicios cargados a la lista correspondiente
          this.getSalonSubservices = response.data;
  
          // Una vez cargados los subservicios, asigna el subservicio seleccionado
          this.newSubservices = this.selectedService.id_service_type.toString();
  
          // Verificación: imprimir los valores asignados
          console.log('Servicio seleccionado:', this.newServiceName);
          console.log('Subservicio seleccionado:', this.newSubservices);
          console.log('ID de Salon Service Type:', this.idSalonServiceType);
        } else {
          console.error('Error al cargar los subservicios:', response.message);
        }
      },
      (error) => {
        console.error('Error al obtener subservicios:', error);
      }
    );
  }
  

  onSubserviceSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSubservice = +target.value; // Asegúrate de que sea un número
    console.log('Subservicio seleccionado:', this.selectedSubservice);
  }


  updateServiceWithSubservice(): void {
    // Validaciones detalladas para identificar qué dato falta
    if (this.idSalonServiceType === null || this.idSalonServiceType === undefined) {
      this.toastr.error('El ID de Salon Service Type es necesario para la actualización.');
      return;
    }
    if (this.selectedServiceId === null || this.selectedServiceId === undefined) {
      this.toastr.error('El ID del Servicio seleccionado es necesario para la actualización.');
      return;
    }
    if (this.selectedSubservice === null || this.selectedSubservice === undefined) {
      this.toastr.error('El Subservicio seleccionado es necesario para la actualización.');
      return;
    }
    if (this.newServiceTime === null || this.newServiceTime === undefined || this.newServiceTime <= 0) {
      this.toastr.error('El tiempo del servicio debe ser un valor válido y mayor a cero.');
      return;
    }
  
    // Crear el objeto con los datos para la actualización
    const updateData = {
      idSalonServiceType: this.idSalonServiceType,
      idService: this.selectedServiceId,
      idServiceType: this.selectedSubservice,
      time: this.newServiceTime,
      active: 1, // Cambia si necesitas actualizarlo de manera diferente
    };

    // Llamada al servicio para actualizar el servicio con los subservicios
    this.editHomeService.updateServiceWithSubservice(updateData).subscribe(
      (response: any) => {
        if (response.success) {
          this.toastr.success('Servicio actualizado con éxito');
          this.getServicesWithSubservices(); // Recargar la lista de servicios
          this.modalService.dismissAll(); // Cerrar el modal de edición
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


  addCategorySalon() {
    if (!this.selectedCategory) {
      this.toastr.warning('Por favor, selecciona una categoría.'); // Mostrar advertencia si no se seleccionó ninguna categoría
      return;
    }

    // Llama al servicio para añadir la categoría seleccionada al salón
    this.editHomeService.addCategorySalon(this.salonId, this.selectedCategory).subscribe(
      (response) => {
        this.toastr.success('Categoría añadida correctamente.');
        // Opcional: Puedes actualizar la lista de categorías o realizar otra acción después de añadir la categoría
        this.getSalonData(this.salonId);
      },
      (error) => {
        this.toastr.error('Error al añadir la categoría.');
        console.error('Error:', error);
      }
    );

    // Reiniciar la categoría seleccionada
    this.selectedCategory = '';
  }

  getCategoriesModal(): void {
    this.editHomeService.getCategories().subscribe(
      (response: any) => {
        // Verifica si response tiene datos en la propiedad data
        if (response.data && response.data.length > 0) {
          this.getCategories = response.data;
          console.log('Categorias cargadas', this.getCategories);
        } else {
          console.error('No se encontraron categorías', response);
        }
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }
  
  onEditCategory(category: any): void {
    // Hacer una copia de la categoría seleccionada
    this.selectedCategory = { ...category };
    console.log('Categoría seleccionada para editar:', this.selectedCategory.category);
  }

  onDeleteCategory(category:any):void{
    this.selectedCategory= { ...category};

  }
  
  // Función para actualizar la categoría
  updateCategory(): void {
    if (this.selectedCategory && this.selectedCategory.id_category) {
      const updateData = {
        idSalon:this.salonId,
        id_category: this.selectedCategory.id_category, // ID de la categoría
        categories: this.selectedCategory.category   // Nuevo nombre de la categoría
      };
      


      this.editHomeService.updateCategorySalon(updateData).subscribe(
        (response: any) => {
          console.log('Categoría actualizada:', this.selectedCategory);
          this.toastr.success('Categoría actualizada correctamente.');
          this.getSalonData(this.salonId); // Actualiza la lista de categoríasp
        },
        (error) => {
          console.error('Error al actualizar la categoría:', error);
          this.toastr.error('Error al actualizar la categoría.');
        }
      );
    } else {
      this.toastr.warning('Por favor, selecciona una categoría para actualizar.');
    }

      console.log('Id salon',this.salonId);
      console.log('id category',this.selectedCategory.id_category);
      console.log('category name',this.selectedCategory.category)
}

openDeleteModal(id_category: any) {
  this.idCategoryToDelete = id_category; // Guarda el ID de la categoría a eliminar
}

openDeleteServiceModal(id_salon_service_type: any) {
  this.idServiceToDelete = id_salon_service_type; // Guarda el ID del servicio a eliminar
}


confirmDeleteCategory() {
  this.editHomeService.deleteCategorySalon(this.idCategoryToDelete).subscribe(
    (response: any) => {
      this.toastr.success('Categoría eliminada exitosamente', 'Éxito');
      this.getSalonData(this.salonId); // Recarga los datos después de eliminar
    },
    (error) => {
      this.toastr.error('Error al eliminar la categoría', 'Error');
    }
  );
}

confirmDeleteService() {
  this.editHomeService.deleteServiceWithSubservice(this.idServiceToDelete).subscribe(
    (response: any) => {
      this.toastr.success('Servicio eliminado exitosamente', 'Éxito');
       // Recarga la lista de servicios después de eliminar
      this.getServicesWithSubservices();
      this.cdr.detectChanges();
    },
    (error) => {
      this.toastr.error('Error al eliminar el servicio', 'Error');
    }
  );
}
}
