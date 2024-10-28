import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  loadAllServices(
    page: number,
    pageSize: number,
    searchText: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("pageSize", pageSize.toString());

    if (searchText) {
      params = params.set("search", searchText);
    }

    return this.http.get<any>(`${this.baseUrl}/services/getAllServices`, {
      params,
    });
  }

  addNewService(service: {
    name: string;
    subservices: string[];
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/services/addService`, service);
  }

  deleteServiceWithSubservice(id_service: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/services/deleteServiceWithSubservices/${id_service}`);
  }
  updateSubservices(id_service: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/services/updateSubservices/${id_service}`, data);
  }

  
  updateCategories(id_service: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/services/updateCategories/${id_service}`, data);
  }
  
  updateService(service_type_ids: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/services/updateService/${service_type_ids}`, data);
  }  

  getCategoryInLive(category: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/services/searchCategoryInLive`,
      {
        params: {
          category,
        },
      }
    );
  }
}
