import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApiService } from '../../base/base-api.service';  // El servicio base
import { HttpClient } from '@angular/common/http';
import { SensorDTO } from './sensor.dto';

@Injectable({
  providedIn: 'root',
})
export class SensorManagementService extends BaseApiService {
  private readonly SENSOR_ENDPOINT = '/sensors';
  private sensorsSubject = new BehaviorSubject<SensorDTO[]>([]);
  public sensors$ = this.sensorsSubject.asObservable();

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Obtener todos los sensores de la API
  fetchSensors(): void {
    this.get<{ success: boolean; data: SensorDTO[] }>(this.SENSOR_ENDPOINT)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error fetching sensors:', error);
          return [];
        })
      )
      .subscribe((sensors) => {
        this.sensorsSubject.next(sensors);
      });
  }

  // Eliminar un sensor por ID
  deleteSensor(sensorId: number): void {
    this.delete(`${this.SENSOR_ENDPOINT}/${sensorId}`).subscribe(() => {
      const currentSensors = this.sensorsSubject.getValue();
      const updatedSensors = currentSensors.filter((s) => s.id !== sensorId);
      this.sensorsSubject.next(updatedSensors);  // Actualizamos los sensores
    });
  }

  // Actualizar un sensor localmente (sin hacer una solicitud HTTP)
  updateLocalSensor(updatedSensor: SensorDTO): void {
    const currentSensors = this.sensorsSubject.getValue();
    const sensorIndex = currentSensors.findIndex((s) => s.id === updatedSensor.id);
    if (sensorIndex !== -1) {
      currentSensors[sensorIndex] = updatedSensor;  // Actualizamos el sensor
      this.sensorsSubject.next(currentSensors);  // Emitimos el nuevo valor
    }
  }

  // Crear un nuevo sensor mediante una solicitud POST
  createSensor(sensorData: SensorDTO): Observable<SensorDTO> {
    return this.post<SensorDTO>(this.SENSOR_ENDPOINT, sensorData);
  }
}
