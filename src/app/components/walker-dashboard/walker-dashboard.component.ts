import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonDirective,
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ColComponent,
  ProgressComponent,
  RowComponent,
  WidgetStatAComponent
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { WalkerDashboardService } from '../../services/walker-dashboard/dashboard.service';

// Importar Iconify
import Icon from "@iconify/iconify";

interface SimpleWalkerStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  completedReservations: number;
  averageRating: number;
  totalReviews: number;
  thisMonthReservations: number;
  lastMonthReservations: number;
  totalClients: number;
  totalDogs: number;
}

@Component({
  selector: 'app-walker-dashboard',
  styleUrls: ['./walker-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AvatarComponent,
    BadgeComponent,
    ButtonDirective,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ColComponent,
    ProgressComponent,
    RowComponent,
    WidgetStatAComponent,
    ChartjsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container-fluid">
      <!-- Header de Bienvenida -->
       <div class="luxury-bg-elements">
  <!-- Ornamentos dorados en las esquinas -->
  <div class="gold-ornament top-left"></div>
  <div class="gold-ornament top-right"></div>
  <div class="gold-ornament bottom-left"></div>
  <div class="gold-ornament bottom-right"></div>

  <!-- Iconos de animales flotantes -->
  <div class="animal-icon dog-icon"></div>
  <div class="animal-icon cat-icon"></div>
  <div class="animal-icon paw-icon"></div>
  <div class="animal-icon bird-icon"></div>
</div>
      <c-row class="mb-4">
        <c-col sm="12">
          <c-card class="bg-gradient-primary text-white">
            <c-card-body>
              <div class="d-flex align-items-center">
                <c-avatar
                  size="xl"
                  [src]="walkerProfile.photo_url || 'assets/images/walker-placeholder.jpg'"
                  class="me-4">
                </c-avatar>
                <div class="flex-grow-1">
                  <h2 class="mb-1">¡Hola, {{ walkerProfile.name }}! 👋</h2>
                  <p class="mb-2 opacity-75">
                    <iconify-icon icon="mdi:star" class="me-2"></iconify-icon>
                    {{ stats.averageRating }}/5.0 • {{ stats.totalReviews }} reseñas
                  </p>
                  <div class="d-flex gap-3">
                    <span class="badge bg-light text-dark">
                      <iconify-icon icon="mdi:dog" class="me-1"></iconify-icon>
                      {{ stats.completedReservations }} paseos completados
                    </span>
                    <span class="badge bg-light text-dark">
                      <iconify-icon icon="mdi:account-group" class="me-1"></iconify-icon>
                      {{ stats.totalClients }} clientes atendidos
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <div class="display-6 fw-bold">{{ stats.pendingReservations }}</div>
                  <small class="opacity-75">Pendientes</small>
                </div>
              </div>
            </c-card-body>
          </c-card>
        </c-col>
      </c-row>

      <!-- Widgets de Estadísticas -->
      <c-row class="mb-4">
        <c-col sm="6" lg="3">
          <c-widget-stat-a
            [title]="stats.totalReservations.toString()"
            [subtitle]="'Total Reservas'"
            [color]="'primary'">
            <div class="widget-icon">
              <iconify-icon icon="mdi:calendar-multiple" style="font-size: 2rem;"></iconify-icon>
            </div>
            <div class="text-xs">
              Todas las reservas recibidas
            </div>
          </c-widget-stat-a>
        </c-col>

        <c-col sm="6" lg="3">
          <c-widget-stat-a
            [title]="stats.completedReservations.toString()"
            [subtitle]="'Paseos Completados'"
            [color]="'success'">
            <div class="widget-icon">
              <iconify-icon icon="mdi:dog" style="font-size: 2rem;"></iconify-icon>
            </div>
            <div class="text-xs">
              <iconify-icon icon="mdi:trending-up" class="me-1"></iconify-icon>
              {{ getCompletionRate() }}% tasa de éxito
            </div>
          </c-widget-stat-a>
        </c-col>

        <c-col sm="6" lg="3">
          <c-widget-stat-a
            [title]="stats.thisMonthReservations.toString()"
            [subtitle]="'Este Mes'"
            [color]="'warning'">
            <div class="widget-icon">
              <iconify-icon icon="mdi:clock-outline" style="font-size: 2rem;"></iconify-icon>
            </div>
            <div class="text-xs">
              {{ getMonthlyChange() }}% vs mes anterior
            </div>
          </c-widget-stat-a>
        </c-col>

        <c-col sm="6" lg="3">
          <c-widget-stat-a
            [title]="stats.totalDogs.toString()"
            [subtitle]="'Perros Diferentes'"
            [color]="'info'">
            <div class="widget-icon">
              <iconify-icon icon="mdi:dog-side" style="font-size: 2rem;"></iconify-icon>
            </div>
            <div class="text-xs">
              Variedad de razas atendidas
            </div>
          </c-widget-stat-a>
        </c-col>
      </c-row>

      <c-row>
        <!-- Distribución de Estados -->
        <c-col sm="12" lg="8">
          <c-card class="mb-4">
            <c-card-header>
              <strong>Distribución de Reservas</strong>
              <small class="text-muted ms-2">Estado actual de tus reservas</small>
            </c-card-header>
            <c-card-body>
              <c-row class="text-center">
                <c-col sm="4">
                  <div class="border-end">
                    <div class="fs-2 fw-semibold text-success">{{ stats.completedReservations }}</div>
                    <div class="text-uppercase text-muted small">Completadas</div>
                    <c-progress
                      [value]="getProgressPercentage(stats.completedReservations, stats.totalReservations)"
                      color="success"
                      class="mt-2">
                    </c-progress>
                  </div>
                </c-col>
                <c-col sm="4">
                  <div class="border-end">
                    <div class="fs-2 fw-semibold text-warning">{{ stats.confirmedReservations }}</div>
                    <div class="text-uppercase text-muted small">Confirmadas</div>
                    <c-progress
                      [value]="getProgressPercentage(stats.confirmedReservations, stats.totalReservations)"
                      color="warning"
                      class="mt-2">
                    </c-progress>
                  </div>
                </c-col>
                <c-col sm="4">
                  <div>
                    <div class="fs-2 fw-semibold text-primary">{{ stats.pendingReservations }}</div>
                    <div class="text-uppercase text-muted small">Pendientes</div>
                    <c-progress
                      [value]="getProgressPercentage(stats.pendingReservations, stats.totalReservations)"
                      color="primary"
                      class="mt-2">
                    </c-progress>
                  </div>
                </c-col>
              </c-row>
            </c-card-body>
          </c-card>
        </c-col>

        <!-- Resumen de Calificación -->
        <c-col sm="12" lg="4">
          <c-card class="mb-4">
            <c-card-header>
              <strong>Mi Calificación</strong>
            </c-card-header>
            <c-card-body class="text-center">
              <div class="display-3 text-warning mb-2">{{ stats.averageRating }}</div>
              <div class="mb-2">
                @for (star of getStars(stats.averageRating); track $index) {
                  <i class="fas fa-star text-warning me-1" style="font-size: 1.5rem;"></i>
                }
              </div>
              <div class="text-muted">Basado en {{ stats.totalReviews }} reseñas</div>
              <hr>
              <div class="row">
                <div class="col-6">
                  <div class="fs-4 fw-semibold">{{ stats.totalClients }}</div>
                  <div class="text-uppercase text-muted small">Clientes</div>
                </div>
                <div class="col-6">
                  <div class="fs-4 fw-semibold">{{ stats.totalDogs }}</div>
                  <div class="text-uppercase text-muted small">Perros</div>
                </div>
              </div>
            </c-card-body>
          </c-card>
        </c-col>
      </c-row>



  `,
})
export class WalkerDashboardComponent implements OnInit {
  public walkerProfile = {
    id: 1,
    name: 'Walker',
    photo_url: '',
    email: ''
  };

  public stats: SimpleWalkerStats = {
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    completedReservations: 0,
    averageRating: 0,
    totalReviews: 0,
    thisMonthReservations: 0,
    lastMonthReservations: 0,
    totalClients: 0,
    totalDogs: 0
  };

  public monthlyChartData: any;
  public monthlyChartOptions: any;

  constructor(private dashboardService: WalkerDashboardService) {
    this.initializeChart();
  }

  ngOnInit(): void {
    this.loadWalkerProfile();
    this.loadStats();
  }

  loadWalkerProfile(): void {
    const userData = localStorage.getItem('userWalker');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.walkerProfile = {
          id: user.id || 1,
          name: user.name || 'Walker',
          photo_url: user.photo_url || '',
          email: user.email || ''
        };
      } catch (e) {
        console.error('Error parsing walker user:', e);
        this.walkerProfile.id = 1;
        this.walkerProfile.name = 'Walker';
      }
    }
  }

  loadStats(): void {
    if (!this.walkerProfile.id) {
      console.warn('No walker ID available');
      return;
    }

    this.dashboardService.getSimpleWalkerStats(this.walkerProfile.id).subscribe({
      next: (response) => {
        console.log('✅ Estadísticas cargadas:', response);
        if (response && response.data) {
          this.stats = response.data;
          // Actualizar perfil si viene en la respuesta
          if (response.data.walkerInfo) {
            this.walkerProfile.name = response.data.walkerInfo.name || this.walkerProfile.name;
            this.walkerProfile.photo_url = response.data.walkerInfo.photo_url || this.walkerProfile.photo_url;
          }
        }
        this.updateChart();
      },
      error: (error) => {
        console.error('❌ Error al cargar estadísticas:', error);
        // Mantener valores por defecto en caso de error
      }
    });
  }

  refreshStats(): void {
    this.loadStats();
  }

  getCompletionRate(): string {
    if (!this.stats || this.stats.totalReservations === 0) return '0';
    return ((this.stats.completedReservations / this.stats.totalReservations) * 100).toFixed(1);
  }

  getMonthlyChange(): string {
    if (!this.stats || this.stats.lastMonthReservations === 0) return '0';
    const change = ((this.stats.thisMonthReservations - this.stats.lastMonthReservations) / this.stats.lastMonthReservations) * 100;
    return change > 0 ? '+' + change.toFixed(1) : change.toFixed(1);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getProgressPercentage(value: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.min((value / total) * 100, 100);
  }

  initializeChart(): void {
    this.monthlyChartData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Reservas Completadas',
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: '#667eea',
          borderColor: '#667eea',
          borderWidth: 1
        }
      ]
    };

    this.monthlyChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    };
  }

  updateChart(): void {
    if (!this.walkerProfile.id) return;

    // Actualizar con datos reales del backend
    this.dashboardService.getMonthlyChart(this.walkerProfile.id).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.monthlyChartData.datasets[0].data = response.data.reservations || [0, 0, 0, 0, 0, 0];
          this.monthlyChartData.labels = response.data.labels || ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        }
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
        // Mantener datos por defecto
      }
    });
  }
}
