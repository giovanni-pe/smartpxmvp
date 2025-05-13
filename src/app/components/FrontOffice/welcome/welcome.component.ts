import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { CarouselComponent } from '../carousel/carousel.component';
import { BananaOrderFormComponent } from '../../ElectronicCommerce/banana-order-form/banana-order-form.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    CarouselComponent,
    BananaOrderFormComponent // Aquí se importa el componente de formulario de pedidos de bananos
  ]
})
export class WelcomeComponent {
  showForm = false;

  toggleForm() {
    this.showForm = !this.showForm;
  }
}
