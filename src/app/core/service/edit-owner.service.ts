import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EditOwnerService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  getOwnerById(id_user: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edit-owner/getOwnerById`, {
      params: {
        id_user
      },
    });;
  }

  updateOwner(clientData: any): Observable<any> {
    const id_user = clientData.id_user; 
    return this.http.put(`${this.baseUrl}/edit-owner/updateOwner/${id_user}`, clientData);
  }

  getCitiesByProvince(id_province: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/edit-owner/getCitiesByProvinceForEditOwner`, {
      params: { id_province: id_province.toString() }
    });
  }


  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/edit-owner/getProvinces`);
  }

  getSalonOwnerById(id_user: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/edit-owner/getSalonOwnerById`, {
      params: { id_user: id_user.toString() },
    });
  }

  deleteSalonById(id_salon:any):Observable<any>{
    return this.http.get(`${this.baseUrl}/edit-owner/deleteSalonById`, {
      params: { id_user: id_salon.toString() },
    });
  }
}
