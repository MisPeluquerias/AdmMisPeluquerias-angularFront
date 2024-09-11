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


  loadAllSalon(page: number, pageSize: number, searchText: string, filterState: string = '', filterActive: boolean = false): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    if (searchText) {
      params = params.set('search', searchText);
    }
  
    if (filterState) {
      params = params.set('filterState', filterState);
    }
  
    params = params.set('filterActive', filterActive.toString());
  
    return this.http.get<any>(`${this.baseUrl}/home/getAllSalon`, { params });
  }
}
