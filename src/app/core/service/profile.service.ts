import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getDataUser(id_user: string): Observable<any> {
    const params = new HttpParams().set('id_user', id_user.toString());
    return this.http.get(`${this.baseUrl}/profile-user/getDataUser`, { params });
  }
  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile-user/getProvincesForProfile`);
  }

  getCitiesByProvince(id_province: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile-user/getCitiesByProvinceForProfile`, {
      params: { id_province: id_province.toString() }
    });
  }
}
