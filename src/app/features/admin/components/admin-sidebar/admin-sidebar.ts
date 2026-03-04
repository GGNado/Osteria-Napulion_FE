import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

interface SidebarItem {
    label: string;
    icon: string;
}

@Component({
    selector: 'app-admin-sidebar',
    standalone: true,
    templateUrl: './admin-sidebar.html',
    styleUrl: './admin-sidebar.css',
})
export class AdminSidebarComponent {
    private readonly authService = inject(AuthService);

    readonly menuItems = signal<SidebarItem[]>([
        { label: 'Dashboard', icon: 'dashboard' },
        { label: 'Prenotazioni', icon: 'calendar' },
        { label: 'Mappa Tavoli', icon: 'map' },
        { label: "Lista d'Attesa", icon: 'list' },
        { label: 'Analisi', icon: 'chart' },
    ]);

    readonly activeItem = signal('Dashboard');

    setActive(label: string): void {
        this.activeItem.set(label);
    }

    onLogout(): void {
        this.authService.logout();
    }
}
