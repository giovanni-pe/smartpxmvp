import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../base/base-api.service';
import { CameraThermalDTO } from './camera-thermal.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CameraMonitoringService extends BaseApiService {

  private readonly CAMERAS_ENDPOINT = '/greenhouses';
  
  constructor(protected override http: HttpClient) {
    super(http);
  }

  getCameras(): Observable<CameraThermalDTO[]> {
    return this.get<{ success: boolean, data: CameraThermalDTO[] }>(this.CAMERAS_ENDPOINT)
      .pipe(
        map(response => response.success ? response.data : [])
      );
  }

  getCameraReadings(cameraId: number): Observable<any> {
    return this.get<{ success: boolean, data: any[] }>(`${this.CAMERAS_ENDPOINT}/${cameraId}/latest-readings`)
      .pipe(
        map(response => response.success ? response.data : [])
      );
  }

  toggleIrrigation(cameraId: number, active: boolean): Observable<any> {
    const body = { riegoActivo: active };
    return this.post(`${this.CAMERAS_ENDPOINT}/${cameraId}/toggle-irrigation`, body);
  }
}
