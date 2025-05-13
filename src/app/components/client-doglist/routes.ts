import { Routes } from '@angular/router';

export const routes: Routes = [

        {
            path: '',
            loadComponent: () => import('./client-doglist.component').then(m => m.ClientDogListComponent),
            data: {
              title: $localize`Peludos `
            }
          }

  ];
