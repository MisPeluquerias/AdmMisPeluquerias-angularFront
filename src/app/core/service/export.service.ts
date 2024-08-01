import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  loadAllSalonToExport(page: number, pageSize: number,searchText:string ): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (searchText) {
    params = params.set('search', searchText);
  }

    return this.http.get<any>(`${this.baseUrl}/export/getAllSalon`, { params });
  }


  exportSalonsToExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/exportSalonsToExcel`, { responseType: 'blob' });
  }


}
