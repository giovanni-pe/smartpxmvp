import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WalkerService } from '../../services/walker/walker.service';
import { Walker } from '../../services/walker/walker.dto';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { WalkReservationService } from '../../services/walk-reservation/walk-reservation.service';
import { DogService } from '../../services/dogs/dog.service';  // Asegúrate de que el servicio DogService esté creado

@Component({
  selector: 'app-walker-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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
  public walkers: WritableSignal<Walker[]> = signal([]);
  public isLoading = false;
  public walkerPrices: string[] = [];

  // Estado de filtros y paginación
  public filters = {
    search: '',
    specialty: '',
    min_rating: undefined as number | undefined, // <--- este cambio
    sort_by: 'rating',
    order: 'desc',
    page: 1,
    per_page: 6
  };


  public totalPages = 1;

  constructor(private walkerService: WalkerService,private dogService: DogService,
    private walkReservationService: WalkReservationService) { }
  public floatingIcons = [
    { type: 'dog', left: '', top: '' },
    { type: 'cat', left: '', top: '' },
    { type: 'paw', left: '', top: '' },
    { type: 'bird', left: '', top: '' }
  ];
  ngOnInit(): void {
    this.initFloatingPositions();
    this.loadFilteredWalkers();
       this.loadDogs();
  }
  initFloatingPositions(): void {
    this.floatingIcons.forEach(icon => {
      icon.left = this.randomPosition();
      icon.top = this.randomPosition();
    });
  }
  loadFilteredWalkers(): void {

    this.isLoading = true;
    this.walkerService.getFilteredWalkers(this.filters).subscribe({
      next: (response) => {
        console.log('Respuesta paginada:', response);
        this.walkers.set(response.data);
        this.totalPages = response.last_page;
        this.filters.page = response.current_page;
        this.isLoading = false;
        this.walkers.set(response.data);
        this.walkerPrices = response.data.map(() => this.randomPrice());

      },
      error: (error) => {
        console.error('Error al obtener paseadores filtrados:', error);
        this.walkers.set([]);
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
    this.filters.page = 1; // Reiniciar paginación al aplicar filtro
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

  public selectedWalker: Walker | null = null;  // Paseador seleccionado
  public dogs: any[] = [];  // Perros del cliente
  public selectedDog: number | null = null;  // Perro seleccionado
  public reservationDate: string = '';  // Fecha de la reserva
  public reservationTime: string = '';  // Hora de la reserva




  // Cargar paseadores filtrados
  loadWalkers() {
    this.isLoading = true;
    this.walkerService.getWalkers().subscribe({
      next: (response) => {
        this.walkers.set(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener paseadores:', error);
        this.isLoading = false;
      }
    });
  }

  // Cargar los perros del cliente logueado
  loadDogs() {
    this.dogService.getDogs({ page: 1, name: '', age: '' }).subscribe({
      next: (response) => {
        this.dogs = response.data;
      },
      error: (error) => {
        console.error('Error al obtener perros del cliente:', error);
      }
    });
  }

  // Abrir el modal de reserva y asignar el paseador seleccionado
  openReservationModal(walker: Walker) {
    this.selectedWalker = walker;
    // Abrir el modal (si estás usando Bootstrap, esto lo puedes hacer de esta manera)
    // Ensure Bootstrap is globally available
    const modal = new (window as any).bootstrap.Modal(document.getElementById('reservationModal'));
    modal.show();
  }

  // Crear la reserva
  makeReservation() {
    if (this.selectedWalker && this.selectedDog && this.reservationDate && this.reservationTime) {
      const reservationData = {
        client_id: 1,  // Esto debe ser el ID del cliente logueado
        dog_id: this.selectedDog,
        reservation_date: this.reservationDate,
        reservation_time: this.reservationTime,
        walker_id: this.selectedWalker.id
      };

      this.walkReservationService.createReservation(reservationData).subscribe({
        next: (response) => {
          console.log('Reserva creada con éxito:', response);
          // Cerrar el modal
          const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
          modal.hide();
        },
        error: (error) => {
          console.error('Error al crear la reserva:', error);
        }
      });
    } else {
      alert('Por favor, complete todos los campos antes de reservar.');
    }
  }
}
