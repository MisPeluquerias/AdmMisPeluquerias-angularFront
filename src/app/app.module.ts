import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
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
    ContactProffesionalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
