import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/AuthService.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private authService: AuthService) { }


  logout(): void {
    this.authService.logout();
  }

}
