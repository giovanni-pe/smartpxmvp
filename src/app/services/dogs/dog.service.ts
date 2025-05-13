import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private apiUrl = `https://apiv2.smartpx.org/api/dogs`;

  constructor(private http: HttpClient) { }

  // Método para registrar un perro
  registerDog(dogData: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('name', dogData.name);
    formData.append('breed', dogData.breed);
    formData.append('age', dogData.age);
    formData.append('size', dogData.size || '');
    formData.append('energy_level', dogData.energy_level);
    if (dogData.photo) {
      formData.append('photo', dogData.photo, dogData.photo.name);
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      })
    };

    return this.http.post<any>(this.apiUrl, formData, httpOptions);
  }
  getDogs(filters: any): Observable<any> {

    const params = new HttpParams()
      .set('page', filters.page || '1')
      .set('name', filters.name || '')
      .set('age', filters.age || '');

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }
}
