import { __decorate } from "tslib";
import { Component } from '@angular/core';
let EditClientComponent = class EditClientComponent {
    constructor(editClientService, toastr, route) {
        this.editClientService = editClientService;
        this.toastr = toastr;
        this.route = route;
        this.userData = {};
        this.provinces = [];
        this.cities = [];
        this.clientData = [];
    }
    ngOnInit() {
        const id_user = this.route.snapshot.paramMap.get('id');
        if (id_user) {
            this.getClientData(+id_user); // Convierte id_user a número antes de pasar
        }
        else {
            console.error('No id_user found in the URL');
        }
        this.getProvinces();
    }
    updateClient() {
        this.editClientService.updateClient(this.clientData).subscribe((response) => {
            console.log('Cliente actualizado exitosamente', response);
            this.toastr.success('Cambios realizados con éxito');
        }, (error) => {
            console.error('Error al actualizar el cliente', error);
            this.toastr.error('No se realizaron los cambios');
        });
    }
    getClientData(id_user) {
        this.editClientService.getClientById(id_user).subscribe((response) => {
            this.clientData = response.data;
            console.log(this.clientData); // Asegúrate de que response.data contiene los datos correctos
            if (this.clientData.id_province) {
                this.getCities(this.clientData.id_province, true); // Asegúrate de que se cargan las ciudades primero
            }
        }, (error) => {
            console.error('Error fetching client data:', error);
        });
    }
    onFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 800 * 1024;
            if (file.size > maxSize) {
                this.toastr.error('El archivo excede el tamaño máximo permitido de 800 KB.');
                return;
            }
            const validFormats = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validFormats.includes(file.type)) {
                this.toastr.error('Formato de archivo no válido. Solo se permiten JPG, GIF o PNG.');
                return;
            }
            this.uploadProfilePicture(file);
        }
    }
    uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append('profilePicture', file);
        this.editClientService.uploadProfilePicture(this.userData.id_user, formData).subscribe((response) => {
            this.toastr.success('Foto de perfil actualizada exitosamente.');
            this.userData.profilePicture = response.imageUrl;
            window.location.reload(); // Asegúrate de que la respuesta contiene la URL de la imagen
        }, (error) => {
            console.error('Error al subir la foto de perfil', error);
            this.toastr.error('Error al subir la foto de perfil.');
        });
    }
    getProvinces() {
        this.editClientService.getProvinces().subscribe((response) => {
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
        this.editClientService.getCitiesByProvince(provinceId).subscribe((response) => {
            this.cities = response.data;
            if (this.cities.length > 0) {
                if (initialLoad && this.clientData.id_city) {
                    const selectedCity = this.cities.find(city => city.id_city === this.clientData.id_city);
                    if (selectedCity) {
                        this.clientData.id_city = selectedCity.id_city; // Asegura que el id_city se mantiene
                    }
                }
                else if (!this.clientData.id_city) {
                    this.clientData.id_city = this.cities[0].id_city; // Selecciona la primera ciudad si no hay una preseleccionada
                }
            }
            else {
                this.clientData.id_city = ''; // Resetea si no hay ciudades
            }
        }, (error) => {
            console.error('Error fetching cities:', error);
        });
    }
    onCityChange(cityId) {
        const selectedCity = this.cities.find((city) => city.id_city === cityId);
        if (selectedCity) {
            this.userData.city_name = selectedCity.city_name;
            this.clientData.id_city = selectedCity.id_city;
        }
    }
};
EditClientComponent = __decorate([
    Component({
        selector: 'app-edit-client',
        templateUrl: './edit-client.component.html',
        styleUrls: ['./edit-client.component.scss']
    })
], EditClientComponent);
export { EditClientComponent };
//# sourceMappingURL=edit-client.component.js.map