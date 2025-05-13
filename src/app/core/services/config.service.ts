import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;
  private configLoaded: Promise<void>;
  
  constructor(private http: HttpClient) {
   
    this.configLoaded = this.loadConfig();
  }

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get('/assets/config.json'))
      .then(data => {
        this.config = data;
        if (!this.config.apiUrl) {
          throw new Error('apiUrl is missing from configuration');
        }
      })
      .catch(error => {
        console.error('Could not load configuration:', error);
        throw error;
      });
  }

  getConfigLoadedPromise(): Promise<void> {
    return this.configLoaded;
  }

  get apiUrl(): string {
    if (!this.config) {
      throw new Error('Configuration not loaded ');
    }
    return this.config.apiUrl;
  }
}
