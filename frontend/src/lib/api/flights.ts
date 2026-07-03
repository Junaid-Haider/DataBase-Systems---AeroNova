import api from './client';
import type { Airport, FlightSearchResponse, FlightResult, SeatMapResponse, BookingResponse, PassengerInput } from '../../types/flight';

export async function searchAirports(query: string): Promise<Airport[]> {
  const { data } = await api.get('/airports/search', { params: { q: query } });
  return data.airports;
}

export async function searchFlights(params: Record<string, string | number>): Promise<FlightSearchResponse> {
  const { data } = await api.get('/flights/search', { params });
  return data;
}

export async function getFlightDetail(flightId: number): Promise<FlightResult> {
  const { data } = await api.get(`/flights/${flightId}`);
  return data.flight;
}

export async function getFlightSeats(flightId: number): Promise<SeatMapResponse> {
  const { data } = await api.get(`/flights/${flightId}/seats`);
  return data;
}

export async function createBooking(payload: {
  flight_id: number;
  cabin_class: string;
  passengers: PassengerInput[];
  seats: string[];
  contact_email?: string;
  contact_phone?: string;
}): Promise<BookingResponse> {
  const { data } = await api.post('/bookings', payload);
  return data;
}

export async function getBooking(bookingId: number) {
  const { data } = await api.get(`/bookings/${bookingId}`);
  return data.booking;
}
