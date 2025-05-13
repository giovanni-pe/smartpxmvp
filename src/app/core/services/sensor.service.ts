import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; 
export interface Sensor {
  id: number;
  type: string;
  status: number;
  irrigation_status: number;
  greenhouse_id: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  private apiUrl = `${environment.apiBaseUrl}/sensors`;
  private sensorsSubject = new BehaviorSubject<Sensor[]>([]);  // Manejo de sensores con BehaviorSubject
  public sensors$: Observable<Sensor[]> = this.sensorsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener todos los sensores de la API
  fetchSensors(): void {
    this.http.get<{ success: boolean, data: Sensor[] }>(this.apiUrl)
      .pipe(
        map(response => response.data)
      )
      .subscribe(sensors => {
        this.sensorsSubject.next(sensors);  // Actualizamos los sensores con la respuesta de la API
      });
  }

  // Eliminar un sensor por ID
  deleteSensor(sensorId: number): void {
    this.http.delete(`${this.apiUrl}/${sensorId}`).subscribe(() => {
      const currentSensors = this.sensorsSubject.getValue();
      const updatedSensors = currentSensors.filter(s => s.id !== sensorId);
      this.sensorsSubject.next(updatedSensors);  // Actualizamos el estado de los sensores
    });
  }

  // Actualizar un sensor localmente (sin hacer una solicitud HTTP)
  updateLocalSensor(updatedSensor: Sensor): void {
    const currentSensors = this.sensorsSubject.getValue();  // Obtenemos los sensores actuales
    const sensorIndex = currentSensors.findIndex(s => s.id === updatedSensor.id);
    if (sensorIndex !== -1) {
      currentSensors[sensorIndex] = updatedSensor;  // Actualizamos el sensor modificado
      this.sensorsSubject.next(currentSensors);  // Emitimos el nuevo valor
    }
  }

  // Crear un nuevo sensor mediante una solicitud POST
  createSensor(sensorData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, sensorData);
  }
}
