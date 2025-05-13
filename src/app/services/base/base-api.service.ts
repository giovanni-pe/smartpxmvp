import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; 
@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  protected baseApiUrl = environment.apiBaseUrl;  

  constructor(protected http: HttpClient) {}

  protected get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseApiUrl}${endpoint}`, { params })
      .pipe(
        catchError(this.handleError)  
      );
  }


  protected post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseApiUrl}${endpoint}`, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  protected put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseApiUrl}${endpoint}`, body)
      .pipe(
        catchError(this.handleError)
      );
  }


  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseApiUrl}${endpoint}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  protected handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);  
  }
}
