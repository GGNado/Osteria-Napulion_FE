import { baseUrl } from './base.url';

export class AllUrl {
  private static baseUrl: string = baseUrl + '/api';

  public static login(): string {
    return this.baseUrl + '/auth/signin';
  }

  public static reservation(): string {
    return this.baseUrl + '/prenotazioni';
  }

  static reservationByDate(date: String) {
    return this.baseUrl + '/prenotazioni/' + date;
  }

  static reservationUpdateStatus(id: number) {
    return this.baseUrl + '/prenotazioni/' + id + '/state';
  }

  static reservationCounter(){
    return this.baseUrl + '/prenotazioni/month/counter';
  }

  static reservationResendEmail() {
    return this.baseUrl + "/prenotazioni/resend-email";
  }
}
