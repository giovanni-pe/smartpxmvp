import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thermal-camera-view-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn btn-info btn-sm" (click)="openModal()">Ver</button>

    <div
      *ngIf="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="cameraDetailsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cameraDetailsModalLabel">
              Detalles de la Cámara
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
            <p><strong>ID:</strong> {{ cameraDetails?.id }}</p>
            <p><strong>Nombre:</strong> {{ cameraDetails?.name }}</p>
            <p><strong>Latitud:</strong> {{ cameraDetails?.latitude }}</p>
            <p><strong>Longitud:</strong> {{ cameraDetails?.longitude }}</p>
            <p><strong>Largo (m):</strong> {{ cameraDetails?.length }}</p>
            <p><strong>Ancho (m):</strong> {{ cameraDetails?.width }}</p>
            <p><strong>Altura (m):</strong> {{ cameraDetails?.height }}</p>
            <p>
              <strong>Descripción:</strong> {{ cameraDetails?.description }}
            </p>
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
export class ThermalCameraViewButtonComponent {
  @Input() cameraDetails: any; // Recibe los detalles de la cámara

  showModal = false;

  openModal(): void {
    this.showModal = true; // Abrimos el modal
  }

  closeModal(): void {
    this.showModal = false; // Cerramos el modal
  }
}
