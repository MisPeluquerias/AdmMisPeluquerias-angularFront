import { __decorate } from "tslib";
import { Component } from '@angular/core';
let HeaderComponent = class HeaderComponent {
    constructor(authService, headerService) {
        this.authService = authService;
        this.headerService = headerService;
        this.userImagePath = '';
        this.id_user = localStorage.getItem('usuarioId');
    }
    ngOnInit() {
        if (this.id_user) { // Verificamos que id_user no sea null
            this.getImgUser(this.id_user);
        }
        else {
            console.error('El usuarioId no está disponible en localStorage');
        }
        console.log(this.userImagePath); // Esto se ejecutará antes de que la imagen se cargue
    }
    ngAfterViewInit() {
        //console.log('ngAfterViewInit ejecutado'); // Verifica si se está llamando
        try {
            const sidebarToggle = document.querySelector('#sidebarToggle');
            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', (event) => {
                    event.preventDefault();
                    //console.log('Sidebar toggle clickeado'); // Verifica si se está llamando
                    document.body.classList.toggle('sb-sidenav-toggled');
                    localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled').toString());
                });
            }
            else {
                console.log('Elemento #sidebarToggle no encontrado');
            }
        }
        catch (error) {
            console.log('Error al inicializar el toggle de la barra lateral:', error);
        }
    }
    getImgUser(id_user) {
        this.headerService.getImgUser(id_user).subscribe((response) => {
            // Accedemos al primer objeto en el array data y obtenemos el path de la imagen
            if (response.data && response.data.length > 0) {
                this.userImagePath = response.data[0].avatar_path;
                // console.log('Path de la imagen:', this.userImagePath); // Verificar el path recibido
            }
            else {
                console.error('No se encontró la imagen en la respuesta.');
                this.userImagePath = '../../../../assets/img/sello.jpg'; // Imagen predeterminada
            }
        }, (error) => {
            console.error('Error al obtener la imagen del usuario:', error);
            this.userImagePath = '../../../../assets/img/sello.jpg'; // Imagen predeterminada en caso de error
        });
    }
    logout() {
        this.authService.logout();
    }
};
HeaderComponent = __decorate([
    Component({
        selector: 'app-header',
        templateUrl: './header.component.html',
        styleUrl: './header.component.scss'
    })
], HeaderComponent);
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map