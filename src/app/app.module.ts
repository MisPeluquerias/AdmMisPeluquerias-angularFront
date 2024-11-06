import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MatBadgeModule } from '@angular/material/badge';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AsideComponent } from './shared/components/aside/aside.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
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
import { SpanishDatePipe } from './shared/pipes/spanish-date.pipe';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EditHomeComponent } from './components/home/edit-home/edit-home.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { SearchTablePipe } from './shared/pipes/search-table.pipe';
import { NewHomeComponent } from './components/home/new-home/new-home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { NewClientComponent } from './components/clients/new-client/new-client.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { EditAdministratorsComponent } from './components/administrators/edit-administrators/edit-administrators.component';
import { OwnerSalonComponent } from './components/owner-salon/owner-salon.component';
import { EditOwnerComponent } from './components/owner-salon/edit-owner/edit-owner.component';
import { EditCityComponent } from './components/cities/edit-city/edit-city.component';
import { BrandsComponent } from './components/brands/brands.component';
import { CategoriesJobsComponent } from './components/categories-jobs/categories-jobs.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AsideComponent,
    LoginComponent,
    ClientsComponent,
    CitiesComponent,
    CategoriesComponent,
    ExportComponent,
    ImportComponent,
    AdministratorsComponent,
    ContactComponent,
    ContactProffesionalComponent,
    ReclamationsComponent,
    ServicesComponent,
    SpanishDatePipe,
    EditHomeComponent,
    SearchTablePipe,
    NewHomeComponent,
    ProfileComponent,
    FilterPipe,
    NewClientComponent,
    EditClientComponent,
    EditAdministratorsComponent,
    OwnerSalonComponent,
    EditOwnerComponent,
    EditCityComponent,
    BrandsComponent,
    CategoriesJobsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatBadgeModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-center-center',
      enableHtml: true,
      preventDuplicates: true,
      timeOut: 5000
    }),
  ],
  
  providers: [
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
