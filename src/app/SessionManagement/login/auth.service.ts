import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/login`; // URL de la API para el inicio de sesión
  private jwtHelper = new JwtHelperService();
  private userEmail: string | null = null;
  private userRole: string | null = null;
  private userId: string | null = null;
  private userClient: any | null = null;
  private userWalker: any | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  // Método para iniciar sesión y obtener el token JWT
  login(credentials: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http.post<any>(this.apiUrl, credentials, httpOptions)
      .pipe(
        tap(response => {
          if (response.access_token && response.user) {
            const token = response.access_token;
            localStorage.setItem('token', token);

            // Adaptación clave para extraer datos del objeto 'user' directamente
            const userData = response.user;
            this.userEmail = userData.email || null;
            this.userId = userData.id ? userData.id.toString() : null;
            this.userRole = (userData.roles && userData.roles.length > 0)
                            ? userData.roles[0].name
                            : null;
                            console.log('User role: caragdo', this.userRole);

            // Guardamos los datos generales del usuario
            localStorage.setItem('userId', this.userId || '');
            localStorage.setItem('userEmail', this.userEmail || '');
            localStorage.setItem('userRole', this.userRole || '');

            // Guardamos los datos específicos de cliente o paseador
            if (this.userRole === 'client' && response.client) {
              this.userClient = response.client;
              localStorage.setItem('userClient', JSON.stringify(this.userClient));
            } else if (this.userRole === 'dog_walker' && response.walker) {
              this.userWalker = response.walker;
              localStorage.setItem('userWalker', JSON.stringify(this.userWalker));
            }

          } else {
            throw new Error('Login failed');
          }
        })
      );
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userClient');
    localStorage.removeItem('userWalker');
    this.userEmail = null;
    this.userRole = null;
    this.userId = null;
    this.userClient = null;
    this.userWalker = null;
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario ha iniciado sesión
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  // Obtener el token del almacenamiento local
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Cargar la información del usuario desde el localStorage
  loadUserFromStorage() {
    this.userId = localStorage.getItem('userId');
    this.userEmail = localStorage.getItem('userEmail');
    this.userRole = localStorage.getItem('userRole');
    this.userClient = JSON.parse(localStorage.getItem('userClient') || 'null');
    this.userWalker = JSON.parse(localStorage.getItem('userWalker') || 'null');
  }

  // Obtener el ID del usuario
  getUserId(): string | null {
    return this.userId;
  }

  // Obtener el email del usuario
  getUserEmail(): string | null {
    return this.userEmail;
  }

  // Obtener el rol del usuario
  getUserRole(): string | null {
    return this.userRole;
  }

  // Obtener los datos del cliente (si aplica)
  getUserClient(): any {
    return this.userClient;
  }

  // Obtener los datos del paseador (si aplica)
  getUserWalker(): any {
    return this.userWalker;
  }
}
