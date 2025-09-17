import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
{ path: '', component: Home }, // Default ruta
// { path: 'movies', component: MoviesComponent }, // /kontakti prikazuje KontaktiComponent
// { path: 'about', component: AboutComponent }, // /about prikazuje AboutComponent
{ path: '**', redirectTo: "", pathMatch: 'full' } // Fallback ruta
];
