import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-header',
    standalone: true,
    templateUrl: './admin-header.html',
    styleUrl: './admin-header.css',
})
export class AdminHeaderComponent {
    readonly today = new Date();

    get formattedDate(): string {
        return this.today.toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
}
