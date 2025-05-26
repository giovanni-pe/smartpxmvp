import { style } from '@angular/animations';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Walker } from '../../services/walker/walker.dto';
import { DogService } from '../../services/dogs/dog.service';
import { WalkReservationService, ReservationData } from '../../services/walk-reservation/walk-reservation.service';

@Component({
  selector: 'app-reservation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="reservationModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="reservationModalLabel">
              <i class="fas fa-calendar-check me-2"></i>Crear Reserva de Paseo
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
            @if (selectedWalker) {
              <!-- Información del paseador seleccionado -->
              <div class="alert alert-info mb-4">
                <div class="row align-items-center">
                  <div class="col-md-3">
                    <img [src]="selectedWalker.photo_url || 'assets/images/walker-placeholder.jpg'"
                         class="img-fluid rounded-circle"
                         style="width: 80px; height: 80px; object-fit: cover;"
                         [alt]="selectedWalker.name">
                  </div>
                  <div class="col-md-9">
                    <h6 class="mb-1"><strong>Paseador:</strong> {{ selectedWalker.name }}</h6>
                    <p class="mb-1"><strong>Experiencia:</strong> {{ selectedWalker.experience || 'No especificada' }}</p>
                    <p class="mb-0"><strong>Calificación:</strong>
                      <span class="badge bg-warning text-dark">⭐ {{ selectedWalker.rating || 'N/A' }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Formulario de reserva -->
              <form #reservationForm="ngForm">
                <div class="row">
                  <!-- Selección de perro -->
                  <div class="col-md-6 mb-3">
                    <label for="dogSelect" class="form-label">
                      <i class="fas fa-dog me-2"></i>Selecciona tu perro *
                    </label>
                    <select class="form-select"
                            id="dogSelect"
                            [(ngModel)]="reservationData.dog_id"
                            name="dog_id"
                            required>
                      <option value="">-- Selecciona un perro --</option>
                      @for (dog of dogs; track dog.id) {
                        <option [value]="dog.id">{{ dog.name }} - {{ dog.breed }}</option>
                      }
                    </select>
                    @if (dogs.length === 0) {
                      <div class="text-muted small mt-1">
                        <i class="fas fa-info-circle me-1"></i>No tienes perros registrados
                      </div>
                    }
                  </div>

                  <!-- Fecha de reserva -->
                  <div class="col-md-6 mb-3">
                    <label for="reservationDate" class="form-label">
                      <i class="fas fa-calendar me-2"></i>Fecha de la reserva *
                    </label>
                    <input type="date"
                           class="form-control"
                           id="reservationDate"
                           [(ngModel)]="reservationData.reservation_date"
                           name="reservation_date"
                           [min]="minDate"
                           required>
                  </div>

                  <!-- Hora de reserva -->
                  <div class="col-md-6 mb-3">
                    <label for="reservationTime" class="form-label">
                      <i class="fas fa-clock me-2"></i>Hora de la reserva *
                    </label>
                    <select class="form-select"
                            id="reservationTime"
                            [(ngModel)]="reservationData.reservation_time"
                            name="reservation_time"
                            required>
                      <option value="">-- Selecciona una hora --</option>
                      @for (time of availableTimes; track time) {
                        <option [value]="time">{{ time }}</option>
                      }
                    </select>
                  </div>

                  <!-- Notas adicionales (opcional) -->
                  <div class="col-12 mb-3">
                    <label for="notes" class="form-label">
                      <i class="fas fa-sticky-note me-2"></i>Notas adicionales (opcional)
                    </label>
                    <textarea class="form-control"
                              id="notes"
                              [(ngModel)]="reservationData.notes"
                              name="notes"
                              rows="3"
                              placeholder="Instrucciones especiales, medicamentos, comportamiento del perro, etc."></textarea>
                  </div>
                </div>

                <!-- Verificación de disponibilidad -->
                @if (reservationData.walker_id && reservationData.reservation_date && reservationData.reservation_time) {
                  <div class="mb-3">
                    <button type="button"
                            class="btn btn-outline-info btn-sm"
                            [disabled]="isCheckingAvailability"
                            (click)="checkAvailability()">
                      @if (isCheckingAvailability) {
                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                        Verificando...
                      } @else {
                        <i class="fas fa-search me-2"></i>Verificar Disponibilidad
                      }
                    </button>
                    @if (availabilityMessage) {
                      <div class="alert alert-info mt-2 mb-0" [class.alert-success]="availabilityMessage.includes('disponible')" [class.alert-warning]="!availabilityMessage.includes('disponible')">
                        <i class="fas fa-info-circle me-2"></i>{{ availabilityMessage }}
                      </div>
                    }
                  </div>
                }

                <!-- Errores de validación -->
                @if (validationErrors.length > 0) {
                  <div class="alert alert-danger">
                    <h6><i class="fas fa-exclamation-triangle me-2"></i>Por favor corrige los siguientes errores:</h6>
                    <ul class="mb-0">
                      @for (error of validationErrors; track error) {
                        <li>{{ error }}</li>
                      }
                    </ul>
                  </div>
                }

                <!-- Debug de IDs (remover en producción) -->
                <div class="alert alert-light mt-2" style="font-size: 0.8rem;">
                  <strong>Debug:</strong>
                  Client ID: {{ userClientId }} |
                  Dog ID: {{ reservationData.dog_id }} |
                  Walker ID: {{ reservationData.walker_id }}
                </div>

                <!-- Resumen de la reserva -->
                @if (isFormValid()) {
                  <div class="alert alert-success">
                    <h6><i class="fas fa-check-circle me-2"></i>Resumen de la reserva:</h6>
                    <ul class="mb-0">
                      <li><strong>Paseador:</strong> {{ selectedWalker.name }}</li>
                      <li><strong>Perro:</strong> {{ getSelectedDogName() }}</li>
                      <li><strong>Fecha:</strong> {{ formatDate(reservationData.reservation_date) }}</li>
                      <li><strong>Hora:</strong> {{ reservationData.reservation_time }}</li>
                      @if (reservationData.notes) {
                        <li><strong>Notas:</strong> {{ reservationData.notes }}</li>
                      }
                    </ul>
                  </div>
                }
              </form>
            } @else {
              <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                No se ha seleccionado un paseador.
              </div>
            }
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">
              <i class="fas fa-times me-2"></i>Cancelar
            </button>
            <button type="button"
                    class="btn btn-primary"
                    [disabled]="!isFormValid() || isSubmitting"
                    (click)="makeReservation()">
              @if (isSubmitting) {
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Procesando...
              } @else {
                <i class="fas fa-calendar-check me-2"></i>Confirmar Reserva
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
 styleUrls: ['./reservation-modal.component.scss'],
})
export class ReservationModalComponent implements OnInit {
  @Input() selectedWalker: Walker | null = null;
  @Output() reservationCreated = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  public showModal = false;
  public dogs: any[] = [];
  public isSubmitting = false;
  public minDate: string;
  public isCheckingAvailability = false;
  public availabilityMessage = '';
  public validationErrors: string[] = [];
  public userClientId: number = 0;

  public reservationData: ReservationData = {
    client_id: 0, // Se inicializa en 0 y se actualiza en ngOnInit
    dog_id: 0,
    walker_id: 0,
    reservation_date: '',
    reservation_time: '',
    notes: ''
  };

  public availableTimes = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  constructor(
    private dogService: DogService,
    private walkReservationService: WalkReservationService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadDogs();
  }
  loadUserClientId(): void {
 const userClientStr = localStorage.getItem('userClient');
 if (userClientStr) {
   try {
     const userClient = JSON.parse(userClientStr);
     this.userClientId = userClient.id || 0;
     this.reservationData.client_id = this.userClientId;
     console.log("✅ userClient encontrado:", userClient);
     console.log("✅ Client ID asignado:", this.userClientId);
   } catch (e) {
     console.error('❌ Error parsing userClient from localStorage:', e);
     this.userClientId = 0;
     this.reservationData.client_id = 0;
   }
 } else {
   console.warn('⚠️ No se encontró userClient en localStorage');
   this.userClientId = 0;
   this.reservationData.client_id = 0;
 }
}
  loadDogs(): void {
    this.dogService.getDogs({ page: 1, name: '', age: '' }).subscribe({
      next: (response) => {
        console.log('✅ Respuesta de perros:', response);

        // Manejar diferentes estructuras de respuesta
        if (response && response.data && Array.isArray(response.data)) {
          this.dogs = response.data;
        } else if (Array.isArray(response)) {
          this.dogs = response;
        } else {
          this.dogs = [];
        }

        console.log('✅ Perros procesados:', this.dogs);
        console.log('✅ Cantidad de perros:', this.dogs.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar perros:', error);
        this.dogs = [];
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.selectedWalker &&
      this.reservationData.dog_id &&
      this.reservationData.reservation_date &&
      this.reservationData.reservation_time &&
      this.validationErrors.length === 0
    );
  }

  getSelectedDogName(): string {
    const selectedDog = this.dogs.find(dog => dog.id == this.reservationData.dog_id);
    return selectedDog ? `${selectedDog.name} (${selectedDog.breed})` : '';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  checkAvailability(): void {
    if (!this.selectedWalker || !this.reservationData.reservation_date || !this.reservationData.reservation_time) {
      return;
    }

    this.isCheckingAvailability = true;
    this.availabilityMessage = '';

    this.walkReservationService.checkAvailability(
      this.selectedWalker.id,
      this.reservationData.reservation_date,
      this.reservationData.reservation_time
    ).subscribe({
      next: (response) => {
        console.log('🔍 Disponibilidad verificada:', response);

        if (response.available) {
          this.availabilityMessage = '✅ El paseador está disponible en esta fecha y hora';
        } else {
          this.availabilityMessage = '⚠️ El paseador no está disponible. Por favor selecciona otra fecha u hora.';
        }

        this.isCheckingAvailability = false;
      },
      error: (error) => {
        console.error('❌ Error al verificar disponibilidad:', error);
        this.availabilityMessage = '❌ No se pudo verificar la disponibilidad';
        this.isCheckingAvailability = false;
      }
    });
  }

  makeReservation(): void {
    this.validationErrors = [];

    if (!this.selectedWalker) {
      this.validationErrors.push('No se ha seleccionado un paseador');
      return;
    }

    const reservationPayload: ReservationData = {
      ...this.reservationData,
      walker_id: this.selectedWalker.id
    };

    const validation = this.walkReservationService.validateReservationData(reservationPayload);
    if (!validation.isValid) {
      this.validationErrors = validation.errors;
      return;
    }

    this.isSubmitting = true;
    console.log('📋 Datos de reserva a enviar:', reservationPayload);

    this.walkReservationService.createReservation(reservationPayload).subscribe({
      next: (response) => {
        console.log('✅ Reserva creada exitosamente:', response);

        this.reservationCreated.emit(response);
        this.showSuccessMessage(response);
        this.closeModal();

        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('❌ Error al crear la reserva:', error);

        if (error.errors && Array.isArray(error.errors)) {
          this.validationErrors = error.errors;
        } else {
          this.validationErrors = [error.message || 'Error al crear la reserva. Inténtalo de nuevo más tarde.'];
        }

        this.isSubmitting = false;
      }
    });
  }

  private showSuccessMessage(response: any): void {
    let message = '¡Reserva creada exitosamente!';

    if (response.reservation) {
      const reservation = response.reservation;
      message += `\n\nDetalles:`;
      message += `\n• ID de reserva: #${reservation.id}`;
      message += `\n• Fecha: ${this.formatDate(reservation.reservation_date)}`;
      message += `\n• Hora: ${reservation.reservation_time}`;
      message += `\n• Estado: ${this.getStatusText(reservation.status)}`;
    }

    message += '\n\nEl paseador será notificado y podrás ver el estado de tu reserva en tu panel.';
    alert(message);
  }

  private getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente de confirmación',
      'confirmed': 'Confirmada',
      'in_progress': 'En progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };

    return statusMap[status] || status;
  }

  openModal(walker: Walker): void {
    this.selectedWalker = walker;
    this.showModal = true;

    // Asegurar que tenemos el client_id actualizado
    this.loadUserClientId();

    // Limpiar formulario pero mantener IDs importantes
    this.reservationData = {
      client_id: this.userClientId,
      dog_id: 0,
      walker_id: walker.id,
      reservation_date: '',
      reservation_time: '',
      notes: ''
    };

    // Limpiar estados
    this.validationErrors = [];
    this.availabilityMessage = '';
    this.isSubmitting = false;
    this.isCheckingAvailability = false;

    console.log('✅ Modal abierto para paseador:', walker.name);
    console.log('✅ Client ID en modal:', this.userClientId);
    console.log('✅ Walker ID en modal:', walker.id);
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
    this.modalClosed.emit();
    console.log('✅ Modal cerrado correctamente');
  }

  resetForm(): void {
    this.reservationData = {
      client_id: this.userClientId || 0, // Mantener el client_id correcto
      dog_id: 0,
      walker_id: this.selectedWalker?.id || 0, // Mantener walker_id si existe
      reservation_date: '',
      reservation_time: '',
      notes: ''
    };
    this.validationErrors = [];
    this.availabilityMessage = '';
    this.isSubmitting = false;
    this.isCheckingAvailability = false;
  }
}
