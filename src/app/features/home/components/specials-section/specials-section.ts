import { Component, signal } from '@angular/core';

interface SpecialDish {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
}

@Component({
    selector: 'app-specials-section',
    standalone: true,
    templateUrl: './specials-section.html',
    styleUrl: './specials-section.css',
})
export class SpecialsSectionComponent {
    readonly dishes = signal<SpecialDish[]>([
        {
            name: 'Spaghetti alle Vongole',
            description: 'Vongole veraci, aglio, prezzemolo fresco',
            price: '€16',
            imageUrl: 'hero-food.png',
        },
        {
            name: 'Polpo alla Griglia',
            description: 'Polpo grigliato su crema di patate e olive',
            price: '€18',
            imageUrl: 'hero-food.png',
        },
        {
            name: 'Pappardelle al Cinghiale',
            description: 'Pappardelle a mano e Ragù di cinghiale delle colline',
            price: '€15',
            imageUrl: 'hero-food.png',
        },
    ]);
}
