import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GreenhouseCountService } from '../../../services/greenhouses-count-display/greenhosue-count.service';

@Component({
  selector: 'app-greenhouse-count-display',
  standalone: true,  // Componente standalone
  imports: [CommonModule, HttpClientModule],  // Importa los módulos necesarios
  templateUrl: './greenhouse-count-display.component.html',
  styleUrls: ['./greenhouse-count-display.component.scss'],
})
export class GreenhouseCountDisplayComponent implements OnInit {

  public greenhouseCount: number | null = null;
  public errorMessage: string | null = null;

  constructor(private greenhouseCountService: GreenhouseCountService) {}

  ngOnInit(): void {
    this.loadGreenhouseCount();
  }

  // Método para cargar el conteo de invernaderos desde el servicio
  loadGreenhouseCount(): void {
    this.greenhouseCountService.getGreenhouseCount().subscribe(
      data => {
        this.greenhouseCount = data;
        console.log(data);
      },
      error => {
        console.error('Error fetching greenhouse count', error);
        this.errorMessage = 'Error fetching greenhouse count. Please try again later.';
      }
    );
  }
}
