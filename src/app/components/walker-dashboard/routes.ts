import { Routes } from '@angular/router';

export const routes: Routes = [

        {
            path: '',
            loadComponent: () => import('./walker-dashboard.component').then(m => m.WalkerDashboardComponent),
            data: {
              title: $localize`  `
            }
          }

  ];
