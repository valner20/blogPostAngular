import { Routes } from '@angular/router';
import { Register } from './domain/pages/register/register';
import { Login } from './domain/pages/login/login';
import { Home } from './domain/pages/home/home';
import { guardGuard } from './guard/guard-guard';
export const routes: Routes = [

  {
    path: "registrar",
    component:Register,
    canActivate: [guardGuard]
  },
  {
    path: "login",
    component:Login,
    canActivate: [guardGuard]

  },
  {
    path: "home",
    component: Home
  },
  {
  path: "home/:id",
  component: Home
  }
];
