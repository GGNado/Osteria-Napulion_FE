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

/** Row model shared between reservations-table and floor-plan */
export interface ReservationRow {
  id: number;
  clientName: string;
  initials: string;
  time: string;
  tableName: string;
  tableId: number | null;
  guests: number;
  status: string;
  email: string;
  phone: string;
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
