import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/AuthService.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private authService: AuthService) { }

  ngAfterViewInit() {
    // Código que depende del DOM debería ir aquí
    //console.log('ngAfterViewInit ejecutado'); // Verifica si se está llamando
    try {
      const sidebarToggle = document.querySelector('#sidebarToggle') as HTMLElement;
      if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (event: Event) => {
          event.preventDefault();
          //console.log('Sidebar toggle clickeado'); // Verifica si se está llamando
          document.body.classList.toggle('sb-sidenav-toggled');
          localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled').toString());
        });
      } else {
        console.log('Elemento #sidebarToggle no encontrado');
      }
    } catch (error) {
      console.log('Error al inicializar el toggle de la barra lateral:', error);
    }
  }


  logout(): void {
    this.authService.logout();
  }




}
