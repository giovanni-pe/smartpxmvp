import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment'; 
@Component({
  selector: 'app-sensor-edit-button',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sensor-edit-button.component.html',
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

      /* Botones toggle personalizados */
      .btn-toggle {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 30px;
        background-color: #dc3545;
        color: white;
        border: none;
        transition: background-color 0.3s ease, transform 0.2s ease;
        display: inline-block;
      }
      .btn-toggle.active {
        background-color: #28a745;
        transform: scale(1.05);
      }
      .btn-toggle.disabled {
        background-color: #6c757d;
        cursor: not-allowed;
      }
      .btn-toggle:hover:not(.disabled) {
        cursor: pointer;
      }
    `,
  ],
})
export class SensorEditButtonComponent implements OnInit {
  private apiUrl = `${environment.apiBaseUrl}/sensors`;
  @Input() sensorDetails: any; // Recibimos los detalles del sensor a editar
  @Output() sensorUpdated = new EventEmitter<any>(); // Emitimos el evento al actualizar el sensor

  showModal = false;
  editForm!: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicializamos el formulario con validaciones
    this.editForm = this.fb.group({
      type: ['', Validators.required],
      status: ['', Validators.required],
      irrigation_status: ['', Validators.required],
      greenhouse_id: ['', Validators.required],
    });
  }

  openEditModal(): void {
    // Cargamos los datos del sensor en el formulario al abrir el modal
    this.editForm.patchValue(this.sensorDetails);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  toggleStatus(): void {
    const currentValue = this.editForm.get('status')?.value;
    this.editForm.get('status')?.setValue(currentValue === 1 ? 0 : 1);

    // Si el sensor se apaga, apagar también el sistema de riego
    if (currentValue === 1) {
      this.editForm.get('irrigation_status')?.setValue(0);
    }
  }

  toggleIrrigationStatus(): void {
    const currentValue = this.editForm.get('irrigation_status')?.value;
    // Solo permitir cambio si el sensor está encendido
    if (this.editForm.get('status')?.value === 1) {
      this.editForm.get('irrigation_status')?.setValue(currentValue === 1 ? 0 : 1);
    }
  }

  updateSensor(): void {
    if (this.editForm.valid) {
      this.http
        .put(
          `${this.apiUrl}/${this.sensorDetails.id}`,
          this.editForm.value
        )
        .subscribe(
          (response) => {
            console.log('Sensor actualizado con éxito:', response);
            // Emitimos el evento con los nuevos datos
            this.sensorUpdated.emit({
              ...this.sensorDetails,
              ...this.editForm.value,
            });
            this.closeModal();
          },
          (error) => {
            console.error('Error al actualizar el sensor:', error);
          }
        );
    }
  }
}
