import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraMonitoringService } from '../../../services/greenhouse-sensor-monitoring/camera-monitoring.service';  
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  CardTitleDirective,
  CardTextDirective,
  ColComponent,
  RowComponent,
  GutterDirective,
  ButtonDirective
} from '@coreui/angular';
import { CameraThermalDTO } from '../../../services/greenhouse-sensor-monitoring/camera-thermal.dto';  // Importamos el DTO

// Agregamos propiedades locales para el monitoreo de las cámaras
interface CameraThermal extends CameraThermalDTO {
  riegoActivo: boolean;
  temperatura: number;  // Propiedad para almacenar la temperatura localmente
  humedad: number;      // Propiedad para almacenar la humedad localmente
}

@Component({
  selector: 'app-sensor-monitoring',
  standalone: true,
  templateUrl: './sensor-monitoring.component.html',
  styleUrls: ['./sensor-monitoring.component.scss'],
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    GutterDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardTitleDirective,
    CardTextDirective,
    ButtonDirective,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class SensorMonitoringComponent implements OnInit, OnDestroy {
  cameras: CameraThermal[] = [];
  filteredCameras: CameraThermal[] = [];
  searchTerm: string = '';
  showRiegoActivo: boolean = false;
  private intervalId: any;

  constructor(private cameraService: CameraMonitoringService) {}

  ngOnInit(): void {
    this.loadCameras();
  }

  loadCameras(): void {
    this.cameraService.getCameras().subscribe({
      next: (cameras: CameraThermalDTO[]) => {
        // Mapear las cámaras e inicializar riegoActivo, temperatura y humedad
        this.cameras = cameras.map(camera => ({
          ...camera,
          riegoActivo: false,
          temperatura: 0,  // Inicializamos la temperatura a 0
          humedad: 0,      // Inicializamos la humedad a 0
          soil_humidity: 0
        }));
        this.filteredCameras = this.cameras;
        this.startMonitoring();
      },
      error: (error) => {
        console.error('Error fetching cameras:', error);
      }
    });
  }

  startMonitoring(): void {
    this.intervalId = setInterval(() => {
      this.cameras.forEach(camera => {
        this.cameraService.getCameraReadings(camera.id).subscribe({
          next: (data) => {
            if (data.length > 0) {
              camera.temperatura = data[0].ambient_temperature;  // Actualizamos la temperatura
              camera.humedad = data[0].relative_humidity;        // Actualizamos la humedad
              camera.soil_humidity = data[0].soil_humidity;
            }
          },
          error: (error) => {
            console.error('Error fetching camera readings:', error);
          }
        });
      });
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  filterCameras(): void {
    this.filteredCameras = this.cameras.filter(camera => 
      camera.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.showRiegoActivo || camera.riegoActivo)
    );
  }

  onSearchTermChanged(event: any): void {
    this.searchTerm = event.target.value;
    this.filterCameras();
  }

  onRiegoActivoChanged(event: any): void {
    this.showRiegoActivo = event.checked;
    this.filterCameras();
  }

  accionarRiego(camera: CameraThermal): void {
    this.cameraService.toggleIrrigation(camera.id, !camera.riegoActivo).subscribe({
      next: () => {
        camera.riegoActivo = !camera.riegoActivo;
        alert(`Riego para la cámara: ${camera.name} ahora está ${camera.riegoActivo ? 'Activo' : 'Inactivo'}`);
      },
      error: (error) => {
        console.error('Error toggling irrigation:', error);
      }
    });
  }
}
