import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient,HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class EditHomeService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  getSalonById(id_salon: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edithome/getSalonById`, {
      params: {
        id_salon
      },
    });;
  }
  updateSalon(salonData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edithome/updateSalon`, salonData);
  }

  getCitiesByProvince(id_province: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/edithome/getCitiesByProvince`, {
      params: { id_province: id_province.toString() }
    });
  }

  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/edithome/getProvinces`);
  }

}
