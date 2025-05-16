
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { IconDirective } from '@coreui/icons-angular';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective
} from '@coreui/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  animations: [
    trigger('rewardAnimation', [
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
    FormsModule,
    HttpClientModule,
    TranslateModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective
  ]
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };
  loginError: string | null = null;
  focusedField: string | null = null;
  showPassword = false;
  isLoggingIn = false;
  dogEmotion: string = 'excited'; // Cambiado a excited por defecto para ser más atractivo
  dogSpeech: string | null = '¡Hola! Inicia sesión para conseguir premios y recompensas especiales';
  showSparkles: boolean = false;
  emailQualityStars: number = 0;
  passwordQualityStars: number = 0;
  emailQualityClass: string = '';
  passwordQualityClass: string = '';
  showReward: boolean = false;
  rewardAmount: number = 0;
  loginStreak: number = 0;
  showDailyChance: boolean = false;
  dailyChanceCards: any[] = [];
  dailyChanceComplete: boolean = false;
  lastRewardTime: number = 0;
  rewardProbability: number = 0.3; // 30% de probabilidad de premio

  // Mensajes motivacionales
  motivationalMessages: string[] = [
    '¡Vaya! ¡Casi obtienes un super premio! Inténtalo de nuevo',
    '¡Un paso más cerca del premio mayor! Sigue intentando',
    '¡Wow! ¡Estuviste muy cerca! Una vez más y seguro ganas',
    '¡Los premios te están esperando! ¡No te rindas!',
    '¡Increíble! Sólo te falta un poco para el JACKPOT',
    '¡Los mejores premios van para los más persistentes!'
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Simular una racha de días de inicio de sesión (en producción vendría del backend)
    this.loginStreak = Math.floor(Math.random() * 8); // 0-7 días

    // Mostrar premio aleatorio con cierta probabilidad
    if (Math.random() < this.rewardProbability) {
      setTimeout(() => {
        this.triggerRandomReward();
      }, 1000);
    }

    // Preparar cartas de oportunidad diaria
    this.prepareDailyChanceCards();

    // 50% de probabilidad de mostrar la oportunidad diaria
    this.showDailyChance = Math.random() > 0.5;

    // Efecto de "casi ganas" después de un tiempo
    setTimeout(() => {
      if (!this.isLoggingIn && !this.showReward) {
        this.almostWonAnimation();
      }
    }, 5000);
  }

  prepareDailyChanceCards() {
    // Crear 3 cartas, donde 2 coinciden (para crear sensación de "casi")
    const rewards = ['50pts', '100pts', '50pts'];
    this.dailyChanceCards = rewards.map(reward => ({
      reward,
      flipped: false,
      matched: false
    }));

    // Mezclar las cartas
    this.shuffleCards();
  }

  shuffleCards() {
    for (let i = this.dailyChanceCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.dailyChanceCards[i], this.dailyChanceCards[j]] =
        [this.dailyChanceCards[j], this.dailyChanceCards[i]];
    }
  }

  flipDailyCard(index: number) {
    // No permitir voltear si ya está volteada o si el juego está completo
    if (this.dailyChanceCards[index].flipped || this.dailyChanceComplete) {
      return;
    }

    // Voltear la carta
    this.dailyChanceCards[index].flipped = true;

    // Verificar si hay match (para crear sensación de "casi ganas")
    const flippedCards = this.dailyChanceCards.filter(card => card.flipped);

    if (flippedCards.length === 2) {
      if (flippedCards[0].reward === flippedCards[1].reward) {
        // Match! Marcar las cartas como coincidentes
        this.dailyChanceCards.forEach(card => {
          if (card.flipped) {
            card.matched = true;
          }
        });

        // Mostrar mensaje de emoción
        this.setDogEmotion('excited');
        this.dogSpeech = '¡Increíble! ¡Has ganado ' + flippedCards[0].reward + '! Inicia sesión para reclamarlos';
        this.showSparkles = true;

        setTimeout(() => {
          this.showSparkles = false;
        }, 3000);
      }

      // Completar el juego después de voltear 2 cartas
      setTimeout(() => {
        this.dailyChanceComplete = true;

        if (!this.dailyChanceCards.some(card => card.matched)) {
          this.setDogEmotion('sad');
          this.dogSpeech = '¡Casi! Vuelve mañana para otra oportunidad. ¡Seguro tendrás más suerte!';
        }
      }, 1000);
    }
  }

  almostWonAnimation() {
    // Crear sensación de "casi ganas" para mantener al usuario enganchado
    this.setDogEmotion('surprised');
    this.dogSpeech = this.motivationalMessages[Math.floor(Math.random() * this.motivationalMessages.length)];
    this.showSparkles = true;

    setTimeout(() => {
      this.showSparkles = false;
      this.checkFormState();
    }, 3000);
  }

  triggerRandomReward() {
    // No mostrar recompensas con demasiada frecuencia
    const now = Date.now();
    if (now - this.lastRewardTime < 10000) { // 10 segundos mínimo entre recompensas
      return;
    }

    this.lastRewardTime = now;
    this.rewardAmount = Math.floor(Math.random() * 5 + 1) * 10; // 10, 20, 30, 40, o 50 puntos
    this.showReward = true;
    this.setDogEmotion('excited');
    this.dogSpeech = `¡WOW! ¡Has ganado ${this.rewardAmount} puntos! ¡Inicia sesión para reclamarlos!`;
    this.showSparkles = true;

    // Ocultar después de un tiempo
    setTimeout(() => {
      this.showReward = false;
      this.showSparkles = false;
      this.checkFormState();
    }, 4000);
  }

  onInputFocus(field: string) {
    this.focusedField = field;
    this.setDogEmotion('happy');

    // Disparar recompensa aleatoria con baja probabilidad para crear refuerzo intermitente
    if (Math.random() < 0.1) { // 10% de probabilidad al enfocar un campo
      this.triggerRandomReward();
    }

    // Actualizar mensaje del perro según el campo
    if (field === 'email') {
      this.dogSpeech = '¡Ingresa tu correo para verificar tus recompensas pendientes!';
    } else if (field === 'password') {
      this.dogSpeech = '¡Tu contraseña desbloquea todos tus premios acumulados!';
    }
  }

  onInputBlur() {
    // Pequeño delay para que la animación no desaparezca instantáneamente
    setTimeout(() => {
      this.focusedField = null;
      this.checkFormState();
    }, 300);
  }

  onInputChange() {
    this.updateQualityIndicators();
    this.checkFormState();

    // Aleatoriamente mostrar chispas para crear sensación de progreso
    if (Math.random() < 0.3 && (this.emailQualityStars > 3 || this.passwordQualityStars > 3)) {
      this.showSparkles = true;
      setTimeout(() => {
        this.showSparkles = false;
      }, 1000);
    }
  }

  updateQualityIndicators() {
    // Validación de inputs con feedback visual tipo "rating"
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (this.focusedField === 'email') {
      if (!this.credentials.email) {
        this.emailQualityStars = 0;
        this.emailQualityClass = '';
      } else if (this.credentials.email.length < 5) {
        this.emailQualityStars = 1;
        this.emailQualityClass = 'poor';
        this.dogSpeech = 'Mmm... ese email es muy corto';
      } else if (this.credentials.email.includes('@')) {
        if (emailPattern.test(this.credentials.email)) {
          this.emailQualityStars = 5;
          this.emailQualityClass = 'excellent';
          this.dogSpeech = '¡Email perfecto! ¡Podría haber premios esperándote!';
        } else {
          this.emailQualityStars = 3;
          this.emailQualityClass = 'average';
          this.dogSpeech = 'Ese email casi funciona... ¡Sigue intentando!';
        }
      } else {
        this.emailQualityStars = 2;
        this.emailQualityClass = 'fair';
        this.dogSpeech = 'El email necesita un @. ¡No te pierdas tus premios!';
      }
    } else if (this.focusedField === 'password') {
      if (!this.credentials.password) {
        this.passwordQualityStars = 0;
        this.passwordQualityClass = '';
      } else if (this.credentials.password.length < 4) {
        this.passwordQualityStars = 1;
        this.passwordQualityClass = 'poor';
        this.dogSpeech = 'Contraseña muy corta, ¡tus premios necesitan mejor protección!';
      } else if (this.credentials.password.length < 6) {
        this.passwordQualityStars = 2;
        this.passwordQualityClass = 'fair';
        this.dogSpeech = 'Casi lo tienes, ¡una contraseña más larga asegura mejores premios!';
      } else if (this.credentials.password.length < 8) {
        this.passwordQualityStars = 3;
        this.passwordQualityClass = 'average';
        this.dogSpeech = '¡Buena contraseña! Un poco más y será perfecta';
      } else if (this.credentials.password.length >= 8) {
        this.passwordQualityStars = 5;
        this.passwordQualityClass = 'excellent';
        this.dogSpeech = '¡Excelente contraseña! ¡Tus premios están ultra seguros!';
      }
    }
  }

  setDogEmotion(emotion: string) {
    this.dogEmotion = emotion;

    // Mostrar chispas aleatoriamente para crear sensación de recompensa
    if (emotion === 'excited' && Math.random() < 0.7) {
      this.showSparkles = true;
      setTimeout(() => {
        this.showSparkles = false;
      }, 1500);
    }

    // Actualizar mensaje según emoción con enfoque en premios y recompensas
    switch (emotion) {
      case 'sleeping':
        this.dogSpeech = '¡Despiértame para descubrir tus premios acumulados!';
        break;
      case 'sad':
        this.dogSpeech = 'Oh no... ¡No te rindas! ¡Tus premios te esperan!';
        break;
      case 'excited':
        const excitedMessages = [
          '¡Guau guau! ¡Un premio puede estar esperándote!',
          '¡Increíble! ¡Estás muy cerca de desbloquear recompensas!',
          '¡Wow! ¡Siento que hoy es tu día de suerte!',
          '¡Emocionante! ¡A por esos premios exclusivos!'
        ];
        this.dogSpeech = excitedMessages[Math.floor(Math.random() * excitedMessages.length)];
        break;
      case 'surprised':
        this.dogSpeech = '¡WOW! ¡Qué sorpresa! ¡Algo especial podría aparecer pronto!';
        break;
      // Los mensajes de 'happy' y otros se manejan en otras funciones
    }
  }

  checkFormState() {
    // Si no hay campos con foco, verificar el estado del formulario
    if (!this.focusedField) {
      if (this.loginError) {
        this.setDogEmotion('sad');
      } else if (this.isLoggingIn) {
        this.setDogEmotion('excited');
      } else if (this.credentials.email && this.credentials.password) {
        this.setDogEmotion('excited');
        const readyMessages = [
          '¡Todo listo! ¡Tus premios te están esperando!',
          '¡Un clic más y podrás ver todas tus recompensas!',
          '¡Vamos! ¡Tus bonificaciones diarias están a punto de caducar!'
        ];
        this.dogSpeech = readyMessages[Math.floor(Math.random() * readyMessages.length)];
      } else if (!this.credentials.email && !this.credentials.password) {
        this.setDogEmotion('excited'); // Mantener emocionado para crear enganche
        this.dogSpeech = '¡Date prisa! ¡Hay premios limitados esperándote hoy!';
      } else {
        this.setDogEmotion('happy');
        this.dogSpeech = '¡Casi listo! ¡Completa todo para desbloquear tus recompensas!';
      }

      // Mostrar una recompensa aleatoria ocasionalmente
      if (Math.random() < 0.05 && !this.showReward) { // 5% de probabilidad
        this.triggerRandomReward();
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    // Activar la animación del perro cuando se muestra la contraseña
    if (this.showPassword) {
      this.setDogEmotion('surprised');
      this.dogSpeech = '¡Guau! Ahora puedo ver tu contraseña. ¡Cuidado con tus premios!';
      this.focusedField = 'password';
      setTimeout(() => {
        if (document.activeElement?.id !== document.getElementById('password')?.id) {
          this.checkFormState();
        }
      }, 1500);
    } else {
      this.dogSpeech = 'Tu contraseña está oculta nuevamente. ¡Tus premios están seguros!';
      setTimeout(() => {
        this.checkFormState();
      }, 1500);
    }
  }

  startLoginAnimation() {
    this.isLoggingIn = true;
    this.setDogEmotion('excited');
    this.dogSpeech = '¡Guau guau! ¡Verificando tus premios acumulados!';
    this.showSparkles = true;

    // Incrementar las probabilidades de recompensa en el próximo inicio
    this.rewardProbability += 0.1;
    if (this.rewardProbability > 0.8) this.rewardProbability = 0.8;
  }

  login() {
    this.startLoginAnimation();

    // Simular un pequeño delay para crear anticipación
    setTimeout(() => {
      this.authService.login(this.credentials).subscribe({
        next: () => {
          this.dogSpeech = '¡INCREÍBLE! ¡Recompensas desbloqueadas! ¡Vamos a ver tus premios!';

          // Pequeño delay para ver la animación completa y crear sensación de logro
          setTimeout(() => {
            this.router.navigate(['/walkers']);
          }, 1500);
        },
        error: (err) => {
          this.isLoggingIn = false;
          this.showSparkles = false;
          this.loginError = 'Login fallido. ¡No pierdas tus recompensas acumuladas!';
          this.setDogEmotion('sad');
          this.dogSpeech = 'Ups... ¡Un pequeño error! Vuelve a intentarlo para no perder tus premios diarios.';
          console.error('Login failed', err);

          // Crear un casi-éxito para mantener al usuario motivado
          setTimeout(() => {
            this.almostWonAnimation();
          }, 3000);
        }
      });
    }, 1200); // Delay más largo para crear más anticipación
  }

  navigateToRegister() {
    this.setDogEmotion('excited');
    this.dogSpeech = '¡Vamos a registrarte para que ganes premios exclusivos para nuevos usuarios!';
    this.showSparkles = true;

    setTimeout(() => {
      this.router.navigate(['/register']);
    }, 1000);
  }
}
