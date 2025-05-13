import { Component, OnInit } from '@angular/core';
import { WritableSignal, signal } from '@angular/core';
import { SoilMoistureService } from '../../../services/average-soil-moisture/soil-moisture.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-avg-soil-moisture',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './avg-soil-moisture.component.html',
  styleUrls: ['./avg-soil-moisture.component.scss'],
})
export class AvgSoilMoistureComponent implements OnInit {

  public avgSoilMoisture: WritableSignal<number | null> = signal(null);

  constructor(private soilMoistureService: SoilMoistureService) {}

  ngOnInit(): void {
    this.loadAverageSoilMoisture();
  }

  loadAverageSoilMoisture(): void {
    this.soilMoistureService.getAverageSoilMoisture().subscribe(
      data => {
        this.avgSoilMoisture.set(data);
      },
      error => {
        console.error('Error fetching soil moisture:', error);
        this.avgSoilMoisture.set(null);
      }
    );
  }
}
