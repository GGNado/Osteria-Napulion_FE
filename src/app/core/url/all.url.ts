import { baseUrl } from './base.url';

export class AllUrl {
  private static baseUrl: string = baseUrl + '/api';

  public static login(): string {
    return this.baseUrl + '/auth/signin';
  }

  public static reservation(): string {
    return this.baseUrl + '/prenotazioni';
  }
}
