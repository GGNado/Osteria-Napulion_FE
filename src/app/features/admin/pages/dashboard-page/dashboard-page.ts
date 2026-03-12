import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header';
import { ReservationsTableComponent } from '../../components/reservations-table/reservations-table';
import { ReservationsCalendarComponent } from '../../components/reservations-calendar/reservations-calendar';
import {FloorPlanComponent} from '../../components/floor-plan/floor-plan';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
  imports: [AdminHeaderComponent, ReservationsTableComponent, ReservationsCalendarComponent, FloorPlanComponent],
    templateUrl: './dashboard-page.html',
    styleUrl: './dashboard-page.css',
})
export class DashboardPageComponent {
    calendarSelectedDate: string | null = null;

    onDaySelected(date: string): void {
        this.calendarSelectedDate = date;
    }
}
