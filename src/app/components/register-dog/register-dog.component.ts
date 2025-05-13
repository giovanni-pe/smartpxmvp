import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DogService } from '../../services/dogs/dog.service';  // Asegúrate de que el servicio DogService esté creado
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-dog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-dog.component.html',
  styleUrls: ['./register-dog.component.scss']
})
export class RegisterDogComponent implements OnInit {
  dogForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private dogService: DogService) { }

  ngOnInit(): void {
    // Inicializar el formulario reactivo
    this.dogForm = this.fb.group({
      name: ['', Validators.required],
      breed: ['', Validators.required],
      age: ['', Validators.required],
      size: [''],
      energy_level: ['medium', [Validators.required]],
      photo: [null],
    });
  }

  onFileSelected(event: any): void {
    // Asignar el archivo seleccionado
    this.dogForm.patchValue({ photo: event.target.files[0] });
  }

  onSubmit(): void {
    // Verificar si el formulario es válido
    if (this.dogForm.valid) {
      const dogData = this.dogForm.value;

      // Llamar al servicio para registrar el perro
      this.dogService.registerDog(dogData).subscribe({
        next: (response) => {
          this.successMessage = 'Perro registrado con éxito';
          this.dogForm.reset();  // Limpiar el formulario
        },
        error: (error) => {
          this.errorMessage = 'Hubo un error al registrar el perro. Inténtalo nuevamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos del formulario.';
    }
  }
}
