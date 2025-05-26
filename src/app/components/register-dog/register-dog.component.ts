import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DogService, DogData } from '../../services/dogs/dog.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register-dog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-dog.component.html',
  styleUrls: ['./register-dog.component.scss']
})
export class RegisterDogComponent implements OnInit, OnDestroy {
  dogForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dogService: DogService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToLoadingState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToLoadingState(): void {
    this.dogService.isLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isSubmitting = loading;
      });
  }

  private initializeForm(): void {
    this.dogForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      breed: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      age: ['', [Validators.required, Validators.pattern(/^[0-9]+(\s*(años?|meses?|semanas?))?$/i)]],
      size: ['', [Validators.maxLength(30)]],
      energy_level: ['', [Validators.required]],
      photo: [null],
    });

    // Limpiar mensajes cuando el usuario empiece a escribir
    this.dogForm.valueChanges.subscribe(() => {
      if (this.successMessage || this.errorMessage) {
        this.successMessage = null;
        this.errorMessage = null;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar usando el método del servicio
      if (!this.dogService.isValidImageFile(file)) {
        this.errorMessage = `Archivo inválido. Solo se permiten imágenes (JPG, PNG, GIF, WebP) menores a ${this.dogService.formatFileSize(5 * 1024 * 1024)}.`;
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = `${file.name} (${this.dogService.formatFileSize(file.size)})`;
      this.dogForm.patchValue({ photo: file });
      this.errorMessage = null;
    } else {
      this.selectedFile = null;
      this.selectedFileName = null;
      this.dogForm.patchValue({ photo: null });
    }
  }

  onSubmit(): void {
    // Marcar todos los campos como tocados para mostrar errores
    this.markFormGroupTouched(this.dogForm);

    if (this.dogForm.valid && !this.isSubmitting) {
      this.errorMessage = null;
      this.successMessage = null;

      const dogData: DogData = {
        name: this.dogForm.value.name,
        breed: this.dogForm.value.breed,
        age: this.dogForm.value.age,
        size: this.dogForm.value.size,
        energy_level: this.dogForm.value.energy_level,
        photo: this.selectedFile || undefined
      };

      this.dogService.registerDog(dogData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.handleSuccess(response);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
      this.scrollToFirstError();
    }
  }


  private prepareFormData(): FormData {
    // Este método ya no es necesario, pero lo mantenemos por compatibilidad
    const formData = new FormData();
    const formValue = this.dogForm.value;

    Object.keys(formValue).forEach(key => {
      if (formValue[key] !== null && formValue[key] !== '') {
        if (key === 'photo' && formValue[key] instanceof File) {
          formData.append(key, formValue[key], formValue[key].name);
        } else {
          formData.append(key, formValue[key]);
        }
      }
    });

    return formData;
  }

  private handleSuccess(response: any): void {
    this.successMessage = '🎉 ¡Mascota registrada exitosamente! Bienvenido a la familia El Dorado.';
    this.resetForm();

    // Scroll suave hacia arriba para mostrar el mensaje
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  private handleError(error: any): void {
    console.error('Error al registrar la mascota:', error);

    // Usar el mensaje de error formateado del servicio
    this.errorMessage = error.userMessage || 'Ocurrió un error inesperado. Por favor intenta nuevamente.';
  }

  private resetForm(): void {
    this.dogForm.reset();
    this.dogForm.patchValue({
      energy_level: '' // Resetear el select a valor vacío
    });
    this.selectedFile = null;
    this.selectedFileName = null;

    // Limpiar el input de archivo
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.ng-invalid.ng-touched');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  // Método auxiliar para verificar si un campo específico tiene errores
  hasFieldError(fieldName: string): boolean {
    const field = this.dogForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Método auxiliar para obtener el mensaje de error específico
  getFieldError(fieldName: string): string {
    const field = this.dogForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return 'Formato inválido';
      }
    }
    return '';
  }
}
