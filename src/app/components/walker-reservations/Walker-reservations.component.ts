import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalkerReservationService } from '../../services/waker-reservation/Walker-reservation.service';

export interface WalkReservation {
  id: number;
  client_id: number;
  dog_id: number;
  walker_id: number;
  reservation_date: string;
  reservation_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  client?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
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
  rejection_reason?: string;
}

@Component({
  selector: 'app-walker-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">
          <i class="fas fa-clipboard-list me-2"></i>Mis Solicitudes de Paseo
        </h2>
        <button class="btn btn-outline-primary" (click)="loadReservations()">
          <i class="fas fa-sync-alt me-2"></i>Refrescar
        </button>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
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
            <div class="col-md-3 d-flex align-items-end">
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
          <p class="mt-3 text-muted">Cargando solicitudes...</p>
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
                  <!-- Información del Cliente -->
                  <div class="mb-3">
                    <h6 class="card-title mb-1">
                      <i class="fas fa-user me-2"></i>{{ reservation.client?.name }}
                    </h6>
                    <p class="text-muted small mb-1">
                      <i class="fas fa-envelope me-1"></i>{{ reservation.client?.email }}
                    </p>
                    @if (reservation.client?.phone) {
                      <p class="text-muted small mb-0">
                        <i class="fas fa-phone me-1"></i>{{ reservation.client?.phone }}
                      </p>
                    }
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
                    @if (reservation.dog?.energy_level) {
                      <span class="badge" [class]="getEnergyBadgeClass(reservation.dog?.energy_level || '')">
                        {{ getEnergyText(reservation.dog?.energy_level || '') }}
                      </span>
                    }
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
                      <p class="text-muted small mb-1"><strong>Notas del cliente:</strong></p>
                      <p class="text-muted small">{{ reservation.notes }}</p>
                    </div>
                  }

                  <!-- Notas de completado o rechazo -->
                  @if (reservation.completion_notes) {
                    <div class="alert alert-success small">
                      <strong>Notas de completado:</strong><br>
                      {{ reservation.completion_notes }}
                    </div>
                  }

                  @if (reservation.rejection_reason) {
                    <div class="alert alert-warning small">
                      <strong>Motivo de rechazo:</strong><br>
                      {{ reservation.rejection_reason }}
                    </div>
                  }
                </div>

                <!-- Botones de Acción -->
                <div class="card-footer bg-transparent">
                  @if (reservation.status === 'pending') {
                    <div class="d-grid gap-2">
                      <button
                        class="btn btn-success btn-sm"
                        (click)="acceptReservation(reservation)"
                        [disabled]="processingReservation === reservation.id">
                        @if (processingReservation === reservation.id) {
                          <span class="spinner-border spinner-border-sm me-2"></span>
                        }
                        <i class="fas fa-check me-2"></i>Aceptar
                      </button>
                      <button
                        class="btn btn-outline-danger btn-sm"
                        (click)="openRejectModal(reservation)"
                        [disabled]="processingReservation === reservation.id">
                        <i class="fas fa-times me-2"></i>Rechazar
                      </button>
                    </div>
                  }

                  @if (reservation.status === 'confirmed') {
                    <div class="d-grid">
                      <button
                        class="btn btn-primary btn-sm"
                        (click)="startWalk(reservation)"
                        [disabled]="processingReservation === reservation.id">
                        @if (processingReservation === reservation.id) {
                          <span class="spinner-border spinner-border-sm me-2"></span>
                        }
                        <i class="fas fa-play me-2"></i>Iniciar Paseo
                      </button>
                    </div>
                  }

                  @if (reservation.status === 'in_progress') {
                    <div class="d-grid">
                      <button
                        class="btn btn-warning btn-sm"
                        (click)="openCompleteModal(reservation)"
                        [disabled]="processingReservation === reservation.id">
                        <i class="fas fa-flag-checkered me-2"></i>Completar Paseo
                      </button>
                    </div>
                  }

                  @if (reservation.status === 'completed' || reservation.status === 'cancelled') {
                    <div class="text-center">
                      <small class="text-muted">
                        {{ reservation.status === 'completed' ? 'Paseo completado' : 'Reservación cancelada' }}
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
                No se encontraron solicitudes con los filtros aplicados.
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

    <!-- Modal para Rechazar -->
    @if (showRejectModal) {
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Rechazar Solicitud</h5>
              <button type="button" class="btn-close" (click)="closeRejectModal()"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que quieres rechazar esta solicitud?</p>
              <div class="mb-3">
                <label for="rejectionReason" class="form-label">Motivo (opcional):</label>
                <textarea
                  id="rejectionReason"
                  class="form-control"
                  rows="3"
                  [(ngModel)]="rejectionReason"
                  placeholder="Explica brevemente por qué no puedes aceptar esta solicitud..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeRejectModal()">Cancelar</button>
              <button type="button" class="btn btn-danger" (click)="confirmReject()">
                <i class="fas fa-times me-2"></i>Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal para Completar -->
    @if (showCompleteModal) {
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Completar Paseo</h5>
              <button type="button" class="btn-close" (click)="closeCompleteModal()"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="completionNotes" class="form-label">Notas del paseo:</label>
                <textarea
                  id="completionNotes"
                  class="form-control"
                  rows="4"
                  [(ngModel)]="completionNotes"
                  placeholder="¿Cómo estuvo el paseo? ¿Alguna observación sobre el perro?"></textarea>
              </div>
              <div class="mb-3">
                <label for="durationMinutes" class="form-label">Duración (minutos):</label>
                <input
                  type="number"
                  id="durationMinutes"
                  class="form-control"
                  [(ngModel)]="durationMinutes"
                  min="1"
                  placeholder="45">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeCompleteModal()">Cancelar</button>
              <button type="button" class="btn btn-success" (click)="confirmComplete()">
                <i class="fas fa-check me-2"></i>Completar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./walker-reservations.component.scss'],

})
export class WalkerReservationsComponent implements OnInit {
  public reservations: WalkReservation[] = [];
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
  public showRejectModal = false;
  public showCompleteModal = false;
  public selectedReservation: WalkReservation | null = null;
  public rejectionReason = '';
  public completionNotes = '';
  public durationMinutes: number | null = null;

  // Walker ID (debería venir de la autenticación)
  public walkerId = 6; // Temporal, cambiar por el ID real del paseador autenticado

  constructor(
    private walkerReservationService: WalkerReservationService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadUserWalker();
  }

  loadReservations(): void {
    this.isLoading = true;

    const params = {
      ...this.filters,
      page: this.currentPage
    };

    this.walkerReservationService.getWalkerReservations(this.walkerId, params).subscribe({
      next: (response) => {
        console.log('✅ Reservaciones cargadas:', response);
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
  loadUserWalker(){
    const userWalker=localStorage.getItem('userWalker');
    if (userWalker) {
      const walkerData = JSON.parse(userWalker);
      this.walkerId = walkerData.id; // Asignar el ID del paseador autenticado
      this.loadReservations(); // Cargar las reservaciones del paseador
    } else {
      console.error('❌ No se encontró información del paseador en el almacenamiento local');
    }
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

  acceptReservation(reservation: WalkReservation): void {
    this.processingReservation = reservation.id;

    this.walkerReservationService.acceptReservation(reservation.id).subscribe({
      next: (response) => {
        console.log('✅ Reservación aceptada:', response);
        this.loadReservations(); // Recargar la lista
        this.processingReservation = null;
        alert('¡Reservación aceptada exitosamente!');
      },
      error: (error) => {
        console.error('❌ Error al aceptar reservación:', error);
        this.processingReservation = null;
        alert('Error al aceptar la reservación: ' + (error.message || 'Inténtalo de nuevo'));
      }
    });
  }

  openRejectModal(reservation: WalkReservation): void {
    this.selectedReservation = reservation;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedReservation = null;
    this.rejectionReason = '';
  }

  confirmReject(): void {
    if (!this.selectedReservation) return;

    this.processingReservation = this.selectedReservation.id;

    this.walkerReservationService.rejectReservation(this.selectedReservation.id, this.rejectionReason).subscribe({
      next: (response) => {
        console.log('✅ Reservación rechazada:', response);
        this.loadReservations();
        this.closeRejectModal();
        this.processingReservation = null;
        alert('Reservación rechazada exitosamente.');
      },
      error: (error) => {
        console.error('❌ Error al rechazar reservación:', error);
        this.processingReservation = null;
        alert('Error al rechazar la reservación: ' + (error.message || 'Inténtalo de nuevo'));
      }
    });
  }

  startWalk(reservation: WalkReservation): void {
    this.processingReservation = reservation.id;

    this.walkerReservationService.startWalk(reservation.id).subscribe({
      next: (response) => {
        console.log('✅ Paseo iniciado:', response);
        this.loadReservations();
        this.processingReservation = null;
        alert('¡Paseo iniciado! No olvides completarlo cuando termines.');
      },
      error: (error) => {
        console.error('❌ Error al iniciar paseo:', error);
        this.processingReservation = null;
        alert('Error al iniciar el paseo: ' + (error.message || 'Inténtalo de nuevo'));
      }
    });
  }

  openCompleteModal(reservation: WalkReservation): void {
    this.selectedReservation = reservation;
    this.completionNotes = '';
    this.durationMinutes = 45; // Valor por defecto
    this.showCompleteModal = true;
  }

  closeCompleteModal(): void {
    this.showCompleteModal = false;
    this.selectedReservation = null;
    this.completionNotes = '';
    this.durationMinutes = null;
  }

  confirmComplete(): void {
    if (!this.selectedReservation) return;

    this.processingReservation = this.selectedReservation.id;

    this.walkerReservationService.completeWalk(
      this.selectedReservation.id,
      this.completionNotes,
      this.durationMinutes || undefined
    ).subscribe({
      next: (response) => {
        console.log('✅ Paseo completado:', response);
        this.loadReservations();
        this.closeCompleteModal();
        this.processingReservation = null;
        alert('¡Paseo completado exitosamente!');
      },
      error: (error) => {
        console.error('❌ Error al completar paseo:', error);
        this.processingReservation = null;
        alert('Error al completar el paseo: ' + (error.message || 'Inténtalo de nuevo'));
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

  getEnergyText(energy: string): string {
    const energyMap: { [key: string]: string } = {
      'low': 'Baja Energía',
      'medium': 'Energía Media',
      'high': 'Alta Energía'
    };
    return energyMap[energy] || energy || 'Sin especificar';
  }

  getEnergyBadgeClass(energy: string): string {
    const classMap: { [key: string]: string } = {
      'low': 'bg-success',
      'medium': 'bg-warning text-dark',
      'high': 'bg-danger'
    };
    return `badge ${classMap[energy] || 'bg-secondary'}`;
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
