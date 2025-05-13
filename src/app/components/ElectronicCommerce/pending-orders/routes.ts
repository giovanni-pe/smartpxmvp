import { Routes } from '@angular/router';

export const routes: Routes = [
    
        {
            path: '',
            loadComponent: () => import('./pending-orders.component').then(m => m.PendingOrdersComponent),
            data: {
              title: $localize`Ordenes pendientes`
            }
          }
    
  ];
  