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

  addCategory(category: string): Observable<any> {
    const body = {category };
    return this.http.post<any>(`${this.baseUrl}/categories/addCategory`, body);
  }

  updateCategoryName(newCategory:string, OldCategory:string):Observable<any>{
    const body = {newCategory,OldCategory}
    return this.http.put<any>(`${this.baseUrl}/categories/updateCategory`, body);
  }
  deleteCategories(categoryNames: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories/delete`, { names: categoryNames });
  }
}
