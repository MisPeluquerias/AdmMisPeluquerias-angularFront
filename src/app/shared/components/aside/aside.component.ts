import { Component, OnInit } from '@angular/core';
import { AsideService } from './../../../core/service/aside.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {
  id_user: any = '';
  userName: string = '';
  salonPermiso: string = '';
  mostrarNegocios: boolean = false;

  constructor(private asideService: AsideService) {}

  ngOnInit(): void {
    this.id_user = localStorage.getItem('usuarioId');
    if (this.id_user) {
      this.getUserName();
    } else {
      console.log('No userId found in localStorage');
    }

    // Verifica el permiso
    this.asideService.getUserPermiso().subscribe(
      (response: any) => {
        //console.log('Permiso recibido:', response.permiso);
        if (response.permiso === 'salon') {
          this.salonPermiso = 'salon';
          this.mostrarNegocios = true;
          //console.log('mostrarNegocios se establece en true');
        } else if (response.permiso === 'admin') {
          this.salonPermiso = 'admin';
          this.mostrarNegocios = true;
          //console.log('mostrarNegocios se establece en true');
        } else {
          this.mostrarNegocios = false;
          //console.log('mostrarNegocios se establece en false');
        }
      },
      (error) => {
        console.log('Error fetching permiso:', error);
      }
    );
  }

  getUserName(): void {
    this.asideService.getUserName(this.id_user).subscribe(
      (response: any) => {
        if (response && response.success) {
          if (response.data && response.data.length > 0) {
            this.userName = response.data[0].name;
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
