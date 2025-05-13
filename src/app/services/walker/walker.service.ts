import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Walker } from './walker.dto';

@Injectable({
  providedIn: 'root'
})
export class WalkerService {

  private readonly BASE_URL = 'https://apiv2.smartpx.org/api/walkers';

  constructor(private http: HttpClient) {}

  /**
   * Carga todos los paseadores sin filtros
   */
  getWalkers(): Observable<Walker[]> {
    return this.http.get<Walker[]>(this.BASE_URL).pipe(
      map(response => {
        console.log('📦 Todos los paseadores:', response);
        return response;
      })
    );
  }

  /**
   * Carga paseadores con filtros + paginación + ordenamiento
   */
  getFilteredWalkers(params: {
    search?: string;
    specialty?: string;
    min_rating?: number;
    sort_by?: string;
    order?: string;
    page?: number;
    per_page?: number;
  }): Observable<any> {
    let httpParams = new HttpParams();

    // Agregamos dinámicamente solo los filtros activos
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>('https://apiv2.smartpx.org/api/walkers/search', { params: httpParams }).pipe(
      map(response => {
        console.log('📦 Paseadores filtrados paginados:', response);
        return response; // contiene data, total, current_page, etc.
      })
    );
  }
}
