import { Component, OnInit , APP_INITIALIZER} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './shared/icons/icon-subset';
import { AuthService } from './SessionManagement/login/auth.service';
import { Observable } from 'rxjs';
import { LanguageService } from './shared/language.service';
@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'SmartPX';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private authService: AuthService,
    private languajeService: LanguageService,
  ) {
    this.titleService.setTitle(this.title);
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

}
 

