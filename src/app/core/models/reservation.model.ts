export enum ReservationStatus {
  CONFERMATO = 'Confermato',
  SEDUTO = 'Seduto',
  IN_ATTESA = 'In Attesa',
}

export interface Reservation {
  id: number;
  clientName: string;
  initials: string;
  time: string;
  guests: number;
  status: ReservationStatus;
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface RestaurantStats {
  tavoliPrenotati: number;
  tavoliLiberi: number;
}
