import { AsideService } from './../../../core/service/aside.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {

  id_user: any = '';
  userName: any[] = [];
  name:string="";


constructor(private asideService:AsideService){}

ngOnInit(): void {
  this.id_user = localStorage.getItem('usuarioId');
  if (this.id_user) {
    this.getUserName();
  } else {
    console.log('No userId found in localStorage');

  }
}

getUserName(): void {
  this.asideService.getUserName(this.id_user).subscribe(
    (response) => {
      //console.log('Response completa:', response);  // Imprime toda la respuesta

      if (response && response.success) {
        if (response.data && response.data.length > 0) {
          this.userName = response.data[0].name;  // Accede al primer elemento del array y toma la propiedad 'name'
          //console.log('User Name:', this.userName);  // Verifica que el nombre del usuario se asigna correctamente
        } else {
          console.error('No user name found in response data');
        }
      } else {
        console.error('Error: ', response.message);
      }
    },
    (error) => {
      console.error('Error fetching user name:', error);
    }
  );
}
}
