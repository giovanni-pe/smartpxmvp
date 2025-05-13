import { Injectable, WritableSignal, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly language: WritableSignal<string>;

  constructor(private translate: TranslateService) {
    const initialLanguage = localStorage.getItem('app-language') || 'en';
    this.language = signal<string>(initialLanguage);
    console.log('hola soy el servicio lenguaje');
    console.log(initialLanguage);
    this.translate.use(initialLanguage);
  }
  
  setLanguage(language: string): void {
    this.language.set(language);
    this.translate.use(language);
    console.log(language);
    localStorage.setItem('app-language', language);
    window.location.reload();  // Fuerza la recarga de la página
  }
}
