import { Component, signal } from '@angular/core';

interface MenuCategory {
    name: string;
    icon: string;
}

@Component({
    selector: 'app-menu-section',
    standalone: true,
    templateUrl: './menu-section.html',
    styleUrl: './menu-section.css',
})
export class MenuSectionComponent {
    readonly categories = signal<MenuCategory[]>([
        { name: 'Antipasti', icon: '🥗' },
        { name: 'Primi', icon: '🍝' },
        { name: 'Secondi', icon: '🥩' },
        { name: 'Dolci', icon: '🍰' },
        { name: 'Pizze', icon: '🍕' },
    ]);
}
