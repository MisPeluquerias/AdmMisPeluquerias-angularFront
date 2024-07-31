import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactProffesionalService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  loadContacProffesionaltMenssage(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseUrl}/contact-proffesional/getAllMessageContactProffesional`, { params });
  }


}
