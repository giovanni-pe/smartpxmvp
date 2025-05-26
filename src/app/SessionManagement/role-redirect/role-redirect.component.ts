import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service'; // Asegúrate que este servicio contiene el rol del usuario

@Component({
  selector: 'app-role-redirect',
  template: ''
})
export class RoleRedirectComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole(); // Asegúrate de tener un método que obtenga el rol

    switch (role) {
      case 'client':
        this.router.navigate(['/walkers']);
        break;
      case 'dog_walker':
        this.router.navigate(['/walker-dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
