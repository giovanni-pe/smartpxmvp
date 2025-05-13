import { Component } from '@angular/core';
import { LanguageService } from '../language.service';
import { NgFor, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, NgClass]
})
export class LanguageSwitcherComponent {
  languages = [
    { code: 'en', label: 'Inglés' }, // Inglés
    { code: 'es', label: 'Español' }, // Español
  ];

  currentLanguage: string;

  constructor(private languageService: LanguageService) {
    this.currentLanguage = this.languageService.language();
  }

  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang);
    this.currentLanguage = lang;
  }
}
