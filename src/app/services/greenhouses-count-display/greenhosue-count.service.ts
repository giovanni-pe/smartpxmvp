import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../base/base-api.service';
import { GreenhouseCountDTO } from './greenhouse-count.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GreenhouseCountService extends BaseApiService {

  private readonly GREENHOUSE_COUNT_ENDPOINT = '/greenhouses/count';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getGreenhouseCount(): Observable<number | null> {
    return this.get<GreenhouseCountDTO>(this.GREENHOUSE_COUNT_ENDPOINT)
      .pipe(
        map((response: GreenhouseCountDTO) => {
          if (response.success) {
            return response.data; 
          }
          return null;  
        })
      );
  }
}
