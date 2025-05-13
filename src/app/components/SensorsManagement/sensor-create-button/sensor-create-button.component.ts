import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SensorManagementService } from '../../../services/sensor-mangement/sensor-creation/sensor-management.service';
import { GreenhouseSelectorDTO } from '../../../services/sensor-mangement/sensor-creation/greenhouse-selector.dto';
import { SensorCreationDTO } from '../../../services/sensor-mangement/sensor-creation/sensor-creation.dto';

@Component({
  selector: 'app-sensor-create-button',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sensor-create-button.component.html',
  styleUrls: ['./sensor-create-button.component.scss']
})
export class SensorCreateButtonComponent implements OnInit {
  @Output() sensorCreated = new EventEmitter<SensorCreationDTO>(); // Emitimos un evento cuando se crea el sensor
  showModal = false;
  createForm!: FormGroup;
  greenhouses: GreenhouseSelectorDTO[] = [];  // Lista de invernaderos

  constructor(
    private sensorService: SensorManagementService, // Inyectamos el servicio de manejo de sensores
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario con validaciones
    this.createForm = this.fb.group({
      type: ['', Validators.required],
      greenhouse_id: [null, Validators.required], // Selector de invernaderos
    });

    // Cargamos la lista de invernaderos
    this.loadGreenhouses();
  }

  // Método para cargar los invernaderos desde el servicio
  loadGreenhouses(): void {
    this.sensorService.getGreenhouseSelectors().subscribe(
      (response) => {
        this.greenhouses = response.data;
      },
      (error) => {
        console.error('Error al cargar los invernaderos', error);
      }
    );
  }

  openCreateModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  createSensor(): void {
    if (this.createForm.valid) {
      const sensorData: SensorCreationDTO = this.createForm.value;
      this.sensorService.createSensor(sensorData).subscribe(
        (response) => {
          console.log('Sensor creado con éxito:', response);
          this.sensorCreated.emit(response.data); // Emitimos el evento con los datos del nuevo sensor
          this.closeModal();
        },
        (error) => {
          console.error('Error al crear el sensor:', error);
        }
      );
    }
  }
}
