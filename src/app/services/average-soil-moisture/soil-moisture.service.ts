import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../base/base-api.service';
import { SoilMoistureDTO } from './soil-moisture.dto';  
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SoilMoistureService extends BaseApiService {

  private readonly SOIL_MOISTURE_ENDPOINT = '/dashboard/avg-soil-moisture';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getAverageSoilMoisture(): Observable<number | null> {
    return this.get<SoilMoistureDTO>(this.SOIL_MOISTURE_ENDPOINT)
      .pipe(
        map((response: SoilMoistureDTO) => {
          if (response.success) {
            return response.avg_soil_humidity;
          }
          return null; 
        })
      );
  }
}
