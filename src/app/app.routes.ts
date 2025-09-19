import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Register } from './register/register';
import { Login } from './login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Login },           // ← Default: show login
  { path: 'home', component: Home },
  { path: 'register', component: Register }, 
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' } // Fallback to login
];
