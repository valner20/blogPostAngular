import { Routes } from '@angular/router';
import { guardGuard } from './guard/guard-guard';

export const routes: Routes = [
  {
    path: 'registrar',
    canActivate: [guardGuard],
    loadComponent: () =>
      import('./domain/pages/register/register').then(m => m.Register)
  },
  {
    path: 'login',
    canActivate: [guardGuard],
    loadComponent: () =>
      import('./domain/pages/login/login').then(m => m.Login)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./domain/pages/home/home').then(m => m.Home)
  },
  {
    path: 'home/:id',
    loadComponent: () =>
      import('./domain/pages/home/home').then(m => m.Home)
  },
 
  {
    path: '**',
    loadComponent: () =>
      import('./domain/pages/not-found/not-found').then(m => m.NotFound)
  }
];
