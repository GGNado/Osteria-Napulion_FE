import { Component, inject, signal, computed, output, OnInit, Input, HostBinding } from '@angular/core';
import { BookingService } from '../../../../core/services/booking.service';

interface CalendarDay {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    reservationCount: number;
}

@Component({
    selector: 'app-reservations-calendar',
    standalone: true,
    imports: [],
    templateUrl: './reservations-calendar.html',
    styleUrl: './reservations-calendar.css',
})
export class ReservationsCalendarComponent implements OnInit {
    @Input() mini = false;
    @HostBinding('class.mini') get isMini() { return this.mini; }
    private readonly bookingService = inject(BookingService);

    readonly currentMonth = signal(new Date().getMonth());
    readonly currentYear = signal(new Date().getFullYear());
    readonly selectedDate = signal<string>(this.formatDate(new Date()));
    readonly calendarDays = signal<CalendarDay[]>([]);
    readonly loadingDays = signal(false);

    /** Emits the selected date in YYYY-MM-DD format */
    readonly daySelected = output<string>();

    readonly weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

    readonly monthYearLabel = computed(() => {
        const months = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];
        return `${months[this.currentMonth()]} ${this.currentYear()}`;
    });

    /** Reservation counts keyed by YYYY-MM-DD */
    private reservationCounts = new Map<string, number>();

    ngOnInit(): void {
        this.buildCalendar();
        this.loadMonthReservations();
    }

    prevMonth(): void {
        let m = this.currentMonth();
        let y = this.currentYear();
        if (m === 0) {
            m = 11;
            y--;
        } else {
            m--;
        }
        this.currentMonth.set(m);
        this.currentYear.set(y);
        this.buildCalendar();
        this.loadMonthReservations();
    }

    nextMonth(): void {
        let m = this.currentMonth();
        let y = this.currentYear();
        if (m === 11) {
            m = 0;
            y++;
        } else {
            m++;
        }
        this.currentMonth.set(m);
        this.currentYear.set(y);
        this.buildCalendar();
        this.loadMonthReservations();
    }

    selectDay(day: CalendarDay): void {
        if (!day.isCurrentMonth) return;
        const dateStr = this.formatDate(day.date);
        this.selectedDate.set(dateStr);
        this.daySelected.emit(dateStr);
    }

    isSelected(day: CalendarDay): boolean {
        return day.isCurrentMonth && this.formatDate(day.date) === this.selectedDate();
    }

    private buildCalendar(): void {
        const month = this.currentMonth();
        const year = this.currentYear();
        const today = new Date();
        const todayStr = this.formatDate(today);

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Monday = 0, Sunday = 6 (ISO week)
        let startDow = firstDay.getDay() - 1;
        if (startDow < 0) startDow = 6;

        const days: CalendarDay[] = [];

        // Previous month padding
        for (let i = startDow - 1; i >= 0; i--) {
            const d = new Date(year, month, -i);
            days.push({
                date: d,
                day: d.getDate(),
                isCurrentMonth: false,
                isToday: false,
                reservationCount: 0,
            });
        }

        // Current month days
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(year, month, d);
            days.push({
                date,
                day: d,
                isCurrentMonth: true,
                isToday: this.formatDate(date) === todayStr,
                reservationCount: 0,
            });
        }

        // Next month padding to fill 6 rows (42 cells) or at least complete the row
        const remainder = days.length % 7;
        if (remainder > 0) {
            const fill = 7 - remainder;
            for (let i = 1; i <= fill; i++) {
                const d = new Date(year, month + 1, i);
                days.push({
                    date: d,
                    day: d.getDate(),
                    isCurrentMonth: false,
                    isToday: false,
                    reservationCount: 0,
                });
            }
        }

        this.calendarDays.set(days);
    }

    private loadMonthReservations(): void {
        this.loadingDays.set(true);
        this.reservationCounts.clear();

        // Use the single endpoint that returns counts for the whole month
        this.bookingService.getReservationCounter().subscribe({
            next: (response) => {
              const data = response.body;
              if (data?.dataCounter) {
                Object.entries(data.dataCounter).forEach(([dateStr, val]) => {
                  this.reservationCounts.set(dateStr, val as number);
                });
              }
                // Apply whatever we have (may be empty) to the calendar
                this.applyCountsToCalendar();
                this.loadingDays.set(false);
            },
            error: () => {
                // On error just ensure calendar is updated (with zeros) and stop loading
                this.applyCountsToCalendar();
                this.loadingDays.set(false);
            },
        });
    }

    private applyCountsToCalendar(): void {
        this.calendarDays.update(days =>
            days.map(day => ({
                ...day,
                reservationCount: this.reservationCounts.get(this.formatDate(day.date)) ?? 0,
            }))
        );
    }

    private formatDate(d: Date): string {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
