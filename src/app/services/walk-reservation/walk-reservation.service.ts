import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReservationData {
  client_id: number;
  dog_id: number;
  walker_id: number;
  reservation_date: string;
  reservation_time: string;
  notes?: string;
}

export interface WalkReservation {
  id?: number;
  client_id: number;
  dog_id: number;
  walker_id: number;
  reservation_date: string;
  reservation_time: string;
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  total_price?: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalkReservationService {
  private apiUrl =`${environment.apiBaseUrl}/reservations`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Crear una nueva reserva de paseo
   */
  createReservation(reservationData: ReservationData): Observable<any> {
    console.log('📋 Creando reserva:', reservationData);

    return this.http.post<any>(this.apiUrl, reservationData, this.httpOptions).pipe(
      map(response => {
        console.log('✅ Reserva creada exitosamente:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al crear reserva:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Obtener todas las reservas con filtros opcionales
   */
  getReservations(filters?: {
    client_id?: number;
    walker_id?: number;
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

    return this.http.get<any>(this.apiUrl, { params, ...this.httpOptions }).pipe(
      map(response => {
        console.log('📋 Reservas obtenidas:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener reservas:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Obtener una reserva específica por ID
   */
  getReservationById(id: number): Observable<WalkReservation> {
    return this.http.get<WalkReservation>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      map(response => {
        console.log('📋 Reserva obtenida:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener reserva:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Actualizar una reserva existente
   */
  updateReservation(id: number, reservationData: Partial<ReservationData>): Observable<any> {
    console.log('📝 Actualizando reserva:', id, reservationData);

    return this.http.put<any>(`${this.apiUrl}/${id}`, reservationData, this.httpOptions).pipe(
      map(response => {
        console.log('✅ Reserva actualizada:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al actualizar reserva:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Cancelar una reserva
   */
  cancelReservation(id: number, reason?: string): Observable<any> {
    const data = { status: 'cancelled', cancellation_reason: reason };
    console.log('❌ Cancelando reserva:', id, data);

    return this.http.patch<any>(`${this.apiUrl}/${id}/cancel`, data, this.httpOptions).pipe(
      map(response => {
        console.log('✅ Reserva cancelada:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al cancelar reserva:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Confirmar una reserva (para paseadores)
   */
  confirmReservation(id: number): Observable<any> {
    const data = { status: 'confirmed' };
    console.log('✅ Confirmando reserva:', id);

    return this.http.patch<any>(`${this.apiUrl}/${id}/confirm`, data, this.httpOptions).pipe(
      map(response => {
        console.log('✅ Reserva confirmada:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al confirmar reserva:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Obtener reservas del cliente autenticado
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

    return this.http.get<any>(`${this.apiUrl}/my-reservations`, { params, ...this.httpOptions }).pipe(
      map(response => {
        console.log('📋 Mis reservas:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al obtener mis reservas:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Verificar disponibilidad antes de crear reserva
   */
  checkAvailability(walkerId: number, date: string, time: string): Observable<any> {
    const params = new HttpParams()
      .set('walker_id', walkerId.toString())
      .set('date', date)
      .set('time', time);

    return this.http.get<any>(`${this.apiUrl}/check-availability`, { params, ...this.httpOptions }).pipe(
      map(response => {
        console.log('🔍 Disponibilidad verificada:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al verificar disponibilidad:', error);
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Obtener estadísticas de reservas
   */
  getReservationStats(clientId?: number): Observable<any> {
    let params = new HttpParams();
    if (clientId) {
      params = params.set('client_id', clientId.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/stats`, { params, ...this.httpOptions }).pipe(
      map(response => {
        console.log('📊 Estadísticas de reservas:', response);
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
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      status: error.status || 500,
      message: errorMessage,
      originalError: error
    };
  }

  /**
   * Validar datos de reserva antes de enviar
   */
  validateReservationData(data: ReservationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.client_id || data.client_id <= 0) {
      errors.push('ID del cliente es requerido');
    }
    if (!data.dog_id || data.dog_id <= 0) {
      errors.push('Debe seleccionar un perro');
    }
    if (!data.walker_id || data.walker_id <= 0) {
      errors.push('Debe seleccionar un paseador');
    }
    if (!data.reservation_date) {
      errors.push('Fecha de reserva es requerida');
    }
    if (!data.reservation_time) {
      errors.push('Hora de reserva es requerida');
    }

    // Validar que la fecha no sea en el pasado
    if (data.reservation_date) {
      const reservationDate = new Date(data.reservation_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (reservationDate < today) {
        errors.push('La fecha de reserva no puede ser en el pasado');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
