import { Component, OnInit } from '@angular/core';
import { AuthService } from '../SessionManagement/login/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId: string | null = null;
  userEmail: string | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.userId = this.authService.getUserId();
      this.userEmail = this.authService.getUserEmail();
      this.userRole = this.authService.getUserRole();
    }
  }
}
