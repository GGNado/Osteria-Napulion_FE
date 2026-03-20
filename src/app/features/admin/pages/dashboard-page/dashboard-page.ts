import { Component, inject, signal } from '@angular/core';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header';
import { ReservationsTableComponent } from '../../components/reservations-table/reservations-table';
import { ReservationsCalendarComponent } from '../../components/reservations-calendar/reservations-calendar';
import { FloorPlanComponent } from '../../components/floor-plan/floor-plan';
import { BookingService } from '../../../../core/services/booking.service';
import { ReservationRow } from '../../../../core/models/reservation.model';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [AdminHeaderComponent, ReservationsTableComponent, ReservationsCalendarComponent, FloorPlanComponent],
    templateUrl: './dashboard-page.html',
    styleUrl: './dashboard-page.css',
})
export class DashboardPageComponent {
    private readonly bookingService = inject(BookingService);

    readonly selectedDate = signal<string>(this.getTodayString());
    readonly reservations = signal<ReservationRow[]>([]);
    readonly loading = signal<boolean>(false);

    constructor() {
        this.loadReservations(this.selectedDate());
    }

    onDaySelected(date: string): void {
        this.selectedDate.set(date);
        this.loadReservations(date);
    }

    onDateChangedFromTable(date: string): void {
        this.selectedDate.set(date);
        this.loadReservations(date);
    }

    onReservationsUpdated(updated: ReservationRow[]): void {
        this.reservations.set(updated);
    }

    private loadReservations(date: string): void {
        this.loading.set(true);

        this.bookingService.getResevationsFromdate(date).subscribe({
            next: (response) => {
                const data = response.body;
                if (Array.isArray(data)) {
                    this.reservations.set(
                        data.map((item: any, index: number) => this.mapToRow(item, index))
                    );
                } else {
                    this.reservations.set([]);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Errore nel caricamento delle prenotazioni:', err);
                this.loading.set(false);
            },
        });
    }

    private mapToRow(item: any, index: number): ReservationRow {
        const nome = item.nomeCliente || '';
        const cognome = item.cognomeCliente || '';
        const fullName = `${nome} ${cognome}`.trim();
        const initials = `${nome.charAt(0)}${cognome.charAt(0)}`.toUpperCase();

        let time = '';
        if (item.dataOra) {
            const dateObj = new Date(item.dataOra);
            time = dateObj.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        }

        console.log(item.tavolo)

        return {
            id: item.id ?? index,
            clientName: fullName || 'N/D',
            tableName: item.tavolo ?? 'N/D',
            tableId: item.tavoloId ?? null,
            initials: initials || '??',
            time: time || 'N/D',
            guests: item.coperti ?? 0,
            status: item.stato || 'In Attesa',
            email: item.emailCliente || '',
            phone: item.telefonoCliente || '',
        };
    }

    private getTodayString(): string {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
