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
    const permiso = localStorage.getItem('permiso') || '';
    const usuarioId =localStorage.getItem('usuarioId') || '';
    
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

    params = params.set('permiso', permiso);
    params = params.set('usuarioId',usuarioId);

    return this.http.get<any>(`${this.baseUrl}/home/getAllSalon`, { params });
  }

  getUserPermiso(): Observable<any> {
    const permiso = localStorage.getItem('permiso');
    return this.http.get(`${this.baseUrl}/decode-permiso/permiso-aside`, {
      params: { permiso: permiso || ''}
    });
  }
}
