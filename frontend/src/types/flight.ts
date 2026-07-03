export interface Airport {
  airport_id: number;
  iata_code: string;
  airport_name: string;
  city: string;
  country: string;
  timezone: string;
  terminal: string | null;
}

export interface Aircraft {
  aircraft_id: number;
  model: string;
  type: 'WIDE-BODY' | 'NARROW-BODY';
  capacity: number;
  reg_number: string;
}

export interface FlightSchedule {
  dep_time: string;
  dep_timezone: string;
  arr_time: string;
  arr_timezone: string;
  frequency: string;
}

export interface FlightFares {
  ECONOMY: number;
  BUSINESS?: number;
  FIRST?: number;
}

export interface FlightResult {
  flight_id: number;
  flight_no: string;
  status: string;
  dep_date: string;
  duration: { hours: number; minutes: number };
  flight_type: string;
  dep_airport: Airport | null;
  arr_airport: Airport | null;
  schedule: FlightSchedule | null;
  aircraft: Aircraft | null;
  available_seats: Record<string, number>;
  fares: FlightFares;
  currency: string;
}

export interface FlightSearchResponse {
  total: number;
  page: number;
  per_page: number;
  flights: FlightResult[];
  filters_meta: {
    min_price: number;
    max_price: number;
    departure_windows: string[];
  };
}

export interface SeatInfo {
  seat_no: string;
  row: number;
  col: string;
  status: 'available' | 'occupied' | 'selected' | 'premium';
  cabin_class: string;
  is_window: boolean;
  is_aisle: boolean;
}

export interface CabinMap {
  seats: SeatInfo[];
  config: {
    rows: number;
    seats_per_row: number;
    labels: string[];
    start_row: number;
  };
}

export interface SeatMapResponse {
  flight_id: number;
  aircraft: { model: string; type: string; capacity: number };
  cabin_map: Record<string, CabinMap>;
  booked_count: number;
}

export interface PassengerInput {
  first_name: string;
  last_name: string;
  passport_no?: string;
  date_of_birth?: string;
  nationality?: string;
  gender?: string;
  meal_plan_id?: number | null;
}

export interface BookingResponse {
  booking_id: number;
  pnr: string;
  status: string;
  flight: { flight_no: string; dep_date: string };
  passengers: { name: string; seat: string }[];
  cabin_class: string;
  total_amount: number;
  currency: string;
  seat_lock_expires_at: string;
  next_step: string;
}

export type CabinClass = 'ECONOMY' | 'BUSINESS' | 'FIRST';
