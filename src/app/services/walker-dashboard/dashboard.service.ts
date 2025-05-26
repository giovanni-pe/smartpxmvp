import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalkerDashboardService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener estadísticas simples del paseador
   */
  getSimpleWalkerStats(walkerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/walkers/${walkerId}/simple-stats`).pipe(
      map(response => {
        console.log('✅ Estadísticas simples:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener estadísticas:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Obtener datos para gráfico mensual
   */
  getMonthlyChart(walkerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/walkers/${walkerId}/monthly-chart`).pipe(
      map(response => {
        console.log('✅ Datos del gráfico mensual:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener datos del gráfico:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Manejo de errores
   */
  private handleError(error: any): any {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      status: error.status || 500,
      message: errorMessage,
      originalError: error
    };
  }
}
