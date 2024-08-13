import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { ClientsComponent } from './components/clients/clients.component';
import { CitiesComponent } from './components/cities/cities.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ExportComponent } from './components/export/export.component';
import { ImportComponent } from './components/import/import.component';
import { AdministratorsComponent } from './components/administrators/administrators.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactProffesionalComponent } from './components/contact-proffesional/contact-proffesional.component';
import { ReclamationsComponent } from './components/reclamations/reclamations.component';
import { ServicesComponent } from './components/services/services.component';
import { EditHomeComponent } from './components/home/edit-home/edit-home.component';
import { NewHomeComponent } from './components/home/new-home/new-home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent,
    canActivate:[AuthGuard],title:'Adm | Mis Peluquerias' },
  { path: 'home/edit/:id', component: EditHomeComponent,
    canActivate:[AuthGuard],title:'Adm | Mis Peluquerias' },
  { path: 'clients', component: ClientsComponent,
    canActivate:[AuthGuard],title:'Adm | Mis Peluquerias' },
  { path: 'administrators', component: AdministratorsComponent,
    canActivate:[AuthGuard],title:'Adm | Mis Peluquerias' },
  { path: 'cities', component: CitiesComponent,
    canActivate:[AuthGuard],title:'Adm | Mis Peluquerias' },
  { path: 'categories', component: CategoriesComponent,
    canActivate:[AuthGuard],title:'Adm | Mis Peluquerias'},
  { path: 'contact', component: ContactComponent,
    canActivate:[AuthGuard], title:'Adm | Mis Peluquerias'},
  { path: 'contact-proffesional', component: ContactProffesionalComponent,
    canActivate:[AuthGuard], title:'Adm | Mis Peluquerias'},
  { path: 'services', component:ServicesComponent,
    canActivate:[AuthGuard],title:'Adm | Mis Peluquerias'},
  { path: 'reclamations', component: ReclamationsComponent,
    canActivate:[AuthGuard], title:'Adm | Mis Peluquerias'},
  { path: 'export', component: ExportComponent,
    canActivate:[AuthGuard], title:'Adm | Mis Peluquerias'},
  { path: 'import', component: ImportComponent,
    canActivate:[AuthGuard],title:'Adm | Mis Peluquerias'},
  { path: 'new-home', component: NewHomeComponent,
    canActivate:[AuthGuard], title:'Adm | Mis Peluquerias'},
    { path: 'profile', component:ProfileComponent,
      canActivate:[AuthGuard], title:'Adm | Mis Peluquerias'},


  { path: '**', component:LoginComponent }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
