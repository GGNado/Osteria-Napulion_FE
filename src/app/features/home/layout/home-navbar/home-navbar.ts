import { Component, signal } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
    selector: 'app-home-navbar',
    standalone: true,
  imports: [RouterLink, RouterLinkActive],
    templateUrl: './home-navbar.html',
    styleUrl: './home-navbar.css',
})
export class HomeNavbarComponent {
    readonly mobileMenuOpen = signal(false);

    toggleMobileMenu(): void {
        this.mobileMenuOpen.update((v) => !v);
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen.set(false);
    }
}
