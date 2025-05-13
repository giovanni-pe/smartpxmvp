import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; 
export interface ThermalCamera {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  length: number;
  width: number;
  height: number;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThermalCameraService {
  private apiUrl =`${environment.apiBaseUrl}/greenhouses`;
  private thermalCamerasSubject = new BehaviorSubject<ThermalCamera[]>([]);  // Cambiamos a BehaviorSubject
  public thermalCameras$: Observable<ThermalCamera[]> = this.thermalCamerasSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchThermalCameras(): void {
    this.http.get<{ success: boolean, data: ThermalCamera[] }>(this.apiUrl) 
      .pipe(
        map(response => response.data)
      )
      .subscribe(cameras => {
        this.thermalCamerasSubject.next(cameras); 
      });
  }

  deleteThermalCamera(cameraId: number): void {
    this.http.delete(`${this.apiUrl}/${cameraId}`).subscribe(() => {
      const currentCameras = this.thermalCamerasSubject.getValue();
      const updatedCameras = currentCameras.filter(c => c.id !== cameraId);
      this.thermalCamerasSubject.next(updatedCameras);  
    });
  }

  updateLocalCamera(updatedCamera: ThermalCamera): void {
    const currentCameras = this.thermalCamerasSubject.getValue();  
    const cameraIndex = currentCameras.findIndex(c => c.id === updatedCamera.id);
    if (cameraIndex !== -1) {
      currentCameras[cameraIndex] = updatedCamera; 
      this.thermalCamerasSubject.next(currentCameras);  
    }
  }
  createCamera(cameraData: any): Observable<any> {
    
    return this.http.post<any>(this.apiUrl, cameraData);

  }
}
