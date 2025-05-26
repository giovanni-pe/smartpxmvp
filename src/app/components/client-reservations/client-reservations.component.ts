import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientReservationService } from '../../services/client-reservation/client-reservation.service';

export interface ClientWalkReservation {
  id: number;
  client_id: number;
  dog_id: number;
  walker_id: number;
  reservation_date: string;
  reservation_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  walker?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    photo_url?: string;
    experience?: string;
    rating?: number;
  };
  dog?: {
    id: number;
    name: string;
    breed: string;
    age: string;
    size?: string;
    energy_level?: string;
  };
  completion_notes?: string;
  cancellation_reason?: string;
  client_rating?: number;
  client_review?: string;
  cancelled_by?: string;
}

@Component({
  selector: 'app-client-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">
          <i class="fas fa-history me-2"></i>Mis Reservaciones de Paseo
        </h2>
        <button class="btn btn-outline-primary" (click)="loadReservations()">
          <i class="fas fa-sync-alt me-2"></i>Refrescar
        </button>
      </div>

      <!-- Resumen rápido -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-center bg-warning bg-opacity-10">
            <div class="card-body">
              <h5 class="card-title">{{ getPendingCount() }}</h5>
              <p class="card-text text-muted small">Pendientes</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center bg-success bg-opacity-10">
            <div class="card-body">
              <h5 class="card-title">{{ getConfirmedCount() }}</h5>
              <p class="card-text text-muted small">Confirmadas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center bg-primary bg-opacity-10">
            <div class="card-body">
              <h5 class="card-title">{{ getInProgressCount() }}</h5>
              <p class="card-text text-muted small">En Progreso</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center bg-info bg-opacity-10">
            <div class="card-body">
              <h5 class="card-title">{{ getCompletedCount() }}</h5>
              <p class="card-text text-muted small">Completadas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Estado:</label>
              <select class="form-select" [(ngModel)]="filters.status" (change)="applyFilters()">
                <option value="">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Fecha desde:</label>
              <input type="date" class="form-control" [(ngModel)]="filters.date_from" (change)="applyFilters()">
            </div>
            <div class="col-md-3">
              <label class="form-label">Fecha hasta:</label>
              <input type="date" class="form-control" [(ngModel)]="filters.date_to" (change)="applyFilters()">
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-secondary w-100" (click)="clearFilters()">
                <i class="fas fa-times me-2"></i>Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      @if (isLoading) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando reservaciones...</p>
        </div>
      }

      <!-- Lista de Reservaciones -->
      @if (!isLoading) {
        <div class="row">
          @for (reservation of reservations; track reservation.id) {
            <div class="col-lg-6 col-xl-4 mb-4">
              <div class="card h-100 shadow-sm" [class]="getCardClass(reservation.status)">
                <!-- Header con estado -->
                <div class="card-header d-flex justify-content-between align-items-center">
                  <span class="badge" [class]="getStatusBadgeClass(reservation.status)">
                    {{ getStatusText(reservation.status) }}
                  </span>
                  <small class="text-muted">#{{ reservation.id }}</small>
                </div>

                <div class="card-body">
                  <!-- Información del Paseador -->
                  <div class="mb-3">
                    <div class="d-flex align-items-center mb-2">
                      @if (reservation.walker?.photo_url) {
                        <img [src]="reservation.walker?.photo_url"
                             class="rounded-circle me-2"
                             style="width: 40px; height: 40px; object-fit: cover;"
                             [alt]="reservation.walker?.name">
                      } @else {
                        <div class="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-2"
                             style="width: 40px; height: 40px;">
                          <i class="fas fa-user text-white"></i>
                        </div>
                      }
                      <div>
                        <h6 class="mb-0">{{ reservation.walker?.name || 'Sin asignar' }}</h6>
                        @if (reservation.walker?.rating) {
                          <small class="text-muted">
                            ⭐ {{ reservation.walker?.rating }}
                            @if (reservation.walker?.experience) {
                              • {{ reservation.walker?.experience }}
                            }
                          </small>
                        }
                      </div>
                    </div>
                  </div>

                  <!-- Información del Perro -->
                  <div class="mb-3">
                    <h6 class="mb-1">
                      <i class="fas fa-dog me-2"></i>{{ reservation.dog?.name }}
                    </h6>
                    <p class="text-muted small mb-1">
                      <strong>Raza:</strong> {{ reservation.dog?.breed }}
                    </p>
                    <p class="text-muted small mb-1">
                      <strong>Edad:</strong> {{ reservation.dog?.age }}
                    </p>
                  </div>

                  <!-- Fecha y Hora -->
                  <div class="mb-3">
                    <p class="mb-1">
                      <i class="fas fa-calendar me-2"></i>
                      <strong>{{ formatDate(reservation.reservation_date) }}</strong>
                    </p>
                    <p class="mb-0">
                      <i class="fas fa-clock me-2"></i>
                      <strong>{{ reservation.reservation_time }}</strong>
                    </p>
                  </div>

                  <!-- Notas -->
                  @if (reservation.notes) {
                    <div class="mb-3">
                      <p class="text-muted small mb-1"><strong>Mis notas:</strong></p>
                      <p class="text-muted small">{{ reservation.notes }}</p>
                    </div>
                  }

                  <!-- Notas de completado -->
                  @if (reservation.completion_notes) {
                    <div class="alert alert-success small">
                      <strong>Reporte del paseador:</strong><br>
                      {{ reservation.completion_notes }}
                    </div>
                  }

                  <!-- Motivo de cancelación -->
                  @if (reservation.cancellation_reason) {
                    <div class="alert alert-warning small">
                      <strong>Motivo de cancelación:</strong><br>
                      {{ reservation.cancellation_reason }}
                      @if (reservation.cancelled_by) {
                        <br><small class="text-muted">Cancelado por: {{ reservation.cancelled_by === 'client' ? 'ti' : 'el paseador' }}</small>
                      }
                    </div>
                  }

                  <!-- Mi calificación -->
                  @if (reservation.client_rating) {
                    <div class="alert alert-info small">
                      <strong>Mi calificación:</strong>
                      <div class="d-flex align-items-center">
                        @for (star of getStars(reservation.client_rating); track $index) {
                          <i class="fas fa-star text-warning me-1"></i>
                        }
                        <span class="ms-2">{{ reservation.client_rating }}/5</span>
                      </div>
                      @if (reservation.client_review) {
                        <div class="mt-2">{{ reservation.client_review }}</div>
                      }
                    </div>
                  }
                </div>

                <!-- Botones de Acción -->
                <div class="card-footer bg-transparent">
                  @if (reservation.status === 'pending' || reservation.status === 'confirmed') {
                    <div class="d-grid">
                      <button
                        class="btn btn-outline-danger btn-sm"
                        (click)="openCancelModal(reservation)"
                        [disabled]="processingReservation === reservation.id">
                        <i class="fas fa-times me-2"></i>Cancelar Reserva
                      </button>
                    </div>
                  }

                  @if (reservation.status === 'completed' && !reservation.client_rating) {
                    <div class="d-grid">
                      <button
                        class="btn btn-warning btn-sm"
                        (click)="openRatingModal(reservation)"
                        [disabled]="processingReservation === reservation.id">
                        <i class="fas fa-star me-2"></i>Calificar Paseo
                      </button>
                    </div>
                  }

                  @if (reservation.status === 'in_progress') {
                    <div class="text-center">
                      <small class="text-success">
                        <i class="fas fa-walking me-1"></i>Paseo en progreso...
                      </small>
                    </div>
                  }

                  @if ((reservation.status === 'completed' && reservation.client_rating) || reservation.status === 'cancelled') {
                    <div class="text-center">
                      <small class="text-muted">
                        {{ reservation.status === 'completed' ? 'Paseo finalizado' : 'Reservación cancelada' }}
                      </small>
                    </div>
                  }
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-12">
              <div class="alert alert-info text-center">
                <i class="fas fa-info-circle me-2"></i>
                No tienes reservaciones con los filtros aplicados.
                <br>
                <a href="/walkers" class="btn btn-primary mt-3">
                  <i class="fas fa-plus me-2"></i>Crear Nueva Reserva
                </a>
              </div>
            </div>
          }
        </div>
      }

      <!-- Paginación -->
      @if (totalPages > 1) {
        <nav aria-label="Paginación de reservaciones">
          <ul class="pagination justify-content-center">
            <li class="page-item" [class.disabled]="currentPage === 1">
              <button class="page-link" (click)="changePage(currentPage - 1)">Anterior</button>
            </li>
            @for (page of getPageNumbers(); track page) {
              <li class="page-item" [class.active]="page === currentPage">
                <button class="page-link" (click)="changePage(page)">{{ page }}</button>
              </li>
            }
            <li class="page-item" [class.disabled]="currentPage === totalPages">
              <button class="page-link" (click)="changePage(currentPage + 1)">Siguiente</button>
            </li>
          </ul>
        </nav>
      }
    </div>

    <!-- Modal para Cancelar -->
    @if (showCancelModal) {
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Cancelar Reservación</h5>
              <button type="button" class="btn-close" (click)="closeCancelModal()"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que quieres cancelar esta reservación?</p>
              <div class="alert alert-warning">
                <small><i class="fas fa-info-circle me-2"></i>Las reservaciones solo pueden cancelarse con al menos 2 horas de anticipación.</small>
              </div>
              <div class="mb-3">
                <label for="cancellationReason" class="form-label">Motivo (opcional):</label>
                <textarea
                  id="cancellationReason"
                  class="form-control"
                  rows="3"
                  [(ngModel)]="cancellationReason"
                  placeholder="¿Por qué necesitas cancelar esta reservación?"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeCancelModal()">No, mantener</button>
              <button type="button" class="btn btn-danger" (click)="confirmCancel()">
                <i class="fas fa-times me-2"></i>Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal para Calificar -->
    @if (showRatingModal) {
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Calificar Paseo</h5>
              <button type="button" class="btn-close" (click)="closeRatingModal()"></button>
            </div>
            <div class="modal-body">
              <p>¿Cómo estuvo el paseo con {{ selectedReservation?.walker?.name }}?</p>

              <!-- Calificación con estrellas -->
              <div class="mb-3">
                <label class="form-label">Calificación:</label>
                <div class="d-flex align-items-center">
                  @for (star of [1,2,3,4,5]; track $index) {
                    <i class="fas fa-star me-1"
                       [class.text-warning]="star <= rating"
                       [class.text-muted]="star > rating"
                       style="cursor: pointer; font-size: 1.5rem;"
                       (click)="setRating(star)"></i>
                  }
                  <span class="ms-3">{{ getRatingText(rating) }}</span>
                </div>
              </div>

              <!-- Comentario -->
              <div class="mb-3">
                <label for="review" class="form-label">Comentario (opcional):</label>
                <textarea
                  id="review"
                  class="form-control"
                  rows="4"
                  [(ngModel)]="review"
                  placeholder="Cuéntanos cómo estuvo el paseo, el comportamiento del paseador, etc."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeRatingModal()">Cancelar</button>
              <button type="button" class="btn btn-warning" (click)="submitRating()" [disabled]="rating === 0">
                <i class="fas fa-star me-2"></i>Calificar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls:['./client-reservations.component.scss']

})
export class ClientReservationsComponent implements OnInit {
  public reservations: ClientWalkReservation[] = [];
  public isLoading = false;
  public processingReservation: number | null = null;

  // Paginación
  public currentPage = 1;
  public totalPages = 1;
  public totalItems = 0;

  // Filtros
  public filters = {
    status: '',
    date_from: '',
    date_to: ''
  };

  // Modales
  public showCancelModal = false;
  public showRatingModal = false;
  public selectedReservation: ClientWalkReservation | null = null;
  public cancellationReason = '';
  public rating = 0;
  public review = '';

  // Client ID (debería venir de la autenticación)
  public clientId = 1; // Temporal, cambiar por el ID real del cliente autenticado

  constructor(
    private clientReservationService: ClientReservationService
  ) {}

  ngOnInit(): void {
    this.loadClientId();
    this.loadReservations();
  }

  loadClientId(): void {
    const userClientStr = localStorage.getItem('userClient');
    if (userClientStr) {
      try {
        const userClient = JSON.parse(userClientStr);
        this.clientId = userClient.id || 1;
        console.log('✅ Client ID cargado:', this.clientId);
      } catch (e) {
        console.error('❌ Error parsing userClient:', e);
        this.clientId = 1;
      }
    }
  }

  loadReservations(): void {
    this.isLoading = true;

    const params = {
      ...this.filters,
      page: this.currentPage
    };

    this.clientReservationService.getClientReservations(this.clientId, params).subscribe({
      next: (response) => {
        console.log('✅ Reservaciones del cliente cargadas:', response);
        this.reservations = response.data || [];
        this.currentPage = response.pagination?.current_page || 1;
        this.totalPages = response.pagination?.last_page || 1;
        this.totalItems = response.pagination?.total || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar reservaciones:', error);
        this.reservations = [];
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadReservations();
  }

  clearFilters(): void {
    this.filters = {
      status: '',
      date_from: '',
      date_to: ''
    };
    this.currentPage = 1;
    this.loadReservations();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadReservations();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Modales
  openCancelModal(reservation: ClientWalkReservation): void {
    this.selectedReservation = reservation;
    this.cancellationReason = '';
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.selectedReservation = null;
    this.cancellationReason = '';
  }

  confirmCancel(): void {
    if (!this.selectedReservation) return;

    this.processingReservation = this.selectedReservation.id;

    this.clientReservationService.cancelReservation(this.selectedReservation.id, this.cancellationReason).subscribe({
      next: (response) => {
        console.log('✅ Reservación cancelada:', response);
        this.loadReservations();
        this.closeCancelModal();
        this.processingReservation = null;
        alert('Reservación cancelada exitosamente.');
      },
      error: (error) => {
        console.error('❌ Error al cancelar reservación:', error);
        this.processingReservation = null;
        alert('Error al cancelar la reservación: ' + (error.message || 'Inténtalo de nuevo'));
      }
    });
  }

  openRatingModal(reservation: ClientWalkReservation): void {
    this.selectedReservation = reservation;
    this.rating = 0;
    this.review = '';
    this.showRatingModal = true;
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.selectedReservation = null;
    this.rating = 0;
    this.review = '';
  }

  setRating(stars: number): void {
    this.rating = stars;
  }

  submitRating(): void {
    if (!this.selectedReservation || this.rating === 0) return;

    this.processingReservation = this.selectedReservation.id;

    this.clientReservationService.rateWalk(this.selectedReservation.id, this.rating, this.review).subscribe({
      next: (response) => {
        console.log('✅ Calificación enviada:', response);
        this.loadReservations();
        this.closeRatingModal();
        this.processingReservation = null;
        alert('¡Gracias por tu calificación!');
      },
      error: (error) => {
        console.error('❌ Error al calificar:', error);
        this.processingReservation = null;
        alert('Error al enviar la calificación: ' + (error.message || 'Inténtalo de nuevo'));
      }
    });
  }

  // Métodos de utilidad
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'in_progress': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'bg-warning text-dark',
      'confirmed': 'bg-success',
      'in_progress': 'bg-primary',
      'completed': 'bg-info',
      'cancelled': 'bg-secondary'
    };
    return `badge ${classMap[status] || 'bg-secondary'}`;
  }

  getCardClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'border-warning',
      'confirmed': 'border-success',
      'in_progress': 'border-primary',
      'completed': 'border-info',
      'cancelled': 'border-secondary'
    };
    return classMap[status] || '';
  }

  getRatingText(rating: number): string {
    const ratingMap: { [key: number]: string } = {
      1: 'Muy malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente'
    };
    return ratingMap[rating] || '';
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  // Métodos para contar por estado
  getPendingCount(): number {
    return this.reservations.filter(r => r.status === 'pending').length;
  }

  getConfirmedCount(): number {
    return this.reservations.filter(r => r.status === 'confirmed').length;
  }

  getInProgressCount(): number {
    return this.reservations.filter(r => r.status === 'in_progress').length;
  }

  getCompletedCount(): number {
    return this.reservations.filter(r => r.status === 'completed').length;
  }
}
