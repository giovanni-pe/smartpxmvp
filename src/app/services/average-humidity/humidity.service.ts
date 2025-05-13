import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../base/base-api.service';
import { HumidityDTO } from './humidity.dto'; 
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HumidityService extends BaseApiService {
  private readonly HUMIDITY_ENDPOINT = '/dashboard/avg-humidity';
  constructor(protected override http: HttpClient) {
    super(http);
  }
  getAverageHumidity(): Observable<number | null> {
    return this.get<HumidityDTO>(this.HUMIDITY_ENDPOINT)
      .pipe(
        map((response: HumidityDTO) => {
          if (response.success) {
            console.log(response)
            return response.avg_humidity;
          }
          return null;  
        })
      );
  }
}
