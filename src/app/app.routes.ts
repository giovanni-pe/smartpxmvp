import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './SessionManagement/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './SessionManagement/login/login.component';
export const routes: Routes = [


  {
    path: '',
    redirectTo: 'walkers',
    pathMatch: 'full',
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: ''
    },
    children: [

      {
        path: 'dashboard',
        loadChildren: () => import('./components/Dashboard/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },

      {
        path: 'walkers',
        loadChildren: () => import('./components/walker-list/routes').then(m => m.routes),
      },
       {
        path: 'register-dogs',
        loadChildren: () => import('./components/register-dog/routes').then(m => m.routes),
      },

   {
        path: 'list-dogs',
        loadChildren: () => import('./components/client-doglist/routes').then(m => m.routes),
      },
      {
        path: 'login',
        loadChildren: () => import('./SessionManagement/login/routes').then((m) => m.routes)
      },
      {
        path: 'thermal-cameras',
        loadChildren: () => import('./components/ThermalCamerasManagement/thermal-cameras/routes').then((m) => m.routes)
      },
      {
        path: 'create-thermal-cameras',
        loadChildren: () => import('./components/ThermalCamerasManagement/create-thermal-camera/routes').then((m) => m.routes)
      },
      {
        path: 'sensor-monitoring',
        loadChildren: () => import('./components/GreenhouseSensorMonitoring/sensor-monitoring/routes').then((m) => m.routes)
      },
      {
        path: 'sensors-management',
        loadChildren: () => import('./components/SensorsManagement/sensors-info-display/routes').then((m) => m.routes)

      }, {
        path: 'banana-order',
        loadChildren: () => import('./components/ElectronicCommerce/banana-order-form/routes').then((m) => m.routes)
      }, {
        path: 'pending-orders',
        loadChildren: () => import('./components/ElectronicCommerce/pending-orders/routes').then((m) => m.routes)
      },
      {
        path: 'completed-orders',
        loadChildren: () => import('./components/ElectronicCommerce/completed-orders/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'reports',
        loadChildren: () => import('./components/Reports/report/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: 'welcome',
    loadChildren: () => import('./components/FrontOffice/welcome/routes').then((m) => m.routes)
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login1',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'walkers' }
];
