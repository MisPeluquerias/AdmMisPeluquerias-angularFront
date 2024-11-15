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


  getAllJobsOffers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getAlljobsOffers`);
  }

  getCategoriesJob(): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getCategoriesJob`);
  }

  getSubCategoriesByCategory(idJobCat: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getSubCategoriesByCategory/${idJobCat}`);
  }

  getImgJob(): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getImgJob`);
  }

  getUserPermiso(): Observable<any> {
    const permiso = localStorage.getItem('permiso');
    return this.http.get(`${this.baseUrl}/decode-permiso/permiso-aside`, {
      params: { permiso: permiso || ''}
    });
  }

  addJobOfferData(jobOfferData:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/job-offer/addJobOffer`, jobOfferData);
  }

  getSalonsUser(id_user: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getSalonsByUser/${id_user}`);
  }




  getAllJobsOffersByUser(id_user:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getAllJobsOffersByUser/${id_user}`);
  }
}
