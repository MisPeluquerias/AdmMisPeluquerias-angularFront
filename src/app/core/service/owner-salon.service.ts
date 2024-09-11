import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class OwnerSalonService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  loadAllOwners(
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
    return this.http.get<any>(`${this.baseUrl}/owner-salon/getAllOwners`, {
      params,
    });
  }
  addNewOwner(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/owner-salon/addNewOwner`, data);
  }

  getUserEmail(email: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/owner-salon/searchEmailInLive`,
      {
        params: {
          email,
        },
      }
    );
  }

  getSalonName(name: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/owner-salon/searchSalonInLive`,
      {
        params: {
          name,
        },
      }
    );
  }
}
