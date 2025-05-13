import { Routes } from '@angular/router';

export const routes: Routes = [
    
        {
            path: '',
            loadComponent: () => import('./create-thermal-camera.component').then(m => m.CreateThermalCameraComponent),
            data: {
              title: $localize`camara termica `
            }
          }
    
  ];
  