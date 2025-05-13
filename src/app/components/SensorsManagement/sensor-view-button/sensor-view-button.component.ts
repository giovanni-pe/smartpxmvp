import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sensor-view-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn btn-info btn-sm" (click)="openModal()">Ver</button>

    <div
      *ngIf="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="sensorDetailsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="sensorDetailsModalLabel">
              Detalles del Sensor
            </h5>
            <button
              type="button"
              class="close position-absolute top-0 end-0 m-2"
              aria-label="Close"
              (click)="closeModal()"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p><strong>ID:</strong> {{ sensorDetails?.id }}</p>
            <p><strong>Tipo:</strong> {{ sensorDetails?.type }}</p>
            <p><strong>Estado:</strong> {{ sensorDetails?.status }}</p>
            <p>
              <strong>Estado de Riego:</strong> {{ sensorDetails?.irrigation_status }}
            </p>
            <p><strong>ID del Invernadero:</strong> {{ sensorDetails?.greenhouse_id }}</p>
            <p><strong>Fecha de Creación:</strong> {{ sensorDetails?.created_at | date: 'short' }}</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="closeModal()"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .fade {
        opacity: 0;
        transition: opacity 0.15s linear;
      }

      .fade.show {
        opacity: 1;
      }

      .modal {
        display: block;
        background-color: rgba(0, 0, 0, 0.5);
      }

      .modal-dialog {
        max-width: 500px;
      }
    `,
  ],
})
export class SensorViewButtonComponent {
  @Input() sensorDetails: any; // Recibe los detalles del sensor

  showModal = false;

  openModal(): void {
    this.showModal = true; // Abrimos el modal
  }

  closeModal(): void {
    this.showModal = false; // Cerramos el modal
  }
}
