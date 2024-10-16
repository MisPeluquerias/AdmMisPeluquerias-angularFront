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
  additionalComments: string = '';
  dias: any[] = [];
  getSalonServices:any[]=[];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  selectedFile: File | null = null;
  images: any[] = [];
  ratings = {
    service: [false, false, false, false, false],
    quality: [false, false, false, false, false],
    cleanliness: [false, false, false, false, false],
    speed: [false, false, false, false, false]
  };
  fileDescription = '';
  fileGroup = '';
  filePrincipal = false;
  fileActive = true;
  currentImageUrl: string = '';
  currentImageAlt: string = '';
  isImageOpen =false;
  services: any[]=[];
  newServiceName: string = '';
  updateServiceName: string = '';
  newSubservices: string = '';
  updateSubservices: string = '';
  newServiceTime:number=0;
  updateServiceTime:number=0;
  newServicePrice:string="";
  updateServicePrice:string="";
  selectedService: any = {};
  selectedSubservice: any = {};
  selectedNewBrand: any = "";
  selectedUpdateBrand:any="";
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
  responseReviewText: string = '';
  averageRating: number = 0;
  averageRatingStart: number = 0;
  getSalonSubservices:any[]=['Seleccione una opción'];
  selectedServiceId: number | null = null;
  selectedServiceName: string | null = null;
  idSalonServiceType: number | null = null;
  selectedCategory: any = {};
  oldCategory: string = '';
  idCategoryToDelete: any;
  idServiceToDelete: any;
  userPermiso: string = '';
  brands:any;
  brandsBySalon:any;
  responseText: string = '';
  idFaqToDelete: any;
  idReviewToDelete: any;
  idImageToDelete: any;
  setDeleteBrand:any;
  setUpdateBrand:any;
  selectedUpdateBrandIdName:any="";
  selectedUpdateBrandIdNameCheck:any;
  
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
    this.getUserPermiso();
    this.getAllBrands();
    this.getBrandsBySalon();
  }

  getUserPermiso(): void {
    // Llama al método del servicio para obtener el permiso del usuario
    this.editHomeService.getUserPermiso().subscribe({
      next: (response) => {
        // Asigna el permiso obtenido a la variable userPermission
        this.userPermiso = response.permiso;
        //console.log('Permiso de usuario',this.userPermiso); // Ajusta esto según la estructura del objeto recibido
      },
      error: (error) => {
        console.error('Error al obtener el permiso del usuario:', error);
        // Manejo de errores si es necesario
      }
    });
  }


  getSalonUrl(): string {
    if (!this.salonData || !this.salonData.name) {
      return '#';  // Si no hay datos del salón, devuelve una URL por defecto o vacía
    }
  
    const salonSlug = this.salonData.name
      .toLowerCase()
      .replace(/ /g, '-')           // Reemplaza los espacios con guiones
      .replace(/[^a-z0-9-]/g, '')   // Elimina caracteres no alfanuméricos y deja solo guiones y letras
      .replace(/--+/g, '-');        // Reemplaza múltiples guiones seguidos por uno solo
  
    // Construye y retorna la URL completa
    return `https://www.mispeluquerias.com/centro/${salonSlug}/${this.salonData.id_salon}`;
  }

  generateStars(rating: number): string[] {
  return Array(5).fill(0).map((_, i) => {
    if (i < Math.floor(rating)) {
      return 'fas fa-star'; // Estrella llena
    } else if (i === Math.floor(rating) && rating % 1 !== 0) {
      return 'fas fa-star-half-alt'; // Media estrella
    } else {
      return 'far fa-star'; // Estrella vacía
    }
  }).reverse();
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

  generateStarRatingArray(rating: number): number[] {
    const totalStars = 5;
    const fullStars = Math.floor(rating);  // Número de estrellas completas
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;  // Media estrella si corresponde
    const emptyStars = totalStars - fullStars - halfStar;  // Estrellas vacías
  
    return [
      ...Array(fullStars).fill(1),  // Estrellas completas
      ...Array(halfStar).fill(0.5),  // Media estrella
      ...Array(emptyStars).fill(0)  // Estrellas vacías
    ];
  }


  getSalonData(id_salon: number): void {
    this.editHomeService.getSalonById(id_salon).subscribe(
      (response: any) => {
        this.salonData = response.data;
        this.averageRatingStart = this.salonData.average_rating || 0;
        //console.log('salonData', this.salonData);
  
        // Verificar si las categorías existen y no son nulas
        if (this.salonData.categories && this.salonData.categories.trim() !== '') {
          try {
            // Convierte la cadena en un formato de array JSON válido
            const formattedCategories = `[${this.salonData.categories.replace(/\\/g, '')}]`;
            const categoryArray = JSON.parse(formattedCategories);
  
            // Verificar si el array contiene elementos válidos
            if (categoryArray.length === 1 && categoryArray[0].id_category === null) {
              this.salonData.categoriesArray = []; // Asignar un array vacío si no hay categorías válidas
            } else {
              this.salonData.categoriesArray = categoryArray; // Asignarlo si es válido
            }
  
          } catch (error) {
            console.error('Error parsing categories:', error);
            this.salonData.categoriesArray = []; // Asignamos un array vacío en caso de error
          }
        } else {
          // Si no hay categorías o está vacío, asignar un array vacío
          this.salonData.categoriesArray = [];
        }
  
        if (this.salonData.id_province) {
          this.onProvinceChange(this.salonData.id_province, true);
        }
  
        // Procesa los horarios antiguos si existen
        if (this.salonData.hours_old) {
          try {
            const hoursArray = this.salonData.hours_old.split('; ').map((dayText: string) => {
              const [day, hours] = dayText.split(': ');
              return {
                day: day.trim(),
                hours: hours
                  ? hours.split(', ').map((hour: string) => {
                      const [open, close] = hour.split('-');
                      return { open: open.trim(), close: close.trim() };
                    })
                  : [],
              };
            });
  
            this.salonData.hours = hoursArray;
  
            this.days.forEach((day) => {
              const matchingHours = hoursArray.find(
                (h: { day: string; hours: { open: string; close: string }[] }) =>
                  h.day === day.name
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
  

  updateRatings(ratingArray: boolean[], index: number): void {
    // Marca los checkboxes anteriores si uno es seleccionado
    if (ratingArray[index]) {
      for (let i = 0; i <= index; i++) {
        ratingArray[i] = true;
      }
    } else {
      // Desmarca los checkboxes siguientes si uno es deseleccionado
      for (let i = index + 1; i < ratingArray.length; i++) {
        ratingArray[i] = false;
      }
    }
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
    // Especifica el tipo de `hour` como `{ open: string; close: string }`
    hours: day.hours.filter((hour: { open: string; close: string }) => hour.open && hour.close)
  }));
  
  const hours_old = hoursToSave
    .map(day => `${day.day}: ${day.hours.map(hour => `${hour.open}-${hour.close}`).join(', ')}`)
    .join('; '); // Convierte los horarios a texto plano

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
    
    //console.log(this.salonData);

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
        
        this.getSalonData(this.salonId);
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

  setToDeleteImage(imageId: number): void {
    this.idImageToDelete = imageId;
  }


  confirmDeleteImage() {
    this.editHomeService.deleteImage(this.idImageToDelete).subscribe(response => {
      this.toastr.success('Imagen eliminada con éxito');
      //console.log('Image deleted successfully', response);
      this.loadImages(); // Recargar la lista de imágenes
    }, error => {
      this.toastr.error('Error al eliminar la imagen');
      console.error('Error deleting image', error);
    });
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
          //console.log('Servicios cargados',this.getSalonServices); // Usa este valor para gestionar la paginación en el frontend
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
    this.updateSubservices="";
    
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
  this.editHomeService.addService(this.salonId, this.selectedServiceId,this.newSubservices, this.newServiceTime,this.newServicePrice).subscribe(
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
      this.toastr.error('Error al agregar el servicio,compruebe si el servicio ya esta en su lista');
    }
  );
}

getServicesWithSubservices() {
  this.editHomeService.getServicesWithSubservices(this.salonId).subscribe(
    (response: any) => {
      if (response.data) {
        // Asignar los datos, incluso si están vacíos
        this.getSalonServices = response.data;
        //console.log('Servicios actualizados:', this.getSalonServices);

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
    const updatedQuestion  = {
      id_faq: this.faqToEdit.id_faq,
      answer: this.editAnswerText || "",
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
          //console.log('FAQs loaded successfully', this.faqByIdSalon);
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

  getReviewsById(): void {
    this.editHomeService.loadReview(this.salonId).subscribe(
      reviews => {
        this.reviews = reviews.map(review => {
          review.stars = this.generateStars(review.qualification); // Generar las estrellas para cada reseña
          return review;
          
        });
        //console.log('reseñas cargadas',this.reviews);
      },
      error => console.error('Error loading reviews', error)
    );
  }

  updateReview(): void {
    const updatedReview = {
      ...this.reviewToEdit, // Mantener otros datos de la reseña
      observacion: this.additionalComments,
      qualification: {
        service: this.countSelectedRatings(this.ratings.service),
        quality: this.countSelectedRatings(this.ratings.quality),
        cleanliness: this.countSelectedRatings(this.ratings.cleanliness),
        speed: this.countSelectedRatings(this.ratings.speed),
      }
    };

    // Llamada al servicio para actualizar la reseña en el backend
    this.editHomeService.updateReview(updatedReview).subscribe({
      next: () => {
        this.toastr.success('Reseña actualizada con éxito');
        this.getReviewsById();
      },
      error: (error) => {
        //console.error('Error al actualizar la reseña:', error);
        this.toastr.error('No se pudo actualizar la reseña.');
      }
    });
  }

  countSelectedRatings(ratingArray: boolean[]): number {
    return ratingArray.filter(Boolean).length;
  }

  openEditModal(service: any): void {
    // Clona el objeto del servicio seleccionado
    this.selectedService = { ...service };
  
    // Asigna los valores necesarios
    this.updateServiceName = this.selectedService.id_service; 
    this.updateServiceTime = this.selectedService.time;
    this.updateServicePrice = this.selectedService.price.toString();
    this.updateSubservices = this.selectedService.id_service_type.toString();
  
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
          console.log('Servicio seleccionado:', this.updateServiceName);
          console.log('Subservicio seleccionado:', this.updateSubservices);
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

    if (!this.updateServiceName || !this.updateSubservices || !this.updateServiceTime) {
        this.toastr.error('Por favor, rellene los campos servicios,subservicios y tiempo de servicio');
        return;
    }
    
    const updateData = {
        idSalonServiceType: this.idSalonServiceType,
        idService: this.updateServiceName,
        idServiceType: this.updateSubservices,
        price: this.updateServicePrice,
        time: this.updateServiceTime,
        active: 1,
    };

    console.log('Datos enviados:', updateData); // Verifica los valores

    this.editHomeService.updateServiceWithSubservice(updateData).subscribe(
        (response: any) => {
            if (response.success) {
                this.toastr.success('Servicio actualizado con éxito');
                this.getServicesWithSubservices();
            } else {
                this.toastr.error('Error al actualizar el servicio');
            }
        },
        (error) => {
            console.error('Error updating service:', error);
            this.toastr.error('Error al actualizar el servicio, compruebe que el subervicio no este en su lista.');
        }
    );
}


  openEditModalToReview(review: any): void {
    this.reviewToEdit = review;
    
    //console.log('Observation',observation);

    // Usamos la calificación general para todas las categorías
    const overallRating = review.qualification;


    // Llenamos todas las categorías con la misma calificación general
    this.ratings = {
      service: this.getCheckboxState(review.servicio),
      quality: this.getCheckboxState(review.calidad_precio),
      cleanliness: this.getCheckboxState(review.limpieza),
      speed: this.getCheckboxState(review.puntualidad),
    };

    // Asignar los comentarios adicionales
    this.additionalComments = review.observacion;
    this.responseText = review.respuesta;
    //console.log('Estado de ratings:', this.ratings);
  }



  updateReviewModal(): void {
    const review = {
      ...this.reviewToEdit, // Mantener otros datos de la reseña
      observacion: this.additionalComments,
      respuesta: this.responseText,
      qualification: {
        service: this.countSelectedRatings(this.ratings.service),
        quality: this.countSelectedRatings(this.ratings.quality),
        cleanliness: this.countSelectedRatings(this.ratings.cleanliness),
        speed: this.countSelectedRatings(this.ratings.speed),
      }
    };


    // Llamada al servicio para actualizar la reseña en el backend
    this.editHomeService.updateReview(review).subscribe({
      next: () => {
        this.toastr.success('Reseña actualizada con éxito');
        this.getReviewsById();
      },
      error: (error) => {
        //console.error('Error al actualizar la reseña:', error);
        this.toastr.error('No se pudo actualizar la reseña.');
      }
    });
  }



  openResponseModalReview(review: any): void {
    this.reviewToEdit = review; // Aquí aseguramos que toda la reseña se asigne correctamente
    this.editReviewText = review.observacion;
    this.responseText = review.respuesta;
  }
  
   getCheckboxState(rating: number): boolean[] {
    return [1, 2, 3, 4, 5].map((val) => val <= rating);
  }


  checkLengthTime(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 3) {
      input.value = input.value.slice(0, 3);
    }
  }
  checkLengthPrice(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    // Limitar a cuatro enteros y dos decimales
    const regex = /^\d{0,4}(\.\d{0,2})?$/;
  
    if (!regex.test(value)) {
      // Remover caracteres no permitidos y limitar la longitud
      value = value.replace(/[^0-9.]/g, '').substring(0, 7); // 7 por cuatro enteros, punto y dos decimales
      const parts = value.split('.');
  
      if (parts[0].length > 4) {
        parts[0] = parts[0].substring(0, 4);
      }
  
      if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }
  
      value = parts.join('.');
    }
  
    input.value = value;

  }

  
  confirmResponseReview(): void {
      const responseReview = {
        id_review: this.reviewToEdit.id_review, // Asegúrate de que reviewToEdit contiene id_review
        respuesta: this.responseText || ""
      };
  
      this.editHomeService.responseReview(responseReview).subscribe(
        response => {
          console.log('Reseña actualizada:', response);
          this.toastr.success('Reseña constestada con éxito');
           this.getReviewsById();
        },
        error => {
          this.toastr.error('Error al actualizar la respuesta de la reseña');
          console.error('Error actualizando la reseña', error);
          //console.log('responseReview id:', this.reviewToEdit?.id_review);
          //console.log('responseReview respuesta:', this.responseText);
        }
      );
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
        this.toastr.error('Error al añadir la categoría. Por favor, compruebe si la categoría ya existe en la lista.');
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
          //console.log('Categorias cargadas', this.getCategories);
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
          this.toastr.error('Error al actualizar la categoría. Por favor, compruebe si la categoría ya existe en la lista.');
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


setToDeleteFaq(id_faq: any) {
  this.idFaqToDelete = id_faq; // Guarda el ID de la pregunta a eliminar
}


confirmDeleteFaq() {
  this.editHomeService.deleteFaq(this.idFaqToDelete).subscribe(
    (response: any) => {
      this.toastr.success('Pregunta eliminada exitosamente', 'Éxito');
      this.getFaqByIdSalon();
    },
    (error) => {
      this.toastr.error('Error al eliminar la pregunta', 'Error');
    }
  );
} 


setToDeleteReview(id_review: any) {
  this.idReviewToDelete = id_review;     
}


confirmDeleteReview(): void {
  console.log('Id del review a eliminar', this.idReviewToDelete);
  if (this.idReviewToDelete) {
    this.editHomeService.deleteReview(this.idReviewToDelete).subscribe(
      response => {
        this.toastr.success('Reseña eliminada con éxito');
        this.getReviewsById();
      },
      error => console.error('Error eliminando la Reseña', error)
    );
  } else {
    console.error('No se encontró el ID de la reseña.');
  }
}

getAllBrands(): void {
  this.editHomeService.getBrands().subscribe({
    next: (response) => {
      this.brands = response; // Asigna la respuesta a la variable `allBrands`
      //console.log('marcas recividas',this.brands);
    },
    error: (err) => {
      console.error('Error al obtener las marcas:', err);
      this.toastr.error('Hubo un error al cargar las marcas', 'Error');
    }
  });
}


getBrandsBySalon(): void {
  this.editHomeService.getBrandByIdSalon(this.salonId).subscribe({
    next: (response) => {
      this.brandsBySalon = response; // Asigna la respuesta a la variable `allBrands`
      console.log('marcas recividas',this.brandsBySalon);
    },
    error: (err) => {
      console.error('Error al obtener las marcas:', err);
      //this.toastr.error('Hubo un error al cargar las marcas', 'Error');
    }
  });
}

addBrandSalon(): void {
  if (!this.salonId || !this.selectedNewBrand) {
    this.toastr.warning('Debe seleccionar un salón y una marca', 'Advertencia');
    return;
  }
  //console.log('ID de la marca seleccionado:', this.selectedNewBrand);
  //console.log('ID del salón:', this.salonId);
  this.editHomeService.addBrandToSalon(this.salonId, this.selectedNewBrand).subscribe({
    next: (response) => {
      this.toastr.success('Marca añadida al salón con éxito', 'Éxito');
      console.log('Respuesta del servidor:', response);
      this.getBrandsBySalon();
     
      // Aquí puedes añadir lógica adicional, como recargar la lista de salones o cerrar el modal
    },
    error: (err) => {
      console.error('Error al añadir la marca al salón:', err);
      this.toastr.error('Hubo un error al añadir la marca al salón, Por favor compruebe que la marca exista en su lista', 'Error');
    }
  });
}
setToDeleteBrand(id_brand: number): void {
  this.setDeleteBrand = id_brand;
}

confirmDeleteBrand(): void {
  if (this.setDeleteBrand) {
    this.editHomeService.deleteBrandById(this.setDeleteBrand).subscribe({
      next: () => {
        this.toastr.success('Marca eliminada de su salón con éxito');
        console.log('Marca eliminada con éxito');
        this.getBrandsBySalon();
      },
      error: (err) => {
        this.toastr.error('Error al eliminar la marca');
        console.error('Error al eliminar la marca:', err);
      },
    });
  } else {
    console.warn('No se ha seleccionado ninguna marca para eliminar.');
  }
}

setToUpdateBrand(id_brand_salon: number): void {
  this.selectedUpdateBrand = id_brand_salon;
}

updateBrandSalon(): void {
  // Verifica si los valores están presentes
  if (!this.selectedUpdateBrand || !this.selectedUpdateBrandIdName) {
    console.warn("La marca o el nombre de marca no están seleccionados.");
    return;
  }

  
  // Logs para confirmar los valores antes de hacer la llamada
  //console.log('ID enviado para modificar (id_brand_salon):', this.selectedUpdateBrand);
  //console.log('ID brand enviado para modificar (id_brand):', this.selectedUpdateBrandIdName);

  this.editHomeService.UpdateBrandsalon(this.selectedUpdateBrand, this.selectedUpdateBrandIdName,this.salonId).subscribe({
    next: (data) => {
      this.toastr.success('La marca del salón ha sido actualizada con éxito');
      this.selectedUpdateBrandIdName="";
      this.getBrandsBySalon();
    },
    error: (error) => {
      this.toastr.error('Error, no se pudo actualizar la marca seleccionada, Por favor compruebe que la marca no este en su lista.');
      console.error('Error al actualizar la marca del salón:', error);
      this.selectedUpdateBrandIdName="";
    },
    complete: () => console.log("Proceso completado con éxito.")
  });
}
}