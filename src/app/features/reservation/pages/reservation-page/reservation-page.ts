import { Component } from '@angular/core';
import { HomeNavbarComponent } from '../../../home/layout/home-navbar/home-navbar';
import { ReservationHeroComponent } from '../../components/reservation-hero/reservation-hero';
import { ReservationFormComponent } from '../../components/reservation-form/reservation-form';
import { InfoSectionComponent } from '../../../home/components/info-section/info-section';

@Component({
    selector: 'app-reservation-page',
    standalone: true,
    imports: [
        HomeNavbarComponent,
        ReservationHeroComponent,
        ReservationFormComponent,
        InfoSectionComponent,
    ],
    templateUrl: './reservation-page.html',
    styleUrl: './reservation-page.css',
})
export class ReservationPageComponent { }
