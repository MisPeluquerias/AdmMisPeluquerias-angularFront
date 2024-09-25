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

  addBrand(name: string): Observable<any> {
    const body = {name};
    return this.http.post<any>(`${this.baseUrl}/brands/addBrand`, body);
  }

  updateBrand(id_brand:number,name:string):Observable<any>{
    const body = {id_brand,name}
    return this.http.put<any>(`${this.baseUrl}/brands/updateBrand`, body);
  }

  deleteBrand(id_brand: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/brands/deleteBrand`, { id_brand: id_brand });
  }
}
