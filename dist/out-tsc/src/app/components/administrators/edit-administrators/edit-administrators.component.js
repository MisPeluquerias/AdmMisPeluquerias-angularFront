import { __decorate } from "tslib";
import { Component } from '@angular/core';
let EditAdministratorsComponent = class EditAdministratorsComponent {
    constructor(editAdmistratorsService, toastr, route) {
        this.editAdmistratorsService = editAdmistratorsService;
        this.toastr = toastr;
        this.route = route;
        this.adminData = [];
        this.cities = [];
        this.provinces = [];
        this.userData = [];
    }
    ngOnInit() {
        const id_user = this.route.snapshot.paramMap.get('id');
        if (id_user) {
            this.getAdminData(+id_user); // Convierte id_user a número antes de pasar
        }
        else {
            console.error('No id_user found in the URL');
        }
        this.getProvinces();
    }
    getAdminData(id_user) {
        this.editAdmistratorsService.getAdminById(id_user).subscribe((response) => {
            this.adminData = response.data;
            console.log(this.adminData); // Asegúrate de que response.data contiene los datos correctos
            if (this.adminData.id_province) {
                this.getCities(this.adminData.id_province, true); // Asegúrate de que se cargan las ciudades primero
            }
        }, (error) => {
            console.error('Error fetching client data:', error);
        });
    }
    updateAdmin() {
        if (this.adminData.password !== this.adminData.confirmPassword) {
            this.toastr.error('Las contraseñas no coinciden');
            return;
        }
        this.editAdmistratorsService.updateAdmin(this.adminData).subscribe((response) => {
            console.log('Administrador actualizado exitosamente', response);
            this.toastr.success('Cambios realizados con éxito');
        }, (error) => {
            console.error('Error al actualizar el Administrador', error);
            this.toastr.error('No se realizaron los cambios');
        });
    }
    getProvinces() {
        this.editAdmistratorsService.getProvinces().subscribe((response) => {
            this.provinces = response.data;
        }, (error) => {
            console.error('Error fetching provinces:', error);
        });
    }
    onProvinceChange(eventOrProvinceId) {
        let provinceId;
        if (typeof eventOrProvinceId === 'number') {
            provinceId = eventOrProvinceId;
        }
        else if (eventOrProvinceId && eventOrProvinceId.target) {
            const target = eventOrProvinceId.target;
            provinceId = Number(target.value);
        }
        else {
            console.error('Event o target es undefined en onProvinceChange');
            return;
        }
        if (!isNaN(provinceId) && provinceId > 0) {
            this.getCities(provinceId); // No reinicies el id_city aquí
        }
        else {
            this.cities = [];
        }
    }
    getCities(provinceId, initialLoad = false) {
        this.editAdmistratorsService.getCitiesByProvince(provinceId).subscribe((response) => {
            this.cities = response.data;
            if (this.cities.length > 0) {
                if (initialLoad && this.adminData.id_city) {
                    const selectedCity = this.cities.find(city => city.id_city === this.adminData.id_city);
                    if (selectedCity) {
                        this.adminData.id_city = selectedCity.id_city; // Asegura que el id_city se mantiene
                    }
                }
                else if (!this.adminData.id_city) {
                    this.adminData.id_city = this.cities[0].id_city; // Selecciona la primera ciudad si no hay una preseleccionada
                }
            }
            else {
                this.adminData.id_city = ''; // Resetea si no hay ciudades
            }
        }, (error) => {
            console.error('Error fetching cities:', error);
        });
    }
    onCityChange(cityId) {
        const selectedCity = this.cities.find((city) => city.id_city === cityId);
        if (selectedCity) {
            this.userData.city_name = selectedCity.city_name;
            this.adminData.id_city = selectedCity.id_city;
        }
    }
};
EditAdministratorsComponent = __decorate([
    Component({
        selector: 'app-edit-administrators',
        templateUrl: './edit-administrators.component.html',
        styleUrl: './edit-administrators.component.scss'
    })
], EditAdministratorsComponent);
export { EditAdministratorsComponent };
//# sourceMappingURL=edit-administrators.component.js.map