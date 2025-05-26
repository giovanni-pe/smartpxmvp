import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SensorService } from '../../../core/services/sensor.service';  // Servicio para manejar la API de sensores
import { SensorEditButtonComponent } from '../sensor-edit-button/sensor-edit-button.component';
import { SensorViewButtonComponent } from '../sensor-view-button/sensor-view-button.component';
import { SensorDeleteButtonComponent } from '../sensor-delete-button/sensor-delete-button.component';
import { SensorCreateButtonComponent } from '../sensor-create-button/sensor-create-button.component';
import { catchError, startWith } from 'rxjs/operators';
import { TableModule,
  ColComponent , CardComponent,CardHeaderComponent,CardBodyComponent} from '@coreui/angular';

interface Sensor {
  id: number;
  type: string;
  status: number;
  irrigation_status: number;
  greenhouse_id: number;
  created_at: string;
  greenhouse?: Greenhouse; // Relación opcional para el invernadero
}

interface Greenhouse {
  id: number;
  name: string;
}

@Component({
  selector: 'app-sensors-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    SensorDeleteButtonComponent,
    SensorEditButtonComponent,
    SensorViewButtonComponent,
    SensorCreateButtonComponent,ColComponent,CardComponent,CardHeaderComponent,CardBodyComponent  // Importamos el componente para crear sensores
  ],
  template: `
  <c-col xs="12">
    <c-card class="mb-4">
      <c-card-header>
        <strong>SmartPX</strong> <small>team</small>
      </c-card-header>
      <c-card-body>
      <div class="container-fluid">
      <div class="row mb-3">
        <div class="col">

          <div style="display: flex; justify-content: center; align-items: center; height: 100px; margin-bottom: 20px;">
                            <h2 style="background-color: #042c57; color: white; padding: 10px 20px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            Gestión de Sensores
                            </h2>
                          </div>
          <!-- Botón para abrir el modal de registro -->
          <app-sensor-create-button (sensorCreated)="handleSensorCreated($event)"></app-sensor-create-button>
        </div>
      </div>

      <!-- Mostrar si está cargando -->
      <div class="row">
        <div class="col">
          <div *ngIf="loading" class="text-center">
            <p>Cargando sensores...</p>
          </div>
          <div *ngIf="error" class="alert alert-danger">
            Error al cargar sensores: {{ error }}
          </div>

          <!-- Tabla responsiva usando Bootstrap/CoreUI -->
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Estado de riego</th>
                  <th>Invernadero</th>
                  <th>Fecha de creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let sensor of sensors$ | async">
                  <td>{{ sensor.id }}</td>
                  <td>{{ sensor.type }}</td>

                  <!-- Badge gráfico para el estado del sensor (1: Activo, 0: Inactivo) -->
                  <td>
                    <span *ngIf="sensor.status === 1" class="badge bg-success">
                      Activo
                    </span>
                    <span *ngIf="sensor.status === 0" class="badge bg-danger">
                      Inactivo
                    </span>
                  </td>

                  <!-- Badge gráfico para el estado de riego (1: Riego Activo, 0: Riego Inactivo) -->
                  <td>
                    <span *ngIf="sensor.irrigation_status === 1" class="badge bg-info">
                      Riego Activo
                    </span>
                    <span *ngIf="sensor.irrigation_status === 0" class="badge bg-secondary">
                      Riego Inactivo
                    </span>
                  </td>

                  <!-- Mostrar nombre del invernadero -->
                  <td>{{ sensor.greenhouse?.name || 'Sin asignar' }}</td>
                  <td>{{ sensor.created_at | date: 'short' }}</td>
                  <td>
                    <div class="d-flex justify-content-between">
                      <app-sensor-edit-button
                        [sensorDetails]="sensor"
                        (sensorUpdated)="handleUpdate($event)"
                        class="btn btn-sm w-100 mx-1"
                      ></app-sensor-edit-button>
                      <app-sensor-delete-button
                        [sensorId]="sensor.id"
                        (onDelete)="handleDelete(sensor.id)"
                        class="btn btn-sm w-100 mx-1"
                      ></app-sensor-delete-button>
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
export class SensorsManagementComponent implements OnInit {
  public sensors$: Observable<Sensor[]> = this.sensorService.sensors$.pipe(
    startWith([]),
    catchError((err) => {
      this.error = 'No se pudieron cargar los sensores';
      return [];
    })
  );
  public loading = true;
  public error: string | null = null;

  constructor(
    private sensorService: SensorService,  // Servicio para manejar sensores
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Llamamos al servicio para obtener los sensores
    this.sensorService.fetchSensors();
    this.sensors$.subscribe(() => {
      this.loading = false;
      this.cdr.markForCheck();  // Forzamos la detección de cambios
    });
  }

  // Manejo de actualización del sensor
  handleUpdate(updatedSensor: any): void {
    // Actualizamos el sensor en el arreglo local
    this.sensorService.updateLocalSensor(updatedSensor);
    this.cdr.markForCheck();  // Detección de cambios manual
  }

  // Manejo de eliminación del sensor
  handleDelete(sensorId: number): void {
    this.sensorService.deleteSensor(sensorId);
    this.cdr.markForCheck();  // Actualizamos la vista tras eliminar
  }

  // Después de crear un nuevo sensor, recargamos la lista
  handleSensorCreated(newSensor: any): void {
    this.sensorService.fetchSensors();  // Recargamos la lista de sensores
  }
}
