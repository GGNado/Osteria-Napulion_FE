import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-info-section',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './info-section.html',
    styleUrl: './info-section.css',
})
export class InfoSectionComponent {
    readonly currentYear = new Date().getFullYear();
}
