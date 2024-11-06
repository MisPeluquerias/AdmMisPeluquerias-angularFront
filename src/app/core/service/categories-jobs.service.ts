import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CategoriesJobsService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

 loadAllCategoriesJobs(page: number, pageSize: number, searchText: string): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (searchText) {
    params = params.set('search', searchText);
  }

  return this.http.get<any>(`${this.baseUrl}/categories-jobs/getAllCategoriesJobs`, { params }).pipe(
    map((response => {
      // Mapea las categorías y convierte las subcategorías en una cadena separada por comas
      response.data = response.data.map((category: any) => ({
        ...category,
        subcategoriesText: category.subcategories.map((sub: any) => sub.name).join(', ')
      }));
      return response;
    })
  ));
}

  deleteCategoryJobs(categoryIds: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories-jobs/delete`, { categoryIds: categoryIds });
  }

  updateCategoryJobs(categoryJob: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories-jobs/updateCategoryJob/${categoryJob.id}`, categoryJob);
  }

  updateSubCategories(id_category: number, updatedCategory: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories-jobs/updateSubcategories/${id_category}`, updatedCategory);
  }

  addCategorySubcategoryJob(data: any): Observable<any> {
    console.log('Datos enviados en el servicio:', data);
    return this.http.post<any>(`${this.baseUrl}/categories-jobs/addCategoryWithSubcategoriesJobs`, data);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories-jobs/getCategories`);
  }
}
