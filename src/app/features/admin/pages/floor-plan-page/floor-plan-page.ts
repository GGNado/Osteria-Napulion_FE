import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header';
import { FloorPlanComponent } from '../../components/floor-plan/floor-plan';

@Component({
    selector: 'app-floor-plan-page',
    standalone: true,
    imports: [AdminHeaderComponent, FloorPlanComponent],
    templateUrl: './floor-plan-page.html',
    styleUrl: './floor-plan-page.css',
})
export class FloorPlanPageComponent { }
