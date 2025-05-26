import { Routes } from '@angular/router';

export const routes: Routes = [

        {
            path: '',
            loadComponent: () => import('./client-reservations.component').then(m => m.ClientReservationsComponent),
            data: {
              title: $localize`  `
            }
          }

  ];
