import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditClientService {

  baseUrl: string = environment.baseUrl;
  
  constructor(private http:HttpClient) { }


  getClientById(id_user: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edit-client/getClientById`, {
      params: {
        id_user
      },
    });;
  }

  updateClient(clientData: any): Observable<any> {
    const id_user = clientData.id_user; 
    return this.http.put(`${this.baseUrl}/edit-client/updateClient/${id_user}`, clientData);
  }


uploadProfilePicture(id_user: string, formData: FormData): Observable<any> {
  return this.http.put(`${this.baseUrl}/edit-client/uploadProfilePicture/${id_user}`, formData);
}

getCitiesByProvince(id_province: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/edit-client/getCitiesByProvinceForEditClient`, {
    params: { id_province: id_province.toString() }
  });
}
getProvinces(): Observable<any> {
  return this.http.get(`${this.baseUrl}/edit-client/getProvinces`);
}
}