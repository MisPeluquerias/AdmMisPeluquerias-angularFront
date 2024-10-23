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

  loadContacProffesionaltMenssage(page: number, pageSize: number, searchText:string,filterState: string = ''): Observable<any> {
    
    let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (searchText) {
    params = params.set('search', searchText);
  }

  if (filterState) {
    params = params.set('filterState', filterState);
  }

    return this.http.get<any>(`${this.baseUrl}/contact-proffesional/getAllMessageContactProffesional`, { params });
  }

  updateStateContactProffesional(id_contact:number,state:string): Observable<any> {
    const data = {
      id_contact: id_contact,
      state: state
    };
    console.log(data);
    return this.http.put<any>(`${this.baseUrl}/contact-proffesional/updateStateContactProffesional`, data);
  }

  sendEmailContactProffesional(id_contact:string, to: string, subject: string, message: string, replyMessage:string): Observable<any> {
    const emailData = {id_contact, to, subject, message,replyMessage };
    return this.http.post<any>(`${this.baseUrl}/contact-proffesional/send-reply-contactProffesional`, emailData); // Asegúrate de que esta URL coincida con tu backend
  }
  sendNewEmailContactProffesional( to: string, subject: string, message: string): Observable<any> {
    const emailData = {to, subject, message };
    return this.http.post<any>(`${this.baseUrl}/contact-proffesional/send-new-email-contactProffesional`, emailData); // Asegúrate de que esta URL coincida con tu backend
  }
}
