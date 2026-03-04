import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header';
import { StatsCardsComponent } from '../../components/stats-cards/stats-cards';
import { ReservationsTableComponent } from '../../components/reservations-table/reservations-table';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [AdminHeaderComponent, StatsCardsComponent, ReservationsTableComponent],
    templateUrl: './dashboard-page.html',
    styleUrl: './dashboard-page.css',
})
export class DashboardPageComponent { }
