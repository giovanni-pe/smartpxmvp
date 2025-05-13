import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HumidityService } from '../../../services/average-humidity/humidity.service';

@Component({
  selector: 'app-avg-humidity',
  standalone: true, 
  imports: [CommonModule, HttpClientModule],  
  templateUrl: './avg-humidity.component.html',
  styleUrls: ['./avg-humidity.component.scss'],
})
export class AvgHumidityComponent implements OnInit {

  public avgHumidity: number | null = null;
  public loading: boolean = true;
  public errorMessage: string | null = null;

  constructor(private humidityService: HumidityService) {}

  ngOnInit(): void {
    this.loadAverageHumidity();
  }

  loadAverageHumidity(): void {
    this.humidityService.getAverageHumidity().subscribe(
      data => {
        console.log(data)
        this.avgHumidity = data;
        this.loading = false;
      },
      error => {
        console.error('Error fetching humidity data', error);
        this.errorMessage = 'Error fetching data. Please try again later.';
        this.loading = false;
      }
    );
  }
}
