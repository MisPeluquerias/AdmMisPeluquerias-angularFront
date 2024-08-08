import { Injectable } from '@angular/core';
import {HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }


  loadAllReclamation(page: number, pageSize: number, searchText:string): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (searchText) {
    params = params.set('search', searchText);
  }
    return this.http.get<any>(`${this.baseUrl}/reclamations/getAllReclamations`, { params });
  }
}
