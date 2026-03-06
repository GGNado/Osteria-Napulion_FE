import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./features/login/login.routes').then((m) => m.LOGIN_ROUTES),
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    },
    {
        path: 'prenota',
        loadChildren: () =>
            import('./features/reservation/reservation.routes').then((m) => m.RESERVATION_ROUTES),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
