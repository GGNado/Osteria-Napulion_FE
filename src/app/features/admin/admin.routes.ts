import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page';
import { ReservationsPageComponent } from './pages/reservations-page/reservations-page';
import { FloorPlanPageComponent } from './pages/floor-plan-page/floor-plan-page';
import { authGuard } from '../../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: DashboardPageComponent,
            },
            {
                path: 'prenotazioni',
                component: ReservationsPageComponent,
            },
            {
                path: 'mappa-tavoli',
                component: FloorPlanPageComponent,
            },
        ],
    },
];
