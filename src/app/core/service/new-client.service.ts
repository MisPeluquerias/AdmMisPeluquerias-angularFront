import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development'
import { Observable } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewClientService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }


  getClientById(id_salon: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edithome/getSalonById`, {
      params: {
        id_salon
      },
    });;
  }

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

  addNewClient(name: string,lastname:string,email:string,phone:string,address:string,id_province:string,id_city:string,dni:string,password:string): Observable<any> {
    console.log('Datos enviados al backend:', name);
    const body = {
      name: name,
      lastname:lastname,
      email:email,
      phone:phone,
      address:address,
      id_province:id_province,
      id_city:id_city,
      dni:dni,
      password:password
    };
    console.log('datos enviados al backend:',body);
    return this.http.post(`${this.baseUrl}/new-client/addNewClient`, body);
}
}



