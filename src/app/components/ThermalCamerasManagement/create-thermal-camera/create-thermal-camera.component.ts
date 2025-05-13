import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { ThermalCameraService } from '../../../core/services/thermal-camera.service'; 
import { AlertComponent,ColComponent,CardComponent,CardHeaderComponent,CardBodyComponent } from '@coreui/angular';

@Component({
  selector: 'app-create-thermal-camera',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent,ColComponent,CardComponent,CardHeaderComponent,CardBodyComponent], 
  templateUrl: './create-thermal-camera.component.html', 
})
export class CreateThermalCameraComponent implements OnInit {
  @Output() cameraCreated = new EventEmitter<any>();

  createForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private cameraService: ThermalCameraService) {}

  validateLatitude(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value >= -90 && value <= 90 ? null : { invalidLatitude: true };
    };
  }

  validateLongitude(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value >= -180 && value <= 180 ? null : { invalidLongitude: true };
    };
  }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      latitude: ['', [Validators.required, this.validateLatitude(), Validators.pattern('^-?[0-9]+(\\.[0-9]+)?$')]], 
      longitude: ['', [Validators.required, this.validateLongitude(), Validators.pattern('^-?[0-9]+(\\.[0-9]+)?$')]], 
      length: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]], 
      width: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
      height: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.createForm.valid) {
      const newCamera = this.createForm.value;

      this.successMessage = null;
      this.errorMessage = null;

      this.cameraService.createCamera(newCamera).subscribe({
        next: (camera) => {
          this.successMessage = 'Cámara creada con éxito';
          this.cameraCreated.emit(camera);
        },
        error: (error) => {
          this.errorMessage = 'Error al crear la cámara. Por favor, inténtalo de nuevo.';
        }
      });

      this.createForm.reset();
    }
  }
}