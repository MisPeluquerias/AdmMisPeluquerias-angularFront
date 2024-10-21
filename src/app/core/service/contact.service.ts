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

  loadContactMenssage(page: number, pageSize: number,searchText:string,filterState: string = ''): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (searchText) {
    params = params.set('search', searchText);
  }

  if (filterState) {
    params = params.set('filterState', filterState);
  }
  
    return this.http.get<any>(`${this.baseUrl}/contact/getAllMessageContact`, { params });
  }

  updateStateContact(id_contact:number,state:string): Observable<any> {
    const data = {
      id_contact: id_contact,
      state: state
    };
    return this.http.put<any>(`${this.baseUrl}/contact/updateStateContact`, data);
  }

  sendEmailContact(id_contact:number,to: string, subject: string, message: string,replyMessage:string): Observable<any> {
    const emailData = {id_contact, to, subject, message,replyMessage };
    return this.http.post<any>(`${this.baseUrl}/contact/send-reply-contact`, emailData); // Asegúrate de que esta URL coincida con tu backend
  }
}
