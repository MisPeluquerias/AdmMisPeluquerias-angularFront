import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditHomeService } from '../../../core/service/edit-home.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.component.html',
  styleUrl: './new-home.component.scss'
})
export class NewHomeComponent {


  salonId: number = 0;
  salonData: any = {
    id_salon: '',
    id_city: '',
    id_province: '',
    plus_code: '',
    active: '1',
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
  };

  provinces: any[] = [];
  cities: any[] = [];
  dias: any[] = [];

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
        }
      },
      (error) => {
        console.error('Error fetching provinces:', error);
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }






}
