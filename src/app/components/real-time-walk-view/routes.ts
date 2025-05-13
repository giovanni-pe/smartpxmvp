import { Routes } from '@angular/router';

export const routes: Routes = [

        {
            path: '',
            loadComponent: () => import('./real-time-walk-view.component').then(m => m.RealTimeWalkViewComponent),
            data: {
              title: $localize`exito `
            }
          }

  ];
