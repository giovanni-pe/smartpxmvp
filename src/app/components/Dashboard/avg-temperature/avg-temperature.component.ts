import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TemperatureService } from '../../../services/average-ambient-temperature/temperature.service';  // Importamos el servicio

@Component({
  selector: 'app-avg-temperature',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './avg-temperature.component.html',
  styleUrls: ['./avg-temperature.component.scss'],
})
export class AvgTemperatureComponent implements OnInit {

  public avgTemperature: WritableSignal<number | null> = signal(null);
  public errorMessage: string | null = null;

  constructor(private temperatureService: TemperatureService) {}

  ngOnInit(): void {
    this.loadAverageTemperature();
  }

  // Método para cargar la temperatura desde el servicio
  loadAverageTemperature(): void {
    this.temperatureService.getAverageTemperature().subscribe(
      data => {
        this.avgTemperature.set(data);
      },
      error => {
        console.error('Error fetching temperature data', error);
        this.errorMessage = 'Error fetching temperature data. Please try again later.';
      }
    );
  }
}

