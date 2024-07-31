import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  loadAllSalon(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseUrl}/home/getAllSalon`, { params });
  }
}
