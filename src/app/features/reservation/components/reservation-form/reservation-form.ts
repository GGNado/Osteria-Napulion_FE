import { Component, inject, signal, OnDestroy } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators, FormsModule} from '@angular/forms';
import { BookingService } from '../../../../core/services/booking.service';
import { CreateReservationDTO } from '../../../../core/dto/create-reservation.dto';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-reservation-form',
    standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
    templateUrl: './reservation-form.html',
    styleUrl: './reservation-form.css',
})
export class ReservationFormComponent implements OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly bookingService = inject(BookingService);

    readonly loading = signal(false);
    readonly success = signal(false);
    readonly error = signal<string | null>(null);

    /** Timer state */
    readonly countdown = signal(60);
    readonly canResend = signal(false);
    readonly resending = signal(false);
    private timerId: ReturnType<typeof setInterval> | null = null;

    coperti: number = 0;
    orario: string = '';


  readonly form = this.fb.nonNullable.group({
        nomeCliente: ['', Validators.required],
        cognomeCliente: ['', Validators.required],
        emailCliente: ['', [Validators.required, Validators.email]],
        telefonoCliente: ['', Validators.required],
        dataOra: ['', Validators.required],
        coperti: [2, [Validators.required, Validators.min(1)]],
    });

    /** Progress for the SVG ring (0 → 1) */
    get timerProgress(): number {
        return this.countdown() / 60;
    }

    /** SVG circle circumference (radius 45) */
    readonly circumference = 2 * Math.PI * 45;

    resendEmailAddress: any;
    prenotazione: CreateReservationDTO | null = null;

    get dashOffset(): number {
        return this.circumference * (1 - this.timerProgress);
    }

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

        this.prenotazione = dto;
        this.resendEmailAddress = dto.emailCliente;
        this.bookingService.createReservation(dto).subscribe({
            next: (res: HttpResponse<any>) => {

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
                this.startTimer();
            },
            error: (err: HttpErrorResponse) => {
                this.loading.set(false);
                this.error.set(err.error.message);
            },
        });
    }

    /** Start the 60-second countdown */
    private startTimer(): void {
        this.clearTimer();
        this.countdown.set(60);
        this.canResend.set(false);

        this.timerId = setInterval(() => {
            const current = this.countdown();
            if (current <= 1) {
                this.countdown.set(0);
                this.canResend.set(true);
                this.clearTimer();
            } else {
                this.countdown.set(current - 1);
            }
        }, 1000);
    }

    resendEmail(): void {
        this.resending.set(true);

        this.bookingService.resendConfirmationEmail(this.prenotazione).subscribe({
            next: (res) => {
                this.resending.set(false);
                this.startTimer();
            }
        });

    }

    private clearTimer(): void {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    ngOnDestroy(): void {
        this.clearTimer();
    }

    isInvalid(name: string): boolean {
        const ctrl = this.form.get(name);
        return !!ctrl && ctrl.invalid && ctrl.touched;
    }
}
