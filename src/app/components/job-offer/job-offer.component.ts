import { Path } from './../../../../node_modules/path-scurry/dist/commonjs/index.d';
import { Component } from '@angular/core';
import { JobOfferService } from '../../core/service/job-offer.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-job-offer',
  templateUrl: './job-offer.component.html',
  styleUrl: './job-offer.component.scss'
})
export class JobOfferComponent {

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  getAllCategoriesJob: any[] = [];
  getAllSubCategoriesJob: any[] = [];
  addCategoryJob:string='';
  addSubCategoryJob:string='';
  maxCharacters: number = 500;
  textDescriptionJob: string = '';
  textRequirementsJob: string = '';
  salary: string = '';
  serverImages: any[] = [];
  selectedImgJob:string='';
  selectedCategoryName: string = '';
  defaultImage: string = '../../../assets/img/sello.jpg';
  selectedImage: string | null = null;
  selectedCategoryId: number | null = null;
  jobsOffers:any[]=[];
  salonUser:any[]=[];
  selectedSalon: number | null = null;
  selectedToDelete:number=0;
  viewDetailsJob: any = null;
 

  constructor(private toastr: ToastrService, private jobOfferService: JobOfferService) { }


  ngOnInit(): void {
    const id_user = localStorage.getItem('usuarioId');
    this.getPanelforTypeUser();
    this.getCategoriesJob();
    this.getImgJob();
    this.getSalonsByUser(id_user || '');
  }

  getPanelforTypeUser(){
    const id_user = localStorage.getItem('usuarioId');
    this.jobOfferService.getUserPermiso().subscribe(
      (response: any) => {
        //console.log('Permiso recibido:', response);
        if (response.permiso === 'salon' && id_user) {
          this.getAllJobsOffersByUser(id_user); // id_user como string
        } else if (response.permiso === 'admin') {
          this.getAllJobsOffers();
        } else {
          console.warn('Permiso desconocido o usuario no identificado');
        }
      },
      (error) => {
        console.error('Error al obtener permiso del usuario:', error);
      }
    );
  }
  

  getAllJobsOffers(): void {
    this.jobOfferService.getAllJobsOffers().subscribe(
      (response: any) => {
        this.jobsOffers = Array.isArray(response) ? response : response.data;
        console.log('Ofertas de empleo recibidas:', this.jobsOffers);
      },
      (error) => {
        console.error('Error al cargar las ofertas de empleo:', error);
      }
    );
  }
  

  getAllJobsOffersByUser(id_user: string): void {
    this.jobOfferService.getAllJobsOffersByUser(id_user).subscribe(
      (response: any) => {
        this.jobsOffers = Array.isArray(response) ? response : response.data;
        //console.log('Ofertas de empleo por usuario recibidas:', this.jobsOffers);
      },
      (error) => {
        console.error('Error al cargar las ofertas de empleo por usuario:', error);
      }
    );
  }


  getSalonsByUser(id_user: string): void {
    this.jobOfferService.getSalonsUser(id_user).subscribe(
      (response: any) => {
        this.salonUser = Array.isArray(response) ? response : response.data;
        console.log('Salones por usuario recibidos:', this.salonUser);
    }
    );
  }

  getAllJobsOffer(page: number): void {
    this.currentPage = page;

  }
  
  setToDelete(id_job_offer:number){
    this.selectedToDelete=id_job_offer;
  }


  deleteJobOffer(){
    this.jobOfferService.deleteJobOffer(this.selectedToDelete).subscribe(
      (response: any) => {
        this.getPanelforTypeUser();
        this.toastr.success('Oferta de empleo eliminada con éxito', 'Éxito');
      },
      (error) => {
        console.error('Error al eliminar la oferta de empleo:', error);
        this.toastr.error('Error al eliminar la oferta de empleo', 'Error');
      }
    );
  }

  SetToViewDetailsOffer(job: any): void {
    this.viewDetailsJob = job;
  }


  removeOffer(){

  }

  get currentCharacterDescriptionJobCount(): number {
    return this.textDescriptionJob.length;
  }

  get currentCharacterRequirementsJobCount():number{
   return this.textRequirementsJob.length; 
  }

  getImgJob(): void {
    this.jobOfferService.getImgJob().subscribe(
      (response: any) => {
        this.serverImages = Array.isArray(response) ? response : response.data;
        console.log('Imágenes de empleo recibidas:', this.serverImages);
      },
      (error) => {
        console.log('Error al cargar las imágenes:', error);
      }
    );
  }

  // Método para manejar la selección de una imagen
  selectImage(imageUrl: string): void {
    console.log('Imagen seleccionada:', imageUrl);
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
    console.log('Imágenes seleccionadas:', this.selectedImage);
  }


  getCategoriesJob(): void { 
    this.jobOfferService.getCategoriesJob().subscribe(
      (response: any) => {
        // Verifica si response es un array o si tienes que acceder a response.data
        this.getAllCategoriesJob = Array.isArray(response) ? response : response.data;
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
      this.addSubCategoryJob = '';
      this.getSubCategoriesByCategory(Number(id_job_cat));
    }

    const selectedCategory = this.getAllCategoriesJob.find(
      category => category.id_job_cat === Number(id_job_cat)
    );

    if (selectedCategory) {
      this.selectedCategoryId = selectedCategory.id_job_cat; // Guarda el ID de la categoría
      this.selectedCategoryName = selectedCategory.name; // Guarda el nombre de la categoría
    }
  }



  getSubCategoriesByCategory(id_job_cat: number): void {
    this.jobOfferService.getSubCategoriesByCategory(id_job_cat).subscribe(
      (response: any) => {
        this.getAllSubCategoriesJob = Array.isArray(response) ? response : response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }


  confirmDelete() {
    
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllJobsOffer(page);
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
    const id_user = localStorage.getItem('usuarioId');
  
    const jobOfferData = {
      id_user: id_user,
      id_salon: this.selectedSalon,
      category: this.selectedCategoryName,
      subcategory: this.addSubCategoryJob,
      description: this.textDescriptionJob,
      requirements: this.textRequirementsJob,
      salary: this.salary,
      img_job_path: this.selectedImage
    };
  
    this.jobOfferService.addJobOfferData(jobOfferData).subscribe(
      (response: any) => {
        this.toastr.success('Oferta de empleo publicada con éxito');
        this.getPanelforTypeUser();
      },
      (error: any) => {
        this.toastr.error('Error al publicar la oferta de empleo');
      }
    );
    console.log('Datos recogidos:', jobOfferData);
  }
}
