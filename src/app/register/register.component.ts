import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective,CardGroupComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    CardGroupComponent,
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  response: any;
  errorMessage: string | null = null;
  detailedErrors: any[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      tenantId: ['b542bf25-134c-47a2-a0df-84ed14d03c4a', Validators.required],
      role: [0, Validators.required],
      status: [0, Validators.required]
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.detailedErrors = [];
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const payload = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        tenantId: formValue.tenantId,
        role: formValue.role,
        status: formValue.status
      };

      console.log('Payload:', payload); // Para depuración

      this.userService.createUser(payload).subscribe(
        (res) => {
          this.response = res;
          // Redirige al usuario a la página de login después de un registro exitoso
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.error) {
            this.errorMessage = error.error.message || 'An error occurred. Please try again.';
            this.detailedErrors = error.error.detailedErrors || [];
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
          console.error('There was an error!', error);
        }
      );
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
