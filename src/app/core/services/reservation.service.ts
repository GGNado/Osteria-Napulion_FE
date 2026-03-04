import { Injectable, signal, computed } from '@angular/core';
import { Reservation, ReservationStatus, RestaurantStats } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    private readonly reservations = signal<Reservation[]>([
        {
            id: 1,
            clientName: 'Julianna DeWitt',
            initials: 'JD',
            time: '18:30',
            guests: 4,
            status: ReservationStatus.CONFERMATO,
        },
        {
            id: 2,
            clientName: 'Marcus Kenter',
            initials: 'MK',
            time: '19:00',
            guests: 2,
            status: ReservationStatus.SEDUTO,
        },
        {
            id: 3,
            clientName: 'Sarah Richardson',
            initials: 'SR',
            time: '19:15',
            guests: 6,
            status: ReservationStatus.IN_ATTESA,
        },
        {
            id: 4,
            clientName: 'Thomas Chen',
            initials: 'TC',
            time: '20:00',
            guests: 2,
            status: ReservationStatus.CONFERMATO,
        },
    ]);

    readonly allReservations = this.reservations.asReadonly();

    readonly stats = computed<RestaurantStats>(() => ({
        tavoliPrenotati: 12,
        tavoliLiberi: 8,
    }));

    getFilteredReservations(filter: 'all' | 'confirmed' | 'seated') {
        const all = this.reservations();
        switch (filter) {
            case 'confirmed':
                return all.filter((r) => r.status === ReservationStatus.CONFERMATO);
            case 'seated':
                return all.filter((r) => r.status === ReservationStatus.SEDUTO);
            default:
                return all;
        }
    }
}
