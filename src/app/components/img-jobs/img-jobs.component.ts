import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ImgJobsService } from '../../core/service/img-jobs.service';

@Component({
  selector: 'app-img-jobs',
  templateUrl: './img-jobs.component.html',
  styleUrls: ['./img-jobs.component.scss']
})
export class ImgJobsComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  selectedImgFile: File | null = null;
  images: any[] = [];
  selectedImgToDelete: number = 0;
  currentPage: number = 1;
  pageSize: number = 12;
  totalItems: number = 0; // Total de elementos en la base de datos
  
  constructor(private toastr: ToastrService, private imgJobsService: ImgJobsService) {}

  ngOnInit(): void {
    this.getAllImages(this.currentPage);
  }

  // Método para cambiar de página
  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllImages(this.currentPage);
  }

  // Calcula el número total de páginas basado en totalItems y pageSize
  get pageCount(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // Array de páginas para la paginación
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

  // Obtener imágenes con paginación
  getAllImages(page: number = 1): void {
    this.imgJobsService.getAllImgJobs(page, this.pageSize).subscribe({
      next: (response) => {
        this.images = response.images;
        this.totalItems = response.totalItems; // Total de imágenes, necesario para la paginación
        console.log('Imágenes recibidas', this.images);
      },
      error: (error) => {
        console.error("Error al obtener las imágenes", error);
      }
    });
  }

  // Método para seleccionar imagen a eliminar
  removeImgjob(id_jobs_img: number) {
    this.selectedImgToDelete = id_jobs_img;
  }

  // Confirmar eliminación
  confirmDelete() {
    if (!this.selectedImgToDelete) {
      console.log('Falta el id de la imagen para poder eliminarla');
    }
    console.log(this.selectedImgToDelete);

    this.imgJobsService.deleteImage(this.selectedImgToDelete).subscribe(
      response => {
        this.toastr.success('Imagen de empleo eliminada con éxito');
        this.getAllImages(this.currentPage); 
      },
      error => {
        this.toastr.error('Error al eliminar la imagen');
      }
    );
  }

  // Método para cargar una imagen
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImgFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImgFile);
    }
  }

  // Método para agregar una nueva imagen
  addImgJob(): void {
    if (!this.selectedImgFile) {
      this.toastr.warning('Debe seleccionar una imagen para la marca', 'Advertencia');
      return;
    }
    const formData = new FormData();
    formData.append('imgJobs', this.selectedImgFile);

    this.imgJobsService.addImgJobs(formData).subscribe({
      next: response => {
        if (response && response.imageUrl) {
          this.toastr.success('Imagen de empleo agregada exitosamente.');
          this.getAllImages(this.currentPage); // Recargar las imágenes en la página actual
        } else {
          this.toastr.warning('La respuesta no contiene la URL de la imagen.');
        }
      },
      error: error => {
        console.error('Error al subir la imagen', error);
        this.toastr.error('Error al subir la imagen.');
      }
    });
  }
}
