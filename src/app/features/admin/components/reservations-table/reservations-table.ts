import { Component, inject, signal, computed, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BookingService } from '../../../../core/services/booking.service';
import { ReservationRow } from '../../../../core/models/reservation.model';
import { FormsModule } from '@angular/forms';

type FilterType = 'all' | 'confirmed' | 'seated' | 'waiting';

@Component({
    selector: 'app-reservations-table',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './reservations-table.html',
    styleUrl: './reservations-table.css',
})
export class ReservationsTableComponent implements OnInit, OnChanges {
    /** Optional: date passed from calendar selection */
    @Input() initialDate: string | null = null;

    /**
     * Se fornito dal parent, le prenotazioni vengono usate direttamente
     * senza caricarle internamente (modalità dashboard).
     */
    @Input() externalReservations: ReservationRow[] | null = null;

    /** Emette la data selezionata quando l'utente la cambia */
    @Output() dateChanged = new EventEmitter<string>();

    /** Emette la lista aggiornata quando cambia lo stato di una prenotazione */
    @Output() reservationsUpdated = new EventEmitter<ReservationRow[]>();

    private readonly bookingService = inject(BookingService);

    readonly selectedDate = signal<string>(this.getTodayString());
    readonly reservations = signal<ReservationRow[]>([]);
    readonly loading = signal<boolean>(false);
    readonly error = signal<string | null>(null);
    readonly activeFilter = signal<FilterType>('all');
    readonly selectedReservation = signal<ReservationRow | null>(null);

    readonly statusActions: { label: string; value: string; icon: string }[] = [
        { label: 'Confermato', value: 'CONFERMATA', icon: '✓' },
        { label: 'Seduto', value: 'SEDUTO', icon: '🪑' },
        { label: 'In Attesa', value: 'IN_ATTESA', icon: '⏳' },
        { label: 'Annulla', value: 'ANNULLATA', icon: '✕' },
    ];

    /** Status priority for sorting (lower = shown first) */
    private readonly statusPriority: Record<string, number> = {
        'In Attesa': 0,
        'Confermato': 1,
        'Seduto': 2,
        'Rifiutata': 3,
        'Annullata': 4,
    };

    readonly filteredReservations = computed<ReservationRow[]>(() => {
        let list = this.reservations();
        const filter = this.activeFilter();
        switch (filter) {
            case 'confirmed':
                list = list.filter((r) => r.status === 'CONFERMATA');
                break;
            case 'seated':
                list = list.filter((r) => r.status === 'SEDUTO');
                break;
            case 'waiting':
                list = list.filter((r) => r.status === 'IN_ATTESA');
                break;
        }
        // Sort by status priority
        return [...list].sort(
            (a, b) =>
                (this.statusPriority[a.status] ?? 99) -
                (this.statusPriority[b.status] ?? 99)
        );
    });

    readonly filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'Tutte' },
        { key: 'confirmed', label: 'Confermate' },
        { key: 'seated', label: 'Al Tavolo' },
        { key: 'waiting', label: 'In Attesa' },
    ];

    ngOnInit(): void {
        if (!this.externalReservations) {
            this.loadReservations(this.selectedDate());
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['initialDate'] && changes['initialDate'].currentValue) {
            const date = changes['initialDate'].currentValue;
            this.selectedDate.set(date);
            if (!this.externalReservations) {
                this.loadReservations(date);
            }
        }
        if (changes['externalReservations'] && this.externalReservations) {
            this.reservations.set(this.externalReservations);
        }
    }

    onDateChange(date: string): void {
        this.selectedDate.set(date);
        this.dateChanged.emit(date);
        if (!this.externalReservations) {
            this.loadReservations(date);
        }
    }

    shiftDate(days: number): void {
        const current = new Date(this.selectedDate());
        current.setDate(current.getDate() + days);
        const newDate = this.formatDate(current);
        this.selectedDate.set(newDate);
        this.dateChanged.emit(newDate);
        if (!this.externalReservations) {
            this.loadReservations(newDate);
        }
    }

    setFilter(filter: FilterType): void {
        this.activeFilter.set(filter);
    }

    openDetail(res: ReservationRow): void {
        this.selectedReservation.set(res);
    }

    closeDetail(): void {
        this.selectedReservation.set(null);
    }

    onOverlayClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
            this.closeDetail();
        }
    }

    changeStatus(res: ReservationRow, newStatus: string): void {
        const oldStatus = res.status;
        // Optimistic update
        this.reservations.update(list =>
            list.map(r => r.id === res.id ? { ...r, status: newStatus } : r)
        );
        this.reservationsUpdated.emit(this.reservations());
        // Refresh modal if open
        const sel = this.selectedReservation();
        if (sel && sel.id === res.id) {
            this.selectedReservation.set({ ...sel, status: newStatus });
        }

        this.bookingService.updateReservationStatus(res.id, newStatus).subscribe({
            error: (err) => {
                console.log(err);
                this.reservations.update(list =>
                    list.map(r => r.id === res.id ? { ...r, status: oldStatus } : r)
                );
                this.reservationsUpdated.emit(this.reservations());
                if (sel && sel.id === res.id) {
                    this.selectedReservation.set({ ...sel, status: oldStatus });
                }
            },
        });
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
            case 'Annullata':
                return 'status-rejected';
            default:
                return '';
        }
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'Confermato':
                return '✓';
            case 'Seduto':
                return '🪑';
            case 'In Attesa':
                return '⏳';
            case 'Rifiutata':
            case 'Annullata':
                return '✕';
            default:
                return '';
        }
    }

    loadReservations(date: string): void {
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

    mapToRow(item: any, index: number): ReservationRow {
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
            tableName: item.tavolo?.nome ?? 'N/D',
            tableId: item.tavolo?.id ?? null,
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
