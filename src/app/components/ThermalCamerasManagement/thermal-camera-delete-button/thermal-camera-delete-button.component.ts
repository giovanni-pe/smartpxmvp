import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thermal-camera-delete-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn btn-danger btn-sm" (click)="openConfirmModal()">
      Eliminar
    </button>

    <!-- Modal de confirmación -->
    <div
      *ngIf="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="confirmDeleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmDeleteModalLabel">
              Confirmar Eliminación
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
          <div class="modal-body" id="confirmDeleteModalDescription">
            <p>
              ¿Estás seguro de que deseas eliminar la cámara con ID
              {{ cameraId }}?
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" (click)="confirmDelete()">
              Confirmar
            </button>
            <button class="btn btn-secondary" (click)="closeModal()">
              Cancelar
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
        max-width: 400px;
      }
    `,
  ],
})
export class ThermalCameraDeleteButtonComponent {
  @Input() cameraId!: number;
  @Output() onDelete = new EventEmitter<number>();

  showModal = false;

  // Abre el modal de confirmación
  openConfirmModal(): void {
    this.showModal = true;
  }

  // Cierra el modal de confirmación
  closeModal(): void {
    this.showModal = false;
  }

  // Confirmamos la eliminación y emitimos el evento
  confirmDelete(): void {
    this.onDelete.emit(this.cameraId); // Emitimos el ID de la cámara para eliminar
    this.closeModal(); // Cerramos el modal
  }
}
