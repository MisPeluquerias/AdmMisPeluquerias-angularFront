import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ProfileComponent = class ProfileComponent {
    constructor(profileService, toastr, router) {
        this.profileService = profileService;
        this.toastr = toastr;
        this.router = router;
        this.userData = {};
        this.id_user = '';
        this.errorMessage = '';
        this.cities = [];
        this.provinces = [];
        this.confirmPassword = '';
        this.password = '';
        this.isConfirmed = false;
    }
    ngOnInit() {
        const userId = localStorage.getItem('usuarioId');
        if (userId) {
            this.id_user = userId;
            this.userData.id_city = '';
            this.getDataUser();
            this.loadProvinces();
        }
    }
    getDataUser() {
        this.profileService.getDataUser(this.id_user).subscribe((data) => {
            if (Array.isArray(data.data) && data.data.length > 0) {
                this.userData = data.data[0];
                if (!this.userData.id_city) {
                    this.userData.id_city = '';
                }
                if (this.userData.id_province) {
                    this.loadCities(this.userData.id_province, true);
                }
            }
        }, (error) => {
            this.errorMessage = 'Error fetching user data';
            console.error('Error fetching user data:', error);
        });
    }
    loadProvinces() {
        this.profileService.getProvinces().subscribe((response) => {
            this.provinces = response.data;
            if (this.provinces.length > 0) {
                if (!this.userData.id_province) {
                    this.userData.id_province = this.provinces[0].id_province;
                    this.loadCities(this.userData.id_province); // Cargar ciudades de la primera provincia
                }
            }
        }, (error) => {
            console.error('Error fetching provinces:', error);
        });
    }
    loadCities(provinceId, initialLoad = false) {
        this.profileService.getCitiesByProvince(provinceId).subscribe((response) => {
            this.cities = response.data;
            if (this.cities.length > 0) {
                if (initialLoad && this.userData.id_city !== '') {
                    const selectedCity = this.cities.find(city => city.id_city === this.userData.id_city);
                    if (selectedCity) {
                        this.userData.city_name = selectedCity.city_name;
                    }
                }
                else {
                    this.userData.id_city = this.cities[0].id_city;
                    this.userData.city_name = this.cities[0].city_name;
                }
            }
        }, (error) => {
            console.error('Error fetching cities:', error);
        });
    }
    onProvinceChange(event) {
        const target = event.target;
        const provinceId = Number(target.value);
        if (provinceId) {
            this.loadCities(provinceId);
            this.userData.id_city = ''; // Resetear a "Seleccione una ciudad..." cuando cambia la provincia
        }
        else {
            this.cities = []; // Vaciar las ciudades si no hay provincia seleccionada
        }
    }
    onCityChange(cityId) {
        const selectedCity = this.cities.find((city) => city.id_city === cityId);
        if (selectedCity) {
            this.userData.city_name = selectedCity.city_name;
            this.userData.id_city = selectedCity.id_city;
        }
    }
    UpdateUserData() {
        if (!this.userData.name) {
            this.toastr.warning("Por favor, ingrese el nombre.");
            return;
        }
        if (!this.userData.lastname) {
            this.toastr.warning("Por favor, ingrese los apellidos.");
            return;
        }
        if (!this.userData.email) {
            this.toastr.warning("Por favor, ingrese el correo electrónico.");
            return;
        }
        if (!this.userData.phone) {
            this.toastr.warning("Por favor, ingrese el número de teléfono.");
            return;
        }
        if (!this.userData.address) {
            this.toastr.warning("Por favor, ingrese la dirección.");
            return;
        }
        if (!this.userData.id_province) {
            this.toastr.warning("Por favor, seleccione una provincia.");
            return;
        }
        if (!this.userData.id_city) {
            this.toastr.warning("Por favor, seleccione una población.");
            return;
        }
        console.log('Saving user data:', this.userData); // Imprime los datos del usuario a guardar
        this.profileService.updateUserData(this.userData).subscribe((response) => {
            this.toastr.success('<i class="las la-info-circle"> Datos actulizados con éxito</i>');
            console.log('User data saved successfully:', response); // Muestra la respuesta exitosa
            // Aquí puedes redirigir o mostrar un mensaje de éxito al usuario
        }, (error) => {
            console.error('Error saving user data:', error); // Muestra el error si la solicitud falla
            this.errorMessage = 'Error saving user data';
            this.toastr.error('<i class="las la-info-circle"> No se pudieron actualizar los datos</i>');
        });
    }
    changePassword() {
        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Las contraseñas no coinciden';
            this.toastr.error('<i class="las la-info-circle"> Las contraseñas no coinciden</i>'); // Mostrar mensaje de error (opcional)
            return;
        }
        if (!this.password || this.password.length < 6) {
            this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            this.toastr.error('<i class="las la-info-circle"> La contraseña debe tener al menos 6 caracteres</i>'); // Mostrar mensaje de error (opcional)
            return;
        }
        console.log(this.userData.id_user);
        // Si las contraseñas coinciden, procede a cambiarlas
        this.profileService.updateUserPassword(this.userData.id_user, this.password).subscribe(response => {
            console.log('Contraseña cambiada exitosamente', response);
            this.toastr.success('<i class="las la-info-circle"> Contraseña actualizada con éxito</i>'); // Mostrar mensaje de éxito (opcional)
            this.password = '';
            this.confirmPassword = '';
        }, error => {
            console.error('Error al cambiar la contraseña', error);
            this.toastr.error('<i class="las la-info-circle"> Error al cambiar la contraseña</i>');
            //console.log(this.userData.id_user);
        });
    }
    onFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
            // Validar tamaño máximo de 800 KB
            const maxSize = 800 * 1024;
            if (file.size > maxSize) {
                this.toastr.error('El archivo excede el tamaño máximo permitido de 800 KB.');
                return;
            }
            // Validar el formato del archivo
            const validFormats = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validFormats.includes(file.type)) {
                this.toastr.error('Formato de archivo no válido. Solo se permiten JPG, GIF o PNG.');
                return;
            }
            // Si pasa las validaciones, puedes continuar con la lógica de subida de imagen
            this.uploadProfilePicture(file);
        }
    }
    uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append('profilePicture', file);
        this.profileService.uploadProfilePicture(this.userData.id_user, formData).subscribe(response => {
            this.toastr.success('Foto de perfil actualizada exitosamente.');
            // Actualizar la foto de perfil en la interfaz del usuario
            this.userData.profilePicture = response.imageUrl;
            window.location.reload(); // Asegúrate de que la respuesta contiene la URL de la imagen
        }, error => {
            console.error('Error al subir la foto de perfil', error);
            this.toastr.error('Error al subir la foto de perfil.');
        });
    }
    desactivateAccount(userId) {
        if (this.isConfirmed) {
            this.profileService.desactivateAccount(userId).subscribe({
                next: (response) => {
                    console.log('Cuenta desactivada con éxito', response);
                    // Redirigir o actualizar la UI según lo necesario
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    console.error('Error al desactivar la cuenta', error);
                }
            });
        }
    }
};
ProfileComponent = __decorate([
    Component({
        selector: 'app-profile',
        templateUrl: './profile.component.html',
        styleUrls: ['./profile.component.scss']
    })
], ProfileComponent);
export { ProfileComponent };
//# sourceMappingURL=profile.component.js.map