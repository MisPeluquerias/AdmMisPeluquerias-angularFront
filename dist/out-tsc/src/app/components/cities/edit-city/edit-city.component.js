import { __decorate } from "tslib";
import { Component } from '@angular/core';
let EditCityComponent = class EditCityComponent {
    constructor(editCityService, toastr, route) {
        this.editCityService = editCityService;
        this.toastr = toastr;
        this.route = route;
        this.cityData = [];
        this.cities = [];
        this.provinces = [];
    }
    ngOnInit() {
        const id_city = this.route.snapshot.paramMap.get('id');
        if (id_city) {
            this.getCityDataById(+id_city); // Convierte id_user a número antes de pasar
        }
        else {
            console.error('No id_user found in the URL');
        }
        this.getProvinces();
    }
    updateCity() {
        this.editCityService.updateCity(this.cityData).subscribe((response) => {
            console.log('Administrador actualizado exitosamente', response);
            this.toastr.success('Cambios realizados con éxito');
        }, (error) => {
            console.error('Error al actualizar el Administrador', error);
            this.toastr.error('No se realizaron los cambios');
        });
    }
    getCityDataById(id_city) {
        this.editCityService.getCityById(id_city).subscribe((response) => {
            this.cityData = response.data;
            console.log('Datos de la ciudad obtenidos con éxito', this.cityData);
        }, (error) => {
            console.error('Error al obtener los datos de la ciudad', error);
            this.toastr.error('No se pudo obtener los datos de la ciudad');
        });
    }
    getProvinces() {
        this.editCityService.getProvinces().subscribe((response) => {
            this.provinces = response.data;
        }, (error) => {
            console.error('Error fetching provinces:', error);
        });
    }
};
EditCityComponent = __decorate([
    Component({
        selector: 'app-edit-city',
        templateUrl: './edit-city.component.html',
        styleUrl: './edit-city.component.scss'
    })
], EditCityComponent);
export { EditCityComponent };
//# sourceMappingURL=edit-city.component.js.map