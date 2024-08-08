import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable,throwError } from 'rxjs';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})


export class EditHomeService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  getSalonById(id_salon: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edithome/getSalonById`, {
      params: {
        id_salon
      },
    });;
  }
  updateSalon(salonData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edithome/updateSalon`, salonData);
  }
}
