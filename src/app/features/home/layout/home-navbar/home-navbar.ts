import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-home-navbar',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home-navbar.html',
    styleUrl: './home-navbar.css',
})
export class HomeNavbarComponent {
    private readonly authService = inject(AuthService);

    readonly mobileMenuOpen = signal(false);
    readonly isAuthenticated = this.authService.isAuthenticated;

    toggleMobileMenu(): void {
        this.mobileMenuOpen.update((v) => !v);
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen.set(false);
    }
}
