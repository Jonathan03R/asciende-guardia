import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./auth/autenticacion/autenticacion.component'),
        canActivate: [publicGuard], 
    },
    {
        path: 'auth', loadComponent: () => import('./auth/autenticacion/autenticacion.component'),
        canActivate: [publicGuard],
    },
    
    {
        path: 'cargando', 
        canActivate: [authGuard],
        loadComponent: () => import('./auth/pantalla-carga/pantalla-carga.component')
    },
    {
        path: 'dash', 
        canActivate: [authGuard],
        loadComponent: () => import('./components/dash/dash.component'),
        children: [
            
            {path: 'home', loadComponent: () => import ('./pages/inicio/inicio.component'), title: 'Inicio'},
            {path: 'practica', loadComponent: ()=> import ('./pages/practicar/practicar.component') , title: 'practica'},
            {path: 'zona-estudios', loadComponent: () => import ('./pages/zona-estudios/zona-estudios.component'), title : 'Zona de estudios'},
            {path: '', redirectTo: '/dash/home', pathMatch: 'full'},
            {path: '**', redirectTo: '/dash/home', pathMatch: 'full'}

        ]
        
    },
    {
        path: 'v-r', loadComponent: () => import('./shared/pantalla-verificacion/pantalla-verificacion.component')
    },
    {
        path: 's', loadComponent: () => import('./shared/spinner/spinner.component')
    },
    {
        path: 'no-encontrada', loadComponent: () => import('./components/not-found/not-found.component')
    },
    {
        path: '**', 
        redirectTo: '/no-encontrada', 
        pathMatch: 'full'
    },


];
