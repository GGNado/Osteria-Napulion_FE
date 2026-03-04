import { Component, inject } from '@angular/core';
import { ReservationService } from '../../../../core/services/reservation.service';

@Component({
    selector: 'app-stats-cards',
    standalone: true,
    templateUrl: './stats-cards.html',
    styleUrl: './stats-cards.css',
})
export class StatsCardsComponent {
    private readonly reservationService = inject(ReservationService);
    readonly stats = this.reservationService.stats;
}
