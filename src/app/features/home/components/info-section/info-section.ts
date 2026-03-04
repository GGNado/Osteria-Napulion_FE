import { Component } from '@angular/core';

@Component({
    selector: 'app-info-section',
    standalone: true,
    templateUrl: './info-section.html',
    styleUrl: './info-section.css',
})
export class InfoSectionComponent {
    readonly currentYear = new Date().getFullYear();
}
