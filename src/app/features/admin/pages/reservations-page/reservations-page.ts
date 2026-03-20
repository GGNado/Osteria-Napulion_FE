import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header';
import { ReservationsTableComponent } from '../../components/reservations-table/reservations-table';
import { ReservationsCalendarComponent } from '../../components/reservations-calendar/reservations-calendar';

@Component({
    selector: 'app-reservations-page',
    standalone: true,
    imports: [AdminHeaderComponent, ReservationsCalendarComponent, ReservationsTableComponent],
    templateUrl: './reservations-page.html',
    styleUrl: './reservations-page.css',
})
export class ReservationsPageComponent {
    calendarSelectedDate: string | null = null;

    onDaySelected(date: string): void {
        this.calendarSelectedDate = date;
    }
}
