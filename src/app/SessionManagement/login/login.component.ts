import { Component } from '@angular/core';
import { CommonModule,NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule,
    TranslateModule,ContainerComponent, RowComponent, ColComponent,
    CardGroupComponent, TextColorDirective, CardComponent,
    CardBodyComponent, FormDirective, InputGroupComponent,
    InputGroupTextDirective, IconDirective, FormControlDirective,
     ButtonDirective,NgStyle]
})

export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/walkers']);
      },
      error: (err) => {
        this.loginError = 'Login failed. Please check your credentials.';
        console.error('Login failed', err);
      }
    });
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
