import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface RegisterResponse {
  message: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Update this to point to your Laravel endpoint
  private apiUrl =`${environment.apiBaseUrl}/register-profile`;

  constructor(private http: HttpClient) {}

  registerUser(user: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    experience?: string;
  }): Observable<RegisterResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<RegisterResponse>(this.apiUrl, user, { headers });
  }
}
