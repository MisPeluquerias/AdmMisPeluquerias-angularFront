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

  deleteImage(imageId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/edithomeimages/deleteImage/${imageId}`);
  }
}
