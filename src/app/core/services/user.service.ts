import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 
interface CreateUserResponse {
  success: boolean;
  errors: string[];
  detailedErrors: { code: string; data: string }[];
  data: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl =`${environment.apiBaseUrl}/User`; 

  constructor(private http: HttpClient) {}

  createUser(user: { email: string; firstName: string; lastName: string; password: string; tenantId: string; role: number; status: number }): Observable<CreateUserResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'text/plain' });
    return this.http.post<CreateUserResponse>(this.apiUrl, user, { headers });
  }
}
