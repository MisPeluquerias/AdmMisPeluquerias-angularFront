import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient,HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ImportService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }


  loadAllSalonToExport(page: number, pageSize: number, searchText:string): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (searchText) {
    params = params.set('search', searchText);
  }

    return this.http.get<any>(`${this.baseUrl}/import/getAllSalon`, { params });
  }

  importUpdateExcel(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<Blob>(`${this.baseUrl}/import/updateExcel`, formData, { responseType: 'blob' as 'json' });
  }


  uploadNewSalons(file: File): Observable<any> { // Cambié el tipo de retorno a `any` para manejar el JSON
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(`${this.baseUrl}/import/addExcel`, formData);
  }

  downloadTemplateExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/import/downloadExcel`, { responseType: 'blob' });
  }
}
