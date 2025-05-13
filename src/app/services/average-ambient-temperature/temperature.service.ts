import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../base/base-api.service';  // Importamos el servicio base
import { TemperatureDTO } from './temperature.dto';  // Importamos el DTO
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService extends BaseApiService {

  private readonly TEMPERATURE_ENDPOINT = '/dashboard/avg-temperature';

  constructor(protected override http: HttpClient) {
    super(http);
  }
  getAverageTemperature(): Observable<number | null> {
    return this.get<TemperatureDTO>(this.TEMPERATURE_ENDPOINT)
      .pipe(
        map((response: TemperatureDTO) => {
          if (response.success) {
            return response.avg_ambient_temperature;
          }
          return null;  
        })
      );
  }
}
