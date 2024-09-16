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

  addService(salonId: number, serviceName: string,subservices:string[],time:number): Observable<any> {
    const body = {
      id_salon: salonId,
      name: serviceName,
      subservices:subservices,
      time:time
    };
    return this.http.post<any>(`${this.baseUrl}/edithome/addService`, body);
  }

  getServicesWithSubservices(salonId: number, page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.baseUrl}/edithome/getServicesWithSubservices?id_salon=${salonId}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url);
}


  updateServiceWithSubservice(
    idService: number,
    idSalon: number,
    serviceName: string,
    subservices: string[],
    time: number
  ): Observable<any> {
    const body = {
      id_service: idService,
      id_salon: idSalon,
      name: serviceName,
      subservices: subservices,
      time: time
    };

    return this.http.put<any>(`${this.baseUrl}/edithome/updateServiceWithSubservice`, body);
  }

  deleteServiceWithSubservice(serviceId: number): Observable<any> {
    const url = `${this.baseUrl}/edithome/deleteServiceWithSubservices/${serviceId}`;
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
}
