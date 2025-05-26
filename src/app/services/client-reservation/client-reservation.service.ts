import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientReservationService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener reservaciones del cliente
   */
  getClientReservations(clientId: number, filters?: {
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

    return this.http.get<any>(`${this.apiUrl}/clients/${clientId}/reservations`, { params }).pipe(
      map(response => {
        console.log('✅ Reservaciones del cliente obtenidas:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener reservaciones del cliente:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Cancelar una reservación (por parte del cliente)
   */
  cancelReservation(reservationId: number, reason?: string): Observable<any> {
    const body = reason ? { cancellation_reason: reason } : {};

    return this.http.patch<any>(`${this.apiUrl}/reservations/${reservationId}/cancel-client`, body).pipe(
      map(response => {
        console.log('✅ Reservación cancelada por cliente:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al cancelar reservación:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Calificar un paseo completado
   */
  rateWalk(reservationId: number, rating: number, review?: string): Observable<any> {
    const body: any = { rating };

    if (review) {
      body.review = review;
    }

    return this.http.patch<any>(`${this.apiUrl}/reservations/${reservationId}/rate`, body).pipe(
      map(response => {
        console.log('✅ Paseo calificado:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al calificar paseo:', error);
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
   * Obtener mis reservaciones (cliente autenticado)
   */
  getMyReservations(filters?: {
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

    return this.http.get<any>(`${this.apiUrl}/my-reservations`, { params }).pipe(
      map(response => {
        console.log('✅ Mis reservaciones obtenidas:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener mis reservaciones:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Verificar si una reservación puede ser cancelada
   */
  canCancelReservation(reservationDate: string, reservationTime: string): boolean {
    const reservationDateTime = new Date(`${reservationDate} ${reservationTime}`);
    const now = new Date();
    const diffInHours = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return diffInHours >= 2; // Al menos 2 horas de anticipación
  }

  /**
   * Obtener estadísticas del cliente
   */
  getClientStats(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clients/${clientId}/stats`).pipe(
      map(response => {
        console.log('✅ Estadísticas del cliente:', response);
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
      errorMessage = 'Reservación no encontrada';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos para realizar esta acción';
    } else if (error.status === 401) {
      errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Solicitud inválida';
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
