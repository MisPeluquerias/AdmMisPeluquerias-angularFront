import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }


  getCategoriesJob(): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getCategoriesJob`);
  }

  getSubCategoriesByCategory(idJobCat: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getSubCategoriesByCategory/${idJobCat}`);
  }

  getImgJob(): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getImgJob`);
  }

  addJobOfferData(jobOfferData:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/job-offer/addJobOffer`, jobOfferData);
  }
}
