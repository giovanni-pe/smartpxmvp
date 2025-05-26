import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { IconDirective } from '@coreui/icons-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, CardGroupComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  animations: [
    trigger('bonusAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(-20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'scale(0.8) translateY(-20px)' }))
      ])
    ])
  ],
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
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  response: any;
  errorMessage: string | null = null;

  // Gamification properties (simplificadas)
  focusedField: string | null = null;
  isRegistering = false;
  dogEmotion: string = 'excited';
  dogSpeech: string | null = '¡Solo necesito unos datos básicos y en 60 segundos tendrás acceso VIP!';
  showSparkles: boolean = false;
  bonusAmount: number = 0;
  isValidEmail: boolean = false;
  showPassword: boolean = false;
  passwordStrength: number = 0;
  passwordStrengthClass: string = '';
  passwordStrengthText: string = '';
  passwordsMatch: boolean = false;

  // Growth hacking properties
  liveUsers: number = 0;

  // Utility property
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Formulario con name - requerido por el backend
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      role: ['client', Validators.required]
    });
  }

  ngOnInit() {
    // Inicializar valores para crear urgencia
    this.bonusAmount = Math.floor(Math.random() * 100 + 50); // 50-150 coins
    this.liveUsers = Math.floor(Math.random() * 47 + 23); // 23-69 users

    // Actualizar contador en vivo para crear sensación de actividad
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance cada 3 segundos
        this.liveUsers += Math.floor(Math.random() * 3 + 1);
        if (this.liveUsers > 100) this.liveUsers = Math.floor(Math.random() * 30 + 20);
      }
    }, 3000);

    // Subscribe to form changes for instant validation
    this.registerForm.get('email')?.valueChanges.subscribe(email => {
      this.validateEmailInstant(email);
    });

    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.validatePasswordStrength(password);
    });

    this.registerForm.get('password_confirmation')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });

    // Mostrar emoción positiva desde el inicio
    this.setDogEmotion('excited');

    // Efecto de sparkles aleatorio para mantener engagement
    setInterval(() => {
      if (Math.random() < 0.1 && !this.showSparkles) { // 10% cada 2 segundos
        this.showSparkles = true;
        setTimeout(() => {
          this.showSparkles = false;
        }, 1500);
      }
    }, 2000);
  }

  validateEmailInstant(email: string) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    this.isValidEmail = emailPattern.test(email);

    if (this.isValidEmail && this.focusedField === 'email') {
      setTimeout(() => {
        this.setDogEmotion('excited');
        this.dogSpeech = '¡Email perfecto! ¡Ahora crea una contraseña segura!';
        this.showSparkles = true;
        setTimeout(() => {
          this.showSparkles = false;
        }, 1000);
      }, 0);
    }
  }

  validatePasswordStrength(password: string) {
    if (!password) {
      this.passwordStrength = 0;
      this.passwordStrengthClass = '';
      this.passwordStrengthText = '';
      return;
    }

    let strength = 0;
    let text = '';
    let className = '';

    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength++;

    switch(strength) {
      case 1:
        text = 'Débil 😐';
        className = 'weak';
        break;
      case 2:
        text = 'Buena 😊';
        className = 'good';
        break;
      case 3:
        text = '¡Súper segura! 🔒';
        className = 'strong';
        break;
      default:
        text = 'Muy corta 😕';
        className = 'very-weak';
    }

    this.passwordStrength = strength;
    this.passwordStrengthClass = className;
    this.passwordStrengthText = text;

    if (this.focusedField === 'password') {
      setTimeout(() => {
        if (strength >= 2) {
          this.dogSpeech = '¡Excelente contraseña! ¡Tus datos estarán súper seguros!';
        } else if (strength === 1) {
          this.dogSpeech = 'Buena contraseña, ¡unos caracteres más y será perfecta!';
        } else {
          this.dogSpeech = 'Contraseña muy corta, ¡hazla un poco más larga!';
        }
      }, 0);
    }
  }

  validatePasswordMatch() {
    const password = this.registerForm.get('password')?.value || '';
    const passwordConfirm = this.registerForm.get('password_confirmation')?.value || '';

    this.passwordsMatch = password === passwordConfirm && passwordConfirm.length > 0;

    if (this.focusedField === 'password_confirmation') {
      setTimeout(() => {
        if (this.passwordsMatch) {
          this.dogSpeech = '¡Perfecto! ¡Las contraseñas coinciden!';
          this.showSparkles = true;
          setTimeout(() => {
            this.showSparkles = false;
          }, 1000);
        } else if (passwordConfirm.length > 0) {
          this.dogSpeech = 'Las contraseñas no coinciden, ¡inténtalo otra vez!';
        }
      }, 0);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;

    setTimeout(() => {
      this.setDogEmotion('surprised');
      this.dogSpeech = this.showPassword ?
        '¡Ahora puedo ver tu contraseña! ¡Está súper segura!' :
        '¡Contraseña oculta de nuevo! ¡Perfecto para la seguridad!';
    }, 0);
  }

  onInputFocus(field: string) {
    this.focusedField = field;

    setTimeout(() => {
      this.setDogEmotion('happy');

      if (field === 'name') {
        this.dogSpeech = '¡Hola! ¿Cómo te llamas? ¡Solo tu nombre!';
      } else if (field === 'email') {
        this.dogSpeech = '¡Tu email para enviarte las mejores ofertas!';
      } else if (field === 'password') {
        this.dogSpeech = '¡Crea una contraseña súper segura! Mínimo 6 caracteres';
      } else if (field === 'password_confirmation') {
        this.dogSpeech = '¡Repite tu contraseña para asegurar que está correcta!';
      }
    }, 0);
  }

  onInputBlur() {
    setTimeout(() => {
      this.focusedField = null;
      this.checkFormState();
    }, 300);
  }

  onInputChange() {
    setTimeout(() => {
      this.checkFormState();
    }, 0);
  }

  selectRole(role: string) {
    this.registerForm.patchValue({ role });

    setTimeout(() => {
      this.setDogEmotion('excited');
      this.showSparkles = true;

      if (role === 'client') {
        this.dogSpeech = '¡Perfecto! Tendrás acceso a los mejores paseadores de la ciudad';
      } else {
        this.dogSpeech = '¡Excelente! Podrás ganar dinero extra paseando perros adorables';
      }

      setTimeout(() => {
        this.showSparkles = false;
        this.dogSpeech = '¡Todo listo! ¡Haz clic en el botón dorado para crear tu cuenta!';
      }, 2000);
    }, 0);
  }

  setDogEmotion(emotion: string) {
    this.dogEmotion = emotion;
  }

  checkFormState() {
    if (!this.focusedField) {
      if (this.errorMessage) {
        this.setDogEmotion('sad');
      } else if (this.isRegistering) {
        this.setDogEmotion('excited');
      } else if (this.isFormValid()) {
        this.setDogEmotion('excited');
        this.dogSpeech = '¡PERFECTO! ¡Todo listo para crear tu cuenta VIP!';
      } else {
        this.setDogEmotion('happy');
        this.dogSpeech = '¡Solo necesito tu email y saber qué te interesa! ¡Súper rápido!';
      }
    }
  }

  isFormValid(): boolean {
    return this.registerForm.valid && this.isValidEmail && this.passwordsMatch && this.passwordStrength >= 1;
  }

  // Registro social simulado
  registerWithGoogle() {
    this.setDogEmotion('excited');
    this.dogSpeech = '¡Increíble! ¡Registrándote con Google es súper rápido!';
    this.showSparkles = true;

    // Simular registro exitoso
    setTimeout(() => {
      this.navigateToSuccessOrDashboard();
    }, 1500);
  }

  registerWithFacebook() {
    this.setDogEmotion('excited');
    this.dogSpeech = '¡Genial! ¡Con Facebook es instantáneo!';
    this.showSparkles = true;

    // Simular registro exitoso
    setTimeout(() => {
      this.navigateToSuccessOrDashboard();
    }, 1500);
  }

  startRegistrationAnimation() {
    this.isRegistering = true;
    this.setDogEmotion('excited');
    this.dogSpeech = '¡INCREÍBLE! ¡Creando tu cuenta VIP con todos los beneficios!';
    this.showSparkles = true;
  }

  onSubmit() {
    this.errorMessage = null;
    this.startRegistrationAnimation();

    if (this.isFormValid()) {
      const formValue = this.registerForm.value;

      // Payload para el backend real
      const payload = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
        password_confirmation: formValue.password_confirmation,
        role: formValue.role
      };

      console.log('Registrando usuario:', payload);

      // Llamada real al backend
      this.userService.registerUser(payload).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.dogSpeech = '🎉 ¡ÉXITO! ¡Tu cuenta está lista!';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.isRegistering = false;
          this.showSparkles = false;

          if (error.error && error.error.errors) {
            // Manejar errores de validación de Laravel
            const errors = error.error.errors;
            this.errorMessage = Object.keys(errors).map(key => errors[key][0]).join(', ');
          } else {
            this.errorMessage = error.error?.message || 'Error inesperado. ¡Inténtalo de nuevo!';
          }

          this.setDogEmotion('sad');
          this.dogSpeech = '¡Ups! ' + this.errorMessage;
        }
      });
    }
  }

  navigateToSuccessOrDashboard() {
    // Redirigir a una página de bienvenida o directamente al dashboard
    // Por ahora vamos al login, pero en producción sería mejor ir directo al dashboard
    this.router.navigate(['/login']);
  }

  navigateToLogin() {
    this.setDogEmotion('excited');
    this.dogSpeech = '¡Perfecto! ¡Vamos a iniciar sesión!';

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
}
