import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { SensorUpdateDTO } from './sensor-update.dto';

@Injectable({
  providedIn: 'root'
})
export class SensorManagementService extends BaseApiService {

  private readonly SENSOR_ENDPOINT = '/sensors';  // Endpoint para manejar sensores

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Actualizar un sensor
  updateSensor(sensorId: number, sensorData: SensorUpdateDTO): Observable<SensorUpdateDTO> {
    return this.put<SensorUpdateDTO>(`${this.SENSOR_ENDPOINT}/${sensorId}`, sensorData);
  }
}
