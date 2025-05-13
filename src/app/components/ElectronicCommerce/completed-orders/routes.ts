import { Routes } from '@angular/router';

export const routes: Routes = [
    
        {
            path: '',
            loadComponent: () => import('./completed-orders.component').then(m => m.CompletedOrdersComponent),
            data: {
              title: $localize`Ordenes Completadas`
            }
          }
    
  ];
  