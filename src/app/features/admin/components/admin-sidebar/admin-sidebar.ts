import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface SidebarItem {
    label: string;
    icon: string;
    route: string;
    enabled: boolean;
}

@Component({
    selector: 'app-admin-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './admin-sidebar.html',
    styleUrl: './admin-sidebar.css',
})
export class AdminSidebarComponent {
    private readonly authService = inject(AuthService);

    readonly menuItems: SidebarItem[] = [
        { label: 'Dashboard', icon: 'dashboard', route: '/admin', enabled: true },
        { label: 'Prenotazioni', icon: 'calendar', route: '/admin/prenotazioni', enabled: true },
        { label: 'Mappa Tavoli', icon: 'map', route: '/admin/mappa-tavoli', enabled: true },
        { label: "Lista d'Attesa", icon: 'list', route: '', enabled: false },
        { label: 'Analisi', icon: 'chart', route: '', enabled: false },
    ];

    onLogout(): void {
        this.authService.logout();
    }
}
