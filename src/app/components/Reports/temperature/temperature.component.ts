import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  // Añadimos CommonModule
import { environment } from '../../../../environments/environment'; 
@Component({
  selector: 'app-temperature',
  standalone: true,
  imports: [FormsModule, ChartjsComponent, CommonModule],
  template: `
    <div>
      <h3 style="background-color: #e12a12; color: white; padding: 10px 20px; border-radius: 30%; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        Reporte de Temperatura
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
export class TemperatureComponent implements OnInit {
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
        label: 'Ambient Temperature',
        borderColor: '#dc3545',  // Color para temperatura
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
        this.fetchTemperatureData();  // Cargar datos de temperatura después de cargar los invernaderos
      });
  }

  onDateChange(): void {
    this.fetchTemperatureData();  // Recargar los datos cuando cambien las fechas
  }

  onGreenhouseChange(): void {
    this.fetchTemperatureData();  // Recargar los datos cuando cambie el invernadero
  }

  fetchTemperatureData(): void {
    if (!this.selectedGreenhouse || !this.startDate || !this.endDate) return;

    const params = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.http.get(`${this.apiUrl}/${this.selectedGreenhouse}/temperature-readings`, { params })
      .subscribe((response: any) => {
        this.processTemperatureData(response.data);
      });
  }

  processTemperatureData(data: any[]): void {
    const temperatureData = data.map(item => item.ambient_temperature);
    const labels = data.map(item => item.datetime);

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: temperatureData,
          label: `Ambient Temperature (Greenhouse ${this.selectedGreenhouse})`,
          borderColor: '#dc3545',  // Color para temperatura
          fill: false,
        }
      ]
    };

    this.cdr.detectChanges();  // Forzar la detección de cambios para actualizar el gráfico
  }
}
