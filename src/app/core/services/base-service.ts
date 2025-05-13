import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { throwError, Observable, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export abstract class BaseService {
  protected apiUrl!: string;
  protected configService: ConfigService;

  constructor(protected http: HttpClient) {
    this.configService = new ConfigService(http);
    this.init();
  }

  private async init() {
    await this.configService.getConfigLoadedPromise();
    const className = this.constructor.name.replace('Service', '').replace('_', '');
    this.apiUrl = `${this.configService.apiUrl}/${className}`;
  }

  protected handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }

  // Método para obtener todos los registros
  getAll(): Observable<any> {
    return from(this.configService.getConfigLoadedPromise()).pipe(
      switchMap(() => this.http.get<any>(this.apiUrl)),
      catchError(this.handleError)
    );
  }

  // // Método para obtener un registro por ID
  // getById(id: number | string): Observable<any> {
  //   return from(this.configService.getConfigLoadedPromise()).pipe(
  //     switchMap(() => this.http.get<any>(`${this.apiUrl}/${id}`)),
  //     catchError(this.handleError)
  //   );
  // }

  // // Método para crear un nuevo registro
  // create(data: any): Observable<any> {
  //   return from(this.configService.getConfigLoadedPromise()).pipe(
  //     switchMap(() => this.http.post<any>(this.apiUrl, data)),
  //     catchError(this.handleError)
  //   );
  // }

  // // Método para actualizar un registro por ID
  // update(id: number | string, data: any): Observable<any> {
  //   return from(this.configService.getConfigLoadedPromise()).pipe(
  //     switchMap(() => this.http.put<any>(`${this.apiUrl}/${id}`, data)),
  //     catchError(this.handleError)
  //   );
  // }

  // // Método para eliminar un registro por ID
  // delete(id: number | string): Observable<any> {
  //   return from(this.configService.getConfigLoadedPromise()).pipe(
  //     switchMap(() => this.http.delete<any>(`${this.apiUrl}/${id}`)),
  //     catchError(this.handleError)
  //   );
  // }
  // getAll(): Observable<any> {
  //   return this.performRequest(() => this.http.get<any>(this.apiUrl));
  // }
  protected performRequest<T>(request: () => Observable<T>): Observable<T> {
    return from(this.init()).pipe(
      switchMap(() => request()),
      catchError(this.handleError)
    );
  }
  getById(id: number | string): Observable<any> {
    return this.performRequest(() => this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  create(data: any): Observable<any> {
    return this.performRequest(() => this.http.post<any>(this.apiUrl, data));
  }

  update(id: number | string, data: any): Observable<any> {
    return this.performRequest(() => this.http.put<any>(`${this.apiUrl}/${id}`, data));
  }

  delete(id: number | string): Observable<any> {
    return this.performRequest(() => this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}

