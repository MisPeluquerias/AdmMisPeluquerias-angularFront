import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient,HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  loadContactMenssage(page: number, pageSize: number,searchText:string): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (searchText) {
    params = params.set('search', searchText);
  }

    return this.http.get<any>(`${this.baseUrl}/contact/getAllMessageContact`, { params });
  }
}