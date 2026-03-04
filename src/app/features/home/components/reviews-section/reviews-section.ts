import { Component, signal } from '@angular/core';

interface ReviewItem {
    author: string;
    rating: number;
    text: string;
    date: string;
}

@Component({
    selector: 'app-reviews-section',
    standalone: true,
    templateUrl: './reviews-section.html',
    styleUrl: './reviews-section.css',
})
export class ReviewsSectionComponent {
    readonly reviews = signal<ReviewItem[]>([
        {
            author: 'Francesca M.',
            rating: 5,
            text: "Un'esperienza magnifica! Un viaggio sensoriale a Napoli. Le prime cime fanno invidia.",
            date: '15 Ottobre 2024',
        },
        {
            author: 'Marco B.',
            rating: 5,
            text: "Un pranzo eccezionale in un'atmosfera familiare. Il pesce era di una freschezza impareggiabile. Servizio Napoletano!",
            date: '12 Ottobre 2024',
        },
        {
            author: 'Elena V.',
            rating: 5,
            text: "L'ospitalità e la tradizione si fondono perfettamente. La Neapolitan coda di rospo era da urlo!",
            date: '8 Ottobre 2024',
        },
    ]);

    getStars(rating: number): number[] {
        return Array(rating).fill(0);
    }
}
