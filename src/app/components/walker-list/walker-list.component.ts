import { Component, OnInit, WritableSignal, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WalkerService } from '../../services/walker/walker.service';
import { Walker } from '../../services/walker/walker.dto';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReservationModalComponent } from '../Reservation-modal/reservation-modal.component';

@Component({
  selector: 'app-walker-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReservationModalComponent],
  templateUrl: './walker-list.component.html',
  styleUrls: ['./walker-list.component.scss'],
  animations: [
    trigger('float', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class WalkerListComponent implements OnInit {
  @ViewChild(ReservationModalComponent) reservationModal!: ReservationModalComponent;

  public walkers: WritableSignal<Walker[]> = signal([]);
  public isLoading = false;
  public walkerPrices: string[] = [];

  // Estado de filtros y paginación
  public filters = {
    search: '',
    specialty: '',
    min_rating: undefined as number | undefined,
    sort_by: 'rating',
    order: 'desc',
    page: 1,
    per_page: 6
  };

  public totalPages = 1;

  constructor(
    private walkerService: WalkerService
  ) { }

  public floatingIcons = [
    { type: 'dog', left: '', top: '' },
    { type: 'cat', left: '', top: '' },
    { type: 'paw', left: '', top: '' },
    { type: 'bird', left: '', top: '' }
  ];

  ngOnInit(): void {
    this.initFloatingPositions();
    this.loadFilteredWalkers();
  }

  initFloatingPositions(): void {
    this.floatingIcons.forEach(icon => {
      icon.left = this.randomPosition();
      icon.top = this.randomPosition();
    });
  }

  loadFilteredWalkers(): void {
    console.log('🔄 Iniciando carga de paseadores con filtros:', this.filters);
    this.isLoading = true;

    this.walkerService.getFilteredWalkers(this.filters).subscribe({
      next: (response) => {
        console.log('✅ Respuesta completa de la API:', response);

        // Verificar la estructura de la respuesta
        let walkersData: Walker[] = [];

        if (Array.isArray(response)) {
          // Si la respuesta es directamente un array
          walkersData = response;
          this.totalPages = 1;
          this.filters.page = 1;
        } else if (response && Array.isArray(response.data)) {
          // Si la respuesta tiene formato de paginación
          walkersData = response.data;
          this.totalPages = response.last_page || 1;
          this.filters.page = response.current_page || 1;
        } else {
          console.warn('⚠️ Formato de respuesta inesperado:', response);
          walkersData = [];
        }

        console.log('📦 Walkers procesados:', walkersData);

        // Actualizar el signal
        this.walkers.set(walkersData);

        // Generar precios aleatorios
        this.walkerPrices = walkersData.map(() => this.randomPrice());

        console.log('🎯 Signal actualizado. Walkers actuales:', this.walkers());

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al obtener paseadores filtrados:', error);
        this.walkers.set([]);
        this.walkerPrices = [];
        this.isLoading = false;
      }
    });
  }

  onPageChange(direction: 'next' | 'prev') {
    if (direction === 'next' && this.filters.page < this.totalPages) {
      this.filters.page++;
      this.loadFilteredWalkers();
    } else if (direction === 'prev' && this.filters.page > 1) {
      this.filters.page--;
      this.loadFilteredWalkers();
    }
  }

  applyFilters() {
    console.log('🔍 Aplicando filtros:', this.filters);
    this.filters.page = 1;
    this.loadFilteredWalkers();
  }

  resetFilters() {
    this.filters = {
      search: '',
      specialty: '',
      min_rating: undefined,
      sort_by: 'rating',
      order: 'desc',
      page: 1,
      per_page: 6
    };
    this.loadFilteredWalkers();
  }

  randomPosition(): string {
    return `${Math.random() * 90 + 5}%`;
  }

  randomPrice(): string {
    const prices = ['15.99', '19.99', '22.50', '17.99', '24.99', '20.50'];
    return prices[Math.floor(Math.random() * prices.length)];
  }

  // Método para abrir el modal de reserva
  openReservationModal(walker: Walker): void {
    console.log('🎯 Abriendo modal de reserva para:', walker);
    this.reservationModal.openModal(walker);
  }

  // Manejar cuando se crea una reserva exitosamente
  onReservationCreated(reservation: any): void {
    console.log('🎉 Reserva creada exitosamente:', reservation);
    // Aquí puedes agregar lógica adicional como:
    // - Mostrar notificación de éxito
    // - Actualizar el estado del paseador
    // - Redirigir a una página de confirmación
    // - Enviar notificación por email
  }

  // Manejar cuando se cierra el modal
  onModalClosed(): void {
    console.log('🔒 Modal de reserva cerrado');
    // Aquí puedes agregar lógica adicional si es necesaria
  }

  getDefaultImage(): string {
    return 'assets/images/walker-placeholder.jpg';
  }

  onImageError(event: any): void {
    const img = event.target;
    if (img && !img.dataset.fallbackLoaded) {
      img.dataset.fallbackLoaded = 'true';
      img.src = 'assets/images/walker-placeholder.jpg';
    }
  }
}
