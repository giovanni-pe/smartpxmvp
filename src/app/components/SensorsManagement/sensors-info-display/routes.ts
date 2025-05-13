import { Routes } from '@angular/router';

export const routes: Routes = [
    
        {
            path: '',
            loadComponent: () => import('./sensors-management.component').then(m => m.SensorsManagementComponent),
            data: {
              title: $localize`Gestionar Sensor`
            }
          }
    
  ];
  