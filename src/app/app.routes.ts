import { Routes } from '@angular/router';
import { authGuard }  from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [loginGuard],
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '',        loadComponent: () => import('./features/users/list/user-list.component').then(m => m.UserListComponent) },
      { path: 'new',     loadComponent: () => import('./features/users/form/user-form.component').then(m => m.UserFormComponent) },
      { path: 'edit/:id',loadComponent: () => import('./features/users/form/user-form.component').then(m => m.UserFormComponent) },
    ]
  },
  {
    path: 'products',
    canActivate: [authGuard],
    children: [
      { path: '',        loadComponent: () => import('./features/products/list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'new',     canActivate: [adminGuard], loadComponent: () => import('./features/products/form/product-form.component').then(m => m.ProductFormComponent) },
      { path: 'edit/:id',canActivate: [adminGuard], loadComponent: () => import('./features/products/form/product-form.component').then(m => m.ProductFormComponent) },
    ]
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
