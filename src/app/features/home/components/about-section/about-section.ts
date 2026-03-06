import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-about-section',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './about-section.html',
    styleUrl: './about-section.css',
})
export class AboutSectionComponent { }
