import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
let HeaderComponent = class HeaderComponent {
    constructor(authService, headerService) {
        this.authService = authService;
        this.headerService = headerService;
        this.userImagePath = '';
        this.id_user = localStorage.getItem('usuarioId');
        this.alertCount = 0;
        this.notifications = [];
    }
    ngOnInit() {
        if (this.id_user) { // Verificamos que id_user no sea null
            this.getImgUser(this.id_user);
        }
        else {
            console.error('El usuarioId no está disponible en localStorage');
        }
        this.socket = io(environment.socketUrl);
        // Escucha de eventos de nueva alerta
        this.socket.on('new-alert', (data) => {
            //console.log('Nueva alerta recibida:', data);
            this.getAlertCount();
            this.getNotifications();
        });
        console.log(this.userImagePath); // Esto se ejecutará antes de que la imagen se cargue
        this.getAlertCount();
        this.getNotifications();
    }
    getAlertCount() {
        this.headerService.getAlertCount().subscribe({
            next: (data) => {
                this.alertCount = data.total;
            },
            error: (err) => {
                console.error('Error al obtener el total de alertas:', err);
            }
        });
    }
    getNotifications() {
        this.headerService.getAllNotifications().subscribe({
            next: (data) => {
                this.notifications = data;
            },
            error: (err) => {
                console.error('Error al obtener las notificaciones:', err);
            }
        });
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
    removeNotification(id_alert_admin) {
        console.log(id_alert_admin);
        this.headerService.deleteNotification(id_alert_admin).subscribe({
            next: (data) => {
                this.notifications = data;
                this.getAlertCount();
                this.getNotifications();
            },
            error: (err) => {
                console.error('Error al eliminar la notificación:', err);
            }
        });
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