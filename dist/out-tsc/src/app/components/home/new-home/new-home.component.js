import { __decorate } from "tslib";
import { Component } from "@angular/core";
let NewHomeComponent = class NewHomeComponent {
    constructor(route, newHomeService, toastr) {
        this.route = route;
        this.newHomeService = newHomeService;
        this.toastr = toastr;
        this.salonId = 0;
        this.salonData = {
            id_salon: "",
            id_city: "",
            id_province: "",
            plus_code: "",
            active: "1",
            state: "No reclamado",
            in_vacation: "",
            name: "",
            address: "",
            latitud: "",
            longitud: "",
            email: "",
            url: "",
            phone: "",
            map: "",
            iframe: "",
            image: "",
            about_us: "",
            score_old: "",
            hours_old: "Lunes, De 10:00 a 14:00, De 16:00 a 20:00; Martes, De 10:00 a 14:00, De 16:00 a 20:00; Miércoles, De 10:00 a 14:00, De 16:00 a 20:00; Jueves, De 10:00 a 14:00, De 16:00 a 20:00; Viernes, De 10:00 a 14:00, De 16:00 a 20:00; Sábado, De 10:00 a 14:00, Cerrado; Domingo, Cerrado, Cerrado",
            zip_code_old: "",
            overview_old: "",
            created_at: "",
            updated_at: "",
            deleted_at: "",
            categories: "",
            city_name: "",
            city_zip_code: "",
        };
        this.in_vacation = 0;
        this.provinces = [];
        this.cities = [];
        this.dias = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.selectedFile = null;
        this.images = [];
        this.fileDescription = "";
        this.fileGroup = "";
        this.filePrincipal = false;
        this.fileActive = true;
        this.currentImageUrl = "";
        this.currentImageAlt = "";
        this.isImageOpen = false;
    }
    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            const id = params.get("id");
            this.salonId = id ? +id : 0; // Convierte el ID a número, asegurándote de que es un valor válido
            this.loadProvinces();
            if (sessionStorage.getItem("salonCreated") === "true") {
                // Mostrar el toast de éxito
                this.toastr.success('<i class="las la-info-circle">Salón creado con éxito.</i>');
                // Eliminar el indicador para que no se muestre nuevamente
                sessionStorage.removeItem("salonCreated");
            }
        });
    }
    loadProvinces() {
        this.newHomeService.getProvinces().subscribe((response) => {
            this.provinces = response.data;
            if (this.salonId) {
            }
        }, (error) => {
            console.error("Error fetching provinces:", error);
        });
    }
    onProvinceChange(provinceId, initialLoad = false) {
        if (!initialLoad) {
            this.salonData.id_city = "";
            this.salonData.city_name = "";
        }
        this.newHomeService.getCitiesByProvince(provinceId).subscribe((response) => {
            this.cities = response.data;
            if (initialLoad && this.salonData.id_city) {
                const selectedCity = this.cities.find((city) => city.id_city === this.salonData.id_city);
                if (selectedCity) {
                    this.salonData.city_name = selectedCity.city_name;
                }
            }
        }, (error) => {
            console.error("Error fetching cities:", error);
        });
    }
    onCityChange(cityId) {
        const selectedCity = this.cities.find((city) => city.id_city === cityId);
        if (selectedCity) {
            this.salonData.city_name = selectedCity.city_name;
            this.salonData.id_city = selectedCity.id_city;
        }
    }
    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
    }
    createSalon(form) {
        this.salonData.in_vacation = "0"; // Valor inicial por defecto
        if (form.invalid) {
            form.control.markAllAsTouched();
            this.salonData.in_vacation = ""; // Si la validación falla, puedes manejar el estado como desees
            return;
        }
        this.newHomeService.createSalon(this.salonData).subscribe((response) => {
            console.log("Salon created successfully", response);
            // Guardar indicador en sessionStorage
            sessionStorage.setItem("salonCreated", "true");
            // Recargar la página
            window.location.reload();
        }, (error) => {
            console.error("Error creating salon", error);
            this.toastr.error('<i class="las la-info-circle">Error: Revise los campos del formulario.</i>');
            this.salonData.in_vacation = ""; // Manejo de errores si es necesario
        });
    }
};
NewHomeComponent = __decorate([
    Component({
        selector: "app-new-home",
        templateUrl: "./new-home.component.html",
        styleUrl: "./new-home.component.scss",
    })
], NewHomeComponent);
export { NewHomeComponent };
//# sourceMappingURL=new-home.component.js.map