import { Component } from '@angular/core';
import { ServicesService } from '../../core/service/services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  AllServices: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  Math = Math;
  allSelected: boolean = false;
  searchText: string = '';
  newService: any = { name: '', subservices: [] };
  newSubservice: string[] = [];
  newSubserviceInput: string = '';
  selectedService: any = { service_name: '' }; 
  selectedSubServices: string[] = []; 
  subservicesAsText : string = "";

  constructor(private servicesService: ServicesService,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAllServices(this.currentPage);
  }

  loadAllServices(page: number): void {
    this.servicesService.loadAllServices(page, this.pageSize, this.searchText).subscribe({
      next: (response: any) => {
        this.AllServices = response.data;
        this.totalItems = response.totalItems;
      },
      error: (err) => {
        console.error('Error loading services', err);
      }
    });
  }

  selectService(service: any): void {
    this.selectedService = { ...service };  // Asignamos el servicio seleccionado a la variable
  }

  
  
  selectSubService(service: any): void {
    if (Array.isArray(service.subservices)) {
      this.selectedSubServices = [...service.subservices];
    } else if (typeof service.subservices === 'string') {
      this.selectedSubServices = service.subservices.split(',').map((subservice: string) => subservice.trim());
    } else {
      this.selectedSubServices = [];
    }

    this.selectedService = { ...service }; 
    this.subservicesAsText = this.selectedSubServices.join(', ');
  }

  onSearch(): void {
    this.loadAllServices(this.currentPage);
    if (this.searchText.trim() === '') {
      this.loadAllServices(this.currentPage);
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllServices(page);
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

  toggleAllSelection() {
    this.allSelected = !this.allSelected;
    this.AllServices.forEach(service => service.selected = this.allSelected);
  }

  checkIfAllSelected() {
    this.allSelected = this.AllServices.every(service => service.selected);
  }

  hasSelected() {
    return this.AllServices.some(service => service.selected);
  }

  removeService(index: number): void {
    this.newSubservice.splice(index, 1); // Eliminar subservicio de la lista
  }

  addSubservice(): void {
    if (this.newSubserviceInput.trim() !== '') {
      this.newSubservice.push(this.newSubserviceInput.trim());
      this.newSubserviceInput = ''; 
    }
  }

  addNewService(): void {
    if (this.newService.name.trim() !== '' && this.newSubservice.length > 0) {
      this.newService.subservices = this.newSubservice;
  
      // Llamada al servicio para crear el nuevo servicio en el backend
      this.servicesService.addNewService(this.newService).subscribe({
        next: (response) => {
          this.toastr.success('Servicios y subservicios añadidos con éxito')
          //console.log('Servicio creado exitosamente:', response);
          // Reiniciar el formulario después de la creación exitosa
          this.newService = { name: '', subservices: [] };
          this.newSubservice = [];
          this.loadAllServices(this.currentPage); // Recargar la lista de servicios
        },
        error: (err) => {
          this.toastr.error('No se pudo crear el servicio y subservicio')
          console.error('Error creando el servicio:', err);
        }
      });
    }else{
    this.toastr.error('Por favor rellene todos los campos')
  }
  }


  deleteSelected(): void {
    const selectedServices = this.AllServices.filter(service => service.selected);
  
    if (selectedServices.length === 0) {
      this.toastr.error('No hay servicios seleccionados para eliminar');
      return;
    }
  
    // Confirmar eliminación a través del modal
    selectedServices.forEach(service => {
      this.servicesService.deleteServiceWithSubservice(service.id_service).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Servicio y subservicios eliminados con éxito');
          } else {
            this.toastr.error('Error al eliminar el servicio');
          }
        },
        error: (err) => {
          this.toastr.error('Error al eliminar el servicio');
          console.error('Error eliminando el servicio:', err);
        },
        complete: () => {
          // Después de eliminar, recargar la lista de servicios
          this.loadAllServices(this.currentPage);
        }
      });
    });
  }
  updateService(): void {
    if (this.selectedService.service_name.trim() === '') {
      this.toastr.error('El nombre del servicio no puede estar vacío');
      return;
    }
  
    const updatedService = {
      name: this.selectedService.service_name,  // Cambia a 'name' para coincidir con el backend
    };
  
    this.servicesService.updateService(this.selectedService.id_service, updatedService).subscribe({
      next: (response) => {
        this.toastr.success('Servicio actualizado con éxito');
        this.loadAllServices(this.currentPage);  // Recargar la lista de servicios
      },
      error: (err) => {
        console.error('Error actualizando el servicio:', err);
        this.toastr.error('Error al actualizar el servicio');
      }
    });
  }


  updateSubService(): void {


    if(this.subservicesAsText.trim() ==="" || this.subservicesAsText === ""){
      this.toastr.error('Error, Introduzca al meno un subservicio')
      return
    }
    // Convertir el texto del textarea en un arreglo de subservicios
    this.selectedSubServices = this.subservicesAsText.split(',').map(subservice => subservice.trim()).filter(subservice => subservice.length > 0);
    
    const updatedService = {
      subservices: this.selectedSubServices  // Enviar la lista de subservicios actualizada
    };
    
    // Asegurarse de que el id_service esté presente
    if (!this.selectedService.id_service) {
      this.toastr.error('No se pudo actualizar los subservicios porque falta el ID del servicio');
      return;
    }
  
    // Llamada al servicio para actualizar los subservicios
    this.servicesService.updateSubservices(this.selectedService.id_service, updatedService).subscribe({
      next: (response) => {
        this.toastr.success('Subservicios actualizados con éxito');
        this.loadAllServices(this.currentPage);  // Recargar la lista de servicios
      },
      error: (err) => {
        this.toastr.error('Error al actualizar los subservicios');
        console.error('Error actualizando los subservicios:', err);
      }
    });
  }
  
}
