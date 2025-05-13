import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ConfigService } from './core/services/config.service';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthInterceptor } from './SessionManagement/auth.interceptor';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';
import {  HTTP_INTERCEPTORS,HttpClientModule, HttpClient } from '@angular/common/http';
import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from './shared/language.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Función de fábrica para la carga del archivo de traducción
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
     {
       provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
     multi: true
     },
    ConfigService,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [ConfigService], multi: true },

    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(SidebarModule, DropdownModule, HttpClientModule),
    IconSetService,
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    TranslateService,
    LanguageService, provideAnimationsAsync() // Proveedor del LanguageService
  ]
};
