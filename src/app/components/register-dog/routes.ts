import { Routes } from '@angular/router';

export const routes: Routes = [
    
        {
            path: '',
            loadComponent: () => import('./register-dog.component').then(m => m.RegisterDogComponent),
            data: {
              title: $localize`Registrar Peludo `
            }
          }
    
  ];
  