import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',            loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'chercheurs',      loadComponent: () => import('./pages/chercheurs/chercheurs').then(m => m.Chercheurs) },
  { path: 'chercheurs/:id',  loadComponent: () => import('./pages/chercheur-detail/chercheur-detail').then(m => m.ChercheurDetail) },
  { path: 'publications',    loadComponent: () => import('./pages/publications/publications').then(m => m.Publications) },
  { path: 'evenements',      loadComponent: () => import('./pages/evenements/evenements').then(m => m.Evenements) },
  { path: 'outils',          loadComponent: () => import('./pages/outils/outils').then(m => m.Outils) },
  { path: 'axes',            loadComponent: () => import('./pages/axes/axes').then(m => m.Axes) },
  { path: 'login',           loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'signup',          loadComponent: () => import('./pages/signup/signup').then(m => m.Signup) },
  { path: 'dashboard-admin', loadComponent: () => import('./pages/dashboard-admin/dashboard-admin').then(m => m.DashboardAdmin) },
  { path: 'dashboard-chercheur', loadComponent: () => import('./pages/dashboard-chercheur/dashboard-chercheur').then(m => m.DashboardChercheur) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'reset-password',  loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPassword) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
  { path: 'doctorants', loadComponent: () => import('./pages/doctorants/doctorants').then(m => m.Doctorants) },
];