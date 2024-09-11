import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class EditAdministratorService {

  baseUrl: string = environment.baseUrl;
  constructor(private http:HttpClient) { }


  getAdminById(id_user: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edit-admin/getAdminById`, {
      params: {
        id_user
      },
    });;
  }

  updateAdmin(adminData: any): Observable<any> {
    const id_user = adminData.id_user; 
    return this.http.put(`${this.baseUrl}/edit-admin/updateAdmin/${id_user}`, adminData);
  }

  getCitiesByProvince(id_province: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/edit-admin/getCitiesByProvinceForEditAdmin`, {
      params: { id_province: id_province.toString() }
    });
  }

  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/edit-admin/getProvinces`);
  }
}
