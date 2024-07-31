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

  loadAllCategories(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseUrl}/categories/getAllCategories`, { params });
  }
}
