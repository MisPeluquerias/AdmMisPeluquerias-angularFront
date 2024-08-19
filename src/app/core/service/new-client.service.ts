import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewClientService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }



  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/new-client/getProvincesForNewClient`);
  }

  getCitiesByProvince(id_province: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/new-client/getCitiesByProvinceForNewClient`, {
      params: { id_province: id_province.toString() }
    });
  }

  uploadProfilePicture(id_user: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/new-client/uploadProfilePicture/${id_user}`, formData);
  }
  addNewClient(userData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/new-client/updateUser`, userData);
  }
}




