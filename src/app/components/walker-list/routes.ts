import { Routes } from '@angular/router';

export const routes: Routes = [
    
        {
            path: '',
            loadComponent: () => import('./walker-list.component').then(m => m.WalkerListComponent),
            data: {
              title: $localize`  `
            }
          }
    
  ];
  