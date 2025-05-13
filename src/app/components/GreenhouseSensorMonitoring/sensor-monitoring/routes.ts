import { Routes } from '@angular/router';

export const routes: Routes = [
    
        {
            path: '',
            loadComponent: () => import('./sensor-monitoring.component').then(m => m.SensorMonitoringComponent),
            data: {
           title: $localize`Monitorieo de Camaras termicas`
            }
          }
    
  ];
  