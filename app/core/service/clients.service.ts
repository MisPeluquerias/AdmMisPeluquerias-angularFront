import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  loadAllClients(page: number, pageSize: number, searchText:string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchText) {
      params = params.set('search', searchText);
    }

    return this.http.get<any>(`${this.baseUrl}/clients/getAllClients`, { params });
  }
}
