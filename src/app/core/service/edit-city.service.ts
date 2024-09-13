import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})


export class EditCityService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }


  getCityById(id_city: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edit-city/getCityById`, {
      params: {
        id_city
      },
    });;
  }

  updateCity(cityData: any): Observable<any> {
    const id_city = cityData.id_city; 
    return this.http.put(`${this.baseUrl}/edit-city/updateCity/${id_city}`, cityData);
  }

  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/edit-city/getProvinces`);
  }
}
