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
  addCategoryJob:string=""
  addSubCategoryJob:string=""
  maxCharacters: number = 500;
  textDescriptionJob: string = '';
  textRequirementsJob: string = '';
  salary: string = '';
  serverImages: any[] = [];
  selectedImgJob:string="";
  selectedCategoryName: string = '';
  defaultImage: string = '../../../assets/img/sello.jpg';
  selectedImage: string | null = null;
  selectedCategoryId: number | null = null;
 

  constructor(private toastr: ToastrService, private jobOfferService: JobOfferService) { }

  ngOnInit(): void {
    this.getCategoriesJob();
    this.getImgJob();
  }

  getAllJobsOffer(page: number): void {
    this.currentPage = page;

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
    const jobOfferData = {
      category: this.selectedCategoryName,
      subcategory: this.addSubCategoryJob,
      description: this.textDescriptionJob,
      requirements: this.textRequirementsJob,
      salary: this.salary,
      img_job_path: this.selectedImage,
    };
    this.jobOfferService.addJobOfferData(jobOfferData).subscribe(
      (response: any) => {
        this.toastr.success('Oferta de empleo publicada con exito');
      },
      (error: any) => {
        this.toastr.error('Error al publicar la oferta de empleo');
      }
    )
    console.log( 'datos recogidos:',jobOfferData);
  }
}
