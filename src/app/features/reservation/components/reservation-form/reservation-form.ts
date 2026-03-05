import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookingService } from '../../../../core/services/booking.service';
import { CreateReservationDTO } from '../../../../core/dto/create-reservation.dto';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

@Component({
    selector: 'app-reservation-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './reservation-form.html',
    styleUrl: './reservation-form.css',
})
export class ReservationFormComponent {
    private readonly fb = inject(FormBuilder);
    private readonly bookingService = inject(BookingService);

    readonly loading = signal(false);
    readonly success = signal(false);
    readonly error = signal<string | null>(null);

    coperti : number = 0;
    orario: string = '';

    readonly form = this.fb.nonNullable.group({
        nomeCliente: ['', Validators.required],
        cognomeCliente: ['', Validators.required],
        emailCliente: ['', [Validators.required, Validators.email]],
        telefonoCliente: ['', Validators.required],
        dataOra: ['', Validators.required],
        coperti: [2, [Validators.required, Validators.min(1)]],
    });

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        const raw = this.form.getRawValue();

        const localDate = new Date(raw.dataOra);
        const offset = localDate.getTimezoneOffset() * 60000;
        const localISO = new Date(localDate.getTime() - offset).toISOString();

        const dto: CreateReservationDTO = {
          ...raw,
          dataOra: localISO,
        };

        this.bookingService.createReservation(dto).subscribe({
            next: (res: HttpResponse<any>) => {
                console.log(res);

              this.orario = new Date(res.body.dataOra).toLocaleString('it-IT', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
                this.coperti = res.body.coperti;
                this.loading.set(false);
                this.success.set(true);
            },
            error: (err: HttpErrorResponse) => {
                this.loading.set(false);
                this.error.set(err.error.message);
            },
        });
    }

    isInvalid(name: string): boolean {
        const ctrl = this.form.get(name);
        return !!ctrl && ctrl.invalid && ctrl.touched;
    }
}

