import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                component: DashboardPageComponent,
            },
        ],
    },
];
