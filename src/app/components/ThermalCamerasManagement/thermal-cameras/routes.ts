import { Routes } from '@angular/router';

export const routes: Routes = [
    
        {
            path: '',
            loadComponent: () => import('./thermal-cameras.component').then(m => m.ThermalCamerasComponent),
            data: {
           title: $localize`Camaras Termicas`
            }
          }
    
  ];
  