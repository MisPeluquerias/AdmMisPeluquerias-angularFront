import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient,HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  loadAllCategories(page: number, pageSize: number, searchText: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchText) {
      params = params.set('search', searchText);
    }

    return this.http.get<any>(`${this.baseUrl}/categories/getAllCategories`, { params });
  }

  addCategory(id_salon: number, category: string, destacado: number = 0, active: number = 1): Observable<any> {
    const body = { id_salon:-1, category, destacado, active };
    return this.http.post<any>(`${this.baseUrl}/categories/addCategory`, body);
  }
}
