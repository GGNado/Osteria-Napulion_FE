import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page';
import { guestGuard } from '../../core/guards/guest.guard';

export const LOGIN_ROUTES: Routes = [
    {
        path: '',
        component: LoginPageComponent,
        canActivate: [guestGuard],
    },
];
