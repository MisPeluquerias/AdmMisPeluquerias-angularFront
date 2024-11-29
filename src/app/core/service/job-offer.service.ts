import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }


  getAllJobsOffers(page: number, pageSize: number): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrl}/job-offer/getAlljobsOffers`, { params });
  }
  
  getAllJobsOffersByUserPaginated(id_user: string, page: number, pageSize: number): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());
    return this.http.get(`${this.baseUrl}/job-offer/getAllJobsOffersByUser/${id_user}`, { params });
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


  deleteJobOffer(id_job_offer: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/job-offer/deleteJobOffer/${id_job_offer}`);
  }

  getJobInscriptions(id_job_offer: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-offer/getJobInscriptions/${id_job_offer}`);
  }
}
