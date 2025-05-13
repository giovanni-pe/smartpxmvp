import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // <--- Aquí añadimos CommonModule
import { environment } from '../../../../environments/environment'; 
@Component({
  selector: 'app-relative-humidity',
  standalone: true,
  imports: [FormsModule, ChartjsComponent, CommonModule],
  template: `
    <div>
      <h3 style="background-color: #43b4dd; color: white; padding: 10px 20px; border-radius: 30%; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        Reporte de Humedad Relativa
      </h3>

      <div class="filters">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" [(ngModel)]="startDate" (change)="onDateChange()" />

        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" [(ngModel)]="endDate" (change)="onDateChange()" />

        <label for="greenhouseSelect">Greenhouse:</label>
        <select id="greenhouseSelect" [(ngModel)]="selectedGreenhouse" (change)="onGreenhouseChange()">
          <option *ngFor="let greenhouse of greenhouses" [value]="greenhouse.id">{{ greenhouse.name }}</option>
        </select>
      </div>

      <c-chart type="line" [data]="lineChartData"></c-chart>
    </div>
  `,
  styles: [`
    .filters {
      margin-bottom: 20px;
    }
    .filters label {
      margin-right: 10px;
    }
    .filters input[type="date"], .filters select {
      margin-right: 20px;
    }
  `]
})
export class RelativeHumidityComponent implements OnInit {
  private apiUrl = `${environment.apiBaseUrl}/greenhouses`;
  startDate!: string;
  endDate!: string;
  selectedGreenhouse!: number;
  greenhouses: any[] = [];

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Relative Humidity',
        borderColor: '#007BFF',
        fill: false,
      }
    ]
  };

  lineChartType: ChartType = 'line';

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {}

  ngOnInit(): void {
    const today = new Date();
    this.endDate = today.toISOString().split('T')[0];
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    this.startDate = lastWeek.toISOString().split('T')[0];

    this.loadGreenhouses();
  }

  loadGreenhouses(): void {
    this.http.get(this.apiUrl)
      .subscribe((response: any) => {
        this.greenhouses = response.data;
        this.selectedGreenhouse = this.greenhouses[0]?.id;  // Selecciona el primer invernadero por defecto
        this.fetchHumidityData();  // Cargar datos de humedad después de cargar los invernaderos
      });
  }

  onDateChange(): void {
    this.fetchHumidityData();  // Recargar los datos cuando las fechas cambien
  }

  onGreenhouseChange(): void {
    this.fetchHumidityData();  // Recargar los datos cuando el invernadero cambie
  }

  fetchHumidityData(): void {
    if (!this.selectedGreenhouse || !this.startDate || !this.endDate) return;

    const params = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.http.get(`${this.apiUrl}/${this.selectedGreenhouse}/humidity-readings`, { params })
      .subscribe((response: any) => {
        console.log(response);
        console.log(this.selectedGreenhouse);
        this.processHumidityData(response.data);
      });
  }

  processHumidityData(data: any[]): void {
    const humidityData = data.map(item => item.relative_humidity);
    const labels = data.map(item => item.datetime);

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: humidityData,
          label: `Relative Humidity (Greenhouse ${this.selectedGreenhouse})`,
          borderColor: '#007BFF',
          fill: false,
        }
      ]
    };

    this.cdr.detectChanges();  // Forzar la detección de cambios para actualizar el gráfico
  }
}
