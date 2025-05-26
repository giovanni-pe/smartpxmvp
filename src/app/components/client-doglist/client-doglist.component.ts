import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DogService } from '../../services/dogs/dog.service';  // Servicio para obtener los perros
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-client-doglist',
  templateUrl: './client-doglist.component.html',
  styleUrls: ['./client-doglist.component.scss'],
  standalone: true,
  imports: [

    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ClientDogListComponent implements OnInit {
  dogs: any[] = [];
  filtersForm!: FormGroup;  // Definimos el formulario reactivo
  currentPage: number = 1;
  totalPages: number = 1;
  loading: any;
  storageUrl = environment.storageUrl; // URL base de la API

  constructor(private fb: FormBuilder, private dogService: DogService) { }

  ngOnInit(): void {
    // Inicializamos el formulario reactivo
    this.filtersForm = this.fb.group({
      name: [''], // Filtro por nombre
      age: ['']   // Filtro por edad
    });

    this.loadDogs();
  }

  loadDogs(page: number = 1): void {
    const filters = this.filtersForm.value;  // Obtenemos los valores de los filtros

    this.dogService.getDogs({ page: page, name: filters.name, age: filters.age }).subscribe(response => {
      this.dogs = response.data;
      this.totalPages = response.last_page;  // Obtener la cantidad total de páginas
      this.currentPage = response.current_page;  // Obtener la página actual
    });
  }

  // Maneja el cambio de página
  changePage(page: number): void {
    this.loadDogs(page);
  }

  // Aplica los filtros
  applyFilters(): void {
    this.loadDogs(1);  // Vuelve a la primera página al aplicar el filtro
  }
}
