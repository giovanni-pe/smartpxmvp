import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment'; 


@Component({
  selector: 'app-thermal-camera-edit-button',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <button class="btn btn-primary btn-sm" (click)="openEditModal()">
      Editar
    </button>

    <div
      *ngIf="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="editCameraModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editCameraModalLabel">Editar Cámara</h5>
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
            <form [formGroup]="editForm" (ngSubmit)="updateCamera()">
              <div class="form-group">
                <label for="name">Nombre</label>
                <input
                  formControlName="name"
                  id="name"
                  class="form-control"
                  [ngClass]="{
                    'is-invalid':
                      editForm.get('name')?.invalid &&
                      editForm.get('name')?.touched
                  }"
                />
                <div
                  *ngIf="
                    editForm.get('name')?.invalid &&
                    editForm.get('name')?.touched
                  "
                  class="invalid-feedback"
                >
                  Nombre es requerido.
                </div>
              </div>

              <div class="form-group">
                <label for="latitude">Latitud</label>
                <input
                  formControlName="latitude"
                  id="latitude"
                  type="number"
                  class="form-control"
                  [ngClass]="{
                    'is-invalid':
                      editForm.get('latitude')?.invalid &&
                      editForm.get('latitude')?.touched
                  }"
                />
                <div
                  *ngIf="
                    editForm.get('latitude')?.invalid &&
                    editForm.get('latitude')?.touched
                  "
                  class="invalid-feedback"
                >
                  Latitud es requerida.
                </div>
              </div>

              <div class="form-group">
                <label for="longitude">Longitud</label>
                <input
                  formControlName="longitude"
                  id="longitude"
                  type="number"
                  class="form-control"
                  [ngClass]="{
                    'is-invalid':
                      editForm.get('longitude')?.invalid &&
                      editForm.get('longitude')?.touched
                  }"
                />
                <div
                  *ngIf="
                    editForm.get('longitude')?.invalid &&
                    editForm.get('longitude')?.touched
                  "
                  class="invalid-feedback"
                >
                  Longitud es requerida.
                </div>
              </div>

              <div class="form-group">
                <label for="length">Largo (m)</label>
                <input
                  formControlName="length"
                  id="length"
                  type="number"
                  class="form-control"
                  [ngClass]="{
                    'is-invalid':
                      editForm.get('length')?.invalid &&
                      editForm.get('length')?.touched
                  }"
                />
                <div
                  *ngIf="
                    editForm.get('length')?.invalid &&
                    editForm.get('length')?.touched
                  "
                  class="invalid-feedback"
                >
                  Largo es requerido.
                </div>
              </div>

              <div class="form-group">
                <label for="width">Ancho (m)</label>
                <input
                  formControlName="width"
                  id="width"
                  type="number"
                  class="form-control"
                  [ngClass]="{
                    'is-invalid':
                      editForm.get('width')?.invalid &&
                      editForm.get('width')?.touched
                  }"
                />
                <div
                  *ngIf="
                    editForm.get('width')?.invalid &&
                    editForm.get('width')?.touched
                  "
                  class="invalid-feedback"
                >
                  Ancho es requerido.
                </div>
              </div>

              <div class="form-group">
                <label for="height">Altura (m)</label>
                <input
                  formControlName="height"
                  id="height"
                  type="number"
                  class="form-control"
                  [ngClass]="{
                    'is-invalid':
                      editForm.get('height')?.invalid &&
                      editForm.get('height')?.touched
                  }"
                />
                <div
                  *ngIf="
                    editForm.get('height')?.invalid &&
                    editForm.get('height')?.touched
                  "
                  class="invalid-feedback"
                >
                  Altura es requerida.
                </div>
              </div>

              <div class="form-group">
                <label for="description">Descripción</label>
                <textarea
                  formControlName="description"
                  id="description"
                  class="form-control"
                  [ngClass]="{
                    'is-invalid':
                      editForm.get('description')?.invalid &&
                      editForm.get('description')?.touched
                  }"
                ></textarea>
                <div
                  *ngIf="
                    editForm.get('description')?.invalid &&
                    editForm.get('description')?.touched
                  "
                  class="invalid-feedback"
                >
                  Descripción es requerida.
                </div>
              </div>

              <div class="modal-footer">
                <button
                  type="submit"
                  class="btn btn-success"
                  [disabled]="editForm.invalid"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  (click)="closeModal()"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal {
        display: block;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .modal-dialog {
        max-width: 500px;
      }
      .is-invalid {
        border-color: #dc3545;
      }
    `,
  ],
})
export class ThermalCameraEditButtonComponent implements OnInit {
  private apiUrl = `${environment.apiBaseUrl}/greenhouses`;
  @Input() cameraDetails: any; // Recibimos los detalles de la cámara a editar
  @Output() cameraUpdated = new EventEmitter<any>(); // Emitimos el evento al actualizar la cámara

  showModal = false;
  editForm!: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicializamos el formulario con validaciones
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      length: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  openEditModal(): void {
    // Cargamos los datos de la cámara en el formulario al abrir el modal
    this.editForm.patchValue(this.cameraDetails);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  updateCamera(): void {
    if (this.editForm.valid) {
      this.http
        .put(
          `${this.apiUrl}/${this.cameraDetails.id}`,
          this.editForm.value
        )
        .subscribe(
          (response) => {
            console.log('Cámara actualizada con éxito:', response);
            // Emitimos el evento con los nuevos datos
            this.cameraUpdated.emit({
              ...this.cameraDetails,
              ...this.editForm.value,
            });
            this.closeModal();
          },
          (error) => {
            console.error('Error al actualizar la cámara:', error);
          }
        );
    }
  }
}
