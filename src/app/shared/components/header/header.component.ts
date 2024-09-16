import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/AuthService.service';
import { HeaderService } from '../../../core/service/header.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userImagePath: string = '';
  id_user: string | null = localStorage.getItem('usuarioId');

  constructor(private authService: AuthService,private headerService:HeaderService) { }


  
  ngOnInit(): void {
    if (this.id_user) {  // Verificamos que id_user no sea null
      this.getImgUser(this.id_user);
    } else {
      console.error('El usuarioId no está disponible en localStorage');
    }
    console.log(this.userImagePath); // Esto se ejecutará antes de que la imagen se cargue
  }



  ngAfterViewInit() {
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

  getImgUser(id_user: string): void {
    this.headerService.getImgUser(id_user).subscribe(
      (response: any) => {
        // Accedemos al primer objeto en el array data y obtenemos el path de la imagen
        if (response.data && response.data.length > 0) {
          this.userImagePath = response.data[0].avatar_path;
         // console.log('Path de la imagen:', this.userImagePath); // Verificar el path recibido
        } else {
          console.error('No se encontró la imagen en la respuesta.');
          this.userImagePath = '../../../../assets/img/sello.jpg'; // Imagen predeterminada
        }
      },
      (error) => {
        console.error('Error al obtener la imagen del usuario:', error);
        this.userImagePath = '../../../../assets/img/sello.jpg'; // Imagen predeterminada en caso de error
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }






}
