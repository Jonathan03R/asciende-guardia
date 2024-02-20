// Definición de rutas para la aplicación Angular

import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./auth/principal/principal.component'),
        canActivate: [publicGuard], // Guardia de ruta para usuarios no autenticados
    },
    {
        path: 'auth',
        loadComponent: () => import('./auth/login/login.component'),
        canActivate: [publicGuard], // Guardia de ruta para usuarios no autenticados
    },
    {
        path: 'principal',
        loadComponent: () => import('./auth/principal/principal.component'),
        canActivate: [publicGuard],
    },
    {
        // Ruta para la pantalla de carga
        path: 'cargando',
        canActivate: [authGuard], // Guardia de ruta para usuarios autenticados
        loadComponent: () => import('./auth/pantalla-carga/pantalla-carga.component')
    },
    {
        // Ruta del panel de control
        path: 'dash',
        canActivate: [authGuard], // Guardia de ruta para usuarios autenticados
        loadComponent: () => import('./components/dash/dash.component'),
        children: [
            // Rutas hijas del panel de control
            { path: 'home', loadComponent: () => import('./pages/inicio/inicio.component'), title: 'Inicio' },
            {
                path: 'practica', loadComponent: () => import('./pages/practicar/practicar.component'), title: 'Práctica',
                
            },
            { path: 'zona-estudios', loadComponent: () => import('./pages/zona-estudios/zona-estudios.component'), title: 'Zona de estudios' },
            { path: '', redirectTo: '/dash/home', pathMatch: 'full' }, // Redirección por defecto a la ruta home
            { path: '**', redirectTo: '/dash/home', pathMatch: 'full' } // Redirección en caso de ruta desconocida
        ]
    },
    {
        // Ruta para la pantalla de verificación
        path: 'v-r',
        loadComponent: () => import('./shared/pantalla-verificacion/pantalla-verificacion.component')
    },
    {
        // Ruta para el componente de spinner
        path: 's',
        loadComponent: () => import('./shared/spinner/spinner.component')
    },
    {
        // Ruta para la página de no encontrada
        path: 'no-encontrada',
        loadComponent: () => import('./components/not-found/not-found.component')
    },
    {
        // Redirección en caso de ruta desconocida
        path: '**',
        redirectTo: '/no-encontrada',
        pathMatch: 'full'
    },
];
