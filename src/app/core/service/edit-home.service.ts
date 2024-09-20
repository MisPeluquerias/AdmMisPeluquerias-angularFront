import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable,throwError } from 'rxjs';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})


export class EditHomeService {

  baseUrl: string = environment.baseUrl;

  constructor(private http:HttpClient) { }

  getSalonById(id_salon: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edithome/getSalonById`, {
      params: {
        id_salon
      },
    });;
  }

  
  updateSalon(salonData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edithome/updateSalon`, salonData);
  }


  getCitiesByProvince(id_province: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/edithome/getCitiesByProvince`, {
      params: { id_province: id_province.toString() }
    });
  }

  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/edithome/getProvinces`);
  }



  updateSalonHours(id: number, hours_old: string): Observable<any> {
    const url = `${this.baseUrl}/edithome/updateSalonHours/${id}`;
    const body = { hours_old };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put(url, body, { headers });
  }



  uploadImage(imageData: FormData): Observable<any> {
    const url = `${this.baseUrl}/edithomeimages/uploadImg`;
    return this.http.post(url, imageData).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  getImages(salonId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/edithomeimages/getImages`, {
      params: { salon_id: salonId.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/edithome/getServices`);
}

  getSubservicesByService(id_service: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/edithome/getSubservicesByService`, {
      params: { id_service: id_service.toString()}
    });
  }


  deleteImage(imageId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/edithomeimages/deleteImage/${imageId}`);
  }

  updatePrincipalImage(fileId: number, filePrincipal: boolean): Observable<any> {
    const body = {
      file_id: fileId,
      file_principal: filePrincipal
    };

    return this.http.put<any>(`${this.baseUrl}/edithomeimages/updatePrincipalImage`, body);
  }



  addService(id_salon: number, id_service:any, id_service_type:any,time:any): Observable<any> {
    const body = {
      id_salon: id_salon,
      id_service:id_service,
      id_service_type: id_service_type,
      time:time
    };
    return this.http.post<any>(`${this.baseUrl}/edithome/addService`, body);
  }

  addCategorySalon(id_salon: number, category: string): Observable<any> {
    const body = {
      id_salon: id_salon,
      category: category
    };
    return this.http.post<any>(`${this.baseUrl}/edithome/addCategorySalon`, body);
  }


  getServicesWithSubservices(salonId: number, page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.baseUrl}/edithome/getServicesWithSubservices?id_salon=${salonId}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url);
}


  deleteServiceWithSubservice(id_salon_service_type: number): Observable<any> {
    const url = `${this.baseUrl}/edithome/deleteServiceWithSubservices/${id_salon_service_type}`;
    return this.http.delete<any>(url);
  }

  getFaqByIdSalon(id_salon: number, page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.baseUrl}/edithome/getFaqByIdSalon?id_salon=${id_salon}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  updateFaq(id_faq: string, answer: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/edithome/updateQuestion`, { id_faq, answer });
  }
  deleteFaq(id_faq: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/edithome/deleteQuestion`, { id_faq });
  }

  updateServiceWithSubservice(updateData: { idSalonServiceType: number, time: number, active: number }) {
    return this.http.put(`${this.baseUrl}/edithome/updateServiceWithSubservice`, updateData); 
  }

  updateCategorySalon(updateData:any) {
    return this.http.put(`${this.baseUrl}/edithome/updateCategorySalon`, updateData); 
  }

  deleteCategorySalon(id_category: any) {
    return this.http.delete(`${this.baseUrl}/edithome/deleteCategotySalon/${id_category}`);
  }
  

  loadReview(id_salon: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edithome/loadReview`, {
      params: {
        id_salon: id_salon.toString(),
      },
    });
  }
  updateReview(review: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/edithome/updateReview`, review);
  }

  deleteReview(id_review:string){
    const body = {
      id_review
    };
    return this.http.post<any[]>(`${this.baseUrl}/edithome/deleteReview`, body);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/edithome/getAllCategoriesSalon`);
  }
}
