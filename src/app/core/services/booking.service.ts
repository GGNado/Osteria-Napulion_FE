import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateReservationDTO } from '../dto/create-reservation.dto';
import { AllUrl } from '../url/all.url';
import {ReservationStatus} from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private readonly http: HttpClient) { }

  createReservation(dto: CreateReservationDTO): Observable<HttpResponse<any>> {
    return this.http.post(AllUrl.reservation(), dto, { observe: 'response' });
  }

  getResevationsFromdate(date: String): Observable<HttpResponse<any>> {
    return this.http.get(AllUrl.reservationByDate(date), { observe: 'response' });
  }

  getReservationCounter() : Observable<HttpResponse<any>>{
    return this.http.get(AllUrl.reservationCounter(), { observe: 'response' });
  }

  updateReservationStatus(id: number, stato: String): Observable<HttpResponse<any>> {
    return this.http.patch(AllUrl.reservationUpdateStatus(id), { stato }, { observe: 'response' });
  }

  resendConfirmationEmail(prenotazione: CreateReservationDTO | null): Observable<HttpResponse<any>> {
    return this.http.post(AllUrl.reservationResendEmail(), prenotazione, { observe: 'response' });

  }
}
