import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Walker } from './walker.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalkerService {

  private apiUrl = `${environment.apiBaseUrl}/walkers`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los paseadores sin filtros
   */
  getWalkers(): Observable<Walker[]> {
    return this.http.get<Walker[]>(this.apiUrl).pipe(
      map(response => {
        console.log('📦 Paseadores obtenidos:', response);
        return response;
      })
    );
  }

  /**
   * Obtener paseadores con filtros y paginación
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

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(response => {
        console.log('📦 Paseadores filtrados:', response);
        return response;
      })
    );
  }

  /**
   * Obtener un paseador por ID
   */
  getWalkerById(id: number): Observable<Walker> {
    return this.http.get<Walker>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        console.log('👤 Paseador obtenido:', response);
        return response;
      })
    );
  }

  /**
   * Crear un nuevo paseador
   */
  createWalker(walkerData: Partial<Walker>): Observable<Walker> {
    return this.http.post<Walker>(this.apiUrl, walkerData).pipe(
      map(response => {
        console.log('✅ Paseador creado:', response);
        return response;
      })
    );
  }

  /**
   * Actualizar un paseador
   */
  updateWalker(id: number, walkerData: Partial<Walker>): Observable<Walker> {
    return this.http.put<Walker>(`${this.apiUrl}/${id}`, walkerData).pipe(
      map(response => {
        console.log('📝 Paseador actualizado:', response);
        return response;
      })
    );
  }

  /**
   * Eliminar un paseador
   */
  deleteWalker(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        console.log('🗑️ Paseador eliminado:', response);
        return response;
      })
    );
  }

  /**
   * Obtener disponibilidad de un paseador en una fecha específica
   */
  getWalkerAvailability(walkerId: number, date: string): Observable<any> {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(`${this.apiUrl}/${walkerId}/availability`, { params }).pipe(
      map(response => {
        console.log('📅 Disponibilidad del paseador:', response);
        return response;
      })
    );
  }
}
