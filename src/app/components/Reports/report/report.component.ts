import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RelativeHumidityComponent } from '../relative-humidity/relative-humidity.component';
import { SoilMoistureComponent } from '../soil-moisture/soil-moisture.component';
import { TemperatureComponent } from '../temperature/temperature.component';
import { IrrigationFrequencyComponent } from '../irrigation-frequency/irrigation-frequency.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NgIf,
    RelativeHumidityComponent,
    SoilMoistureComponent,
    TemperatureComponent,
    IrrigationFrequencyComponent
  ],
  template: `
    <div class="report-container" style="padding: 20px;">
 
  <h2 style="background-color: #042c57; color: white; padding: 10px 20px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        Reportes
        </h2> 
  <div style="margin-bottom: 100px;">
    <app-relative-humidity></app-relative-humidity>
  </div>
  
  <div style="margin-bottom: 100px;">
    <app-soil-moisture></app-soil-moisture>
  </div>
  
  <div style="margin-bottom: 100px;">
    <app-temperature></app-temperature>
  </div>
  
  <div style="margin-bottom: 100px;">
    <app-irrigation-frequency></app-irrigation-frequency>
  </div>
</div>
  `,
  styles: [`
    .report-container {
      padding: 20px;
    }
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    app-relative-humidity, 
    app-soil-moisture, 
    app-temperature, 
    app-irrigation-frequency {
      margin-bottom: 40px;
    }
  `]
})
export class ReportComponent {}
