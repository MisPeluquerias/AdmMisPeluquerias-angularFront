import { Injectable } from '@angular/core';
import {HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }


  loadAllReclamation(page: number, pageSize: number, searchText:string,filterState: string = ''): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (searchText) {
    params = params.set('search', searchText);

  }

  if (filterState) {
    params = params.set('filterState', filterState);
  }
  
    return this.http.get<any>(`${this.baseUrl}/reclamations/getAllReclamations`, { params });
  }
  
  updateStateReclamation(id_salon_reclamacion:number,id_user:string,salon_name:string,state:string,email:string): Observable<any> {    
    const data = {
      id_salon_reclamacion: id_salon_reclamacion,
      id_user :id_user,
      salon_name: salon_name,
      state: state,
      email: email
    };
    return this.http.put<any>(`${this.baseUrl}/reclamations/updateStateReclamation`, data);
  }

  deleteReclamations(id_salon_reclamacion: string[]): Observable<any> {
    const localUrl = `http://localhost:3900/salon-reclamation/delete`;
    const remoteUrl = `https://api.mispeluquerias.com/salon-reclamation/delete`;
  
    return this.http.post(localUrl, { id_salon_reclamacion: id_salon_reclamacion }).pipe(
      catchError((error) => {
        console.log('Eliminando reclamacion/es...');
        return this.http.post(remoteUrl, { id_salon_reclamacion: id_salon_reclamacion });
      })
    );
  }
}
