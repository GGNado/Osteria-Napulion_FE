import { Component, inject, signal, computed } from '@angular/core';
import { ReservationService } from '../../../../core/services/reservation.service';
import { Reservation } from '../../../../core/models/reservation.model';

type FilterType = 'all' | 'confirmed' | 'seated';

@Component({
    selector: 'app-reservations-table',
    standalone: true,
    templateUrl: './reservations-table.html',
    styleUrl: './reservations-table.css',
})
export class ReservationsTableComponent {
    private readonly reservationService = inject(ReservationService);

    readonly activeFilter = signal<FilterType>('all');

    readonly filteredReservations = computed<Reservation[]>(() =>
        this.reservationService.getFilteredReservations(this.activeFilter())
    );

    readonly filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'Tutte' },
        { key: 'confirmed', label: 'Confermate' },
        { key: 'seated', label: 'Al Tavolo' },
    ];

    setFilter(filter: FilterType): void {
        this.activeFilter.set(filter);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Confermato':
                return 'status-confirmed';
            case 'Seduto':
                return 'status-seated';
            case 'In Attesa':
                return 'status-waiting';
            default:
                return '';
        }
    }
}
