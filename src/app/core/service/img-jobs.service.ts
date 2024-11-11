import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ImgJobsService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }


 addImgJobs(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/img-jobs/addImgJobs`, formData);
  }

  getAllImgJobs(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/img-jobs/getAllImgJobs?page=${page}&pageSize=${pageSize}`);
  }
  deleteImage(id_jobs_img: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/img-jobs/deleteImgJob/${id_jobs_img}`);
  }
}
