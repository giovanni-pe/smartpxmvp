import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ThermalCameraService } from '../../../core/services/thermal-camera.service';
import { ThermalCameraEditButtonComponent } from '../thermal-camera-edit-button/thermal-camera-edit-button.component';
import { ThermalCameraViewButtonComponent } from '../thermal-camera-view-button/thermal-camera-view-button.component';
import { ThermalCameraDeleteButtonComponent } from '../thermal-camera-delete-button/thermal-camera-delete-button.component';
import { catchError, map, startWith } from 'rxjs/operators';
import { TableModule,ColComponent,CardHeaderComponent,CardBodyComponent,CardComponent } from '@coreui/angular'; // Corregimos el nombre a TableModule, que es el correcto

interface ThermalCamera {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  length: number;
  width: number;
  height: number;
  description: string;
}

@Component({
  selector: 'app-thermal-cameras',
  standalone: true,
  imports: [
    CommonModule,
    TableModule, // Utilizamos el módulo TableModule en lugar de DataTable
    ThermalCameraDeleteButtonComponent,
    ThermalCameraEditButtonComponent,
    ThermalCameraViewButtonComponent
    ,ColComponent,CardHeaderComponent,CardBodyComponent,CardComponent
  ],
  template: `
  <c-col xs="12">
    <c-card class="mb-4">
      <c-card-header>
        <strong>SmartMusa</strong> <small>team</small>
      </c-card-header>
      <c-card-body>
      <div class="container-fluid">
      <div class="row">
        <div class="col">
        <div style="display: flex; justify-content: center; align-items: center; height: 100px; margin-bottom: 20px;">
                            <h2 style="background-color: #042c57; color: white; padding: 10px 20px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                Cámaras Térmicas Registradas
                            </h2>
                          </div>
          <div *ngIf="loading" class="text-center">
            <p>Cargando cámaras...</p>
          </div>
          <div *ngIf="error" class="alert alert-danger">
            Error al cargar cámaras: {{ error }}
          </div>

          <!-- Tabla responsiva usando Bootstrap/CoreUI -->
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Latitud</th>
                  <th>Longitud</th>
                  <th>Largo (m)</th>
                  <th>Ancho (m)</th>
                  <th>Altura (m)</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let camera of thermalCameras$ | async">
                  <td>{{ camera.id }}</td>
                  <td>{{ camera.name }}</td>
                  <td>{{ camera.latitude }}</td>
                  <td>{{ camera.longitude }}</td>
                  <td>{{ camera.length }}</td>
                  <td>{{ camera.width }}</td>
                  <td>{{ camera.height }}</td>
                  <td>{{ camera.description }}</td>
                  <td>
                    <div class="d-flex justify-content-between">
                      <app-thermal-camera-view-button
                        [cameraDetails]="camera"
                        class="btn btn-sm w-100 mx-1"
                      ></app-thermal-camera-view-button>
                      <app-thermal-camera-edit-button
                        [cameraDetails]="camera"
                        (cameraUpdated)="handleUpdate($event)"
                        class="btn btn-sm w-100 mx-1"
                      ></app-thermal-camera-edit-button>
                      <app-thermal-camera-delete-button
                        [cameraId]="camera.id"
                        (onDelete)="handleDelete(camera.id)"
                        class="btn btn-sm w-100 mx-1"
                      ></app-thermal-camera-delete-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      </c-card-body>
    </c-card>
  </c-col>
   
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThermalCamerasComponent implements OnInit {
  public thermalCameras$: Observable<ThermalCamera[]> =
    this.cameraService.thermalCameras$.pipe(
      startWith([]),
      catchError((err) => {
        this.error = 'No se pudieron cargar las cámaras';
        return [];
      })
    );
  public loading = true;
  public error: string | null = null;

  constructor(
    private cameraService: ThermalCameraService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cameraService.fetchThermalCameras();
    this.thermalCameras$.subscribe(() => {
      this.loading = false;
      this.cdr.markForCheck(); // Se asegura de que los cambios se detecten correctamente
    });
  }

  handleUpdate(updatedCamera: any): void {
    // Actualizamos la cámara en el arreglo local
    this.cameraService.updateLocalCamera(updatedCamera);
    this.cdr.markForCheck(); // Detección de cambios manual
  }

  handleDelete(cameraId: number): void {
    this.cameraService.deleteThermalCamera(cameraId);
    this.cdr.markForCheck(); // Actualizamos la vista tras eliminar
  }
}
