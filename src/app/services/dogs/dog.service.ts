import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaces para tipado fuerte
export interface DogData {
  name: string;
  breed: string;
  age: string;
  size?: string;
  energy_level: 'low' | 'medium' | 'high';
  photo?: File;
}

export interface DogResponse {
  id: number;
  name: string;
  breed: string;
  age: string;
  size?: string;
  energy_level: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DogsListResponse {
  data: DogResponse[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DogFilters {
  page?: number;
  name?: string;
  age?: string;
  breed?: string;
  energy_level?: string;
  size?: string;
  per_page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private apiUrl = `${environment.apiBaseUrl}/dogs`;

  // Subject para manejar el estado de loading global
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Cache para optimizar requests
  private dogsCache = new Map<string, DogsListResponse>();
  private cacheExpiration = 5 * 60 * 1000; // 5 minutos

  constructor(private http: HttpClient) { }

  /**
   * Registra un nuevo perro con validaciones y manejo de errores mejorado
   */
  registerDog(dogData: DogData): Observable<DogResponse> {
    // Validaciones del lado del cliente
    this.validateDogData(dogData);

    const formData = this.createFormData(dogData);

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      // Configuración para archivos grandes
      reportProgress: true,
      observe: 'response' as const
    };

    this.setLoading(true);

    return this.http.post<DogResponse>(this.apiUrl, formData, httpOptions).pipe(
      tap(response => {
        console.log('✅ Perro registrado exitosamente:', response);
        this.clearDogsCache(); // Limpiar cache después de crear
      }),
      map(response => response.body as DogResponse),
      catchError(error => this.handleError(error, 'registrar perro')),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Obtiene la lista de perros con filtros mejorados y caché
   */
  getDogs(filters: DogFilters = {}): Observable<DogsListResponse> {
    // Crear clave única para el cache
    const cacheKey = this.createCacheKey(filters);

    // Verificar si tenemos datos en cache y no han expirado
    if (this.dogsCache.has(cacheKey)) {
      const cachedData = this.dogsCache.get(cacheKey)!;
      return new Observable(observer => {
        observer.next(cachedData);
        observer.complete();
      });
    }

    const params = this.buildHttpParams(filters);

    this.setLoading(true);

    return this.http.get<DogsListResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        console.log('📋 Perros obtenidos:', response);
        // Guardar en cache
        this.dogsCache.set(cacheKey, response);
        // Programar limpieza del cache
        setTimeout(() => {
          this.dogsCache.delete(cacheKey);
        }, this.cacheExpiration);
      }),
      catchError(error => this.handleError(error, 'obtener perros')),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Obtiene un perro específico por ID
   */
  getDogById(id: number): Observable<DogResponse> {
    this.setLoading(true);

    return this.http.get<DogResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('🐕 Perro obtenido:', response)),
      catchError(error => this.handleError(error, 'obtener perro')),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Actualiza un perro existente
   */
  updateDog(id: number, dogData: Partial<DogData>): Observable<DogResponse> {
    this.validateDogData(dogData, false); // Validación parcial

    const formData = this.createFormData(dogData);

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      })
    };

    this.setLoading(true);

    return this.http.put<DogResponse>(`${this.apiUrl}/${id}`, formData, httpOptions).pipe(
      tap(response => {
        console.log('✏️ Perro actualizado:', response);
        this.clearDogsCache();
      }),
      catchError(error => this.handleError(error, 'actualizar perro')),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Elimina un perro
   */
  deleteDog(id: number): Observable<void> {
    this.setLoading(true);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('🗑️ Perro eliminado:', id);
        this.clearDogsCache();
      }),
      catchError(error => this.handleError(error, 'eliminar perro')),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Busca perros por nombre (búsqueda en tempo real)
   */
  searchDogs(query: string): Observable<DogResponse[]> {
    if (!query.trim()) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const params = new HttpParams()
      .set('search', query.trim())
      .set('per_page', '10');

    return this.http.get<DogsListResponse>(`${this.apiUrl}/search`, { params }).pipe(
      map(response => response.data),
      catchError(error => this.handleError(error, 'buscar perros'))
    );
  }

  /**
   * Obtiene estadísticas de perros
   */
  getDogStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      catchError(error => this.handleError(error, 'obtener estadísticas'))
    );
  }

  // Métodos privados de utilidad

  private validateDogData(dogData: Partial<DogData>, isComplete: boolean = true): void {
    if (isComplete) {
      if (!dogData.name?.trim()) {
        throw new Error('El nombre del perro es requerido');
      }
      if (!dogData.breed?.trim()) {
        throw new Error('La raza del perro es requerida');
      }
      if (!dogData.age?.trim()) {
        throw new Error('La edad del perro es requerida');
      }
      if (!dogData.energy_level) {
        throw new Error('El nivel de energía es requerido');
      }
    }

    // Validaciones adicionales
    if (dogData.name && dogData.name.length > 50) {
      throw new Error('El nombre no puede exceder 50 caracteres');
    }
    if (dogData.breed && dogData.breed.length > 50) {
      throw new Error('La raza no puede exceder 50 caracteres');
    }
    if (dogData.photo && dogData.photo.size > 5 * 1024 * 1024) {
      throw new Error('La imagen no puede ser mayor a 5MB');
    }
    if (dogData.photo && !dogData.photo.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen');
    }
  }

  private createFormData(dogData: Partial<DogData>): FormData {
    const formData = new FormData();

    // Solo agregar campos que tienen valor
    if (dogData.name?.trim()) formData.append('name', dogData.name.trim());
    if (dogData.breed?.trim()) formData.append('breed', dogData.breed.trim());
    if (dogData.age?.trim()) formData.append('age', dogData.age.trim());
    if (dogData.size?.trim()) formData.append('size', dogData.size.trim());
    if (dogData.energy_level) formData.append('energy_level', dogData.energy_level);

    if (dogData.photo) {
      formData.append('photo', dogData.photo, dogData.photo.name);
    }

    return formData;
  }

  private buildHttpParams(filters: DogFilters): HttpParams {
    let params = new HttpParams();

    // Solo agregar parámetros con valores
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.name?.trim()) params = params.set('name', filters.name.trim());
    if (filters.age?.trim()) params = params.set('age', filters.age.trim());
    if (filters.breed?.trim()) params = params.set('breed', filters.breed.trim());
    if (filters.energy_level) params = params.set('energy_level', filters.energy_level);
    if (filters.size?.trim()) params = params.set('size', filters.size.trim());
    if (filters.per_page) params = params.set('per_page', filters.per_page.toString());

    return params;
  }

  private createCacheKey(filters: DogFilters): string {
    return JSON.stringify(filters);
  }

  private clearDogsCache(): void {
    this.dogsCache.clear();
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private handleError(error: HttpErrorResponse, operation: string): Observable<never> {
    console.error(`❌ Error al ${operation}:`, error);

    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos enviados al servidor';
          break;
        case 401:
          errorMessage = 'No tienes autorización para realizar esta acción';
          break;
        case 403:
          errorMessage = 'Acceso denegado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 413:
          errorMessage = 'El archivo enviado es demasiado grande';
          break;
        case 422:
          errorMessage = this.formatValidationErrors(error.error?.errors);
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Intenta más tarde';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 503:
          errorMessage = 'Servicio no disponible temporalmente';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
      }
    }

    return throwError(() => ({
      ...error,
      userMessage: errorMessage,
      operation
    }));
  }

  private formatValidationErrors(errors: any): string {
    if (!errors) return 'Errores de validación';

    const errorMessages: string[] = [];

    Object.keys(errors).forEach(field => {
      if (Array.isArray(errors[field])) {
        errorMessages.push(...errors[field]);
      } else {
        errorMessages.push(errors[field]);
      }
    });

    return errorMessages.join('. ');
  }

  // Métodos de utilidad para componentes

  /**
   * Verifica si el servicio está cargando
   */
  isLoading(): Observable<boolean> {
    return this.loading$;
  }

  /**
   * Limpia todos los caches del servicio
   */
  clearCache(): void {
    this.clearDogsCache();
  }

  /**
   * Valida si un archivo es una imagen válida
   */
  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Convierte el tamaño de archivo a formato legible
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
