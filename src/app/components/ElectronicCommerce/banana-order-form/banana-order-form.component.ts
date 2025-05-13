import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-banana-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './banana-order-form.component.html',
  styleUrls: ['./banana-order-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BananaOrderFormComponent {
  bananaOrderForm: FormGroup;
  minDate: Date;
  isPaymentGenerated: boolean = false; // Agregar esta propiedad

  constructor(private fb: FormBuilder) {
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() + 3);

    this.bananaOrderForm = this.fb.group({
      buyerName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^\\d{9}$')]],
      productType: ['', Validators.required],
      hijuelosQuantity: ['', [Validators.required, Validators.min(1)]],
      address: this.fb.group({
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        country: ['', Validators.required],
      }),
      deliveryDate: ['', Validators.required]
    });
  }

  // Method to get the FormControl safely
  getFormControl(controlName: string): FormControl {
    return this.bananaOrderForm.get(controlName) as FormControl;
  }

  generatePayment() {
    if (this.bananaOrderForm.valid) {
      alert('Se  abrira una pasarela de pago');
      this.isPaymentGenerated = true; // Cambiar a true después de simular el pago
    } else {
      console.log('El formulario no es válido');
    }
  }

  onSubmit() {
    if (this.bananaOrderForm.valid) {
      console.log('Pedido Registrado', this.bananaOrderForm.value);
    } else {
      console.log('El formulario no es válido');
    }
  }
}
