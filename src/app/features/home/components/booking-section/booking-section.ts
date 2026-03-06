import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-booking-section',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './booking-section.html',
    styleUrl: './booking-section.css',
})
export class BookingSectionComponent { }
