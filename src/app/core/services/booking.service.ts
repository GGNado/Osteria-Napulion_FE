import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateReservationDTO } from '../dto/create-reservation.dto';
import { AllUrl } from '../url/all.url';

@Injectable({ providedIn: 'root' })
export class BookingService {
    constructor(private readonly http: HttpClient) { }

  createReservation(dto: CreateReservationDTO): Observable<HttpResponse<any>> {
    return this.http.post(AllUrl.reservation(), dto, { observe: 'response' });
  }
}
