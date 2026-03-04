import { Component } from '@angular/core';
import { HomeNavbarComponent } from '../../layout/home-navbar/home-navbar';
import { HeroSectionComponent } from '../../components/hero-section/hero-section';
import { BookingSectionComponent } from '../../components/booking-section/booking-section';
import { SpecialsSectionComponent } from '../../components/specials-section/specials-section';
import { MenuSectionComponent } from '../../components/menu-section/menu-section';
import { AboutSectionComponent } from '../../components/about-section/about-section';
import { ReviewsSectionComponent } from '../../components/reviews-section/reviews-section';
import { InfoSectionComponent } from '../../components/info-section/info-section';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [
        HomeNavbarComponent,
        HeroSectionComponent,
        BookingSectionComponent,
        SpecialsSectionComponent,
        MenuSectionComponent,
        AboutSectionComponent,
        ReviewsSectionComponent,
        InfoSectionComponent,
    ],
    templateUrl: './home-page.html',
    styleUrl: './home-page.css',
})
export class HomePageComponent { }
