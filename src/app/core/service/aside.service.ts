import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpParams,HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsideService {

  baseUrl: string = environment.baseUrl;


  constructor(private http :HttpClient) { }

  getUserName(id_user: string): Observable<any> {
    const params = new HttpParams().set('id_user', id_user.toString());
    return this.http.get(`${this.baseUrl}/aside/getUserName`, { params });
  }
}
