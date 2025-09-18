import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Register } from './register/register';

export const routes: Routes = [
{ path: '', component: Home }, // Default ruta
{ path: 'register', component: Register }, // /kontakti prikazuje KontaktiComponent
// { path: 'about', component: AboutComponent }, // /about prikazuje AboutComponent
{ path: '**', redirectTo: "", pathMatch: 'full' } // Fallback ruta
];
