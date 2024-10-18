import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient,HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  loadAllBrands(page: number, pageSize: number, searchText: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchText) {
      params = params.set('search', searchText);
    }
    return this.http.get<any>(`${this.baseUrl}/brands/getAllBrands`, { params });
  }


  addBrand(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/brands/addBrand`, formData);
  }
  
  
  updateBrand(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/brands/updateBrand/${id}`, data);
  }

  deleteBrand(id_brand: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/brands/deleteBrand`, { id_brand: id_brand });
  }

  getCategoryInLive(category: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/brands/searchCategoryInLive`,
      {
        params: {
          category,
        },
      }
    );
  }
}
