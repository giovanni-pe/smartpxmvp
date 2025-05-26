import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalkerReservationService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener reservaciones del paseador
   */
  getWalkerReservations(walkerId: number, filters?: {
    status?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
  }): Observable<any> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<any>(`${this.apiUrl}/walkers/${walkerId}/reservations`, { params }).pipe(
      map(response => {
        console.log('✅ Reservaciones del paseador obtenidas:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener reservaciones:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Aceptar una reservación
   */
  acceptReservation(reservationId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/reservations/${reservationId}/accept`, {}).pipe(
      map(response => {
        console.log('✅ Reservación aceptada:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al aceptar reservación:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Rechazar una reservación
   */
  rejectReservation(reservationId: number, reason?: string): Observable<any> {
    const body = reason ? { rejection_reason: reason } : {};

    return this.http.patch<any>(`${this.apiUrl}/reservations/${reservationId}/reject`, body).pipe(
      map(response => {
        console.log('✅ Reservación rechazada:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al rechazar reservación:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Iniciar un paseo
   */
  startWalk(reservationId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/reservations/${reservationId}/start`, {}).pipe(
      map(response => {
        console.log('✅ Paseo iniciado:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al iniciar paseo:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Completar un paseo
   */
  completeWalk(reservationId: number, notes?: string, durationMinutes?: number): Observable<any> {
    const body: any = {};

    if (notes) {
      body.completion_notes = notes;
    }

    if (durationMinutes) {
      body.duration_minutes = durationMinutes;
    }

    return this.http.patch<any>(`${this.apiUrl}/reservations/${reservationId}/complete`, body).pipe(
      map(response => {
        console.log('✅ Paseo completado:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al completar paseo:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Obtener una reservación específica
   */
  getReservationById(reservationId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservations/${reservationId}`).pipe(
      map(response => {
        console.log('✅ Reservación obtenida:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener reservación:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Obtener estadísticas del paseador
   */
  getWalkerStats(walkerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/walkers/${walkerId}/stats`).pipe(
      map(response => {
        console.log('✅ Estadísticas del paseador:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener estadísticas:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: any): any {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors) {
        // Errores de validación Laravel
        const validationErrors = Object.values(error.error.errors).flat();
        errorMessage = validationErrors.join(', ');
      }
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos para realizar esta acción';
    } else if (error.status === 401) {
      errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente';
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
