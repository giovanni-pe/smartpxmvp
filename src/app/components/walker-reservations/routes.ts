import { Routes } from '@angular/router';

export const routes: Routes = [

        {
            path: '',
            loadComponent: () => import('./Walker-reservations.component').then(m => m.WalkerReservationsComponent),
            data: {
              title: $localize`  `
            }
          }

  ];
