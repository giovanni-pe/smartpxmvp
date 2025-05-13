import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { GreenhouseSelectorDTO } from './greenhouse-selector.dto';
import { SensorCreationDTO } from './sensor-creation.dto';

@Injectable({
  providedIn: 'root'
})
export class SensorManagementService extends BaseApiService {

  private readonly GREENHOUSE_ENDPOINT = '/greenhouses';  // Endpoint para obtener los invernaderos
  private readonly SENSOR_ENDPOINT = '/sensors';  // Endpoint para crear sensores

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Obtener la lista de invernaderos
  getGreenhouseSelectors(): Observable<{ success: boolean; data: GreenhouseSelectorDTO[] }> {
    return this.get<{ success: boolean; data: GreenhouseSelectorDTO[] }>(this.GREENHOUSE_ENDPOINT);
  }

  // Crear un nuevo sensor
  createSensor(sensorData: SensorCreationDTO): Observable<{ success: boolean; data: SensorCreationDTO }> {
    return this.post<{ success: boolean; data: SensorCreationDTO }>(this.SENSOR_ENDPOINT, sensorData);
  }
}
