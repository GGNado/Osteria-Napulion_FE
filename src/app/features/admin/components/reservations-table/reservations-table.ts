import { Component, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { BookingService } from '../../../../core/services/booking.service';
import { FormsModule } from '@angular/forms';

type FilterType = 'all' | 'confirmed' | 'seated' | 'waiting';

interface ReservationRow {
    id: number;
    clientName: string;
    initials: string;
    time: string;
    guests: number;
    status: string;
    email: string;
    phone: string;
}

@Component({
    selector: 'app-reservations-table',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './reservations-table.html',
    styleUrl: './reservations-table.css',
})
export class ReservationsTableComponent implements OnInit {
    private readonly bookingService = inject(BookingService);

    readonly selectedDate = signal<string>(this.getTodayString());
    readonly reservations = signal<ReservationRow[]>([]);
    readonly loading = signal<boolean>(false);
    readonly error = signal<string | null>(null);
    readonly activeFilter = signal<FilterType>('all');
    readonly openMenuId = signal<number | null>(null);

    readonly statusActions: { label: string; value: string; icon: string }[] = [
        { label: 'Confermato', value: 'CONFERMATO', icon: '✓' },
        { label: 'Seduto', value: 'SEDUTO', icon: '🪑' },
        { label: 'In Attesa', value: 'IN_ATTESA', icon: '⏳' },
        { label: 'Rifiutata', value: 'RIFIUTATA', icon: '✕' },
    ];

    readonly filteredReservations = computed<ReservationRow[]>(() => {
        const all = this.reservations();
        const filter = this.activeFilter();
        switch (filter) {
            case 'confirmed':
                return all.filter((r) => r.status === 'Confermato');
            case 'seated':
                return all.filter((r) => r.status === 'Seduto');
            case 'waiting':
                return all.filter((r) => r.status === 'In Attesa');
            default:
                return all;
        }
    });

    readonly filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'Tutte' },
        { key: 'confirmed', label: 'Confermate' },
        { key: 'seated', label: 'Al Tavolo' },
        { key: 'waiting', label: 'In Attesa' },
    ];

    ngOnInit(): void {
        this.loadReservations(this.selectedDate());
    }

    onDateChange(date: string): void {
        this.selectedDate.set(date);
        this.loadReservations(date);
    }

    shiftDate(days: number): void {
        const current = new Date(this.selectedDate());
        current.setDate(current.getDate() + days);
        const newDate = this.formatDate(current);
        this.selectedDate.set(newDate);
        this.loadReservations(newDate);
    }

    setFilter(filter: FilterType): void {
        this.activeFilter.set(filter);
    }

    toggleMenu(id: number, event: Event): void {
        event.stopPropagation();
        this.openMenuId.set(this.openMenuId() === id ? null : id);
    }

    changeStatus(res: ReservationRow, newStatus: string): void {
        this.openMenuId.set(null);
        const oldStatus = res.status;
        // Optimistic update
        this.reservations.update(list =>
            list.map(r => r.id === res.id ? { ...r, status: newStatus } : r)
        );



        this.bookingService.updateReservationStatus(res.id, newStatus).subscribe({
            error: (err) => {
                // Rollback on failure

              console.log(err);
                this.reservations.update(list =>
                    list.map(r => r.id === res.id ? { ...r, status: oldStatus } : r)
                );
            },
        });
    }

    @HostListener('document:click')
    closeMenu(): void {
        this.openMenuId.set(null);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Confermato':
                return 'status-confirmed';
            case 'Seduto':
                return 'status-seated';
            case 'In Attesa':
                return 'status-waiting';
            case 'Rifiutata':
                return 'status-rejected';
            default:
                return '';
        }
    }

    private loadReservations(date: string): void {
        this.loading.set(true);
        this.error.set(null);

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
                this.error.set('Impossibile caricare le prenotazioni. Riprova più tardi.');
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

        return {
            id: item.id ?? index,
            clientName: fullName || 'N/D',
            initials: initials || '??',
            time: time || 'N/D',
            guests: item.coperti ?? 0,
            status: item.stato || 'In Attesa',
            email: item.emailCliente || '',
            phone: item.telefonoCliente || '',
        };
    }

    private getTodayString(): string {
        return this.formatDate(new Date());
    }

    private formatDate(d: Date): string {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
