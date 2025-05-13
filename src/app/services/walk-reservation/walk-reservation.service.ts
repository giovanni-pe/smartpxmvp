import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalkReservationService {
  private apiUrl = 'https://apiv2.smartpx.org/api/reservations';  // URL del backend para la creación de reservas

  constructor(private http: HttpClient) {}

  createReservation(reservationData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reservationData);
  }
}
