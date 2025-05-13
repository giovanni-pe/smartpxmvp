import { Routes } from '@angular/router';

export const routes: Routes = [
    
        {
            path: '',
            loadComponent: () => import('./banana-order-form.component').then(m => m.BananaOrderFormComponent),
            data: {
              title: $localize`Solicitud de Orden `
            }
          }
    
  ];
  