import { Path } from "./../../../../node_modules/path-scurry/dist/commonjs/index.d";
import { Component } from "@angular/core";
import { JobOfferService } from "../../core/service/job-offer.service";
import { ToastrService } from "ngx-toastr";
import e from "express";

@Component({
  selector: "app-job-offer",
  templateUrl: "./job-offer.component.html",
  styleUrl: "./job-offer.component.scss",
})
export class JobOfferComponent {
  currentPage: number = 1;
  pageSize: number = 4;
  totalItems: number = 0;
  getAllCategoriesJob: any[] = [];
  getAllSubCategoriesJob: any[] = [];
  addCategoryJob: string = "";
  addSubCategoryJob: string = "";
  maxCharacters: number = 500;
  textDescriptionJob: string = "";
  textRequirementsJob: string = "";
  salary: string = "";
  serverImages: any[] = [];
  selectedImgJob: string = "";
  selectedCategoryName: string = "";
  defaultImage: string = "../../../assets/img/sello.jpg";
  selectedImage: string | null = null;
  selectedCategoryId: number | null = null;
  jobsOffers: any[] = [];
  salonUser: any[] = [];
  selectedSalon: number | null = null;
  selectedToDelete: number = 0;
  viewDetailsJob: any = null;
  errorMensajeCategory:string="";
  errorMensajeSubcategory:string="";
  errorTextDesription:string="";
  errorTextRequirements:string="";
  errorSalary:string="";
  errorImage:string="";
  jobSuscribed: any[] = [];
  id_job_offer: number = 0;
  setToDeleteCandidate: number = 0;
  isAdmin: boolean = false;
  public totalRecords: number = 0;
  public totalPages: number = 1;

  

  constructor(
    private toastr: ToastrService,
    private jobOfferService: JobOfferService
  ) {}

  ngOnInit(): void {
    const id_user = localStorage.getItem("usuarioId");
    this.getPanelforTypeUser();
    this.getCategoriesJob();
    this.getImgJob();
    this.getSalonsByUser(id_user || "");   
    //this.getJobInscriptions();
  }


  getPanelforTypeUser() {
    const id_user = localStorage.getItem("usuarioId");
    this.jobOfferService.getUserPermiso().subscribe(
      (response: any) => {
        //console.log('Permiso recibido:', response);
        if (response.permiso === "salon" && id_user) {
          this.isAdmin = false;
          this.getAllJobsOffersByUser(id_user); // id_user como string
        } else if (response.permiso === "admin") {
          this.isAdmin = true;
          //console.log("Permiso admin",response.permiso);
          this.getAllJobsOffers();
        } else {
          console.warn("Permiso desconocido o usuario no identificado");
        }
        //console.log("Permiso recibido:", response);
      },
      (error) => {
        console.error("Error al obtener permiso del usuario:", error);
      }
    );
  }

  preventComma(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
  
    // Permitir solo teclas numéricas y algunas teclas de control
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }
  
    // Aplicar formateo con separadores de miles después de la entrada
    setTimeout(() => {
      const inputValue = inputElement.value.replace(/\D/g, ''); // Eliminar todo excepto números
      inputElement.value = this.addThousandSeparator(inputValue); // Agregar puntos como separadores de miles
    }, 0);
  }
  
  // Función para agregar puntos como separadores de miles
  private addThousandSeparator(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }


  getAllJobsOffers(): void {
    const page = this.currentPage; // Página actual
    const pageSize = this.pageSize;
    this.jobOfferService.getAllJobsOffers(page, pageSize).subscribe(
      (response: any) => {
        console.log("Respuesta del backend:", response); // Verifica que esta log muestra los datos correctamente
        this.jobsOffers = response.jobs; // Asignación correcta de las ofertas
        this.totalItems = response.total; // Total de elementos para la paginación
      },
      (error) => {
        console.error("Error al cargar las ofertas de empleo:", error);
      }
    );
  }

  getAllJobsOffersByUser(id_user: string): void {
    const page = this.currentPage; // Página actual
    const pageSize = this.pageSize; // Tamaño de la página
  
    this.jobOfferService.getAllJobsOffersByUserPaginated(id_user, page, pageSize).subscribe(
      (response: any) => {
        this.jobsOffers = response.jobs; // Ofertas de empleo paginadas
        this.totalItems = response.total; // Total de elementos para calcular la paginación
      },
      (error) => {
        console.error("Error al cargar las ofertas de empleo por usuario:", error);
      }
    );
  }

  getSalonsByUser(id_user: string): void {
    this.jobOfferService.getSalonsUser(id_user).subscribe((response: any) => {
      this.salonUser = Array.isArray(response) ? response : response.data;
      console.log("Salones por usuario recibidos:", this.salonUser);
      if (this.salonUser.length > 0) {
        this.selectedSalon = this.salonUser[0].id_salon;
      }
    });
  }

  getAllJobsOffer(page: number): void {
    this.currentPage = page;
  }

  setToDelete(id_job_offer: number) {
    this.selectedToDelete = id_job_offer;
    console.log('Id candidato para eliminar',this.selectedToDelete);
  }

  deleteJobOffer() {
    this.jobOfferService.deleteJobOffer(this.selectedToDelete).subscribe(
      (response: any) => {
        this.getPanelforTypeUser();
        this.toastr.success("Oferta de empleo eliminada con éxito", "Éxito");
      },
      (error) => {
        console.error("Error al eliminar la oferta de empleo:", error);
        this.toastr.error("Error al eliminar la oferta de empleo", "Error");
      }
    );
  }

  SetToViewDetailsOffer(job: any): void {
    this.viewDetailsJob = job;
    console.log('datos enviados',job)
  }


  get currentCharacterDescriptionJobCount(): number {
    return this.textDescriptionJob.length;
  }

  get currentCharacterRequirementsJobCount(): number {
    return this.textRequirementsJob.length;
  }

  getImgJob(): void {
    this.jobOfferService.getImgJob().subscribe(
      (response: any) => {
        this.serverImages = Array.isArray(response) ? response : response.data;
        console.log("Imágenes de empleo recibidas:", this.serverImages);
      },
      (error) => {
        console.log("Error al cargar las imágenes:", error);
      }
    );
  }

  // Método para manejar la selección de una imagen
  selectImage(imageUrl: string): void {
    console.log("Imagen seleccionada:", imageUrl);
    this.selectedImgJob = imageUrl;
  }

  toggleImageSelection(imagePath: string, event: any): void {
    if (event.target.checked) {
      this.selectedImage = imagePath;
    } else {
      this.selectedImage = null;
    }
  }

  // Método para confirmar la selección y realizar cualquier acción necesaria
  confirmSelection(): void {
    console.log("Imágenes seleccionadas:", this.selectedImage);
  }

  getCategoriesJob(): void {
    this.jobOfferService.getCategoriesJob().subscribe(
      (response: any) => {
        // Verifica si response es un array o si tienes que acceder a response.data
        this.getAllCategoriesJob = Array.isArray(response)
          ? response
          : response.data;
        //console.log('Categorias de empleo recibidas:', this.getAllCategoriesJob);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const id_job_cat = selectElement.value;

    if (id_job_cat) {
      this.addSubCategoryJob = "";
      this.getSubCategoriesByCategory(Number(id_job_cat));
    }

    const selectedCategory = this.getAllCategoriesJob.find(
      (category) => category.id_job_cat === Number(id_job_cat)
    );

    if (selectedCategory) {
      this.selectedCategoryId = selectedCategory.id_job_cat; // Guarda el ID de la categoría
      this.selectedCategoryName = selectedCategory.name; // Guarda el nombre de la categoría
    }
  }

  getSubCategoriesByCategory(id_job_cat: number): void {
    this.jobOfferService.getSubCategoriesByCategory(id_job_cat).subscribe(
      (response: any) => {
        this.getAllSubCategoriesJob = Array.isArray(response)
          ? response
          : response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pageCount) {
      this.currentPage = page;
      const id_user = localStorage.getItem("usuarioId") || "";
      this.getPanelforTypeUser();
    }
  }
  
  get pageCount(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  
  get pages(): number[] {
    const maxPagesToShow = 5;
    const pages = [];
    const half = Math.floor(maxPagesToShow / 2);

    let start = Math.max(this.currentPage - half, 1);
    let end = Math.min(start + maxPagesToShow - 1, this.pageCount);

    if (end - start < maxPagesToShow) {
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  


  addJobOffer(): void {
    // Obtiene el ID de usuario de localStorage
    const id_user = localStorage.getItem("usuarioId");

    if(!this.selectedCategoryName) {
      this.errorMensajeCategory="Seleccione una categoría";
      return
    }else{
      this.errorMensajeCategory="";
    }
    if(!this.addSubCategoryJob) {
      this.errorMensajeSubcategory="Seleccione una subcategoría";
      return
    }else{
      this.errorMensajeSubcategory="";
    }

    if(!this.textDescriptionJob) {
      this.errorTextDesription="Escriba la descripción del trabajo";
      return
    }else{
      this.errorTextDesription="";
    }

    if(!this.textRequirementsJob) {
      this.errorTextRequirements="Escriba los requisitos de la oferta";
      return
    }else{
      this.errorTextRequirements="";
    }

    if(!this.salary) {
      this.errorSalary="Escriba el salario de la oferta";
      return
    }else{
      this.errorSalary="";
    }

    if(!this.selectedImage) {
      this.errorImage="Seleccione una imagen";
      return
    }else{
      this.errorImage="";
    }
    

    const jobOfferData = {
      id_user: id_user,
      id_salon: this.selectedSalon,
      category: this.selectedCategoryName,
      subcategory: this.addSubCategoryJob,
      description: this.textDescriptionJob,
      requirements: this.textRequirementsJob,
      salary: this.salary,
      img_job_path: this.selectedImage,
    };


    this.jobOfferService.addJobOfferData(jobOfferData).subscribe(
      (response: any) => {
        this.toastr.success("Oferta de empleo publicada con éxito");
        this.addCategoryJob = "";
        this.selectedCategoryName = "";
        this.addSubCategoryJob = "";
        this.textDescriptionJob = "";
        this.textRequirementsJob = "";
        this.salary = "";
        this.selectedImage = "";
        this.getPanelforTypeUser();
      },
      (error: any) => {
        this.toastr.error("Error al publicar la oferta de empleo");
      }
    );
    //console.log("Datos recogidos:", jobOfferData);
  }
  getFormattedSalary(): string {
    //console.log('Salario de la oferta:',this.viewDetailsJob?.salary);
    if (this.viewDetailsJob?.salary == null || this.viewDetailsJob.salary === "0") {
      return 'Salario no disponible';
    }
    return this.viewDetailsJob.salary
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
  }


  setToJobInscription(id_job_offer: number): void {
    this.id_job_offer = id_job_offer;
    this.getJobInscriptions();

  }


  getJobInscriptions(page: number = 1): void {
    const pageSize = 4; // Siempre 4 elementos por página
    this.jobOfferService.getJobInscriptions(this.id_job_offer, page, pageSize).subscribe(
      (response: any) => {
        this.jobSuscribed = Array.isArray(response.data) ? response.data : [];
        this.totalRecords = response.meta?.totalRecords || 0;
        this.totalPages = response.meta?.totalPages || 1;
        this.currentPage = response.meta?.currentPage || page;
  
        console.log('ID de oferta:', this.id_job_offer);
        console.log('Ofertas inscriptas:', this.jobSuscribed);
        console.log('Metadatos:', {
          totalRecords: this.totalRecords,
          totalPages: this.totalPages,
          currentPage: this.currentPage,
        });
      },
      (error) => {
        console.error('Error al obtener las inscripciones:', error);
      }
    );
  }


  setToDeleteCandidature(id_user_job_subscriptions: number){
    this.setToDeleteCandidate = id_user_job_subscriptions
    console.log('Id candidato para eliminar',this.setToDeleteCandidate);
  }

  confirmDeleteCandidate():void{
    this.jobOfferService.deleteCandidatureJobOffer(this.setToDeleteCandidate).subscribe(
      (response: any) => {
        this.toastr.success("Candidatura eliminada con éxito");
        this.getJobInscriptions();
      },
      (error: any) => {
        this.toastr.error("Error al eliminar la candidatura");
      }
    );
  }
}
