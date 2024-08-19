import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  getImgUser(id_user: string): Observable<any> {
    const params = new HttpParams().set('id_user', id_user.toString());
    return this.http.get(`${this.baseUrl}/header/getImgUser`, { params });
  }
}