import { Component, signal } from '@angular/core';

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
    readonly menuItems = signal<SidebarItem[]>([
        { label: 'Dashboard', icon: '📊' },
        { label: 'Prenotazioni', icon: '📅' },
        { label: 'Mappa Tavoli', icon: '🗺️' },
        { label: "Lista d'Attesa", icon: '📋' },
        { label: 'Analisi', icon: '📈' },
    ]);

    readonly activeItem = signal('Dashboard');

    setActive(label: string): void {
        this.activeItem.set(label);
    }
}
