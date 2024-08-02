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



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent,title:'Adm | Mis Peluquerias' },
  { path: 'home/edit/:id', component: EditHomeComponent,title:'Adm | Mis Peluquerias' },
  { path: 'clients', component: ClientsComponent,title:'Adm | Mis Peluquerias' },
  { path: 'administrators', component: AdministratorsComponent,title:'Adm | Mis Peluquerias' },
  { path: 'cities', component: CitiesComponent,title:'Adm | Mis Peluquerias' },
  { path: 'categories', component: CategoriesComponent,title:'Adm | Mis Peluquerias'},
  { path: 'contact', component: ContactComponent, title:'Adm | Mis Peluquerias'},
  { path: 'contact-proffesional', component: ContactProffesionalComponent, title:'Adm | Mis Peluquerias'},
  { path: 'services', component:ServicesComponent, title:'Adm | Mis Peluquerias'},
  { path: 'reclamations', component: ReclamationsComponent, title:'Adm | Mis Peluquerias'},
  { path: 'export', component: ExportComponent, title:'Adm | Mis Peluquerias'},
  { path: 'import', component: ImportComponent, title:'Adm | Mis Peluquerias'},
  { path: '**', component:LoginComponent }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
